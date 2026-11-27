/**
 * web/push/web-push-service.ts – outbound Web Push delivery helpers.
 */

import { createPrivateKey } from "node:crypto";

import { getWebRuntimeConfig } from "../../../core/config.js";
import type { InteractionRow } from "../../../db.js";
import { createLogger } from "../../../utils/logger.js";
import {
  ensureStoredVapidKeys,
  listStoredWebPushSubscriptions,
  removeStoredWebPushSubscription,
  type StoredWebPushSubscription,
} from "./web-push-store.js";
import {
  webNotificationPresenceService,
  type WebNotificationPresenceService,
} from "./web-notification-presence-service.js";

const log = createLogger("web.push.service");
const DEFAULT_WEB_PUSH_REQUEST_TIMEOUT_MS = 15_000;
const AUTH_FAILURE_PRUNE_THRESHOLD = 3;
const SETUP_BREAKER_COOLDOWN_MS = 5 * 60 * 1000;
const DELIVERY_BREAKER_COOLDOWN_MS = 2 * 60 * 1000;

// Never emit a relay's arbitrary response text or a transport's raw error.
const SAFE_RELAY_ERROR_CODES = new Set([
  "BadJwtToken", "BadVapidPublicKey", "VapidPkHashMismatch", "BadPath", "MethodNotAllowed", "PayloadTooLarge",
  "BadWebPushRequest", "BadTtl", "BadUrgency", "Unregistered", "TooManyRequests",
  "UNREGISTERED", "PERMISSION_DENIED", "INVALID_ARGUMENT", "RESOURCE_EXHAUSTED", "UNAVAILABLE",
]);
const SAFE_NETWORK_ERROR_CODES = new Set([
  "ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EHOSTUNREACH", "ENETUNREACH",
  "CERT_HAS_EXPIRED", "UNABLE_TO_VERIFY_LEAF_SIGNATURE", "ERR_TLS_CERT_ALTNAME_INVALID", "UND_ERR_CONNECT_TIMEOUT",
]);

type WebPushRelay = "apple" | "google" | "mozilla" | "other";
type ReplyDeliveryTrace = (outcome: "skipped" | "failed" | "accepted", fields: {
  relay?: WebPushRelay;
  reason?: string;
  statusCode?: number;
  relayErrorCode?: string;
  networkErrorCode?: string;
}) => void;

type WebPushBreakerState = {
  reason: Error;
  untilMs: number;
};

let disabledStoredWebPushSetupState: WebPushBreakerState | null = null;
const disabledStoredWebPushDeliveryStateByEndpoint = new Map<string, WebPushBreakerState>();
const authFailureCountsByEndpoint = new Map<string, number>();

export interface WebPushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  sourceLabel?: string;
}

export interface StoredWebPushSendResult {
  attempted: number;
  sent: number;
  removed: number;
  failed: number;
}

export interface SendStoredWebPushNotificationOptions {
  baseDir?: string;
  vapidSubject?: string;
  chatJid?: string;
  targetDeviceId?: string;
  ttl?: number;
  urgency?: "very-low" | "low" | "normal" | "high";
  sendNotification?: (
    subscription: StoredWebPushSubscription,
    payload: string,
    options: {
      TTL: number;
      urgency: "very-low" | "low" | "normal" | "high";
      vapidDetails: {
        subject: string;
        publicKey: string;
        privateKey: string;
      };
    },
  ) => Promise<unknown>;
  generateRequestDetails?: (
    subscription: StoredWebPushSubscription,
    payload: string,
    options: {
      TTL: number;
      urgency: "very-low" | "low" | "normal" | "high";
      vapidDetails: {
        subject: string;
        publicKey: string;
        privateKey: string;
      };
    },
  ) => GeneratedWebPushRequestDetails;
  fetchImpl?: typeof fetch;
  presenceService?: WebNotificationPresenceService;
}

export interface GeneratedWebPushRequestDetails {
  endpoint: string;
  method?: string;
  headers?: Record<string, string | number>;
  body?: BodyInit | null;
  timeout?: number;
}

function resolvePushPath(url: string | undefined): string {
  const value = typeof url === "string" ? url.trim() : "";
  if (!value) return "/";
  if (value.startsWith("/")) return value;
  return `/${value}`;
}

function normalizePayload(payload: WebPushNotificationPayload): WebPushNotificationPayload {
  const title = typeof payload?.title === "string" && payload.title.trim()
    ? payload.title.trim()
    : "PiClaw";
  const body = typeof payload?.body === "string" && payload.body.trim()
    ? payload.body.trim()
    : "You have a new update.";
  const tag = typeof payload?.tag === "string" && payload.tag.trim()
    ? payload.tag.trim()
    : "piclaw";
  const sourceLabel = typeof payload?.sourceLabel === "string" && payload.sourceLabel.trim()
    ? payload.sourceLabel.trim()
    : undefined;
  return {
    title,
    body,
    tag,
    url: resolvePushPath(payload?.url),
    ...(sourceLabel ? { sourceLabel } : {}),
  };
}

function getDefaultVapidSubject(): string {
  const configuredSubject = String(getWebRuntimeConfig().pushVapidSubject || "").trim();
  return configuredSubject || "mailto:notifications@localhost.invalid";
}

function getStoredVapidDetails(baseDir?: string, vapidSubject?: string): {
  subject: string;
  publicKey: string;
  privateKey: string;
} {
  const keys = ensureStoredVapidKeys(baseDir);
  const privateJwk = createPrivateKey(keys.privateKeyPem).export({ format: "jwk" }) as JsonWebKey;
  const privateKey = typeof privateJwk.d === "string" ? privateJwk.d : "";
  if (!privateKey) {
    throw new Error("Stored VAPID key is missing the private key scalar.");
  }

  return {
    subject: typeof vapidSubject === "string" && vapidSubject.trim() ? vapidSubject.trim() : getDefaultVapidSubject(),
    publicKey: keys.publicKey,
    privateKey,
  };
}

function classifyWebPushRelay(endpoint: string): WebPushRelay {
  try {
    const host = new URL(endpoint).hostname.toLowerCase().replace(/\.$/, "");
    if (host === "push.apple.com" || host.endsWith(".push.apple.com")) return "apple";
    if (host === "fcm.googleapis.com" || host === "android.googleapis.com") return "google";
    if (host === "push.services.mozilla.com" || host.endsWith(".push.services.mozilla.com")) return "mozilla";
  } catch {
    // Do not log unrecognized or malformed endpoints.
  }
  return "other";
}

function getHttpStatusCode(error: unknown): number | undefined {
  const rawStatus = (error as { statusCode?: unknown } | null)?.statusCode;
  const status = typeof rawStatus === "string" ? Number(rawStatus) : rawStatus;
  return typeof status === "number" && Number.isInteger(status) && status >= 100 && status <= 599
    ? status
    : undefined;
}

function getSafeRelayErrorCode(body: unknown): string | undefined {
  if (typeof body !== "string" || body.length > 8192) return undefined;
  try {
    const parsed = JSON.parse(body);
    const code: unknown = parsed?.reason ?? parsed?.error?.status;
    return typeof code === "string" && SAFE_RELAY_ERROR_CODES.has(code) ? code : undefined;
  } catch {
    return undefined;
  }
}

function describeDeliveryFailure(error: unknown, requestDispatched: boolean) {
  const statusCode = getHttpStatusCode(error);
  if (statusCode !== undefined) {
    return {
      reason: "http_error",
      statusCode,
      relayErrorCode: getSafeRelayErrorCode((error as { body?: unknown })?.body),
    };
  }
  if (!requestDispatched) return { reason: "request_generation_error" };

  const transportError = error as { name?: unknown; code?: unknown; cause?: { code?: unknown } } | null;
  const code = [transportError?.code, transportError?.cause?.code]
    .find((value): value is string => typeof value === "string" && SAFE_NETWORK_ERROR_CODES.has(value));
  const timeout = transportError?.name === "AbortError" || transportError?.name === "TimeoutError"
    || code === "ETIMEDOUT" || code === "UND_ERR_CONNECT_TIMEOUT";
  return { reason: timeout ? "timeout" : "network_error", networkErrorCode: code };
}

function getActiveBreaker(state: WebPushBreakerState | null): WebPushBreakerState | null {
  if (!state) return null;
  if (Date.now() < state.untilMs) return state;
  return null;
}

function getActiveDeliveryBreaker(endpoint: string): WebPushBreakerState | null {
  const state = disabledStoredWebPushDeliveryStateByEndpoint.get(endpoint) || null;
  const active = getActiveBreaker(state);
  if (!active && state) {
    disabledStoredWebPushDeliveryStateByEndpoint.delete(endpoint);
  }
  return active;
}

function tripStoredWebPushSetupBreaker(error: unknown): void {
  const reason = error instanceof Error ? error : new Error(String(error || "Unknown web push setup failure"));
  if (getActiveBreaker(disabledStoredWebPushSetupState)) return;
  disabledStoredWebPushSetupState = {
    reason,
    untilMs: Date.now() + SETUP_BREAKER_COOLDOWN_MS,
  };
  log.warn("Disabled stored web push delivery after a fatal setup failure.", {
    cooldownMs: SETUP_BREAKER_COOLDOWN_MS,
  });
}

function tripStoredWebPushDeliveryBreaker(subscription: StoredWebPushSubscription, error: unknown): void {
  const reason = error instanceof Error ? error : new Error(String(error || "Unknown web push delivery failure"));
  if (getActiveDeliveryBreaker(subscription.endpoint)) return;
  disabledStoredWebPushDeliveryStateByEndpoint.set(subscription.endpoint, {
    reason,
    untilMs: Date.now() + DELIVERY_BREAKER_COOLDOWN_MS,
  });
  log.warn("Temporarily disabled stored web push delivery after repeated delivery failures.", {
    cooldownMs: DELIVERY_BREAKER_COOLDOWN_MS,
    relay: classifyWebPushRelay(subscription.endpoint),
    statusCode: getHttpStatusCode(error),
  });
}

async function loadGenerateRequestDetailsImpl(): Promise<NonNullable<SendStoredWebPushNotificationOptions["generateRequestDetails"]>> {
  const mod = await import("web-push");
  const api = (mod as Record<string, any>).default && typeof (mod as Record<string, any>).default === "object"
    ? (mod as Record<string, any>).default
    : mod;
  const generateRequestDetails = api?.generateRequestDetails;
  if (typeof generateRequestDetails !== "function") {
    throw new Error("web-push generateRequestDetails is unavailable.");
  }
  return generateRequestDetails.bind(api);
}

function normalizeRequestHeaders(headers: GeneratedWebPushRequestDetails["headers"]): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers || {})) {
    const normalizedKey = String(key || "").trim();
    if (!normalizedKey) continue;
    if (normalizedKey.toLowerCase() === "content-length") continue;
    normalized[normalizedKey] = String(value);
  }
  return normalized;
}

async function dispatchGeneratedWebPushRequest(
  requestDetails: GeneratedWebPushRequestDetails,
  fetchImpl: typeof fetch = fetch,
): Promise<number> {
  const controller = typeof AbortController !== "undefined" && Number.isFinite(requestDetails.timeout) && Number(requestDetails.timeout) > 0
    ? new AbortController()
    : null;
  const timeoutMs = Number.isFinite(requestDetails.timeout) && Number(requestDetails.timeout) > 0
    ? Number(requestDetails.timeout)
    : DEFAULT_WEB_PUSH_REQUEST_TIMEOUT_MS;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  try {
    const response = await fetchImpl(requestDetails.endpoint, {
      method: requestDetails.method || "POST",
      headers: normalizeRequestHeaders(requestDetails.headers),
      body: requestDetails.body ?? undefined,
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (response.ok) return response.status;

    const body = await response.text().catch(() => "");
    throw Object.assign(new Error(`Received unexpected response code: ${response.status}`), {
      statusCode: response.status,
      body,
    });
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function isExpiredSubscriptionError(error: unknown): boolean {
  const statusCode = Number((error as { statusCode?: unknown } | null)?.statusCode);
  return statusCode === 404 || statusCode === 410;
}

function isAuthRejectedSubscriptionError(error: unknown): boolean {
  const statusCode = Number((error as { statusCode?: unknown } | null)?.statusCode);
  return statusCode === 401 || statusCode === 403;
}

function isPotentialSystemicDeliveryError(error: unknown): boolean {
  return !isExpiredSubscriptionError(error) && !isAuthRejectedSubscriptionError(error);
}

function clearSubscriptionFailureState(subscription: StoredWebPushSubscription): void {
  authFailureCountsByEndpoint.delete(subscription.endpoint);
}

function shouldPruneSubscriptionAfterAuthFailure(subscription: StoredWebPushSubscription): boolean {
  const nextCount = (authFailureCountsByEndpoint.get(subscription.endpoint) ?? 0) + 1;
  authFailureCountsByEndpoint.set(subscription.endpoint, nextCount);
  return nextCount >= AUTH_FAILURE_PRUNE_THRESHOLD;
}

function buildReplyNotificationBody(interaction: InteractionRow): string {
  const content = String(interaction?.data?.content || "").trim();
  if (content) {
    return content.replace(/\s+/g, " ").slice(0, 200);
  }
  const contentBlocks = Array.isArray(interaction?.data?.content_blocks)
    ? interaction.data.content_blocks
    : [];
  if (contentBlocks.length > 0) {
    return "Sent an attachment.";
  }
  return "You have a new reply.";
}

export function buildStoredAgentReplyWebPushNotification(interaction: InteractionRow): WebPushNotificationPayload | null {
  if (!interaction || typeof interaction !== "object") return null;
  const chatJid = typeof interaction.chat_jid === "string" ? interaction.chat_jid.trim() : "";
  if (!chatJid) return null;
  const rowId = Number(interaction.id);
  const suffix = rowId > 0 ? `#msg-${rowId}` : "";
  return {
    title: "PiClaw reply",
    body: buildReplyNotificationBody(interaction),
    url: `/?chat_jid=${encodeURIComponent(chatJid)}${suffix}`,
    tag: `piclaw:reply:${encodeURIComponent(chatJid)}`,
    sourceLabel: "Web Push",
  };
}

export async function sendStoredAgentReplyWebPushNotification(
  interaction: InteractionRow,
  options: SendStoredWebPushNotificationOptions = {},
): Promise<StoredWebPushSendResult> {
  const replyId = interaction?.id;
  const trace: ReplyDeliveryTrace | undefined = getWebRuntimeConfig().pushDeliveryDiagnostics
    ? (outcome, fields) => {
        try {
          log.info("Stored reply Web Push outcome.", {
            operation: "web.push.reply_delivery",
            replyId: Number.isSafeInteger(replyId) ? replyId : undefined,
            outcome,
            ...fields,
          });
        } catch {
          // Diagnostics must not change delivery outcomes.
        }
      }
    : undefined;
  try {
    const payload = buildStoredAgentReplyWebPushNotification(interaction);
    if (!payload) {
      trace?.("skipped", { reason: "no_payload" });
      return { attempted: 0, sent: 0, removed: 0, failed: 0 };
    }
    return await sendStoredWebPush(payload, {
      ...options,
      chatJid: typeof interaction.chat_jid === "string" ? interaction.chat_jid.trim() : options.chatJid,
    }, trace);
  } catch (error) {
    trace?.("failed", { reason: "dispatch_error" });
    throw error;
  }
}

export function sendStoredWebPushNotification(
  payload: WebPushNotificationPayload,
  options: SendStoredWebPushNotificationOptions = {},
): Promise<StoredWebPushSendResult> {
  return sendStoredWebPush(payload, options);
}

async function sendStoredWebPush(
  payload: WebPushNotificationPayload,
  options: SendStoredWebPushNotificationOptions,
  trace?: ReplyDeliveryTrace,
): Promise<StoredWebPushSendResult> {
  const subscriptions = listStoredWebPushSubscriptions(options.baseDir);
  if (subscriptions.length === 0) {
    trace?.("skipped", { reason: "no_subscriptions" });
    return { attempted: 0, sent: 0, removed: 0, failed: 0 };
  }
  if (getActiveBreaker(disabledStoredWebPushSetupState)) {
    trace?.("skipped", { reason: "setup_breaker_active" });
    return { attempted: 0, sent: 0, removed: 0, failed: 0 };
  }

  const normalizedPayload = normalizePayload(payload);
  const serializedPayload = JSON.stringify(normalizedPayload);
  let requestOptions: {
    TTL: number;
    urgency: "very-low" | "low" | "normal" | "high";
    vapidDetails: {
      subject: string;
      publicKey: string;
      privateKey: string;
    };
  };
  let generateRequestDetails: NonNullable<SendStoredWebPushNotificationOptions["generateRequestDetails"]> | null;
  try {
    const vapidDetails = getStoredVapidDetails(options.baseDir, options.vapidSubject);
    requestOptions = {
      TTL: Number.isFinite(options.ttl) ? Number(options.ttl) : 60,
      urgency: options.urgency || "normal",
      vapidDetails,
    };
    generateRequestDetails = options.sendNotification
      ? null
      : (options.generateRequestDetails || await loadGenerateRequestDetailsImpl());
  } catch (error) {
    tripStoredWebPushSetupBreaker(error);
    trace?.("skipped", { reason: "setup_failed" });
    return { attempted: 0, sent: 0, removed: 0, failed: 0 };
  }
  const presenceService = options.presenceService || webNotificationPresenceService;

  const eligibleSubscriptions = subscriptions.filter((subscription) => {
    if (typeof options.targetDeviceId === "string" && options.targetDeviceId.trim() && subscription.deviceId !== options.targetDeviceId.trim()) {
      trace?.("skipped", { relay: classifyWebPushRelay(subscription.endpoint), reason: "target_device_mismatch" });
      return false;
    }
    if (getActiveDeliveryBreaker(subscription.endpoint)) {
      trace?.("skipped", { relay: classifyWebPushRelay(subscription.endpoint), reason: "delivery_breaker_active" });
      return false;
    }
    const reason = presenceService.getWebPushSuppressionReason(subscription.deviceId, options.chatJid);
    if (reason) {
      trace?.("skipped", { relay: classifyWebPushRelay(subscription.endpoint), reason });
      return false;
    }
    return true;
  });

  const outcomes = await Promise.all(eligibleSubscriptions.map(async (subscription) => {
    let requestDispatched = false;
    try {
      let statusCode: number | undefined;
      if (options.sendNotification) {
        requestDispatched = true;
        await options.sendNotification(subscription, serializedPayload, requestOptions);
      } else if (generateRequestDetails) {
        const requestDetails = generateRequestDetails(subscription, serializedPayload, requestOptions);
        requestDispatched = true;
        statusCode = await dispatchGeneratedWebPushRequest(requestDetails, options.fetchImpl || fetch);
      }
      clearSubscriptionFailureState(subscription);
      trace?.("accepted", { relay: classifyWebPushRelay(subscription.endpoint), statusCode });
      return { attempted: 1, sent: 1, removed: 0, failed: 0, systemicError: null as Error | null };
    } catch (error) {
      trace?.("failed", {
        relay: classifyWebPushRelay(subscription.endpoint),
        ...describeDeliveryFailure(error, requestDispatched),
      });
      if (isExpiredSubscriptionError(error)) {
        clearSubscriptionFailureState(subscription);
        if (removeStoredWebPushSubscription(subscription.endpoint, options.baseDir)) {
          log.info("Removed expired web push subscription after delivery failure.", {
            relay: classifyWebPushRelay(subscription.endpoint),
            statusCode: getHttpStatusCode(error),
          });
          return { attempted: 1, sent: 0, removed: 1, failed: 0, systemicError: null as Error | null };
        }
      } else if (isAuthRejectedSubscriptionError(error) && shouldPruneSubscriptionAfterAuthFailure(subscription)) {
        if (removeStoredWebPushSubscription(subscription.endpoint, options.baseDir)) {
          log.info("Removed rejected web push subscription after repeated auth failures.", {
            relay: classifyWebPushRelay(subscription.endpoint),
            statusCode: getHttpStatusCode(error),
            threshold: AUTH_FAILURE_PRUNE_THRESHOLD,
          });
          authFailureCountsByEndpoint.delete(subscription.endpoint);
          return { attempted: 1, sent: 0, removed: 1, failed: 0, systemicError: null as Error | null };
        }
      }

      const normalizedError = error instanceof Error
        ? error
        : new Error(typeof (error as { message?: unknown } | null)?.message === "string"
            ? String((error as { message: string }).message)
            : "Web push delivery failed.");
      log.debug("Web push delivery failed for a stored subscription.", {
        relay: classifyWebPushRelay(subscription.endpoint),
        statusCode: getHttpStatusCode(error),
        suppressed: true,
      });
      return {
        attempted: 1,
        sent: 0,
        removed: 0,
        failed: 1,
        systemicError: isPotentialSystemicDeliveryError(error) ? normalizedError : null,
      };
    }
  }));

  const attempted = outcomes.reduce((total, entry) => total + entry.attempted, 0);
  const sent = outcomes.reduce((total, entry) => total + entry.sent, 0);
  const removed = outcomes.reduce((total, entry) => total + entry.removed, 0);
  const failed = outcomes.reduce((total, entry) => total + entry.failed, 0);
  const systemicFailures = outcomes
    .map((entry) => entry.systemicError)
    .filter(Boolean) as Error[];

  if (attempted > 0 && sent === 0 && removed === 0 && failed === attempted && systemicFailures.length === eligibleSubscriptions.length) {
    for (let index = 0; index < eligibleSubscriptions.length; index += 1) {
      const subscription = eligibleSubscriptions[index];
      const error = systemicFailures[index];
      if (subscription && error) {
        tripStoredWebPushDeliveryBreaker(subscription, error);
      }
    }
  }

  return {
    attempted,
    sent,
    removed,
    failed,
  };
}

/**
 * web/push/web-push-routes.ts – HTTP handlers for Web Push subscriptions and notification presence.
 */

import {
  getStoredVapidPublicKey,
  listStoredWebPushSubscriptions,
  removeStoredWebPushSubscription,
  upsertStoredWebPushSubscription,
} from "./web-push-store.js";
import {
  webNotificationPresenceService,
  type WebNotificationPresenceService,
} from "./web-notification-presence-service.js";

function resolveUserAgent(req: Request): string | null {
  const value = req.headers.get("user-agent");
  return value && value.trim() ? value.trim() : null;
}

function resolveDeviceId(value: unknown): string | null {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || null;
}

export async function handleWebPushVapidPublicKey(options: { baseDir?: string } = {}): Promise<Response> {
  return Response.json({ publicKey: getStoredVapidPublicKey(options.baseDir) });
}

export async function handleWebPushSubscriptionUpsert(req: Request, options: { baseDir?: string } = {}): Promise<Response> {
  try {
    const body = await req.json().catch(() => null);
    const subscription = body && typeof body === "object" && body.subscription ? body.subscription : body;
    const stored = upsertStoredWebPushSubscription(subscription, {
      baseDir: options.baseDir,
      userAgent: resolveUserAgent(req),
      deviceId: resolveDeviceId((body as Record<string, unknown> | null)?.device_id ?? (body as Record<string, unknown> | null)?.deviceId),
    });
    return Response.json({ ok: true, device_id: stored.deviceId });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invalid push subscription." }, { status: 400 });
  }
}

/** Report whether Web Push owns delivery for this browser profile, without returning subscription details. */
export async function handleWebPushSubscriptionStatus(req: Request, options: { baseDir?: string } = {}): Promise<Response> {
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  const deviceId = resolveDeviceId(body?.device_id ?? body?.deviceId);
  if (!deviceId) return Response.json({ error: "Missing notification device ID." }, { status: 400 });

  const subscribed = listStoredWebPushSubscriptions(options.baseDir).some((subscription) => subscription.deviceId === deviceId);
  return Response.json({ subscribed }, { headers: { "Cache-Control": "no-store" } });
}

export async function handleWebPushSubscriptionDelete(req: Request, options: { baseDir?: string } = {}): Promise<Response> {
  const body = await req.json().catch(() => null);
  const subscription = body && typeof body === "object" && body.subscription ? body.subscription : body;
  const endpoint = typeof subscription?.endpoint === "string"
    ? subscription.endpoint.trim()
    : typeof body?.endpoint === "string"
      ? body.endpoint.trim()
      : "";

  if (!endpoint) {
    return Response.json({ error: "Missing push subscription endpoint." }, { status: 400 });
  }

  const removed = removeStoredWebPushSubscription(endpoint, options.baseDir);
  return Response.json({ ok: true, removed });
}

export async function handleWebPushPresence(
  req: Request,
  options: { presenceService?: WebNotificationPresenceService } = {},
): Promise<Response> {
  try {
    const body = await req.json().catch(() => null);
    const payload = body && typeof body === "object" ? body as Record<string, unknown> : null;
    if (!payload) {
      return Response.json({ error: "Invalid web notification presence payload." }, { status: 400 });
    }

    const presenceService = options.presenceService || webNotificationPresenceService;
    if (payload.active === false) {
      const removed = presenceService.remove(payload);
      return Response.json({ ok: true, active: false, removed });
    }

    const stored = presenceService.upsert(payload);
    return Response.json({
      ok: true,
      active: true,
      device_id: stored.deviceId,
      client_id: stored.clientId,
      chat_jid: stored.chatJid,
      visibility_state: stored.visibilityState,
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invalid web notification presence payload." }, { status: 400 });
  }
}

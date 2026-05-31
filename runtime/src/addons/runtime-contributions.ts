import { pathToFileURL } from "node:url";

import { createMedia, getMediaById } from "../db/media.js";
import { postMessagesToolMessage } from "../extensions/messages-crud.js";
import { getInstalledAddonRuntimeEntryPaths } from "./manifest-discovery.js";
import { resetRuntimeStreamSessionsForTests, runtimeStreamSessions } from "./runtime-stream-sessions.js";

export interface AddonStatusPanelProvider {
  key: string;
  getPayload: (chatJid: string) => Promise<unknown> | unknown;
  runAction?: (action: string, payload: Record<string, unknown>) => Promise<unknown> | unknown;
}

export interface AddonAdaptiveCardIntentContext {
  chatJid: string;
  threadId?: string | null;
  sourcePostId?: number | null;
  rawSubmissionData: Record<string, unknown>;
  sendMessage: (content: string, options?: { threadId?: string | null }) => Promise<void>;
}

export type AddonAdaptiveCardIntentHandler = (context: AddonAdaptiveCardIntentContext) => Promise<void> | void;

export interface PiclawRuntimeAddonApi {
  registerStatusPanelProvider: (provider: AddonStatusPanelProvider) => () => void;
  registerAdaptiveCardIntentHandler: (intent: string, handler: AddonAdaptiveCardIntentHandler) => () => void;
  createMedia: typeof createMedia;
  getMediaById: typeof getMediaById;
  postMessage: typeof postMessagesToolMessage;
  streamSessions: typeof runtimeStreamSessions;
}

type RuntimeGlobal = typeof globalThis & {
  __piclaw_runtime?: PiclawRuntimeAddonApi;
  __piclaw_autoresearch_runtime_registered__?: boolean;
};

const statusPanelProviders = new Map<string, AddonStatusPanelProvider>();
const adaptiveCardIntentHandlers = new Map<string, AddonAdaptiveCardIntentHandler>();
let runtimeApiInstalled = false;
let runtimeEntriesLoadPromise: Promise<void> | null = null;

export {
  getAddonNonWebCommandPolicies,
  getAddonRecoveryExcludedChatJidPrefixes,
  getInstalledAddonRuntimeEntryPaths,
} from "./manifest-discovery.js";

export function registerAddonStatusPanelProvider(provider: AddonStatusPanelProvider): () => void {
  if (!provider || typeof provider.key !== "string" || !provider.key.trim() || typeof provider.getPayload !== "function") {
    return () => {};
  }

  const normalizedKey = provider.key.trim();
  const normalizedProvider = { ...provider, key: normalizedKey };
  statusPanelProviders.set(normalizedKey, normalizedProvider);
  return () => {
    if (statusPanelProviders.get(normalizedKey) === normalizedProvider) {
      statusPanelProviders.delete(normalizedKey);
    }
  };
}

export function registerAddonAdaptiveCardIntentHandler(intent: string, handler: AddonAdaptiveCardIntentHandler): () => void {
  const normalizedIntent = typeof intent === "string" ? intent.trim() : "";
  if (!normalizedIntent || typeof handler !== "function") return () => {};
  adaptiveCardIntentHandlers.set(normalizedIntent, handler);
  return () => {
    if (adaptiveCardIntentHandlers.get(normalizedIntent) === handler) {
      adaptiveCardIntentHandlers.delete(normalizedIntent);
    }
  };
}

export function installAddonRuntimeApi(): PiclawRuntimeAddonApi {
  const runtimeGlobal = globalThis as RuntimeGlobal;
  if (runtimeApiInstalled && runtimeGlobal.__piclaw_runtime) {
    return runtimeGlobal.__piclaw_runtime;
  }

  const api: PiclawRuntimeAddonApi = {
    registerStatusPanelProvider: registerAddonStatusPanelProvider,
    registerAdaptiveCardIntentHandler: registerAddonAdaptiveCardIntentHandler,
    createMedia,
    getMediaById,
    postMessage: postMessagesToolMessage,
    streamSessions: runtimeStreamSessions,
  };

  runtimeGlobal.__piclaw_runtime = api;
  runtimeApiInstalled = true;
  return api;
}

export async function ensureAddonRuntimeEntriesLoaded(): Promise<void> {
  installAddonRuntimeApi();
  if (runtimeEntriesLoadPromise) return runtimeEntriesLoadPromise;

  const entryPaths = getInstalledAddonRuntimeEntryPaths();
  runtimeEntriesLoadPromise = (async () => {
    for (const entryPath of entryPaths) {
      await import(pathToFileURL(entryPath).href);
    }
  })().catch((error) => {
    runtimeEntriesLoadPromise = null;
    throw error;
  });

  await runtimeEntriesLoadPromise;
}

export async function getAddonStatusPanelPayload(key: string, chatJid: string): Promise<unknown | null> {
  await ensureAddonRuntimeEntriesLoaded();
  const provider = statusPanelProviders.get(String(key || "").trim());
  if (!provider) return null;
  return await provider.getPayload(chatJid);
}

export async function runAddonStatusPanelAction(
  key: string,
  action: string,
  payload: Record<string, unknown>,
): Promise<unknown | null> {
  await ensureAddonRuntimeEntriesLoaded();
  const provider = statusPanelProviders.get(String(key || "").trim());
  if (!provider?.runAction) return null;
  return await provider.runAction(String(action || "").trim(), payload);
}

export async function runAddonAdaptiveCardIntent(
  intent: string,
  context: AddonAdaptiveCardIntentContext,
): Promise<boolean> {
  await ensureAddonRuntimeEntriesLoaded();
  const handler = adaptiveCardIntentHandlers.get(String(intent || "").trim());
  if (!handler) return false;
  await handler(context);
  return true;
}

export function resetAddonRuntimeContributionsForTests(): void {
  statusPanelProviders.clear();
  adaptiveCardIntentHandlers.clear();
  resetRuntimeStreamSessionsForTests();
  runtimeEntriesLoadPromise = null;
  runtimeApiInstalled = false;
  const runtimeGlobal = globalThis as RuntimeGlobal;
  delete runtimeGlobal.__piclaw_runtime;
  delete runtimeGlobal.__piclaw_autoresearch_runtime_registered__;
}

import type { TelegramConfig } from "./storage.ts";

export interface TelegramAddonRuntimeState {
  connected: boolean;
  botId: number | null;
  botUsername: string | null;
  lastError: string | null;
  lastEventAt: string | null;
}

type ExtensionKvStore = {
  get<T = unknown>(extensionId: string, key: string, scope?: string, scopeKey?: string): T | null;
  set(extensionId: string, key: string, value: unknown, scope?: string, scopeKey?: string): void;
};

export type TelegramRuntimeInterop = {
  getAssistantName?: () => string;
  getExtensionKvStore?: () => ExtensionKvStore;
  registerChannelDetector?: (detector: (chatJid: string) => string | null) => () => void;
  registerChannelTransport?: (
    channel: string,
    transport: {
      sendMessage(chatJid: string, text: string, options?: unknown): Promise<void> | void;
      setTyping?(chatJid: string, isTyping: boolean): Promise<void> | void;
    },
  ) => () => void;
  postMessage?: (
    chatJid: string,
    content: string,
    options?: {
      source?: string;
      messageId?: string;
      sender?: string;
      senderName?: string;
      timestamp?: string;
      mediaIds?: number[];
      contentBlocks?: Array<Record<string, unknown>>;
      chatName?: string;
      enqueue?: boolean;
      forcePrompt?: boolean;
    },
  ) => Promise<{ messageId: string; rowId: number | null }>;
};

export type PiclawRuntimeApi = {
  createMedia?: (
    filename: string,
    contentType: string,
    data: Uint8Array,
    thumbnail: Uint8Array | null,
    metadata: Record<string, unknown> | null,
  ) => number;
  getMediaById?: (id: number) => {
    id: number;
    filename: string;
    content_type: string;
    data: Uint8Array;
    thumbnail: Uint8Array | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
  } | undefined;
};

const TELEGRAM_RUNTIME_STATE_KEY = "__piclaw_telegram_runtime_state";
let channelDetectorRegistered = false;

export function getTelegramRuntimeInterop(): TelegramRuntimeInterop | null {
  return (globalThis as { __piclawRuntimeInterop?: TelegramRuntimeInterop }).__piclawRuntimeInterop ?? null;
}

export function getPiclawRuntimeApi(): PiclawRuntimeApi | null {
  return (globalThis as { __piclaw_runtime?: PiclawRuntimeApi }).__piclaw_runtime ?? null;
}

export function readAssistantName(): string {
  return getTelegramRuntimeInterop()?.getAssistantName?.() || "Assistant";
}

export function ensureTelegramChannelDetectorRegistered(): void {
  if (channelDetectorRegistered) return;
  const interop = getTelegramRuntimeInterop();
  if (!interop?.registerChannelDetector) return;
  interop.registerChannelDetector((chatJid) => {
    const normalized = String(chatJid || "").trim().toLowerCase();
    if (normalized.startsWith("telegram:") || normalized.startsWith("tg:")) return "telegram";
    return null;
  });
  channelDetectorRegistered = true;
}

export function getTelegramRuntimeState(): TelegramAddonRuntimeState {
  const value = (globalThis as Record<string, unknown>)[TELEGRAM_RUNTIME_STATE_KEY];
  if (!value || typeof value !== "object") {
    return {
      connected: false,
      botId: null,
      botUsername: null,
      lastError: null,
      lastEventAt: null,
    };
  }
  const state = value as Partial<TelegramAddonRuntimeState>;
  return {
    connected: state.connected === true,
    botId: typeof state.botId === "number" && Number.isFinite(state.botId) ? state.botId : null,
    botUsername: typeof state.botUsername === "string" && state.botUsername.trim() ? state.botUsername.trim() : null,
    lastError: typeof state.lastError === "string" && state.lastError.trim() ? state.lastError.trim() : null,
    lastEventAt: typeof state.lastEventAt === "string" && state.lastEventAt.trim() ? state.lastEventAt.trim() : null,
  };
}

export function updateTelegramRuntimeState(patch: Partial<TelegramAddonRuntimeState>): TelegramAddonRuntimeState {
  const next = {
    ...getTelegramRuntimeState(),
    ...patch,
  } satisfies TelegramAddonRuntimeState;
  (globalThis as Record<string, unknown>)[TELEGRAM_RUNTIME_STATE_KEY] = next;
  return next;
}

export function resetTelegramRuntimeState(): void {
  delete (globalThis as Record<string, unknown>)[TELEGRAM_RUNTIME_STATE_KEY];
}

export function serializeTelegramConfig(config: TelegramConfig): Record<string, unknown> {
  return {
    enabled: config.enabled,
    botToken: config.botToken,
    pollingTimeoutSeconds: config.pollingTimeoutSeconds,
    allowedChatIds: [...config.allowedChatIds],
    triggerMode: config.triggerMode,
    unauthorizedMode: config.unauthorizedMode,
    lastUpdateId: config.lastUpdateId,
  };
}

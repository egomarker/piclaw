export const TELEGRAM_ADDON_ID = "telegram";

export type TelegramTriggerMode = "always" | "mention_or_command";
export type TelegramUnauthorizedMode = "ignore" | "reply_not_authorized";

export interface TelegramConfig {
  enabled: boolean;
  botToken: string;
  pollingTimeoutSeconds: number;
  allowedChatIds: string[];
  triggerMode: TelegramTriggerMode;
  unauthorizedMode: TelegramUnauthorizedMode;
  lastUpdateId: number;
}

export const DEFAULT_TELEGRAM_CONFIG: TelegramConfig = {
  enabled: false,
  botToken: "",
  pollingTimeoutSeconds: 30,
  allowedChatIds: [],
  triggerMode: "always",
  unauthorizedMode: "reply_not_authorized",
  lastUpdateId: 0,
};

type ExtensionKvStore = {
  get<T = unknown>(extensionId: string, key: string, scope?: string, scopeKey?: string): T | null;
  set(extensionId: string, key: string, value: unknown, scope?: string, scopeKey?: string): void;
};

function getKvStore(): ExtensionKvStore | null {
  return (globalThis as {
    __piclawRuntimeInterop?: {
      getExtensionKvStore?: () => ExtensionKvStore;
    };
  }).__piclawRuntimeInterop?.getExtensionKvStore?.() ?? null;
}

function parseBooleanEnv(value: string | undefined): boolean | undefined {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return undefined;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return undefined;
}

function normalizeAllowedChatIds(value: unknown): string[] {
  const rawValues = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[\n,]+/g)
      : [];
  return Array.from(new Set(rawValues
    .map((entry) => String(entry || "").trim())
    .filter(Boolean)));
}

function normalizeTriggerMode(value: unknown): TelegramTriggerMode {
  return value === "mention_or_command" ? "mention_or_command" : "always";
}

function normalizeUnauthorizedMode(value: unknown): TelegramUnauthorizedMode {
  return value === "ignore" ? "ignore" : "reply_not_authorized";
}

function normalizeLastUpdateId(value: unknown): number {
  const parsed = typeof value === "number"
    ? value
    : Number.parseInt(String(value || "").trim(), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0;
}

function normalizePollingTimeoutSeconds(value: unknown): number {
  const parsed = typeof value === "number"
    ? value
    : Number.parseInt(String(value || "").trim(), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_TELEGRAM_CONFIG.pollingTimeoutSeconds;
  return Math.max(5, Math.min(120, Math.trunc(parsed)));
}

function normalizeConfig(value: Partial<TelegramConfig> | null | undefined): TelegramConfig {
  return {
    enabled: value?.enabled === true,
    botToken: typeof value?.botToken === "string" ? value.botToken.trim() : "",
    pollingTimeoutSeconds: normalizePollingTimeoutSeconds(value?.pollingTimeoutSeconds),
    allowedChatIds: normalizeAllowedChatIds(value?.allowedChatIds),
    triggerMode: normalizeTriggerMode(value?.triggerMode),
    unauthorizedMode: normalizeUnauthorizedMode(value?.unauthorizedMode),
    lastUpdateId: normalizeLastUpdateId(value?.lastUpdateId),
  };
}

function loadStoredTelegramConfig(): TelegramConfig {
  const kvConfig = getKvStore()?.get<Partial<TelegramConfig>>(TELEGRAM_ADDON_ID, "config", "global") ?? null;
  return {
    ...DEFAULT_TELEGRAM_CONFIG,
    ...normalizeConfig(kvConfig),
  } satisfies TelegramConfig;
}

export function loadTelegramConfig(): TelegramConfig {
  const config = loadStoredTelegramConfig();

  const envEnabled = parseBooleanEnv(process.env.PICLAW_TELEGRAM_ENABLED);
  if (envEnabled !== undefined) config.enabled = envEnabled;

  const envBotToken = String(process.env.PICLAW_TELEGRAM_BOT_TOKEN || "").trim();
  if (envBotToken) config.botToken = envBotToken;

  if (process.env.PICLAW_TELEGRAM_POLLING_TIMEOUT) {
    config.pollingTimeoutSeconds = normalizePollingTimeoutSeconds(process.env.PICLAW_TELEGRAM_POLLING_TIMEOUT);
  }

  if (process.env.PICLAW_TELEGRAM_ALLOWED_CHAT_IDS) {
    config.allowedChatIds = normalizeAllowedChatIds(process.env.PICLAW_TELEGRAM_ALLOWED_CHAT_IDS);
  }

  if (process.env.PICLAW_TELEGRAM_TRIGGER_MODE) {
    config.triggerMode = normalizeTriggerMode(process.env.PICLAW_TELEGRAM_TRIGGER_MODE);
  }

  if (process.env.PICLAW_TELEGRAM_UNAUTHORIZED_MODE) {
    config.unauthorizedMode = normalizeUnauthorizedMode(process.env.PICLAW_TELEGRAM_UNAUTHORIZED_MODE);
  }

  return config;
}

export function saveTelegramConfig(config: TelegramConfig): TelegramConfig {
  const normalized = normalizeConfig(config);
  getKvStore()?.set(TELEGRAM_ADDON_ID, "config", normalized, "global");
  return normalized;
}

export function saveTelegramLastUpdateId(lastUpdateId: number): TelegramConfig {
  return saveTelegramConfig({
    ...loadStoredTelegramConfig(),
    lastUpdateId: normalizeLastUpdateId(lastUpdateId),
  });
}

export function mergeTelegramConfig(partial: Partial<TelegramConfig>): TelegramConfig {
  const current = loadStoredTelegramConfig();
  const next: TelegramConfig = {
    ...current,
    ...(partial.enabled !== undefined ? { enabled: partial.enabled === true } : {}),
    ...(typeof partial.botToken === "string" ? { botToken: partial.botToken.trim() } : {}),
    ...(partial.pollingTimeoutSeconds !== undefined ? { pollingTimeoutSeconds: normalizePollingTimeoutSeconds(partial.pollingTimeoutSeconds) } : {}),
    ...(partial.allowedChatIds !== undefined ? { allowedChatIds: normalizeAllowedChatIds(partial.allowedChatIds) } : {}),
    ...(partial.triggerMode !== undefined ? { triggerMode: normalizeTriggerMode(partial.triggerMode) } : {}),
    ...(partial.unauthorizedMode !== undefined ? { unauthorizedMode: normalizeUnauthorizedMode(partial.unauthorizedMode) } : {}),
    ...(partial.lastUpdateId !== undefined ? { lastUpdateId: normalizeLastUpdateId(partial.lastUpdateId) } : {}),
  };
  return saveTelegramConfig(next);
}

export function maskTelegramBotToken(token: string): string {
  const normalized = String(token || "").trim();
  if (!normalized) return "";
  return normalized.length <= 8
    ? "*".repeat(Math.max(4, normalized.length))
    : `${normalized.slice(0, 4)}…${normalized.slice(-4)}`;
}

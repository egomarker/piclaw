import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import {
  ensureTelegramChannelDetectorRegistered,
  getTelegramRuntimeState,
} from "./interop.ts";
import {
  TELEGRAM_ADDON_ID,
  loadTelegramConfig,
  maskTelegramBotToken,
  mergeTelegramConfig,
  type TelegramConfig,
  type TelegramTriggerMode,
  type TelegramUnauthorizedMode,
} from "./storage.ts";

type AddonConfigApiRegistrar = (
  addonId: string,
  action: string,
  handlers: {
    get?: (payload: unknown, req: Request) => unknown | Promise<unknown>;
    set?: (payload: unknown, req: Request) => unknown | Promise<unknown>;
  },
  extensionPath?: string,
) => "created" | "updated";

function readConfigPayload(body: Record<string, unknown>): Partial<TelegramConfig> {
  return {
    ...(typeof body.enabled === "boolean" ? { enabled: body.enabled } : {}),
    ...(body.clearBotToken === true ? { botToken: "" } : {}),
    ...(typeof body.botToken === "string" ? { botToken: body.botToken } : {}),
    ...(body.pollingTimeoutSeconds !== undefined
      ? { pollingTimeoutSeconds: body.pollingTimeoutSeconds as number }
      : body.pollingTimeout !== undefined
        ? { pollingTimeoutSeconds: body.pollingTimeout as number }
        : {}),
    ...(body.allowedChatIds !== undefined
      ? { allowedChatIds: body.allowedChatIds as string[] | string }
      : body.allowedChatIdsText !== undefined
        ? { allowedChatIds: body.allowedChatIdsText as string }
        : {}),
    ...(typeof body.triggerMode === "string" ? { triggerMode: body.triggerMode as TelegramTriggerMode } : {}),
    ...(typeof body.unauthorizedMode === "string" ? { unauthorizedMode: body.unauthorizedMode as TelegramUnauthorizedMode } : {}),
  };
}

function buildConfigResponse(config = loadTelegramConfig()): Record<string, unknown> {
  const runtimeState = getTelegramRuntimeState();
  return {
    enabled: config.enabled,
    botToken: maskTelegramBotToken(config.botToken),
    hasBotToken: Boolean(config.botToken),
    pollingTimeoutSeconds: config.pollingTimeoutSeconds,
    allowedChatIds: [...config.allowedChatIds],
    triggerMode: config.triggerMode,
    unauthorizedMode: config.unauthorizedMode,
    connected: runtimeState.connected,
    botId: runtimeState.botId,
    botUsername: runtimeState.botUsername,
    lastError: runtimeState.lastError,
    lastEventAt: runtimeState.lastEventAt,
    restartRequired: true,
  };
}

const registerAddonConfigApi = (globalThis as Record<string, unknown>).__piclaw_registerAddonConfigApi as AddonConfigApiRegistrar | undefined;
if (typeof registerAddonConfigApi === "function") {
  registerAddonConfigApi(TELEGRAM_ADDON_ID, "config", {
    get: async () => buildConfigResponse(),
    set: async (payload) => {
      const body = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
      const next = mergeTelegramConfig(readConfigPayload(body));
      return buildConfigResponse(next);
    },
  }, import.meta.dir);
}

ensureTelegramChannelDetectorRegistered();

export default function telegramAddon(_pi: ExtensionAPI): void {
  ensureTelegramChannelDetectorRegistered();
}

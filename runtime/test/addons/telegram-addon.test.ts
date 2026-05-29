import { afterEach, expect, test } from "bun:test";

import { getTelegramRuntimeState, resetTelegramRuntimeState } from "../../../addons/telegram/interop.ts";
import { loadTelegramConfig, maskTelegramBotToken } from "../../../addons/telegram/storage.ts";
import {
  buildTelegramChatJid,
  isTelegramDirectChatId,
  parseTelegramChatJid,
} from "../../../addons/telegram/telegram-targets.ts";
import { importFresh, setEnv } from "../helpers.js";

let restoreEnv: (() => void) | null = null;

afterEach(() => {
  restoreEnv?.();
  restoreEnv = null;
  resetTelegramRuntimeState();
  delete (globalThis as Record<string, unknown>).__piclaw_telegram_runtime_controller;
  delete (globalThis as Record<string, unknown>).__piclawRuntimeInterop;
});

test("telegram target helpers normalize chat IDs", () => {
  expect(buildTelegramChatJid(123456)).toBe("telegram:123456");
  expect(parseTelegramChatJid("telegram:123456")).toEqual({ chatId: "123456" });
  expect(parseTelegramChatJid("tg:123456")).toEqual({ chatId: "123456" });
  expect(isTelegramDirectChatId("123456")).toBe(true);
  expect(isTelegramDirectChatId("-100123456")).toBe(false);
});

test("telegram config reads env overrides", () => {
  restoreEnv = setEnv({
    PICLAW_TELEGRAM_ENABLED: "true",
    PICLAW_TELEGRAM_BOT_TOKEN: "1234:abcdef",
    PICLAW_TELEGRAM_POLLING_TIMEOUT: "45",
    PICLAW_TELEGRAM_ALLOWED_CHAT_IDS: "111\n222",
    PICLAW_TELEGRAM_TRIGGER_MODE: "mention_or_command",
    PICLAW_TELEGRAM_UNAUTHORIZED_MODE: "ignore",
  });

  expect(loadTelegramConfig()).toMatchObject({
    enabled: true,
    botToken: "1234:abcdef",
    pollingTimeoutSeconds: 45,
    allowedChatIds: ["111", "222"],
    triggerMode: "mention_or_command",
    unauthorizedMode: "ignore",
  });
  expect(maskTelegramBotToken("1234567890")).toBe("1234…7890");
});

test("telegram runtime entry is safe to import while disabled", async () => {
  restoreEnv = setEnv({
    PICLAW_TELEGRAM_ENABLED: "false",
    PICLAW_TELEGRAM_BOT_TOKEN: undefined,
  });

  await importFresh("../../../addons/telegram/runtime/index.ts", import.meta.url);

  expect(getTelegramRuntimeState()).toMatchObject({
    connected: false,
    lastError: null,
  });
});

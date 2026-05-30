import { afterEach, expect, test } from "bun:test";

import { getTelegramRuntimeState, resetTelegramRuntimeState } from "../../../addons/telegram/interop.ts";
import { loadTelegramConfig, maskTelegramBotToken } from "../../../addons/telegram/storage.ts";
import {
  buildTelegramChatJid,
  isTelegramDirectChatId,
  parseTelegramChatJid,
} from "../../../addons/telegram/telegram-targets.ts";
import { TelegramBotApi, TelegramChannel } from "../../../addons/telegram/telegram.ts";
import { importFresh, setEnv } from "../helpers.js";

let restoreEnv: (() => void) | null = null;
const originalFetch = globalThis.fetch;

afterEach(() => {
  restoreEnv?.();
  restoreEnv = null;
  globalThis.fetch = originalFetch;
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

test("telegram api sendMessage uses Markdown parse mode", async () => {
  const requests: Array<Record<string, unknown>> = [];
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    requests.push(JSON.parse(String(init?.body || "{}")) as Record<string, unknown>);
    return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const api = new TelegramBotApi("test-token");
  await api.sendMessage("123456", "I will *not* use `curl`.");

  expect(requests).toEqual([
    expect.objectContaining({
      chat_id: "123456",
      text: "I will *not* use `curl`.",
      parse_mode: "Markdown",
    }),
  ]);
});

test("telegram api sendMessage falls back to plain text when Markdown parsing fails", async () => {
  const requests: Array<Record<string, unknown>> = [];
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body || "{}")) as Record<string, unknown>;
    requests.push(body);
    if (requests.length === 1) {
      return new Response(JSON.stringify({ ok: false, description: "Bad Request: can't parse entities" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true, result: { message_id: 2 } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const api = new TelegramBotApi("test-token");
  await api.sendMessage("123456", "I will *not* use `curl`.");

  expect(requests).toEqual([
    expect.objectContaining({
      chat_id: "123456",
      text: "I will *not* use `curl`.",
      parse_mode: "Markdown",
    }),
    expect.objectContaining({
      chat_id: "123456",
      text: "I will *not* use `curl`.",
    }),
  ]);
  expect(requests[1]).not.toHaveProperty("parse_mode");
});

test("telegram channel renders progress replies as escaped HTML blocks", async () => {
  const channel = new TelegramChannel({
    botToken: "test",
    onUpdate: async () => {},
  }) as any;

  const calls: Array<{ type: string; chatId: string; text?: string; messageId?: number; options?: Record<string, unknown> }> = [];
  channel.api = {
    sendMessage: async (chatId: string, text: string, options?: Record<string, unknown>) => {
      calls.push({ type: "send", chatId, text, options });
      return {
        message_id: 42,
        date: 0,
        chat: { id: Number(chatId), type: "private" },
      };
    },
    editMessageText: async (chatId: string, messageId: number, text: string, options?: Record<string, unknown>) => {
      calls.push({ type: "edit", chatId, messageId, text, options });
      return {
        message_id: messageId,
        date: 0,
        chat: { id: Number(chatId), type: "private" },
      };
    },
    deleteMessage: async (chatId: string, messageId: number) => {
      calls.push({ type: "delete", chatId, messageId });
    },
  };
  channel.connected = true;

  const progress = await channel.createProgressMessage("telegram:123456", "Thinking…", {
    replyToExternalMessageId: "telegram:123456:77",
  });

  await progress.update("Thinking…\nThinking: Checking <docs> & repo\nTool: grep: runtime/src <x>");
  await progress.remove();

  expect(calls).toEqual([
    {
      type: "send",
      chatId: "123456",
      text: "<b>Thinking…</b>",
      options: {
        parseMode: "HTML",
        replyToMessageId: 77,
      },
    },
    {
      type: "edit",
      chatId: "123456",
      messageId: 42,
      text: "<b>Thinking</b>\n<blockquote>Checking &lt;docs&gt; &amp; repo</blockquote>\n\n<b>Tool call</b>\n<pre><code>grep: runtime/src &lt;x&gt;</code></pre>",
      options: {
        parseMode: "HTML",
      },
    },
    {
      type: "delete",
      chatId: "123456",
      messageId: 42,
    },
  ]);
});

test("telegram channel sends SVGs as documents and PNGs as photos", async () => {
  const channel = new TelegramChannel({
    botToken: "test",
    onUpdate: async () => {},
  }) as any;

  const calls: string[] = [];
  channel.api = {
    sendMessage: async () => {
      calls.push("text");
    },
    sendPhoto: async (_chatId: string, attachment: { filename: string }) => {
      calls.push(`photo:${attachment.filename}`);
    },
    sendDocument: async (_chatId: string, attachment: { filename: string }) => {
      calls.push(`document:${attachment.filename}`);
    },
  };
  channel.connected = true;

  await channel.sendMessage("telegram:123456", "Here you go", {
    attachments: [
      {
        filename: "chart.svg",
        contentType: "image/svg+xml",
        data: new Uint8Array([1, 2, 3]),
        kind: "image",
      },
      {
        filename: "chart.png",
        contentType: "image/png",
        data: new Uint8Array([4, 5, 6]),
        kind: "image",
      },
    ],
  });

  expect(calls).toEqual([
    "text",
    "document:chart.svg",
    "photo:chart.png",
  ]);
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

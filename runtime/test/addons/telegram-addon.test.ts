import { afterEach, expect, test } from "bun:test";

import { getTelegramRuntimeState, resetTelegramRuntimeState } from "../../../addons/telegram/interop.ts";
import { loadTelegramConfig, maskTelegramBotToken } from "../../../addons/telegram/storage.ts";
import {
  buildTelegramChatJid,
  isTelegramDirectChatId,
  parseTelegramChatJid,
} from "../../../addons/telegram/telegram-targets.ts";
import { isRecoverableTelegramNetworkError } from "../../../addons/telegram/telegram-network-errors.ts";
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

test("telegram addon allowlist includes model control command", async () => {
  const manifest = await Bun.file(new URL("../../../addons/telegram/package.json", import.meta.url)).json() as {
    pi?: {
      runtime?: {
        nonWebCommandPolicies?: Array<{ allowedCommands?: string[] }>;
      };
    };
  };
  const allowedCommands = manifest.pi?.runtime?.nonWebCommandPolicies?.flatMap((policy) => policy.allowedCommands || []) || [];

  expect(allowedCommands).toContain("model");
});

test("telegram network classifier treats transient Telegram upstream failures as recoverable", () => {
  expect(isRecoverableTelegramNetworkError(new Error("Telegram getUpdates failed: Bad Gateway"))).toBe(true);
  expect(isRecoverableTelegramNetworkError(new Error("Telegram getMe failed: Gateway Timeout"))).toBe(true);
  expect(isRecoverableTelegramNetworkError(new Error("Telegram getUpdates failed: Service Unavailable"))).toBe(true);
  expect(isRecoverableTelegramNetworkError(new Error("Telegram getUpdates failed: 429"))).toBe(true);
  expect(isRecoverableTelegramNetworkError(new Error("Telegram getUpdates failed: Forbidden"))).toBe(false);
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

test("telegram api surfaces plain-text upstream errors", async () => {
  globalThis.fetch = (async () => {
    return new Response("Bad Gateway", {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    });
  }) as typeof fetch;

  const api = new TelegramBotApi("test-token");
  await expect(api.getUpdates({})).rejects.toThrow("Bad Gateway");
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

test("telegram channel splits oversized text replies into multiple messages", async () => {
  const channel = new TelegramChannel({
    botToken: "test",
    onUpdate: async () => {},
  }) as any;

  const calls: string[] = [];
  channel.api = {
    sendMessage: async (_chatId: string, text: string) => {
      calls.push(text);
      return {
        message_id: calls.length,
        date: 0,
        chat: { id: 123456, type: "private" },
      };
    },
  };
  channel.connected = true;

  const longText = `${"A".repeat(2500)}\n${"B".repeat(2500)}\n${"C".repeat(2500)}`;
  await channel.sendMessage("telegram:123456", longText);

  expect(calls.length).toBeGreaterThan(1);
  expect(calls.every((chunk) => chunk.length <= 4000)).toBe(true);
  expect(calls.join("")).toBe(longText);
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

test("telegram pollLoop stops without rejecting on nonrecoverable errors", async () => {
  const disconnects: string[] = [];
  const channel = new TelegramChannel({
    botToken: "test",
    onUpdate: async () => {},
    onDisconnected: async (error) => {
      disconnects.push(String((error as { message?: unknown })?.message || error));
    },
  }) as any;

  channel.api = {
    getUpdates: async () => {
      throw new Error("Telegram getUpdates failed: Forbidden");
    },
  };
  channel.botUser = { id: 1, is_bot: true, username: "bot" };
  channel.connected = true;
  channel.stopped = false;

  await expect(channel.pollLoop()).resolves.toBeUndefined();
  expect(channel.connected).toBe(false);
  expect(disconnects[0]).toContain("Forbidden");
});

test("telegram runtime converts location-only messages into plain text", async () => {
  restoreEnv = setEnv({
    PICLAW_TELEGRAM_ENABLED: "false",
    PICLAW_TELEGRAM_BOT_TOKEN: undefined,
  });

  const runtime = await importFresh<typeof import("../../../addons/telegram/runtime/index.ts")>("../../../addons/telegram/runtime/index.ts", import.meta.url);
  const payload = await runtime.buildInboundPayload({} as TelegramBotApi, {
    message_id: 1,
    date: 0,
    chat: { id: 123456, type: "private" },
    location: {
      latitude: 52.1234567,
      longitude: 30.1234567,
      horizontal_accuracy: 15,
      live_period: 900,
      heading: 140,
      proximity_alert_radius: 50,
    },
  } as any);

  expect(payload).toEqual({
    content: "Location:\nlatitude: 52.1234567\nlongitude: 30.1234567\nhorizontal_accuracy: 15\nlive_period: 900\nheading: 140\nproximity_alert_radius: 50",
    mediaIds: [],
    contentBlocks: [],
  });
});

test("telegram runtime omits missing optional location fields", async () => {
  restoreEnv = setEnv({
    PICLAW_TELEGRAM_ENABLED: "false",
    PICLAW_TELEGRAM_BOT_TOKEN: undefined,
  });

  const runtime = await importFresh<typeof import("../../../addons/telegram/runtime/index.ts")>("../../../addons/telegram/runtime/index.ts", import.meta.url);
  const payload = await runtime.buildInboundPayload({} as TelegramBotApi, {
    message_id: 2,
    date: 0,
    chat: { id: 123456, type: "private" },
    location: {
      latitude: 52.1,
      longitude: 30.2,
    },
  } as any);

  expect(payload).toEqual({
    content: "Location:\nlatitude: 52.1\nlongitude: 30.2",
    mediaIds: [],
    contentBlocks: [],
  });
});

test("telegram runtime location messages force prompt in mention mode", async () => {
  restoreEnv = setEnv({
    PICLAW_TELEGRAM_ENABLED: "false",
    PICLAW_TELEGRAM_BOT_TOKEN: undefined,
  });

  const runtime = await importFresh<typeof import("../../../addons/telegram/runtime/index.ts")>("../../../addons/telegram/runtime/index.ts", import.meta.url);
  const forcePrompt = runtime.shouldForcePromptForInboundMessage({
    enabled: true,
    botToken: "1234:abcdef",
    pollingTimeoutSeconds: 45,
    allowedChatIds: ["123456"],
    triggerMode: "mention_or_command",
    unauthorizedMode: "ignore",
    lastUpdateId: 0,
  }, {
    message_id: 3,
    date: 0,
    chat: { id: 123456, type: "private" },
    location: {
      latitude: 52.1,
      longitude: 30.2,
    },
  } as any, "Location:\nlatitude: 52.1\nlongitude: 30.2", null);

  expect(forcePrompt).toBe(true);
});

test("telegram runtime non-location messages still respect mention mode", async () => {
  restoreEnv = setEnv({
    PICLAW_TELEGRAM_ENABLED: "false",
    PICLAW_TELEGRAM_BOT_TOKEN: undefined,
  });

  const runtime = await importFresh<typeof import("../../../addons/telegram/runtime/index.ts")>("../../../addons/telegram/runtime/index.ts", import.meta.url);
  const forcePrompt = runtime.shouldForcePromptForInboundMessage({
    enabled: true,
    botToken: "1234:abcdef",
    pollingTimeoutSeconds: 45,
    allowedChatIds: ["123456"],
    triggerMode: "mention_or_command",
    unauthorizedMode: "ignore",
    lastUpdateId: 0,
  }, {
    message_id: 4,
    date: 0,
    chat: { id: 123456, type: "private" },
    text: "plain hello",
  } as any, "plain hello", null);

  expect(forcePrompt).toBe(false);
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

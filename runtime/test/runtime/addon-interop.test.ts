import { afterEach, expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { importFresh, withTempWorkspaceEnv } from "../helpers.js";

afterEach(() => {
  delete (globalThis as Record<string, unknown>).__piclawRuntimeInterop;
});

function installNonWebCommandPolicyAddon(
  workspaceDir: string,
  options: {
    chatJidPrefixes?: string[];
    allowedCommands?: string[];
  } = {},
): void {
  const addonDir = join(workspaceDir, ".pi", "extensions", "node_modules", "piclaw-addon-policy-test");
  mkdirSync(addonDir, { recursive: true });
  writeFileSync(join(addonDir, "package.json"), JSON.stringify({
    name: "piclaw-addon-policy-test",
    version: "0.1.0",
    type: "module",
    pi: {
      runtime: {
        nonWebCommandPolicies: [
          {
            chatJidPrefixes: options.chatJidPrefixes ?? ["telegram:"],
            allowedCommands: options.allowedCommands ?? [],
          },
        ],
      },
    },
  }, null, 2));
}

test("installAddonRuntimeInterop self-threads inbound non-bot messages without an explicit thread", async () => {
  await withTempWorkspaceEnv("piclaw-addon-interop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const addonInterop = await importFresh<typeof import("../../src/runtime/addon-interop.js")>("../src/runtime/addon-interop.js");
    db.initDatabase();

    addonInterop.installAddonRuntimeInterop({
      queue: { enqueue: () => { throw new Error("queue should not run when enqueue=false"); } } as any,
      state: {
        chatJids: new Set<string>(),
        saveChats: () => {},
      } as any,
      agentPool: {} as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      sendMessage: async () => {},
    });

    const runtimeInterop = (globalThis as { __piclawRuntimeInterop?: { postMessage?: Function } }).__piclawRuntimeInterop;
    expect(typeof runtimeInterop?.postMessage).toBe("function");

    const result = await runtimeInterop?.postMessage?.("telegram:123", "hello from telegram", {
      source: "telegram",
      messageId: "telegram:123:1",
      sender: "123",
      senderName: "Alice",
      enqueue: false,
    });

    expect(result?.rowId).toBeGreaterThan(0);
    const interaction = db.getMessageByRowId("telegram:123", Number(result?.rowId));
    expect(interaction?.data.thread_id).toBe(result?.rowId);
  });
});

test("installAddonRuntimeInterop fast-paths inbound /steer while the chat is streaming", async () => {
  await withTempWorkspaceEnv("piclaw-addon-interop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const addonInterop = await importFresh<typeof import("../../src/runtime/addon-interop.js")>("../src/runtime/addon-interop.js");
    db.initDatabase();

    let enqueueCalls = 0;
    const markCalls: Array<{ chatJid: string; messageId: string }> = [];
    const sendCalls: Array<{ jid: string; text: string; options?: Record<string, unknown> }> = [];
    const queueStreamingCalls: Array<{ chatJid: string; text: string; behavior: string }> = [];

    addonInterop.installAddonRuntimeInterop({
      queue: { enqueue: () => { enqueueCalls += 1; } } as any,
      state: {
        chatJids: new Set<string>(),
        saveChats: () => {},
        markCommandProcessed: (chatJid: string, messageId: string) => {
          markCalls.push({ chatJid, messageId });
        },
      } as any,
      agentPool: {
        isStreaming: (chatJid: string) => chatJid === "telegram:123",
        queueStreamingMessage: async (chatJid: string, text: string, behavior: string) => {
          queueStreamingCalls.push({ chatJid, text, behavior });
          return { queued: true };
        },
      } as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      sendMessage: async (jid: string, text: string, options?: Record<string, unknown>) => {
        sendCalls.push({ jid, text, options });
      },
    });

    const runtimeInterop = (globalThis as { __piclawRuntimeInterop?: { postMessage?: Function } }).__piclawRuntimeInterop;
    const result = await runtimeInterop?.postMessage?.("telegram:123", "/steer focus on pricing", {
      source: "telegram",
      messageId: "telegram:123:2",
      sender: "123",
      senderName: "Alice",
      enqueue: true,
    });

    expect(result?.rowId).toBeGreaterThan(0);
    expect(queueStreamingCalls).toEqual([
      { chatJid: "telegram:123", text: "focus on pricing", behavior: "steer" },
    ]);
    expect(markCalls).toEqual([
      { chatJid: "telegram:123", messageId: "telegram:123:2" },
    ]);
    expect(enqueueCalls).toBe(0);
    expect(sendCalls).toEqual([]);
  });
});

test("installAddonRuntimeInterop silently drops disallowed fast-path /steer commands from addon policy", async () => {
  await withTempWorkspaceEnv("piclaw-addon-interop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async (workspace) => {
    installNonWebCommandPolicyAddon(workspace.workspace, { allowedCommands: ["state"] });

    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const addonInterop = await importFresh<typeof import("../../src/runtime/addon-interop.js")>("../src/runtime/addon-interop.js");
    db.initDatabase();

    let enqueueCalls = 0;
    const markCalls: Array<{ chatJid: string; messageId: string }> = [];
    const sendCalls: Array<{ jid: string; text: string; options?: Record<string, unknown> }> = [];
    const queueStreamingCalls: Array<{ chatJid: string; text: string; behavior: string }> = [];

    addonInterop.installAddonRuntimeInterop({
      queue: { enqueue: () => { enqueueCalls += 1; } } as any,
      state: {
        chatJids: new Set<string>(),
        saveChats: () => {},
        markCommandProcessed: (chatJid: string, messageId: string) => {
          markCalls.push({ chatJid, messageId });
        },
      } as any,
      agentPool: {
        isStreaming: (chatJid: string) => chatJid === "telegram:123",
        queueStreamingMessage: async (chatJid: string, text: string, behavior: string) => {
          queueStreamingCalls.push({ chatJid, text, behavior });
          return { queued: true };
        },
      } as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      sendMessage: async (jid: string, text: string, options?: Record<string, unknown>) => {
        sendCalls.push({ jid, text, options });
      },
    });

    const runtimeInterop = (globalThis as { __piclawRuntimeInterop?: { postMessage?: Function } }).__piclawRuntimeInterop;
    const result = await runtimeInterop?.postMessage?.("telegram:123", "/steer focus on pricing", {
      source: "telegram",
      messageId: "telegram:123:3",
      sender: "123",
      senderName: "Alice",
      enqueue: true,
    });

    expect(result?.rowId).toBeGreaterThan(0);
    expect(queueStreamingCalls).toEqual([]);
    expect(markCalls).toEqual([
      { chatJid: "telegram:123", messageId: "telegram:123:3" },
    ]);
    expect(enqueueCalls).toBe(0);
    expect(sendCalls).toEqual([]);
  });
});

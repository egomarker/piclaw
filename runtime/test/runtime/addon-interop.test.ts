import { afterEach, expect, test } from "bun:test";

import { importFresh, withTempWorkspaceEnv } from "../helpers.js";

afterEach(() => {
  delete (globalThis as Record<string, unknown>).__piclawRuntimeInterop;
});

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

import { afterEach, expect, test } from "bun:test";

import {
  registerChannelTransport,
  resetChannelTransportRegistryForTests,
} from "../../src/runtime/channel-transport-registry.js";
import { registerChannelDetector } from "../../src/router.js";

import { importFresh, withTempWorkspaceEnv } from "../helpers.js";

const noopSendMessage = async () => {};

afterEach(() => {
  resetChannelTransportRegistryForTests();
});

function makeMessage(chatJid: string, content: string, timestamp: string) {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    chat_jid: chatJid,
    sender: "user",
    sender_name: "User",
    content,
    timestamp,
    is_from_me: false,
    is_bot_message: false,
  };
}

test("processMessages leaves lastAgentTimestamp unchanged when runAgent throws", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = `wa:${Date.now()}`;
    const timestamp = "2026-04-17T01:00:00.000Z";
    db.storeMessage(makeMessage(chatJid, "@Pi hello", timestamp));

    let saveCalls = 0;
    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {
        saveCalls += 1;
      },
    };

    await expect(loop.processMessages(chatJid, {
      state: state as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        runAgent: async () => {
          throw new Error("agent crashed");
        },
      } as any,
      sendMessage: noopSendMessage,
    })).rejects.toThrow("agent crashed");

    expect(state.lastAgentTimestamp[chatJid]).toBeUndefined();
    expect(saveCalls).toBe(0);
  });
});

test("processMessages persists lastAgentTimestamp after a recovered successful agent run", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = `wa:${Date.now()}`;
    const timestamp = "2026-04-17T01:05:00.000Z";
    db.storeMessage(makeMessage(chatJid, "@Pi hello", timestamp));

    let saveCalls = 0;
    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {
        saveCalls += 1;
      },
    };

    const ok = await loop.processMessages(chatJid, {
      state: state as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        runAgent: async () => ({
          status: "success",
          result: "done",
          recovery: {
            attemptsUsed: 1,
            totalElapsedMs: 1200,
            recovered: true,
            exhausted: false,
            lastClassifier: "transient",
            strategyHistory: ["retry"],
          },
        }),
      } as any,
      sendMessage: noopSendMessage,
    });

    expect(ok).toBe(true);
    expect(state.lastAgentTimestamp[chatJid]).toBe(timestamp);
    expect(saveCalls).toBe(1);
  });
});

test("processMessages treats leading path-like slash text after trigger as a normal prompt", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = `wa:${Date.now()}`;
    const timestamp = "2026-04-17T01:03:00.000Z";
    db.storeMessage(makeMessage(chatJid, "@Pi /workspace/piclaw is the repo; mention /agent/keychain literally", timestamp));

    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {},
    };

    let prompt = "";
    const ok = await loop.processMessages(chatJid, {
      state: state as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        applySlashCommand: async () => {
          throw new Error("path-like slash text must not execute as slash command");
        },
        runAgent: async (nextPrompt: string) => {
          prompt = nextPrompt;
          return { status: "success", result: "done" };
        },
      } as any,
      sendMessage: noopSendMessage,
    });

    expect(ok).toBe(true);
    expect(prompt).toContain("/workspace/piclaw");
    expect(prompt).toContain("/agent/keychain");
  });
});

test("processMessages does not consume non-web attachments via intermediate turn callbacks", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = `telegram:${Date.now()}`;
    const timestamp = "2026-04-17T01:04:00.000Z";
    db.storeMessage(makeMessage(chatJid, "@Pi send image", timestamp));

    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {},
    };

    const sent: Array<{ text: string; options?: Record<string, unknown> }> = [];
    const attachment = {
      id: 7,
      name: "chart.png",
      contentType: "image/png",
      size: 1234,
      kind: "image",
      sourcePath: "/workspace/chart.png",
    };

    const ok = await loop.processMessages(chatJid, {
      state: state as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        runAgent: async (_prompt: string, _nextChatJid: string, options?: { onTurnComplete?: (turn: { text: string; attachments: unknown[] }) => Promise<void> | void }) => {
          expect(options?.onTurnComplete).toBeUndefined();
          return {
            status: "success",
            result: "Done — attached.",
            attachments: [attachment],
          };
        },
      } as any,
      sendMessage: async (_jid: string, text: string, options?: Record<string, unknown>) => {
        sent.push({ text, options });
      },
    });

    expect(ok).toBe(true);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.text).toContain("Done");
    expect(Array.isArray(sent[0]?.options?.attachments)).toBe(true);
    expect((sent[0]?.options?.attachments as Array<{ id: number }>)[0]?.id).toBe(7);
  });
});

test("processMessages threads transport replies under the triggering message root", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = `telegram:${Date.now()}`;
    const timestamp = "2026-04-17T01:04:15.000Z";
    const sourceRowId = db.storeMessage(makeMessage(chatJid, "@Pi hello", timestamp));

    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {},
    };

    const sent: Array<{ text: string; options?: Record<string, unknown> }> = [];
    const ok = await loop.processMessages(chatJid, {
      state: state as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        runAgent: async () => ({
          status: "success",
          result: "threaded reply",
        }),
      } as any,
      sendMessage: async (_jid: string, text: string, options?: Record<string, unknown>) => {
        sent.push({ text, options });
      },
    });

    expect(ok).toBe(true);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.text).toBe("threaded reply");
    expect(sent[0]?.options?.threadId).toBe(sourceRowId);
  });
});

test("processMessages emits typing updates for transport-backed chats", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = `telegram:${Date.now()}`;
    const timestamp = "2026-04-17T01:04:30.000Z";
    db.storeMessage(makeMessage(chatJid, "@Pi hello", timestamp));

    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {},
    };
    const typingStates: boolean[] = [];
    const unregisterDetector = registerChannelDetector((jid) => jid.startsWith("telegram:") ? "telegram" : null);

    try {
      registerChannelTransport("telegram", {
        sendMessage: async () => {},
        setTyping: async (_jid, isTyping) => {
          typingStates.push(isTyping);
        },
      });

      const ok = await loop.processMessages(chatJid, {
        state: state as any,
        assistantName: "Pi",
        triggerPattern: /@Pi/i,
        agentPool: {
          runAgent: async () => ({
            status: "success",
            result: "done",
          }),
        } as any,
        sendMessage: noopSendMessage,
      });

      await Bun.sleep(0);
      expect(ok).toBe(true);
      expect(typingStates).toContain(true);
      expect(typingStates.at(-1)).toBe(false);
    } finally {
      unregisterDetector();
    }
  });
});

test("processMessages persists lastAgentTimestamp after a successful agent run", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = `wa:${Date.now()}`;
    const timestamp = "2026-04-17T01:05:00.000Z";
    db.storeMessage(makeMessage(chatJid, "@Pi hello", timestamp));

    let saveCalls = 0;
    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {
        saveCalls += 1;
      },
    };

    const ok = await loop.processMessages(chatJid, {
      state: state as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        runAgent: async () => ({
          status: "success",
          result: "done",
        }),
      } as any,
      sendMessage: noopSendMessage,
    });

    expect(ok).toBe(true);
    expect(state.lastAgentTimestamp[chatJid]).toBe(timestamp);
    expect(saveCalls).toBe(1);
  });
});

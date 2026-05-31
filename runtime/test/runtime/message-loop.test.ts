import { afterEach, expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

test("processMessages handles transport control commands without starting an agent run", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = "telegram:123456";
    const timestamp = "2026-04-17T01:02:00.000Z";
    const sourceRowId = db.storeMessage({
      ...makeMessage(chatJid, "/tree", timestamp),
      id: "telegram:123456:76",
    });

    let saveCalls = 0;
    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {
        saveCalls += 1;
      },
    };

    const sent: Array<{ text: string; options?: Record<string, unknown> }> = [];
    let controlCalls = 0;
    const ok = await loop.processMessages(chatJid, {
      state: state as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        applyControlCommand: async () => {
          controlCalls += 1;
          return { status: "success", message: "tree ok" };
        },
        runAgent: async () => {
          throw new Error("control-only transport command must not start agent run");
        },
      } as any,
      sendMessage: async (_jid: string, text: string, options?: Record<string, unknown>) => {
        sent.push({ text, options });
      },
    }, { forcePrompt: true });

    expect(ok).toBe(true);
    expect(controlCalls).toBe(1);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.text).toBe("tree ok");
    expect(sent[0]?.options).toMatchObject({
      source: "control",
      threadId: sourceRowId,
    });
    expect(state.lastAgentTimestamp[chatJid]).toBe(timestamp);
    expect(saveCalls).toBe(1);
  });
});

test("processMessages executes transport slash commands when forcePrompt is set", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = "telegram:123456";
    const timestamp = "2026-04-17T01:02:30.000Z";
    const sourceRowId = db.storeMessage({
      ...makeMessage(chatJid, "/custom-addon arg", timestamp),
      id: "telegram:123456:77",
    });

    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {},
    };

    const sent: Array<{ text: string; options?: Record<string, unknown> }> = [];
    let invoked = "";
    const ok = await loop.processMessages(chatJid, {
      state: state as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        applyControlCommand: async () => {
          throw new Error("extension-style slash command must not route through applyControlCommand");
        },
        applySlashCommand: async (_nextChatJid: string, rawText: string) => {
          invoked = rawText;
          return { status: "success", message: "slash ok" };
        },
      } as any,
      sendMessage: async (_jid: string, text: string, options?: Record<string, unknown>) => {
        sent.push({ text, options });
      },
    }, { forcePrompt: true });

    expect(ok).toBe(true);
    expect(invoked).toBe("/custom-addon arg");
    expect(sent).toHaveLength(1);
    expect(sent[0]?.text).toBe("slash ok");
    expect(sent[0]?.options).toMatchObject({
      source: "slash-command",
      threadId: sourceRowId,
    });
    expect(state.lastAgentTimestamp[chatJid]).toBe(timestamp);
  });
});

test("processMessages silently drops disallowed non-web control commands from addon policy", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async (workspace) => {
    installNonWebCommandPolicyAddon(workspace.workspace, { allowedCommands: ["state"] });

    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = "telegram:blocked-control";
    const timestamp = "2026-04-17T01:02:45.000Z";
    db.storeMessage({
      ...makeMessage(chatJid, "/tree", timestamp),
      id: "telegram:blocked-control:1",
    });

    const sent: Array<{ text: string; options?: Record<string, unknown> }> = [];
    const ok = await loop.processMessages(chatJid, {
      state: {
        lastAgentTimestamp: {} as Record<string, string>,
        wasCommandProcessed: () => false,
        markCommandProcessed: () => {},
        saveTimestamps: () => {},
      } as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        applyControlCommand: async () => {
          throw new Error("disallowed control command must not execute");
        },
        runAgent: async () => {
          throw new Error("disallowed control command must not start agent run");
        },
      } as any,
      sendMessage: async (_jid: string, text: string, options?: Record<string, unknown>) => {
        sent.push({ text, options });
      },
    }, { forcePrompt: true });

    expect(ok).toBe(true);
    expect(sent).toEqual([]);
  });
});

test("processMessages allows control-command aliases via canonical allowlist names", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async (workspace) => {
    installNonWebCommandPolicyAddon(workspace.workspace, { allowedCommands: ["thinking"] });

    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = "telegram:allowed-alias";
    const timestamp = "2026-04-17T01:02:50.000Z";
    const sourceRowId = db.storeMessage({
      ...makeMessage(chatJid, "/effort high", timestamp),
      id: "telegram:allowed-alias:1",
    });

    const sent: Array<{ text: string; options?: Record<string, unknown> }> = [];
    let controlCalls = 0;
    const ok = await loop.processMessages(chatJid, {
      state: {
        lastAgentTimestamp: {} as Record<string, string>,
        wasCommandProcessed: () => false,
        markCommandProcessed: () => {},
        saveTimestamps: () => {},
      } as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        applyControlCommand: async () => {
          controlCalls += 1;
          return { status: "success", message: "thinking ok" };
        },
        runAgent: async () => {
          throw new Error("allowed alias must not start agent run");
        },
      } as any,
      sendMessage: async (_jid: string, text: string, options?: Record<string, unknown>) => {
        sent.push({ text, options });
      },
    }, { forcePrompt: true });

    expect(ok).toBe(true);
    expect(controlCalls).toBe(1);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.text).toBe("thinking ok");
    expect(sent[0]?.options).toMatchObject({
      source: "control",
      threadId: sourceRowId,
    });
  });
});

test("processMessages silently drops disallowed non-web slash commands from addon policy", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async (workspace) => {
    installNonWebCommandPolicyAddon(workspace.workspace, { allowedCommands: ["tasks"] });

    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = "telegram:blocked-slash";
    const timestamp = "2026-04-17T01:02:55.000Z";
    db.storeMessage({
      ...makeMessage(chatJid, "/custom-addon arg", timestamp),
      id: "telegram:blocked-slash:1",
    });

    const sent: Array<{ text: string; options?: Record<string, unknown> }> = [];
    const ok = await loop.processMessages(chatJid, {
      state: {
        lastAgentTimestamp: {} as Record<string, string>,
        wasCommandProcessed: () => false,
        markCommandProcessed: () => {},
        saveTimestamps: () => {},
      } as any,
      assistantName: "Pi",
      triggerPattern: /@Pi/i,
      agentPool: {
        applyControlCommand: async () => {
          throw new Error("blocked slash command must not route through control command handling");
        },
        applySlashCommand: async () => {
          throw new Error("disallowed slash command must not execute");
        },
      } as any,
      sendMessage: async (_jid: string, text: string, options?: Record<string, unknown>) => {
        sent.push({ text, options });
      },
    }, { forcePrompt: true });

    expect(ok).toBe(true);
    expect(sent).toEqual([]);
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

test("processMessages updates and removes transport progress placeholders", async () => {
  await withTempWorkspaceEnv("piclaw-message-loop-", { PICLAW_KEYCHAIN_KEY: "test-key" }, async () => {
    const db = await importFresh<typeof import("../../src/db.js")>("../src/db.js");
    const loop = await importFresh<typeof import("../../src/runtime/message-loop.js")>("../src/runtime/message-loop.js");
    db.initDatabase();

    const chatJid = "telegram:123456";
    const timestamp = "2026-04-17T01:04:20.000Z";
    db.storeMessage({
      ...makeMessage(chatJid, "@Pi inspect runtime", timestamp),
      id: "telegram:123456:77",
    });

    const state = {
      lastAgentTimestamp: {} as Record<string, string>,
      wasCommandProcessed: () => false,
      markCommandProcessed: () => {},
      saveTimestamps: () => {},
    };

    const created: Array<{ text: string; options?: Record<string, unknown> }> = [];
    const updates: string[] = [];
    let removed = 0;
    const unregisterDetector = registerChannelDetector((jid) => jid.startsWith("telegram:") ? "telegram" : null);

    try {
      registerChannelTransport("telegram", {
        sendMessage: async () => {},
        setTyping: async () => {},
        createProgressMessage: async (_jid, text, options) => {
          created.push({ text, options: options as Record<string, unknown> | undefined });
          return {
            update: async (nextText: string) => {
              updates.push(nextText);
            },
            remove: async () => {
              removed += 1;
            },
          };
        },
      });

      const ok = await loop.processMessages(chatJid, {
        state: state as any,
        assistantName: "Pi",
        triggerPattern: /@Pi/i,
        agentPool: {
          runAgent: async (_prompt: string, _nextChatJid: string, runOptions?: { onEvent?: (event: unknown) => void }) => {
            runOptions?.onEvent?.({
              type: "message_update",
              assistantMessageEvent: { type: "thinking_start" },
            });
            runOptions?.onEvent?.({
              type: "message_update",
              assistantMessageEvent: { type: "thinking_delta", delta: "Inspecting runtime message loop\n" },
            });
            runOptions?.onEvent?.({
              type: "message_update",
              assistantMessageEvent: { type: "thinking_end", content: "Inspecting runtime message loop" },
            });
            runOptions?.onEvent?.({
              type: "tool_execution_start",
              toolCallId: "tool-1",
              toolName: "grep",
              args: { path: "runtime/src/runtime/message-loop.ts" },
            });
            return {
              status: "success",
              result: "done",
            };
          },
        } as any,
        sendMessage: noopSendMessage,
      });

      expect(ok).toBe(true);
      expect(created).toEqual([
        {
          text: "Thinking…",
          options: { replyToExternalMessageId: "telegram:123456:77" },
        },
      ]);
      expect(updates.some((text) => text.includes("Thinking: Inspecting runtime message loop"))).toBe(true);
      expect(updates.some((text) => text.includes("Tool: grep: runtime/src/runtime/message-loop.ts"))).toBe(true);
      expect(removed).toBe(1);
    } finally {
      unregisterDetector();
    }
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

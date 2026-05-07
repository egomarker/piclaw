/**
 * test/extensions/chat-tool.test.ts – Tests for cross-session chat relay.
 */
import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { createTempWorkspace, importFresh, setEnv } from "../helpers.js";
import { withChatContext } from "../../src/core/chat-context.js";

let restoreEnv: (() => void) | null = null;

function makeFakeApi() {
  const tools = new Map<string, any>();
  return {
    api: {
      on() {},
      registerTool(tool: any) {
        tools.set(tool.name, tool);
      },
      registerCommand() {},
      registerShortcut() {},
      registerFlag() {},
      getFlag() { return undefined; },
      registerMessageRenderer() {},
      sendMessage() {},
      sendUserMessage() {},
      appendEntry() {},
      setSessionName() {},
      getSessionName() { return undefined; },
      setLabel() {},
      exec: async () => ({ exitCode: 0, stdout: "", stderr: "" }),
      getActiveTools: () => [],
      getAllTools: () => [],
      setActiveTools() {},
      getCommands: () => [],
      setModel: async () => true,
      getThinkingLevel: () => "off" as const,
      setThinkingLevel() {},
      registerProvider() {},
      unregisterProvider() {},
    } as unknown as ExtensionAPI,
    tools,
  };
}

describe("chat tool extension", () => {
  let ws: ReturnType<typeof createTempWorkspace>;
  let chatJid = "web:test";

  beforeEach(async () => {
    ws = createTempWorkspace("piclaw-chat-tool-");
    chatJid = `web:test-${Math.random().toString(36).slice(2, 10)}`;
    restoreEnv = setEnv({
      PICLAW_WORKSPACE: ws.workspace,
      PICLAW_STORE: ws.store,
      PICLAW_DATA: ws.data,
      PICLAW_DB_IN_MEMORY: "1",
    });
    const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
    db.initDatabase();
    db.storeChatMetadata(chatJid, new Date().toISOString(), "Web");
  });

  afterEach(async () => {
    try {
      const module = await importFresh<typeof import("../src/extensions/chat-tool.js")>("../src/extensions/chat-tool.js");
      module.setChatToolRelayFn(undefined);
    } catch (e) {
      // ignore cleanup import failures in teardown
      void e;
    }
    restoreEnv?.();
    restoreEnv = null;
    ws.cleanup();
  });

  async function getTool() {
    const chatToolModule = await importFresh<typeof import("../src/extensions/chat-tool.js")>("../src/extensions/chat-tool.js");
    const fake = makeFakeApi();
    chatToolModule.chatTool(fake.api);
    return {
      tool: fake.tools.get("chat")!,
      chatToolModule,
    };
  }

  test("registers the chat tool", async () => {
    const { tool } = await getTool();
    expect(tool).toBeDefined();
    expect(tool.name).toBe("chat");
  });

  test("relays to target_agent_name and strips a leading @ before resolution", async () => {
    const { tool, chatToolModule } = await getTool();
    const calls: Array<Record<string, unknown>> = [];
    chatToolModule.setChatToolRelayFn(async (request) => {
      calls.push(request as Record<string, unknown>);
      return {
        status: "ok",
        relayed: true,
        source_chat_jid: String(request.source_chat_jid),
        source_agent_name: "source",
        target_chat_jid: "web:target",
        target_agent_name: "research",
        queued: "followup",
        thread_id: null,
      };
    });

    const result = await withChatContext(chatJid, "web", () => tool.execute("x", {
      target_agent_name: "@research",
      content: "Please inspect this branch.",
      mode: "queue",
    }));

    expect(calls).toEqual([{
      source_chat_jid: chatJid,
      target_agent_name: "research",
      content: "Please inspect this branch.",
      mode: "queue",
    }]);
    expect(result.details.relayed).toBe(true);
    expect(result.details.target_chat_jid).toBe("web:target");
    expect(result.details.target_agent_name).toBe("research");
    expect(result.content[0].text).toContain("queued as a follow-up");
  });

  test("rejects ambiguous target selectors", async () => {
    const { tool, chatToolModule } = await getTool();
    chatToolModule.setChatToolRelayFn(async () => {
      throw new Error("should not be called");
    });

    const result = await withChatContext(chatJid, "web", () => tool.execute("x", {
      target_chat_jid: "web:target",
      target_agent_name: "research",
      content: "Hello",
    }));

    expect(result.details.relayed).toBe(false);
    expect(result.details.error).toContain("Provide only one target selector");
  });
});

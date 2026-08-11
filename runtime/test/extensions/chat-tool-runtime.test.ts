import { describe, expect, test } from "bun:test";

import {
  createChatToolChannelDeliveryHandler,
  createDirectChatToolRelayHandler,
} from "../../src/extensions/chat-tool-runtime.js";
import { registerChannelDetector } from "../../src/router.js";
import { registerChannelTransport } from "../../src/runtime/channel-transport-registry.js";
import { createRuntimeSenders } from "../../src/runtime/wiring.js";

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function makeAgentPool(overrides: Record<string, unknown> = {}) {
  return {
    listActiveChats: () => [],
    listKnownChats: () => [
      { branch_id: "branch-source", chat_jid: "web:source", root_chat_jid: "web:source", parent_branch_id: null, agent_name: "source-handle" },
      { branch_id: "branch-target", chat_jid: "web:target", root_chat_jid: "web:source", parent_branch_id: "branch-source", agent_name: "research" },
    ],
    findChatByAgentName: (name: string) => name === "research"
      ? { chat_jid: "web:target", agent_name: "research" }
      : null,
    getAgentHandleForChat: (chatJid: string) => chatJid === "web:source" ? "source-handle" : "derived",
    ...overrides,
  } as any;
}

describe("direct chat tool runtime relay", () => {
  test("resolves source and target identities, forwards directly to target message route, and emits reply-to metadata", async () => {
    const forwarded: { url?: string; headers?: Record<string, string>; payload?: Record<string, unknown> } = {};
    const relay = createDirectChatToolRelayHandler(makeAgentPool(), {
      handleRequest: async (req) => {
        forwarded.url = req.url;
        forwarded.headers = Object.fromEntries(req.headers.entries());
        forwarded.payload = await req.json() as Record<string, unknown>;
        return jsonResponse({ queued: "followup", thread_id: null }, 201);
      },
    }, {
      defaultAgentId: "default",
      getAgentDisplayName: () => "Smith",
      getChatBranchByChatJid: () => null,
      getChatBranchByAgentName: (agentName) => agentName === "research"
        ? { branch_id: "branch-target", chat_jid: "web:target", root_chat_jid: "web:source", parent_branch_id: "branch-source", agent_name: "research" }
        : null,
    });

    const result = await relay({
      source_chat_jid: "web:source",
      target_agent_name: "@research",
      content: "  Please inspect this branch.  ",
      mode: "queue",
    });

    expect(forwarded.url).toBe("http://internal/agent/default/message?chat_jid=web%3Atarget");
    expect(forwarded.headers?.["reply-to"]).toBe("@source-handle <jid:web:source>");
    expect(forwarded.headers?.["x-piclaw-persist-steer"]).toBe("1");
    expect(forwarded.payload).toEqual({
      content: "From: Smith (@source-handle) <jid:web:source>\nReply-To: @source-handle <jid:web:source>\nTo: @research <jid:web:target>\n\nPlease inspect this branch.",
      content_blocks: [{
        type: "peer_message",
        relay: "chat_tool",
        source_chat_jid: "web:source",
        source_agent_name: "source-handle",
        source_agent_display_name: "Smith",
        target_chat_jid: "web:target",
        target_agent_name: "research",
        target_agent_display_name: "Smith",
        reply_to: {
          chat_jid: "web:source",
          agent_name: "source-handle",
          agent_display_name: "Smith",
          session_tree: {
            branch_id: "branch-source",
            chat_jid: "web:source",
            root_chat_jid: "web:source",
            parent_branch_id: null,
            agent_name: "source-handle",
          },
        },
        source_session_tree: {
          branch_id: "branch-source",
          chat_jid: "web:source",
          root_chat_jid: "web:source",
          parent_branch_id: null,
          agent_name: "source-handle",
        },
        target_session_tree: {
          branch_id: "branch-target",
          chat_jid: "web:target",
          root_chat_jid: "web:source",
          parent_branch_id: "branch-source",
          agent_name: "research",
        },
        body: "Please inspect this branch.",
      }],
      mode: "queue",
      persist_steer: true,
    });
    expect(result).toMatchObject({
      status: "ok",
      relayed: true,
      source_chat_jid: "web:source",
      source_agent_name: "source-handle",
      source_agent_display_name: "Smith",
      target_chat_jid: "web:target",
      target_agent_name: "research",
      target_agent_display_name: "Smith",
      reply_to: {
        chat_jid: "web:source",
        agent_name: "source-handle",
        agent_display_name: "Smith",
        session_tree: {
          branch_id: "branch-source",
          chat_jid: "web:source",
          root_chat_jid: "web:source",
          parent_branch_id: null,
          agent_name: "source-handle",
        },
      },
      source_session_tree: {
        branch_id: "branch-source",
        chat_jid: "web:source",
        root_chat_jid: "web:source",
        parent_branch_id: null,
        agent_name: "source-handle",
      },
      target_session_tree: {
        branch_id: "branch-target",
        chat_jid: "web:target",
        root_chat_jid: "web:source",
        parent_branch_id: "branch-source",
        agent_name: "research",
      },
      queued: "followup",
      thread_id: null,
    });
  });

  test("uses the trusted agent-message entry point when available instead of auth-guarded request routing", async () => {
    let handleAgentMessageCalled = false;
    let handleRequestCalled = false;
    const relay = createDirectChatToolRelayHandler(makeAgentPool(), {
      handleAgentMessage: async (req, pathname) => {
        handleAgentMessageCalled = true;
        expect(pathname).toBe("/agent/default/message");
        expect(req.url).toBe("http://internal/agent/default/message?chat_jid=web%3Atarget");
        return jsonResponse({ created: true, row_id: 123 }, 201);
      },
      handleRequest: async () => {
        handleRequestCalled = true;
        return jsonResponse({ error: "Unauthorized" }, 401);
      },
    }, {
      getAgentDisplayName: () => "Smith",
      getChatBranchByChatJid: () => null,
      getChatBranchByAgentName: () => null,
    });

    const result = await relay({
      source_chat_jid: "web:source",
      target_agent_name: "@research",
      content: "hello",
      mode: "auto",
    });

    expect(handleAgentMessageCalled).toBe(true);
    expect(handleRequestCalled).toBe(false);
    expect(result).toMatchObject({
      status: "ok",
      relayed: true,
      target_chat_jid: "web:target",
      target_agent_name: "research",
      created: true,
      row_id: 123,
    });
  });

  test("does not accept sender aliases from the request and rejects self-targets", async () => {
    const relay = createDirectChatToolRelayHandler(makeAgentPool(), {
      handleRequest: async () => jsonResponse({ created: true }, 201),
    }, { getAgentDisplayName: () => "Smith", getChatBranchByChatJid: () => null });

    await expect(relay({
      source_chat_jid: "web:source",
      target_chat_jid: "web:source",
      content: "hello",
      mode: "auto",
    })).rejects.toThrow("source_chat_jid and target chat must differ");

    const result = await relay({
      source_chat_jid: "web:source",
      target_chat_jid: "web:target",
      content: "hello",
      mode: "auto",
    });
    expect(result.source_agent_name).toBe("source-handle");
    expect(result.source_agent_display_name).toBe("Smith");
  });

  test("rejects unknown destinations instead of routing to unverified chats", async () => {
    const relay = createDirectChatToolRelayHandler(makeAgentPool({
      listKnownChats: () => [{ chat_jid: "web:source", agent_name: "source-handle" }],
      findChatByAgentName: () => null,
    }), {
      handleRequest: async () => jsonResponse({ created: true }, 201),
    }, { getAgentDisplayName: () => "Smith", getChatBranchByChatJid: () => null });

    await expect(relay({
      source_chat_jid: "web:source",
      target_agent_name: "unknown",
      content: "hello",
      mode: "auto",
    })).rejects.toThrow("Unknown target agent: unknown");

    await expect(relay({
      source_chat_jid: "web:source",
      target_chat_jid: "web:not-registered",
      content: "hello",
      mode: "auto",
    })).rejects.toThrow("Unknown target chat: web:not-registered");
  });

  test("declines direct delivery for web, unprefixed, unknown, and unavailable targets", async () => {
    const detected: string[] = [];
    const lookedUp: string[] = [];
    const handler = createChatToolChannelDeliveryHandler(async () => {
      throw new Error("sender must not run");
    }, {
      detectChannel: (chatJid) => {
        detected.push(chatJid);
        return chatJid.startsWith("telegram:") ? "telegram" : "unknown";
      },
      getChannelTransport: (channel) => {
        lookedUp.push(channel);
        return null;
      },
    });

    for (const target_chat_jid of ["web:target", "local-target", "unknown:target", "telegram:123"]) {
      await expect(handler({
        source_chat_jid: "web:source",
        target_chat_jid,
        content: "hello",
      })).resolves.toEqual({ handled: false });
    }

    expect(detected).toEqual(["unknown:target", "telegram:123"]);
    expect(lookedUp).toEqual(["telegram"]);
  });

  test("declines an active transport when the target is not a known chat", async () => {
    const handler = createChatToolChannelDeliveryHandler(async () => {
      throw new Error("sender must not run");
    }, {
      detectChannel: () => "telegram",
      getChannelTransport: () => ({ sendMessage: async () => {} }),
      isKnownChatJid: () => false,
    });

    await expect(handler({
      source_chat_jid: "web:source",
      target_chat_jid: "telegram:unknown",
      content: "hello",
    })).resolves.toEqual({ handled: false });
  });

  test("allows direct delivery back to the current non-web chat", async () => {
    const calls: string[] = [];
    const handler = createChatToolChannelDeliveryHandler(async (jid) => {
      calls.push(jid);
    }, {
      detectChannel: () => "telegram",
      getChannelTransport: () => ({ sendMessage: async () => {} }),
      isKnownChatJid: () => false,
    });

    await expect(handler({
      source_chat_jid: "telegram:self",
      target_chat_jid: "telegram:self",
      content: "hello",
    })).resolves.toMatchObject({ handled: true });
    expect(calls).toEqual(["telegram:self"]);
  });

  test("uses the shared runtime sender after selecting a registered channel", async () => {
    const calls: Array<{ jid: string; text: string; options?: Record<string, unknown> }> = [];
    const handler = createChatToolChannelDeliveryHandler(async (jid, text, options) => {
      calls.push({ jid, text, options: options as Record<string, unknown> | undefined });
    }, {
      detectChannel: () => "telegram",
      getChannelTransport: () => ({ sendMessage: async () => {} }),
      isKnownChatJid: () => true,
    });

    const result = await handler({
      source_chat_jid: "web:source",
      target_chat_jid: "telegram:123",
      content: "hello",
    });

    expect(calls).toEqual([{
      jid: "telegram:123",
      text: "hello",
      options: { source: "chat-tool" },
    }]);
    expect(result).toEqual({
      handled: true,
      result: {
        status: "sent",
        relayed: true,
        delivered: true,
        delivery: "channel",
        transport: "telegram",
        source_chat_jid: "web:source",
        target_chat_jid: "telegram:123",
      },
    });
  });

  test("propagates a selected channel send failure without returning a relay fallback", async () => {
    const handler = createChatToolChannelDeliveryHandler(async () => {
      throw new Error("delivery outcome unknown");
    }, {
      detectChannel: () => "telegram",
      getChannelTransport: () => ({ sendMessage: async () => {} }),
      isKnownChatJid: () => true,
    });

    await expect(handler({
      source_chat_jid: "web:source",
      target_chat_jid: "telegram:123",
      content: "hello",
    })).rejects.toThrow("delivery outcome unknown");
  });

  test("sends through a registered channel and mirrors through the web sender", async () => {
    const transportCalls: Array<{ jid: string; text: string; source?: string }> = [];
    const webCalls: Array<{ jid: string; text: string; source?: string }> = [];
    const unregisterDetector = registerChannelDetector((chatJid) => chatJid.startsWith("toolchan:") ? "toolchan" : null);
    const unregisterTransport = registerChannelTransport("toolchan", {
      sendMessage: async (jid, text, options) => {
        transportCalls.push({ jid, text, source: options?.source });
      },
    });

    try {
      const senders = createRuntimeSenders({
        sendMessage: async (jid, text, options) => {
          webCalls.push({ jid, text, source: options?.source });
        },
        resumeChat: () => {},
        resumePendingChats: () => {},
      }, null);
      const handler = createChatToolChannelDeliveryHandler(senders.sendMessage, {
        isKnownChatJid: () => true,
      });

      await expect(handler({
        source_chat_jid: "web:source",
        target_chat_jid: "toolchan:123",
        content: "hello",
      })).resolves.toMatchObject({ handled: true });

      expect(transportCalls).toEqual([{ jid: "toolchan:123", text: "hello", source: "chat-tool" }]);
      expect(webCalls).toEqual([{ jid: "toolchan:123", text: "hello", source: "chat-tool" }]);
    } finally {
      unregisterTransport();
      unregisterDetector();
    }
  });
});

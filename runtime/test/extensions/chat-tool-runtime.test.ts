import { describe, expect, test } from "bun:test";

import { createDirectChatToolRelayHandler } from "../../src/extensions/chat-tool-runtime.js";

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
});

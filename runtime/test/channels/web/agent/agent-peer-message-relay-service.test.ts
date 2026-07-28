import { describe, expect, test } from "bun:test";

import { WebAgentPeerMessageRelayService } from "../../../../src/channels/web/agent/agent-peer-message-relay-service.js";

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function createService(
  overrides: Partial<ConstructorParameters<typeof WebAgentPeerMessageRelayService>[0]> = {},
) {
  return new WebAgentPeerMessageRelayService({
    defaultAgentId: "default",
    json: jsonResponse,
    agentPool: {
      listActiveChats: () => [],
      findActiveChatByAgentName: () => null,
      getAgentHandleForChat: () => "source",
    },
    getChatBranchByChatJid: () => null,
    forwardAgentMessageRequest: async () => jsonResponse({ created: true }, 201),
    ...overrides,
  });
}

describe("WebAgentPeerMessageRelayService", () => {
  test("rejects malformed peer-message payloads with the existing 400 errors", async () => {
    const service = createService();

    const invalidJsonResponse = await service.handleAgentPeerMessage(new Request("https://example.com/agent/peer-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }));
    expect(invalidJsonResponse.status).toBe(400);
    expect((await invalidJsonResponse.json()).error).toBe("Invalid JSON");

    const missingSourceResponse = await service.handleAgentPeerMessage(new Request("https://example.com/agent/peer-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_chat_jid: "web:target", content: "hello" }),
    }));
    expect(missingSourceResponse.status).toBe(400);
    expect((await missingSourceResponse.json()).error).toBe("Missing source_chat_jid");

    const missingTargetResponse = await service.handleAgentPeerMessage(new Request("https://example.com/agent/peer-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_chat_jid: "web:source", content: "hello" }),
    }));
    expect(missingTargetResponse.status).toBe(400);
    expect((await missingTargetResponse.json()).error).toBe("Missing target_chat_jid or target_agent_name");

    const missingContentResponse = await service.handleAgentPeerMessage(new Request("https://example.com/agent/peer-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_chat_jid: "web:source", target_chat_jid: "web:target" }),
    }));
    expect(missingContentResponse.status).toBe(400);
    expect((await missingContentResponse.json()).error).toBe("Missing content");
  });

  test("resolves target_chat_jid via active chat or branch lookup and shapes the forwarded request", async () => {
    const forwarded: {
      pathname?: string;
      chatJid?: string;
      agentId?: string;
      headers?: Record<string, string>;
      payload?: Record<string, unknown>;
    } = {};
    const service = createService({
      agentPool: {
        listActiveChats: () => [],
        findActiveChatByAgentName: () => null,
        getAgentHandleForChat: () => "source-handle",
      },
      getChatBranchByChatJid: (chatJid) => chatJid === "web:branch" ? { chat_jid: chatJid, agent_name: "research" } : null,
      forwardAgentMessageRequest: async (req, pathname, chatJid, agentId) => {
        forwarded.pathname = pathname;
        forwarded.chatJid = chatJid;
        forwarded.agentId = agentId;
        forwarded.headers = Object.fromEntries(req.headers.entries());
        forwarded.payload = await req.json() as Record<string, unknown>;
        return jsonResponse({ queued: "followup", thread_id: null }, 201);
      },
    });

    const response = await service.handleAgentPeerMessage(new Request("https://example.com/agent/peer-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_chat_jid: "web:source",
        target_chat_jid: "web:branch",
        content: "  Please inspect the plan.  ",
        mode: "queue",
      }),
    }));

    expect(forwarded).toEqual({
      pathname: "/agent/default/message",
      chatJid: "web:branch",
      agentId: "default",
      headers: {
        "content-type": "application/json",
        "x-piclaw-persist-steer": "1",
      },
      payload: {
        content: "from: @source-handle <jid:web:source>\n\nPlease inspect the plan.",
        content_blocks: [{
          type: "peer_message",
          source_chat_jid: "web:source",
          source_agent_name: "source-handle",
          target_chat_jid: "web:branch",
          target_agent_name: "research",
          body: "Please inspect the plan.",
        }],
        mode: "queue",
        persist_steer: true,
      },
    });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      status: "ok",
      queued: "followup",
      thread_id: null,
      source_chat_jid: "web:source",
      source_agent_name: "source-handle",
      target_chat_jid: "web:branch",
      target_agent_name: "research",
      relayed: true,
    });
  });

  test("resolves target_agent_name via the branch-aware lookup and preserves downstream status codes", async () => {
    const requestedNames: string[] = [];
    const service = createService({
      agentPool: {
        listActiveChats: () => [],
        findChatByAgentName: (name: string) => {
          requestedNames.push(name);
          return name === "research" ? { chat_jid: "web:target", agent_name: "research" } : null;
        },
        findActiveChatByAgentName: () => {
          throw new Error("findActiveChatByAgentName should not be used when findChatByAgentName exists");
        },
        getAgentHandleForChat: () => "fallback-source",
      },
      forwardAgentMessageRequest: async (req) => {
        expect(req.headers.get("x-piclaw-persist-steer")).toBe("1");
        expect(await req.json()).toEqual({
          content: "from: @manual-source <jid:web:source>\n\nHello there",
          content_blocks: [{
            type: "peer_message",
            source_chat_jid: "web:source",
            source_agent_name: "manual-source",
            target_chat_jid: "web:target",
            target_agent_name: "research",
            body: "Hello there",
          }],
          mode: "auto",
          persist_steer: true,
        });
        return jsonResponse({ created: true }, 202);
      },
    });

    const response = await service.handleAgentPeerMessage(new Request("https://example.com/agent/peer-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_chat_jid: "web:source",
        source_agent_name: "manual-source",
        target_agent_name: "@research",
        content: "Hello there",
        mode: "invalid",
      }),
    }));

    expect(requestedNames).toEqual(["research"]);
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({
      status: "ok",
      created: true,
      source_chat_jid: "web:source",
      source_agent_name: "manual-source",
      target_chat_jid: "web:target",
      target_agent_name: "research",
      relayed: true,
    });
  });

  test("rejects self-targets and returns non-ok downstream responses unchanged", async () => {
    const service = createService({
      agentPool: {
        listActiveChats: () => [{ chat_jid: "web:source", agent_name: "self" }],
        findActiveChatByAgentName: () => null,
        getAgentHandleForChat: () => "self",
      },
    });

    const selfTargetResponse = await service.handleAgentPeerMessage(new Request("https://example.com/agent/peer-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_chat_jid: "web:source",
        target_chat_jid: "web:source",
        content: "nope",
      }),
    }));
    expect(selfTargetResponse.status).toBe(400);
    expect((await selfTargetResponse.json()).error).toBe("source_chat_jid and target chat must differ");

    const forwardFailure = jsonResponse({ error: "rate limited" }, 429);
    const failingService = createService({
      agentPool: {
        listActiveChats: () => [{ chat_jid: "web:target", agent_name: "target" }],
        findActiveChatByAgentName: () => null,
        getAgentHandleForChat: () => "source",
      },
      forwardAgentMessageRequest: async () => forwardFailure,
    });

    const failureResponse = await failingService.handleAgentPeerMessage(new Request("https://example.com/agent/peer-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_chat_jid: "web:source",
        target_chat_jid: "web:target",
        content: "hello",
      }),
    }));
    expect(failureResponse).toBe(forwardFailure);
    expect(failureResponse.status).toBe(429);
    expect((await failureResponse.json()).error).toBe("rate limited");
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@earendil-works/pi-ai", () => ({
  completeSimple: vi.fn(),
}));

import { completeSimple } from "@earendil-works/pi-ai";
import { captureUnindexedBatchesFromSession, groupBatchesByAgentMessage } from "../../src/extensions/context-prune/batch-capture.js";
import { ToolCallIndexer } from "../../src/extensions/context-prune/indexer.js";
import { CUSTOM_TYPE_INDEX, CUSTOM_TYPE_SUMMARY } from "../../src/extensions/context-prune/types.js";
import { contextPrune } from "../../src/extensions/context-prune.js";

function userEntry(text: string) {
  return { type: "message", message: { role: "user", content: [{ type: "text", text }] } };
}

function assistantToolEntry(toolCallId: string, name: string, args: Record<string, unknown> = {}) {
  return {
    type: "message",
    message: {
      role: "assistant",
      content: [{ type: "toolCall", id: toolCallId, name, arguments: args }],
    },
  };
}

function toolResultEntry(toolCallId: string, toolName: string, text: string, isError = false) {
  return {
    type: "message",
    message: {
      role: "toolResult",
      toolCallId,
      toolName,
      content: [{ type: "text", text }],
      isError,
    },
  };
}

function toolResultMessage(toolCallId: string, toolName: string, text: string) {
  return {
    role: "toolResult",
    toolCallId,
    toolName,
    content: [{ type: "text", text }],
    isError: false,
  };
}

function makePi() {
  const handlers = new Map<string, any>();
  const tools = new Map<string, any>();
  const pi = {
    on: vi.fn((eventName: string, handler: any) => handlers.set(eventName, handler)),
    registerTool: vi.fn((tool: any) => tools.set(tool.name, tool)),
    sendMessage: vi.fn(),
    appendEntry: vi.fn(),
  };
  return { pi, handlers, tools };
}

function makeCtx(branch: any[]) {
  return {
    ui: { notify: vi.fn() },
    model: { provider: "test", id: "model", api: "openai-completions" },
    modelRegistry: {
      getApiKeyAndHeaders: vi.fn().mockResolvedValue({ ok: true, apiKey: "test-key", headers: {} }),
    },
    sessionManager: {
      getBranch: vi.fn(() => branch),
      appendCustomMessageEntry: vi.fn(),
      appendCustomEntry: vi.fn(),
    },
  };
}

describe("context-prune helpers", () => {
  it("captures unindexed completed tool results and can merge by agent message", () => {
    const indexer = new ToolCallIndexer();
    const branch = [
      userEntry("inspect"),
      assistantToolEntry("tc-1", "read", { path: "a.ts" }),
      toolResultEntry("tc-1", "read", "file A"),
      assistantToolEntry("tc-2", "grep", { pattern: "x" }),
      toolResultEntry("tc-2", "grep", "match"),
      assistantToolEntry("tc-3", "context_prune"),
      toolResultEntry("tc-3", "context_prune", "done"),
    ];

    const batches = captureUnindexedBatchesFromSession(branch, indexer, ["context_prune"]);
    expect(batches).toHaveLength(2);
    expect(batches.map((batch) => batch.toolCalls[0].toolCallId)).toEqual(["tc-1", "tc-2"]);

    const grouped = groupBatchesByAgentMessage(batches);
    expect(grouped).toHaveLength(1);
    expect(grouped[0].toolCalls.map((tc) => tc.toolCallId)).toEqual(["tc-1", "tc-2"]);
  });
});

describe("contextPrune extension", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reconstructs persisted indexes, prunes context, and retrieves originals by short ref", async () => {
    const { pi, handlers, tools } = makePi();
    contextPrune(pi as any);

    const branch = [
      {
        type: "custom",
        customType: CUSTOM_TYPE_INDEX,
        data: {
          toolCalls: [
            {
              toolCallId: "tc-1",
              toolName: "read",
              args: { path: "a.ts" },
              resultText: "full original output",
              isError: false,
              turnIndex: 0,
              timestamp: 123,
            },
          ],
        },
      },
      {
        type: "custom_message",
        customType: CUSTOM_TYPE_SUMMARY,
        details: { toolCallRefs: [{ shortId: "t1", toolCallId: "tc-1" }] },
      },
    ];
    const ctx = makeCtx(branch);

    await handlers.get("session_start")({}, ctx);
    const contextResult = await handlers.get("context")({
      messages: [
        { role: "assistant", content: [{ type: "toolCall", id: "tc-1", name: "read", arguments: { path: "a.ts" } }] },
        toolResultMessage("tc-1", "read", "full original output"),
      ],
    }, ctx);

    expect(contextResult.messages).toHaveLength(1);
    expect(contextResult.messages[0].role).toBe("assistant");

    const queryResult = await tools.get("context_tree_query").execute("query-1", { toolCallIds: ["t1"] }, undefined, undefined, ctx);
    expect(queryResult.content[0].text).toContain("full original output");
    expect(queryResult.content[0].text).toContain("Tool: read");
  });

  it("context_prune summarizes branch batches, persists summaries and index entries, then prunes future context", async () => {
    (completeSimple as any).mockResolvedValueOnce({
      stopReason: "end",
      content: [{ type: "text", text: "- read inspected a.ts and found important config." }],
      usage: { input: 1, output: 1 },
    });

    const { pi, handlers, tools } = makePi();
    contextPrune(pi as any);

    const longOutput = "important config\n".repeat(80);
    const branch = [
      userEntry("inspect config"),
      assistantToolEntry("tc-1", "read", { path: "a.ts" }),
      toolResultEntry("tc-1", "read", longOutput),
    ];
    const ctx = makeCtx(branch);
    await handlers.get("session_start")({}, ctx);

    const pruneResult = await tools.get("context_prune").execute("prune-1", {}, new AbortController().signal, vi.fn(), ctx);

    expect(completeSimple).toHaveBeenCalledTimes(1);
    expect(pruneResult.content[0].text).toContain("Context prune completed");
    expect(pi.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ customType: CUSTOM_TYPE_SUMMARY, content: expect.stringContaining("Summarized tool refs") }),
    );
    expect(pi.sendMessage).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ deliverAs: "steer" }),
    );
    expect(pi.appendEntry).toHaveBeenCalledWith(
      CUSTOM_TYPE_INDEX,
      expect.objectContaining({ toolCalls: [expect.objectContaining({ toolCallId: "tc-1", resultText: longOutput })] }),
    );

    const contextResult = await handlers.get("context")({
      messages: [
        { role: "assistant", content: [{ type: "toolCall", id: "tc-1", name: "read", arguments: { path: "a.ts" } }] },
        toolResultMessage("tc-1", "read", longOutput),
      ],
    }, ctx);

    expect(contextResult.messages).toHaveLength(1);
  });

  it("falls back to a custom message entry instead of steering when summary delivery fails", async () => {
    (completeSimple as any).mockResolvedValueOnce({
      stopReason: "end",
      content: [{ type: "text", text: "- read inspected fallback.ts." }],
      usage: { input: 1, output: 1 },
    });

    const { pi, handlers, tools } = makePi();
    pi.sendMessage.mockImplementationOnce(() => { throw new Error("send unavailable"); });
    contextPrune(pi as any);

    const longOutput = "fallback details\n".repeat(80);
    const branch = [
      userEntry("inspect fallback"),
      assistantToolEntry("tc-fallback", "read", { path: "fallback.ts" }),
      toolResultEntry("tc-fallback", "read", longOutput),
    ];
    const ctx = makeCtx(branch);
    await handlers.get("session_start")({}, ctx);

    await tools.get("context_prune").execute("prune-fallback", {}, new AbortController().signal, vi.fn(), ctx);

    expect(pi.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ customType: CUSTOM_TYPE_SUMMARY, content: expect.stringContaining("Summarized tool refs") }),
    );
    expect(ctx.sessionManager.appendCustomMessageEntry).toHaveBeenCalledWith(
      CUSTOM_TYPE_SUMMARY,
      expect.stringContaining("Summarized tool refs"),
      true,
      expect.objectContaining({ toolCallRefs: [expect.objectContaining({ toolCallId: "tc-fallback" })] }),
    );
    expect(pi.appendEntry).toHaveBeenCalledWith(
      CUSTOM_TYPE_INDEX,
      expect.objectContaining({ toolCalls: [expect.objectContaining({ toolCallId: "tc-fallback", resultText: longOutput })] }),
    );
  });
});

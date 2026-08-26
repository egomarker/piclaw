import { describe, expect, test } from "bun:test";
import { createProcessChatStreamingRuntime } from "../../../../src/channels/web/runtime/process-chat-streaming-runtime.js";

function channel(events: Array<{ type: string; payload: any }>) {
  const buffers = new Map<string, any>();
  return {
    sse: { clients: { size: 1 } },
    agentPool: { getAvailableModels: async () => ({ current: "github-copilot/gpt-5.6-sol", thinking_level: "high", thinking_level_label: "high", available_thinking_levels: ["off", "high"], available_thinking_level_labels: ["off", "high"] }) },
    getAgentStatus: () => null,
    updateAgentStatus() {}, broadcastEvent: (type: string, payload: any) => events.push({ type, payload }),
    isPanelExpanded: () => false,
    updateThoughtBuffer: (turn: string, text: string, totalLines: number) => buffers.set(`${turn}:thought`, { text, totalLines }),
    updateDraftBuffer: (turn: string, text: string, totalLines: number, kind?: string) => buffers.set(`${turn}:draft`, { text, totalLines, ...(kind ? { kind } : {}) }),
    getBuffer: (turn: string, panel: string) => buffers.get(`${turn}:${panel}`),
  } as any;
}

describe("process chat streaming runtime", () => {
  test("tracks compaction/recovery state and emits profiled streaming events", async () => {
    const events: Array<{ type: string; payload: any }> = [];
    const runtime = await createProcessChatStreamingRuntime({ channel: channel(events), chatJid: "web:test", agentId: "default", threadId: "thread-1", turnId: "turn-1", runStartedAt: "2026-01-01T00:00:00.000Z", sourceMessageId: "m1", withResolvedToolStatusHints: (_jid, payload) => payload, withAgentStatusProgressMetadata: (payload) => payload });
    runtime.streamingHandler({ type: "compaction_end", errorMessage: "context full" });
    runtime.streamingHandler({ type: "recovery_start" });
    runtime.streamingHandler({ type: "recovery_end", outcome: "exhausted" });
    expect(runtime.state).toMatchObject({ sawCompactionEvent: true, sawRecoveryEvent: true, lastCompactionErrorMessage: "context full", lastRecoveryOutcome: "exhausted" });
    expect(events.some((event) => event.type === "agent_status" && event.payload.type === "thinking")).toBe(true);
  });

  test("classifies streamed commentary drafts separately from answer drafts", async () => {
    const events: Array<{ type: string; payload: any }> = [];
    const fake = channel(events);
    const runtime = await createProcessChatStreamingRuntime({ channel: fake, chatJid: "web:test", agentId: "default", threadId: "thread-1", turnId: "turn-1", runStartedAt: "2026-01-01T00:00:00.000Z", sourceMessageId: "m1", withResolvedToolStatusHints: (_jid, payload) => payload, withAgentStatusProgressMetadata: (payload) => payload });
    const commentarySignature = JSON.stringify({ id: "msg-c", phase: "commentary" });
    runtime.streamingHandler({
      type: "message_update",
      assistantMessageEvent: {
        type: "text_start",
        contentIndex: 0,
        partial: { content: [{ type: "text", textSignature: commentarySignature }] },
      },
    });
    runtime.streamingHandler({
      type: "message_update",
      assistantMessageEvent: {
        type: "text_delta",
        delta: "Inspecting logs.",
        contentIndex: 0,
        partial: { content: [{ type: "text", textSignature: commentarySignature }] },
      },
    });
    expect(fake.getBuffer("turn-1", "draft")).toMatchObject({ text: "Inspecting logs.", kind: "commentary" });

    runtime.streamingHandler({
      type: "message_update",
      assistantMessageEvent: {
        type: "text_start",
        contentIndex: 0,
        partial: { content: [{ type: "text", textSignature: JSON.stringify({ id: "msg-f", phase: "final_answer" }) }] },
      },
    });
    runtime.streamingHandler({
      type: "message_update",
      assistantMessageEvent: {
        type: "text_delta",
        delta: "Done.",
        contentIndex: 0,
        partial: { content: [{ type: "text", textSignature: JSON.stringify({ id: "msg-f", phase: "final_answer" }) }] },
      },
    });
    expect(fake.getBuffer("turn-1", "draft")).toMatchObject({ text: "Done.", kind: "answer" });
  });

  test("normalizes timing usage and clears committed drafts", async () => {
    const events: Array<{ type: string; payload: any }> = [];
    const fake = channel(events);
    const runtime = await createProcessChatStreamingRuntime({ channel: fake, chatJid: "web:test", agentId: "default", threadId: "thread-1", turnId: "turn-1", runStartedAt: new Date(Date.now() - 100).toISOString(), sourceMessageId: "m1", withResolvedToolStatusHints: (_jid, payload) => payload, withAgentStatusProgressMetadata: (payload) => payload });
    fake.updateDraftBuffer("turn-1", "draft", 1);
    runtime.clearCommittedDraft();
    expect(fake.getBuffer("turn-1", "draft")).toEqual({ text: "", totalLines: 0 });
    runtime.streamingHandler({
      type: "message_update",
      assistantMessageEvent: { type: "text_delta", delta: "answer after clear" },
    });
    expect(fake.getBuffer("turn-1", "draft")).toMatchObject({ text: "answer after clear", kind: "answer" });
    expect(runtime.buildAgentTimingBlock({ input: 10, output: 4, cacheRead: 2 })).toMatchObject({ type: "agent_timing", source_message_id: "m1", usage: { input_tokens: 10, output_tokens: 4, cache_read_tokens: 2, total_tokens: 16 } });
  });
});

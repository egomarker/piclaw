/**
 * test/channels/web/web-agent-streaming.test.ts – Tests for agent event streaming over SSE.
 *
 * Verifies that agent session events (drafts, thoughts, completions) are
 * correctly translated into SSE payloads and broadcast to connected clients.
 */

import { describe, test, expect } from "bun:test";
import { AgentQueue } from "../../../src/queue.js";
import { waitFor } from "../../helpers.js";
import { createWebChannelTestFixture } from "./helpers/web-channel-fixture.js";

function makeEvent(type: string, payload: Record<string, unknown> = {}) {
  return { type, ...payload } as any;
}

function deferred<T = void>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe("web agent streaming", () => {
  test("processChat broadcasts streaming events and stores turns", async () => {
    const agentPool = {
      setSessionBinder: () => {},
      runAgent: async (_prompt: string, _chatJid: string, options: any) => {
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: { type: "thinking_start" },
        }));
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: { type: "thinking_delta", delta: "Thinking..." },
        }));
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: { type: "thinking_end", content: "Thinking..." },
        }));
        options.onEvent?.(makeEvent("thinking_level_changed", {
          level: "high",
        }));
        options.onEvent?.(makeEvent("thinking_level_select", {
          level: "medium",
          previousLevel: "high",
        }));
        options.onEvent?.(makeEvent("model_select", {
          model: { provider: "openai", id: "gpt-5" },
          previousModel: { provider: "anthropic", id: "claude-sonnet-4-5" },
          source: "set",
        }));
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: {
            type: "toolcall_end",
            toolCall: { id: "tool-1", name: "bash", arguments: { command: "echo hi" } },
          },
        }));
        options.onEvent?.(makeEvent("tool_execution_start", {
          toolCallId: "tool-1",
          toolName: "bash",
          args: { command: "echo hi" },
        }));
        options.onEvent?.(makeEvent("tool_execution_update", {
          toolCallId: "tool-1",
          toolName: "bash",
          args: { command: "echo hi" },
          partialResult: {
            content: [{
              type: "text",
              text: Array.from({ length: 105 }, (_, index) => `line ${index + 1}`).join("\n"),
            }],
          },
        }));
        options.onEvent?.(makeEvent("tool_execution_end", {
          toolCallId: "tool-1",
          toolName: "bash",
          isError: false,
        }));
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: { type: "text_start" },
        }));
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: { type: "text_delta", delta: "Partial" },
        }));
        options.onTurnComplete?.({ text: "intermediate", attachments: [] });
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: { type: "text_delta", delta: " final" },
        }));

        return { status: "success", result: "final response", attachments: [] };
      },
      getContextUsageForChat: async () => null,
    } as any;

    const fixture = await createWebChannelTestFixture({
      queue: new AgentQueue(),
      agentPool,
    });

    try {
      const { channel, events } = fixture;
      const interaction = channel.storeMessage("web:default", "hello", false, []);
      expect(interaction).not.toBeNull();

      await channel.processChat("web:default", "default");

      const eventTypes = events.map((event) => event.type);
      expect(eventTypes).toContain("agent_status");
      expect(eventTypes).toContain("agent_thought");
      expect(eventTypes).toContain("agent_draft");
      expect(eventTypes).not.toContain("agent_draft_delta");
      expect(eventTypes).not.toContain("agent_thought_delta");
      expect(eventTypes).toContain("agent_response");
      expect(eventTypes).toContain("model_changed");

      const thinkingEvents = events.filter((event) => event.type === "model_changed" && event.data?.thinking_level);
      expect(thinkingEvents.map((event) => event.data?.thinking_level)).toEqual(["high", "medium"]);
      expect(thinkingEvents[1]?.data?.previous_thinking_level).toBe("high");

      const modelEvent = events.find((event) => event.type === "model_changed" && event.data?.model === "openai/gpt-5");
      expect(modelEvent?.data?.previous_model).toBe("anthropic/claude-sonnet-4-5");
      expect(modelEvent?.data?.source).toBe("set");

      const toolStatus = events.find(
        (event) => event.type === "agent_status" && event.data?.type === "tool_status"
      );
      expect(toolStatus).toBeDefined();
      expect(toolStatus?.data?.tool_name).toBe("bash");
      expect(toolStatus?.data?.tool_args).toEqual({ command: "echo hi" });
      expect(toolStatus?.data?.title).toBe("bash: echo hi");
      expect(typeof toolStatus?.data?.started_at).toBe("string");
      expect(typeof toolStatus?.data?.last_event_at).toBe("string");
      expect(toolStatus?.data?.output_preview).toBe(Array.from({ length: 100 }, (_, index) => `line ${index + 6}`).join("\n"));
      expect(toolStatus?.data?.output_total_lines).toBe(105);
      expect(toolStatus?.data?.output_preview_lines).toBe(100);
      expect(toolStatus?.data?.output_truncated).toBe(true);

      const responses = events.filter((event) => event.type === "agent_response");
      expect(responses.length).toBeGreaterThanOrEqual(2);
      for (const response of responses) {
        expect(typeof response.data?.id).toBe("number");
        expect(typeof response.data?.timestamp).toBe("string");
        expect(response.data?.data?.type).toBe("agent_response");
        expect(typeof response.data?.data?.content).toBe("string");
        expect(response.data?.delta).toBeUndefined();
      }

      const done = events.find(
        (event) => event.type === "agent_status" && event.data?.type === "done"
      );
      expect(done).toBeDefined();
    } finally {
      fixture.cleanup();
    }
  });

  test("streams live generated widget events for show_widget tool calls", async () => {
    const agentPool = {
      setSessionBinder: () => {},
      runAgent: async (_prompt: string, _chatJid: string, options: any) => {
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: {
            type: "toolcall_start",
            contentIndex: 0,
            partial: {
              content: [{
                type: "toolCall",
                id: "widget-tool-1",
                name: "show_widget",
                arguments: {
                  title: "Live widget",
                  w: "<div>hel",
                },
              }],
            },
          },
        }));
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: {
            type: "toolcall_delta",
            contentIndex: 0,
            delta: "lo",
            partial: {
              content: [{
                type: "toolCall",
                id: "widget-tool-1",
                name: "show_widget",
                arguments: {
                  title: "Live widget",
                  w: "<div>hello</div>",
                  width: 800,
                  height: 600,
                },
              }],
            },
          },
        }));
        options.onEvent?.(makeEvent("message_update", {
          assistantMessageEvent: {
            type: "toolcall_end",
            contentIndex: 0,
            toolCall: {
              id: "widget-tool-1",
              name: "show_widget",
              arguments: {
                title: "Live widget",
                w: "<div>hello</div>",
                width: 800,
                height: 600,
              },
            },
          },
        }));
        return { status: "success", result: "widget response", attachments: [] };
      },
      getContextUsageForChat: async () => null,
    } as any;

    const fixture = await createWebChannelTestFixture({
      queue: new AgentQueue(),
      agentPool,
    });

    try {
      const { channel, events } = fixture;
      const interaction = channel.storeMessage("web:default", "show me a widget", false, []);
      expect(interaction).not.toBeNull();

      await channel.processChat("web:default", "default");

      const openEvent = events.find((event) => event.type === "generated_widget_open");
      expect(openEvent).toBeDefined();
      expect(openEvent?.data?.chat_jid).toBe("web:default");
      expect(openEvent?.data?.tool_call_id).toBe("widget-tool-1");
      expect(openEvent?.data?.artifact?.html).toBe("<div>hel");

      const deltaEvent = events.find((event) => event.type === "generated_widget_delta");
      expect(deltaEvent).toBeDefined();
      expect(deltaEvent?.data?.width).toBe(800);
      expect(deltaEvent?.data?.height).toBe(600);
      expect(deltaEvent?.data?.artifact?.html).toBe("<div>hello</div>");

      const finalEvent = events.find((event) => event.type === "generated_widget_final");
      expect(finalEvent).toBeDefined();
      expect(finalEvent?.data?.status).toBe("final");
      expect(finalEvent?.data?.artifact?.html).toBe("<div>hello</div>");
    } finally {
      fixture.cleanup();
    }
  });

  test("pre-prompt compaction defers in background and resumes the chat lane", async () => {
    const previousForeground = process.env.PICLAW_PREPROMPT_COMPACTION_FOREGROUND_MS;
    process.env.PICLAW_PREPROMPT_COMPACTION_FOREGROUND_MS = "1";
    const releaseCompaction = deferred<void>();
    let compactCalls = 0;
    let runCalls = 0;
    const session = {
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      model: { provider: "test", id: "large", contextWindow: 100 },
      settingsManager: { getCompactionSettings: () => ({ enabled: true, reserveTokens: 25 }) },
      getContextUsage: () => ({ tokens: compactCalls === 0 ? 90 : 10, contextWindow: 100, percent: compactCalls === 0 ? 90 : 10 }),
      sessionManager: {
        buildSessionContext: () => ({ messages: [{ role: "user", content: [{ type: "text", text: "x".repeat(compactCalls === 0 ? 360 : 4) }] }] }),
      },
      compact: async () => {
        compactCalls += 1;
        await releaseCompaction.promise;
        return { summary: "compacted", tokensBefore: 90, firstKeptEntryId: "entry-1" };
      },
    } as any;
    const agentPool = {
      setSessionBinder: () => {},
      getSessionForIntrospection: async () => session,
      runAgent: async () => {
        runCalls += 1;
        return { status: "success", result: "after compaction", attachments: [] };
      },
      getContextUsageForChat: async () => null,
    } as any;

    const fixture = await createWebChannelTestFixture({
      workspace: "temp",
      queue: new AgentQueue(),
      agentPool,
    });

    try {
      const { channel, db } = fixture;
      const interaction = channel.storeMessage("web:default", "hello", false, []);
      expect(interaction).not.toBeNull();

      await channel.processChat("web:default", "default");

      expect(compactCalls).toBe(1);
      expect(runCalls).toBe(0);
      expect(db.getChatCursor("web:default")).not.toBe(interaction!.timestamp);

      releaseCompaction.resolve(undefined);
      await waitFor(() => runCalls === 1, 500, 10);

      expect(db.getChatCursor("web:default")).toBe(interaction!.timestamp);
    } finally {
      if (previousForeground === undefined) delete process.env.PICLAW_PREPROMPT_COMPACTION_FOREGROUND_MS;
      else process.env.PICLAW_PREPROMPT_COMPACTION_FOREGROUND_MS = previousForeground;
      releaseCompaction.resolve(undefined);
      fixture.cleanup();
    }
  });

  test("auto-compaction start/end status events always carry non-empty titles", async () => {
    const agentPool = {
      setSessionBinder: () => {},
      runAgent: async (_prompt: string, _chatJid: string, options: any) => {
        options.onEvent?.(makeEvent("compaction_start", { reason: "overflow" }));
        options.onEvent?.(makeEvent("message_update", { assistantMessageEvent: { type: "text_start" } }));
        options.onEvent?.(makeEvent("message_update", { assistantMessageEvent: { type: "text_delta", delta: "compact" } }));
        options.onEvent?.(makeEvent("compaction_end", { reason: "overflow", result: undefined, aborted: false, willRetry: false, errorMessage: undefined }));
        return { status: "success", result: "compaction response", attachments: [] };
      },
      getContextUsageForChat: async () => null,
    } as any;

    const fixture = await createWebChannelTestFixture({
      queue: new AgentQueue(),
      agentPool,
    });

    try {
      const { channel, events } = fixture;
      const interaction = channel.storeMessage("web:default", "hello", false, []);
      expect(interaction).not.toBeNull();

      await channel.processChat("web:default", "default");

      const compactionStarts = events.filter(
        (event) => event.type === "agent_status" && event.data?.type === "intent" && event.data?.intent_key === "compaction"
      );
      expect(compactionStarts.length).toBeGreaterThanOrEqual(1);
      const compactionStart = compactionStarts[0];
      expect(typeof compactionStart.data?.title).toBe("string");
      expect(String(compactionStart.data.title).trim()).toBe("Compacting context");
      const done = events.find(
        (event) => event.type === "agent_status" && event.data?.type === "done"
      );
      expect(done).toBeDefined();
    } finally {
      fixture.cleanup();
    }
  });
});

/**
 * test/agent-pool/orphan-tool-results.test.ts – Unit tests for orphan tool-result pruning.
 */

import { describe, expect, test } from "bun:test";
import type { AgentSession } from "@earendil-works/pi-coding-agent";
import { pruneOrphanToolResults } from "../../src/agent-pool/orphan-tool-results.js";

type MessageRow = {
  role?: string;
  toolCallId?: string;
  content?: Array<{ type?: string; id?: string }>;
};

function createSession(messages: MessageRow[]) {
  const state = { messages: [...messages] };
  const session = {
    agent: {
      state,
      replaceMessages: (next: MessageRow[]) => {
        state.messages = [...next];
      },
    },
  };
  return { session: session as unknown as AgentSession, state };
}

describe("pruneOrphanToolResults", () => {
  test("keeps tool results linked to known assistant tool calls", () => {
    const { session, state } = createSession([
      { role: "assistant", content: [{ type: "toolCall", id: "call-1" }] },
      { role: "toolResult", toolCallId: "call-1" },
      { role: "toolResult", toolCallId: "call-orphan" },
    ]);

    const pruned = pruneOrphanToolResults(session, "web:test");

    expect(pruned).toBe(1);
    expect(state.messages.length).toBe(2);
    expect(state.messages.some((msg) => msg.role === "toolResult" && msg.toolCallId === "call-1")).toBe(true);
    expect(state.messages.some((msg) => msg.role === "toolResult" && msg.toolCallId === "call-orphan")).toBe(false);
  });

  test("removes all tool results when no assistant tool calls remain", () => {
    const { session, state } = createSession([
      { role: "assistant", content: [{ type: "text" }] },
      { role: "toolResult", toolCallId: "call-1" },
    ]);

    const pruned = pruneOrphanToolResults(session, "web:test");

    expect(pruned).toBe(1);
    expect(state.messages).toEqual([{ role: "assistant", content: [{ type: "text" }] }]);
  });

  test("removes orphan tool_result blocks embedded in message content arrays", () => {
    const { session, state } = createSession([
      { role: "assistant", content: [{ type: "tool_use", id: "call-1" }] },
      {
        role: "user",
        content: [
          { type: "text", id: "keep-me" },
          { type: "tool_result", tool_use_id: "call-1" },
          { type: "tool_result", tool_use_id: "call-orphan" },
        ],
      },
    ]);

    const pruned = pruneOrphanToolResults(session, "web:test");

    expect(pruned).toBe(1);
    expect((state.messages[1] as any).content).toEqual([
      { type: "text", id: "keep-me" },
      { type: "tool_result", tool_use_id: "call-1" },
    ]);
  });

  test("is a no-op when session has no internal messages array", () => {
    const session = {} as AgentSession;
    expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
  });
});

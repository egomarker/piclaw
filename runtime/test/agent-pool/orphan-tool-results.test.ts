/**
 * test/agent-pool/orphan-tool-results.test.ts – Unit tests for orphan tool-result pruning.
 */

import { describe, expect, test } from "bun:test";
import type { AgentSession } from "@earendil-works/pi-coding-agent";
import { pruneOrphanToolResults } from "../../src/agent-pool/orphan-tool-results.js";

type MessageRow = {
  role?: string;
  toolCallId?: string;
  content?: Array<{ type?: string; id?: string; tool_use_id?: string }>;
};

type FileEntry = {
  type: string;
  id: string;
  parentId?: string | null;
  message?: MessageRow;
};

function createSession(messages: MessageRow[], fileEntries: FileEntry[] = []) {
  const state = { messages: [...messages] };
  const rewriteCalls: string[] = [];
  const byId = new Map(fileEntries.map((entry) => [entry.id, entry]));
  const session = {
    agent: {
      state,
      replaceMessages: (next: MessageRow[]) => {
        state.messages = [...next];
      },
    },
    sessionManager: {
      fileEntries,
      byId,
      _rewriteFile: () => rewriteCalls.push("rewrite"),
    },
  };
  return { session: session as unknown as AgentSession, state, fileEntries, byId, rewriteCalls };
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

  test("tombstones orphan tool results in session-manager file entries", () => {
    const { session, fileEntries, byId, rewriteCalls } = createSession(
      [],
      [
        { type: "message", id: "compact", parentId: "aborted", message: { role: "compactionSummary" } },
        { type: "message", id: "late-tool-result", parentId: "compact", message: { role: "toolResult", toolCallId: "call-late-after-compaction" } },
      ],
    );

    const pruned = pruneOrphanToolResults(session, "web:test");

    expect(pruned).toBe(1);
    expect(fileEntries[1]).toEqual({ type: "pruned", id: "late-tool-result", parentId: "compact" });
    expect(byId.get("late-tool-result")).toEqual({ type: "pruned", id: "late-tool-result", parentId: "compact" });
    expect(rewriteCalls).toEqual(["rewrite"]);
  });

  test("matches OpenAI/Codex base tool call ids when stored ids include encrypted suffixes", () => {
    const { session, state } = createSession([
      { role: "assistant", content: [{ type: "toolCall", id: "call-1|encrypted-signature" }] },
      { role: "toolResult", toolCallId: "call-1" },
      { role: "toolResult", toolCallId: "call-orphan|encrypted-signature" },
    ]);

    const pruned = pruneOrphanToolResults(session, "web:test");

    expect(pruned).toBe(1);
    expect(state.messages.some((msg) => msg.role === "toolResult" && msg.toolCallId === "call-1")).toBe(true);
    expect(state.messages.some((msg) => msg.role === "toolResult" && msg.toolCallId?.startsWith("call-orphan"))).toBe(false);
  });

  test("keeps file-entry tool results linked to file-entry assistant tool calls", () => {
    const { session, fileEntries } = createSession(
      [],
      [
        { type: "message", id: "assistant", message: { role: "assistant", content: [{ type: "toolCall", id: "call-1" }] } },
        { type: "message", id: "tool", parentId: "assistant", message: { role: "toolResult", toolCallId: "call-1" } },
      ],
    );

    const pruned = pruneOrphanToolResults(session, "web:test");

    expect(pruned).toBe(0);
    expect(fileEntries[1]?.type).toBe("message");
  });

  test("is a no-op when session has no internal messages array", () => {
    const session = {} as AgentSession;
    expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
  });
});

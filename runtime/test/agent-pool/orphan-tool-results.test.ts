/**
 * test/agent-pool/orphan-tool-results.test.ts – Unit tests for orphan tool-result pruning.
 */

import { describe, expect, spyOn, test } from "bun:test";
import { SessionManager, type AgentSession } from "@earendil-works/pi-coding-agent";
import { pruneOrphanToolResults } from "../../src/agent-pool/orphan-tool-results.js";

type MessageRow = {
  role?: string;
  toolCallId?: string;
  content?: Array<{ type?: string; id?: string; tool_use_id?: string }>;
};

function createSession(messages: MessageRow[], manager = SessionManager.inMemory()) {
  // Canonical history is real even in the unit fixture; a live-array-only fake
  // cannot detect results returning on the next SDK refresh.
  for (const message of messages) manager.appendMessage(message as Parameters<SessionManager["appendMessage"]>[0]);
  const state = { messages: manager.buildSessionContext().messages as MessageRow[] };
  const session = {
    sessionManager: manager,
    agent: { state },
    isIdle: true,
    refreshContext: () => { state.messages = manager.buildSessionContext().messages as MessageRow[]; },
  };
  return { session: session as unknown as AgentSession, state, manager };
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

  test("is a no-op without canonical context APIs, never falling back to live-array mutation", () => {
    expect(pruneOrphanToolResults({} as AgentSession, "web:test")).toBe(0);
    const messages = [{ role: "toolResult", toolCallId: "orphan" }];
    expect(pruneOrphanToolResults({ agent: { state: { messages } } } as unknown as AgentSession, "web:test")).toBe(0);
    expect(messages).toHaveLength(1);
  });

  test("repair is append-only, survives refresh and is idempotent", () => {
    const { session, state, manager } = createSession([
      { role: "user", content: [{ type: "text", id: "request" }] },
      { role: "toolResult", toolCallId: "orphan" },
    ]);
    manager.appendModelChange("fixture", "fixture-model");
    manager.appendThinkingLevelChange("high");
    const before = structuredClone(manager.getEntries());
    const targetId = before[1]!.id;
    expect(pruneOrphanToolResults(session, "web:test")).toBe(1);
    expect(manager.getEntries().slice(0, before.length)).toEqual(before);
    expect(manager.getLeafEntry()).toMatchObject({ type: "context_edit", targetId, replacement: null });
    session.refreshContext();
    expect(state.messages).toHaveLength(1);
    const count = manager.getEntryCount();
    expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
    expect(manager.getEntryCount()).toBe(count);
    expect(manager.buildSessionContext()).toMatchObject({ model: { provider: "fixture", modelId: "fixture-model" }, thinkingLevel: "high" });
  });

  test("uses canonical projection rather than a stale live messages array", () => {
    const { session, state } = createSession([{ role: "toolResult", toolCallId: "orphan" }]);
    state.messages = [{ role: "assistant", content: [{ type: "text" }] }];
    expect(pruneOrphanToolResults(session, "web:test")).toBe(1);
    expect(state.messages).toEqual([]);
  });

  test("edits the projected content rather than resurrecting blocks removed by earlier edits", () => {
    const { session, state, manager } = createSession([
      { role: "user", content: [{ type: "text", id: "raw-only" }, { type: "tool_result", tool_use_id: "orphan" }] },
    ]);
    const target = manager.getLeafId()!;
    manager.appendContextEdit(target, { content: [
      { type: "text", text: "projected text" },
      { type: "tool_result", tool_use_id: "orphan" },
    ] as any });
    expect(pruneOrphanToolResults(session, "web:test")).toBe(1);
    session.refreshContext();
    expect(state.messages[0]!.content).toEqual([{ type: "text", text: "projected text" }]);
    expect(manager.getLeafEntry()).toMatchObject({ targetId: target, replacement: { content: [{ type: "text", text: "projected text" }] } });
  });

  test("keeps edits local to the active branch and never matches calls from an abandoned branch", () => {
    const { session, state, manager } = createSession([{ role: "user", content: [{ type: "text" }] }]);
    const root = manager.getLeafId()!;
    manager.appendMessage({ role: "assistant", content: [{ type: "toolCall", id: "branch-call" }] } as any);
    manager.branch(root);
    const orphan = manager.appendMessage({ role: "toolResult", toolCallId: "branch-call" } as any);
    expect(pruneOrphanToolResults(session, "web:test")).toBe(1);
    const editedLeaf = manager.getLeafId()!;
    expect(manager.getLeafEntry()).toMatchObject({ targetId: orphan, replacement: null });
    manager.branch(orphan);
    session.refreshContext();
    expect(state.messages.some((message) => message.toolCallId === "branch-call")).toBe(true);
    manager.branch(editedLeaf);
    session.refreshContext();
    expect(state.messages.some((message) => message.toolCallId === "branch-call")).toBe(false);
  });

  test("a call summarized away by compaction cannot validate a kept result", () => {
    const { session, state, manager } = createSession([
      { role: "assistant", content: [{ type: "toolCall", id: "summarized-call" }] },
      { role: "toolResult", toolCallId: "summarized-call" },
    ]);
    const kept = manager.getLeafId()!;
    manager.appendCompaction("summary", kept, 1000);
    expect(pruneOrphanToolResults(session, "web:test")).toBe(1);
    session.refreshContext();
    expect(state.messages.some((message) => message.role === "toolResult")).toBe(false);
    expect(state.messages[0]!.role).toBe("compactionSummary");
  });

  test("retain-none compaction does not append edits for summarized raw results", () => {
    const { session, state, manager } = createSession([{ role: "toolResult", toolCallId: "raw-orphan" }]);
    manager.appendCompaction("retained summary", null, 1000);
    const before = manager.getEntryCount();
    expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
    expect(manager.getEntryCount()).toBe(before);
    session.refreshContext();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]!.role).toBe("compactionSummary");
  });

  for (const flag of ["isIdle", "isStreaming", "isCompacting", "isRetrying"] as const) {
    test(`does not edit canonical or live context while ${flag} indicates in-flight work`, () => {
      const { session, state, manager } = createSession([{ role: "toolResult", toolCallId: "orphan" }]);
      Object.defineProperty(session, flag, { value: flag !== "isIdle", configurable: true });
      const before = structuredClone(manager.getEntries());
      expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
      expect(manager.getEntries()).toEqual(before);
      expect(state.messages).toHaveLength(1);
      Object.defineProperty(session, flag, { value: flag === "isIdle", configurable: true });
      expect(pruneOrphanToolResults(session, "web:test")).toBe(1);
      expect(state.messages).toEqual([]);
    });
  }

  test("failed appends leave raw history alone and a later boundary can retry", () => {
    const { session, state, manager } = createSession([{ role: "toolResult", toolCallId: "orphan" }]);
    const before = structuredClone(manager.getEntries());
    const append = spyOn(manager, "appendContextEdit").mockImplementation(() => { throw new Error("fixture persistence failed"); });
    try {
      expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
      expect(manager.getEntries()).toEqual(before);
      expect(state.messages).toHaveLength(1);
    } finally {
      append.mockRestore();
    }
    expect(pruneOrphanToolResults(session, "web:test")).toBe(1);
  });

  test("partial append failure refreshes successful edits without duplicating them on retry", () => {
    const { session, state, manager } = createSession([
      { role: "toolResult", toolCallId: "orphan-1" },
      { role: "toolResult", toolCallId: "orphan-2" },
    ]);
    const appendOriginal = manager.appendContextEdit.bind(manager);
    let calls = 0;
    const append = spyOn(manager, "appendContextEdit").mockImplementation((...args) => {
      if (++calls === 2) throw new Error("fixture second append failed");
      return appendOriginal(...args);
    });
    try {
      expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
      expect(state.messages.map((message) => message.toolCallId)).toEqual(["orphan-2"]);
    } finally {
      append.mockRestore();
    }
    expect(pruneOrphanToolResults(session, "web:test")).toBe(1);
    expect(manager.getEntries().filter((entry) => entry.type === "context_edit")).toHaveLength(2);
    expect(state.messages).toEqual([]);
  });

  test("retries refresh failure without discarding or duplicating canonical edits", () => {
    const { session, state, manager } = createSession([{ role: "toolResult", toolCallId: "orphan" }]);
    const refresh = spyOn(session, "refreshContext").mockImplementationOnce(() => { throw new Error("fixture refresh failed"); });
    try {
      expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
      expect(state.messages).toEqual([]);
      expect(manager.getEntries().filter((entry) => entry.type === "context_edit")).toHaveLength(1);
      expect(pruneOrphanToolResults(session, "web:test")).toBe(0);
    } finally {
      refresh.mockRestore();
    }
  });
});

/**
 * smart-compaction.test.ts – unit tests for selective-fragment compaction.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// We test the module by importing its factory and invoking it with a
// mock ExtensionAPI, then firing the session_before_compact handler.
//
// Since the extension is a factory function that registers an event handler,
// we need to capture that handler and call it with test data.

// ---------------------------------------------------------------------------
// Helpers to build test messages
// ---------------------------------------------------------------------------

function userMsg(text: string, ts = Date.now()) {
  return {
    role: "user" as const,
    content: [{ type: "text" as const, text }],
    timestamp: ts,
  };
}

function _assistantTextMsg(text: string, ts = Date.now()) {
  return {
    role: "assistant" as const,
    content: [{ type: "text" as const, text }],
    timestamp: ts,
  };
}

function assistantToolCallMsg(
  toolCalls: { id: string; name: string; args: Record<string, unknown> }[],
  ts = Date.now(),
) {
  return {
    role: "assistant" as const,
    content: toolCalls.map((tc) => ({
      type: "toolCall" as const,
      id: tc.id,
      name: tc.name,
      arguments: tc.args,
    })),
    timestamp: ts,
  };
}

function toolResultMsg(
  toolCallId: string,
  toolName: string,
  text: string,
  ts = Date.now(),
) {
  return {
    role: "toolResult" as const,
    toolCallId,
    toolName,
    content: [{ type: "text" as const, text }],
    isError: false,
    timestamp: ts,
  };
}

function bashExecutionMsg(command: string, output = "(no output)", ts = Date.now()) {
  return {
    role: "bashExecution" as const,
    command,
    output,
    timestamp: ts,
  };
}

function customMsg(text: string, ts = Date.now()) {
  return {
    role: "custom" as const,
    customType: "note",
    content: text,
    timestamp: ts,
  };
}

// ---------------------------------------------------------------------------
// Build a large conversation (>40 messages) for selective threshold
// ---------------------------------------------------------------------------

function buildLargeConversation(messageCount: number) {
  const msgs: any[] = [];
  for (let i = 0; i < messageCount; i++) {
    const phase = i % 3;
    if (phase === 0) {
      msgs.push(userMsg(`User message ${i}: please do task ${i}`));
    } else if (phase === 1) {
      msgs.push(
        assistantToolCallMsg([
          {
            id: `tc-${i}`,
            name: i % 6 === 1 ? "read" : "edit",
            args: { path: `/workspace/file-${i}.ts` },
          },
        ]),
      );
    } else {
      msgs.push(
        toolResultMsg(`tc-${i - 1}`, i % 6 === 2 ? "read" : "edit", `Result for task ${i}`),
      );
    }
  }
  return msgs;
}

// ---------------------------------------------------------------------------
// Mock setup
// ---------------------------------------------------------------------------

// Mock completeSimple before importing the module under test
vi.mock("@earendil-works/pi-ai", () => ({
  completeSimple: vi.fn(),
}));

// Mock convertToLlm with the upstream behaviors we care about in these tests.
vi.mock("@earendil-works/pi-coding-agent", () => ({
  convertToLlm: (msgs: any[]) => msgs.flatMap((m: any) => {
    switch (m.role) {
      case "compactionSummary":
        return [{
          role: "user",
          content: [{ type: "text", text: `The conversation history before this point was compacted into the following summary:\n\n<summary>\n${m.summary}\n</summary>` }],
          timestamp: m.timestamp,
        }];
      case "branchSummary":
        return [{
          role: "user",
          content: [{ type: "text", text: `The following is a summary of a branch that this conversation came back from:\n\n<summary>\n${m.summary}\n</summary>` }],
          timestamp: m.timestamp,
        }];
      case "bashExecution":
        return [{
          role: "user",
          content: [{ type: "text", text: `Ran \`${m.command}\`\n\n${m.output ?? "(no output)"}` }],
          timestamp: m.timestamp,
        }];
      case "custom":
        return [{
          role: "user",
          content: typeof m.content === "string" ? [{ type: "text", text: m.content }] : m.content,
          timestamp: m.timestamp,
        }];
      default:
        return [m];
    }
  }),
}));

import { completeSimple } from "@earendil-works/pi-ai";
import {
  buildProgressiveCompactionChunks,
  getProgressiveCompactionBudget,
  smartCompaction,
} from "../../src/extensions/smart-compaction.js";

describe("smart-compaction", () => {
  let handler: ((event: any, ctx: any) => Promise<any>) | null = null;

  beforeEach(() => {
    handler = null;
    // Capture the registered handler
    const mockPi = {
      on: (eventName: string, fn: any) => {
        if (eventName === "session_before_compact") handler = fn;
      },
    };
    smartCompaction(mockPi as any);
    vi.clearAllMocks();
  });

  function makeCtx(overrides: Partial<any> = {}) {
    return {
      ui: { notify: vi.fn(), setWorkingIndicator: vi.fn(), clearWorkingIndicator: vi.fn(), setWorkingMessage: vi.fn(), setStatus: vi.fn() },
      model: { provider: "test", id: "test-model", reasoning: false, contextWindow: 128000 },
      modelRegistry: {
        getApiKeyAndHeaders: vi.fn().mockResolvedValue({ ok: true, apiKey: "test-key" }),
        getAll: vi.fn().mockReturnValue([]),
      },
      sessionManager: { getSessionId: () => "test-session-1" },
      ...overrides,
    };
  }

  function makePreparation(messageCount: number, overrides: Partial<any> = {}) {
    return {
      messagesToSummarize: buildLargeConversation(messageCount),
      tokensBefore: messageCount * 100,
      firstKeptEntryId: "kept-entry-1",
      previousSummary: undefined,
      settings: { enabled: true, reserveTokens: 16384, keepRecentTokens: 20000 },
      fileOps: {
        read: new Set(["/workspace/file-2.ts", "/workspace/file-8.ts"]),
        written: new Set<string>(),
        edited: new Set(["/workspace/file-4.ts"]),
      },
      isSplitTurn: false,
      turnPrefixMessages: [],
      ...overrides,
    };
  }

  it("registers the session_before_compact handler", () => {
    expect(handler).toBeTypeOf("function");
  });

  it("falls through for short conversations (< threshold)", async () => {
    const prep = makePreparation(10);
    const ctx = makeCtx();
    const result = await handler!(
      {
        preparation: prep,
        branchEntries: [],
        signal: new AbortController().signal,
      },
      ctx,
    );
    expect(result).toBeUndefined();
    expect(completeSimple).not.toHaveBeenCalled();
  });

  it("invokes LLM with selective prompt for large conversations", async () => {
    const summaryText = "## Goal\nTest goal\n\n## Constraints & Preferences\n- none\n\n## Progress\n### Done\n- [x] Something\n\n### In Progress\n\n### Blocked\n\n## Key Decisions\n\n## Next Steps\n\n## Critical Context\n- context";

    (completeSimple as any).mockResolvedValueOnce({
      content: [{ type: "text", text: summaryText }],
      stopReason: "end",
    });

    const prep = makePreparation(60);
    const ctx = makeCtx();
    const result = await handler!(
      {
        preparation: prep,
        branchEntries: [],
        signal: new AbortController().signal,
      },
      ctx,
    );

    expect(completeSimple).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result.compaction).toBeDefined();
    expect(result.compaction.summary).toContain("Test goal");
    expect(result.compaction.firstKeptEntryId).toBe("kept-entry-1");
    expect(result.compaction.tokensBefore).toBe(6000);

    // Should notify progress
    expect(ctx.ui.notify).toHaveBeenCalledWith(
      expect.stringContaining("Smart compaction:"),
      "info",
    );
    expect(ctx.ui.notify).toHaveBeenCalledWith(
      "Smart compaction complete ✓",
      "info",
    );
    expect(ctx.ui.setStatus).toHaveBeenCalledWith(
      "context_usage",
      expect.stringContaining('"source":"smart_compaction"'),
    );
    const contextStatusPayloads = ctx.ui.setStatus.mock.calls
      .filter(([key]: [string]) => key === "context_usage")
      .map(([, text]: [string, string]) => JSON.parse(text));
    expect(contextStatusPayloads.map((payload: any) => payload.phase)).toEqual(
      expect.arrayContaining(["scanning", "generating_summary", "completed_estimate"]),
    );
    expect(contextStatusPayloads[0]).toMatchObject({
      tokens: 6000,
      contextWindow: 128000,
      estimated: true,
      source: "smart_compaction",
      phase: "scanning",
    });
  });

  it("forwards apiKey-only auth to completeSimple", async () => {
    const summaryText = "## Goal\nApiKey auth\n\n## Current Active Topic\n- test\n\n## Historical / Background Context\n- none\n\n## Constraints & Preferences\n- none\n\n## Progress\n### Done\n- [x] auth\n\n### In Progress\n\n### Blocked\n\n## Key Decisions\n\n## Next Steps\n\n## Critical Context\n- context";

    (completeSimple as any).mockResolvedValueOnce({
      content: [{ type: "text", text: summaryText }],
      stopReason: "end",
    });

    const ctx = makeCtx({
      modelRegistry: {
        getApiKey: vi.fn().mockResolvedValue("simple-key"),
        getAll: vi.fn().mockReturnValue([]),
      },
    });

    const result = await handler!(
      {
        preparation: makePreparation(60),
        branchEntries: [],
        signal: new AbortController().signal,
      },
      ctx,
    );

    expect(result).toBeDefined();
    expect(completeSimple).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        apiKey: "simple-key",
      }),
    );
  });

  it("appends deterministic file lists to summary", async () => {
    const summaryText = "## Goal\nAppend files test\n\n## Constraints\n- x\n\n## Progress\n### Done\n- [x] test\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

    (completeSimple as any).mockResolvedValueOnce({
      content: [{ type: "text", text: summaryText }],
      stopReason: "end",
    });

    const prep = makePreparation(60, {
      fileOps: {
        read: new Set(["/a.ts", "/b.ts"]),
        written: new Set(["/c.ts"]),
        edited: new Set(["/d.ts"]),
      },
    });
    const result = await handler!(
      {
        preparation: prep,
        branchEntries: [],
        signal: new AbortController().signal,
      },
      makeCtx(),
    );

    expect(result.compaction.summary).toContain("<read-files>");
    expect(result.compaction.summary).toContain("/a.ts");
    expect(result.compaction.summary).toContain("/b.ts");
    expect(result.compaction.summary).toContain("<modified-files>");
    expect(result.compaction.summary).toContain("/c.ts");
    expect(result.compaction.summary).toContain("/d.ts");
    // read-only files should NOT include modified ones
    expect(
      result.compaction.summary.split("<read-files>")[1].split("</read-files>")[0],
    ).not.toContain("/c.ts");
  });

  it("compresses top-level file clusters even when one outlier breaks the global prefix", async () => {
    (completeSimple as any).mockResolvedValueOnce({
      content: [{ type: "text", text: "## Goal\nTest\n\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
      stopReason: "end",
    });

    const prep = makePreparation(60, {
      fileOps: {
        read: new Set([
          "piclaw/runtime/src/agent-control/handlers/login.ts",
          "piclaw/runtime/src/channels/web/http/dispatch-agent.ts",
          "piclaw/runtime/test/agent-control/agent-control-handlers.test.ts",
          "piclaw/runtime/test/scripts/check-import-boundaries.test.ts",
          "piclaw/runtime/web/src/components/settings/providers.ts",
          "piclaw/scripts/check-import-boundaries.test.ts",
          "notes/reference/pr474-dispatch.md",
        ]),
        written: new Set<string>(),
        edited: new Set<string>(),
      },
    });

    const result = await handler!(
      {
        preparation: prep,
        branchEntries: [],
        signal: new AbortController().signal,
      },
      makeCtx(),
    );

    const readFilesBlock = result.compaction.summary.split("<read-files>")[1].split("</read-files>")[0];
    expect(readFilesBlock).toContain("base: piclaw/");
    expect(readFilesBlock).toContain("runtime/src/agent-control/handlers/login.ts");
    expect(readFilesBlock).toContain("notes/reference/pr474-dispatch.md");
    expect(readFilesBlock).not.toContain("piclaw/runtime/src/agent-control/handlers/login.ts");
  });

  it.skip("filters junk paths after normalization for both read and modified files", async () => {
    (completeSimple as any).mockResolvedValueOnce({
      content: [{ type: "text", text: "## Goal\nTest\n\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
      stopReason: "end",
    });

    const prep = makePreparation(60, {
      fileOps: {
        read: new Set([
          "/workspace/piclaw/runtime/src/channels/web/http/dispatch-agent.ts",
          "tmp/pr474-dispatch.patch",
          ".piclaw/tmp/pi-bash-123.log",
          ".pi/agent/sessions/abc/session.jsonl",
          "node_modules/pkg/index.js",
        ]),
        written: new Set([
          "/workspace/piclaw/runtime/src/utils/logger.ts",
          "tmp/edit_probe.txt",
          ".piclaw/tmp/pi-edit-123.log",
        ]),
        edited: new Set([
          "/workspace/piclaw/runtime/src/extensions/observability.ts",
          ".pi/agent/models.json",
        ]),
      },
    });

    const result = await handler!(
      {
        preparation: prep,
        branchEntries: [],
        signal: new AbortController().signal,
      },
      makeCtx(),
    );

    const readFilesBlock = result.compaction.summary.split("<read-files>")[1].split("</read-files>")[0];
    const modifiedFilesBlock = result.compaction.summary.split("<modified-files>")[1].split("</modified-files>")[0];

    expect(readFilesBlock).toContain("runtime/src/channels/web/http/dispatch-agent.ts");
    expect(readFilesBlock).not.toContain("tmp/pr474-dispatch.patch");
    expect(readFilesBlock).not.toContain(".piclaw/tmp/pi-bash-123.log");
    expect(readFilesBlock).not.toContain(".pi/agent/sessions/abc/session.jsonl");
    expect(readFilesBlock).not.toContain("node_modules/pkg/index.js");

    expect(modifiedFilesBlock).toContain("runtime/src/extensions/observability.ts");
    expect(modifiedFilesBlock).toContain("runtime/src/utils/logger.ts");
    expect(modifiedFilesBlock).not.toContain("tmp/edit_probe.txt");
    expect(modifiedFilesBlock).not.toContain(".piclaw/tmp/pi-edit-123.log");
    expect(modifiedFilesBlock).not.toContain(".pi/agent/models.json");
  });

  it("falls through on LLM error", async () => {
    (completeSimple as any).mockResolvedValueOnce({
      content: [],
      stopReason: "error",
      errorMessage: "Rate limited",
    });

    const ctx = makeCtx();
    const result = await handler!(
      {
        preparation: makePreparation(60),
        branchEntries: [],
        signal: new AbortController().signal,
      },
      ctx,
    );

    expect(result).toBeUndefined();
    expect(ctx.ui.notify).toHaveBeenCalledWith(
      expect.stringContaining("Smart compaction LLM error"),
      "warning",
    );
  });

  it("falls through on too-short summary", async () => {
    (completeSimple as any).mockResolvedValueOnce({
      content: [{ type: "text", text: "Short." }],
      stopReason: "end",
    });

    const ctx = makeCtx();
    const result = await handler!(
      {
        preparation: makePreparation(60),
        branchEntries: [],
        signal: new AbortController().signal,
      },
      ctx,
    );

    expect(result).toBeUndefined();
    expect(ctx.ui.notify).toHaveBeenCalledWith(
      expect.stringContaining("too short"),
      "warning",
    );
  });

  it("falls through when no auth is available", async () => {
    const ctx = makeCtx();
    ctx.modelRegistry.getApiKeyAndHeaders.mockResolvedValueOnce({ ok: false });

    const result = await handler!(
      {
        preparation: makePreparation(60),
        branchEntries: [],
        signal: new AbortController().signal,
      },
      ctx,
    );

    expect(result).toBeUndefined();
    expect(completeSimple).not.toHaveBeenCalled();
  });

  it("falls through on exception", async () => {
    (completeSimple as any).mockRejectedValueOnce(new Error("Network error"));

    const ctx = makeCtx();
    const result = await handler!(
      {
        preparation: makePreparation(60),
        branchEntries: [],
        signal: new AbortController().signal,
      },
      ctx,
    );

    expect(result).toBeUndefined();
    expect(ctx.ui.notify).toHaveBeenCalledWith(
      expect.stringContaining("Network error"),
      "warning",
    );
  });

  it("respects abort signal", async () => {
    const ac = new AbortController();
    ac.abort();

    // Handler should return { cancel: true } before reaching completeSimple
    // because the signal is already aborted at entry.

    const result = await handler!(
      {
        preparation: makePreparation(60),
        branchEntries: [],
        signal: ac.signal,
      },
      makeCtx(),
    );

    // Should return cancel (not a compaction result) when aborted
    expect(result).toEqual({ cancel: true });
    // Should never reach the LLM call
    expect(completeSimple).not.toHaveBeenCalled();
  });

  it("does not skip file sections if summary already has them", async () => {
    const summaryWithFiles =
      "## Goal\nTest\n<read-files>\n/already.ts\n</read-files>\n<modified-files>\n/already-mod.ts\n</modified-files>\n\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

    (completeSimple as any).mockResolvedValueOnce({
      content: [{ type: "text", text: summaryWithFiles }],
      stopReason: "end",
    });

    const result = await handler!(
      {
        preparation: makePreparation(60),
        branchEntries: [],
        signal: new AbortController().signal,
      },
      makeCtx(),
    );

    // Should NOT double-append file sections
    const readCount = (
      result.compaction.summary.match(/<read-files>/g) || []
    ).length;
    expect(readCount).toBe(1);
  });

  it("sends previous summary to LLM for iterative update", async () => {
    const prevSummary = "## Goal\nPrevious goal\n## Progress\n### Done\n- [x] old task";
    const summaryText = "## Goal\nUpdated goal\n\n## Constraints\n- x\n## Progress\n### Done\n- [x] old task\n- [x] new task\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

    (completeSimple as any).mockResolvedValueOnce({
      content: [{ type: "text", text: summaryText }],
      stopReason: "end",
    });

    const prep = makePreparation(60, { previousSummary: prevSummary });

    await handler!(
      {
        preparation: prep,
        branchEntries: [],
        signal: new AbortController().signal,
      },
      makeCtx(),
    );

    // Check the prompt sent to completeSimple includes previous summary
    const call = (completeSimple as any).mock.calls[0];
    const promptContent = call[1].messages[0].content[0].text;
    expect(promptContent).toContain("Previous Summary");
    expect(promptContent).toContain("Previous goal");
  });

  describe("progressive iterative compaction", () => {
    it("derives smaller prompt budgets for smaller-context models", () => {
      const small = getProgressiveCompactionBudget({ contextWindow: 8_000 });
      const large = getProgressiveCompactionBudget({ contextWindow: 128_000 });

      expect(small.promptBudgetChars).toBeLessThan(large.promptBudgetChars);
      expect(small.chunkBudgetChars).toBeLessThanOrEqual(small.promptBudgetChars);
      expect(large.promptBudgetChars).toBeLessThanOrEqual(60_000);
    });

    it("splits deterministic chunks in order without dropping key continuity facts", () => {
      const messages = Array.from({ length: 12 }, (_, i) => userMsg(`fact-${String(i).padStart(2, "0")} ${"x".repeat(180)}`));
      const chunks = buildProgressiveCompactionChunks(messages as any, 500, new Set(messages.map((_, i) => i)));
      const joined = chunks.map((chunk) => chunk.text).join("\n");

      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.map((chunk) => chunk.index)).toEqual(chunks.map((_, i) => i + 1));
      expect(chunks[0].startMessageIndex).toBe(0);
      expect(chunks.at(-1)?.endMessageIndex).toBe(11);
      expect(joined).toContain("fact-00");
      expect(joined).toContain("fact-11");
      for (let i = 1; i < chunks.length; i++) {
        expect(chunks[i].startMessageIndex).toBeGreaterThan(chunks[i - 1].endMessageIndex);
      }
    });

    it("uses chunk summaries and an ordered final merge when selective prompt exceeds model budget", async () => {
      const longMessages: any[] = [];
      for (let i = 0; i < 70; i++) {
        longMessages.push(userMsg(`Important continuity fact ${i}: ${"x".repeat(900)}`));
        longMessages.push(_assistantTextMsg(`Acknowledged fact ${i}.`));
      }

      (completeSimple as any).mockImplementation(async (_model: any, context: any) => {
        const prompt = context.messages[0].content[0].text as string;
        if (prompt.includes("deterministic chunk")) {
          const range = prompt.match(/Message index range: ([0-9-]+)/)?.[1] ?? "unknown";
          return {
            content: [{ type: "text", text: `## Chunk Range\n- ${range}\n\n## Goals / User Intent\n- Preserve chunk ${range}\n\n## Constraints & Preferences\n- none\n\n## Decisions\n- none\n\n## Files / Commands / Tool Outcomes\n- none\n\n## Progress\n- Done: chunk summarized\n- In progress: final merge\n- Blocked: none\n\n## Open Questions / Next Steps\n- merge\n\n## Key Continuity Facts\n- Important continuity fact in ${range}` }],
            stopReason: "end",
          };
        }
        return {
          content: [{ type: "text", text: "## Goal\nProgressive final goal\n\n## Current Active Topic\n- progressive compaction\n\n## Historical / Background Context\n- ordered chunk summaries preserved\n\n## Constraints & Preferences\n- preserve facts\n\n## Progress\n### Done\n- [x] chunks summarized\n\n### In Progress\n- [ ] final validation\n\n### Blocked\n- none\n\n## Key Decisions\n- **Progressive mode**: chunk then merge\n\n## Next Steps\n1. validate\n\n## Critical Context\n- Important continuity fact 0\n- Important continuity fact 69" }],
          stopReason: "end",
        };
      });

      const ctx = makeCtx({ model: { provider: "test", id: "small-context", contextWindow: 8_000, reasoning: false } });
      const result = await handler!(
        {
          preparation: makePreparation(longMessages.length, {
            messagesToSummarize: longMessages,
            tokensBefore: 90_000,
            fileOps: {
              read: new Set<string>(),
              written: new Set<string>(),
              edited: new Set(["/workspace/progressive.ts"]),
            },
          }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        ctx,
      );

      expect(result.compaction.summary).toContain("Progressive final goal");
      expect(result.compaction.summary).toContain("Important continuity fact 69");
      expect((completeSimple as any).mock.calls.length).toBeGreaterThan(1);
      const prompts = (completeSimple as any).mock.calls.map((call: any[]) => call[1].messages[0].content[0].text as string);
      expect(prompts.filter((prompt: string) => prompt.includes("deterministic chunk")).length).toBeGreaterThan(1);
      expect(prompts.at(-1)).toContain("Ordered Intermediate Summaries");
      expect(ctx.ui.notify).toHaveBeenCalledWith(expect.stringContaining("Progressive compaction"), "info");
    });
  });

  describe("session isolation", () => {
    it("each factory invocation gets independent handler state", () => {
      // Call the factory twice, simulating two parallel sessions
      let handler1: any = null;
      let handler2: any = null;

      const mockPi1 = {
        on: (_: string, fn: any) => {
          handler1 = fn;
        },
      };
      const mockPi2 = {
        on: (_: string, fn: any) => {
          handler2 = fn;
        },
      };

      smartCompaction(mockPi1 as any);
      smartCompaction(mockPi2 as any);

      // Both handlers exist and are independent function references
      expect(handler1).toBeTypeOf("function");
      expect(handler2).toBeTypeOf("function");
      expect(handler1).not.toBe(handler2);
    });

    it("handler only processes preparation data from its own event", async () => {
      const summaryA = "## Goal\nSession A goal\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context\n- session A";
      const summaryB = "## Goal\nSession B goal\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context\n- session B";

      // First call returns session A summary
      (completeSimple as any).mockResolvedValueOnce({
        content: [{ type: "text", text: summaryA }],
        stopReason: "end",
      });
      // Second call returns session B summary
      (completeSimple as any).mockResolvedValueOnce({
        content: [{ type: "text", text: summaryB }],
        stopReason: "end",
      });

      const prepA = makePreparation(60, { firstKeptEntryId: "session-A-entry" });
      const prepB = makePreparation(50, { firstKeptEntryId: "session-B-entry" });

      const [resultA, resultB] = await Promise.all([
        handler!(
          {
            preparation: prepA,
            branchEntries: [],
            signal: new AbortController().signal,
          },
          makeCtx(),
        ),
        handler!(
          {
            preparation: prepB,
            branchEntries: [],
            signal: new AbortController().signal,
          },
          makeCtx(),
        ),
      ]);

      // Each result uses its own preparation data
      expect(resultA.compaction.firstKeptEntryId).toBe("session-A-entry");
      expect(resultA.compaction.summary).toContain("Session A");
      expect(resultB.compaction.firstKeptEntryId).toBe("session-B-entry");
      expect(resultB.compaction.summary).toContain("Session B");
    });
  });

  describe("no-op detection", () => {
    it("skips LLM for split-turn continuation (0 user messages)", async () => {
      // Build a window with only assistant tool calls and tool results — no user messages
      const splitTurnMsgs: any[] = [];
      for (let i = 0; i < 60; i++) {
        if (i % 2 === 0) {
          splitTurnMsgs.push(
            assistantToolCallMsg([
              { id: `tc-${i}`, name: "edit", args: { path: `/workspace/file-${i}.ts` } },
            ]),
          );
        } else {
          splitTurnMsgs.push(
            toolResultMsg(`tc-${i - 1}`, "edit", `Edited file-${i}.ts successfully`),
          );
        }
      }

      const prep = makePreparation(60, {
        messagesToSummarize: splitTurnMsgs,
        previousSummary:
          "## Goal\nImplement feature X\n\n## Constraints\n- none\n\n## Progress\n### Done\n- [x] Started\n### In Progress\n- [ ] Working\n### Blocked\n\n## Key Decisions\n\n## Next Steps\n1. Continue\n\n## Critical Context\n- Important stuff",
        fileOps: {
          read: new Set(["/a.ts"]),
          written: new Set<string>(),
          edited: new Set(["/b.ts", "/c.ts"]),
        },
        isSplitTurn: true,
      });

      const ctx = makeCtx();
      const result = await handler!(
        {
          preparation: prep,
          branchEntries: [],
          signal: new AbortController().signal,
        },
        ctx,
      );

      // Should NOT call the LLM
      expect(completeSimple).not.toHaveBeenCalled();

      // Should return a compaction result
      expect(result).toBeDefined();
      expect(result.compaction).toBeDefined();
      expect(result.compaction.summary).toContain("Implement feature X"); // preserved from previous
      expect(result.compaction.summary).toContain("Split-Turn Continuation"); // delta appended
      expect(result.compaction.summary).toContain("split-turn"); // mechanical delta
      expect(result.compaction.summary).toContain("<modified-files>"); // file lists updated

      // Should notify
      expect(ctx.ui.notify).toHaveBeenCalledWith(
        expect.stringContaining("split-turn continuation"),
        "info",
      );
    });

    it("skips LLM for minimal content (tiny user input, no modifications)", async () => {
      // User sent < 100 chars, no writes/edits
      const minimalMsgs: any[] = [
        userMsg("ok"), // 2 chars
        assistantToolCallMsg([{ id: "tc-1", name: "read", args: { path: "/a.ts" } }]),
        toolResultMsg("tc-1", "read", "file contents..."),
      ];
      // Pad to 60 messages with reads
      for (let i = 3; i < 60; i++) {
        if (i % 2 === 1) {
          minimalMsgs.push(
            assistantToolCallMsg([
              { id: `tc-${i}`, name: "read", args: { path: `/file-${i}.ts` } },
            ]),
          );
        } else {
          minimalMsgs.push(toolResultMsg(`tc-${i - 1}`, "read", `contents of file-${i}`));
        }
      }

      const prep = makePreparation(60, {
        messagesToSummarize: minimalMsgs,
        previousSummary:
          "## Goal\nExplore codebase\n\n## Constraints\n\n## Progress\n### Done\n- [x] Read files\n### In Progress\n### Blocked\n\n## Key Decisions\n\n## Next Steps\n\n## Critical Context\n- Reading files",
        fileOps: {
          read: new Set(["/a.ts", "/b.ts"]),
          written: new Set<string>(),
          edited: new Set<string>(),
        },
      });

      const ctx = makeCtx();
      const result = await handler!(
        {
          preparation: prep,
          branchEntries: [],
          signal: new AbortController().signal,
        },
        ctx,
      );

      expect(completeSimple).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.compaction.summary).toContain("Explore codebase");

      expect(ctx.ui.notify).toHaveBeenCalledWith(
        expect.stringContaining("minimal content"),
        "info",
      );
    });

    it("does NOT no-op when user has substantial input", async () => {
      const substantiveMsgs: any[] = [
        userMsg("Please refactor the authentication module to use JWT tokens instead of session cookies. This is critical for our API."),
      ];
      // Pad with reads
      for (let i = 1; i < 60; i++) {
        if (i % 2 === 1) {
          substantiveMsgs.push(
            assistantToolCallMsg([
              { id: `tc-${i}`, name: "read", args: { path: `/file-${i}.ts` } },
            ]),
          );
        } else {
          substantiveMsgs.push(toolResultMsg(`tc-${i - 1}`, "read", `contents`));
        }
      }

      const summaryText =
        "## Goal\nUpdated\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

      (completeSimple as any).mockResolvedValueOnce({
        content: [{ type: "text", text: summaryText }],
        stopReason: "end",
      });

      const prep = makePreparation(60, {
        messagesToSummarize: substantiveMsgs,
        previousSummary:
          "## Goal\nOld goal\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context",
        fileOps: {
          read: new Set(["/a.ts"]),
          written: new Set<string>(),
          edited: new Set<string>(),
        },
      });

      const result = await handler!(
        {
          preparation: prep,
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // Should call LLM since user had real input (>100 chars)
      expect(completeSimple).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it("does NOT no-op without a previous summary", async () => {
      const splitTurnMsgs: any[] = [];
      for (let i = 0; i < 60; i++) {
        splitTurnMsgs.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "edit", args: { path: `/f${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "edit", `ok`),
        );
      }

      const summaryText =
        "## Goal\nFirst compaction\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

      (completeSimple as any).mockResolvedValueOnce({
        content: [{ type: "text", text: summaryText }],
        stopReason: "end",
      });

      const prep = makePreparation(60, {
        messagesToSummarize: splitTurnMsgs,
        previousSummary: undefined, // No previous summary
        fileOps: {
          read: new Set<string>(),
          written: new Set<string>(),
          edited: new Set(["/f0.ts"]),
        },
      });

      await handler!(
        {
          preparation: prep,
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // Without previous summary, can't do no-op → falls through to LLM
      expect(completeSimple).toHaveBeenCalledTimes(1);
    });

    it("does not classify a non-split tool-only window as split-turn continuation", async () => {
      const summaryText =
        "## Goal\nFresh summary\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

      (completeSimple as any).mockResolvedValueOnce({
        content: [{ type: "text", text: summaryText }],
        stopReason: "end",
      });

      const splitLikeMsgs: any[] = [];
      for (let i = 0; i < 60; i++) {
        splitLikeMsgs.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "edit", args: { path: `/f${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "edit", `ok`),
        );
      }

      await handler!(
        {
          preparation: makePreparation(60, {
            messagesToSummarize: splitLikeMsgs,
            previousSummary:
              "## Goal\nOld summary\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context",
            isSplitTurn: false,
          }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      expect(completeSimple).toHaveBeenCalledTimes(1);
    });

    it("does not no-op when kept messages show active current user work", async () => {
      const summaryText =
        "## Goal\nFresh summary\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

      (completeSimple as any).mockResolvedValueOnce({
        content: [{ type: "text", text: summaryText }],
        stopReason: "end",
      });

      const minimalMsgs = [userMsg("ok")];
      while (minimalMsgs.length < 60) {
        minimalMsgs.push(
          minimalMsgs.length % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${minimalMsgs.length}`, name: "read", args: { path: `/f${minimalMsgs.length}.ts` } }])
            : toolResultMsg(`tc-${minimalMsgs.length - 1}`, "read", `ok`),
        );
      }

      await handler!(
        {
          preparation: makePreparation(60, {
            messagesToSummarize: minimalMsgs,
            previousSummary:
              "## Goal\nOld summary\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context",
            isSplitTurn: false,
            fileOps: { read: new Set<string>(), written: new Set<string>(), edited: new Set<string>() },
          }),
          branchEntries: [
            { id: "older", type: "message", message: userMsg("older work") },
            { id: "kept-entry-1", type: "message", message: userMsg("New active task in kept window") },
          ],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      expect(completeSimple).toHaveBeenCalledTimes(1);
    });

    it("does not no-op a split turn when the discarded prefix contains user intent", async () => {
      const summaryText =
        "## Goal\nFresh summary\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

      (completeSimple as any).mockResolvedValueOnce({
        content: [{ type: "text", text: summaryText }],
        stopReason: "end",
      });

      const splitLikeMsgs: any[] = [];
      for (let i = 0; i < 60; i++) {
        splitLikeMsgs.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "edit", args: { path: `/f${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "edit", `ok`),
        );
      }

      await handler!(
        {
          preparation: makePreparation(60, {
            messagesToSummarize: splitLikeMsgs,
            previousSummary:
              "## Goal\nOld summary\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context",
            isSplitTurn: true,
            turnPrefixMessages: [userMsg("Actually switch to the reducer bug now")],
          }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      expect(completeSimple).toHaveBeenCalledTimes(1);
    });

    it("preserves Critical Context section in split-turn delta", async () => {
      const splitTurnMsgs = [
        assistantToolCallMsg([{ id: "tc-1", name: "write", args: { path: "/new.ts" } }]),
        toolResultMsg("tc-1", "write", "Created /new.ts"),
      ];
      // Pad to reach threshold
      for (let i = 2; i < 50; i++) {
        splitTurnMsgs.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/r${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", "ok"),
        );
      }

      const prep = makePreparation(50, {
        messagesToSummarize: splitTurnMsgs,
        previousSummary:
          "## Goal\nBuild widget\n\n## Progress\n### Done\n- [x] init\n### In Progress\n### Blocked\n\n## Critical Context\n- Widget state lives in /widget.ts\n- Uses React hooks pattern",
        fileOps: {
          read: new Set(["/r2.ts"]),
          written: new Set(["/new.ts"]),
          edited: new Set<string>(),
        },
        isSplitTurn: true,
      });

      const result = await handler!(
        {
          preparation: prep,
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      expect(completeSimple).not.toHaveBeenCalled();
      const summary = result.compaction.summary;

      // Critical Context should still be there
      expect(summary).toContain("Widget state lives in /widget.ts");
      expect(summary).toContain("Uses React hooks pattern");

      // Delta should be BEFORE Critical Context
      const deltaIdx = summary.indexOf("Split-Turn Continuation");
      const criticalIdx = summary.indexOf("## Critical Context");
      expect(deltaIdx).toBeGreaterThan(-1);
      expect(criticalIdx).toBeGreaterThan(-1);
      expect(deltaIdx).toBeLessThan(criticalIdx);
    });
  });

  describe("prompt construction", () => {
    it("includes head, tail, and gap markers for large conversations", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce(
        (_model: any, opts: any) => {
          capturedPrompt = opts.messages[0].content[0].text;
          return Promise.resolve({
            content: [
              {
                type: "text",
                text: "## Goal\nTest\n## Constraints\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context",
              },
            ],
            stopReason: "end",
          });
        },
      );

      await handler!(
        {
          preparation: makePreparation(120),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // Should have session metadata
      expect(capturedPrompt).toContain("Total messages: 120");
      expect(capturedPrompt).toContain("Session type: implementation");

      // Should have backward-walk strategy in the header
      expect(capturedPrompt).toContain("backwards walk");

      // Should have file tracking
      expect(capturedPrompt).toContain("Files Modified");
    });

    it("annotates recent topic shifts so stale topics become background", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce(
        (_model: any, opts: any) => {
          capturedPrompt = opts.messages[0].content[0].text;
          return Promise.resolve({
            content: [
              {
                type: "text",
                text: "## Goal\nInvestigate active issue\n## Current Active Topic\n- Azure streaming failures\n## Historical / Background Context\n- Widget work\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context",
              },
            ],
            stopReason: "end",
          });
        },
      );

      const messages: any[] = [
        userMsg("Implement the web widget layout and fix the sidebar overflow."),
        assistantToolCallMsg([{ id: "tc-1", name: "read", args: { path: "/workspace/widget.tsx" } }]),
        toolResultMsg("tc-1", "read", "widget source"),
        userMsg("Review the widget CSS and the pane resize behavior."),
        assistantToolCallMsg([{ id: "tc-2", name: "read", args: { path: "/workspace/widget.css" } }]),
        toolResultMsg("tc-2", "read", "css source"),
        userMsg("New topic: debug Azure gpt-5-4 streaming failures with response.failed and unknown error details."),
        assistantToolCallMsg([{ id: "tc-3", name: "read", args: { path: "/workspace/runtime/src/providers/azure.ts" } }]),
        toolResultMsg("tc-3", "read", "azure provider source"),
      ];
      for (let i = messages.length; i < 60; i++) {
        messages.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/workspace/file-${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `contents ${i}`),
        );
      }

      await handler!(
        {
          preparation: makePreparation(60, {
            messagesToSummarize: messages,
            previousSummary:
              "## Goal\nFinish widget layout\n\n## Progress\n### Done\n- [x] Started widget work\n### In Progress\n- [ ] Fix sidebar overflow\n### Blocked\n\n## Key Decisions\n\n## Next Steps\n1. Keep iterating on the widget\n\n## Critical Context\n- Widget code lives in /workspace/widget.tsx",
          }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      expect(capturedPrompt).toContain("## Detected Active Topic (from latest messages)");
      expect(capturedPrompt).toContain("Latest user request: message 6");
      expect(capturedPrompt).toContain("Recent topic shift detected between user messages 3 → 6");
      expect(capturedPrompt).toContain("Previous topic preview: \"Review the widget CSS and the pane resize behavior.\"");
      expect(capturedPrompt).toContain("New active topic preview: \"New topic: debug Azure gpt-5-4 streaming failures with response.failed and unknown error details.\"");
      expect(capturedPrompt).toContain("Treat earlier summary content as background unless it is reaffirmed after message 6.");
      expect(capturedPrompt).toContain("topic-shift boundary");
      // Should include disambiguation note before previous summary
      expect(capturedPrompt).toContain("PREVIOUS compaction summary");
    });
  });

  describe("A1 no-op safeguards", () => {
    it("does not reuse the previous summary for a tiny pivot message", async () => {
      const summaryText =
        "## Goal\nAzure streaming\n## Current Active Topic\n- Investigate Azure streaming\n## Historical / Background Context\n- Widget layout\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context";

      (completeSimple as any).mockResolvedValueOnce({
        content: [{ type: "text", text: summaryText }],
        stopReason: "end",
      });

      const messages: any[] = [
        userMsg("Fix widget layout."),
        assistantToolCallMsg([{ id: "tc-1", name: "read", args: { path: "/widget.tsx" } }]),
        toolResultMsg("tc-1", "read", "widget source"),
        userMsg("New topic: Azure streaming."),
      ];
      for (let i = messages.length; i < 60; i++) {
        messages.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/file-${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `contents ${i}`),
        );
      }

      const ctx = makeCtx();
      const result = await handler!(
        {
          preparation: makePreparation(60, {
            messagesToSummarize: messages,
            previousSummary:
              "## Goal\nWidget work\n\n## Progress\n### Done\n- [x] Started widget work\n### In Progress\n- [ ] Fix widget layout\n### Blocked\n\n## Key Decisions\n\n## Next Steps\n1. Continue widget work\n\n## Critical Context\n- Widget files are under /widget.tsx",
            fileOps: {
              read: new Set(["/widget.tsx", "/file-10.ts"]),
              written: new Set<string>(),
              edited: new Set<string>(),
            },
          }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        ctx,
      );

      expect(completeSimple).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.compaction.summary).toContain("Azure streaming");
      expect(ctx.ui.notify).not.toHaveBeenCalledWith(
        expect.stringContaining("minimal content"),
        "info",
      );
    });
  });

  describe("false-positive resilience", () => {
    // These tests verify that common coding-conversation phrases do NOT
    // incorrectly trigger pivot detection and reorganize the summary.

    function buildTwoTurnConversation(firstUserMsg: string, secondUserMsg: string) {
      const messages: any[] = [
        userMsg(firstUserMsg),
        assistantToolCallMsg([{ id: "tc-1", name: "edit", args: { path: "/workspace/auth.ts" } }]),
        toolResultMsg("tc-1", "edit", "Applied 1 edit to /workspace/auth.ts"),
        userMsg(secondUserMsg),
        assistantToolCallMsg([{ id: "tc-2", name: "edit", args: { path: "/workspace/auth.ts" } }]),
        toolResultMsg("tc-2", "edit", "Applied 1 edit to /workspace/auth.ts"),
      ];
      // Pad to reach SELECTIVE_THRESHOLD
      for (let i = messages.length; i < 60; i++) {
        messages.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/workspace/file-${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `contents ${i}`),
        );
      }
      return messages;
    }

    it("does NOT treat 'Use a Map instead of an array' as a topic shift", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nRefactor auth\n## Current Active Topic\n- auth refactor\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      const messages = buildTwoTurnConversation(
        "Refactor the authentication middleware to use JWT tokens instead of session cookies.",
        "Use a Map instead of an array for the token cache, and also fix the expiry logic.",
      );

      await handler!(
        {
          preparation: makePreparation(60, { messagesToSummarize: messages }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // 'instead' is a weak cue — should NOT fire without low overlap.
      // Both messages share auth/token vocabulary, so overlap is not low.
      expect(capturedPrompt).toContain("No explicit topic shift cue detected");
      expect(capturedPrompt).not.toContain("topic-shift boundary");
    });

    it("does NOT treat 'Go back to the file and check line 40' as a topic shift", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nFix auth\n## Current Active Topic\n- auth\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      const messages = buildTwoTurnConversation(
        "Fix the authentication middleware to validate JWT tokens and check expiry dates.",
        "Go back to the middleware file and check line 40 for the validation error in the JWT token parsing.",
      );

      await handler!(
        {
          preparation: makePreparation(60, { messagesToSummarize: messages }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // 'back to' is a weak cue, but both messages share middleware/JWT/token/validation vocabulary.
      expect(capturedPrompt).toContain("No explicit topic shift cue detected");
    });

    it("does NOT treat 'Add a switch statement for the cases' as a topic shift", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nRouter impl\n## Current Active Topic\n- router\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      const messages = buildTwoTurnConversation(
        "Implement the request router with path matching and parameter extraction logic.",
        "Add a switch statement for the different HTTP method cases in the router handler.",
      );

      await handler!(
        {
          preparation: makePreparation(60, { messagesToSummarize: messages }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // 'switch' + 'to' is a weak cue, and both turns share router vocabulary.
      expect(capturedPrompt).toContain("No explicit topic shift cue detected");
    });

    it("DOES detect 'ignore that, let us work on something unrelated' as a strong pivot", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nNew work\n## Current Active Topic\n- new\n## Historical / Background Context\n- old\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      const messages = buildTwoTurnConversation(
        "Implement the request router with path matching and parameter extraction.",
        "Ignore that, let us work on something unrelated — set up the database migration scripts.",
      );

      await handler!(
        {
          preparation: makePreparation(60, { messagesToSummarize: messages }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // 'ignore that' and 'unrelated' are both strong cues.
      expect(capturedPrompt).toContain("Recent topic shift detected");
      expect(capturedPrompt).toContain("strong pivot cue");
    });
  });

  describe("Jaccard overlap boundary", () => {
    it("does NOT fire on one shared token between 4-token messages", async () => {
      // 1 shared out of 7 unique = 0.14 → above 0.12 threshold
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nTest\n## Current Active Topic\n- test\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      // Pad and test; the exact boundary matters.
      // Use messages with moderate overlap: 2 shared out of ~10 = 0.2
      const messages2: any[] = [
        userMsg("Implement the database migration scripts and schema validation logic."),
        assistantToolCallMsg([{ id: "tc-1", name: "read", args: { path: "/db.ts" } }]),
        toolResultMsg("tc-1", "read", "db source"),
        userMsg("Add database indexes and optimize the schema query performance."),
        // shared: database, schema → overlap > 0.12
      ];
      for (let i = messages2.length; i < 60; i++) {
        messages2.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/f${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `ok`),
        );
      }

      await handler!(
        {
          preparation: makePreparation(60, { messagesToSummarize: messages2 }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // Two shared tokens out of ~10-12 unique → overlap ~0.17-0.2 → above 0.12
      expect(capturedPrompt).toContain("No explicit topic shift cue detected");
    });
  });

  describe("synthetic message filtering", () => {
    it("excludes compaction summaries from user turn detection and serialization", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nCompaction work\n## Current Active Topic\n- compaction fix\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      // Build messages where a compaction summary is injected as a user-role message
      // (exactly what convertToLlm does upstream)
      const compactionSummaryMsg = userMsg(
        "The conversation history before this point was compacted into the following summary:\n\n## Goal\nEML viewer fix\n## Current Active Topic\n- EML viewer pushed as v0.2.1"
      );
      const branchSummaryMsg = userMsg(
        "The following is a summary of a branch that this conversation came back from:\n\n## Summary\nSome branch work"
      );

      const messages: any[] = [
        compactionSummaryMsg,
        branchSummaryMsg,
        userMsg("Now let's fix the compaction strategy to handle topic shifts correctly."),
        assistantToolCallMsg([{ id: "tc-1", name: "edit", args: { path: "/workspace/smart-compaction.ts" } }]),
        toolResultMsg("tc-1", "edit", "Applied 3 edits"),
        userMsg("Great, run the tests"),
        assistantToolCallMsg([{ id: "tc-2", name: "bash", args: { command: "bun test" } }]),
        toolResultMsg("tc-2", "bash", "27 tests passed"),
      ];
      // Pad to reach SELECTIVE_THRESHOLD
      for (let i = messages.length; i < 60; i++) {
        messages.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/workspace/file-${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `contents ${i}`),
        );
      }

      await handler!(
        {
          preparation: makePreparation(60, { messagesToSummarize: messages }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // The prompt must NOT contain the compaction/branch summary text as a user turn
      expect(capturedPrompt).not.toContain("[0|User]: The conversation history before");
      expect(capturedPrompt).not.toContain("[1|User]: The following is a summary of a branch");
      // It SHOULD label them as CompactionSummary
      expect(capturedPrompt).toContain("CompactionSummary");
      // The real user messages should still appear
      expect(capturedPrompt).toContain("compaction strategy");
      expect(capturedPrompt).toContain("run the tests");
      // The detected active topic should reference the real user message, not the compaction summary
      expect(capturedPrompt).not.toContain("Treat message 0 as the");
      expect(capturedPrompt).not.toContain("Treat message 1 as the");
    });

    it("does not treat upstream bashExecution/custom user-role wrappers as real user turns", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nCompaction\n## Current Active Topic\n- compaction\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      const messages: any[] = [
        bashExecutionMsg("bun test", "27 tests passed"),
        customMsg("Internal note from extension"),
        userMsg("Refactor smart compaction to preserve current-turn context."),
      ];
      for (let i = messages.length; i < 60; i++) {
        messages.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/workspace/file-${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `contents ${i}`),
        );
      }

      await handler!(
        {
          preparation: makePreparation(60, { messagesToSummarize: messages }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      expect(capturedPrompt).toContain('Latest user request: message 2');
      expect(capturedPrompt).toContain('Treat message 2 as the current active instruction.');
      expect(capturedPrompt).toContain('[0|Context]: Ran `bun test`');
      expect(capturedPrompt).toContain('[1|Context]: Internal note from extension');
      expect(capturedPrompt).not.toContain('Latest user request: message 0');
      expect(capturedPrompt).not.toContain('Latest user request: message 1');
    });
  });

  describe("kept-messages visibility", () => {
    it("includes kept window context from branchEntries in the prompt", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nCompaction\n## Current Active Topic\n- compaction\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      // Messages to summarize — old EML work being discarded
      const messages: any[] = [
        userMsg("Fix the EML viewer to use monospace headers"),
        assistantToolCallMsg([{ id: "tc-1", name: "edit", args: { path: "/workspace/eml-viewer/index.ts" } }]),
        toolResultMsg("tc-1", "edit", "Applied edit"),
      ];
      for (let i = messages.length; i < 60; i++) {
        messages.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/workspace/file-${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `contents ${i}`),
        );
      }

      // branchEntries simulating kept messages about compaction work
      const keptEntryId = "kept-entry-001";
      const branchEntries: any[] = [
        // Old discarded entries (before firstKeptEntryId)
        { id: "old-1", type: "message", message: { role: "user", content: [{ type: "text", text: "Fix the EML viewer" }] } },
        // Compaction entry
        { id: "compaction-1", type: "compaction", summary: "Previous summary" },
        // Kept entries (from firstKeptEntryId onward)
        { id: keptEntryId, type: "message", message: { role: "user", content: [{ type: "text", text: "Now refactor the compaction strategy to walk backwards" }] } },
        { id: "kept-2", type: "message", message: { role: "assistant", content: [{ type: "text", text: "Done, implemented backwards walk" }] } },
        { id: "kept-3", type: "message", message: { role: "assistant", content: [{ type: "toolCall", id: "tc-kept", name: "edit", arguments: { path: "/workspace/piclaw/runtime/src/extensions/smart-compaction.ts" } }] } },
        { id: "kept-4", type: "message", message: { role: "toolResult", toolCallId: "tc-kept", toolName: "edit", content: [{ type: "text", text: "Applied edit" }], isError: false } },
        { id: "kept-5", type: "custom_message", customType: "note", content: [{ type: "text", text: "Keep reducer follow-up in mind" }], display: true },
        { id: "kept-6", type: "branch_summary", fromId: "branch-123", summary: "Branch work switched from EML viewer to compaction fixes" },
        { id: "kept-7", type: "message", message: { role: "user", content: [{ type: "text", text: "Run the tests and rebuild" }] } },
        // A synthetic compaction summary that should be skipped
        { id: "kept-8", type: "message", message: { role: "user", content: [{ type: "text", text: "The conversation history before this point was compacted into the following summary:\n\nOld stuff" }] } },
      ];

      await handler!(
        {
          preparation: makePreparation(60, {
            messagesToSummarize: messages,
            firstKeptEntryId: keptEntryId,
          }),
          branchEntries,
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // The prompt should contain the kept-window context, not just user turns
      expect(capturedPrompt).toContain("Kept Messages");
      expect(capturedPrompt).toContain("compaction strategy to walk backwards");
      expect(capturedPrompt).toContain("Done, implemented backwards walk");
      expect(capturedPrompt).toContain("smart-compaction.ts");
      expect(capturedPrompt).toContain("Keep reducer follow-up in mind");
      expect(capturedPrompt).toContain("switched from EML viewer to compaction fixes");
      expect(capturedPrompt).toContain("Run the tests and rebuild");
      // The synthetic compaction summary in kept entries should be excluded
      expect(capturedPrompt).not.toContain("Old stuff");
      // The old EML work from messagesToSummarize should NOT appear in the Kept Messages section
      // (it's in the excerpts section, not in kept)
    });

    it("includes split-turn prefix context when compaction cuts through the current turn", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nCompaction\n## Current Active Topic\n- compaction\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      const messages: any[] = [
        userMsg("Older work that is about to be summarized."),
        assistantToolCallMsg([{ id: "tc-old", name: "read", args: { path: "/workspace/old.ts" } }]),
        toolResultMsg("tc-old", "read", "old source"),
      ];
      for (let i = messages.length; i < 60; i++) {
        messages.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/workspace/file-${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `contents ${i}`),
        );
      }

      const turnPrefixMessages = [
        userMsg("Within the current turn, first inspect the session manager and then update the reducer."),
        assistantToolCallMsg([{ id: "tc-split", name: "read", args: { path: "/workspace/runtime/src/session-manager.ts" } }]),
        toolResultMsg("tc-split", "read", "session manager source"),
      ];

      await handler!(
        {
          preparation: makePreparation(60, {
            messagesToSummarize: messages,
            isSplitTurn: true,
            turnPrefixMessages,
          }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      expect(capturedPrompt).toContain("## Split Turn Prefix (discarded prefix of the CURRENT turn)");
      expect(capturedPrompt).toContain("session manager and then update the reducer");
      expect(capturedPrompt).toContain("session-manager.ts");
    });

    it("omits Kept Messages section when branchEntries is empty", async () => {
      let capturedPrompt = "";
      (completeSimple as any).mockImplementationOnce((_model: any, opts: any) => {
        capturedPrompt = opts.messages[0].content[0].text;
        return Promise.resolve({
          content: [{ type: "text", text: "## Goal\nWork\n## Current Active Topic\n- work\n## Historical / Background Context\n- none\n## Constraints & Preferences\n- none\n## Progress\n### Done\n### In Progress\n### Blocked\n## Key Decisions\n## Next Steps\n## Critical Context" }],
          stopReason: "end",
        });
      });

      const messages: any[] = [
        userMsg("Do something"),
        assistantToolCallMsg([{ id: "tc-1", name: "read", args: { path: "/workspace/file.ts" } }]),
        toolResultMsg("tc-1", "read", "contents"),
      ];
      for (let i = messages.length; i < 60; i++) {
        messages.push(
          i % 2 === 0
            ? assistantToolCallMsg([{ id: `tc-${i}`, name: "read", args: { path: `/workspace/file-${i}.ts` } }])
            : toolResultMsg(`tc-${i - 1}`, "read", `contents ${i}`),
        );
      }

      await handler!(
        {
          preparation: makePreparation(60, { messagesToSummarize: messages }),
          branchEntries: [],
          signal: new AbortController().signal,
        },
        makeCtx(),
      );

      // No kept messages → no Kept Messages section header
      expect(capturedPrompt).not.toContain("## Kept Messages (survive compaction");
    });
  });
});

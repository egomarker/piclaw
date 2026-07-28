import { afterEach, describe, expect, test } from "bun:test";

import "../helpers.js";

import {
  buildRecoveryDiagnosticEntry,
  runAgentRecoveryPhase,
  type PromptAttemptResult,
  type SessionWithToolControl,
} from "../../src/agent-pool/run-agent-recovery-phase.js";
import { RECOVERY_CONTINUATION_PROMPT } from "../../src/agent-pool/context-pressure-retry.js";
import type { AgentOutput } from "../../src/agent-pool/contracts.js";
import { endTrackedPhase } from "../../src/runtime/progress-watchdog.js";

const TEST_CHAT_JIDS = [
  "web:test-recovery-phase",
  "web:test-recovery-compact",
];

afterEach(() => {
  for (const chatJid of TEST_CHAT_JIDS) endTrackedPhase(chatJid);
});

function output(status: AgentOutput["status"], error?: string, result: string | null = null): AgentOutput {
  return status === "error"
    ? { status, result: null, error: error ?? "failed" }
    : { status, result, ...(error ? { error } : {}) };
}

function attempt(partial: Partial<PromptAttemptResult> = {}): PromptAttemptResult {
  return {
    output: output("error", "Timed out after 1s"),
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: false,
      hadCompletedTurnOutput: false,
      hadTerminalTurnOutput: false,
      sawCompactionIntent: false,
    },
    promptWasPersisted: false,
    timedOut: false,
    toolExecutionCount: 0,
    ...partial,
  };
}

function recoveryConfig(overrides: Partial<Parameters<typeof runAgentRecoveryPhase>[0]["recoveryConfig"]> = {}) {
  return {
    enabled: true,
    maxAttempts: 3,
    totalBudgetMs: 1_000,
    baseDelayMs: 0,
    maxDelayMs: 0,
    ...overrides,
  };
}

describe("runAgentRecoveryPhase", () => {
  test("continues after a timed-out tool attempt with tools blocked and execution budget carried", async () => {
    const activeToolSets: string[][] = [];
    const sessionCtrl: SessionWithToolControl = {
      getActiveToolNames: () => ["read", "bash"],
      setActiveToolsByName: (names) => { activeToolSets.push([...names]); },
    };
    const calls: Array<{ prompt: string; timeoutMs: number; toolExecutionCountAtStart: number }> = [];
    const events: unknown[] = [];

    const result = await runAgentRecoveryPhase({
      prompt: "original prompt",
      chatJid: "web:test-recovery-phase",
      session: {} as any,
      sessionCtrl,
      timeoutMs: 10_000,
      startTime: Date.now(),
      modelLabel: "test/model",
      recoveryConfig: recoveryConfig(),
      runOptions: { onEvent: (event) => events.push(event) },
      logsDir: "/tmp/nonexistent-piclaw-test-logs",
      clearAttachments: () => {},
      runPromptAttempt: async (prompt, timeoutMs, toolExecutionCountAtStart) => {
        calls.push({ prompt, timeoutMs, toolExecutionCountAtStart });
        if (calls.length === 1) {
          return attempt({
            output: output("error", "Timed out after 1s"),
            snapshot: {
              hadToolActivity: true,
              hadPartialOutput: false,
              hadCompletedTurnOutput: false,
              hadTerminalTurnOutput: false,
              sawCompactionIntent: false,
              canDisableToolsForRecovery: true,
              toolExecutionCount: 3,
            },
            promptWasPersisted: true,
            timedOut: true,
            toolExecutionCount: 3,
          });
        }
        expect(activeToolSets.at(-1)).toEqual([]);
        return attempt({
          output: output("success", undefined, "done"),
          snapshot: {
            hadToolActivity: false,
            hadPartialOutput: false,
            hadCompletedTurnOutput: true,
            hadTerminalTurnOutput: true,
            sawCompactionIntent: false,
          },
          promptWasPersisted: true,
          timedOut: false,
          toolExecutionCount: toolExecutionCountAtStart,
        });
      },
    });

    expect(result.status).toBe("success");
    expect(result.result).toBe("done");
    expect(result.recovery?.attemptsUsed).toBe(1);
    expect(calls[0]).toEqual({ prompt: "original prompt", timeoutMs: 10_000, toolExecutionCountAtStart: 0 });
    expect(calls[1]?.prompt).toBe(RECOVERY_CONTINUATION_PROMPT);
    expect(calls[1]?.toolExecutionCountAtStart).toBe(3);
    expect(calls[1]?.timeoutMs).toBeGreaterThanOrEqual(950);
    expect(calls[1]?.timeoutMs).toBeLessThanOrEqual(1_000);
    expect(activeToolSets).toEqual([[], ["read", "bash"]]);
    expect(events).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "recovery_start", attempt: 1, strategy: "retry" }),
      expect.objectContaining({ type: "recovery_end", outcome: "recovered", attemptsUsed: 1 }),
    ]));
  });

  test("runs recovery compaction outside the initial elapsed budget before retrying", async () => {
    let compactCalls = 0;
    const calls: Array<{ prompt: string; timeoutMs: number; toolExecutionCountAtStart: number }> = [];
    const events: unknown[] = [];
    const session = {
      compact: async () => {
        compactCalls += 1;
        throw new Error("Nothing to compact (session too small)");
      },
    } as any;

    const result = await runAgentRecoveryPhase({
      prompt: "original prompt",
      chatJid: "web:test-recovery-compact",
      session,
      sessionCtrl: null,
      timeoutMs: 0,
      startTime: Date.now() - 60_000,
      modelLabel: "test/model",
      recoveryConfig: recoveryConfig({ totalBudgetMs: 25 }),
      runOptions: { onEvent: (event) => events.push(event) },
      logsDir: "/tmp/nonexistent-piclaw-test-logs",
      clearAttachments: () => {},
      runPromptAttempt: async (prompt, timeoutMs, toolExecutionCountAtStart) => {
        calls.push({ prompt, timeoutMs, toolExecutionCountAtStart });
        if (calls.length === 1) {
          return attempt({
            output: output("error", "context length exceeded"),
            snapshot: {
              hadToolActivity: false,
              hadPartialOutput: false,
              hadCompletedTurnOutput: false,
              hadTerminalTurnOutput: false,
              sawCompactionIntent: true,
              toolExecutionCount: 2,
            },
            promptWasPersisted: true,
            toolExecutionCount: 2,
          });
        }
        return attempt({
          output: output("success", undefined, "recovered"),
          snapshot: {
            hadToolActivity: false,
            hadPartialOutput: false,
            hadCompletedTurnOutput: true,
            hadTerminalTurnOutput: true,
            sawCompactionIntent: false,
          },
          promptWasPersisted: true,
          toolExecutionCount: toolExecutionCountAtStart,
        });
      },
    });

    expect(result.status).toBe("success");
    expect(compactCalls).toBe(1);
    expect(calls[1]?.prompt).toBe(RECOVERY_CONTINUATION_PROMPT);
    expect(calls[1]?.toolExecutionCountAtStart).toBe(2);
    expect(calls[1]?.timeoutMs).toBeGreaterThanOrEqual(20);
    expect(calls[1]?.timeoutMs).toBeLessThanOrEqual(25);
    expect(events).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "compaction_start", trigger: "recovery" }),
      expect.objectContaining({ type: "compaction_end", trigger: "recovery", willRetry: true }),
      expect.objectContaining({ type: "recovery_end", outcome: "recovered" }),
    ]));
  });

  test("buildRecoveryDiagnosticEntry preserves serializable budget fields", () => {
    expect(buildRecoveryDiagnosticEntry(
      "attempt_failure",
      2,
      "tool_history_pressure",
      null,
      "budget reached",
      "Tool-use budget exceeded",
      123,
      {
        hadToolActivity: true,
        hadPartialOutput: true,
        hadCompletedTurnOutput: false,
        hadTerminalTurnOutput: false,
        sawCompactionIntent: false,
        compactionErrorMessage: null,
        toolUseBudgetExceeded: true,
        assistantToolUseMessageCount: 4,
        toolExecutionCount: 7,
      },
    )).toEqual({
      phase: "attempt_failure",
      attempt: 2,
      classifier: "tool_history_pressure",
      strategy: null,
      reason: "budget reached",
      error: "Tool-use budget exceeded",
      elapsedMs: 123,
      hadToolActivity: true,
      hadPartialOutput: true,
      hadCompletedTurnOutput: false,
      hadTerminalTurnOutput: false,
      sawCompactionIntent: false,
      compactionErrorMessage: null,
      toolUseBudgetExceeded: true,
      assistantToolUseMessageCount: 4,
      toolExecutionCount: 7,
    });
  });
});

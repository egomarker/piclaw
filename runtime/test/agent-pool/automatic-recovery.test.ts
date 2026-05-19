import { expect, test } from "bun:test";

import {
  decideAutomaticRecovery,
  DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
  isContextPressureFailure,
  isNonRecoverableFailure,
  isProviderAuthConfigFailure,
  isTransientFailure,
} from "../../src/agent-pool/automatic-recovery.js";

test("classifies context-limit failures as compact-then-retry", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "maximum context length exceeded for this model",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: true,
    },
  });

  expect(isContextPressureFailure("maximum context length exceeded")).toBe(true);
  expect(decision.recover).toBe(true);
  expect(decision.classifier).toBe("context_pressure");
  expect(decision.strategy).toBe("compact_then_retry");
});

test("treats timeout-before-finalization during compaction intent as compact-then-retry", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Response timed out before finalization",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: true,
      sawCompactionIntent: true,
    },
  });

  expect(isTransientFailure("Response timed out before finalization")).toBe(true);
  expect(decision.recover).toBe(true);
  expect(decision.classifier).toBe("context_pressure");
  expect(decision.strategy).toBe("compact_then_retry");
});

test("classifies provider auth/config failures as terminal auth_config", () => {
  expect(isProviderAuthConfigFailure("No API key for provider: openai-codex")).toBe(true);
  expect(isProviderAuthConfigFailure("Token refresh failed: 401")).toBe(true);

  const noKeyDecision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "No API key for provider: openai-codex",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: false,
    },
  });

  expect(noKeyDecision.recover).toBe(false);
  expect(noKeyDecision.classifier).toBe("auth_config");
  expect(noKeyDecision.strategy).toBeNull();

  const refreshDecision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Token refresh failed: 401",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: true,
      hadPartialOutput: true,
    },
  });

  expect(refreshDecision.recover).toBe(false);
  expect(refreshDecision.classifier).toBe("auth_config");
  expect(refreshDecision.strategy).toBeNull();
});

test("classifies invalid-request and aborted failures as non-recoverable", () => {
  expect(isNonRecoverableFailure("invalid_request_error: malformed schema")).toBe(true);
  expect(isNonRecoverableFailure("Request was aborted")).toBe(true);

  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Request was aborted",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: false,
    },
  });

  expect(decision.recover).toBe(false);
  expect(decision.classifier).toBe("non_recoverable");
  expect(decision.strategy).toBeNull();
});

test("skips automatic recovery when tool activity already happened", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Timed out after 30s",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: true,
      hadPartialOutput: true,
    },
  });

  expect(isTransientFailure("Timed out after 30s")).toBe(true);
  expect(decision.recover).toBe(false);
  expect(decision.classifier).toBe("tool_activity");
});

test("allows compaction recovery despite tool activity when compaction was in progress", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Timed out waiting for session idle after 30s (streaming=false, compacting=true, retrying=false)",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: true,
      hadPartialOutput: true,
      sawCompactionIntent: true,
    },
  });

  expect(decision.recover).toBe(true);
  expect(decision.classifier).toBe("context_pressure");
  expect(decision.strategy).toBe("compact_then_retry");
});

test("allows compaction recovery despite tool activity when error is context-pressure", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "maximum context length exceeded",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: true,
      hadPartialOutput: true,
    },
  });

  expect(decision.recover).toBe(true);
  expect(decision.classifier).toBe("context_pressure");
  expect(decision.strategy).toBe("compact_then_retry");
});

test("treats tool-use budget exhaustion as compact-then-retry tool-history pressure", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Tool-use budget exceeded before finalization (65/64 tool steps).",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: true,
      hadPartialOutput: false,
      toolUseBudgetExceeded: true,
      assistantToolUseMessageCount: 65,
      toolExecutionCount: 64,
    },
  });

  expect(decision.recover).toBe(true);
  expect(decision.classifier).toBe("tool_history_pressure");
  expect(decision.strategy).toBe("compact_then_retry");
});

test("does not compact-and-retry again after compaction itself overflows context", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "invalid_request_error: context_length_exceeded: Your input exceeds the context window of this model",
    recoveryAttemptsUsed: 1,
    elapsedMs: 2000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: false,
      compactionErrorMessage: "context_length_exceeded during compaction",
      sawCompactionIntent: true,
    },
  });

  expect(decision.recover).toBe(false);
  expect(decision.classifier).toBe("compaction_failure");
  expect(decision.strategy).toBeNull();
});

test("stops recovery after the configured attempt budget", () => {
  const decision = decideAutomaticRecovery({
    config: { ...DEFAULT_AUTOMATIC_RECOVERY_CONFIG, maxAttempts: 2, totalBudgetMs: 30_000, enabled: true },
    errorText: "Response ended with an error before finalization",
    recoveryAttemptsUsed: 2,
    elapsedMs: 5000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: true,
    },
  });

  expect(decision.recover).toBe(false);
  expect(decision.classifier).toBe("budget_exhausted");
});

test("treats partial-output interruptions as transient retry candidates", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Response ended with an error before finalization",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: true,
    },
  });

  expect(isTransientFailure("Response ended with an error before finalization")).toBe(true);
  expect(decision.recover).toBe(true);
  expect(decision.classifier).toBe("transient");
  expect(decision.strategy).toBe("retry");
});

test("treats WebSocket 1006 provider disconnects as transient retry candidates", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "WebSocket closed 1006 Connection ended",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: false,
    },
  });

  expect(isTransientFailure("WebSocket closed 1006 Connection ended")).toBe(true);
  expect(decision.recover).toBe(true);
  expect(decision.classifier).toBe("transient");
  expect(decision.strategy).toBe("retry");
});

test("retries a thinking-only stop once before escalating", () => {
  const first = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Prompt completed without emitting an assistant reply before finalization (provider stopped after emitting thinking without a final assistant reply, last stop reason: stop, session delta: 2 appended entries).",
    recoveryAttemptsUsed: 0,
    elapsedMs: 1000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: false,
      hadCompletedTurnOutput: false,
      sawThinkingOnlyStop: true,
    },
  });

  expect(first.recover).toBe(true);
  expect(first.classifier).toBe("thinking_only_stop");
  expect(first.strategy).toBe("retry");

  const second = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Prompt completed without emitting an assistant reply before finalization (provider stopped after emitting thinking without a final assistant reply, last stop reason: stop, session delta: 2 appended entries).",
    recoveryAttemptsUsed: 1,
    elapsedMs: 3000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: false,
      hadCompletedTurnOutput: false,
      sawThinkingOnlyStop: true,
    },
  });

  expect(second.recover).toBe(false);
  expect(second.classifier).toBe("thinking_only_stop");
  expect(second.strategy).toBeNull();
});

test("escalates repeated thinking-only stop to compact-then-retry when context pressure is flagged", () => {
  const decision = decideAutomaticRecovery({
    config: DEFAULT_AUTOMATIC_RECOVERY_CONFIG,
    errorText: "Prompt completed without emitting an assistant reply before finalization (provider stopped after emitting thinking without a final assistant reply, last stop reason: stop, session delta: 2 appended entries).",
    recoveryAttemptsUsed: 1,
    elapsedMs: 3000,
    snapshot: {
      hadToolActivity: false,
      hadPartialOutput: false,
      hadCompletedTurnOutput: false,
      sawThinkingOnlyStop: true,
      sawCompactionIntent: true,
    },
  });

  expect(decision.recover).toBe(true);
  expect(decision.classifier).toBe("context_pressure");
  expect(decision.strategy).toBe("compact_then_retry");
});

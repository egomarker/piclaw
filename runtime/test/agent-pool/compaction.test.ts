import { beforeEach, expect, test } from "bun:test";

import "../helpers.js";
import {
  computeAutoCompactionTokenStatus,
  estimateContextTokensFromSession,
  getAutoCompactionTokenStatusForSession,
  maybeAutoCompactSessionBeforePrompt,
  noteCompactionSuccess,
  runCompactionWithTimeout,
} from "../../src/agent-pool/compaction.js";
import { getChatAutoCompactionWindow, initDatabase, setChatCompactionBackoff } from "../../src/db.js";
import { recordCompactionCancellationReason } from "../../src/agent-pool/compaction-cancel-reason.js";

beforeEach(() => {
  initDatabase();
});

function deferred<T = void>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function makeSession(messages: any[], usageTokens?: number): any {
  return {
    getContextUsage: usageTokens === undefined ? undefined : () => ({ tokens: usageTokens }),
    sessionManager: {
      buildSessionContext: () => ({ messages }),
    },
  };
}

test("computeAutoCompactionTokenStatus supports body-after-prefix growth plus hard ceiling", () => {
  const scoped = computeAutoCompactionTokenStatus({
    activeContextTokens: 70_000,
    contextWindow: 100_000,
    thresholdPercent: 75,
    hardCeilingPercent: 95,
    overheadTokens: 5_000,
    scope: "body_after_prefix",
    window: { ordinal: 3, baselineTokens: 50_000, prefillTokens: 50_000 },
  });

  expect(scoped.autoCompactionScopeTokens).toBe(20_000);
  expect(scoped.autoCompactionScopeLimit).toBe(71_250);
  expect(scoped.tokenLimitReached).toBe(false);
  expect(scoped.windowOrdinal).toBe(3);

  const hardCeiling = computeAutoCompactionTokenStatus({
    activeContextTokens: 96_000,
    contextWindow: 100_000,
    thresholdPercent: 75,
    hardCeilingPercent: 95,
    overheadTokens: 5_000,
    scope: "body_after_prefix",
    window: { ordinal: 3, baselineTokens: 50_000, prefillTokens: 50_000 },
  });

  expect(hardCeiling.autoCompactionScopeTokens).toBe(46_000);
  expect(hardCeiling.fullContextWindowLimitReached).toBe(true);
  expect(hardCeiling.tokenLimitReached).toBe(true);
});

test("shared session token status supports mid-turn scoped checks and hard ceiling", () => {
  const previousScope = process.env.PICLAW_AUTO_COMPACTION_SCOPE;
  const previousThreshold = process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
  const previousHardCeiling = process.env.PICLAW_COMPACTION_HARD_CEILING_PERCENT;
  process.env.PICLAW_AUTO_COMPACTION_SCOPE = "body_after_prefix";
  process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = "75";
  process.env.PICLAW_COMPACTION_HARD_CEILING_PERCENT = "95";
  try {
    const chatJid = "web:midturn-scoped";
    let usageTokens = 50_000;
    let leafId = "leaf-1";
    const session = {
      ...makeSession([{ role: "user", content: [{ type: "text", text: "x" }] }], usageTokens),
      getContextUsage: () => ({ tokens: usageTokens }),
      sessionManager: {
        getLeafId: () => leafId,
        getEntries: () => [leafId],
        buildSessionContext: () => ({ messages: [{ role: "user", content: [{ type: "text", text: "x" }] }] }),
      },
      model: { provider: "test", id: "midturn", contextWindow: 100_000 },
    };
    getAutoCompactionTokenStatusForSession(session as any, chatJid);

    usageTokens = 70_000;
    leafId = "leaf-2";
    const scoped = getAutoCompactionTokenStatusForSession(session as any, chatJid)!;
    expect(scoped.tokenStatus.autoCompactionScopeTokens).toBe(22_000);
    expect(scoped.tokenStatus.tokenLimitReached).toBe(false);

    usageTokens = 95_000;
    leafId = "leaf-3";
    const hard = getAutoCompactionTokenStatusForSession(session as any, chatJid)!;
    expect(hard.tokenStatus.fullContextWindowLimitReached).toBe(true);
    expect(hard.tokenStatus.tokenLimitReached).toBe(true);
  } finally {
    if (previousScope === undefined) delete process.env.PICLAW_AUTO_COMPACTION_SCOPE;
    else process.env.PICLAW_AUTO_COMPACTION_SCOPE = previousScope;
    if (previousThreshold === undefined) delete process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
    else process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = previousThreshold;
    if (previousHardCeiling === undefined) delete process.env.PICLAW_COMPACTION_HARD_CEILING_PERCENT;
    else process.env.PICLAW_COMPACTION_HARD_CEILING_PERCENT = previousHardCeiling;
  }
});

test("body-after-prefix auto-compaction resets the persisted window after success", async () => {
  const previousScope = process.env.PICLAW_AUTO_COMPACTION_SCOPE;
  const previousThreshold = process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
  const previousWarning = process.env.PICLAW_COMPACTION_WARNING_THRESHOLD;
  process.env.PICLAW_AUTO_COMPACTION_SCOPE = "body_after_prefix";
  process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = "50";
  process.env.PICLAW_COMPACTION_WARNING_THRESHOLD = "0";
  try {
    const chatJid = "web:body-prefix-reset";
    let usageTokens = 40_000;
    let leafId = "leaf-1";
    const session = {
      ...makeSession([{ role: "user", content: [{ type: "text", text: "x" }] }], usageTokens),
      getContextUsage: () => ({ tokens: usageTokens }),
      sessionManager: {
        getLeafId: () => leafId,
        getEntries: () => [leafId],
        buildSessionContext: () => ({ messages: [{ role: "user", content: [{ type: "text", text: "x" }] }] }),
      },
      model: { provider: "test", id: "window-reset", contextWindow: 100_000 },
      settingsManager: { getCompactionSettings: () => ({ enabled: true, reserveTokens: 25_000 }) },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      async compact() {
        usageTokens = 12_000;
      },
    };

    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      chatJid,
      { onWarn: () => undefined, onInfo: () => undefined },
      () => undefined,
    );
    expect(getChatAutoCompactionWindow(chatJid).prefillTokens).toBe(44_000);

    usageTokens = 92_000;
    leafId = "leaf-2";
    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      chatJid,
      { onWarn: () => undefined, onInfo: () => undefined },
      () => undefined,
    );

    const state = getChatAutoCompactionWindow(chatJid);
    expect(state.ordinal).toBe(2);
    expect(state.baselineTokens).toBe(13_200);
    expect(state.prefillTokens).toBe(13_200);
    expect(state.successCount).toBe(1);
  } finally {
    if (previousScope === undefined) delete process.env.PICLAW_AUTO_COMPACTION_SCOPE;
    else process.env.PICLAW_AUTO_COMPACTION_SCOPE = previousScope;
    if (previousThreshold === undefined) delete process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
    else process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = previousThreshold;
    if (previousWarning === undefined) delete process.env.PICLAW_COMPACTION_WARNING_THRESHOLD;
    else process.env.PICLAW_COMPACTION_WARNING_THRESHOLD = previousWarning;
  }
});

test("noteCompactionSuccess resets scoped baseline for manual/model/recovery compactions without incrementing warning counters", () => {
  const previousScope = process.env.PICLAW_AUTO_COMPACTION_SCOPE;
  process.env.PICLAW_AUTO_COMPACTION_SCOPE = "body_after_prefix";
  try {
    for (const reason of ["manual", "model_downshift", "recovery"] as const) {
      const chatJid = `web:${reason}-finalizer`;
      let usageTokens = 80_000;
      const session = {
        ...makeSession([{ role: "user", content: [{ type: "text", text: "x" }] }], usageTokens),
        getContextUsage: () => ({ tokens: usageTokens }),
        model: { provider: "test", id: reason, contextWindow: 100_000 },
      };

      expect(getAutoCompactionTokenStatusForSession(session as any, chatJid)?.tokenStatus.prefillTokens).toBe(88_000);
      usageTokens = 12_000;
      const finalized = noteCompactionSuccess(session as any, chatJid, reason, { countSuccess: false });

      expect(finalized.ordinal).toBe(2);
      expect(finalized.prefillTokens).toBe(13_200);
      expect(finalized.successCount).toBe(0);
      expect(getAutoCompactionTokenStatusForSession(session as any, chatJid)?.tokenStatus.autoCompactionScopeTokens).toBe(0);
    }
  } finally {
    if (previousScope === undefined) delete process.env.PICLAW_AUTO_COMPACTION_SCOPE;
    else process.env.PICLAW_AUTO_COMPACTION_SCOPE = previousScope;
  }
});

test("maybeAutoCompactSessionBeforePrompt uses pending input projection", async () => {
  const previousScope = process.env.PICLAW_AUTO_COMPACTION_SCOPE;
  const previousThreshold = process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
  process.env.PICLAW_AUTO_COMPACTION_SCOPE = "total";
  process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = "75";
  try {
    let compactCalls = 0;
    const session = {
      ...makeSession([{ role: "user", content: [{ type: "text", text: "near threshold" }] }], 65_000),
      model: { provider: "test", id: "pending-projection", contextWindow: 100_000 },
      settingsManager: { getCompactionSettings: () => ({ enabled: true, reserveTokens: 25_000 }) },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      async compact() {
        compactCalls += 1;
      },
    };

    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      "web:pending-projection",
      { onWarn: () => undefined, onInfo: () => undefined },
      () => undefined,
      10_000,
    );

    expect(compactCalls).toBe(1);
  } finally {
    if (previousScope === undefined) delete process.env.PICLAW_AUTO_COMPACTION_SCOPE;
    else process.env.PICLAW_AUTO_COMPACTION_SCOPE = previousScope;
    if (previousThreshold === undefined) delete process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
    else process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = previousThreshold;
  }
});

test("estimateContextTokensFromSession trusts native usage before compaction", () => {
  const session = makeSession([
    { role: "user", content: [{ type: "text", text: "hello" }] },
    { role: "assistant", content: [{ type: "text", text: "hi" }] },
  ], 123_456);

  expect(estimateContextTokensFromSession(session)).toBe(123_456);
});

test("runCompactionWithTimeout preserves extension-recorded cancellation reasons", async () => {
  const previousTimeout = process.env.PICLAW_COMPACTION_TIMEOUT_MS;
  process.env.PICLAW_COMPACTION_TIMEOUT_MS = "5000";
  try {
    const session = makeSession([]);
    recordCompactionCancellationReason(session.sessionManager, "Smart compaction summary too short");

    const result = await runCompactionWithTimeout(session, "web:recorded-cancel", {}, async () => {
      throw new Error("Compaction cancelled");
    });

    expect(result).toEqual({ ok: false, errorMessage: "Smart compaction summary too short" });
  } finally {
    if (previousTimeout === undefined) delete process.env.PICLAW_COMPACTION_TIMEOUT_MS;
    else process.env.PICLAW_COMPACTION_TIMEOUT_MS = previousTimeout;
  }
});

test("runCompactionWithTimeout joins concurrent compaction calls for the same chat", async () => {
  const previousTimeout = process.env.PICLAW_COMPACTION_TIMEOUT_MS;
  process.env.PICLAW_COMPACTION_TIMEOUT_MS = "5000";
  try {
    const release = deferred<string>();
    const warnings: string[] = [];
    let calls = 0;
    const session = makeSession([]);
    const options = { onWarn: (message: string) => warnings.push(message) };

    const first = runCompactionWithTimeout(session, "web:test", options, async () => {
      calls += 1;
      return await release.promise;
    });
    await Promise.resolve();
    const second = runCompactionWithTimeout(session, "web:test", options, async () => {
      calls += 1;
      return "second";
    });

    release.resolve("first");

    expect(await first).toEqual({ ok: true, result: "first" });
    expect(await second).toEqual({ ok: true, result: "first" });
    expect(calls).toBe(1);
    expect(warnings).toEqual(["Compaction already in progress; joining existing compaction"]);
  } finally {
    if (previousTimeout === undefined) delete process.env.PICLAW_COMPACTION_TIMEOUT_MS;
    else process.env.PICLAW_COMPACTION_TIMEOUT_MS = previousTimeout;
  }
});

test("runCompactionWithTimeout keeps the single-flight lock until timed-out compaction settles", async () => {
  const previousTimeout = process.env.PICLAW_COMPACTION_TIMEOUT_MS;
  process.env.PICLAW_COMPACTION_TIMEOUT_MS = "5";
  try {
    const release = deferred<void>();
    let calls = 0;
    let aborts = 0;
    const session = {
      ...makeSession([]),
      isCompacting: true,
      abortCompaction: () => {
        aborts += 1;
        // Simulate abort causing the compaction to settle shortly after
        setTimeout(() => release.resolve(), 10);
      },
    };
    const options = { onWarn: () => undefined };

    const first = await runCompactionWithTimeout(session, "web:timeout-settle", options, async () => {
      calls += 1;
      await release.promise;
      return "late";
    });

    // First call timed out, but settlement grace waited for the compaction
    // promise to settle — so the lock is already released by the time the
    // caller gets the result.
    expect(first.ok).toBe(false);
    expect(calls).toBe(1);
    expect(aborts).toBe(1);

    // Second call should now succeed independently (lock was released
    // after settlement).
    const second = await runCompactionWithTimeout(session, "web:timeout-settle", options, async () => {
      calls += 1;
      return "second";
    });
    expect(second).toEqual({ ok: true, result: "second" });
    expect(calls).toBe(2);
  } finally {
    if (previousTimeout === undefined) delete process.env.PICLAW_COMPACTION_TIMEOUT_MS;
    else process.env.PICLAW_COMPACTION_TIMEOUT_MS = previousTimeout;
  }
});

test("maybeAutoCompactSessionBeforePrompt subtracts overhead before threshold checks", async () => {
  const previousThreshold = process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
  const previousOverhead = process.env.PICLAW_SYSTEM_PROMPT_OVERHEAD_TOKENS;
  process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = "75";
  process.env.PICLAW_SYSTEM_PROMPT_OVERHEAD_TOKENS = "4000";
  try {
    const events: any[] = [];
    let compactCalls = 0;
    const session = {
      ...makeSession([
        { role: "user", content: [{ type: "text", text: "x".repeat(4000) }] },
      ], 73_000),
      model: { provider: "test", id: "effective-window", contextWindow: 100_000 },
      settingsManager: { getCompactionSettings: () => ({ enabled: true, reserveTokens: 25_000 }) },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      async compact() {
        compactCalls += 1;
      },
    };

    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      "web:effective-window",
      { onWarn: () => undefined, onInfo: () => undefined },
      (event) => events.push(event),
    );

    expect(compactCalls).toBe(1);
    expect(events).toContainEqual(expect.objectContaining({
      type: "compaction_start",
      reason: "threshold",
      trigger: "pre_prompt",
      piclawReason: "pre_prompt",
      willRetry: false,
      source: "pre_prompt_auto_compaction",
    }));
    expect(events).toContainEqual(expect.objectContaining({
      type: "compaction_end",
      reason: "threshold",
      trigger: "pre_prompt",
      piclawReason: "pre_prompt",
      willRetry: false,
      aborted: false,
      source: "pre_prompt_auto_compaction",
    }));
    expect(events).toContainEqual(expect.objectContaining({
      type: "context_usage_update",
      source: "compaction",
      phase: "after_threshold_compaction",
      estimated: true,
      contextWindow: 100_000,
    }));
  } finally {
    if (previousThreshold === undefined) delete process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
    else process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = previousThreshold;
    if (previousOverhead === undefined) delete process.env.PICLAW_SYSTEM_PROMPT_OVERHEAD_TOKENS;
    else process.env.PICLAW_SYSTEM_PROMPT_OVERHEAD_TOKENS = previousOverhead;
  }
});

test("maybeAutoCompactSessionBeforePrompt emits normalized failure compaction-end events", async () => {
  const previousThreshold = process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
  process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = "75";
  try {
    const events: any[] = [];
    const session = {
      ...makeSession([{ role: "user", content: [{ type: "text", text: "x" }] }], 90_000),
      model: { provider: "test", id: "failure-shape", contextWindow: 100_000 },
      settingsManager: { getCompactionSettings: () => ({ enabled: true, reserveTokens: 25_000 }) },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      async compact() {
        throw new Error("model failed");
      },
    };

    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      "web:failure-shape",
      { onWarn: () => undefined, onInfo: () => undefined },
      (event) => events.push(event),
    );

    expect(events).toContainEqual(expect.objectContaining({
      type: "compaction_end",
      reason: "threshold",
      trigger: "pre_prompt",
      piclawReason: "pre_prompt",
      willRetry: false,
      aborted: false,
      source: "pre_prompt_auto_compaction",
      errorMessage: "Pre-prompt compaction failed: model failed",
    }));
  } finally {
    if (previousThreshold === undefined) delete process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
    else process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = previousThreshold;
  }
});

test("maybeAutoCompactSessionBeforePrompt emits normalized cancellation compaction-end events", async () => {
  const previousThreshold = process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
  process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = "75";
  try {
    const events: any[] = [];
    const session = {
      ...makeSession([{ role: "user", content: [{ type: "text", text: "x" }] }], 90_000),
      model: { provider: "test", id: "cancel-shape", contextWindow: 100_000 },
      settingsManager: { getCompactionSettings: () => ({ enabled: true, reserveTokens: 25_000 }) },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      async compact() {
        throw new Error("Compaction cancelled");
      },
    };

    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      "web:cancel-shape",
      { onWarn: () => undefined, onInfo: () => undefined },
      (event) => events.push(event),
    );

    expect(events).toContainEqual(expect.objectContaining({
      type: "compaction_end",
      reason: "threshold",
      trigger: "pre_prompt",
      piclawReason: "pre_prompt",
      willRetry: false,
      aborted: true,
      source: "pre_prompt_auto_compaction",
      errorMessage: "Compaction cancelled",
    }));
  } finally {
    if (previousThreshold === undefined) delete process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
    else process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = previousThreshold;
  }
});

test("maybeAutoCompactSessionBeforePrompt emits repeated-compaction warning at threshold", async () => {
  const previousThreshold = process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
  const previousWarning = process.env.PICLAW_COMPACTION_WARNING_THRESHOLD;
  process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = "50";
  process.env.PICLAW_COMPACTION_WARNING_THRESHOLD = "2";
  try {
    const chatJid = "web:repeated-warning";
    let usageTokens = 90_000;
    let leafId = "leaf-1";
    const events: any[] = [];
    const session = {
      ...makeSession([{ role: "user", content: [{ type: "text", text: "x" }] }], usageTokens),
      getContextUsage: () => ({ tokens: usageTokens }),
      sessionManager: {
        getLeafId: () => leafId,
        getEntries: () => [leafId],
        buildSessionContext: () => ({ messages: [{ role: "user", content: [{ type: "text", text: "x" }] }] }),
      },
      model: { provider: "test", id: "warning", contextWindow: 100_000 },
      settingsManager: { getCompactionSettings: () => ({ enabled: true, reserveTokens: 25_000 }) },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      async compact() {
        usageTokens = 10_000;
      },
    };

    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      chatJid,
      { onWarn: () => undefined, onInfo: () => undefined },
      (event) => events.push(event),
    );
    usageTokens = 90_000;
    leafId = "leaf-2";
    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      chatJid,
      { onWarn: () => undefined, onInfo: () => undefined },
      (event) => events.push(event),
    );

    expect(events).toContainEqual(expect.objectContaining({
      type: "compaction_warning",
      reason: "repeated_successes",
      compactionCount: 2,
      warningThreshold: 2,
    }));
  } finally {
    if (previousThreshold === undefined) delete process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
    else process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = previousThreshold;
    if (previousWarning === undefined) delete process.env.PICLAW_COMPACTION_WARNING_THRESHOLD;
    else process.env.PICLAW_COMPACTION_WARNING_THRESHOLD = previousWarning;
  }
});

test("maybeAutoCompactSessionBeforePrompt suppresses retry after an expired non-cancellation failure", async () => {
  const previousThreshold = process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
  process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = "75";
  try {
    const events: any[] = [];
    const warnings: string[] = [];
    let compactCalls = 0;
    const chatJid = "web:previous-failure";
    setChatCompactionBackoff(chatJid, {
      chatJid,
      failureCount: 1,
      lastFailedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      backoffUntil: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      lastErrorMessage: "Compaction timed out after 180s",
    });
    const session = {
      ...makeSession([
        { role: "user", content: [{ type: "text", text: "x".repeat(4000) }] },
      ], 80_000),
      model: { provider: "test", id: "large", contextWindow: 100_000 },
      settingsManager: { getCompactionSettings: () => ({ enabled: true, reserveTokens: 25_000 }) },
      isStreaming: false,
      isCompacting: false,
      isRetrying: false,
      async compact() {
        compactCalls += 1;
      },
    };

    await maybeAutoCompactSessionBeforePrompt(
      session as any,
      chatJid,
      { onWarn: (message) => warnings.push(message), onInfo: () => undefined },
      (event) => events.push(event),
    );

    expect(compactCalls).toBe(0);
    expect(warnings).toContain("Pre-prompt auto-compaction suppressed for chat after recent failures");
    expect(events).toContainEqual(expect.objectContaining({
      type: "compaction_suppressed",
      reason: "previous_failure",
      errorMessage: "Compaction timed out after 180s",
    }));
  } finally {
    if (previousThreshold === undefined) delete process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT;
    else process.env.PICLAW_COMPACTION_THRESHOLD_PERCENT = previousThreshold;
  }
});

test("estimateContextTokensFromSession ignores stale assistant usage after compaction", () => {
  const stalePreCompactionUsage = {
    input: 220_000,
    output: 8_000,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 228_000,
  };
  const session = makeSession([
    {
      role: "compactionSummary",
      summary: "short compacted summary",
      tokensBefore: 228_000,
    },
    {
      role: "assistant",
      content: [{ type: "text", text: "kept assistant message" }],
      usage: stalePreCompactionUsage,
      stopReason: "stop",
    },
    {
      role: "toolResult",
      content: [{ type: "text", text: "small result" }],
    },
  ], 230_000);

  const estimated = estimateContextTokensFromSession(session);

  expect(estimated).toBeLessThan(100);
  expect(estimated).not.toBe(230_000);
});

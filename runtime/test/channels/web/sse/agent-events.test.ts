import { describe, expect, it, vi } from "vitest";
import { createStreamingEventHandler } from "../../../../src/channels/web/sse/agent-events.js";

function makeHandler(formatThinkingLevel?: (level: string) => string) {
  const statuses: Record<string, unknown>[] = [];
  const emitter = {
    status: vi.fn((payload: Record<string, unknown>) => statuses.push(payload)),
    thought: vi.fn(),
    thoughtDelta: vi.fn(),
    draft: vi.fn(),
    draftDelta: vi.fn(),
    response: vi.fn(),
    generatedWidgetOpen: vi.fn(),
    generatedWidgetDelta: vi.fn(),
    generatedWidgetFinal: vi.fn(),
    generatedWidgetClose: vi.fn(),
    generatedWidgetError: vi.fn(),
    modelChanged: vi.fn(),
  };
  const handler = createStreamingEventHandler({
    emitter,
    agentId: "agent-1",
    threadId: "thread-1",
    turnId: "turn-1",
    formatThinkingLevel,
  });
  return { handler, statuses, emitter };
}

describe("web SSE thinking level events", () => {
  it("reports legacy raw levels with their display labels", () => {
    const { handler, emitter } = makeHandler((level) => level === "xhigh" ? "max" : level);

    handler({ type: "thinking_level_changed", level: "xhigh" } as any);

    expect(emitter.modelChanged).toHaveBeenCalledWith(expect.objectContaining({
      thinking_level: "xhigh",
      thinking_level_label: "max",
    }));
  });
});

describe("web SSE provider retry events", () => {
  it("includes the selected model in rate-limit retry status", () => {
    const { handler, statuses } = makeHandler();

    handler({
      type: "model_select",
      model: { provider: "azure-openai", id: "gpt-5-4" },
    } as any);
    handler({
      type: "auto_retry_start",
      attempt: 1,
      maxAttempts: 3,
      delayMs: 30000,
      errorMessage: "Azure OpenAI API error (429): RateLimitReached. Retry-After: 30",
    } as any);

    expect(statuses[0]).toMatchObject({
      type: "intent",
      title: "Rate limited (HTTP 429) on azure-openai/gpt-5-4 — retrying (attempt 1/3, 30s delay)",
    });
    expect(String(statuses[0].detail)).toContain("model: azure-openai/gpt-5-4");
  });

  it("includes the selected model when the rate-limit retry budget is exhausted", () => {
    const { handler, statuses } = makeHandler();

    handler({
      type: "model_select",
      model: { provider: "azure-openai", id: "gpt-5-4" },
    } as any);
    handler({
      type: "auto_retry_end",
      success: false,
      finalError: "Azure OpenAI error: Retry budget exhausted. Azure rate limit exceeded. Wait about 30s before retrying.",
    } as any);

    expect(statuses[0]).toMatchObject({
      type: "error",
      title: "Rate limited (HTTP 429) on azure-openai/gpt-5-4 — retry budget exhausted",
    });
  });
});

describe("web SSE agent compaction events", () => {
  it("includes structured Piclaw trigger fields on compaction start and end", () => {
    const { handler, statuses } = makeHandler();

    handler({
      type: "compaction_start",
      reason: "threshold",
      trigger: "pre_prompt",
      piclawReason: "pre_prompt",
      willRetry: false,
      source: "pre_prompt_auto_compaction",
      chatJid: "web:test",
    } as any);
    handler({
      type: "compaction_end",
      reason: "threshold",
      trigger: "pre_prompt",
      piclawReason: "pre_prompt",
      willRetry: false,
      aborted: false,
      source: "pre_prompt_auto_compaction",
      chatJid: "web:test",
      tokensBefore: 100_000,
      estimatedTokensAfter: 40_000,
      estimatedTokensAfterSource: "upstream",
      safetyAdjustedTokensAfter: 46_000,
      reductionPercent: 60,
    } as any);

    expect(statuses[0]).toMatchObject({
      type: "intent",
      title: "Smart compaction",
      reason: "threshold",
      trigger: "pre_prompt",
      piclawReason: "pre_prompt",
      willRetry: false,
      source: "pre_prompt_auto_compaction",
      chatJid: "web:test",
    });
    expect(statuses[1]).toMatchObject({
      type: "intent",
      title: "Smart compaction complete",
      reason: "threshold",
      trigger: "pre_prompt",
      piclawReason: "pre_prompt",
      willRetry: false,
      aborted: false,
      tokensBefore: 100_000,
      estimatedTokensAfter: 40_000,
      estimatedTokensAfterSource: "upstream",
      safetyAdjustedTokensAfter: 46_000,
      reductionPercent: 60,
    });
    expect(String(statuses[1].detail)).toContain("Compaction result estimate");
  });

  it("uses willRetry as the retry status source for recovery compaction", () => {
    const { handler, statuses } = makeHandler();

    handler({
      type: "compaction_end",
      reason: "overflow",
      trigger: "recovery",
      piclawReason: "recovery",
      willRetry: true,
      aborted: false,
      source: "automatic_recovery",
      tokensBefore: 120_000,
      estimatedTokensAfter: 60_000,
    } as any);

    expect(statuses[0]).toMatchObject({
      type: "intent",
      title: "Retrying after auto-compaction",
      reason: "overflow",
      trigger: "recovery",
      piclawReason: "recovery",
      willRetry: true,
      aborted: false,
      source: "automatic_recovery",
    });
  });

  it("keeps context usage as a separate fresh estimate payload", () => {
    const { handler, statuses } = makeHandler();

    handler({
      type: "context_usage_update",
      tokens: 42_000,
      contextWindow: 128_000,
      percent: 32.8,
      estimated: true,
      source: "compaction",
      phase: "after_threshold_compaction",
    } as any);

    expect(statuses[0]).toMatchObject({
      type: "context_usage",
      context_usage: {
        tokens: 42_000,
        contextWindow: 128_000,
        percent: 32.8,
        estimated: true,
        source: "compaction",
        phase: "after_threshold_compaction",
      },
    });
  });

  it("marks compaction suppression as non-retry structured compaction telemetry", () => {
    const { handler, statuses } = makeHandler();

    handler({
      type: "compaction_suppressed",
      reason: "previous_failure",
      failureCount: 2,
      errorMessage: "Compaction timed out",
    } as any);

    expect(statuses[0]).toMatchObject({
      type: "intent",
      title: "Compaction temporarily suppressed",
      reason: "previous_failure",
      willRetry: false,
    });
  });
});

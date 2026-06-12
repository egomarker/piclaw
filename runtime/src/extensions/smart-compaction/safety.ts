/**
 * Extracted smart-compaction helper module.
 *
 * Keep this module focused; the public extension facade remains
 * ../smart-compaction.ts.
 */

import { getSupportedThinkingLevels } from "@earendil-works/pi-ai";
import {
  BUDGET_SAFETY_MARGIN,
  MAX_COMPACTION_OUTPUT_TOKENS,
  MAX_KEEP_RECENT_FRACTION,
  MIN_COMPACTION_OUTPUT_TOKENS,
  PROGRESSIVE_FALLBACK_CONTEXT_WINDOW,
  type CompactionReasoningEffort,
  type CompactionReasoningPhase,
  getConfiguredCompactionReasoningEffort,
} from "./config.js";
import { applyTokenEstimateSafetyMultiplier, getEffectiveContextWindow, getSystemPromptOverheadTokens } from "../../utils/context-window-budget.js";
import { estimateCompactionPromptTokens, estimateTokensFromChars, getModelContextWindow } from "./context.js";


// ---------------------------------------------------------------------------
// Post-compaction verification and keepRecentTokens clamping
// ---------------------------------------------------------------------------

/**
 * Clamp keepRecentTokens to at most MAX_KEEP_RECENT_FRACTION of the effective
 * context window (after subtracting system prompt overhead). Prevents the kept
 * window from consuming so much context that summary + system prompt + tools
 * don't fit.
 */
export function clampKeepRecentTokens(keepRecentTokens: number, contextWindow: number): number {
  const effectiveWindow = getEffectiveContextWindow(contextWindow, getSystemPromptOverheadTokens());
  const maxKeep = Math.floor(effectiveWindow * MAX_KEEP_RECENT_FRACTION);
  return Math.max(0, Math.min(Math.floor(keepRecentTokens), maxKeep));
}

/**
 * Estimate whether the post-compaction context will fit in the model's window.
 * Returns the estimated total and whether it overflows.
 */
export function estimatePostCompactionFit(summary: string, keepRecentTokens: number, contextWindow: number): {
  estimatedTotal: number;
  fits: boolean;
  summaryTokens: number;
  overheadTokens: number;
  margin: number;
} {
  const summaryTokens = applyTokenEstimateSafetyMultiplier(estimateTokensFromChars(summary));
  const safeKeepRecentTokens = applyTokenEstimateSafetyMultiplier(keepRecentTokens);
  const overheadTokens = getSystemPromptOverheadTokens();
  const estimatedTotal = summaryTokens + safeKeepRecentTokens + overheadTokens;
  const margin = contextWindow - estimatedTotal;
  return {
    estimatedTotal,
    fits: margin > 0,
    summaryTokens,
    overheadTokens,
    margin,
  };
}

const COMPACTION_REASONING_ORDER: CompactionReasoningEffort[] = ["minimal", "low", "medium", "high"];

function compactionReasoningRank(effort: CompactionReasoningEffort): number {
  return COMPACTION_REASONING_ORDER.indexOf(effort);
}

function getContextCappedCompactionReasoningEffort(model: unknown): CompactionReasoningEffort {
  const contextWindow = getModelContextWindow(model) ?? PROGRESSIVE_FALLBACK_CONTEXT_WINDOW;
  if (contextWindow <= 32_000) return "minimal";
  if (contextWindow <= 64_000) return "low";
  if (contextWindow <= 128_000) return "medium";
  return "high";
}

function isGitHubCopilotOpus48Model(model: unknown): boolean {
  const anyModel = model as { provider?: unknown; id?: unknown } | null | undefined;
  return String(anyModel?.provider || "").toLowerCase() === "github-copilot"
    && String(anyModel?.id || "").toLowerCase() === "claude-opus-4.8";
}

function getSupportedCompactionReasoningEfforts(model: unknown): CompactionReasoningEffort[] {
  const anyModel = model as { reasoning?: unknown } | null | undefined;
  if (!anyModel?.reasoning) return [];
  // GitHub Copilot's Opus 4.8 route advertises reasoning and forces adaptive
  // thinking, but compaction summaries are background maintenance requests and
  // have been observed to fail/stall on that path. Avoid sending a reasoning
  // option for this model so compaction uses the plain summarization stream.
  if (isGitHubCopilotOpus48Model(model)) return [];
  try {
    const supported = getSupportedThinkingLevels(anyModel as any);
    return supported
      .filter((level): level is CompactionReasoningEffort => COMPACTION_REASONING_ORDER.includes(level as CompactionReasoningEffort));
  } catch {
    return [];
  }
}

export function getCompactionReasoningReserveTokens(model: unknown): number {
  if (getSupportedCompactionReasoningEfforts(model).length === 0) return 0;
  const contextWindow = getModelContextWindow(model) ?? PROGRESSIVE_FALLBACK_CONTEXT_WINDOW;
  if (contextWindow <= 64_000) return 512;
  if (contextWindow <= 128_000) return 1_024;
  if (contextWindow <= 256_000) return 2_048;
  return 4_096;
}

export function getCompactionModelContextWindow(model: unknown): number {
  return getModelContextWindow(model) ?? PROGRESSIVE_FALLBACK_CONTEXT_WINDOW;
}

export function getCompactionRetryPromptTokenTarget(model: unknown, fraction = 0.65): number {
  const contextWindow = getCompactionModelContextWindow(model);
  const effectiveWindow = getEffectiveContextWindow(contextWindow, getSystemPromptOverheadTokens());
  return Math.max(MIN_COMPACTION_OUTPUT_TOKENS, Math.floor(effectiveWindow * fraction));
}

export function getSafeCompactionMaxTokens(model: unknown, promptText: string, requestedMaxTokens: number): {
  maxTokens: number;
  promptTokens: number;
  availableOutputTokens: number;
  contextWindow: number;
  reasoningReserveTokens: number;
} {
  const contextWindow = getModelContextWindow(model) ?? PROGRESSIVE_FALLBACK_CONTEXT_WINDOW;
  const promptTokens = estimateCompactionPromptTokens(promptText);
  const reasoningReserveTokens = getCompactionReasoningReserveTokens(model);
  const availableOutputTokens = Math.floor((contextWindow - promptTokens - reasoningReserveTokens) * BUDGET_SAFETY_MARGIN);
  if (availableOutputTokens < MIN_COMPACTION_OUTPUT_TOKENS) {
    throw new Error(
      `Compaction prompt exceeds safe model budget: prompt+overhead=${promptTokens}t, reasoningReserve=${reasoningReserveTokens}t, context=${contextWindow}t, availableOutput=${availableOutputTokens}t`,
    );
  }
  return {
    maxTokens: Math.max(
      MIN_COMPACTION_OUTPUT_TOKENS,
      Math.min(Math.floor(requestedMaxTokens), availableOutputTokens, MAX_COMPACTION_OUTPUT_TOKENS),
    ),
    promptTokens,
    availableOutputTokens,
    contextWindow,
    reasoningReserveTokens,
  };
}

export function getCompactionReasoningEffort(
  model: unknown,
  phase: CompactionReasoningPhase = "selective",
): CompactionReasoningEffort | undefined {
  const supported = getSupportedCompactionReasoningEfforts(model);
  if (supported.length === 0) return undefined;

  const configured = getConfiguredCompactionReasoningEffort(phase);
  const contextCap = getContextCappedCompactionReasoningEffort(model);
  const cappedTarget = COMPACTION_REASONING_ORDER[
    Math.min(compactionReasoningRank(configured), compactionReasoningRank(contextCap))
  ];
  const cappedRank = compactionReasoningRank(cappedTarget);
  const supportedAtOrBelowTarget = supported
    .filter((level) => compactionReasoningRank(level) <= cappedRank)
    .sort((a, b) => compactionReasoningRank(b) - compactionReasoningRank(a));
  if (supportedAtOrBelowTarget[0]) return supportedAtOrBelowTarget[0];

  return supported
    .slice()
    .sort((a, b) => compactionReasoningRank(a) - compactionReasoningRank(b))[0];
}

export interface ProgressiveCompactionBudget {
  contextWindow: number;
  promptBudgetChars: number;
  chunkBudgetChars: number;
  mergeBudgetChars: number;
  forceProgressive: boolean;
}

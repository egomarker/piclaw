/**
 * Extracted smart-compaction helper module.
 *
 * Keep this module focused; the public extension facade remains
 * ../smart-compaction.ts.
 */

import { applyTokenEstimateSafetyMultiplier, getContextWindowFromModel, getSystemPromptOverheadTokens } from "../../utils/context-window-budget.js";

// ---------------------------------------------------------------------------
// Live context usage estimates
// ---------------------------------------------------------------------------

export type SmartCompactionUiContext = {
  ui: {
    setStatus?: (key: string, text: string | undefined) => void;
  };
  model?: { contextWindow?: number; contextLength?: number } | null;
};

export function getModelContextWindow(model: unknown): number | null {
  return getContextWindowFromModel(model);
}

export function getContextWindowEstimate(ctx: SmartCompactionUiContext): number | null {
  return getModelContextWindow(ctx.model ?? null);
}

export function estimateTokensFromChars(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function estimateCompactionPromptTokens(promptText: string): number {
  return applyTokenEstimateSafetyMultiplier(estimateTokensFromChars(promptText)) + getSystemPromptOverheadTokens();
}

export function normalizeCompletionPercent(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function estimateSmartCompactionCompletionPercent(phase: string): number {
  const progressiveChunk = phase.match(/^progressive_chunk_(\d+)$/);
  if (progressiveChunk) return 35;
  if (/^progressive_chunk_batch_/.test(phase)) return 30;
  const progressiveSummarized = phase.match(/^progressive_chunks_summarized_(\d+)$/);
  if (progressiveSummarized) return 65;
  if (/^merge_pass_\d+_batch_/.test(phase)) return 76;
  if (/^merge_pass_\d+_reduced$/.test(phase)) return 82;
  if (/^merge_final_compress_/.test(phase)) return 88;
  switch (phase) {
    case "scanning": return 2;
    case "noop_reused": return 92;
    case "completed_noop":
    case "completed_noop_adjusted": return 100;
    case "noop_unsafe": return 12;
    case "builtin_fallback": return 5;
    case "extracting": return 10;
    case "summarizing_prompt": return 20;
    case "generating_summary": return 45;
    case "generating_summary_streaming": return 65;
    case "generating_summary_trimmed_retry": return 55;
    case "completed_selective": return 100;
    case "progressive_iterative": return 25;
    case "progressive_chunking": return 28;
    case "progressive_chunk": return 45;
    case "progressive_merge": return 78;
    case "progressive_compress": return 88;
    case "progressive_final": return 92;
    case "progressive_streaming": return 50;
    case "merge_final": return 92;
    case "completed_progressive":
    case "completed_progressive_partial": return 100;
    case "progressive_builtin_fallback": return 20;
    case "compaction_done": return 100;
    default: return 50;
  }
}

export function formatSmartCompactionStatus(message: string, completionPercent?: number | null): string {
  const normalizedPercent = normalizeCompletionPercent(completionPercent);
  if (normalizedPercent == null) return message;
  const body = message.replace(/^Smart compaction:\s*/, "");
  return `Smart compaction: ${normalizedPercent}% — ${body}`;
}

export function publishContextEstimate(
  ctx: SmartCompactionUiContext,
  tokens: number | null,
  phase: string,
  options: { completionPercent?: number | null } = {},
): void {
  if (typeof ctx.ui.setStatus !== "function") return;
  const contextWindow = getContextWindowEstimate(ctx);
  if (!contextWindow) return;
  const normalizedTokens = typeof tokens === "number" && Number.isFinite(tokens) && tokens >= 0
    ? Math.round(tokens)
    : null;
  const percent = normalizedTokens == null ? null : (normalizedTokens / contextWindow) * 100;
  const completionPercent = normalizeCompletionPercent(options.completionPercent ?? estimateSmartCompactionCompletionPercent(phase));
  ctx.ui.setStatus("context_usage", JSON.stringify({
    tokens: normalizedTokens,
    contextWindow,
    percent,
    estimated: true,
    source: "smart_compaction",
    phase,
    completionPercent,
    completionEstimated: completionPercent != null,
  }));
}

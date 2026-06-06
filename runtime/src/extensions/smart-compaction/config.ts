/**
 * Extracted smart-compaction helper module.
 *
 * Keep this module focused; the public extension facade remains
 * ../smart-compaction.ts.
 */

import { getSystemPromptOverheadTokens, getUnknownModelContextWindow } from "../../utils/context-window-budget.js";

// ---------------------------------------------------------------------------
// Env helpers (must precede constant definitions that reference them)
// ---------------------------------------------------------------------------

export function parsePositiveEnvInt(name: string): number | null {
  const parsed = Number.parseInt(String(process.env[name] || "").trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export type CompactionReasoningEffort = "minimal" | "low" | "medium" | "high";

export type CompactionReasoningPhase =
  | "selective"
  | "progressive_chunk"
  | "progressive_merge"
  | "progressive_final"
  | "progressive_compress";

const COMPACTION_REASONING_EFFORTS = new Set<CompactionReasoningEffort>(["minimal", "low", "medium", "high"]);

const COMPACTION_REASONING_PHASE_ENV: Record<CompactionReasoningPhase, string> = {
  selective: "PICLAW_SMART_COMPACTION_SELECTIVE_REASONING",
  progressive_chunk: "PICLAW_PROGRESSIVE_CHUNK_REASONING",
  progressive_merge: "PICLAW_PROGRESSIVE_MERGE_REASONING",
  progressive_final: "PICLAW_PROGRESSIVE_FINAL_REASONING",
  progressive_compress: "PICLAW_PROGRESSIVE_COMPRESS_REASONING",
};

const DEFAULT_COMPACTION_REASONING_BY_PHASE: Record<CompactionReasoningPhase, CompactionReasoningEffort> = {
  selective: "medium",
  progressive_chunk: "low",
  progressive_merge: "medium",
  progressive_final: "high",
  progressive_compress: "low",
};

export function parseCompactionReasoningEffort(value: unknown): CompactionReasoningEffort | null {
  const normalized = String(value || "").trim().toLowerCase();
  return COMPACTION_REASONING_EFFORTS.has(normalized as CompactionReasoningEffort)
    ? normalized as CompactionReasoningEffort
    : null;
}

export function getConfiguredCompactionReasoningEffort(phase: CompactionReasoningPhase): CompactionReasoningEffort {
  return parseCompactionReasoningEffort(process.env[COMPACTION_REASONING_PHASE_ENV[phase]])
    ?? parseCompactionReasoningEffort(process.env.PICLAW_SMART_COMPACTION_REASONING)
    ?? DEFAULT_COMPACTION_REASONING_BY_PHASE[phase];
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Minimum message count before selective extraction kicks in.
 *  Below this the built-in full-pass is fine. */
export const SELECTIVE_THRESHOLD = 40;

/** Hard cap on chars fed to the LLM prompt. */
export const MAX_PROMPT_CHARS = 60_000;

/** Per-tool-result truncation limit when serializing. */
export const TOOL_RESULT_MAX_CHARS = 1_500;

/** Char budget for the backwards-walk recent context. */
export const RECENT_CONTEXT_BUDGET_CHARS = 25_000;

/** Char budget for kept-message context (what survives compaction). */
export const KEPT_CONTEXT_BUDGET_CHARS = 8_000;

/** How many earliest user turns to include for goal context. */
export const HEAD_USER_TURNS = 3;

/** Context messages to pin around a detected topic-shift boundary. */
export const TOPIC_SHIFT_CONTEXT_BEFORE = 2;
export const TOPIC_SHIFT_CONTEXT_AFTER = 6;

/** Preview length for embedded user-topic snippets. */
export const USER_PREVIEW_MAX_CHARS = 300;

/** Minimum acceptable summary length (chars). */
export const MIN_SUMMARY_CHARS = 100;

/**
 * Absolute prompt-token ceiling for falling through to the upstream full-pass
 * compactor. Some provider sandboxes advertise very large model context windows
 * but enforce lower prompt-token limits for summarization requests; above this
 * ceiling, use Piclaw progressive chunking instead of risking a full-pass 400.
 */
export const FULL_PASS_FALLBACK_MAX_PROMPT_TOKENS = parsePositiveEnvInt("PICLAW_FULL_PASS_COMPACTION_MAX_PROMPT_TOKENS") ?? 200_000;

/** Conservative fallback context window for models that do not publish one. */
export const PROGRESSIVE_FALLBACK_CONTEXT_WINDOW = getUnknownModelContextWindow();

/** Reserve this much of the model context for system prompt, instructions, and output. */
export const PROGRESSIVE_INPUT_CONTEXT_FRACTION = 0.42;

/** Keep chunk prompts smaller than final merge prompts; smaller models need room to answer. */
export const PROGRESSIVE_CHUNK_FRACTION = 0.72;

// ---------------------------------------------------------------------------
// Overhead & safety margin constants
// ---------------------------------------------------------------------------

/**
 * Estimated token overhead for system prompt, AGENTS.md, tool definitions,
 * skills, memory, plan sidebar, and other per-request framing that is NOT
 * part of the conversation messages but occupies context window space.
 *
 * This overhead is invisible to estimateContextTokens (which only counts
 * messages) but counts against the model's context limit. Without accounting
 * for it, compaction can produce a summary that fits in the "message budget"
 * but overflows when combined with the system prompt.
 *
 * Conservative estimate: ~4000 tokens (AGENTS.md ~2k, tools ~1k, skills/memory ~1k).
 * Can be overridden via PICLAW_SYSTEM_PROMPT_OVERHEAD_TOKENS.
 */
export const SYSTEM_PROMPT_OVERHEAD_TOKENS = getSystemPromptOverheadTokens();

/**
 * Safety margin applied to all budget calculations. Accounts for:
 * - Token estimation inaccuracy (chars/4 is approximate)
 * - Provider-side token counting differences
 * - Summary generation variability
 */
export const BUDGET_SAFETY_MARGIN = 0.85;

/**
 * Optional maximum progressive compaction chunk count.
 * 0 means unbounded by count; elapsed-time and per-call prompt budgets remain
 * the safety limits. Do not increase chunk size to satisfy this cap, because
 * oversized chunks are exactly what progressive mode is meant to avoid.
 */
export const MAX_PROGRESSIVE_CHUNKS = parsePositiveEnvInt("PICLAW_PROGRESSIVE_COMPACTION_MAX_CHUNKS") ?? 0;

/** Number of progressive chunk summaries to run concurrently. Keep this small to avoid provider throttling. */
export const PROGRESSIVE_COMPACTION_CONCURRENCY = Math.min(
  8,
  Math.max(1, parsePositiveEnvInt("PICLAW_PROGRESSIVE_COMPACTION_CONCURRENCY") ?? 3),
);

/** Minimum interval between live smart-compaction progress updates. */
export const SMART_COMPACTION_PROGRESS_INTERVAL_MS = parsePositiveEnvInt("PICLAW_SMART_COMPACTION_PROGRESS_INTERVAL_MS") ?? 5_000;

/** Maximum fraction of context window that keepRecentTokens may consume. */
export const MAX_KEEP_RECENT_FRACTION = 0.50;

/** Elapsed-time guard: abort progressive compaction if approaching timeout. */
export const PROGRESSIVE_TIME_BUDGET_FRACTION = 0.80;

/** Minimum useful output budget for a compaction LLM call. */
export const MIN_COMPACTION_OUTPUT_TOKENS = 512;

/** Hard cap on generated summary tokens per compaction LLM call. */
export const MAX_COMPACTION_OUTPUT_TOKENS = 8_192;

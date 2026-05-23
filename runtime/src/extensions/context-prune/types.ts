/**
 * Shared types for Piclaw's built-in context pruning extension.
 *
 * Adapted from pi-context-prune's core data model: summarize completed tool
 * calls, keep compact summary messages in context, and preserve the original
 * full outputs in custom session entries for later retrieval.
 */

export const CUSTOM_TYPE_SUMMARY = "context-prune-summary";
export const CUSTOM_TYPE_INDEX = "context-prune-index";
export const CONTEXT_PRUNE_TOOL_NAME = "context_prune";
export const CONTEXT_TREE_QUERY_TOOL_NAME = "context_tree_query";

export interface CapturedToolCall {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  resultText: string;
  isError: boolean;
}

export interface CapturedBatch {
  turnIndex: number;
  timestamp: number;
  assistantText: string;
  toolCalls: CapturedToolCall[];
  userTurnGroup?: number;
}

export interface ToolCallRecord {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  resultText: string;
  isError: boolean;
  turnIndex: number;
  timestamp: number;
}

export interface IndexEntryData {
  toolCalls: ToolCallRecord[];
}

export interface SummaryToolCallRef {
  shortId: string;
  toolCallId: string;
}

export interface SummaryMessageDetails {
  toolCallRefs: SummaryToolCallRef[];
  toolNames: string[];
  turnIndex: number;
  timestamp: number;
}

export interface SummarizeResult {
  summaryText: string;
  usage?: unknown;
}

export type FlushResult =
  | {
      ok: true;
      reason: "flushed" | "skipped-oversized";
      batchCount: number;
      toolCallCount: number;
      rawCharCount: number;
      summaryCharCount: number;
      skippedCount: number;
    }
  | { ok: false; reason: "empty" | "already-flushing" | "summarizer-failed" | "failed" | "aborted"; error?: string };

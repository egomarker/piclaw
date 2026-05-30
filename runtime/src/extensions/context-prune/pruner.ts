import type { ToolCallIndexer } from "./indexer.js";
import { CUSTOM_TYPE_INDEX, CUSTOM_TYPE_SUMMARY } from "./types.js";
import { normalizeSummaryToolCallRefs } from "./summary-refs.js";

/** Removes summarized ToolResultMessages while keeping assistant tool-call blocks and all other context. */
export function pruneMessages(messages: any[], indexer: ToolCallIndexer): any[] {
  return messages.filter((msg) => !(msg?.role === "toolResult" && msg.toolCallId && indexer.isSummarized(msg.toolCallId)));
}

export interface ContextPruneCompactionSanitization {
  messages: any[];
  summarizedToolCallIds: Set<string>;
  aliasByToolCallId: Map<string, string>;
  prunedToolResults: number;
  replacedToolCalls: number;
}

function collectSummarizedToolCalls(branchEntries: any[] | undefined): {
  summarizedToolCallIds: Set<string>;
  aliasByToolCallId: Map<string, string>;
} {
  const summarizedToolCallIds = new Set<string>();
  const aliasByToolCallId = new Map<string, string>();
  if (!Array.isArray(branchEntries)) return { summarizedToolCallIds, aliasByToolCallId };

  for (const entry of branchEntries) {
    if (entry?.type === "custom" && entry.customType === CUSTOM_TYPE_INDEX && Array.isArray(entry.data?.toolCalls)) {
      for (const record of entry.data.toolCalls) {
        if (typeof record?.toolCallId === "string" && record.toolCallId) summarizedToolCallIds.add(record.toolCallId);
      }
      continue;
    }

    if (entry?.type === "custom_message" && entry.customType === CUSTOM_TYPE_SUMMARY) {
      for (const ref of normalizeSummaryToolCallRefs(entry.details)) {
        summarizedToolCallIds.add(ref.toolCallId);
        if (!aliasByToolCallId.has(ref.toolCallId)) aliasByToolCallId.set(ref.toolCallId, ref.shortId);
      }
    }
  }

  return { summarizedToolCallIds, aliasByToolCallId };
}

function compactToolArgs(args: unknown): string {
  let raw: string;
  try {
    raw = JSON.stringify(args ?? {});
  } catch {
    raw = String(args ?? "{}");
  }
  return raw.length > 180 ? `${raw.slice(0, 177)}...` : raw;
}

function buildPrunedToolCallPlaceholder(block: any, shortRef: string | undefined): { type: "text"; text: string } {
  const name = String(block?.name || "tool");
  const args = block?.arguments ?? block?.input ?? block?.args ?? {};
  const ref = shortRef ? ` ref ${shortRef}` : "";
  return {
    type: "text",
    text: `[context-pruned tool call${ref}: ${name}(${compactToolArgs(args)}) — raw result omitted from compaction input because context_prune already summarized it; use context_tree_query if the original output is needed.]`,
  };
}

/**
 * Sanitizes native/smart compaction input after context_prune has run.
 *
 * Context pruning is intentionally non-destructive: the full raw tool results
 * remain in session history so context_tree_query can recover them. Native
 * compaction is different: it builds its summarization prompt from raw session
 * history, so without this sanitization it can re-send already-pruned giant tool
 * outputs and overflow the provider. We therefore drop summarized raw
 * ToolResultMessages and replace matching assistant tool-call blocks with short
 * placeholders while preserving context-prune-summary custom messages.
 */
export function sanitizeContextPruneCompactionMessages(
  messages: any[],
  branchEntries: any[] | undefined,
): ContextPruneCompactionSanitization {
  const { summarizedToolCallIds, aliasByToolCallId } = collectSummarizedToolCalls(branchEntries);
  if (summarizedToolCallIds.size === 0 || messages.length === 0) {
    return { messages, summarizedToolCallIds, aliasByToolCallId, prunedToolResults: 0, replacedToolCalls: 0 };
  }

  let prunedToolResults = 0;
  let replacedToolCalls = 0;
  let changed = false;

  const sanitized = messages.flatMap((message) => {
    if (message?.role === "toolResult" && typeof message.toolCallId === "string" && summarizedToolCallIds.has(message.toolCallId)) {
      prunedToolResults++;
      changed = true;
      return [];
    }

    if (message?.role !== "assistant" || !Array.isArray(message.content)) return [message];

    let messageChanged = false;
    const content = message.content.map((block: any) => {
      const id = typeof block?.id === "string" ? block.id : (typeof block?.toolCallId === "string" ? block.toolCallId : "");
      if (block?.type !== "toolCall" || !id || !summarizedToolCallIds.has(id)) return block;
      messageChanged = true;
      replacedToolCalls++;
      return buildPrunedToolCallPlaceholder(block, aliasByToolCallId.get(id));
    });

    if (!messageChanged) return [message];
    changed = true;
    return [{ ...message, content }];
  });

  return {
    messages: changed ? sanitized : messages,
    summarizedToolCallIds,
    aliasByToolCallId,
    prunedToolResults,
    replacedToolCalls,
  };
}

import type { CapturedBatch, SummaryMessageDetails, SummaryToolCallRef } from "./types.js";

const SHORT_ID_PREFIX = "t";

export function buildShortToolCallRefs(
  toolCallIds: string[],
  startIndex: number,
): { refs: SummaryToolCallRef[]; nextIndex: number } {
  const refs = toolCallIds.map((toolCallId, offset) => ({
    shortId: `${SHORT_ID_PREFIX}${startIndex + offset}`,
    toolCallId,
  }));
  return { refs, nextIndex: startIndex + refs.length };
}

export function normalizeSummaryToolCallRefs(details: unknown): SummaryToolCallRef[] {
  if (!details || typeof details !== "object") return [];
  const raw = details as { toolCallRefs?: unknown; toolCallIds?: unknown };

  if (Array.isArray(raw.toolCallRefs)) {
    return raw.toolCallRefs
      .filter((ref): ref is SummaryToolCallRef =>
        !!ref &&
        typeof (ref as SummaryToolCallRef).shortId === "string" &&
        typeof (ref as SummaryToolCallRef).toolCallId === "string")
      .map((ref) => ({ shortId: ref.shortId, toolCallId: ref.toolCallId }));
  }

  if (Array.isArray(raw.toolCallIds)) {
    return raw.toolCallIds
      .filter((id): id is string => typeof id === "string")
      .map((id) => ({ shortId: id, toolCallId: id }));
  }

  return [];
}

export function formatSummaryToolCallRefs(refs: SummaryToolCallRef[]): string {
  const refList = refs.map((ref) => `\`${ref.shortId}\``).join(", ");
  return [
    "",
    "---",
    `**Summarized tool refs**: ${refList}`,
    "Use `context_tree_query` with these refs to retrieve the original full outputs.",
  ].join("\n");
}

export function makeSummaryDetails(batch: CapturedBatch, refs: SummaryToolCallRef[]): SummaryMessageDetails {
  return {
    toolCallRefs: refs,
    toolNames: batch.toolCalls.map((tc) => tc.toolName),
    turnIndex: batch.turnIndex,
    timestamp: batch.timestamp,
  };
}

import type { CapturedBatch, CapturedToolCall } from "./types.js";

/** Converts a completed assistant message and its tool results into a prunable batch. */
export function captureBatch(
  message: any,
  toolResults: any[],
  turnIndex: number,
  timestamp: number,
): CapturedBatch {
  const content: any[] = Array.isArray(message?.content) ? message.content : [];

  const assistantText = content
    .filter((block: any) => block?.type === "text")
    .map((block: any) => String(block.text || ""))
    .join("\n")
    .trim();

  const toolCalls: CapturedToolCall[] = content
    .filter((block: any) => block?.type === "toolCall")
    .map((block: any) => {
      const toolCallId = String(block.id ?? block.toolCallId ?? "");
      const match = toolResults.find((result: any) => result?.toolCallId === toolCallId);
      const resultContent: any[] = Array.isArray(match?.content) ? match.content : [];
      const resultText = match
        ? resultContent
            .filter((c: any) => c?.type === "text")
            .map((c: any) => String(c.text || ""))
            .join("\n")
        : "(no result)";

      return {
        toolCallId,
        toolName: String(block.name || "tool"),
        args: block.input ?? block.args ?? block.arguments ?? {},
        resultText,
        isError: Boolean(match?.isError),
      } satisfies CapturedToolCall;
    })
    .filter((tc) => Boolean(tc.toolCallId));

  return { turnIndex, timestamp, assistantText, toolCalls };
}

/**
 * Scans the current session branch for assistant tool calls whose results exist
 * and have not yet been summarized. The output order follows session order.
 */
export function captureUnindexedBatchesFromSession(
  branch: any[],
  indexer: { isSummarized(id: string): boolean },
  excludeToolNames: string[] = [],
): CapturedBatch[] {
  const resultMap = new Map<string, any>();
  for (const entry of branch) {
    if (entry?.type !== "message") continue;
    const m = entry.message;
    if (m?.role === "toolResult" && m.toolCallId) resultMap.set(m.toolCallId, m);
  }

  const batches: CapturedBatch[] = [];
  let turnCounter = 0;
  let userTurnGroup = 0;

  for (const entry of branch) {
    if (entry?.type !== "message") continue;
    const msg = entry.message;

    if (msg?.role === "user") {
      userTurnGroup++;
      continue;
    }
    if (msg?.role !== "assistant") continue;

    const currentTurnIndex = turnCounter++;
    const content = Array.isArray(msg.content) ? msg.content : [];
    const toolCallBlocks = content.filter((c: any) => c?.type === "toolCall");
    const readyToPrune = toolCallBlocks.filter((tc: any) => {
      const id = String(tc.id ?? tc.toolCallId ?? "");
      if (!id) return false;
      if (indexer.isSummarized(id)) return false;
      if (excludeToolNames.includes(String(tc.name || ""))) return false;
      return resultMap.has(id);
    });

    if (readyToPrune.length === 0) continue;

    const results = readyToPrune.map((tc: any) => resultMap.get(String(tc.id ?? tc.toolCallId)));
    const readyIds = new Set(readyToPrune.map((tc: any) => String(tc.id ?? tc.toolCallId)));
    const ts = entry.timestamp ? new Date(entry.timestamp).getTime() : (msg.timestamp ?? Date.now());
    const batch = captureBatch(msg, results, currentTurnIndex, ts);
    batches.push({
      ...batch,
      toolCalls: batch.toolCalls.filter((tc) => readyIds.has(tc.toolCallId)),
      userTurnGroup,
    });
  }

  return batches;
}

export function serializeBatchForSummarizer(batch: CapturedBatch): string {
  const parts: string[] = [];
  if (batch.assistantText) parts.push(`Assistant said: ${batch.assistantText}\n`);

  const toolParts = batch.toolCalls.map((tc) => {
    const status = tc.isError ? "ERROR" : "OK";
    const argsJson = JSON.stringify(tc.args, null, 2);
    const maxChars = 2_000;
    const resultText = tc.resultText.length > maxChars
      ? `${tc.resultText.slice(0, maxChars)} ...[${tc.resultText.length - maxChars} chars truncated]`
      : tc.resultText;
    return `Tool: ${tc.toolName}(${argsJson})\nResult (${status}): ${resultText}`;
  });

  parts.push(toolParts.join("\n---\n"));
  return parts.join("\n");
}

export function serializeBatchesForSummarizer(batches: CapturedBatch[]): string {
  return batches
    .map((batch, i) => `=== Turn ${batch.turnIndex}${i > 0 ? ` (batch ${i + 1})` : ""} ===\n${serializeBatchForSummarizer(batch)}`)
    .join("\n\n");
}

/** Merge consecutive batches by user→assistant span when desired. */
export function groupBatchesByAgentMessage(batches: CapturedBatch[]): CapturedBatch[] {
  const out: CapturedBatch[] = [];
  let current: (CapturedBatch & { userTurnGroup: number }) | null = null;

  for (const batch of batches) {
    if (batch.userTurnGroup === undefined) {
      current = null;
      out.push(batch);
      continue;
    }

    if (current && current.userTurnGroup === batch.userTurnGroup) {
      current.assistantText = [current.assistantText, batch.assistantText].filter(Boolean).join("\n\n");
      current.toolCalls = current.toolCalls.concat(batch.toolCalls);
      current.turnIndex = batch.turnIndex;
      current.timestamp = batch.timestamp;
      continue;
    }

    current = { ...batch, userTurnGroup: batch.userTurnGroup };
    out.push(current);
  }

  return out;
}

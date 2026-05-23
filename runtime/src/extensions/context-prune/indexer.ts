import type { CapturedBatch, IndexEntryData, SummaryToolCallRef, ToolCallRecord } from "./types.js";
import { CUSTOM_TYPE_INDEX, CUSTOM_TYPE_SUMMARY } from "./types.js";
import { buildShortToolCallRefs, normalizeSummaryToolCallRefs } from "./summary-refs.js";

export class ToolCallIndexer {
  private readonly index = new Map<string, ToolCallRecord>();
  private readonly aliasToToolCallId = new Map<string, string>();
  private nextShortAliasNumber = 1;

  reconstructFromSession(ctx: { sessionManager?: { getBranch?: () => any[] } }): void {
    this.index.clear();
    this.aliasToToolCallId.clear();
    this.nextShortAliasNumber = 1;

    const branch = ctx.sessionManager?.getBranch?.() ?? [];
    for (const entry of branch) {
      if (entry?.type === "custom" && entry.customType === CUSTOM_TYPE_INDEX) {
        const data = entry.data as IndexEntryData | undefined;
        if (Array.isArray(data?.toolCalls)) {
          for (const toolCall of data.toolCalls) this.index.set(toolCall.toolCallId, toolCall);
        }
        continue;
      }

      if (entry?.type === "custom_message" && entry.customType === CUSTOM_TYPE_SUMMARY) {
        this.registerSummaryRefs(normalizeSummaryToolCallRefs(entry.details));
      }
    }
  }

  isSummarized(toolCallId: string): boolean {
    return this.index.has(toolCallId);
  }

  getIndex(): Map<string, ToolCallRecord> {
    return this.index;
  }

  registerSummaryRefs(refs: SummaryToolCallRef[]): void {
    for (const ref of refs) {
      if (!ref.shortId || !ref.toolCallId) continue;
      if (ref.shortId !== ref.toolCallId) this.aliasToToolCallId.set(ref.shortId, ref.toolCallId);
      const match = /^t(\d+)$/.exec(ref.shortId);
      if (match) this.nextShortAliasNumber = Math.max(this.nextShortAliasNumber, Number(match[1]) + 1);
    }
  }

  allocateSummaryRefs(batch: CapturedBatch): SummaryToolCallRef[] {
    const { refs, nextIndex } = buildShortToolCallRefs(
      batch.toolCalls.map((tc) => tc.toolCallId),
      this.nextShortAliasNumber,
    );
    this.nextShortAliasNumber = nextIndex;
    return refs;
  }

  resolveToolCallId(toolCallIdOrAlias: string): string | undefined {
    if (this.index.has(toolCallIdOrAlias)) return toolCallIdOrAlias;
    return this.aliasToToolCallId.get(toolCallIdOrAlias);
  }

  getRecord(toolCallIdOrAlias: string): ToolCallRecord | undefined {
    const resolved = this.resolveToolCallId(toolCallIdOrAlias);
    return resolved ? this.index.get(resolved) : undefined;
  }

  buildIndexEntry(batch: CapturedBatch): IndexEntryData {
    return {
      toolCalls: batch.toolCalls.map((tc) => ({
        toolCallId: tc.toolCallId,
        toolName: tc.toolName,
        args: tc.args,
        resultText: tc.resultText,
        isError: tc.isError,
        turnIndex: batch.turnIndex,
        timestamp: batch.timestamp,
      })),
    };
  }

  addBatch(batch: CapturedBatch): IndexEntryData {
    const data = this.buildIndexEntry(batch);
    for (const record of data.toolCalls) this.index.set(record.toolCallId, record);
    return data;
  }
}

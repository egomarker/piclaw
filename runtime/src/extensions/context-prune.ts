/**
 * context-prune.ts – On-demand tool-result summarization and retrieval.
 *
 * Imports the useful core of pi-context-prune into Piclaw as a built-in
 * extension: the agent can call context_prune to summarize completed tool
 * outputs, future context omits the summarized raw ToolResultMessages, and
 * context_tree_query can recover originals by the short refs in summaries.
 */

import { Type } from "typebox";
import type { AgentToolResult, ExtensionAPI, ExtensionContext, ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { createLogger } from "../utils/logger.js";
import { captureUnindexedBatchesFromSession, groupBatchesByAgentMessage } from "./context-prune/batch-capture.js";
import { ToolCallIndexer } from "./context-prune/indexer.js";
import { pruneMessages } from "./context-prune/pruner.js";
import { registerContextTreeQueryTool } from "./context-prune/query-tool.js";
import { summarizeBatch } from "./context-prune/summarizer.js";
import { formatSummaryToolCallRefs, makeSummaryDetails } from "./context-prune/summary-refs.js";
import {
  CONTEXT_PRUNE_TOOL_NAME,
  CONTEXT_TREE_QUERY_TOOL_NAME,
  CUSTOM_TYPE_INDEX,
  CUSTOM_TYPE_SUMMARY,
  type CapturedBatch,
  type FlushResult,
} from "./context-prune/types.js";

const log = createLogger("ext.context-prune");

function sendToolProgress(onUpdate: ((result: AgentToolResult<unknown>) => void) | undefined, text: string): void {
  onUpdate?.({ content: [{ type: "text", text }], details: {} });
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function rawCharCount(batch: CapturedBatch): number {
  return batch.toolCalls.reduce((sum, tc) => sum + tc.resultText.length, 0);
}

function makeResultText(result: FlushResult): string {
  if (!result.ok) {
    if (result.reason === "empty") return "Context prune found no completed, unpruned tool results to summarize.";
    if (result.reason === "aborted") return "Context prune was cancelled. No new tool results were summarized.";
    return `Context prune did not complete: ${result.reason}${result.error ? ` (${result.error})` : ""}.`;
  }

  const skipped = result.skippedCount > 0 ? ` Skipped ${result.skippedCount} oversized batch${result.skippedCount === 1 ? "" : "es"}.` : "";
  return `Context prune ${result.reason === "skipped-oversized" ? "skipped" : "completed"}. Summarized ${result.toolCallCount} tool call${result.toolCallCount === 1 ? "" : "s"} from ${result.batchCount} batch${result.batchCount === 1 ? "" : "es"}. Summary size: ${result.summaryCharCount} chars vs ${result.rawCharCount} raw chars.${skipped} Use context_tree_query with summary refs to retrieve full outputs.`;
}

export const contextPrune: ExtensionFactory = (pi: ExtensionAPI) => {
  const indexer = new ToolCallIndexer();
  let isFlushing = false;

  const capturePendingBatches = (ctx: ExtensionContext): CapturedBatch[] => {
    const branch = ctx.sessionManager.getBranch();
    const batches = captureUnindexedBatchesFromSession(branch, indexer, [
      CONTEXT_PRUNE_TOOL_NAME,
      CONTEXT_TREE_QUERY_TOOL_NAME,
    ]).filter((batch) => batch.toolCalls.length > 0);
    return groupBatchesByAgentMessage(batches);
  };

  const persistSummary = (ctx: ExtensionContext, content: string, details: unknown): void => {
    try {
      pi.sendMessage({ customType: CUSTOM_TYPE_SUMMARY, content, display: true, details });
      return;
    } catch (err) {
      log.debug("Falling back to direct custom summary append", { operation: "context_prune.summary_fallback", error: errorMessage(err) });
    }

    const sessionManager = ctx.sessionManager as unknown as {
      appendCustomMessageEntry?: (customType: string, content: string, display: boolean, details?: unknown) => string;
    };
    sessionManager.appendCustomMessageEntry?.(CUSTOM_TYPE_SUMMARY, content, true, details);
  };

  const persistIndex = (ctx: ExtensionContext, batch: CapturedBatch): void => {
    const data = indexer.addBatch(batch);
    try {
      pi.appendEntry(CUSTOM_TYPE_INDEX, data);
      return;
    } catch (err) {
      log.debug("Falling back to direct custom index append", { operation: "context_prune.index_fallback", error: errorMessage(err) });
    }

    const sessionManager = ctx.sessionManager as unknown as {
      appendCustomEntry?: (customType: string, data?: unknown) => string;
    };
    sessionManager.appendCustomEntry?.(CUSTOM_TYPE_INDEX, data);
  };

  const flushPending = async (
    ctx: ExtensionContext,
    options: { signal?: AbortSignal; onUpdate?: (result: AgentToolResult<unknown>) => void } = {},
  ): Promise<FlushResult> => {
    if (isFlushing) return { ok: false, reason: "already-flushing" };
    if (options.signal?.aborted) return { ok: false, reason: "aborted" };

    const batches = capturePendingBatches(ctx);
    if (batches.length === 0) return { ok: false, reason: "empty" };

    isFlushing = true;
    let processedBatchCount = 0;
    let skippedCount = 0;
    let totalToolCallCount = 0;
    let totalRawChars = 0;
    let totalSummaryChars = 0;

    try {
      for (let index = 0; index < batches.length; index++) {
        const batch = batches[index];
        if (options.signal?.aborted) return { ok: false, reason: "aborted" };
        sendToolProgress(options.onUpdate, `Context prune summarizing batch ${index + 1}/${batches.length} (${batch.toolCalls.length} tool call${batch.toolCalls.length === 1 ? "" : "s"})…`);

        const result = await summarizeBatch(batch, ctx, { signal: options.signal });
        if (!result) return { ok: false, reason: "summarizer-failed" };

        const refs = indexer.allocateSummaryRefs(batch);
        const summaryText = result.summaryText + formatSummaryToolCallRefs(refs);
        const batchRawChars = rawCharCount(batch);
        const batchSummaryChars = summaryText.length;

        totalRawChars += batchRawChars;
        totalSummaryChars += batchSummaryChars;
        totalToolCallCount += batch.toolCalls.length;
        processedBatchCount++;

        if (batchSummaryChars > batchRawChars) {
          skippedCount++;
          log.info("Skipped oversized context prune summary", {
            operation: "context_prune.skip_oversized",
            turnIndex: batch.turnIndex,
            toolCallCount: batch.toolCalls.length,
            rawChars: batchRawChars,
            summaryChars: batchSummaryChars,
          });
          continue;
        }

        indexer.registerSummaryRefs(refs);
        persistSummary(ctx, summaryText, makeSummaryDetails(batch, refs));
        persistIndex(ctx, batch);
      }

      return {
        ok: true,
        reason: skippedCount === processedBatchCount ? "skipped-oversized" : "flushed",
        batchCount: processedBatchCount,
        toolCallCount: totalToolCallCount,
        rawCharCount: totalRawChars,
        summaryCharCount: totalSummaryChars,
        skippedCount,
      };
    } catch (err) {
      if (options.signal?.aborted) return { ok: false, reason: "aborted" };
      return { ok: false, reason: "failed", error: errorMessage(err) };
    } finally {
      isFlushing = false;
    }
  };

  pi.on("session_start", async (_event, ctx) => {
    indexer.reconstructFromSession(ctx);
  });

  pi.on("session_tree", async (_event, ctx) => {
    indexer.reconstructFromSession(ctx);
  });

  pi.on("context", async (event) => {
    if (indexer.getIndex().size === 0) return undefined;
    const messages = pruneMessages(event.messages, indexer);
    return messages.length === event.messages.length ? undefined : { messages };
  });

  registerContextTreeQueryTool(pi, indexer);

  pi.registerTool({
    name: CONTEXT_PRUNE_TOOL_NAME,
    label: "Prune Context",
    description:
      "Summarize completed tool-call results, prune their raw outputs from future context, and preserve originals for context_tree_query retrieval.",
    promptSnippet: "Summarize completed tool-call results and prune raw outputs from future context",
    promptGuidelines: [
      "Use context_prune at natural task boundaries after a cohesive batch of tool calls, not after trivial single calls.",
      "After pruning, use context_tree_query with summary refs if you need the original full tool output again.",
    ],
    parameters: Type.Object({}),
    async execute(_toolCallId, _params, signal, onUpdate, ctx): Promise<AgentToolResult<unknown>> {
      sendToolProgress(onUpdate, "Context prune scanning current session branch…");
      const result = await flushPending(ctx, { signal, onUpdate });
      return {
        content: [{ type: "text", text: makeResultText(result) }],
        details: result,
      };
    },
  });
};

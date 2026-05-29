/**
 * Extracted smart-compaction helper module.
 *
 * Keep this module focused; the public extension facade remains
 * ../smart-compaction.ts.
 */

import type { Message } from "@earendil-works/pi-ai";
import type { FileOperations } from "@earendil-works/pi-coding-agent";
import { streamComplete, type CompactionStreamFn } from "./stream-complete.js";
import {
  BUDGET_SAFETY_MARGIN,
  MAX_PROGRESSIVE_CHUNKS,
  MAX_PROMPT_CHARS,
  MIN_SUMMARY_CHARS,
  PROGRESSIVE_CHUNK_FRACTION,
  PROGRESSIVE_FALLBACK_CONTEXT_WINDOW,
  PROGRESSIVE_INPUT_CONTEXT_FRACTION,
  PROGRESSIVE_TIME_BUDGET_FRACTION,
  parsePositiveEnvInt,
} from "./config.js";
import { getEffectiveContextWindow, getSystemPromptOverheadTokens } from "../../utils/context-window-budget.js";
import { estimateCompactionPromptTokens, getModelContextWindow } from "./context.js";
import { compressFilePaths, fileListsFromOps } from "./files.js";
import { serializeMessage, serializeToolCompact } from "./messages.js";
import { getCompactionReasoningEffort, getSafeCompactionMaxTokens } from "./safety.js";
import { SYSTEM_PROMPT } from "./selective-prompt.js";

export interface ProgressiveCompactionBudget {
  contextWindow: number;
  promptBudgetChars: number;
  chunkBudgetChars: number;
  mergeBudgetChars: number;
  forceProgressive: boolean;
}

export interface ProgressiveCompactionChunk {
  index: number;
  startMessageIndex: number;
  endMessageIndex: number;
  text: string;
  estimatedChars: number;
}

export function getProgressiveCompactionBudget(model: unknown, targetContextWindow?: number | null): ProgressiveCompactionBudget {
  const reportedWindow = getModelContextWindow(model) ?? PROGRESSIVE_FALLBACK_CONTEXT_WINDOW;
  const contextWindow = typeof targetContextWindow === "number" && Number.isFinite(targetContextWindow) && targetContextWindow > 0
    ? Math.min(Math.trunc(targetContextWindow), reportedWindow)
    : reportedWindow;
  // Subtract system prompt overhead before computing input budgets.
  // The overhead (AGENTS.md, tools, skills, memory) is invisible to message
  // token estimates but eats real context space.
  const effectiveWindow = getEffectiveContextWindow(contextWindow, getSystemPromptOverheadTokens());
  const envBudget = parsePositiveEnvInt("PICLAW_PROGRESSIVE_COMPACTION_PROMPT_CHARS");
  const computedPromptBudget = Math.floor(effectiveWindow * 4 * PROGRESSIVE_INPUT_CONTEXT_FRACTION);
  const rawPromptBudget = envBudget ?? Math.min(MAX_PROMPT_CHARS, Math.max(2_000, computedPromptBudget));
  // Apply safety margin: leave room for estimation inaccuracy
  const promptBudgetChars = Math.max(1_000, Math.floor(rawPromptBudget * BUDGET_SAFETY_MARGIN));
  const chunkBudgetChars = Math.min(promptBudgetChars, Math.max(1_000, Math.floor(promptBudgetChars * PROGRESSIVE_CHUNK_FRACTION)));
  const mergeBudgetChars = Math.max(2_000, promptBudgetChars);
  return {
    contextWindow,
    promptBudgetChars,
    chunkBudgetChars,
    mergeBudgetChars,
    forceProgressive: process.env.PICLAW_PROGRESSIVE_COMPACTION === "1",
  };
}

function serializeProgressiveSourceLines(
  messages: Message[],
  humanUserIndexes?: Set<number>,
): Array<{ startMessageIndex: number; endMessageIndex: number; text: string }> {
  const lines: Array<{ startMessageIndex: number; endMessageIndex: number; text: string }> = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === "assistant" && Array.isArray((msg as any).content)) {
      const hasToolCalls = ((msg as any).content as any[]).some((b: any) => b?.type === "toolCall");
      if (hasToolCalls) {
        const resultIdx = i + 1 < messages.length && messages[i + 1].role === "toolResult" ? i + 1 : null;
        const compact = serializeToolCompact(msg, resultIdx !== null ? messages[resultIdx] : null, i);
        if (compact) {
          lines.push({
            startMessageIndex: i,
            endMessageIndex: resultIdx ?? i,
            text: compact,
          });
          if (resultIdx !== null) i = resultIdx;
          continue;
        }
      }
    }
    const text = serializeMessage(msg, i, humanUserIndexes);
    if (text) lines.push({ startMessageIndex: i, endMessageIndex: i, text });
  }
  return lines;
}

export function buildProgressiveCompactionChunks(
  messages: Message[],
  budgetChars: number,
  humanUserIndexes?: Set<number>,
): ProgressiveCompactionChunk[] {
  const sourceLines = serializeProgressiveSourceLines(messages, humanUserIndexes);
  const chunks: ProgressiveCompactionChunk[] = [];
  let current: string[] = [];
  let startMessageIndex = sourceLines[0]?.startMessageIndex ?? 0;
  let endMessageIndex = sourceLines[0]?.endMessageIndex ?? 0;
  let chars = 0;

  const flush = () => {
    if (current.length === 0) return;
    const text = current.join("\n");
    chunks.push({
      index: chunks.length + 1,
      startMessageIndex,
      endMessageIndex,
      text,
      estimatedChars: text.length,
    });
    current = [];
    chars = 0;
  };

  for (const line of sourceLines) {
    const nextChars = line.text.length + (current.length > 0 ? 1 : 0);
    if (current.length > 0 && chars + nextChars > budgetChars) {
      flush();
      startMessageIndex = line.startMessageIndex;
    } else if (current.length === 0) {
      startMessageIndex = line.startMessageIndex;
    }
    current.push(line.text);
    chars += nextChars;
    endMessageIndex = line.endMessageIndex;
  }
  flush();
  return chunks;
}

function buildChunkSummaryPrompt(chunk: ProgressiveCompactionChunk, totalChunks: number): string {
  return `You are summarizing one deterministic chunk of a longer conversation for progressive compaction.

Chunk: ${chunk.index}/${totalChunks}
Message index range: ${chunk.startMessageIndex}-${chunk.endMessageIndex}

Preserve facts in this structured intermediate form:

## Chunk Range
- ${chunk.startMessageIndex}-${chunk.endMessageIndex}

## Goals / User Intent
- ...

## Constraints & Preferences
- ...

## Decisions
- ...

## Files / Commands / Tool Outcomes
- ...

## Progress
- Done: ...
- In progress: ...
- Blocked: ...

## Open Questions / Next Steps
- ...

## Key Continuity Facts
- ...

Rules:
- Do not invent completion. If uncertain, say so.
- Preserve exact file paths, commands, function names, issue numbers, PR numbers, errors, and user corrections.
- Keep ordering-sensitive facts tied to the chunk range.

<chunk>
${chunk.text}
</chunk>`;
}

function capPromptSection(value: string | undefined, maxChars: number, label: string): string | undefined {
  const text = value?.trim();
  if (!text) return undefined;
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n… (${label} truncated by ${text.length - maxChars} chars to keep progressive merge prompt inside the target context)`;
}

function buildMergePrompt(input: {
  summaries: string[];
  rangeLabel: string;
  final: boolean;
  previousSummary?: string;
  keptMessagesSummary?: string;
  turnPrefixSummary?: string;
  customInstructions?: string;
  fileOps?: FileOperations;
}): string {
  const sections: string[] = [];
  sections.push(input.final
    ? "Merge these ordered intermediate compaction summaries into the final continuity state."
    : "Merge these ordered intermediate compaction summaries into a smaller intermediate summary.");
  sections.push(`Range: ${input.rangeLabel}`);
  sections.push("\nRules:");
  sections.push("- Preserve goals, constraints, decisions, files, commands, open questions, user preferences, and current next steps.");
  sections.push("- Preserve exact paths, issue/PR numbers, commands, function names, and errors.");
  sections.push("- Preserve chronological ordering where it matters; newest active work wins over stale background work.");
  sections.push("- Do not drop user corrections or reported failures.");
  const previousSummary = capPromptSection(input.previousSummary, input.final ? 8_000 : 4_000, "previous summary");
  if (previousSummary) {
    sections.push("\n## Previous Summary To Update");
    sections.push(previousSummary);
  }
  const keptMessagesSummary = capPromptSection(input.keptMessagesSummary, input.final ? 6_000 : 3_000, "kept messages");
  if (keptMessagesSummary) {
    sections.push("\n## Kept Messages That Survive Compaction (current work)");
    sections.push(keptMessagesSummary);
  }
  const turnPrefixSummary = capPromptSection(input.turnPrefixSummary, input.final ? 4_000 : 2_000, "split-turn prefix");
  if (turnPrefixSummary) {
    sections.push("\n## Split Turn Prefix Context");
    sections.push(turnPrefixSummary);
  }
  const customInstructions = capPromptSection(input.customInstructions, 2_000, "custom instructions");
  if (customInstructions) {
    sections.push("\n## User Compaction Note");
    sections.push(customInstructions);
  }
  sections.push("\n## Ordered Intermediate Summaries");
  input.summaries.forEach((summary, idx) => {
    sections.push(`\n<summary index="${idx + 1}">\n${summary}\n</summary>`);
  });
  if (input.final) {
    const files = input.fileOps ? fileListsFromOps(input.fileOps) : { readFiles: [], modifiedFiles: [] };
    sections.push("\nOutput this exact final format:");
    sections.push(SYSTEM_PROMPT.replace(/^You are[\s\S]*?Use this EXACT format:\n\n/, ""));
    sections.push("\nFile facts from deterministic tool analysis:");
    sections.push(`Modified files:\n${files.modifiedFiles.length ? compressFilePaths(files.modifiedFiles) : "- (none)"}`);
    sections.push(`Read files:\n${files.readFiles.length ? compressFilePaths(files.readFiles) : "- (none)"}`);
  } else {
    sections.push("\nReturn a concise structured intermediate summary with the same headings as the chunk summaries.");
  }
  return sections.join("\n");
}

function isCompactionInputOverflow(message: string): boolean {
  return /context\s*(?:length|window)|maximum context|max(?:imum)? tokens|too many tokens|input too large|prompt too large|exceeds.*(?:context|token)|token limit|exceeds safe model budget/i.test(message);
}

export function buildTrimmedProgressiveMergeRetryPrompt(promptText: string, targetPromptTokens: number): string | null {
  const targetChars = Math.max(8_000, Math.floor(targetPromptTokens * 4));
  if (promptText.length <= targetChars) return null;
  const marker = "\n## Ordered Intermediate Summaries";
  const markerIndex = promptText.indexOf(marker);
  const notice = "\n\n… (older/less relevant progressive merge material trimmed after context-overflow; preserve current task continuity and newest active work from the remaining summaries) …\n\n";
  if (markerIndex < 0) {
    const headChars = Math.min(Math.floor(targetChars * 0.35), Math.floor(promptText.length * 0.35));
    const tailChars = Math.max(1_000, targetChars - headChars - notice.length);
    return `${promptText.slice(0, headChars)}${notice}${promptText.slice(-tailChars)}`;
  }
  const headEnd = Math.min(promptText.length, markerIndex + marker.length + 512);
  const head = promptText.slice(0, headEnd);
  const tailChars = targetChars - head.length - notice.length;
  if (tailChars < 1_000) return null;
  return `${head}${notice}${promptText.slice(-tailChars)}`;
}

function hasSafeCompactionOutputRoom(model: any, promptText: string, maxTokens: number): boolean {
  try {
    getSafeCompactionMaxTokens(model, promptText, maxTokens);
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/exceeds safe model budget/i.test(message)) return false;
    throw err;
  }
}

async function completeCompactionPrompt(
  model: any,
  auth: { apiKey?: string; headers?: Record<string, string> },
  promptText: string,
  maxTokens: number,
  abortSignal: AbortSignal,
  streamFn?: CompactionStreamFn,
  onProgress?: (generatedChars: number) => void,
): Promise<string> {
  const runOnce = async (activePromptText: string): Promise<string> => {
    if (abortSignal.aborted) throw new Error("Compaction cancelled");
    const safeOutput = getSafeCompactionMaxTokens(model, activePromptText, maxTokens);
    const response = await streamComplete({
      model,
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: activePromptText,
      maxTokens: safeOutput.maxTokens,
      signal: abortSignal,
      apiKey: auth.apiKey,
      headers: auth.headers,
      reasoning: (model as any).reasoning ? getCompactionReasoningEffort(model) : undefined,
      streamFn,
      onProgress,
    });
    if ((response as any).stopReason === "error") {
      throw new Error((response as any).errorMessage || "Progressive compaction LLM error");
    }
    const summary = response.content
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("\n")
      .trim();
    if (summary.length < MIN_SUMMARY_CHARS) {
      throw new Error("Progressive compaction summary too short");
    }
    if (abortSignal.aborted) throw new Error("Compaction cancelled");
    return summary;
  };

  try {
    return await runOnce(promptText);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const contextWindow = getModelContextWindow(model) ?? PROGRESSIVE_FALLBACK_CONTEXT_WINDOW;
    const trimmedPrompt = isCompactionInputOverflow(message)
      ? buildTrimmedProgressiveMergeRetryPrompt(promptText, Math.floor(contextWindow * 0.65))
      : null;
    if (!trimmedPrompt || trimmedPrompt === promptText || abortSignal.aborted) throw err;
    return await runOnce(trimmedPrompt);
  }
}

async function mergeProgressiveSummaries(input: {
  summaries: string[];
  model: any;
  auth: { apiKey?: string; headers?: Record<string, string> };
  budget: ProgressiveCompactionBudget;
  maxTokens: number;
  abortSignal: AbortSignal;
  ctx: { ui: { setWorkingMessage?: (msg?: string) => void } };
  finalPromptExtras: Omit<Parameters<typeof buildMergePrompt>[0], "summaries" | "rangeLabel" | "final">;
  publishEstimate?: (tokens: number, phase: string) => void;
  timeoutMs?: number;
  startedAt?: number;
  streamFn?: CompactionStreamFn;
  onProgress?: (generatedChars: number) => void;
}): Promise<string> {
  const MAX_PROGRESSIVE_MERGE_PASSES = 12;
  let summaries = input.summaries;
  let pass = 1;
  const buildFinalPrompt = () => buildMergePrompt({
    summaries,
    rangeLabel: "final",
    final: true,
    ...input.finalPromptExtras,
  });

  while (
    summaries.length > 1
    && (
      summaries.join("\n\n").length > input.budget.mergeBudgetChars
      || !hasSafeCompactionOutputRoom(input.model, buildFinalPrompt(), input.maxTokens)
    )
  ) {
    if (pass > MAX_PROGRESSIVE_MERGE_PASSES) {
      throw new Error(`Progressive compaction merge exceeded ${MAX_PROGRESSIVE_MERGE_PASSES} passes; refusing potential infinite merge loop`);
    }
    if (input.timeoutMs && input.startedAt) {
      const elapsed = Date.now() - input.startedAt;
      if (elapsed > input.timeoutMs * PROGRESSIVE_TIME_BUDGET_FRACTION) {
        throw new Error(
          `Progressive compaction time budget exhausted during merge pass ${pass} (${Math.round(elapsed / 1000)}s of ${Math.round(input.timeoutMs / 1000)}s)`,
        );
      }
    }

    const previousChars = summaries.join("\n\n").length;
    const previousCount = summaries.length;
    const next: string[] = [];
    let batch: string[] = [];
    let chars = 0;
    for (const summary of summaries) {
      const nextChars = summary.length + 2;
      if (batch.length > 0 && chars + nextChars > input.budget.mergeBudgetChars) {
        input.ctx.ui.setWorkingMessage?.(`Smart compaction: merging pass ${pass}, batch ${next.length + 1}…`);
        const mergePrompt = buildMergePrompt({ summaries: batch, rangeLabel: `merge-pass-${pass}`, final: false });
        input.publishEstimate?.(estimateCompactionPromptTokens(mergePrompt), `merge_pass_${pass}_batch_${next.length + 1}`);
        next.push(await completeCompactionPrompt(
          input.model,
          input.auth,
          mergePrompt,
          input.maxTokens,
          input.abortSignal,
          input.streamFn,
          input.onProgress,
        ));
        batch = [];
        chars = 0;
      }
      batch.push(summary);
      chars += nextChars;
    }
    if (batch.length > 0) {
      input.ctx.ui.setWorkingMessage?.(`Smart compaction: merging pass ${pass}, batch ${next.length + 1}…`);
      const mergePrompt = buildMergePrompt({ summaries: batch, rangeLabel: `merge-pass-${pass}`, final: false });
      input.publishEstimate?.(estimateCompactionPromptTokens(mergePrompt), `merge_pass_${pass}_batch_${next.length + 1}`);
      next.push(await completeCompactionPrompt(
        input.model,
        input.auth,
        mergePrompt,
        input.maxTokens,
        input.abortSignal,
        input.streamFn,
        input.onProgress,
      ));
    }
    const nextChars = next.join("\n\n").length;
    if (next.length >= previousCount && nextChars >= previousChars) {
      throw new Error(
        `Progressive compaction merge made no progress on pass ${pass} (${previousCount}/${previousChars} → ${next.length}/${nextChars}); refusing potential infinite merge loop`,
      );
    }

    input.ctx.ui.setWorkingMessage?.(`Smart compaction: merge pass ${pass} reduced ${summaries.length} → ${next.length} summaries…`);
    summaries = next;
    pass += 1;
  }

  if (input.timeoutMs && input.startedAt) {
    const elapsed = Date.now() - input.startedAt;
    if (elapsed > input.timeoutMs * PROGRESSIVE_TIME_BUDGET_FRACTION) {
      throw new Error(
        `Progressive compaction time budget exhausted before final merge (${Math.round(elapsed / 1000)}s of ${Math.round(input.timeoutMs / 1000)}s)`,
      );
    }
  }

  input.ctx.ui.setWorkingMessage?.("Smart compaction: final progressive merge…");
  let finalPrompt = buildFinalPrompt();
  for (let compressPass = 1; !hasSafeCompactionOutputRoom(input.model, finalPrompt, input.maxTokens) && summaries.length === 1 && compressPass <= 3; compressPass += 1) {
    const compressPrompt = buildMergePrompt({ summaries, rangeLabel: `final-fit-compress-${compressPass}`, final: false });
    if (!hasSafeCompactionOutputRoom(input.model, compressPrompt, input.maxTokens)) break;
    input.ctx.ui.setWorkingMessage?.(`Smart compaction: compressing final summary to fit context (${compressPass}/3)…`);
    input.publishEstimate?.(estimateCompactionPromptTokens(compressPrompt), `merge_final_compress_${compressPass}`);
    summaries = [await completeCompactionPrompt(
      input.model,
      input.auth,
      compressPrompt,
      input.maxTokens,
      input.abortSignal,
      input.streamFn,
      input.onProgress,
    )];
    finalPrompt = buildFinalPrompt();
  }
  input.publishEstimate?.(estimateCompactionPromptTokens(finalPrompt), "merge_final");
  return await completeCompactionPrompt(
    input.model,
    input.auth,
    finalPrompt,
    input.maxTokens,
    input.abortSignal,
    input.streamFn,
    input.onProgress,
  );
}

export async function runProgressiveCompaction(input: {
  llmMessages: Message[];
  humanUserIndexes: Set<number>;
  model: any;
  auth: { apiKey?: string; headers?: Record<string, string> };
  settings: { reserveTokens: number };
  previousSummary?: string;
  keptMessagesSummary?: string;
  turnPrefixSummary?: string;
  customInstructions?: string;
  fileOps: FileOperations;
  budget: ProgressiveCompactionBudget;
  abortSignal: AbortSignal;
  ctx: { ui: { setWorkingMessage?: (msg?: string) => void } };
  /** Compaction timeout (ms) — used to enforce a time budget so progressive doesn't run over. */
  timeoutMs?: number;
  /** Timestamp when compaction started — paired with timeoutMs for elapsed-time guard. */
  startedAt?: number;
  /** Callback to publish context estimate to the UI meter. */
  publishEstimate?: (tokens: number, phase: string) => void;
  /** Custom stream function for proxy-routed providers. */
  streamFn?: CompactionStreamFn;
  /** Progress callback (chars generated so far). */
  onProgress?: (generatedChars: number) => void;
}): Promise<string> {
  const chunks = buildProgressiveCompactionChunks(
    input.llmMessages,
    input.budget.chunkBudgetChars,
    input.humanUserIndexes,
  );

  // Optional operational guard only. Never enlarge chunks to satisfy it: doing
  // so can recreate oversized provider prompts and defeats incremental mode.
  if (MAX_PROGRESSIVE_CHUNKS > 0 && chunks.length > MAX_PROGRESSIVE_CHUNKS) {
    throw new Error(
      `Progressive compaction would require ${chunks.length} chunks (configured max ${MAX_PROGRESSIVE_CHUNKS}); increase PICLAW_PROGRESSIVE_COMPACTION_MAX_CHUNKS or leave it unset for count-unbounded incremental compaction`,
    );
  }
  const maxTokens = Math.floor(0.8 * input.settings.reserveTokens);
  input.ctx.ui.setWorkingMessage?.(
    `Smart compaction: ${input.llmMessages.length} messages → ${chunks.length} chunks…`,
  );

  const chunkSummaries: string[] = [];
  for (const chunk of chunks) {
    // Time budget guard: abort if we've consumed most of the timeout
    if (input.timeoutMs && input.startedAt) {
      const elapsed = Date.now() - input.startedAt;
      if (elapsed > input.timeoutMs * PROGRESSIVE_TIME_BUDGET_FRACTION) {
        throw new Error(
          `Progressive compaction time budget exhausted after ${chunkSummaries.length}/${chunks.length} chunks (${Math.round(elapsed / 1000)}s of ${Math.round(input.timeoutMs / 1000)}s); refusing to merge an incomplete summary`,
        );
      }
    }
    input.ctx.ui.setWorkingMessage?.(`Smart compaction: summarizing chunk ${chunk.index}/${chunks.length}…`);
    const chunkPrompt = buildChunkSummaryPrompt(chunk, chunks.length);
    input.publishEstimate?.(estimateCompactionPromptTokens(chunkPrompt), `progressive_chunk_${chunk.index}`);
    chunkSummaries.push(await completeCompactionPrompt(
      input.model,
      input.auth,
      chunkPrompt,
      maxTokens,
      input.abortSignal,
      input.streamFn,
      input.onProgress,
    ));
    input.ctx.ui.setWorkingMessage?.(`Smart compaction: summarized chunk ${chunk.index}/${chunks.length}…`);
  }

  if (chunkSummaries.length === 0) {
    throw new Error("Progressive compaction produced no chunk summaries (time budget exhausted before first chunk)");
  }

  return await mergeProgressiveSummaries({
    summaries: chunkSummaries,
    model: input.model,
    auth: input.auth,
    budget: input.budget,
    maxTokens,
    abortSignal: input.abortSignal,
    ctx: input.ctx,
    publishEstimate: input.publishEstimate,
    timeoutMs: input.timeoutMs,
    startedAt: input.startedAt,
    streamFn: input.streamFn,
    onProgress: input.onProgress,
    finalPromptExtras: {
      previousSummary: input.previousSummary,
      keptMessagesSummary: input.keptMessagesSummary,
      turnPrefixSummary: input.turnPrefixSummary,
      customInstructions: input.customInstructions,
      fileOps: input.fileOps,
    },
  });
}

// ---------------------------------------------------------------------------

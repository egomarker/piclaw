/**
 * Extracted smart-compaction helper module.
 *
 * Keep this module focused; the public extension facade remains
 * ../smart-compaction.ts.
 */

import type { FileOperations, CompactionResult } from "@earendil-works/pi-coding-agent";
import type { Message } from "@earendil-works/pi-ai";
import { createLogger } from "../../utils/logger.js";
import { KEPT_CONTEXT_BUDGET_CHARS, MIN_SUMMARY_CHARS } from "./config.js";
import { compressFilePaths, fileListsFromOps } from "./files.js";
import {
  analyzeToolOutcomes,
  buildPreview,
  convertMessagesWithMetadata,
  extractText,
  isRealUserMessage,
  isRealUserSourceMessage,
  selectRecentContextBackwards,
  serializeMessage,
  serializeToolBatchCompact,
  type SourceMessage,
  type ToolOutcomeAnalysis,
} from "./messages.js";
import { formatSmartCompactionStatus } from "./context.js";
import type { TopicShiftSignal } from "./selective-prompt.js";

const log = createLogger("ext.smart-compaction.noop");

// ---------------------------------------------------------------------------

const HARMLESS_ACKNOWLEDGEMENTS = new Set([
  "got it",
  "noted",
  "thank you",
  "thanks",
  "thx",
  "understood",
]);

function isHarmlessAcknowledgement(text: string): boolean {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[.!]+$/g, "")
    .replace(/\s+/g, " ");
  return HARMLESS_ACKNOWLEDGEMENTS.has(normalized);
}

/**
 * Detect compaction windows where an LLM call is unnecessary.
 *
 * Two patterns are detected:
 *
 * 1. **Split-turn continuation** — The compaction window contains zero user
 *    messages (the agent was executing a long tool-call sequence that hit the
 *    token limit mid-turn). The previous summary already describes the goal
 *    and progress; we just append a mechanical file-ops delta.
 *
 * 2. **Harmless acknowledgement** — Every real user message is an exact match
 *    for a narrow acknowledgement allowlist, there are no file modifications,
 *    and no tool outcome carries new state. Shortness alone is never sufficient:
 *    constraints, negations, paths, commands, numbers, and topic signals fall
 *    through to summarization by default.
 *
 * Returns a `{ compaction }` result to short-circuit the LLM path, or
 * `null` to fall through to selective/built-in compaction.
 */
export function tryNoOpCompaction(
  llmMessages: Message[],
  preparation: {
    previousSummary?: string;
    fileOps: FileOperations;
    isSplitTurn?: boolean;
  },
  firstKeptEntryId: string,
  tokensBefore: number,
  topicShift: TopicShiftSignal | null,
  humanUserIndexes: Set<number>,
  toolAnalysis: ToolOutcomeAnalysis,
  currentWorkHints: {
    hasKeptUserContext: boolean;
    hasTurnPrefixHumanUser: boolean;
  },
  ctx: { ui: { setStatus?: (key: string, text: string | undefined) => void } },
): { compaction: CompactionResult } | null {
  const { previousSummary, fileOps } = preparation;

  // We can only do no-op if there IS a previous summary to reuse
  if (!previousSummary || previousSummary.length < MIN_SUMMARY_CHARS) {
    log.debug("Smart compaction no-op rejected", {
      operation: "smart_compaction.noop_classification",
      classification: "summarize",
      reason: "missing_or_short_previous_summary",
    });
    return null;
  }

  // Count real user messages (non-slash-command, non-synthetic)
  let userMessageCount = 0;
  let userTotalChars = 0;
  const userTexts: string[] = [];
  for (let i = 0; i < llmMessages.length; i++) {
    const msg = llmMessages[i];
    if (isRealUserMessage(msg, i, humanUserIndexes)) {
      const text = extractText(msg.content);
      userMessageCount++;
      userTotalChars += text.length;
      userTexts.push(text);
    }
  }

  const { readFiles, modifiedFiles } = fileListsFromOps(fileOps);
  const hasModifications = modifiedFiles.length > 0;
  // topicShift and toolAnalysis are pre-computed by the caller.

  // ── Pattern 1: Split-turn continuation ────────────────────────────
  // Zero user messages in the discarded window can still be unsafe if the
  // dropped prefix of the current turn contains a fresh user instruction.
  if (
    preparation.isSplitTurn
    && userMessageCount === 0
    && !currentWorkHints.hasTurnPrefixHumanUser
    && toolAnalysis.safeForNoOp
  ) {
    const delta = buildMechanicalDelta(llmMessages, modifiedFiles, readFiles, toolAnalysis);
    const summary = appendDeltaToSummary(previousSummary, delta, fileOps);

    ctx.ui.setStatus?.(
      "smart_compaction",
      formatSmartCompactionStatus(
        `Smart compaction: reused summary for split-turn continuation (${llmMessages.length} tool msgs)…`,
        92,
      ),
    );

    log.debug("Smart compaction no-op accepted", {
      operation: "smart_compaction.noop_classification",
      classification: "split_turn_continuation",
      userMessageCount,
      messageCount: llmMessages.length,
      toolOutcomeCount: toolAnalysis.facts.length,
    });
    return {
      compaction: { summary, firstKeptEntryId, tokensBefore },
    };
  }

  // ── Pattern 2: Harmless acknowledgement ──────────────────────────
  // Exact allowlisting keeps short constraints such as "don't deploy" and
  // "use Bun" out of the lossy path. Any tool result with new state also
  // requires summarization even when the user text itself is harmless.
  if (
    userMessageCount > 0 &&
    userTexts.every(isHarmlessAcknowledgement) &&
    !hasModifications &&
    !topicShift &&
    toolAnalysis.safeForNoOp &&
    !currentWorkHints.hasKeptUserContext &&
    !currentWorkHints.hasTurnPrefixHumanUser
  ) {
    const summary = updateFileLists(previousSummary, fileOps);

    ctx.ui.setStatus?.(
      "smart_compaction",
      formatSmartCompactionStatus(
        `Smart compaction: reused summary for harmless acknowledgement (${userTotalChars} user chars)…`,
        92,
      ),
    );

    log.debug("Smart compaction no-op accepted", {
      operation: "smart_compaction.noop_classification",
      classification: "harmless_acknowledgement",
      userMessageCount,
      userTotalChars,
      toolOutcomeCount: toolAnalysis.facts.length,
    });
    return {
      compaction: { summary, firstKeptEntryId, tokensBefore },
    };
  }

  log.debug("Smart compaction no-op rejected", {
    operation: "smart_compaction.noop_classification",
    classification: "summarize",
    reason: "meaningful_continuity_signal",
    isSplitTurn: !!preparation.isSplitTurn,
    userMessageCount,
    hasModifications,
    hasTopicShift: !!topicShift,
    toolOutcomesSafe: toolAnalysis.safeForNoOp,
    hasKeptUserContext: currentWorkHints.hasKeptUserContext,
    hasTurnPrefixHumanUser: currentWorkHints.hasTurnPrefixHumanUser,
  });
  return null;
}

/**
 * Build a compact mechanical description of what happened in a split-turn
 * window (tool calls only, no user messages).
 */
function buildMechanicalDelta(
  messages: Message[],
  modifiedFiles: string[],
  readFiles: string[],
  toolAnalysis: ToolOutcomeAnalysis,
): string {
  // Count tool calls by type
  const toolCounts: Record<string, number> = {};
  for (const msg of messages) {
    if (msg.role === "assistant" && Array.isArray(msg.content)) {
      for (const block of msg.content as any[]) {
        if (block.type === "toolCall") {
          const name = block.name as string;
          toolCounts[name] = (toolCounts[name] || 0) + 1;
        }
      }
    }
  }

  const parts: string[] = [];
  parts.push(
    `Continued execution: ${messages.length} messages (split-turn, no new user input)`,
  );

  const toolSummary = Object.entries(toolCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => `${name}×${count}`)
    .join(", ");
  if (toolSummary) parts.push(`Tool calls: ${toolSummary}`);

  const outcomeFacts = toolAnalysis.facts.slice(0, 12).map((fact) => {
    const call = `${fact.toolName}${fact.keyArgument ? `(${fact.keyArgument})` : ""}`;
    if (fact.missing) return `${call}: unresolved (missing result)`;
    const state = fact.isError || fact.noChange ? "failed" : "succeeded";
    return `${call}: ${state}${fact.outcome ? ` — ${fact.outcome}` : ""}`;
  });
  if (outcomeFacts.length > 0) {
    parts.push(`Tool outcomes:\n${outcomeFacts.map((fact) => `- ${fact}`).join("\n")}`);
    if (toolAnalysis.facts.length > outcomeFacts.length) {
      parts.push(`Additional tool outcomes omitted: ${toolAnalysis.facts.length - outcomeFacts.length}`);
    }
  }

  if (modifiedFiles.length > 0) {
    const shown = modifiedFiles.slice(0, 10);
    parts.push(`Files modified: ${shown.join(", ")}${modifiedFiles.length > 10 ? ` (+${modifiedFiles.length - 10} more)` : ""}`);
  }

  if (readFiles.length > 0) {
    parts.push(`Files read: ${readFiles.length} files`);
  }

  return parts.join("\n");
}

/**
 * Append a mechanical delta to the previous summary, preserving structure.
 * Also updates the file lists at the end.
 */
function appendDeltaToSummary(
  previousSummary: string,
  delta: string,
  fileOps: FileOperations,
): string {
  // Strip old file-list tags from previous summary — we'll re-append fresh ones
  let base = previousSummary
    .replace(/<read-files>[\s\S]*?<\/read-files>/g, "")
    .replace(/<modified-files>[\s\S]*?<\/modified-files>/g, "")
    .trimEnd();

  // Insert delta before Critical Context or at the end
  const criticalIdx = base.lastIndexOf("## Critical Context");
  if (criticalIdx > 0) {
    base =
      base.slice(0, criticalIdx) +
      `\n### Split-Turn Continuation\n${delta}\n\n` +
      base.slice(criticalIdx);
  } else {
    base += `\n\n### Split-Turn Continuation\n${delta}`;
  }

  return appendFileLists(base, fileOps);
}

/**
 * Update file lists in a summary without changing anything else.
 */
function updateFileLists(summary: string, fileOps: FileOperations): string {
  const base = summary
    .replace(/<read-files>[\s\S]*?<\/read-files>/g, "")
    .replace(/<modified-files>[\s\S]*?<\/modified-files>/g, "")
    .trimEnd();

  return appendFileLists(base, fileOps);
}

/**
 * Append deterministic file-list tags to a summary string.
 */
export function appendFileLists(base: string, fileOps: FileOperations): string {
  const { readFiles, modifiedFiles } = fileListsFromOps(fileOps);
  const parts: string[] = [base];

  if (readFiles.length > 0) {
    parts.push(`\n<read-files>\n${compressFilePaths(readFiles)}\n</read-files>`);
  }
  if (modifiedFiles.length > 0) {
    parts.push(
      `\n<modified-files>\n${compressFilePaths(modifiedFiles)}\n</modified-files>`,
    );
  }

  return parts.join("\n");
}

/** Append each deterministic file block that a validated model summary omitted. */
export function appendMissingFileLists(base: string, fileOps: FileOperations): string {
  const { readFiles, modifiedFiles } = fileListsFromOps(fileOps);
  const parts: string[] = [base];
  if (readFiles.length > 0 && !/<read-files>[\s\S]*?<\/read-files>/i.test(base)) {
    parts.push(`\n<read-files>\n${compressFilePaths(readFiles)}\n</read-files>`);
  }
  if (modifiedFiles.length > 0 && !/<modified-files>[\s\S]*?<\/modified-files>/i.test(base)) {
    parts.push(`\n<modified-files>\n${compressFilePaths(modifiedFiles)}\n</modified-files>`);
  }
  return parts.join("\n");
}

function normalizeSerializedLine(line: string): string {
  return line.replace(/^\[\d+\|([^\]]+)\]:\s*/, "[$1]: ");
}

function compactInlineText(text: string, maxChars = 240): string {
  return buildPreview(text.replace(/\s+/g, " ").trim(), maxChars);
}

function serializeKeptEntryMessage(message: SourceMessage, followingToolResults: SourceMessage[] = []): string[] {
  const lines: string[] = [];

  if (message.role === "assistant") {
    const batchCtx = convertMessagesWithMetadata([message, ...followingToolResults]);
    const assistantLlm = batchCtx.llmMessages[0];
    const hasToolCalls = Array.isArray((assistantLlm as any)?.content) &&
      ((assistantLlm as any).content as any[]).some((b: any) => b.type === "toolCall");

    if (assistantLlm && hasToolCalls) {
      const analysis = analyzeToolOutcomes(batchCtx.llmMessages);
      const compact = serializeToolBatchCompact(batchCtx.llmMessages, 0, analysis);
      if (compact) lines.push(normalizeSerializedLine(compact));
      for (const orphanIndex of analysis.orphanResultIndexes) {
        const orphan = batchCtx.llmMessages[orphanIndex];
        if (!orphan) continue;
        const line = serializeMessage(orphan, orphanIndex, batchCtx.humanUserIndexes);
        if (line) lines.push(normalizeSerializedLine(line));
      }
      return lines;
    }
  }

  const ctx = convertMessagesWithMetadata([message]);
  for (let i = 0; i < ctx.llmMessages.length; i++) {
    const line = serializeMessage(ctx.llmMessages[i], i, ctx.humanUserIndexes);
    if (line) lines.push(normalizeSerializedLine(line));
  }

  return lines;
}

/**
 * Extract a compact summary of the kept window (the entries that survive
 * compaction) from the full session entries. This tells the LLM what current
 * work will remain in context after the new summary, including user turns,
 * assistant/tool progress, branch summaries, and extension custom messages.
 */
export function extractKeptMessagesSummary(
  branchEntries: any[],
  firstKeptEntryId: string,
): { summary: string; hasHumanUser: boolean } {
  let foundKept = false;
  const lines: string[] = [];
  let hasHumanUser = false;

  for (let i = 0; i < branchEntries.length; i++) {
    const entry = branchEntries[i];
    if (entry.id === firstKeptEntryId) foundKept = true;
    if (!foundKept) continue;
    if (entry.type === "compaction") continue;

    if (entry.type === "message" && entry.message) {
      const message = entry.message as SourceMessage;
      if (isRealUserSourceMessage(message)) hasHumanUser = true;

      const followingToolResults: SourceMessage[] = [];
      const hasToolCalls = message.role === "assistant"
        && Array.isArray((message as any).content)
        && ((message as any).content as any[]).some((block: any) => block.type === "toolCall");
      if (hasToolCalls) {
        for (let resultIndex = i + 1; resultIndex < branchEntries.length; resultIndex++) {
          const resultEntry = branchEntries[resultIndex];
          if (resultEntry?.type !== "message" || resultEntry.message?.role !== "toolResult") break;
          followingToolResults.push(resultEntry.message as SourceMessage);
        }
      }

      const serialized = serializeKeptEntryMessage(message, followingToolResults);
      if (serialized.length > 0) lines.push(...serialized);
      i += followingToolResults.length;
      continue;
    }

    if (entry.type === "custom_message") {
      const text = extractText(entry.content).trim();
      if (!text) continue;
      lines.push(`[Context:${entry.customType ?? "custom"}]: ${compactInlineText(text, 400)}`);
      continue;
    }

    if (entry.type === "branch_summary") {
      const summary = typeof entry.summary === "string" ? entry.summary.trim() : "";
      if (!summary) continue;
      lines.push(`[BranchSummary]: ${compactInlineText(summary, 400)}`);
    }
  }

  if (lines.length === 0) return { summary: "", hasHumanUser };

  const selected: string[] = [];
  let chars = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (!line) continue;
    if (selected.length > 0 && chars + line.length > KEPT_CONTEXT_BUDGET_CHARS) break;
    selected.push(line);
    chars += line.length;
  }

  selected.reverse();
  return { summary: selected.join("\n"), hasHumanUser };
}

export function buildTurnPrefixSummary(
  turnPrefixMessages: Message[],
  humanUserIndexes: Set<number>,
): string {
  if (turnPrefixMessages.length === 0) return "";

  const { included, compactOverrides } = selectRecentContextBackwards(
    turnPrefixMessages,
    humanUserIndexes,
  );
  const rendered = new Map<number, string>();
  for (const idx of included) {
    const line = compactOverrides.get(idx) ?? serializeMessage(turnPrefixMessages[idx], idx, humanUserIndexes);
    if (line) rendered.set(idx, line);
  }

  const nearestHumanUserIndex = [...included]
    .filter((idx) => humanUserIndexes.has(idx) && rendered.has(idx))
    .sort((a, b) => b - a)[0];
  const selected = new Set<number>();
  let chars = 0;
  if (nearestHumanUserIndex !== undefined) {
    selected.add(nearestHumanUserIndex);
    chars += rendered.get(nearestHumanUserIndex)!.length;
  }
  for (const idx of [...included].sort((a, b) => b - a)) {
    if (selected.has(idx)) continue;
    const line = rendered.get(idx);
    if (!line) continue;
    if (selected.size > 0 && chars + line.length > KEPT_CONTEXT_BUDGET_CHARS) {
      const remaining = KEPT_CONTEXT_BUDGET_CHARS - chars;
      if (remaining < 256) continue;
      const notice = "… [older batch detail trimmed; newest outcomes follow] …\n";
      rendered.set(idx, `${notice}${line.slice(-(remaining - notice.length))}`);
      selected.add(idx);
      chars = KEPT_CONTEXT_BUDGET_CHARS;
      continue;
    }
    selected.add(idx);
    chars += line.length;
  }

  return [...selected]
    .sort((a, b) => a - b)
    .map((idx) => rendered.get(idx))
    .filter((line): line is string => !!line)
    .join("\n");
}

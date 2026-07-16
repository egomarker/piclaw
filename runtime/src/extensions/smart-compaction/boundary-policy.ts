/** Pure retained-window and target-context policy for smart compaction. */
import { sessionEntryToContextMessages } from "@earendil-works/pi-coding-agent";
import { applyTokenEstimateSafetyMultiplier, getEffectiveContextWindow, getSystemPromptOverheadTokens, getTokenEstimateSafetyMultiplier } from "../../utils/context-window-budget.js";
import { createLogger } from "../../utils/logger.js";
import { MIN_COMPACTION_OUTPUT_TOKENS } from "./config.js";
import { estimateTokensFromChars } from "./context.js";
import { convertMessagesWithMetadata, type SourceMessage } from "./messages.js";
import { clampKeepRecentTokens, estimatePostCompactionFit } from "./safety.js";

const log = createLogger("ext.smart-compaction.boundary-policy");

function serializeEntryContentForEstimate(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return JSON.stringify(content ?? "");
  return content
    .map((block: any) => {
      if (block?.type === "text") return String(block.text || "");
      if (block?.type === "thinking") return String(block.thinking || "");
      if (block?.type === "toolCall") return `${block.name || "tool"} ${JSON.stringify(block.arguments ?? {})}`;
      if (block?.type === "image") return "[image]".repeat(1200);
      return JSON.stringify(block ?? "");
    })
    .join("\n");
}

function estimateEntryTokens(entry: any): number {
  if (!entry || typeof entry !== "object") return 0;
  if (entry.type === "message" && entry.message) {
    const converted = convertMessagesWithMetadata([entry.message as SourceMessage]);
    const serialized = converted.llmMessages
      .map((message, index) => `${message.role}:${index}:${serializeEntryContentForEstimate((message as any).content)}`)
      .join("\n");
    return estimateTokensFromChars(serialized);
  }
  if (entry.type === "custom_message") {
    return estimateTokensFromChars(serializeEntryContentForEstimate(entry.content));
  }
  if (entry.type === "branch_summary") {
    return estimateTokensFromChars(String(entry.summary || ""));
  }
  // Upstream deliberately backscans over model/settings metadata because it is
  // not context-visible. Keep its estimate at zero so boundary monotonicity is
  // measured in actual retained model context rather than session structure.
  return 0;
}

function sourceMessageIdentity(message: SourceMessage | undefined): string {
  if (!message) return "";
  try {
    return JSON.stringify(message);
  } catch {
    return JSON.stringify({
      role: message.role,
      content: message.content,
      timestamp: (message as any).timestamp ?? null,
    });
  }
}

/**
 * Complete source-message provenance for partial-progressive cut points.
 * Native message entries preserve object identity, while custom and branch
 * summary entries are projected into fresh message objects by Pi. Resolve the
 * latter sequentially so an early stop never discards an unsummarized custom
 * message merely because its source entry ID was missing.
 */
export function resolveSourceEntryIdsForMessages(
  branchEntries: any[] | undefined,
  messages: SourceMessage[],
  knownIds: Array<string | undefined> = [],
): Array<string | undefined> {
  if (!Array.isArray(branchEntries) || branchEntries.length === 0) return [...knownIds];
  const candidates = branchEntries.flatMap((entry, entryIndex) => {
    if (typeof entry?.id !== "string") return [];
    return sessionEntryToContextMessages(entry).map((message) => ({
      entryId: entry.id as string,
      entryIndex,
      entryType: entry.type as string,
      message: message as SourceMessage,
      identity: sourceMessageIdentity(message as SourceMessage),
    }));
  });
  let candidateCursor = 0;

  return messages.map((message, messageIndex) => {
    const knownId = knownIds[messageIndex];
    if (knownId) {
      const knownIndex = candidates.findIndex((candidate, index) => index >= candidateCursor && candidate.entryId === knownId);
      if (knownIndex >= 0) candidateCursor = knownIndex + 1;
      return knownId;
    }

    let matchIndex = candidates.findIndex((candidate, index) => index >= candidateCursor && candidate.message === message);
    if (matchIndex < 0) {
      const identity = sourceMessageIdentity(message);
      // Ordinary message entries preserve object identity through upstream
      // compaction preparation. Structural matching is reserved for custom and
      // summary entries, which Pi projects into fresh message objects. This
      // prevents a discarded message from rebinding to an equal retained copy.
      matchIndex = candidates.findIndex((candidate, index) =>
        index >= candidateCursor
        && candidate.entryType !== "message"
        && candidate.identity === identity
      );
    }
    if (matchIndex < 0) return undefined;
    candidateCursor = matchIndex + 1;
    return candidates[matchIndex]?.entryId;
  });
}

export function resolveFirstKeptEntryIdForSourceMessageIndex(
  branchEntries: any[] | undefined,
  messagesForCompaction: SourceMessage[],
  sourceMessageIndex: number | undefined,
): string | null {
  if (!Array.isArray(branchEntries) || sourceMessageIndex == null) return null;
  if (!Number.isInteger(sourceMessageIndex) || sourceMessageIndex < 0 || sourceMessageIndex >= messagesForCompaction.length) return null;
  const alignedIds = resolveSourceEntryIdsForMessages(branchEntries, messagesForCompaction);
  // Advancing a partial boundary is safe only if every source message through
  // the first unprocessed message has exact, monotonic provenance.
  if (alignedIds.slice(0, sourceMessageIndex + 1).some((id) => !id)) return null;
  return alignedIds[sourceMessageIndex] ?? null;
}

export function findBranchEntryIndex(branchEntries: any[] | undefined, entryId: string): number {
  if (!Array.isArray(branchEntries) || !entryId) return -1;
  return branchEntries.findIndex((entry) => entry?.id === entryId);
}

/** Match upstream Pi's context-visible compaction cut-point contract. */
export function isValidCompactionCutPoint(entry: any): boolean {
  if (!entry || typeof entry !== "object") return false;
  if (entry.type === "branch_summary" || entry.type === "custom_message") return true;
  if (entry.type !== "message") return false;
  switch (entry.message?.role) {
    case "bashExecution":
    case "custom":
    case "branchSummary":
    case "compactionSummary":
    case "user":
    case "assistant":
      return true;
    default:
      return false;
  }
}

function isContextVisibleEntry(entry: any): boolean {
  return entry?.type === "message"
    || entry?.type === "branch_summary"
    || entry?.type === "custom_message";
}

/**
 * Upstream may return a metadata-prefixed firstKeptEntryId after selecting a
 * valid context-visible cut point, then scanning backwards over adjacent
 * model/settings metadata. Validate the effective cut point rather than
 * rejecting that intentional prefix.
 */
export function isValidCompactionRetainedBoundary(branchEntries: any[] | undefined, entryId: string): boolean {
  if (!Array.isArray(branchEntries) || branchEntries.length === 0) return true;
  // Some extension/test contexts expose only id-less metadata entries rather
  // than an authoritative branch. There is no boundary evidence to validate
  // in that shape, so retain the upstream decision.
  if (!branchEntries.some((entry) => typeof entry?.id === "string" && entry.id.length > 0)) return true;
  const boundaryIndex = findBranchEntryIndex(branchEntries, entryId);
  // A populated authoritative branch cannot safely retain from an ID it does
  // not contain. Treat that as corruption rather than silently accepting a
  // boundary whose kept suffix and token estimate cannot be verified.
  if (boundaryIndex < 0) return false;
  for (let index = boundaryIndex; index < branchEntries.length; index += 1) {
    const entry = branchEntries[index];
    if (entry?.type === "compaction") return false;
    if (!isContextVisibleEntry(entry)) continue;
    return isValidCompactionCutPoint(entry);
  }
  return false;
}

function backscanAdjacentMetadata(branchEntries: any[], cutPointIndex: number, lowerBoundIndex: number): number {
  let boundaryIndex = cutPointIndex;
  while (boundaryIndex > lowerBoundIndex) {
    const previous = branchEntries[boundaryIndex - 1];
    if (previous?.type === "compaction" || isContextVisibleEntry(previous)) break;
    boundaryIndex -= 1;
  }
  return boundaryIndex;
}

function estimateKeptTokensFromIndex(branchEntries: any[], firstKeptIndex: number): number {
  let tokens = 0;
  for (let i = Math.max(0, firstKeptIndex); i < branchEntries.length; i++) {
    const entry = branchEntries[i];
    if (!entry || typeof entry !== "object" || entry.type === "header" || entry.type === "compaction") continue;
    // Keep branch-derived estimates raw here. estimatePostCompactionFit applies
    // the shared safety multiplier exactly once to the complete kept window.
    tokens += estimateEntryTokens(entry);
  }
  return tokens;
}

export function estimateKeptTokensFromEntryId(branchEntries: any[] | undefined, firstKeptEntryId: string): number | null {
  if (!Array.isArray(branchEntries)) return null;
  const firstKeptIndex = findBranchEntryIndex(branchEntries, firstKeptEntryId);
  return firstKeptIndex >= 0 ? estimateKeptTokensFromIndex(branchEntries, firstKeptIndex) : null;
}

interface KeptWindowSelection {
  firstKeptEntryId: string;
  firstKeptEntryIndex: number;
  currentFirstKeptEntryIndex: number;
  estimatedKeepTokens: number;
  currentEstimatedKeepTokens: number;
}

/**
 * Select a smaller retained suffix without violating compaction history.
 *
 * Non-negotiable invariants:
 * - candidates use the same valid cut-point roles as upstream Pi;
 * - the candidate is strictly later than the current retained boundary;
 * - the scan never reaches entries hidden before the current boundary; and
 * - the selected suffix must contain fewer estimated tokens than the current suffix.
 */
function chooseFirstKeptEntryForBudget(
  branchEntries: any[] | undefined,
  currentFirstKeptEntryId: string,
  keepBudgetTokens: number,
): KeptWindowSelection | null {
  if (!Array.isArray(branchEntries) || branchEntries.length === 0) return null;
  const currentFirstKeptEntryIndex = findBranchEntryIndex(branchEntries, currentFirstKeptEntryId);
  // Upstream may backscan from a valid message cut point to retain adjacent
  // model/settings metadata. That existing boundary is valid history state even
  // though any NEW adjusted boundary must itself be a valid message cut point.
  if (currentFirstKeptEntryIndex < 0) return null;

  const budget = Math.max(0, Math.floor(keepBudgetTokens));
  const currentEstimatedKeepTokens = estimateKeptTokensFromIndex(branchEntries, currentFirstKeptEntryIndex);
  let estimatedKeepTokens = 0;
  let selected: { id: string; index: number; tokens: number } | null = null;

  for (let i = branchEntries.length - 1; i > currentFirstKeptEntryIndex; i--) {
    const entry = branchEntries[i];
    if (!entry || typeof entry !== "object" || entry.type === "header" || entry.type === "compaction") continue;
    estimatedKeepTokens += estimateEntryTokens(entry);
    if (estimatedKeepTokens > budget) break;
    if (!isValidCompactionCutPoint(entry)) continue;
    const boundaryIndex = backscanAdjacentMetadata(branchEntries, i, currentFirstKeptEntryIndex);
    if (boundaryIndex <= currentFirstKeptEntryIndex) continue;
    const boundaryEntry = branchEntries[boundaryIndex];
    const id = typeof boundaryEntry?.id === "string" ? boundaryEntry.id : "";
    if (id) selected = { id, index: boundaryIndex, tokens: estimatedKeepTokens };
  }

  if (!selected || selected.tokens >= currentEstimatedKeepTokens) return null;
  return {
    firstKeptEntryId: selected.id,
    firstKeptEntryIndex: selected.index,
    currentFirstKeptEntryIndex,
    estimatedKeepTokens: selected.tokens,
    currentEstimatedKeepTokens,
  };
}

const TARGET_CONTEXT_INSTRUCTIONS_RE = /^<!--\s*piclaw:target-context-window=(\d+)\s+target-model=([^\s]+)\s*-->\n?/;

export function buildTargetContextCompactionInstructions(targetContextWindow: number, targetModelLabel: string, userInstructions?: string): string {
  const normalizedWindow = Math.max(1, Math.trunc(targetContextWindow));
  const normalizedModel = targetModelLabel.replace(/\s+/g, "_");
  const suffix = userInstructions?.trim() ? `\n${userInstructions.trim()}` : "";
  return `<!-- piclaw:target-context-window=${normalizedWindow} target-model=${normalizedModel} -->${suffix}`;
}

export function parseTargetContextInstructions(customInstructions: string | undefined): {
  targetContextWindow: number | null;
  targetModelLabel: string | null;
  instructions: string | undefined;
} {
  const raw = String(customInstructions || "");
  const match = raw.match(TARGET_CONTEXT_INSTRUCTIONS_RE);
  if (!match) return { targetContextWindow: null, targetModelLabel: null, instructions: customInstructions };
  const parsedWindow = Number.parseInt(match[1] || "", 10);
  const instructions = raw.slice(match[0].length).trim();
  return {
    targetContextWindow: Number.isFinite(parsedWindow) && parsedWindow > 0 ? parsedWindow : null,
    targetModelLabel: match[2] || null,
    instructions: instructions || undefined,
  };
}

export function buildTargetContextGuidance(targetContextWindow: number | null, targetModelLabel: string | null, configuredKeepRecent: number): string {
  if (!targetContextWindow) return "";
  const effectiveWindow = getEffectiveContextWindow(targetContextWindow, getSystemPromptOverheadTokens());
  const safeKeepRecent = clampKeepRecentTokens(configuredKeepRecent, targetContextWindow);
  const maxSummaryTokens = Math.max(0, effectiveWindow - applyTokenEstimateSafetyMultiplier(safeKeepRecent) - MIN_COMPACTION_OUTPUT_TOKENS);
  const target = targetModelLabel ? ` for ${targetModelLabel}` : "";
  return [
    `Target-aware compaction${target}: the compacted session must fit a ${targetContextWindow} token raw context window (${effectiveWindow} effective after app overhead).`,
    `Keep the generated summary concise enough that summary + kept recent context + app overhead fits this target.`,
    `Approximate kept-context budget: ${safeKeepRecent} tokens; approximate summary budget before estimator safety: ${maxSummaryTokens} tokens.`,
    `If details compete, preserve current task continuity, user constraints, file paths, commands, and unresolved errors over historical narrative.`,
  ].join("\n");
}

export function isCompactionInputOverflow(message: string): boolean {
  return /context\s*(?:length|window)|maximum context|max(?:imum)? tokens|too many tokens|input too large|prompt too large|exceeds.*(?:context|token)|token limit/i.test(message);
}

export function maybeAdjustFirstKeptForFit(input: {
  summary: string;
  currentFirstKeptEntryId: string;
  configuredKeepRecent: number;
  targetKeepRecent: number;
  contextWindow: number;
  branchEntries?: any[];
}): { firstKeptEntryId: string; estimatedTotal: number; adjusted: boolean; margin: number } {
  const targetKeepRecent = Math.max(0, Math.min(input.configuredKeepRecent, input.targetKeepRecent));
  const actualCurrentKeepTokens = estimateKeptTokensFromEntryId(input.branchEntries, input.currentFirstKeptEntryId);
  // Branch data is authoritative when available. The configured value is only
  // a conservative fallback for callers that cannot provide the active path.
  const currentKeepTokens = actualCurrentKeepTokens ?? input.configuredKeepRecent;
  const initial = estimatePostCompactionFit(input.summary, currentKeepTokens, input.contextWindow);
  const mustReduceKeptWindow = currentKeepTokens > targetKeepRecent;
  const currentBoundaryIndex = findBranchEntryIndex(input.branchEntries, input.currentFirstKeptEntryId);
  const currentBoundaryInvalid = !isValidCompactionRetainedBoundary(
    input.branchEntries,
    input.currentFirstKeptEntryId,
  );
  if (initial.fits && !mustReduceKeptWindow && !currentBoundaryInvalid) {
    log.debug("Smart compaction kept boundary unchanged", {
      operation: "smart_compaction.boundary_selection",
      adjustmentReason: "current_suffix_fits",
      currentBoundaryIndex,
      selectedBoundaryIndex: currentBoundaryIndex,
      currentKeptTokens: currentKeepTokens,
      selectedKeptTokens: currentKeepTokens,
      estimatedTotal: initial.estimatedTotal,
      margin: initial.margin,
    });
    return { firstKeptEntryId: input.currentFirstKeptEntryId, estimatedTotal: initial.estimatedTotal, adjusted: false, margin: initial.margin };
  }

  const summaryTokens = applyTokenEstimateSafetyMultiplier(estimateTokensFromChars(input.summary));
  const overheadTokens = initial.overheadTokens;
  const safetyReserve = 512;
  const safetyAdjustedFitBudget = Math.max(0, input.contextWindow - summaryTokens - overheadTokens - safetyReserve);
  const fitBudget = Math.floor(safetyAdjustedFitBudget / getTokenEstimateSafetyMultiplier());
  const keepBudget = Math.min(targetKeepRecent, fitBudget);
  const adjusted = chooseFirstKeptEntryForBudget(
    input.branchEntries,
    input.currentFirstKeptEntryId,
    keepBudget,
  );
  if (!adjusted) {
    log.debug("Smart compaction found no safe retained-boundary adjustment", {
      operation: "smart_compaction.boundary_selection",
      adjustmentReason: currentBoundaryInvalid ? "invalid_current_boundary" : initial.fits ? "target_keep_budget" : "context_fit",
      currentBoundaryIndex,
      selectedBoundaryIndex: null,
      currentKeptTokens: currentKeepTokens,
      selectedKeptTokens: null,
      targetKeepTokens: targetKeepRecent,
      fitBudget,
      estimatedTotal: initial.estimatedTotal,
      margin: initial.margin,
    });
    throw new Error(
      `Compaction result still exceeds model context window: summary ${summaryTokens}t + kept ${currentKeepTokens}t + overhead ${overheadTokens}t > ${input.contextWindow}t; no safe kept-window adjustment was available without violating monotonicity.`,
    );
  }
  if (
    adjusted.firstKeptEntryIndex <= adjusted.currentFirstKeptEntryIndex
    || adjusted.estimatedKeepTokens >= adjusted.currentEstimatedKeepTokens
  ) {
    throw new Error("Compaction kept-window adjustment violated the monotonic boundary invariant");
  }

  const adjustedFit = estimatePostCompactionFit(input.summary, adjusted.estimatedKeepTokens, input.contextWindow);
  if (!adjustedFit.fits) {
    throw new Error(
      `Compaction result still exceeds model context window after kept-window adjustment: estimated ${adjustedFit.estimatedTotal}t > ${input.contextWindow}t.`,
    );
  }

  log.debug("Smart compaction selected a smaller retained boundary", {
    operation: "smart_compaction.boundary_selection",
    adjustmentReason: currentBoundaryInvalid ? "invalid_current_boundary" : initial.fits ? "target_keep_budget" : "context_fit",
    currentBoundaryIndex: adjusted.currentFirstKeptEntryIndex,
    selectedBoundaryIndex: adjusted.firstKeptEntryIndex,
    currentKeptTokens: adjusted.currentEstimatedKeepTokens,
    selectedKeptTokens: adjusted.estimatedKeepTokens,
    targetKeepTokens: targetKeepRecent,
    estimatedTotal: adjustedFit.estimatedTotal,
    margin: adjustedFit.margin,
  });
  return {
    firstKeptEntryId: adjusted.firstKeptEntryId,
    estimatedTotal: adjustedFit.estimatedTotal,
    adjusted: true,
    margin: adjustedFit.margin,
  };
}

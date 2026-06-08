/**
 * smart-compaction.ts – Selective-fragment compaction extension.
 *
 * Public facade for the smart-compaction extension. Implementation details are
 * split into focused modules under ./smart-compaction/ so budget logic, prompt
 * construction, progressive compaction, no-op handling, message serialization,
 * file-list handling, and UI context-meter publishing can be maintained
 * independently.
 */

import type { ExtensionAPI, ExtensionFactory, CompactionResult } from "@earendil-works/pi-coding-agent";
import type { Message } from "@earendil-works/pi-ai";
import { resolveModelRequestAuth } from "../utils/model-auth.js";
import { createLogger } from "../utils/logger.js";
import { applyTokenEstimateSafetyMultiplier, getEffectiveContextWindow } from "../utils/context-window-budget.js";
import { recordCompactionCancellationReason } from "../agent-pool/compaction-cancel-reason.js";

import { getCompactionRuntimeConfig } from "../core/config.js";
import { FULL_PASS_FALLBACK_MAX_PROMPT_TOKENS, MIN_COMPACTION_OUTPUT_TOKENS, MIN_SUMMARY_CHARS, PROGRESSIVE_FALLBACK_CONTEXT_WINDOW, SELECTIVE_THRESHOLD, SMART_COMPACTION_PROGRESS_INTERVAL_MS, SYSTEM_PROMPT_OVERHEAD_TOKENS } from "./smart-compaction/config.js";
import { estimateCompactionPromptTokens, estimateSmartCompactionCompletionPercent, estimateTokensFromChars, formatProgressCount, formatProgressRange, formatSmartCompactionStatus, getContextWindowEstimate, publishContextEstimate } from "./smart-compaction/context.js";
import { compressFilePaths, fileListsFromOps } from "./smart-compaction/files.js";
import { convertMessagesWithMetadata, type SourceMessage } from "./smart-compaction/messages.js";
import { appendFileLists, buildTurnPrefixSummary, extractKeptMessagesSummary, tryNoOpCompaction } from "./smart-compaction/noop.js";
import { buildProgressiveCompactionChunks, buildTrimmedProgressiveMergeRetryPrompt, getProgressiveCompactionBudget, runProgressiveCompaction, type ProgressiveCompactionProgress } from "./smart-compaction/progressive.js";
import { clampKeepRecentTokens, estimatePostCompactionFit, getCompactionReasoningEffort, getCompactionRetryPromptTokenTarget, getSafeCompactionMaxTokens } from "./smart-compaction/safety.js";
import { buildSelectivePrompt, detectRecentTopicShift, SYSTEM_PROMPT } from "./smart-compaction/selective-prompt.js";
import { streamComplete, type CompactionStreamFn } from "./smart-compaction/stream-complete.js";
import { sanitizeContextPruneCompactionMessages } from "./context-prune/pruner.js";

export type { CompactionStreamFn } from "./smart-compaction/stream-complete.js";

export {
  buildProgressiveCompactionChunks,
  buildTrimmedProgressiveMergeRetryPrompt,
  formatProgressCount,
  formatProgressRange,
  clampKeepRecentTokens,
  estimatePostCompactionFit,
  getCompactionReasoningEffort,
  getCompactionRetryPromptTokenTarget,
  getProgressiveCompactionBudget,
  getSafeCompactionMaxTokens,
};

const log = createLogger("ext.smart-compaction");

// ---------------------------------------------------------------------------
// Resilient UI proxy – ctx.ui throws when the extension context is invalidated
// after a session replacement/reload. UI updates are cosmetic; losing them must
// never abort the compaction itself.
// ---------------------------------------------------------------------------

function resilientUi(ctx: { ui: Record<string, unknown> }): typeof ctx.ui {
  return new Proxy(ctx.ui, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") return value;
      return (...args: unknown[]) => {
        try {
          return (value as (...fnArgs: unknown[]) => unknown).apply(target, args);
        } catch (err) {
          if (err instanceof Error && /stale|disposed|invalid/i.test(err.message)) {
            log.debug(`UI call ${String(prop)} suppressed (stale ctx)`);
            return undefined;
          }
          throw err;
        }
      };
    },
  });
}

type ResilientCtx<T> = Omit<T, "ui"> & { ui: T extends { ui: infer U } ? U : never };

function makeResilientCtx<T extends { ui: Record<string, unknown> }>(ctx: T): ResilientCtx<T> {
  return Object.create(ctx, { ui: { get: () => resilientUi(ctx), configurable: true } });
}

function cancelCompactionWithReason(ctx: { sessionManager?: unknown }, message: string): { cancel: true } {
  recordCompactionCancellationReason(ctx.sessionManager, message);
  return { cancel: true };
}

function resolveCompactionModel(ctx: { model?: unknown }): unknown {
  // Future dedicated compaction-model selection should be wired here. Keeping a
  // single resolver ensures compaction prompt budgets, safe output caps, retry
  // trimming, auth, reasoning, and the actual LLM call all use the same model.
  return ctx.model;
}

function publishCompactionStatus(ctx: { ui: { setStatus?: (key: string, text: string | undefined) => void } }, message?: string, completionPercent?: number | null): void {
  ctx.ui.setStatus?.("smart_compaction", message ? formatSmartCompactionStatus(message, completionPercent) : undefined);
}

function estimateProgressiveProgressCompletion(progress?: ProgressiveCompactionProgress): number {
  if (progress?.phase === "progressive_chunk" && progress.chunkIndex && progress.totalChunks) {
    return 30 + Math.round(((progress.chunkIndex - 0.5) / Math.max(1, progress.totalChunks)) * 40);
  }
  if (progress?.phase === "progressive_merge") return 78;
  if (progress?.phase === "progressive_compress") return 90;
  if (progress?.phase === "progressive_final") return 94;
  return estimateSmartCompactionCompletionPercent(progress?.phase ?? "progressive_streaming");
}

function formatProgressiveProgressMessage(progress?: ProgressiveCompactionProgress): string {
  if (progress?.phase === "progressive_chunk" && progress.chunkIndex && progress.totalChunks) {
    return `Smart compaction: summarizing chunk ${formatProgressCount(progress.chunkIndex, progress.totalChunks)}…`;
  }
  if (progress?.phase === "progressive_merge" && progress.mergePass && progress.batchIndex) {
    return `Smart compaction: merging summaries pass ${progress.mergePass}, batch ${progress.batchIndex}…`;
  }
  if (progress?.phase === "progressive_compress" && progress.compressPass) {
    return `Smart compaction: compressing final summary, pass ${formatProgressCount(progress.compressPass, 3)}…`;
  }
  if (progress?.phase === "progressive_final") {
    return "Smart compaction: final progressive merge still running…";
  }
  return "Smart compaction: progressive summary still running…";
}

function estimateEntryTokens(entry: any): number {
  if (!entry || typeof entry !== "object") return 0;
  if (entry.type === "message" && entry.message) {
    const converted = convertMessagesWithMetadata([entry.message as SourceMessage]);
    const serialized = converted.llmMessages
      .map((message, index) => {
        const content = Array.isArray((message as any).content)
          ? (message as any).content
              .map((block: any) => {
                if (block?.type === "text") return String(block.text || "");
                if (block?.type === "thinking") return String(block.thinking || "");
                if (block?.type === "toolCall") return `${block.name || "tool"} ${JSON.stringify(block.arguments ?? {})}`;
                if (block?.type === "image") return "[image]".repeat(1200);
                return "";
              })
              .join("\n")
          : "";
        return `${message.role}:${index}:${content}`;
      })
      .join("\n");
    return estimateTokensFromChars(serialized);
  }
  if (entry.type === "custom_message") {
    return estimateTokensFromChars(typeof entry.content === "string" ? entry.content : JSON.stringify(entry.content ?? ""));
  }
  if (entry.type === "branch_summary") {
    return estimateTokensFromChars(String(entry.summary || ""));
  }
  return 0;
}

function sourceMessageIdentity(message: SourceMessage | undefined): string {
  if (!message) return "";
  return JSON.stringify({
    role: message.role,
    content: message.content,
    timestamp: (message as any).timestamp ?? null,
  });
}

function resolveFirstKeptEntryIdForSourceMessageIndex(
  branchEntries: any[] | undefined,
  messagesForCompaction: SourceMessage[],
  sourceMessageIndex: number | undefined,
): string | null {
  if (!Array.isArray(branchEntries) || sourceMessageIndex == null) return null;
  const source = messagesForCompaction[sourceMessageIndex];
  if (!source) return null;
  for (const entry of branchEntries) {
    if (entry?.type === "message" && entry.message === source && typeof entry.id === "string") return entry.id;
  }
  const identity = sourceMessageIdentity(source);
  if (!identity) return null;
  for (const entry of branchEntries) {
    if (entry?.type !== "message" || typeof entry.id !== "string") continue;
    if (sourceMessageIdentity(entry.message as SourceMessage) === identity) return entry.id;
  }
  return null;
}

function estimateKeptTokensFromEntryId(branchEntries: any[] | undefined, firstKeptEntryId: string): number | null {
  if (!Array.isArray(branchEntries) || !firstKeptEntryId) return null;
  let found = false;
  let tokens = 0;
  for (const entry of branchEntries) {
    if (!found && entry?.id === firstKeptEntryId) found = true;
    if (!found) continue;
    if (!entry || typeof entry !== "object" || entry.type === "header" || entry.type === "compaction") continue;
    tokens += applyTokenEstimateSafetyMultiplier(estimateEntryTokens(entry));
  }
  return found ? tokens : null;
}

function chooseFirstKeptEntryForBudget(branchEntries: any[] | undefined, keepBudgetTokens: number): { firstKeptEntryId: string; estimatedKeepTokens: number } | null {
  if (!Array.isArray(branchEntries) || branchEntries.length === 0) return null;
  const budget = Math.max(0, Math.floor(keepBudgetTokens));
  let estimatedKeepTokens = 0;
  let selected: string | null = null;

  for (let i = branchEntries.length - 1; i >= 0; i--) {
    const entry = branchEntries[i];
    if (!entry || typeof entry !== "object" || entry.type === "header" || entry.type === "compaction") continue;
    const id = typeof entry.id === "string" ? entry.id : "";
    if (!id) continue;
    const tokens = applyTokenEstimateSafetyMultiplier(estimateEntryTokens(entry));
    if (selected && estimatedKeepTokens + tokens > budget) break;
    selected = id;
    estimatedKeepTokens += tokens;
    if (estimatedKeepTokens >= budget) break;
  }

  return selected ? { firstKeptEntryId: selected, estimatedKeepTokens } : null;
}

const TARGET_CONTEXT_INSTRUCTIONS_RE = /^<!--\s*piclaw:target-context-window=(\d+)\s+target-model=([^\s]+)\s*-->\n?/;

export function buildTargetContextCompactionInstructions(targetContextWindow: number, targetModelLabel: string, userInstructions?: string): string {
  const normalizedWindow = Math.max(1, Math.trunc(targetContextWindow));
  const normalizedModel = targetModelLabel.replace(/\s+/g, "_");
  const suffix = userInstructions?.trim() ? `\n${userInstructions.trim()}` : "";
  return `<!-- piclaw:target-context-window=${normalizedWindow} target-model=${normalizedModel} -->${suffix}`;
}

function parseTargetContextInstructions(customInstructions: string | undefined): {
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

function buildTargetContextGuidance(targetContextWindow: number | null, targetModelLabel: string | null, configuredKeepRecent: number): string {
  if (!targetContextWindow) return "";
  const effectiveWindow = getEffectiveContextWindow(targetContextWindow, SYSTEM_PROMPT_OVERHEAD_TOKENS);
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

const FULL_PASS_FALLBACK_CONTEXT_FRACTION = 0.6;

function isCompactionInputOverflow(message: string): boolean {
  return /context\s*(?:length|window)|maximum context|max(?:imum)? tokens|too many tokens|input too large|prompt too large|exceeds.*(?:context|token)|token limit/i.test(message);
}

export function buildTrimmedCompactionRetryPrompt(promptText: string, targetPromptTokens: number): string | null {
  const targetChars = Math.max(8_000, Math.floor(targetPromptTokens * 4));
  if (promptText.length <= targetChars) return null;
  const marker = "\n## Conversation Excerpts";
  const markerIndex = promptText.indexOf(marker);
  const notice = "\n\n… (older/less relevant compaction excerpts trimmed after provider context-overflow; preserve current task continuity from the remaining excerpts) …\n\n";
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

function estimateFullPassFallbackPromptTokens(llmMessages: Message[], tokensBefore: number): number {
  const serializedChars = llmMessages.reduce((total, message) => {
    const content = Array.isArray(message.content) ? message.content : [message.content];
    return total + JSON.stringify({ role: message.role, content }).length + 64;
  }, 0);
  const serializedTokens = applyTokenEstimateSafetyMultiplier(Math.max(1, Math.ceil(serializedChars / 4)));
  const sessionTokens = applyTokenEstimateSafetyMultiplier(tokensBefore);
  return Math.max(serializedTokens, sessionTokens) + SYSTEM_PROMPT_OVERHEAD_TOKENS;
}

function maybeAdjustFirstKeptForFit(input: {
  summary: string;
  currentFirstKeptEntryId: string;
  configuredKeepRecent: number;
  targetKeepRecent: number;
  contextWindow: number;
  branchEntries?: any[];
}): { firstKeptEntryId: string; estimatedTotal: number; adjusted: boolean; margin: number } {
  const targetKeepRecent = Math.max(0, Math.min(input.configuredKeepRecent, input.targetKeepRecent));
  const initial = estimatePostCompactionFit(input.summary, input.configuredKeepRecent, input.contextWindow);
  const mustReduceKeptWindow = targetKeepRecent < input.configuredKeepRecent;
  if (initial.fits && !mustReduceKeptWindow) {
    return { firstKeptEntryId: input.currentFirstKeptEntryId, estimatedTotal: initial.estimatedTotal, adjusted: false, margin: initial.margin };
  }

  const summaryTokens = applyTokenEstimateSafetyMultiplier(estimateTokensFromChars(input.summary));
  const overheadTokens = initial.overheadTokens;
  const safetyReserve = 512;
  const fitBudget = Math.max(0, input.contextWindow - summaryTokens - overheadTokens - safetyReserve);
  const keepBudget = Math.min(targetKeepRecent, fitBudget);
  const adjusted = chooseFirstKeptEntryForBudget(input.branchEntries, keepBudget);
  if (!adjusted) {
    throw new Error(
      `Compaction result still exceeds model context window: summary ${summaryTokens}t + kept ${input.configuredKeepRecent}t + overhead ${overheadTokens}t > ${input.contextWindow}t; no safe kept-window adjustment was available.`,
    );
  }

  const adjustedFit = estimatePostCompactionFit(input.summary, adjusted.estimatedKeepTokens, input.contextWindow);
  if (!adjustedFit.fits) {
    throw new Error(
      `Compaction result still exceeds model context window after kept-window adjustment: estimated ${adjustedFit.estimatedTotal}t > ${input.contextWindow}t.`,
    );
  }

  return {
    firstKeptEntryId: adjusted.firstKeptEntryId,
    estimatedTotal: adjustedFit.estimatedTotal,
    adjusted: adjusted.firstKeptEntryId !== input.currentFirstKeptEntryId,
    margin: adjustedFit.margin,
  };
}

// ---------------------------------------------------------------------------
// Extension factory
// ---------------------------------------------------------------------------

export function createSmartCompactionExtension(options: { streamFn?: CompactionStreamFn } = {}): ExtensionFactory {
  return (pi: ExtensionAPI) => {

  pi.on("session_before_compact", async (event, rawCtx) => {
    const ctx = makeResilientCtx(rawCtx as any) as typeof rawCtx;
    const { preparation, signal, customInstructions, branchEntries } = event;
    const targetContext = parseTargetContextInstructions(customInstructions);
    const {
      messagesToSummarize,
      tokensBefore,
      firstKeptEntryId,
      previousSummary,
      settings,
    } = preparation;

    let finalContextTokens: number | null = null;
    const publishContextSnapshot = (tokens: number | null | undefined, phase: "before_compaction" | "after_compaction") => {
      publishContextEstimate(ctx, typeof tokens === "number" && Number.isFinite(tokens) && tokens >= 0 ? tokens : null, phase, {
        completionPercent: phase === "after_compaction" ? 100 : 0,
      });
    };

    if (messagesToSummarize.length === 0) return;

    publishContextSnapshot(tokensBefore, "before_compaction");
    publishCompactionStatus(ctx, `Smart compaction: scanning ${messagesToSummarize.length} messages…`, estimateSmartCompactionCompletionPercent("scanning"));

    try {
      // Capture the signal reference from the event. The upstream
      // `_compactionAbortController` can be cleared by a concurrent `compact()`
      // call's finally block while our async handler is in flight. By capturing
      // the signal here we can check `.aborted` reliably and return `{ cancel }`
      // instead of falling through — which would crash upstream when it accesses
      // the already-cleared controller.
      const abortSignal = signal;
      const publishCompactionStage = (message: string, phase: string, _tokens?: number | null, completionPercent = estimateSmartCompactionCompletionPercent(phase)) => {
        publishCompactionStatus(ctx, message, completionPercent);
      };
      let lastProgressUiAt = 0;
      const setThrottledProgressMessage = (message: string, phase: string, completionPercent = estimateSmartCompactionCompletionPercent(phase)) => {
        const now = Date.now();
        if (now - lastProgressUiAt < SMART_COMPACTION_PROGRESS_INTERVAL_MS) return;
        lastProgressUiAt = now;
        publishCompactionStatus(ctx, message, completionPercent);
      };

      // ── Compute topic-shift signal once for all downstream paths ──────
      // Both tryNoOpCompaction (to gate the minimal-content fast path) and
      // buildSelectivePrompt (to annotate the compaction prompt) need this.
      // We preserve source-message provenance so synthetic upstream user-role
      // wrappers (branch/compaction summaries, custom messages, bashExecution)
      // don't get mistaken for real human user turns.
      const sanitizedContextPrune = sanitizeContextPruneCompactionMessages(
        messagesToSummarize as SourceMessage[],
        branchEntries,
      );
      const messagesForCompaction = sanitizedContextPrune.messages as SourceMessage[];
      if (sanitizedContextPrune.prunedToolResults > 0 || sanitizedContextPrune.replacedToolCalls > 0) {
        log.debug("Sanitized context-pruned tool history before smart compaction", {
          operation: "smart_compaction.context_prune_sanitize",
          prunedToolResults: sanitizedContextPrune.prunedToolResults,
          replacedToolCalls: sanitizedContextPrune.replacedToolCalls,
          summarizedToolCallCount: sanitizedContextPrune.summarizedToolCallIds.size,
        });
      }

      const { llmMessages, humanUserIndexes, sourceIndexesByLlmIndex } = convertMessagesWithMetadata(
        messagesForCompaction,
      );

      // Check abort early — a concurrent compact() may have already cancelled us.
      if (abortSignal.aborted) return { cancel: true };

      const topicShift = detectRecentTopicShift(llmMessages, humanUserIndexes);

      log.debug("Pivot detection result", {
        detected: !!topicShift,
        reasons: topicShift?.reasons ?? [],
        overlap: topicShift?.overlap ?? null,
        messageCount: llmMessages.length,
      });

      // Extract kept-messages context from branchEntries so the LLM knows
      // what the user is currently working on (kept messages survive compaction).
      const keptContext = branchEntries
        ? extractKeptMessagesSummary(branchEntries, firstKeptEntryId)
        : { summary: "", hasHumanUser: false };
      const keptMessagesSummary = keptContext.summary;
      const sanitizedTurnPrefix = preparation.isSplitTurn && preparation.turnPrefixMessages.length > 0
        ? sanitizeContextPruneCompactionMessages(preparation.turnPrefixMessages as SourceMessage[], branchEntries)
        : null;
      const turnPrefixContext = sanitizedTurnPrefix
        ? convertMessagesWithMetadata(sanitizedTurnPrefix.messages as SourceMessage[])
        : null;
      const turnPrefixSummary = turnPrefixContext
        ? buildTurnPrefixSummary(
            turnPrefixContext.llmMessages,
            turnPrefixContext.humanUserIndexes,
          )
        : "";

      const contextWindow = targetContext.targetContextWindow ?? getContextWindowEstimate(ctx) ?? PROGRESSIVE_FALLBACK_CONTEXT_WINDOW;
      const configuredKeepRecent = Math.max(0, Number(settings.keepRecentTokens) || 0);
      const safeKeepRecent = clampKeepRecentTokens(configuredKeepRecent, contextWindow);
      const targetGuidance = buildTargetContextGuidance(targetContext.targetContextWindow, targetContext.targetModelLabel, configuredKeepRecent);
      const effectiveCustomInstructions = [targetGuidance, targetContext.instructions].filter((part) => part?.trim()).join("\n\n") || undefined;

      // ── No-op detection ──────────────────────────────────────────────
      // Skip the LLM call entirely when we can produce a good summary
      // mechanically. This saves ~60-110s and 100-270k input tokens.
      const noOpResult = tryNoOpCompaction(
        llmMessages,
        preparation,
        firstKeptEntryId,
        tokensBefore,
        topicShift,
        humanUserIndexes,
        {
          hasKeptUserContext: keptContext.hasHumanUser,
          hasTurnPrefixHumanUser: !!turnPrefixContext && turnPrefixContext.humanUserIndexes.size > 0,
        },
        ctx,
      );
      if (noOpResult) {
        const postFit = estimatePostCompactionFit(noOpResult.compaction.summary, configuredKeepRecent, contextWindow);
        if (!postFit.fits || configuredKeepRecent > safeKeepRecent) {
          try {
            const adjusted = maybeAdjustFirstKeptForFit({
              summary: noOpResult.compaction.summary,
              currentFirstKeptEntryId: noOpResult.compaction.firstKeptEntryId,
              configuredKeepRecent,
              targetKeepRecent: safeKeepRecent,
              contextWindow,
              branchEntries,
            });
            if (adjusted.adjusted) {
              log.debug(
                `No-op compaction adjusted kept window to fit ${contextWindow} context (firstKept ${noOpResult.compaction.firstKeptEntryId} → ${adjusted.firstKeptEntryId}, estimated ${adjusted.estimatedTotal}t, margin ${adjusted.margin}t).`,
              );
            }
            finalContextTokens = adjusted.estimatedTotal;
            publishCompactionStage("Smart compaction: reused summary with adjusted kept context…", "completed_noop_adjusted", adjusted.estimatedTotal);
            return {
              compaction: {
                ...noOpResult.compaction,
                firstKeptEntryId: adjusted.firstKeptEntryId,
              },
            };
          } catch {
            log.debug(
              `No-op compaction: post-compaction estimate ${postFit.estimatedTotal} tokens is unsafe for ${contextWindow} context (configured kept ${configuredKeepRecent}t, safe kept ${safeKeepRecent}t, margin ${postFit.margin}t). Falling through to LLM compaction.`,
            );
            publishCompactionStage("Smart compaction: no-op estimate unsafe; extracting signal…", "noop_unsafe", postFit.estimatedTotal);
            // Don't return the no-op — fall through to LLM-based compaction
          }
        } else {
          finalContextTokens = postFit.estimatedTotal;
          publishCompactionStage("Smart compaction: reused existing summary…", "completed_noop", postFit.estimatedTotal);
          return noOpResult;
        }
      }

      // Short conversations can still overflow the provider's compaction prompt
      // when they contain huge tool outputs or image/file payloads. Only fall
      // through to the built-in full-pass compactor when the estimated full
      // prompt has room for system overhead plus a minimal summary response;
      // otherwise keep going into selective/progressive chunking.
      const fullPassPromptEstimate = estimateFullPassFallbackPromptTokens(llmMessages, tokensBefore);
      const conservativeFullPassLimit = Math.min(
        Math.floor(contextWindow * FULL_PASS_FALLBACK_CONTEXT_FRACTION),
        FULL_PASS_FALLBACK_MAX_PROMPT_TOKENS,
      );
      const fullPassFallbackAllowed = fullPassPromptEstimate + MIN_COMPACTION_OUTPUT_TOKENS <= conservativeFullPassLimit && !targetContext.targetContextWindow;
      if (messagesForCompaction.length < SELECTIVE_THRESHOLD && fullPassFallbackAllowed) {
        publishCompactionStage("Smart compaction: using built-in compaction fallback…", "builtin_fallback", tokensBefore);
        return;
      }

      const compactionStartedAt = Date.now();
      if (safeKeepRecent < configuredKeepRecent) {
        log.debug(
          `keepRecentTokens setting ${configuredKeepRecent} exceeds safe ${safeKeepRecent} for ${contextWindow} context; post-compaction fit checks will use the configured kept-window estimate to avoid under-reporting`,
          );
      }

      publishCompactionStage(`Smart compaction: extracting signal from ${messagesForCompaction.length} messages…`, "extracting", tokensBefore);
      log.debug(
        `Smart compaction: ${messagesForCompaction.length} msgs → selective extraction`,
          );

      const promptText = buildSelectivePrompt(
        llmMessages,
        { tokensBefore, previousSummary, fileOps: preparation.fileOps, keptMessagesSummary, turnPrefixSummary },
        effectiveCustomInstructions,
        topicShift,
        humanUserIndexes,
      );

      const promptTokens = estimateCompactionPromptTokens(promptText);
      log.debug(
        `Prompt: ${Math.round(promptText.length / 1000)}k chars / ~${Math.round(promptTokens / 1000)}k tokens (vs ~${Math.round(tokensBefore / 1000)}k tokens full)`,
          );
      publishCompactionStage("Smart compaction: preparing selective summary prompt…", "summarizing_prompt", promptTokens);

      // Compaction model — currently the session model, resolved through one
      // seam so a future dedicated compaction model can be inserted without
      // accidentally mixing model-specific budgets.
      const compactionModel = resolveCompactionModel(ctx) as any;
      if (!compactionModel) {
        log.debug("No model available for smart compaction");
        return;
      }
      const auth = await resolveModelRequestAuth(ctx.modelRegistry as any, compactionModel);
      if (!auth.ok) {
        log.debug("Compaction model is not configured in Pi Agent settings (run `pi /login`)");
        return;
      }

      const budget = getProgressiveCompactionBudget(compactionModel);
      const promptTooLargeForSinglePass = promptTokens + MIN_COMPACTION_OUTPUT_TOKENS > budget.contextWindow;
      if (budget.forceProgressive || promptText.length > budget.promptBudgetChars || promptTooLargeForSinglePass) {
        try {
          publishCompactionStage("Smart compaction: progressive iterative mode…", "progressive_iterative", promptTokens);
          log.debug(
            `Progressive compaction enabled: prompt ${Math.round(promptText.length / 1000)}k chars / ~${Math.round(promptTokens / 1000)}k tokens exceeds safe single-pass budget (${Math.round(budget.promptBudgetChars / 1000)}k chars, ${budget.contextWindow.toLocaleString()} context)`,
          );
          const progressiveResult = await runProgressiveCompaction({
            llmMessages,
            humanUserIndexes,
            sourceIndexesByLlmIndex,
            model: compactionModel,
            auth,
            settings,
            previousSummary,
            keptMessagesSummary,
            turnPrefixSummary,
            customInstructions: effectiveCustomInstructions,
            fileOps: preparation.fileOps,
            budget,
            abortSignal,
            ctx,
            timeoutMs: getCompactionRuntimeConfig().timeoutMs,
            startedAt: compactionStartedAt,
            publishEstimate: undefined,
            streamFn: options.streamFn,
            onProgress: (_generatedChars, progress) => {
              setThrottledProgressMessage(
                formatProgressiveProgressMessage(progress),
                progress?.phase ?? "progressive_streaming",
                estimateProgressiveProgressCompletion(progress),
              );
            },
          });
          const fullSummary = progressiveResult.summary.includes("<read-files>") || progressiveResult.summary.includes("<modified-files>")
            ? progressiveResult.summary
            : appendFileLists(progressiveResult.summary, preparation.fileOps);

          let finalFirstKeptEntryId = firstKeptEntryId;
          let estimatedTotal = 0;
          let margin = 0;
          let adjusted = false;

          if (!progressiveResult.complete) {
            const partialFirstKeptEntryId = resolveFirstKeptEntryIdForSourceMessageIndex(
              branchEntries,
              messagesForCompaction,
              progressiveResult.nextUnprocessedSourceMessageIndex,
            );
            if (!partialFirstKeptEntryId) {
              return cancelCompactionWithReason(
                ctx,
                `Progressive compaction stopped early (${progressiveResult.partialReason ?? "time budget exhausted"}) but could not identify the first unsummarized entry to keep verbatim`,
              );
            }
            const keptTokens = estimateKeptTokensFromEntryId(branchEntries, partialFirstKeptEntryId) ?? configuredKeepRecent;
            const partialFit = estimatePostCompactionFit(fullSummary, keptTokens, contextWindow);
            if (!partialFit.fits) {
              return cancelCompactionWithReason(
                ctx,
                `Progressive compaction stopped early (${progressiveResult.partialReason ?? "time budget exhausted"}) and the safe partial boundary still exceeds context: estimated ${partialFit.estimatedTotal}t > ${contextWindow}t`,
              );
            }
            finalFirstKeptEntryId = partialFirstKeptEntryId;
            estimatedTotal = partialFit.estimatedTotal;
            margin = partialFit.margin;
            adjusted = partialFirstKeptEntryId !== firstKeptEntryId;
            log.debug(
              `Progressive compaction stopped early but kept unsummarized messages verbatim (firstKept ${firstKeptEntryId} → ${partialFirstKeptEntryId}, processed ${progressiveResult.processedChunkCount}/${progressiveResult.totalChunkCount} chunks, estimated ${estimatedTotal}t, margin ${margin}t).`,
            );
          } else {
            const adjustedFit = maybeAdjustFirstKeptForFit({
              summary: fullSummary,
              currentFirstKeptEntryId: firstKeptEntryId,
              configuredKeepRecent,
              targetKeepRecent: safeKeepRecent,
              contextWindow,
              branchEntries,
            });
            finalFirstKeptEntryId = adjustedFit.firstKeptEntryId;
            estimatedTotal = adjustedFit.estimatedTotal;
            margin = adjustedFit.margin;
            adjusted = adjustedFit.adjusted;
          }

          finalContextTokens = estimatedTotal;
          publishCompactionStage(
            progressiveResult.complete
              ? "Smart compaction: completed progressive summary…"
              : "Smart compaction: completed partial progressive summary…",
            progressiveResult.complete ? "completed_progressive" : "completed_progressive_partial",
            estimatedTotal,
          );
          if (adjusted && progressiveResult.complete) {
            log.debug(
              `Progressive compaction adjusted kept window for ${contextWindow} context (firstKept ${firstKeptEntryId} → ${finalFirstKeptEntryId}, estimated ${estimatedTotal}t, margin ${margin}t).`,
            );
          }
          log.debug(progressiveResult.complete ? "Progressive compaction complete ✓" : "Progressive compaction partial boundary complete ✓");
          return {
            compaction: {
              summary: fullSummary,
              firstKeptEntryId: finalFirstKeptEntryId,
              tokensBefore,
            } satisfies CompactionResult,
          };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (abortSignal.aborted || /Compaction cancelled/i.test(msg)) return { cancel: true };
          if (/time budget exhausted/i.test(msg) || !fullPassFallbackAllowed) {
            log.debug(`Progressive compaction failed without a safe built-in fallback: ${msg}`);
            return cancelCompactionWithReason(ctx, msg);
          }
          log.debug(`Progressive compaction error: ${msg}; falling back to built-in compaction`);
          publishCompactionStage("Smart compaction: progressive path failed; using built-in fallback…", "progressive_builtin_fallback", tokensBefore);
          return;
        }
      }

      let activePromptText = promptText;

      const requestedMaxTokens = Math.floor(0.8 * settings.reserveTokens);
      const authForCompletion = auth as { apiKey?: string; headers?: Record<string, string> };

      try {
        const runCompletion = async (prompt: string) => {
          const safeOutput = getSafeCompactionMaxTokens(compactionModel, prompt, requestedMaxTokens);
          return await streamComplete({
            model: compactionModel,
            systemPrompt: SYSTEM_PROMPT,
            userPrompt: prompt,
            maxTokens: safeOutput.maxTokens,
            signal: abortSignal,
            apiKey: authForCompletion.apiKey,
            headers: authForCompletion.headers,
            reasoning: (compactionModel as any).reasoning ? getCompactionReasoningEffort(compactionModel, "selective") : undefined,
            streamFn: options.streamFn,
            onProgress: () => {
              setThrottledProgressMessage("Smart compaction: generating summary still running…", "generating_summary_streaming");
            },
          });
        };

        publishCompactionStage("Smart compaction: generating selective summary…", "generating_summary", estimateCompactionPromptTokens(activePromptText));
        let response;
        try {
          response = await runCompletion(activePromptText);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const trimmedPrompt = isCompactionInputOverflow(msg)
            ? buildTrimmedCompactionRetryPrompt(activePromptText, getCompactionRetryPromptTokenTarget(compactionModel))
            : null;
          if (!trimmedPrompt || abortSignal.aborted) throw err;
          activePromptText = trimmedPrompt;
          log.debug(`Smart compaction input overflow; retrying with trimmed prompt (~${Math.round(estimateCompactionPromptTokens(activePromptText) / 1000)}k tokens).`);
          publishCompactionStage("Smart compaction: retrying with trimmed summary prompt…", "generating_summary_trimmed_retry", estimateCompactionPromptTokens(activePromptText));
          response = await runCompletion(activePromptText);
        }

        if (response.stopReason === "error") {
          const errorMessage = (response as any).errorMessage || "unknown";
          const trimmedPrompt = isCompactionInputOverflow(errorMessage)
            ? buildTrimmedCompactionRetryPrompt(activePromptText, getCompactionRetryPromptTokenTarget(compactionModel))
            : null;
          if (trimmedPrompt && trimmedPrompt !== activePromptText && !abortSignal.aborted) {
            activePromptText = trimmedPrompt;
            log.debug(`Smart compaction LLM overflow response; retrying with trimmed prompt (~${Math.round(estimateCompactionPromptTokens(activePromptText) / 1000)}k tokens).`);
            publishCompactionStage("Smart compaction: retrying with trimmed summary prompt…", "generating_summary_trimmed_retry", estimateCompactionPromptTokens(activePromptText));
            response = await runCompletion(activePromptText);
          }
        }

        if (response.stopReason === "error") {
          const errorMessage = (response as any).errorMessage || "unknown";
          log.debug(
            `Smart compaction LLM error: ${errorMessage}`,
          );
          if (fullPassFallbackAllowed) return undefined;
          return cancelCompactionWithReason(ctx, `Smart compaction LLM error: ${errorMessage}`);
        }

        const summary = response.content
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text)
          .join("\n")
          .trim();

        if (summary.length < MIN_SUMMARY_CHARS) {
          log.debug(
            fullPassFallbackAllowed
              ? "Smart compaction summary too short, falling back to built-in"
              : "Smart compaction summary too short; failing instead of falling back to unsafe full-pass compaction",
          );
          if (fullPassFallbackAllowed) return undefined;
          return cancelCompactionWithReason(ctx, "Smart compaction summary too short");
        }

        if (abortSignal.aborted) return { cancel: true };

        // Append deterministic file sections (same format as built-in)
        const { readFiles, modifiedFiles } = fileListsFromOps(
          preparation.fileOps,
        );
        let fullSummary = summary;
        if (
          !summary.includes("<read-files>") &&
          !summary.includes("<modified-files>")
        ) {
          const parts: string[] = [];
          if (readFiles.length > 0) {
            parts.push(`\n<read-files>\n${compressFilePaths(readFiles)}\n</read-files>`);
          }
          if (modifiedFiles.length > 0) {
            parts.push(
              `\n<modified-files>\n${compressFilePaths(modifiedFiles)}\n</modified-files>`,
            );
          }
          if (parts.length) fullSummary += "\n" + parts.join("\n");
        }

        const adjustedFit = maybeAdjustFirstKeptForFit({
          summary: fullSummary,
          currentFirstKeptEntryId: firstKeptEntryId,
          configuredKeepRecent,
          targetKeepRecent: safeKeepRecent,
          contextWindow,
          branchEntries,
        });
        finalContextTokens = adjustedFit.estimatedTotal;
        publishCompactionStage("Smart compaction: completed selective summary…", "completed_selective", adjustedFit.estimatedTotal);

        if (adjustedFit.adjusted) {
          log.debug(
            `Single-pass compaction adjusted kept window for ${contextWindow} context (firstKept ${firstKeptEntryId} → ${adjustedFit.firstKeptEntryId}, estimated ${adjustedFit.estimatedTotal}t, margin ${adjustedFit.margin}t).`,
          );
        }
        log.debug("Smart compaction complete ✓");

        return {
          compaction: {
            summary: fullSummary,
            firstKeptEntryId: adjustedFit.firstKeptEntryId,
            tokensBefore,
          } satisfies CompactionResult,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (!abortSignal.aborted) {
          log.debug(`Smart compaction error: ${msg}`);
        }
        // If aborted by the user/session, report an upstream cancellation.
        // For non-abort safety/LLM failures, cancel with a recorded Piclaw
        // reason so the managed wrapper can record backoff/emergency-rotate
        // instead of treating this as a user interrupt.
        if (abortSignal.aborted || /Compaction cancelled/i.test(msg)) return { cancel: true };
        if (/Compaction result still exceeds|exceeds safe model budget/i.test(msg) || !fullPassFallbackAllowed) return cancelCompactionWithReason(ctx, msg);
        return; // fall through to built-in only when the full-pass prompt is estimated safe
      }
    } finally {
      // Always broadcast a final complete-context estimate so the meter is
      // never stale after compaction completes, fails, or is cancelled. During
      // compaction, keep prompt/chunk/merge estimates out of context_usage so
      // the visual context wheel only reflects real full-context sizes.
      publishContextSnapshot(finalContextTokens ?? tokensBefore, "after_compaction");
      publishCompactionStatus(ctx, undefined);
    }
  });
  };
}

export const smartCompaction: ExtensionFactory = createSmartCompactionExtension();

/**
 * agent-pool/compaction.ts – Shared compaction helpers for orchestrated and manual compaction paths.
 */

import { type AgentSession, type AgentSessionEvent } from "@earendil-works/pi-coding-agent";

import { getCompactionRuntimeConfig } from "../core/config.js";
import {
  clearChatCompactionActive,
  clearChatCompactionBackoff,
  getChatCompactionBackoff,
  getChatAutoCompactionWindow,
  markChatCompactionActive,
  resetChatAutoCompactionWindow,
  setChatAutoCompactionWindow,
  setChatCompactionBackoff,
  type ChatAutoCompactionWindowState,
  type ChatCompactionBackoffState,
} from "../db.js";
import { formatTimeoutDuration } from "./prompt-utils.js";
import { consumeCompactionCancellationReason } from "./compaction-cancel-reason.js";
import { updateSessionCompacting } from "../extensions/session-status.js";
import { applyTokenEstimateSafetyMultiplier, getContextThresholdTokens, getContextWindowFromModel, getEffectiveContextWindow, getSystemPromptOverheadTokens, getUnknownModelContextWindow } from "../utils/context-window-budget.js";
import { createLogger, debugSuppressedError } from "../utils/logger.js";

const log = createLogger("agent-pool.compaction");

export interface CompactionLifecycleOptions {
  onInfo?: (message: string, details: Record<string, unknown>) => void;
  onWarn?: (message: string, details: Record<string, unknown>) => void;
}

const DEFAULT_IDLE_AUTO_COMPACTION_DELAY_MS = 5_000;
const idleAutoCompactionTimers = new Map<string, ReturnType<typeof setTimeout>>();

type CompactionOutcome<T> = { ok: true; result: T } | { ok: false; errorMessage: string };
type ActiveCompaction = { outcome: Promise<CompactionOutcome<unknown>> };

const activeCompactions = new Map<string, ActiveCompaction>();

type AutoCompactionReason = "threshold" | "idle";

export type CompactionSuccessReason = "threshold" | "idle" | "manual" | "model_switch" | "model_downshift" | "recovery" | "rotation" | string;

export interface CompactionSuccessFinalizeOptions extends Pick<CompactionLifecycleOptions, "onInfo" | "onWarn"> {
  onEvent?: (event: AgentSessionEvent) => void;
  /** Increment repeated-compaction counters and emit threshold warnings. Defaults to false. */
  countSuccess?: boolean;
  /** Reset the failure backoff after success. Defaults to true. */
  clearBackoff?: boolean;
}

function estimateMessageTokens(message: any): number {
  if (!message || typeof message !== "object") return 0;

  const countText = (value: unknown): number => {
    if (typeof value === "string") return value.length;
    if (!Array.isArray(value)) return 0;
    let chars = 0;
    for (const block of value) {
      if (!block || typeof block !== "object") continue;
      if (block.type === "text" && typeof block.text === "string") chars += block.text.length;
      if (block.type === "thinking" && typeof block.thinking === "string") chars += block.thinking.length;
      if (block.type === "toolCall") {
        chars += typeof block.name === "string" ? block.name.length : 0;
        if (block.arguments !== undefined) chars += JSON.stringify(block.arguments).length;
      }
      if (block.type === "image") chars += 4800;
    }
    return chars;
  };

  switch (message.role) {
    case "assistant":
    case "custom":
    case "toolResult":
      return Math.ceil(countText(message.content) / 4);
    case "user":
      return Math.ceil(countText(message.content) / 4);
    case "bashExecution": {
      const chars = (typeof message.command === "string" ? message.command.length : 0)
        + (typeof message.output === "string" ? message.output.length : 0);
      return Math.ceil(chars / 4);
    }
    case "branchSummary":
    case "compactionSummary":
      return Math.ceil(((typeof message.summary === "string" ? message.summary.length : 0)) / 4);
    default:
      return 0;
  }
}

/** Short-lived per-session-manager cache for estimateContextTokensFromSession to avoid
 *  rebuilding the full session context on every call. */
type ContextEstimateCacheEntry = {
  leafId: string;
  entryCount: number;
  tokens: number;
  at: number;
};
const ctxEstimateCache = new WeakMap<object, ContextEstimateCacheEntry>();
const CTX_ESTIMATE_CACHE_TTL_MS = 2_000;

export function clearContextEstimateCache(session: AgentSession): void {
  const mgr = session.sessionManager;
  if (mgr && typeof mgr === "object") ctxEstimateCache.delete(mgr as object);
}

export function estimateContextTokensFromSession(session: AgentSession): number {
  const mgr = session.sessionManager;
  if (!mgr || typeof mgr !== "object") {
    const usage = session.getContextUsage?.();
    return typeof usage?.tokens === "number" && Number.isFinite(usage.tokens) ? usage.tokens : 0;
  }
  const leafId = typeof mgr.getLeafId === "function" ? (mgr.getLeafId() ?? "") : "";
  const entryCount = typeof mgr.getEntries === "function" ? mgr.getEntries().length : -1;
  const now = Date.now();
  const cached = ctxEstimateCache.get(mgr as object);

  if (
    cached &&
    cached.leafId === leafId &&
    cached.entryCount === entryCount &&
    now - cached.at < CTX_ESTIMATE_CACHE_TTL_MS
  ) {
    return cached.tokens;
  }

  if (typeof mgr.buildSessionContext !== "function") {
    const usage = session.getContextUsage?.();
    return typeof usage?.tokens === "number" && Number.isFinite(usage.tokens) ? usage.tokens : 0;
  }

  const context = mgr.buildSessionContext();
  const hasCompactionSummary = context.messages.some((message: any) => message?.role === "compactionSummary");

  // Assistant usage metadata is scoped to the prompt that produced that
  // assistant message. After a compaction, kept assistant messages can still
  // carry pre-compaction usage totals, so trusting getContextUsage()/last usage
  // makes the freshly compacted context look huge and triggers repeated idle
  // compactions. Once a compacted summary is present, estimate the resolved
  // compacted context directly from the messages instead.
  if (!hasCompactionSummary) {
    const usage = session.getContextUsage?.();
    if (typeof usage?.tokens === "number") {
      ctxEstimateCache.set(mgr as object, { leafId, entryCount, tokens: usage.tokens, at: now });
      return usage.tokens;
    }
  }

  const tokens = context.messages.reduce((total: number, message: any) => total + estimateMessageTokens(message), 0);
  ctxEstimateCache.set(mgr as object, { leafId, entryCount, tokens, at: now });
  return tokens;
}

/** Fallback context window when the model does not report one.
 *  Conservative enough to trigger compaction before most models overflow. */
// ── Per-session compaction counter for auto-rotation ──
const compactionSuccessCounters = new Map<string, number>();

function buildFallbackAutoCompactionWindow(
  chatJid: string,
  baselineTokens: number | null = null,
  options: { ordinal?: number; successCount?: number; warnedCount?: number } = {},
): ChatAutoCompactionWindowState {
  const baseline = baselineTokens == null ? null : Math.max(0, Math.trunc(Number(baselineTokens) || 0));
  return {
    chatJid,
    ordinal: Math.max(1, Math.trunc(Number(options.ordinal ?? 1) || 1)),
    baselineTokens: baseline,
    prefillTokens: baseline,
    successCount: Math.max(0, Math.trunc(Number(options.successCount ?? 0) || 0)),
    warnedCount: Math.max(0, Math.trunc(Number(options.warnedCount ?? 0) || 0)),
    updatedAt: new Date().toISOString(),
  };
}

function getPersistedAutoCompactionWindowOrFallback(chatJid: string): ChatAutoCompactionWindowState {
  try {
    return getChatAutoCompactionWindow(chatJid);
  } catch (error) {
    // Tests, early startup paths, and shutdown-adjacent rotation can finalize
    // compaction when the DB is unavailable. Keep the runtime path best-effort
    // instead of turning a successful compaction/rotation into an agent error.
    debugSuppressedError(log, "Failed to read persisted auto-compaction window; using volatile fallback", error, {
      operation: "compaction.auto_window.read_fallback",
      chatJid,
    });
    return buildFallbackAutoCompactionWindow(chatJid, null, {
      successCount: compactionSuccessCounters.get(chatJid) ?? 0,
    });
  }
}

export function getCompactionSuccessCount(chatJid: string): number {
  return compactionSuccessCounters.get(chatJid) ?? 0;
}

export function resetCompactionSuccessCount(chatJid: string): void {
  compactionSuccessCounters.delete(chatJid);
  try {
    const state = getChatAutoCompactionWindow(chatJid);
    setChatAutoCompactionWindow(chatJid, {
      ...state,
      successCount: 0,
      warnedCount: 0,
    });
  } catch (error) {
    // Tests and early startup paths can call this before the DB is initialised.
    debugSuppressedError(log, "Failed to reset persisted compaction success count", error, {
      operation: "compaction.reset_success_count.persisted_state",
      chatJid,
    });
  }
}

function shouldEmitRepeatedCompactionWarning(previousWarnedCount: number, nextSuccessCount: number, warningThreshold: number): boolean {
  return warningThreshold > 0 && nextSuccessCount >= warningThreshold && previousWarnedCount < warningThreshold;
}

export function noteCompactionSuccess(
  session: AgentSession,
  chatJid: string,
  reason: CompactionSuccessReason,
  options: CompactionSuccessFinalizeOptions = {},
): ChatAutoCompactionWindowState {
  if (options.clearBackoff !== false) clearCompactionFailureBackoff(chatJid);

  const previousWindow = getPersistedAutoCompactionWindowOrFallback(chatJid);
  const countSuccess = options.countSuccess === true;
  const prevVolatileCount = compactionSuccessCounters.get(chatJid) ?? 0;
  const nextSuccessCount = countSuccess ? previousWindow.successCount + 1 : previousWindow.successCount;
  if (countSuccess) compactionSuccessCounters.set(chatJid, prevVolatileCount + 1);

  clearContextEstimateCache(session);
  const postRawContextTokens = estimateContextTokensFromSession(session);
  const postContextTokens = applyTokenEstimateSafetyMultiplier(postRawContextTokens);
  let nextWindow: ChatAutoCompactionWindowState;
  try {
    nextWindow = resetChatAutoCompactionWindow(chatJid, postContextTokens, {
      successCount: nextSuccessCount,
      warnedCount: previousWindow.warnedCount,
    });
  } catch (error) {
    debugSuppressedError(log, "Failed to persist auto-compaction window; using volatile fallback", error, {
      operation: "compaction.auto_window.write_fallback",
      chatJid,
      reason,
    });
    nextWindow = buildFallbackAutoCompactionWindow(chatJid, postContextTokens, {
      ordinal: previousWindow.ordinal + 1,
      successCount: nextSuccessCount,
      warnedCount: previousWindow.warnedCount,
    });
  }

  options.onInfo?.("Compaction success finalized", {
    operation: "compaction.success_finalizer",
    chatJid,
    reason,
    countSuccess,
    compactionCount: nextSuccessCount,
    volatileCompactionCount: countSuccess ? prevVolatileCount + 1 : prevVolatileCount,
    postRawContextTokens,
    postContextTokens,
    autoCompactionWindowOrdinal: nextWindow.ordinal,
    autoCompactionBaselineTokens: nextWindow.baselineTokens,
    autoCompactionPrefillTokens: nextWindow.prefillTokens,
  });

  if (countSuccess) {
    const warningThreshold = getCompactionRuntimeConfig().warningThreshold;
    if (shouldEmitRepeatedCompactionWarning(previousWindow.warnedCount, nextSuccessCount, warningThreshold)) {
      let warnedWindow: typeof nextWindow;
      try {
        warnedWindow = setChatAutoCompactionWindow(chatJid, {
          ...nextWindow,
          warnedCount: nextSuccessCount,
        });
      } catch (error) {
        debugSuppressedError(log, "Failed to persist repeated auto-compaction warning", error, {
          operation: "compaction.auto_window.warning_fallback",
          chatJid,
          reason,
        });
        warnedWindow = {
          ...nextWindow,
          warnedCount: nextSuccessCount,
        };
      }
      const detail = `This chat has auto-compacted ${nextSuccessCount} times. If this keeps happening, consider rotating the session or switching to a larger context model.`;
      options.onWarn?.("Repeated auto-compaction warning", {
        operation: "compaction.success_finalizer.repeated_warning",
        chatJid,
        reason,
        compactionCount: nextSuccessCount,
        warningThreshold,
      });
      options.onEvent?.({
        type: "compaction_warning",
        reason: "repeated_successes",
        compactionCount: nextSuccessCount,
        warningThreshold,
        detail,
      } as unknown as AgentSessionEvent);
      return warnedWindow;
    }
  }

  return nextWindow;
}

export const DEFAULT_FALLBACK_CONTEXT_WINDOW = getUnknownModelContextWindow();

export function getModelContextWindow(session: AgentSession): number | null {
  return getContextWindowFromModel(session.model);
}

function parseNonNegativeInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(String(value || "").trim(), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function getIdleAutoCompactionDelayMs(): number {
  return parseNonNegativeInt(process.env.PICLAW_IDLE_AUTO_COMPACTION_DELAY_MS, DEFAULT_IDLE_AUTO_COMPACTION_DELAY_MS);
}

function getCompactionBackoffBaseMs(): number {
  return getCompactionRuntimeConfig().backoffBaseMs;
}

function getCompactionBackoffMaxMs(): number {
  return getCompactionRuntimeConfig().backoffMaxMs;
}

function computeCompactionBackoffMs(failureCount: number): number {
  const normalizedFailures = Math.max(1, Math.trunc(failureCount));
  const baseMs = getCompactionBackoffBaseMs();
  const maxMs = getCompactionBackoffMaxMs();
  return Math.min(maxMs, baseMs * 2 ** Math.max(0, normalizedFailures - 1));
}

export function isCompactionCancellationError(message: string | null | undefined): boolean {
  return /compaction cancelled|aborterror/i.test(String(message || ""));
}

function isRecentCompactionFailure(state: ChatCompactionBackoffState, nowMs = Date.now()): boolean {
  const failedAtMs = Date.parse(state.lastFailedAt);
  if (!Number.isFinite(failedAtMs)) return false;
  return failedAtMs <= nowMs && (nowMs - failedAtMs) <= 24 * 60 * 60 * 1000;
}

function formatCompactionBackoffDetail(state: Pick<ChatCompactionBackoffState, "failureCount" | "backoffUntil" | "lastErrorMessage">): string {
  const parts = [
    `Skipping auto-compaction until ${state.backoffUntil}`,
    `${state.failureCount} recent failure${state.failureCount === 1 ? "" : "s"}`,
  ];
  if (state.lastErrorMessage) {
    parts.push(`Last error: ${state.lastErrorMessage.slice(0, 160)}`);
  }
  return parts.join(" — ");
}

export function getActiveCompactionBackoff(chatJid: string, nowMs = Date.now()): ChatCompactionBackoffState | null {
  const state = getChatCompactionBackoff(chatJid);
  if (!state) return null;
  const untilMs = Date.parse(state.backoffUntil);
  if (!Number.isFinite(untilMs) || untilMs <= nowMs) return null;
  return state;
}

export function clearCompactionFailureBackoff(chatJid: string): void {
  clearChatCompactionBackoff(chatJid);
}

export function noteCompactionFailure(chatJid: string, errorMessage: string, failedAtIso = new Date().toISOString()): ChatCompactionBackoffState {
  const previous = getChatCompactionBackoff(chatJid);
  const failureCount = (previous?.failureCount ?? 0) + 1;
  const failedAtMs = Date.parse(failedAtIso);
  const backoffMs = computeCompactionBackoffMs(failureCount);
  const backoffUntil = new Date((Number.isFinite(failedAtMs) ? failedAtMs : Date.now()) + backoffMs).toISOString();
  const nextState: ChatCompactionBackoffState = {
    chatJid,
    failureCount,
    lastFailedAt: failedAtIso,
    backoffUntil,
    lastErrorMessage: errorMessage || null,
  };
  setChatCompactionBackoff(chatJid, nextState);
  return nextState;
}

export function getCompactionTimeoutMs(): number {
  return getCompactionRuntimeConfig().timeoutMs;
}

function markCompactionActiveBestEffort(chatJid: string, reason: string): void {
  try {
    markChatCompactionActive(chatJid, new Date().toISOString(), reason);
  } catch (error) {
    debugSuppressedError(log, "Failed to mark chat compaction active", error, {
      operation: "compaction.mark_active",
      chatJid,
      reason,
    });
  }
}

function clearCompactionActiveBestEffort(chatJid: string): void {
  try {
    clearChatCompactionActive(chatJid);
  } catch (error) {
    debugSuppressedError(log, "Failed to clear chat compaction active", error, {
      operation: "compaction.clear_active",
      chatJid,
    });
  }
}

export async function abortCompactionBestEffort(
  session: AgentSession,
  chatJid: string,
  options: Pick<CompactionLifecycleOptions, "onWarn">,
): Promise<void> {
  try {
    const compactingSession = session as AgentSession & {
      abortCompaction?: () => void;
      abort?: () => Promise<void>;
    };
    if (typeof compactingSession.abortCompaction === "function" && session.isCompacting) {
      compactingSession.abortCompaction();
      return;
    }
    if (typeof compactingSession.abort === "function") {
      await compactingSession.abort();
    }
  } catch (error) {
    options.onWarn?.("Failed to abort stuck compaction", {
      operation: "run_agent.abort_stuck_compaction",
      chatJid,
      err: error,
    });
  }
}

export async function runCompactionWithTimeout<T>(
  session: AgentSession,
  chatJid: string,
  options: Pick<CompactionLifecycleOptions, "onWarn">,
  runCompact: () => Promise<T>,
  reason = "manual",
): Promise<CompactionOutcome<T>> {
  const existing = activeCompactions.get(chatJid);
  if (existing) {
    options.onWarn?.("Compaction already in progress; joining existing compaction", {
      operation: "run_agent.join_active_compaction",
      chatJid,
    });
    return await existing.outcome as CompactionOutcome<T>;
  }

  const active: ActiveCompaction = { outcome: Promise.resolve({ ok: false, errorMessage: "Compaction did not start" }) };
  const clearActive = () => {
    if (activeCompactions.get(chatJid) === active) activeCompactions.delete(chatJid);
  };
  const outcome = runCompactionWithTimeoutExclusive(session, chatJid, options, runCompact, clearActive, reason);
  active.outcome = outcome as Promise<CompactionOutcome<unknown>>;
  activeCompactions.set(chatJid, active);
  return await outcome;
}

async function runCompactionWithTimeoutExclusive<T>(
  session: AgentSession,
  chatJid: string,
  options: Pick<CompactionLifecycleOptions, "onWarn">,
  runCompact: () => Promise<T>,
  clearActive: () => void,
  reason: string,
): Promise<CompactionOutcome<T>> {
  const timeoutMs = getCompactionTimeoutMs();
  updateSessionCompacting(chatJid, true);
  markCompactionActiveBestEffort(chatJid, reason);
  if (timeoutMs <= 0) {
    try {
      return { ok: true, result: await runCompact() };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const recordedReason = isCompactionCancellationError(errorMessage)
        ? consumeCompactionCancellationReason(session)
        : null;
      return { ok: false, errorMessage: recordedReason ?? errorMessage };
    } finally {
      clearContextEstimateCache(session);
      updateSessionCompacting(chatJid, false);
      clearCompactionActiveBestEffort(chatJid);
      clearActive();
    }
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const compactionOutcome = Promise.resolve()
    .then(() => runCompact())
    .then((result): CompactionOutcome<T> => ({ ok: true, result }))
    .catch((error): CompactionOutcome<T> => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const recordedReason = isCompactionCancellationError(errorMessage)
        ? consumeCompactionCancellationReason(session)
        : null;
      return {
        ok: false,
        errorMessage: recordedReason ?? errorMessage,
      };
    })
    .finally(() => {
      if (timeoutId) clearTimeout(timeoutId);
      clearContextEstimateCache(session);
      updateSessionCompacting(chatJid, false);
      clearCompactionActiveBestEffort(chatJid);
      clearActive();
    });

  const timedOut = Symbol("compaction-timeout");
  const timeoutOutcome = new Promise<typeof timedOut>((resolve) => {
    timeoutId = setTimeout(() => resolve(timedOut), timeoutMs);
  });

  const outcome = await Promise.race([compactionOutcome, timeoutOutcome]);
  if (outcome !== timedOut) {
    return outcome;
  }

  await abortCompactionBestEffort(session, chatJid, options);

  // Wait for the compaction promise to fully settle so extension handlers
  // finish their cleanup (finally blocks, UI teardown) before the caller
  // can dispose the session.  Without this, emergency rotation can call
  // session.dispose() while the extension's ctx is still in use.
  const SETTLEMENT_GRACE_MS = 5_000;
  await Promise.race([
    compactionOutcome,
    new Promise<void>((r) => setTimeout(r, SETTLEMENT_GRACE_MS)),
  ]);

  updateSessionCompacting(chatJid, false);
  clearCompactionActiveBestEffort(chatJid);
  // Release the in-memory single-flight lock after timeout+settlement grace
  // even if the upstream compaction promise never resolves. A late settlement
  // will run the promise's finally and call clearActive() again harmlessly.
  clearActive();
  return {
    ok: false,
    errorMessage: `Compaction timed out after ${formatTimeoutDuration(timeoutMs)}`,
  };
}

export interface AutoCompactionTokenStatus {
  activeContextTokens: number;
  autoCompactionScopeTokens: number;
  autoCompactionScopeLimit: number;
  scope: "total" | "body_after_prefix";
  windowOrdinal: number | null;
  baselineTokens: number | null;
  prefillTokens: number | null;
  fullContextWindowLimit: number;
  fullContextWindowLimitReached: boolean;
  tokenLimitReached: boolean;
}

export function computeAutoCompactionTokenStatus(input: {
  activeContextTokens: number;
  contextWindow: number;
  thresholdPercent: number;
  hardCeilingPercent: number;
  overheadTokens: number;
  scope: "total" | "body_after_prefix";
  window?: Pick<ChatAutoCompactionWindowState, "ordinal" | "baselineTokens" | "prefillTokens"> | null;
}): AutoCompactionTokenStatus {
  const activeContextTokens = Math.max(0, Math.trunc(Number(input.activeContextTokens) || 0));
  const autoCompactionScopeLimit = getContextThresholdTokens(input.contextWindow, input.thresholdPercent, input.overheadTokens);
  const fullContextWindowLimit = getContextThresholdTokens(input.contextWindow, input.hardCeilingPercent, input.overheadTokens);
  if (input.scope === "body_after_prefix") {
    const baseline = input.window?.prefillTokens ?? input.window?.baselineTokens ?? activeContextTokens;
    const scopedTokens = Math.max(0, activeContextTokens - Math.max(0, Math.trunc(Number(baseline) || 0)));
    const fullContextWindowLimitReached = activeContextTokens >= fullContextWindowLimit;
    return {
      activeContextTokens,
      autoCompactionScopeTokens: scopedTokens,
      autoCompactionScopeLimit,
      scope: "body_after_prefix",
      windowOrdinal: input.window?.ordinal ?? 1,
      baselineTokens: input.window?.baselineTokens ?? null,
      prefillTokens: input.window?.prefillTokens ?? null,
      fullContextWindowLimit,
      fullContextWindowLimitReached,
      tokenLimitReached: scopedTokens >= autoCompactionScopeLimit || fullContextWindowLimitReached,
    };
  }

  const fullContextWindowLimitReached = activeContextTokens >= fullContextWindowLimit;
  return {
    activeContextTokens,
    autoCompactionScopeTokens: activeContextTokens,
    autoCompactionScopeLimit,
    scope: "total",
    windowOrdinal: null,
    baselineTokens: null,
    prefillTokens: null,
    fullContextWindowLimit,
    fullContextWindowLimitReached,
    tokenLimitReached: activeContextTokens >= autoCompactionScopeLimit || fullContextWindowLimitReached,
  };
}

export interface AutoCompactionSessionTokenStatus {
  rawContextTokens: number;
  projectedAdditionalRawTokens: number;
  contextTokens: number;
  contextWindow: number;
  effectiveContextWindow: number;
  overheadTokens: number;
  reserveTokens: number;
  thresholdPercent: number;
  hardCeilingPercent: number;
  tokenStatus: AutoCompactionTokenStatus;
}

export function getAutoCompactionTokenStatusForSession(
  session: AgentSession,
  chatJid: string,
  options: { projectedAdditionalRawTokens?: number } = {},
): AutoCompactionSessionTokenStatus | null {
  const contextWindow = getModelContextWindow(session) ?? getUnknownModelContextWindow();
  if (!Number.isFinite(contextWindow) || contextWindow <= 0) return null;
  const rawCurrentTokens = estimateContextTokensFromSession(session);
  const projectedAdditionalRawTokens = Math.max(0, Math.trunc(Number(options.projectedAdditionalRawTokens) || 0));
  const rawContextTokens = rawCurrentTokens + projectedAdditionalRawTokens;
  const contextTokens = applyTokenEstimateSafetyMultiplier(rawContextTokens);
  const compactionConfig = getCompactionRuntimeConfig();
  const overheadTokens = getSystemPromptOverheadTokens();
  const effectiveContextWindow = getEffectiveContextWindow(contextWindow, overheadTokens);
  let windowState = getChatAutoCompactionWindow(chatJid);
  if (compactionConfig.autoCompactionScope === "body_after_prefix" && windowState.prefillTokens == null && windowState.baselineTokens == null) {
    windowState = setChatAutoCompactionWindow(chatJid, {
      ...windowState,
      baselineTokens: contextTokens,
      prefillTokens: contextTokens,
    });
  }
  const tokenStatus = computeAutoCompactionTokenStatus({
    activeContextTokens: contextTokens,
    contextWindow,
    thresholdPercent: compactionConfig.thresholdPercent,
    hardCeilingPercent: compactionConfig.hardCeilingPercent,
    overheadTokens,
    scope: compactionConfig.autoCompactionScope,
    window: windowState,
  });
  return {
    rawContextTokens,
    projectedAdditionalRawTokens,
    contextTokens,
    contextWindow,
    effectiveContextWindow,
    overheadTokens,
    reserveTokens: contextWindow - tokenStatus.autoCompactionScopeLimit,
    thresholdPercent: compactionConfig.thresholdPercent,
    hardCeilingPercent: compactionConfig.hardCeilingPercent,
    tokenStatus,
  };
}

function getAutoCompactionContext(
  session: AgentSession,
  chatJid: string,
  options: Pick<CompactionLifecycleOptions, "onInfo" | "onWarn">,
  reason: AutoCompactionReason,
  projectedAdditionalRawTokens = 0,
): AutoCompactionSessionTokenStatus | null {
  if (session.isStreaming || session.isCompacting || session.isRetrying) return null;
  const reportedContextWindow = getModelContextWindow(session);
  const contextWindow = reportedContextWindow ?? getUnknownModelContextWindow();
  if (!reportedContextWindow) {
    options.onWarn?.(
      reason === "idle"
        ? "Model does not report contextWindow; using fallback for idle compaction"
        : "Model does not report contextWindow; using fallback for pre-prompt compaction",
      {
        operation: reason === "idle"
          ? "schedule_idle_auto_compaction.fallback_context_window"
          : "maybe_auto_compact_session_before_prompt.fallback_context_window",
        chatJid,
        fallbackContextWindow: DEFAULT_FALLBACK_CONTEXT_WINDOW,
        modelId: (session.model as any)?.id ?? null,
        provider: (session.model as any)?.provider ?? null,
      },
    );
  }

  const settingsManager = (session as AgentSession & {
    settingsManager?: { getCompactionSettings?: () => { enabled?: boolean; reserveTokens?: number } };
  }).settingsManager;
  const settings = typeof settingsManager?.getCompactionSettings === "function"
    ? settingsManager.getCompactionSettings()
    : null;
  if (!settings) return null;

  const status = getAutoCompactionTokenStatusForSession(session, chatJid, { projectedAdditionalRawTokens });
  if (!status?.tokenStatus.tokenLimitReached) return null;
  const { rawContextTokens, contextTokens, effectiveContextWindow, overheadTokens, reserveTokens, tokenStatus } = status;

  const trigger = tokenStatus.fullContextWindowLimitReached && tokenStatus.autoCompactionScopeTokens < tokenStatus.autoCompactionScopeLimit
    ? "hard_ceiling"
    : "scoped_threshold";
  options.onInfo?.(
    reason === "idle"
      ? "Idle auto-compaction threshold exceeded"
      : "Pre-prompt auto-compaction threshold exceeded",
    {
      operation: reason === "idle"
        ? "schedule_idle_auto_compaction.threshold"
        : "maybe_auto_compact_session_before_prompt.threshold",
      chatJid,
      trigger,
      contextTokens,
      rawContextTokens,
      projectedAdditionalRawTokens: status.projectedAdditionalRawTokens,
      contextWindow,
      effectiveContextWindow,
      overheadTokens,
      thresholdTokens: tokenStatus.autoCompactionScopeLimit,
      thresholdPercent: status.thresholdPercent,
      hardCeilingPercent: status.hardCeilingPercent,
      hardCeilingTokens: tokenStatus.fullContextWindowLimit,
      hardCeilingReached: tokenStatus.fullContextWindowLimitReached,
      autoCompactionScope: tokenStatus.scope,
      autoCompactionScopeTokens: tokenStatus.autoCompactionScopeTokens,
      autoCompactionScopeLimit: tokenStatus.autoCompactionScopeLimit,
      autoCompactionWindowOrdinal: tokenStatus.windowOrdinal,
      autoCompactionBaselineTokens: tokenStatus.baselineTokens,
      autoCompactionPrefillTokens: tokenStatus.prefillTokens,
      reserveTokens,
    },
  );

  return status;
}

async function maybeAutoCompactSession(
  session: AgentSession,
  chatJid: string,
  options: Pick<CompactionLifecycleOptions, "onInfo" | "onWarn">,
  onEvent: ((event: AgentSessionEvent) => void) | undefined,
  reason: AutoCompactionReason,
  projectedAdditionalRawTokens = 0,
): Promise<void> {
  const context = getAutoCompactionContext(session, chatJid, options, reason, projectedAdditionalRawTokens);
  if (!context) return;

  try {
    const activeBackoff = getActiveCompactionBackoff(chatJid);
    const previousBackoff = getChatCompactionBackoff(chatJid);
    const previousNonCancellationFailure = previousBackoff
      && !isCompactionCancellationError(previousBackoff.lastErrorMessage)
      && isRecentCompactionFailure(previousBackoff)
      ? previousBackoff
      : null;
    if (activeBackoff && isCompactionCancellationError(activeBackoff.lastErrorMessage) && reason === "idle") {
      clearCompactionFailureBackoff(chatJid);
      options.onWarn?.(
        "Idle auto-compaction clearing cancellation backoff",
        {
          operation: "schedule_idle_auto_compaction.backoff_cleared",
          chatJid,
          contextTokens: context.contextTokens,
          contextWindow: context.contextWindow,
          reserveTokens: context.reserveTokens,
          failureCount: activeBackoff.failureCount,
          backoffUntil: activeBackoff.backoffUntil,
          lastErrorMessage: activeBackoff.lastErrorMessage,
        },
      );
    } else if (activeBackoff || previousNonCancellationFailure) {
      const suppressionState = activeBackoff ?? previousNonCancellationFailure!;
      const detail = activeBackoff
        ? formatCompactionBackoffDetail(suppressionState)
        : `Previous auto-compaction failed at ${suppressionState.lastFailedAt}; emergency rotation should run before retrying. Last error: ${(suppressionState.lastErrorMessage ?? "unknown").slice(0, 160)}`;
      options.onWarn?.(
        reason === "idle"
          ? "Idle auto-compaction suppressed for chat after recent failures"
          : "Pre-prompt auto-compaction suppressed for chat after recent failures",
        {
          operation: reason === "idle"
            ? "schedule_idle_auto_compaction.backoff"
            : "maybe_auto_compact_session_before_prompt.backoff",
          chatJid,
          contextTokens: context.contextTokens,
          contextWindow: context.contextWindow,
          reserveTokens: context.reserveTokens,
          failureCount: suppressionState.failureCount,
          backoffUntil: suppressionState.backoffUntil,
          lastErrorMessage: suppressionState.lastErrorMessage,
        },
      );
      onEvent?.({
        type: "compaction_suppressed",
        reason: activeBackoff ? "backoff" : "previous_failure",
        until: suppressionState.backoffUntil,
        failureCount: suppressionState.failureCount,
        detail,
        errorMessage: suppressionState.lastErrorMessage ?? undefined,
      } as unknown as AgentSessionEvent);
      return;
    }

    options.onInfo?.(
      reason === "idle"
        ? "Auto-compacting idle session after turn"
        : "Auto-compacting session before prompt",
      {
        operation: reason === "idle"
          ? "schedule_idle_auto_compaction"
          : "maybe_auto_compact_session_before_prompt",
        chatJid,
        contextTokens: context.contextTokens,
        contextWindow: context.contextWindow,
        projectedAdditionalRawTokens: context.projectedAdditionalRawTokens,
        reserveTokens: context.reserveTokens,
        autoCompactionScope: context.tokenStatus.scope,
        autoCompactionScopeTokens: context.tokenStatus.autoCompactionScopeTokens,
        autoCompactionScopeLimit: context.tokenStatus.autoCompactionScopeLimit,
        autoCompactionWindowOrdinal: context.tokenStatus.windowOrdinal,
        autoCompactionBaselineTokens: context.tokenStatus.baselineTokens,
        autoCompactionPrefillTokens: context.tokenStatus.prefillTokens,
        hardCeilingTokens: context.tokenStatus.fullContextWindowLimit,
        hardCeilingReached: context.tokenStatus.fullContextWindowLimitReached,
      },
    );

    onEvent?.({ type: "compaction_start", reason } as AgentSessionEvent);
    const compactionResult = await runCompactionWithTimeout(
      session,
      chatJid,
      options,
      async () => await session.compact(),
      reason,
    );
    if (!compactionResult.ok) {
      const aborted = isCompactionCancellationError(compactionResult.errorMessage);
      // Pre-prompt compaction runs can be deferred in the web channel. If a
      // deferred compaction is cancelled and we do not record backoff, the
      // resume path immediately re-selects the same pending message, crosses
      // the same threshold, and starts compacting the same prompt chunk again.
      // Idle compaction cancellation remains non-sticky so an explicit abort
      // does not suppress future idle maintenance.
      const shouldRecordFailure = !aborted || reason === "threshold";
      const failureState = shouldRecordFailure ? noteCompactionFailure(chatJid, compactionResult.errorMessage) : null;
      onEvent?.({
        type: "compaction_end",
        reason,
        result: undefined,
        aborted,
        willRetry: false,
        errorMessage: aborted
          ? (reason === "threshold" ? compactionResult.errorMessage : undefined)
          : `${reason === "idle" ? "Idle compaction failed" : "Pre-prompt compaction failed"}: ${compactionResult.errorMessage}`,
      } as AgentSessionEvent);
      if (failureState) {
        options.onWarn?.(
          reason === "idle"
            ? "Idle auto-compaction entered backoff for this chat"
            : "Pre-prompt auto-compaction entered backoff for this chat",
          {
            operation: reason === "idle"
              ? "schedule_idle_auto_compaction.backoff_recorded"
              : "maybe_auto_compact_session_before_prompt.backoff_recorded",
            chatJid,
            failureCount: failureState.failureCount,
            backoffUntil: failureState.backoffUntil,
            lastErrorMessage: failureState.lastErrorMessage,
            aborted,
          },
        );
      } else {
        options.onWarn?.(
          reason === "idle"
            ? "Idle auto-compaction cancelled without entering backoff"
            : "Pre-prompt auto-compaction cancelled without entering backoff",
          {
            operation: reason === "idle"
              ? "schedule_idle_auto_compaction.cancelled"
              : "maybe_auto_compact_session_before_prompt.cancelled",
            chatJid,
            lastErrorMessage: compactionResult.errorMessage,
            aborted,
          },
        );
      }
      throw new Error(compactionResult.errorMessage);
    }
    noteCompactionSuccess(session, chatJid, reason, {
      ...options,
      onEvent,
      countSuccess: true,
    });
    onEvent?.({
      type: "compaction_end",
      reason,
      result: undefined,
      aborted: false,
      willRetry: false,
    } as AgentSessionEvent);
  } catch (error) {
    options.onWarn?.(
      reason === "idle" ? "Idle auto-compaction skipped" : "Pre-prompt auto-compaction skipped",
      {
        operation: reason === "idle"
          ? "schedule_idle_auto_compaction"
          : "maybe_auto_compact_session_before_prompt",
        chatJid,
        error,
      },
    );
  }
}

export function cancelScheduledIdleAutoCompaction(chatJid: string): void {
  const pending = idleAutoCompactionTimers.get(chatJid);
  if (!pending) return;
  clearTimeout(pending);
  idleAutoCompactionTimers.delete(chatJid);
}

export function scheduleIdleAutoCompaction(
  session: AgentSession,
  chatJid: string,
  options: Pick<CompactionLifecycleOptions, "onInfo" | "onWarn">,
  onEvent?: (event: AgentSessionEvent) => void,
): void {
  cancelScheduledIdleAutoCompaction(chatJid);
  if (!getAutoCompactionContext(session, chatJid, options, "idle")) return;

  const delayMs = getIdleAutoCompactionDelayMs();
  const timer = setTimeout(() => {
    idleAutoCompactionTimers.delete(chatJid);
    void maybeAutoCompactSession(session, chatJid, options, onEvent, "idle");
  }, delayMs);
  idleAutoCompactionTimers.set(chatJid, timer);
}

export async function maybeAutoCompactSessionBeforePrompt(
  session: AgentSession,
  chatJid: string,
  options: Pick<CompactionLifecycleOptions, "onInfo" | "onWarn">,
  onEvent?: (event: AgentSessionEvent) => void,
  projectedAdditionalRawTokens = 0,
): Promise<void> {
  cancelScheduledIdleAutoCompaction(chatJid);
  await maybeAutoCompactSession(session, chatJid, options, onEvent, "threshold", projectedAdditionalRawTokens);
}

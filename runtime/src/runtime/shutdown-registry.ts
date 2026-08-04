/**
 * runtime/shutdown-registry.ts – Global shutdown handle for agent-initiated exits.
 *
 * bootstrapRuntime() registers the graceful shutdown handler here after
 * startup. The exit_process tool and /exit slash command call
 * requestGracefulShutdown() to trigger the same orderly teardown
 * (queue drain → session dispose → web stop → process.exit) that SIGINT uses.
 *
 * For agent-initiated exits (exit_process tool), the actual shutdown is
 * **deferred** until the current turn completes and is persisted/delivered.
 * Call markPendingShutdown() during a tool call, then
 * finalizePendingShutdownAfterTurn() from every channel's terminal turn path.
 * A bounded fallback prevents a missed channel finalizer from leaving the
 * runtime permanently stuck in the pending state.
 *
 * isPendingShutdown() returns true while the flag is set, so the run-agent
 * orchestrator can abort the session immediately after the exit_process tool
 * executes — preventing further tool calls in the same turn.
 */

import { createLogger } from "../utils/logger.js";

const log = createLogger("runtime.shutdown-registry");

type ShutdownFn = (signal: string) => Promise<void>;
type PreShutdownHook = () => void | Promise<void>;

const TURN_FINALIZATION_FLUSH_DELAY_MS = 1_500;
const PENDING_SHUTDOWN_FALLBACK_DELAY_MS = 15_000;

let registeredShutdown: ShutdownFn | null = null;
let pendingShutdownReason: string | null = null;
let pendingShutdownFallbackTimer: ReturnType<typeof setTimeout> | null = null;
const preShutdownHooks = new Set<PreShutdownHook>();
let preShutdownHooksRan = false;

function clearPendingShutdownFallback(): void {
  if (!pendingShutdownFallbackTimer) return;
  clearTimeout(pendingShutdownFallbackTimer);
  pendingShutdownFallbackTimer = null;
}

function unrefTimer(timer: ReturnType<typeof setTimeout>): void {
  const candidate = timer as ReturnType<typeof setTimeout> & { unref?: () => void };
  candidate.unref?.();
}

function hasTestExitScheduler(): boolean {
  return typeof (globalThis as { __PICLAW_EXIT_SCHEDULER__?: () => void }).__PICLAW_EXIT_SCHEDULER__ === "function";
}

/**
 * Register the graceful shutdown handler.
 * Called once by bootstrapRuntime() after all services are wired.
 */
export function registerShutdownHandler(handler: ShutdownFn): void {
  registeredShutdown = handler;
}

/**
 * Register a best-effort hook that runs immediately before graceful shutdown
 * begins. Used for cheap persistence cleanup such as clearing transient UI
 * state that should not survive a clean restart.
 */
export function registerPreShutdownHook(hook: PreShutdownHook): void {
  preShutdownHooks.add(hook);
}

export async function runPreShutdownHooksOnce(): Promise<void> {
  if (preShutdownHooksRan) return;
  preShutdownHooksRan = true;
  for (const hook of preShutdownHooks) {
    try {
      await hook();
    } catch (error) {
      log.warn("Pre-shutdown hook failed", {
        operation: "pre_shutdown_hook",
        err: error,
      });
    }
  }
}

/**
 * Request an immediate graceful shutdown of the entire runtime.
 *
 * Used by /exit slash command (which runs outside the agent turn).
 * For exit_process tool (mid-turn), use markPendingShutdown() instead.
 */
export function requestGracefulShutdown(reason: string, delayMs = 800): void {
  const testScheduler = (globalThis as { __PICLAW_EXIT_SCHEDULER__?: () => void }).__PICLAW_EXIT_SCHEDULER__;
  if (typeof testScheduler === "function") {
    testScheduler();
    return;
  }

  void runPreShutdownHooksOnce().finally(() => {
    if (registeredShutdown) {
      log.info("Graceful shutdown requested", { operation: "request", reason });
      void registeredShutdown(`exit_process: ${reason}`);
      return;
    }

    log.info("No runtime handler registered; scheduling process exit", {
      operation: "request_fallback",
      reason,
      delayMs,
    });
    setTimeout(() => process.exit(0), delayMs);
  });
}

/**
 * Mark that a graceful shutdown should happen after the current turn
 * completes and is persisted/delivered. Called by the exit_process tool.
 *
 * The optional fallback delay is exposed for focused tests; production callers
 * use the bounded default so a missed channel finalizer cannot stall forever.
 */
export function markPendingShutdown(
  reason: string,
  fallbackDelayMs = PENDING_SHUTDOWN_FALLBACK_DELAY_MS,
): void {
  clearPendingShutdownFallback();
  pendingShutdownReason = reason;

  const normalizedFallbackDelayMs = Number.isFinite(fallbackDelayMs)
    ? Math.max(0, fallbackDelayMs)
    : PENDING_SHUTDOWN_FALLBACK_DELAY_MS;
  pendingShutdownFallbackTimer = setTimeout(() => {
    pendingShutdownFallbackTimer = null;
    if (!pendingShutdownReason) return;
    log.warn("Pending shutdown fallback elapsed", {
      operation: "pending_fallback.elapsed",
      reason: pendingShutdownReason,
      fallbackDelayMs: normalizedFallbackDelayMs,
    });
    finalizePendingShutdown("fallback", 0);
  }, normalizedFallbackDelayMs);
  unrefTimer(pendingShutdownFallbackTimer);

  log.info("Pending shutdown marked", {
    operation: "mark_pending",
    reason,
    fallbackDelayMs: normalizedFallbackDelayMs,
  });
}

/**
 * Query whether a pending shutdown has been requested.
 * Used by the run-agent orchestrator to abort the session after
 * exit_process executes, preventing further tool calls.
 */
export function isPendingShutdown(): boolean {
  return pendingShutdownReason !== null;
}

function finalizePendingShutdown(source: string, delayMs: number): boolean {
  if (!pendingShutdownReason) return false;

  const reason = pendingShutdownReason;
  pendingShutdownReason = null;
  clearPendingShutdownFallback();
  log.info("Pending shutdown finalized", {
    operation: "finalize_pending",
    reason,
    source,
    delayMs,
  });

  // Existing shutdown tests install this hook to intercept process exit. Skip
  // real-time flush delays in that environment while preserving production
  // scheduling semantics.
  if (hasTestExitScheduler() || delayMs <= 0) {
    requestGracefulShutdown(reason);
    return true;
  }

  setTimeout(() => requestGracefulShutdown(reason), delayMs);
  return true;
}

/**
 * Complete a pending shutdown after a channel has persisted and delivered its
 * terminal turn outcome.
 *
 * The brief delay gives SSE transports time to flush final status and message
 * events before teardown. Non-web channels call the same function after their
 * outbound delivery has settled.
 */
export function finalizePendingShutdownAfterTurn(source = "turn-finalization"): boolean {
  return finalizePendingShutdown(source, TURN_FINALIZATION_FLUSH_DELAY_MS);
}

/**
 * Compatibility alias for older call sites. New channel finalizers should call
 * finalizePendingShutdownAfterTurn() directly.
 */
export function checkPendingShutdown(): void {
  finalizePendingShutdownAfterTurn("legacy-check");
}

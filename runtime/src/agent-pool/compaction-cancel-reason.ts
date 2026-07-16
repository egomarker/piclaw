/**
 * Side-channel for extension-requested compaction cancellations that are not
 * user aborts.
 *
 * Upstream AgentSession only lets `session_before_compact` handlers stop the
 * built-in compactor via `{ cancel: true }`, and then throws the generic
 * "Compaction cancelled" error. Piclaw needs the real reason so managed
 * wrappers can record backoff/emergency-rotate instead of treating safety
 * failures like user interrupts.
 */

import { getActivePiclawCompactionTrigger } from "./compaction-trigger-context.js";

type CancellationReason = {
  message: string;
  atMs: number;
};

const UNSCOPED_GENERATION = "unscoped";
const MAX_REASON_AGE_MS = 10 * 60_000;
const reasonsBySessionManager = new WeakMap<object, Map<string, CancellationReason>>();

function pruneStaleReasons(
  reasons: Map<string, CancellationReason>,
  nowMs = Date.now(),
  maxAgeMs = MAX_REASON_AGE_MS,
): void {
  for (const [generationId, reason] of reasons) {
    if (nowMs - reason.atMs > maxAgeMs) reasons.delete(generationId);
  }
}

export function recordCompactionCancellationReason(sessionManager: unknown, message: string): void {
  if (!sessionManager || (typeof sessionManager !== "object" && typeof sessionManager !== "function")) return;
  const trimmed = message.trim();
  if (!trimmed) return;
  const key = sessionManager as object;
  const generationId = getActivePiclawCompactionTrigger()?.generationId ?? UNSCOPED_GENERATION;
  const reasons = reasonsBySessionManager.get(key) ?? new Map<string, CancellationReason>();
  pruneStaleReasons(reasons);
  reasons.set(generationId, { message: trimmed, atMs: Date.now() });
  reasonsBySessionManager.set(key, reasons);
}

export function consumeCompactionCancellationReason(
  session: { sessionManager?: unknown },
  maxAgeMs = MAX_REASON_AGE_MS,
  generationId?: string,
): string | null {
  const sessionManager = session.sessionManager;
  if (!sessionManager || (typeof sessionManager !== "object" && typeof sessionManager !== "function")) return null;
  const key = sessionManager as object;
  const reasons = reasonsBySessionManager.get(key);
  if (!reasons || reasons.size === 0) return null;

  const nowMs = Date.now();
  pruneStaleReasons(reasons, nowMs, maxAgeMs);
  // Managed compactions consume only their exact generation. An unscoped
  // direct caller must not leak its reason into a later managed generation.
  const selectedGeneration = generationId
    ? (reasons.has(generationId) ? generationId : null)
    : reasons.has(UNSCOPED_GENERATION)
      ? UNSCOPED_GENERATION
      : [...reasons.entries()].sort((a, b) => b[1].atMs - a[1].atMs)[0]?.[0] ?? null;
  if (!selectedGeneration) {
    if (reasons.size === 0) reasonsBySessionManager.delete(key);
    return null;
  }

  const reason = reasons.get(selectedGeneration);
  if (!reason) return null;
  reasons.delete(selectedGeneration);
  if (reasons.size === 0) reasonsBySessionManager.delete(key);
  if (nowMs - reason.atMs > maxAgeMs) return null;
  return reason.message;
}

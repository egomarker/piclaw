const DEFAULT_POLL_TIMEOUT_SECONDS = 30;
const MIN_POLL_TIMEOUT_SECONDS = 5;
const MAX_POLL_TIMEOUT_SECONDS = 120;

export function resolveTelegramLongPollTimeoutSeconds(value: unknown): number {
  const parsed = typeof value === "number"
    ? value
    : Number.parseInt(String(value || "").trim(), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_POLL_TIMEOUT_SECONDS;
  return Math.max(MIN_POLL_TIMEOUT_SECONDS, Math.min(MAX_POLL_TIMEOUT_SECONDS, Math.trunc(parsed)));
}

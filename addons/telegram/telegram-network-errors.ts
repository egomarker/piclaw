const RECOVERABLE_TELEGRAM_ERROR_FRAGMENTS = [
  "fetch",
  "network",
  "timed out",
  "timeout",
  "econnreset",
  "ecanceled",
  "temporarily unavailable",
  "socket",
  "bad gateway",
  "gateway timeout",
  "service unavailable",
  "too many requests",
  "failed: 429",
  "failed: 500",
  "failed: 502",
  "failed: 503",
  "failed: 504",
];

export function isRecoverableTelegramNetworkError(error: unknown): boolean {
  const message = String((error as { message?: unknown } | null | undefined)?.message ?? error ?? "").toLowerCase();
  if ((error as { name?: unknown } | null | undefined)?.name === "AbortError") return true;
  return RECOVERABLE_TELEGRAM_ERROR_FRAGMENTS.some((fragment) => message.includes(fragment));
}

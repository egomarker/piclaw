export function isRecoverableTelegramNetworkError(error: unknown): boolean {
  const message = String((error as { message?: unknown } | null | undefined)?.message ?? error ?? "").toLowerCase();
  if ((error as { name?: unknown } | null | undefined)?.name === "AbortError") return true;
  return [
    "fetch",
    "network",
    "timed out",
    "timeout",
    "econnreset",
    "ecanceled",
    "temporarily unavailable",
    "socket",
  ].some((fragment) => message.includes(fragment));
}

const FATAL_TELEGRAM_ERROR_FRAGMENTS = [
  "unauthorized",
  "invalid token",
  "bot token is not configured",
];

const FATAL_TELEGRAM_ERROR_PATTERNS = [
  /telegram\s+(getme|getupdates)\s+failed:\s*401\b/i,
];

function collectTelegramErrorText(error: unknown, seen = new Set<unknown>()): string[] {
  if (error === null || error === undefined || seen.has(error)) return [];
  seen.add(error);

  if (typeof error === "string") {
    return error.trim() ? [error.trim()] : [];
  }

  if (typeof error === "number" || typeof error === "boolean" || typeof error === "bigint") {
    return [String(error)];
  }

  if (typeof error !== "object") {
    return [];
  }

  const record = error as Record<string, unknown>;
  const parts: string[] = [];
  for (const key of ["message", "name", "code", "type", "errno", "status", "statusCode"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      parts.push(value.trim());
    } else if (typeof value === "number" && Number.isFinite(value)) {
      parts.push(String(value));
    }
  }

  if (record.cause !== undefined) {
    parts.push(...collectTelegramErrorText(record.cause, seen));
  }

  return parts;
}

function getTelegramErrorText(error: unknown): string {
  return collectTelegramErrorText(error).join(" ").trim().toLowerCase();
}

export function isFatalTelegramError(error: unknown): boolean {
  if ((error as { name?: unknown } | null | undefined)?.name === "AbortError") return false;

  const message = getTelegramErrorText(error);
  if (!message) return false;

  return FATAL_TELEGRAM_ERROR_FRAGMENTS.some((fragment) => message.includes(fragment))
    || FATAL_TELEGRAM_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

export function isRecoverableTelegramNetworkError(error: unknown): boolean {
  return !isFatalTelegramError(error);
}

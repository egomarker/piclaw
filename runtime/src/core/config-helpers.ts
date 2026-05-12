/**
 * core/config-helpers.ts – Config value extraction helpers and timing constants.
 *
 * Pure utility functions for extracting typed values from config objects.
 * Extracted from config.ts to keep the main config module under 800 lines.
 */

// ---------------------------------------------------------------------------
// Helpers for extracting typed values from a config object.
// ---------------------------------------------------------------------------

/** Return the first non-empty string value found under the given keys. */
export function pickString(config: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = config[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

/** Return the first finite numeric value found under the given keys (strings are parsed). */
export function pickNumber(config: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = config[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

/** Return the first boolean-like value found under the given keys. */
export function pickBoolean(config: Record<string, unknown>, keys: string[]): boolean | undefined {
  for (const key of keys) {
    const value = config[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string" && value.trim()) {
      const raw = value.trim().toLowerCase();
      if (["1", "true", "yes", "on"].includes(raw)) return true;
      if (["0", "false", "no", "off"].includes(raw)) return false;
    }
  }
  return undefined;
}

/** Return the first string-list value found under the given keys. */
export function pickStringArray(config: Record<string, unknown>, keys: string[]): string[] | undefined {
  for (const key of keys) {
    const value = config[key];
    if (Array.isArray(value)) {
      const items = value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);
      if (items.length > 0) return items;
      continue;
    }
    if (typeof value === "string" && value.trim()) {
      const items = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      if (items.length > 0) return items;
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Timing constants used by the runtime message loop and scheduler.
// ---------------------------------------------------------------------------

/** Typed runtime timing settings grouped for bootstrap, IPC, and scheduler wiring. */
export interface RuntimeTimingConfig {
  pollIntervalMs: number;
  schedulerPollIntervalMs: number;
  ipcPollIntervalMs: number;
  timezone: string;
}

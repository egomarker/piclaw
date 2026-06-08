/**
 * utils/log-layout.ts – Date-sharded plain-log filesystem helpers.
 *
 * Piclaw writes several plain-text log-like artifacts. Keep new files below
 * YYYY-MM/DD directories so no single directory grows without bound, and cap
 * default retention windows at 30 days.
 */

import { rmdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export const DAY_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_LOG_RETENTION_CAP_MS = 30 * DAY_MS;

export function clampLogRetentionMs(
  valueMs: number | null | undefined,
  fallbackMs: number,
  capMs = DEFAULT_LOG_RETENTION_CAP_MS,
): number {
  const fallback = Math.max(1, Math.min(fallbackMs, capMs));
  const value = Number(valueMs);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.max(1, Math.min(Math.round(value), capMs));
}

export function coerceLogDate(value?: string | Date | number | null): Date {
  const date = value instanceof Date ? value : value == null ? new Date() : new Date(value);
  if (Number.isFinite(date.getTime())) return date;
  return new Date();
}

export function formatLogTimestampForFilename(value?: string | Date | number | null): string {
  return coerceLogDate(value).toISOString().replace(/[:.]/g, "-");
}

export function getDateShardParts(value?: string | Date | number | null): { month: string; day: string } {
  const iso = coerceLogDate(value).toISOString();
  return {
    month: iso.slice(0, 7),
    day: iso.slice(8, 10),
  };
}

export function getDateShardDir(rootDir: string, value?: string | Date | number | null): string {
  const { month, day } = getDateShardParts(value);
  return join(rootDir, month, day);
}

export function getDateShardedPath(rootDir: string, filename: string, value?: string | Date | number | null): string {
  return join(getDateShardDir(rootDir, value), filename);
}

export function cleanupEmptyParentDirs(rootDir: string, startDir: string): void {
  const root = resolve(rootDir);
  let current = resolve(startDir);

  while (current.startsWith(`${root}/`) && current !== root) {
    try {
      rmdirSync(current);
    } catch {
      break;
    }
    current = dirname(current);
  }
}

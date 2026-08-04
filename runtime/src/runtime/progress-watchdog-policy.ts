/** Fixed internal progress-watchdog scheduling and hard-abort policy. */

export const PROGRESS_WATCHDOG_SCAN_INTERVAL_MS = 20_000;
export const PROGRESS_WATCHDOG_HARD_ABORT_DELAY_MS = 60_000;

export function getProgressWatchdogHardTimeoutMs(timeoutMs: number): number {
  return timeoutMs > 0 ? timeoutMs + PROGRESS_WATCHDOG_HARD_ABORT_DELAY_MS : timeoutMs;
}

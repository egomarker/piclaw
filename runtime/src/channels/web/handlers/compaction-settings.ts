import {
  clearChatCompactionBackoff,
  getAllChatCompactionBackoffs,
} from "../../../db.js";
import {
  getCompactionRuntimeConfig,
  getToolResultCompactionEnabled,
  getToolResultCompactionTools,
  getToolResultSemanticSummaryConfig,
  setCompactionRuntimeConfig,
  setToolResultCompactionEnabled,
  setToolResultCompactionTools,
  setToolResultSemanticSummaryConfig,
} from "../../../core/config.js";
import { getTrackedPhasesSnapshot } from "../../../runtime/progress-watchdog.js";
import {
  startExternalProgressWatchdogMonitor,
  stopExternalProgressWatchdogMonitor,
} from "../../../runtime/progress-watchdog-supervisor.js";

export interface CompactionSettingsData {
  compactionTimeoutSec: number;
  compactionBackoffBaseMin: number;
  compactionBackoffMaxMin: number;
  compactionThresholdPercent: number;
  compactionBackoffDecayFactor: number;
  progressWatchdogEnabled: boolean;
  progressWatchdogTimeoutSec: number;
  toolResultCompactionEnabled: boolean;
  toolResultCompactionTools: string[];
  toolResultSemanticSummaryEnabled: boolean;
  toolResultSemanticSummaryMaxInputChars: number;
  toolResultSemanticSummaryMaxTokens: number;
  toolResultSemanticSummaryTimeoutSec: number;
  compactionBackoffs: Array<{
    chatJid: string;
    failureCount: number;
    lastFailedAt: string;
    backoffUntil: string;
    lastErrorMessage: string | null;
  }>;
  progressWatchdogPhases: Array<{
    chatJid: string;
    phase: string;
    startedAt: string;
    lastProgressAt: string;
    metadata?: Record<string, unknown>;
  }>;
}

export interface CompactionSettingsInput {
  compactionTimeoutSec?: unknown;
  compactionBackoffBaseMin?: unknown;
  compactionBackoffMaxMin?: unknown;
  compactionThresholdPercent?: unknown;
  compactionBackoffDecayFactor?: unknown;
  progressWatchdogEnabled?: unknown;
  progressWatchdogTimeoutSec?: unknown;
  toolResultCompactionEnabled?: unknown;
  toolResultCompactionTools?: unknown;
  toolResultSemanticSummaryEnabled?: unknown;
  toolResultSemanticSummaryMaxInputChars?: unknown;
  toolResultSemanticSummaryMaxTokens?: unknown;
  toolResultSemanticSummaryTimeoutSec?: unknown;
}

function normalizeOptionalInt(value: unknown, min: number, max: number): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function normalizeOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function normalizeOptionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function getCompactionSettingsData(): CompactionSettingsData {
  const config = getCompactionRuntimeConfig();
  const summaryConfig = getToolResultSemanticSummaryConfig();
  const now = Date.now();
  return {
    compactionTimeoutSec: Math.max(1, Math.round(config.timeoutMs / 1000)),
    compactionBackoffBaseMin: Math.max(1, Math.round(config.backoffBaseMs / 60_000)),
    compactionBackoffMaxMin: Math.max(1, Math.round(config.backoffMaxMs / 60_000)),
    compactionThresholdPercent: config.thresholdPercent,
    compactionBackoffDecayFactor: config.backoffDecayFactor,
    progressWatchdogEnabled: config.progressWatchdogEnabled,
    progressWatchdogTimeoutSec: Math.max(0, Math.round(config.progressWatchdogTimeoutMs / 1000)),
    toolResultCompactionEnabled: getToolResultCompactionEnabled(),
    toolResultCompactionTools: [...getToolResultCompactionTools()],
    toolResultSemanticSummaryEnabled: summaryConfig.enabled,
    toolResultSemanticSummaryMaxInputChars: summaryConfig.maxInputChars,
    toolResultSemanticSummaryMaxTokens: summaryConfig.maxTokens,
    toolResultSemanticSummaryTimeoutSec: Math.max(1, Math.round(summaryConfig.timeoutMs / 1000)),
    compactionBackoffs: getAllChatCompactionBackoffs()
      .filter((entry) => {
        const untilMs = Date.parse(entry.backoffUntil);
        return Number.isFinite(untilMs) && untilMs > now;
      })
      .sort((left, right) => Date.parse(left.backoffUntil) - Date.parse(right.backoffUntil))
      .map((entry) => ({
        chatJid: entry.chatJid,
        failureCount: entry.failureCount,
        lastFailedAt: entry.lastFailedAt,
        backoffUntil: entry.backoffUntil,
        lastErrorMessage: entry.lastErrorMessage,
      })),
    progressWatchdogPhases: getTrackedPhasesSnapshot()
      .sort((left, right) => left.chatJid.localeCompare(right.chatJid) || left.startedAt - right.startedAt)
      .map((entry) => ({
        chatJid: entry.chatJid,
        phase: entry.phase,
        startedAt: new Date(entry.startedAt).toISOString(),
        lastProgressAt: new Date(entry.lastProgressAt).toISOString(),
        metadata: entry.metadata,
      })),
  };
}

export async function saveCompactionSettings(input: CompactionSettingsInput): Promise<CompactionSettingsData> {
  const patch: {
    timeoutMs?: number;
    backoffBaseMs?: number;
    backoffMaxMs?: number;
    progressWatchdogEnabled?: boolean;
    progressWatchdogTimeoutMs?: number;
    thresholdPercent?: number;
    backoffDecayFactor?: number;
  } = {};

  const nextTimeoutSec = normalizeOptionalInt(input.compactionTimeoutSec, 1, 3600);
  if (nextTimeoutSec !== undefined) {
    patch.timeoutMs = nextTimeoutSec * 1000;
  }

  const nextBackoffBaseMin = normalizeOptionalInt(input.compactionBackoffBaseMin, 1, 24 * 60);
  if (nextBackoffBaseMin !== undefined) {
    patch.backoffBaseMs = nextBackoffBaseMin * 60_000;
  }

  const nextBackoffMaxMin = normalizeOptionalInt(input.compactionBackoffMaxMin, 1, 7 * 24 * 60);
  if (nextBackoffMaxMin !== undefined) {
    patch.backoffMaxMs = nextBackoffMaxMin * 60_000;
  }

  const nextProgressWatchdogEnabled = normalizeOptionalBoolean(input.progressWatchdogEnabled);
  if (nextProgressWatchdogEnabled !== undefined) {
    patch.progressWatchdogEnabled = nextProgressWatchdogEnabled;
  }

  const nextProgressWatchdogTimeoutSec = normalizeOptionalInt(input.progressWatchdogTimeoutSec, 0, 3600);
  if (nextProgressWatchdogTimeoutSec !== undefined) {
    patch.progressWatchdogTimeoutMs = nextProgressWatchdogTimeoutSec * 1000;
  }

  const nextThreshold = normalizeOptionalInt(input.compactionThresholdPercent, 10, 95);
  if (nextThreshold !== undefined) {
    patch.thresholdPercent = nextThreshold;
  }

  const nextDecay = typeof input.compactionBackoffDecayFactor === "number"
    ? Math.min(1, Math.max(0.1, input.compactionBackoffDecayFactor))
    : undefined;
  if (nextDecay !== undefined) {
    patch.backoffDecayFactor = nextDecay;
  }

  const nextToolResultCompactionEnabled = normalizeOptionalBoolean(input.toolResultCompactionEnabled);
  const nextToolResultCompactionTools = normalizeOptionalStringArray(input.toolResultCompactionTools);
  const nextToolResultSemanticSummaryEnabled = normalizeOptionalBoolean(input.toolResultSemanticSummaryEnabled);
  const nextToolResultSemanticSummaryMaxInputChars = normalizeOptionalInt(input.toolResultSemanticSummaryMaxInputChars, 500, 200_000);
  const nextToolResultSemanticSummaryMaxTokens = normalizeOptionalInt(input.toolResultSemanticSummaryMaxTokens, 64, 4_096);
  const nextToolResultSemanticSummaryTimeoutSec = normalizeOptionalInt(input.toolResultSemanticSummaryTimeoutSec, 1, 300);

  if (Object.keys(patch).length > 0) {
    const saved = setCompactionRuntimeConfig(patch);
    if (saved.progressWatchdogEnabled) {
      startExternalProgressWatchdogMonitor();
    } else {
      await stopExternalProgressWatchdogMonitor();
    }
  }

  if (nextToolResultCompactionEnabled !== undefined) {
    setToolResultCompactionEnabled(nextToolResultCompactionEnabled);
  }

  if (nextToolResultCompactionTools !== undefined) {
    setToolResultCompactionTools(nextToolResultCompactionTools);
  }

  if (
    nextToolResultSemanticSummaryEnabled !== undefined
    || nextToolResultSemanticSummaryMaxInputChars !== undefined
    || nextToolResultSemanticSummaryMaxTokens !== undefined
    || nextToolResultSemanticSummaryTimeoutSec !== undefined
  ) {
    setToolResultSemanticSummaryConfig({
      ...(nextToolResultSemanticSummaryEnabled !== undefined ? { enabled: nextToolResultSemanticSummaryEnabled } : {}),
      ...(nextToolResultSemanticSummaryMaxInputChars !== undefined ? { maxInputChars: nextToolResultSemanticSummaryMaxInputChars } : {}),
      ...(nextToolResultSemanticSummaryMaxTokens !== undefined ? { maxTokens: nextToolResultSemanticSummaryMaxTokens } : {}),
      ...(nextToolResultSemanticSummaryTimeoutSec !== undefined ? { timeoutMs: nextToolResultSemanticSummaryTimeoutSec * 1000 } : {}),
    });
  }

  return getCompactionSettingsData();
}

export function resetCompactionBackoff(chatJid: string): CompactionSettingsData {
  clearChatCompactionBackoff(chatJid);
  return getCompactionSettingsData();
}

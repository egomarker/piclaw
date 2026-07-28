/** Logging, retention, and notification integration configuration. */

import { pickNumber, pickString } from "./config-helpers.js";
import { envConfig, getDomainConfigOptions, pushoverConfig } from "./config-context.js";
import { integerField, readDomainConfig, registerDomainConfig, stringField, type DomainConfigField } from "./domain-config.js";
import { createLogger } from "../utils/logger.js";
import { parseLogLevel, setConfiguredLogLevelFallback, type LogLevel } from "../utils/log-level.js";
import { DAY_MS, DEFAULT_LOG_RETENTION_CAP_MS } from "../utils/log-layout.js";
import { parsePositiveIntStrict } from "../utils/strict-int.js";

const log = createLogger("core.config");
function warnDeprecatedEnv(oldName: string, newName: string): void {
  const oldValue = process.env[oldName] ?? envConfig[oldName];
  const newValue = process.env[newName] ?? envConfig[newName];
  if (oldValue && !newValue) {
    log.warn("Deprecated environment variable is set", {
      operation: "core_config.warn_deprecated_env",
      oldName,
      newName,
    });
  }
}
warnDeprecatedEnv("LOG_LEVEL", "PICLAW_LOG_LEVEL");

export interface LoggingConfig { level: LogLevel; }
export interface RetentionCleanupConfig { retentionMs: number; cleanupIntervalMs: number; }
export type AgentLogConfig = RetentionCleanupConfig;
type LoggingDomainConfig = LoggingConfig & RetentionCleanupConfig;

function parsePositiveInteger(value: string | undefined): number | undefined {
  const parsed = parsePositiveIntStrict(value, 0);
  return parsed > 0 ? parsed : undefined;
}

const DEFAULT_RETENTION_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const agentLogDomainSchema = registerDomainConfig<LoggingDomainConfig>({
  domain: "logging",
  fields: {
    level: {
      ...stringField({ key: "level", owner: "core", defaultValue: "info", allowedValues: ["debug", "info", "warn", "error"], persistence: "json-config", precedence: ["compat-env", "persisted", "default"], secretClass: "none", compatibilityEnv: [
        { envKey: "PICLAW_LOG_LEVEL", replacement: "domains.logging.level", removalVersion: "3.0.0", parse: (raw) => parseLogLevel(raw) },
        { envKey: "LOG_LEVEL", replacement: "domains.logging.level", removalVersion: "3.0.0", parse: (raw) => parseLogLevel(raw) },
      ] }),
      validate: (value: unknown) => parseLogLevel(value),
    } as DomainConfigField<LogLevel>,
    retentionMs: integerField({ key: "retentionMs", owner: "agent-runtime", defaultValue: DEFAULT_LOG_RETENTION_CAP_MS, min: 1, max: DEFAULT_LOG_RETENTION_CAP_MS, bounds: `1..${DEFAULT_LOG_RETENTION_CAP_MS} ms`, persistence: "json-config", precedence: ["compat-env", "persisted", "default"], secretClass: "none", compatibilityEnv: [
      { envKey: "PICLAW_AGENT_LOG_RETENTION_MS", replacement: "domains.logging.retentionMs", removalVersion: "3.0.0", parse: (raw) => { const value = parsePositiveInteger(raw); return value === undefined ? undefined : Math.min(DEFAULT_LOG_RETENTION_CAP_MS, value); }, skipInvalid: true },
      { envKey: "PICLAW_AGENT_LOG_RETENTION_DAYS", replacement: "domains.logging.retentionMs", removalVersion: "3.0.0", parse: (raw) => { const days = parsePositiveInteger(raw); return days === undefined ? undefined : Math.min(DEFAULT_LOG_RETENTION_CAP_MS, days * DAY_MS); }, skipInvalid: true },
    ] }),
    cleanupIntervalMs: integerField({ key: "cleanupIntervalMs", owner: "agent-runtime", defaultValue: DEFAULT_RETENTION_CLEANUP_INTERVAL_MS, min: 1, bounds: "positive integer ms", persistence: "json-config", precedence: ["compat-env", "persisted", "default"], secretClass: "none", compatibilityEnv: [{ envKey: "PICLAW_AGENT_LOG_CLEANUP_INTERVAL_MS", replacement: "domains.logging.cleanupIntervalMs", removalVersion: "3.0.0", parse: (raw) => parsePositiveInteger(raw), skipInvalid: true }] }),
  },
});

const LOGGING_DOMAIN_CONFIG = readDomainConfig(agentLogDomainSchema, getDomainConfigOptions());
export const LOGGING_CONFIG = Object.freeze<LoggingConfig>({ level: LOGGING_DOMAIN_CONFIG.level });
setConfiguredLogLevelFallback(LOGGING_CONFIG.level);
export function getLoggingConfig(): Readonly<LoggingConfig> { return LOGGING_CONFIG; }
export const AGENT_LOG_CONFIG = Object.freeze<AgentLogConfig>({ retentionMs: LOGGING_DOMAIN_CONFIG.retentionMs, cleanupIntervalMs: LOGGING_DOMAIN_CONFIG.cleanupIntervalMs });
export function getAgentLogConfig(): Readonly<AgentLogConfig> { return AGENT_LOG_CONFIG; }

const configAppToken = pickString(pushoverConfig, ["appToken", "app_token", "PUSHOVER_APP_TOKEN"]);
const configUserKey = pickString(pushoverConfig, ["userKey", "user_key", "PUSHOVER_USER_KEY"]);
const configDevice = pickString(pushoverConfig, ["device", "PUSHOVER_DEVICE"]);
const configSound = pickString(pushoverConfig, ["sound", "PUSHOVER_SOUND"]);
const configPriority = pickNumber(pushoverConfig, ["priority", "PUSHOVER_PRIORITY"]);

export interface PushoverConfig { appToken: string; userKey: string; device: string; priority: number; sound: string; }
export const PUSHOVER_CONFIG = Object.freeze<PushoverConfig>({
  appToken: process.env.PUSHOVER_APP_TOKEN || envConfig.PUSHOVER_APP_TOKEN || configAppToken || "",
  userKey: process.env.PUSHOVER_USER_KEY || envConfig.PUSHOVER_USER_KEY || configUserKey || "",
  device: process.env.PUSHOVER_DEVICE || envConfig.PUSHOVER_DEVICE || configDevice || "",
  priority: parseInt(process.env.PUSHOVER_PRIORITY || envConfig.PUSHOVER_PRIORITY || (configPriority !== undefined ? String(configPriority) : "0"), 10),
  sound: process.env.PUSHOVER_SOUND || envConfig.PUSHOVER_SOUND || configSound || "",
});
export function getPushoverConfig(): Readonly<PushoverConfig> { return PUSHOVER_CONFIG; }

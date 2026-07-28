import { readEnvFile, readMergedEnvValue } from "../core/env.js";

export type LogLevel = "debug" | "info" | "warn" | "error";

const DEFAULT_LOG_LEVEL: LogLevel = "info";
const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};
const envConfig = readEnvFile(["PICLAW_LOG_LEVEL", "LOG_LEVEL"]);
let configuredFallback: LogLevel = DEFAULT_LOG_LEVEL;

export function parseLogLevel(value: unknown, fallback: LogLevel = DEFAULT_LOG_LEVEL): LogLevel {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "debug" || normalized === "info" || normalized === "warn" || normalized === "error") {
    return normalized;
  }
  return fallback;
}

export function setConfiguredLogLevelFallback(level: LogLevel): void {
  configuredFallback = level;
}

export function getConfiguredLogLevel(fallback: LogLevel = configuredFallback): LogLevel {
  return parseLogLevel(
    readMergedEnvValue("PICLAW_LOG_LEVEL", envConfig) ?? readMergedEnvValue("LOG_LEVEL", envConfig),
    fallback,
  );
}

export function shouldLog(level: LogLevel, configuredLevel: LogLevel): boolean {
  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[configuredLevel];
}

import { join } from "node:path";

import { readStoredCredential, type ModelRuntime } from "@earendil-works/pi-coding-agent";

import { getPiclawAgentDir } from "../core/agent-dir.js";
import { createLogger, debugSuppressedError } from "../utils/logger.js";

export interface ProviderUsageWindow {
  label: string;
  used_percent: number | null;
  remaining_percent: number | null;
  window_minutes: number | null;
  resets_at: string | null;
  reset_description: string | null;
}

export interface ProviderUsageSnapshot {
  provider: "openai-codex" | "github-copilot" | "zai";
  source: string;
  plan: string | null;
  fetched_at: string;
  primary: ProviderUsageWindow | null;
  secondary: ProviderUsageWindow | null;
  credits_remaining: number | null;
  credits_unlimited: boolean;
  hint_short: string;
}

type CachedUsage = { expiresAt: number; value: ProviderUsageSnapshot | null };
type SupportedProviderId = ProviderUsageSnapshot["provider"];
type UsageModelRuntime = Pick<ModelRuntime, "getAuth">;

const USAGE_CACHE_TTL_MS = Number(process.env.PICLAW_PROVIDER_USAGE_TTL_MS || "60000");
const usageCache = new Map<string, CachedUsage>();
const usageRefreshInFlight = new Map<string, Promise<ProviderUsageSnapshot | null>>();
const log = createLogger("agent-pool.provider-usage");

function clampPercent(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : null;
}

function parseDate(value: unknown): Date | null {
  if (typeof value === "number" && Number.isFinite(value)) return new Date(value * 1000);
  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function formatResetDescription(date: Date | null): string | null {
  if (!date) return null;
  const deltaMs = date.getTime() - Date.now();
  if (!Number.isFinite(deltaMs)) return null;
  if (deltaMs <= 0) return "resets soon";
  const totalMinutes = Math.max(1, Math.round(deltaMs / 60000));
  if (totalMinutes < 60) return `resets in ~${totalMinutes}m`;
  const totalHours = Math.floor(totalMinutes / 60);
  if (totalHours < 24) {
    const mins = totalMinutes % 60;
    return mins > 0 ? `resets in ~${totalHours}h ${mins}m` : `resets in ~${totalHours}h`;
  }
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return `resets in ~${days}d ${hours}h`;
}

function makeWindow(label: string, usedInput: unknown, resetInput: unknown, windowMinutes: number | null): ProviderUsageWindow | null {
  const used = clampPercent(usedInput);
  if (used == null) return null;
  const resetDate = parseDate(resetInput);
  return {
    label,
    used_percent: used,
    remaining_percent: clampPercent(100 - used),
    window_minutes: windowMinutes,
    resets_at: resetDate?.toISOString() ?? null,
    reset_description: formatResetDescription(resetDate),
  };
}

function compactPercent(value: number | null): string | null {
  return value == null ? null : `${Math.round(value)}%`;
}

function buildCodexHint(primary: ProviderUsageWindow | null, secondary: ProviderUsageWindow | null, credits: number | null, unlimited: boolean): string {
  const parts: string[] = [];
  const p1 = compactPercent(primary?.remaining_percent ?? null);
  const p2 = compactPercent(secondary?.remaining_percent ?? null);
  if (p1) parts.push(`5h ${p1}`);
  if (p2) parts.push(`wk ${p2}`);
  if (unlimited) parts.push("credits ∞");
  else if (credits != null && Number.isFinite(credits)) parts.push(`credits ${credits.toFixed(credits >= 100 ? 0 : 1).replace(/\.0$/, "")}`);
  return parts.join(" • ");
}

function buildCopilotHint(primary: ProviderUsageWindow | null, secondary: ProviderUsageWindow | null): string {
  return [
    primary?.remaining_percent != null ? `premium ${compactPercent(primary.remaining_percent)}` : null,
    secondary?.remaining_percent != null ? `chat ${compactPercent(secondary.remaining_percent)}` : null,
  ].filter(Boolean).join(" • ");
}

function buildZaiHint(primary: ProviderUsageWindow | null, secondary: ProviderUsageWindow | null): string {
  return [
    primary?.remaining_percent != null ? `5h ${compactPercent(primary.remaining_percent)}` : null,
    secondary?.remaining_percent != null ? `tools ${compactPercent(secondary.remaining_percent)}` : null,
  ].filter(Boolean).join(" • ");
}

async function fetchCodexUsage(modelRuntime: UsageModelRuntime, authPath: string): Promise<ProviderUsageSnapshot | null> {
  const resolved = await modelRuntime.getAuth("openai-codex");
  const stored = readStoredCredential("openai-codex", authPath) as { accountId?: unknown } | undefined;
  const token = resolved?.auth.apiKey;
  const accountId = typeof stored?.accountId === "string" ? stored.accountId : null;
  if (!token || !accountId) return null;
  const res = await fetch("https://chatgpt.com/backend-api/wham/usage", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "ChatGPT-Account-Id": accountId, "User-Agent": "PiClaw" },
  });
  if (!res.ok) return null;
  const payload = (await res.json()) as any;
  const primary = makeWindow("5h", payload?.rate_limit?.primary_window?.used_percent, payload?.rate_limit?.primary_window?.reset_at, Number.isFinite(payload?.rate_limit?.primary_window?.limit_window_seconds) ? Math.round(payload.rate_limit.primary_window.limit_window_seconds / 60) : 300);
  const secondary = makeWindow("week", payload?.rate_limit?.secondary_window?.used_percent, payload?.rate_limit?.secondary_window?.reset_at, Number.isFinite(payload?.rate_limit?.secondary_window?.limit_window_seconds) ? Math.round(payload.rate_limit.secondary_window.limit_window_seconds / 60) : null);
  const credits = payload?.credits?.balance != null ? Number(payload.credits.balance) : null;
  const unlimited = Boolean(payload?.credits?.unlimited);
  return { provider: "openai-codex", source: "chatgpt-usage-api", plan: typeof payload?.plan_type === "string" ? payload.plan_type : null, fetched_at: new Date().toISOString(), primary, secondary, credits_remaining: Number.isFinite(credits) ? credits : null, credits_unlimited: unlimited, hint_short: buildCodexHint(primary, secondary, Number.isFinite(credits) ? credits : null, unlimited) };
}

async function fetchGitHubCopilotUsage(modelRuntime: UsageModelRuntime, authPath: string): Promise<ProviderUsageSnapshot | null> {
  const resolved = await modelRuntime.getAuth("github-copilot"); // canonical refresh/serialization owner
  if (!resolved) return null;
  const stored = readStoredCredential("github-copilot", authPath) as { refresh?: unknown } | undefined;
  const githubToken = typeof stored?.refresh === "string" ? stored.refresh : null;
  if (!githubToken) return null;
  const res = await fetch("https://api.github.com/copilot_internal/user", {
    headers: { Authorization: `token ${githubToken}`, Accept: "application/json", "Editor-Version": "vscode/1.96.2", "Editor-Plugin-Version": "copilot-chat/0.26.7", "User-Agent": "GitHubCopilotChat/0.26.7", "X-Github-Api-Version": "2025-04-01" },
  });
  if (!res.ok) return null;
  const payload = (await res.json()) as any;
  const reset = parseDate(payload?.quota_reset_date);
  const window = (label: string, value: any): ProviderUsageWindow | null => value ? {
    label,
    used_percent: clampPercent(100 - Number(value.percent_remaining ?? value.remaining / value.entitlement * 100)),
    remaining_percent: clampPercent(value.percent_remaining ?? value.remaining / value.entitlement * 100),
    window_minutes: null,
    resets_at: reset?.toISOString() ?? null,
    reset_description: formatResetDescription(reset),
  } : null;
  const primary = window("premium", payload?.quota_snapshots?.premium_interactions);
  const secondary = window("chat", payload?.quota_snapshots?.chat);
  return { provider: "github-copilot", source: "github-copilot-internal-api", plan: typeof payload?.copilot_plan === "string" ? payload.copilot_plan : null, fetched_at: new Date().toISOString(), primary, secondary, credits_remaining: null, credits_unlimited: false, hint_short: buildCopilotHint(primary, secondary) };
}

async function fetchZaiUsage(modelRuntime: UsageModelRuntime): Promise<ProviderUsageSnapshot | null> {
  const token = (await modelRuntime.getAuth("zai"))?.auth.apiKey;
  if (!token) return null;
  const res = await fetch("https://api.z.ai/api/monitor/usage/quota/limit", { headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "User-Agent": "PiClaw" } });
  if (!res.ok) return null;
  const payload = (await res.json()) as any;
  const limits = Array.isArray(payload?.data?.limits) ? payload.data.limits : null;
  if (!limits) return null;
  const tokens = limits.find((limit: any) => limit?.type === "TOKENS_LIMIT") ?? null;
  const tools = limits.find((limit: any) => limit?.type === "TIME_LIMIT") ?? null;
  const reset = (value: unknown) => typeof value === "number" ? value / 1000 : value;
  const primary = makeWindow("5h", tokens?.percentage, reset(tokens?.nextResetTime), 300);
  const secondary = makeWindow("tools", tools?.percentage, reset(tools?.nextResetTime), null);
  return { provider: "zai", source: "zai-usage-api", plan: typeof payload?.data?.level === "string" ? payload.data.level : null, fetched_at: new Date().toISOString(), primary, secondary, credits_remaining: null, credits_unlimited: false, hint_short: buildZaiHint(primary, secondary) };
}

function isSupportedProviderId(providerId: string): providerId is SupportedProviderId {
  return providerId === "openai-codex" || providerId === "github-copilot" || providerId === "zai";
}

async function fetchProviderUsage(modelRuntime: UsageModelRuntime, providerId: SupportedProviderId, authPath: string): Promise<ProviderUsageSnapshot | null> {
  if (providerId === "openai-codex") return fetchCodexUsage(modelRuntime, authPath);
  if (providerId === "github-copilot") return fetchGitHubCopilotUsage(modelRuntime, authPath);
  return fetchZaiUsage(modelRuntime);
}

export function peekProviderUsage(providerId: string, options: { allowStale?: boolean } = {}): ProviderUsageSnapshot | null {
  if (!isSupportedProviderId(providerId)) return null;
  const cached = usageCache.get(providerId);
  if (!cached) return null;
  return options.allowStale === true || cached.expiresAt > Date.now() ? cached.value : null;
}

function resolveUsageAuthPath(modelRuntime: UsageModelRuntime, authPath?: string): string {
  return authPath ?? (modelRuntime as UsageModelRuntime & { authPath?: string }).authPath ?? join(getPiclawAgentDir(), "auth.json");
}

export async function warmProviderUsage(modelRuntime: UsageModelRuntime, providerId: string, authPath?: string): Promise<ProviderUsageSnapshot | null> {
  if (!isSupportedProviderId(providerId)) return null;
  const cached = usageCache.get(providerId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const existing = usageRefreshInFlight.get(providerId);
  if (existing) return existing;
  const refreshPromise = (async () => {
    let value: ProviderUsageSnapshot | null;
    try {
      value = await fetchProviderUsage(modelRuntime, providerId, resolveUsageAuthPath(modelRuntime, authPath));
    } catch (error) {
      debugSuppressedError(log, "Provider usage refresh failed; returning the cached usage snapshot when available.", error, { providerId, hasCachedValue: cached?.value != null });
      value = cached?.value ?? null;
    }
    usageCache.set(providerId, { expiresAt: Date.now() + USAGE_CACHE_TTL_MS, value });
    usageRefreshInFlight.delete(providerId);
    return value;
  })();
  usageRefreshInFlight.set(providerId, refreshPromise);
  return refreshPromise;
}

export async function getProviderUsage(modelRuntime: UsageModelRuntime, providerId: string, authPath?: string): Promise<ProviderUsageSnapshot | null> {
  if (!isSupportedProviderId(providerId)) return null;
  const cached = usageCache.get(providerId);
  return cached && cached.expiresAt > Date.now() ? cached.value : warmProviderUsage(modelRuntime, providerId, authPath);
}

export function clearProviderUsageCache(): void {
  usageCache.clear();
  usageRefreshInFlight.clear();
}

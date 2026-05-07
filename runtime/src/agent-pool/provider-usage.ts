import type { AuthStorage } from "@earendil-works/pi-coding-agent";

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
  provider: "openai-codex" | "github-copilot";
  source: string;
  plan: string | null;
  fetched_at: string;
  primary: ProviderUsageWindow | null;
  secondary: ProviderUsageWindow | null;
  credits_remaining: number | null;
  credits_unlimited: boolean;
  hint_short: string;
}

type CachedUsage = {
  expiresAt: number;
  value: ProviderUsageSnapshot | null;
};

type SupportedProviderId = ProviderUsageSnapshot["provider"];

const USAGE_CACHE_TTL_MS = Number(process.env.PICLAW_PROVIDER_USAGE_TTL_MS || "60000");
const usageCache = new Map<string, CachedUsage>();
const usageRefreshInFlight = new Map<string, Promise<ProviderUsageSnapshot | null>>();
const log = createLogger("agent-pool.provider-usage");

function clampPercent(value: unknown): number | null {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.max(0, Math.min(100, num));
}

function parseDate(value: unknown): Date | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    // Unix seconds for Codex API
    return new Date(value * 1000);
  }
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
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `resets in ~${hours}h ${mins}m` : `resets in ~${hours}h`;
}

function makeWindow(
  label: string,
  usedPercentInput: unknown,
  resetInput: unknown,
  windowMinutes: number | null
): ProviderUsageWindow | null {
  const usedPercent = clampPercent(usedPercentInput);
  if (usedPercent == null) return null;
  const remaining = clampPercent(100 - usedPercent);
  const resetDate = parseDate(resetInput);
  return {
    label,
    used_percent: usedPercent,
    remaining_percent: remaining,
    window_minutes: windowMinutes,
    resets_at: resetDate ? resetDate.toISOString() : null,
    reset_description: formatResetDescription(resetDate),
  };
}

function compactPercent(value: number | null): string | null {
  if (value == null) return null;
  return `${Math.round(value)}%`;
}

function buildCodexHint(
  primary: ProviderUsageWindow | null,
  secondary: ProviderUsageWindow | null,
  creditsRemaining: number | null,
  creditsUnlimited: boolean
): string {
  const parts: string[] = [];
  const p1 = compactPercent(primary?.remaining_percent ?? null);
  const p2 = compactPercent(secondary?.remaining_percent ?? null);
  if (p1) parts.push(`5h ${p1}`);
  if (p2) parts.push(`wk ${p2}`);
  if (creditsUnlimited) parts.push("credits ∞");
  else if (creditsRemaining != null && Number.isFinite(creditsRemaining)) {
    parts.push(`credits ${creditsRemaining.toFixed(creditsRemaining >= 100 ? 0 : 1).replace(/\.0$/, "")}`);
  }
  return parts.join(" • ");
}

function buildCopilotHint(primary: ProviderUsageWindow | null, secondary: ProviderUsageWindow | null): string {
  const parts: string[] = [];
  const premium = compactPercent(primary?.remaining_percent ?? null);
  const chat = compactPercent(secondary?.remaining_percent ?? null);
  if (premium) parts.push(`premium ${premium}`);
  if (chat) parts.push(`chat ${chat}`);
  return parts.join(" • ");
}

async function getOAuthCredential(authStorage: AuthStorage, providerId: string): Promise<any | null> {
  const current = (authStorage.get(providerId) as any) ?? null;
  if (!current || current.type !== "oauth") return null;
  if (typeof current.expires === "number" && Number.isFinite(current.expires) && Date.now() >= current.expires) {
    try {
      await (authStorage as any).refreshOAuthTokenWithLock(providerId);
    } catch (error) {
      debugSuppressedError(log, "Failed to refresh provider OAuth credentials before usage lookup; using current credentials.", error, {
        providerId,
      });
    }
  }
  const refreshed = (authStorage.get(providerId) as any) ?? null;
  return refreshed && refreshed.type === "oauth" ? refreshed : null;
}

async function fetchCodexUsage(authStorage: AuthStorage): Promise<ProviderUsageSnapshot | null> {
  const credential = await getOAuthCredential(authStorage, "openai-codex");
  if (!credential?.access || !credential?.accountId) return null;

  const res = await fetch("https://chatgpt.com/backend-api/wham/usage", {
    headers: {
      Authorization: `Bearer ${credential.access}`,
      Accept: "application/json",
      "ChatGPT-Account-Id": credential.accountId,
      "User-Agent": "PiClaw",
    },
  });

  if (!res.ok) return null;
  const payload = (await res.json()) as any;
  const primary = makeWindow(
    "5h",
    payload?.rate_limit?.primary_window?.used_percent,
    payload?.rate_limit?.primary_window?.reset_at,
    Number.isFinite(payload?.rate_limit?.primary_window?.limit_window_seconds)
      ? Math.round(payload.rate_limit.primary_window.limit_window_seconds / 60)
      : 300
  );
  const secondary = makeWindow(
    "week",
    payload?.rate_limit?.secondary_window?.used_percent,
    payload?.rate_limit?.secondary_window?.reset_at,
    Number.isFinite(payload?.rate_limit?.secondary_window?.limit_window_seconds)
      ? Math.round(payload.rate_limit.secondary_window.limit_window_seconds / 60)
      : null
  );
  const creditsRemaining = payload?.credits?.balance != null ? Number(payload.credits.balance) : null;
  const creditsUnlimited = Boolean(payload?.credits?.unlimited);

  return {
    provider: "openai-codex",
    source: "chatgpt-usage-api",
    plan: typeof payload?.plan_type === "string" ? payload.plan_type : null,
    fetched_at: new Date().toISOString(),
    primary,
    secondary,
    credits_remaining: Number.isFinite(creditsRemaining) ? creditsRemaining : null,
    credits_unlimited: creditsUnlimited,
    hint_short: buildCodexHint(primary, secondary, Number.isFinite(creditsRemaining) ? creditsRemaining : null, creditsUnlimited),
  };
}

async function fetchGitHubCopilotUsage(authStorage: AuthStorage): Promise<ProviderUsageSnapshot | null> {
  const credential = await getOAuthCredential(authStorage, "github-copilot");
  const githubToken = typeof credential?.refresh === "string" ? credential.refresh : null;
  if (!githubToken) return null;

  const res = await fetch("https://api.github.com/copilot_internal/user", {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/json",
      "Editor-Version": "vscode/1.96.2",
      "Editor-Plugin-Version": "copilot-chat/0.26.7",
      "User-Agent": "GitHubCopilotChat/0.26.7",
      "X-Github-Api-Version": "2025-04-01",
    },
  });

  if (!res.ok) return null;
  const payload = (await res.json()) as any;
  const premium = payload?.quota_snapshots?.premium_interactions;
  const chat = payload?.quota_snapshots?.chat;
  const primary = premium
    ? {
        label: "premium",
        used_percent: clampPercent(100 - Number(premium.percent_remaining ?? premium.remaining / premium.entitlement * 100)),
        remaining_percent: clampPercent(premium.percent_remaining ?? premium.remaining / premium.entitlement * 100),
        window_minutes: null,
        resets_at: parseDate(payload?.quota_reset_date)?.toISOString() ?? null,
        reset_description: formatResetDescription(parseDate(payload?.quota_reset_date)),
      }
    : null;
  const secondary = chat
    ? {
        label: "chat",
        used_percent: clampPercent(100 - Number(chat.percent_remaining ?? chat.remaining / chat.entitlement * 100)),
        remaining_percent: clampPercent(chat.percent_remaining ?? chat.remaining / chat.entitlement * 100),
        window_minutes: null,
        resets_at: parseDate(payload?.quota_reset_date)?.toISOString() ?? null,
        reset_description: formatResetDescription(parseDate(payload?.quota_reset_date)),
      }
    : null;

  return {
    provider: "github-copilot",
    source: "github-copilot-internal-api",
    plan: typeof payload?.copilot_plan === "string" ? payload.copilot_plan : null,
    fetched_at: new Date().toISOString(),
    primary,
    secondary,
    credits_remaining: null,
    credits_unlimited: false,
    hint_short: buildCopilotHint(primary, secondary),
  };
}

function isSupportedProviderId(providerId: string): providerId is SupportedProviderId {
  return providerId === "openai-codex" || providerId === "github-copilot";
}

function getCachedUsageEntry(providerId: string): CachedUsage | null {
  return usageCache.get(providerId) ?? null;
}

function hasFreshCachedUsage(providerId: string): boolean {
  const cached = getCachedUsageEntry(providerId);
  return Boolean(cached && cached.expiresAt > Date.now());
}

async function fetchProviderUsage(authStorage: AuthStorage, providerId: SupportedProviderId): Promise<ProviderUsageSnapshot | null> {
  return providerId === "openai-codex"
    ? await fetchCodexUsage(authStorage)
    : await fetchGitHubCopilotUsage(authStorage);
}

export function peekProviderUsage(providerId: string, options: { allowStale?: boolean } = {}): ProviderUsageSnapshot | null {
  if (!isSupportedProviderId(providerId)) return null;
  const cached = getCachedUsageEntry(providerId);
  if (!cached) return null;
  if (options.allowStale === true) {
    return cached.value;
  }
  return cached.expiresAt > Date.now() ? cached.value : null;
}

export async function warmProviderUsage(authStorage: AuthStorage, providerId: string): Promise<ProviderUsageSnapshot | null> {
  if (!isSupportedProviderId(providerId)) return null;
  if (hasFreshCachedUsage(providerId)) {
    return peekProviderUsage(providerId);
  }

  const existing = usageRefreshInFlight.get(providerId);
  if (existing) {
    return await existing;
  }

  const cached = getCachedUsageEntry(providerId);
  const refreshPromise = (async () => {
    let value: ProviderUsageSnapshot | null;
    try {
      value = await fetchProviderUsage(authStorage, providerId);
    } catch (error) {
      debugSuppressedError(log, "Provider usage refresh failed; returning the cached usage snapshot when available.", error, {
        providerId,
        hasCachedValue: cached?.value != null,
      });
      value = cached?.value ?? null;
    }

    usageCache.set(providerId, {
      expiresAt: Date.now() + USAGE_CACHE_TTL_MS,
      value,
    });
    usageRefreshInFlight.delete(providerId);
    return value;
  })();

  usageRefreshInFlight.set(providerId, refreshPromise);
  return await refreshPromise;
}

export async function getProviderUsage(authStorage: AuthStorage, providerId: string): Promise<ProviderUsageSnapshot | null> {
  if (!isSupportedProviderId(providerId)) return null;

  const cached = getCachedUsageEntry(providerId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  return await warmProviderUsage(authStorage, providerId);
}

export function clearProviderUsageCache(): void {
  usageCache.clear();
  usageRefreshInFlight.clear();
}

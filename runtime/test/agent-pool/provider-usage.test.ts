import { beforeEach, describe, expect, mock, test } from "bun:test";
import { clearProviderUsageCache, getProviderUsage, peekProviderUsage, warmProviderUsage } from "../../src/agent-pool/provider-usage.js";

function createAuthStorage(credentials: Record<string, unknown>) {
  return {
    get: (provider: string) => credentials[provider],
    refreshOAuthTokenWithLock: async (_provider: string) => null,
  } as any;
}

describe("provider usage", () => {
  beforeEach(() => {
    clearProviderUsageCache();
  });

  test("fetches Codex usage from ChatGPT usage API", async () => {
    const fetchMock = mock(async () => new Response(JSON.stringify({
      plan_type: "pro",
      rate_limit: {
        primary_window: {
          used_percent: 38,
          reset_at: Math.floor(Date.now() / 1000) + 3600,
          limit_window_seconds: 18000,
        },
        secondary_window: {
          used_percent: 59,
          reset_at: Math.floor(Date.now() / 1000) + 86400,
          limit_window_seconds: 604800,
        },
      },
      credits: {
        balance: 123,
        unlimited: false,
      },
    })));
    const previousFetch = globalThis.fetch;
    globalThis.fetch = fetchMock as any;

    try {
      const usage = await getProviderUsage(
        createAuthStorage({
          "openai-codex": {
            type: "oauth",
            access: "token",
            accountId: "acct_123",
            expires: Date.now() + 60_000,
          },
        }),
        "openai-codex"
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(usage?.provider).toBe("openai-codex");
      expect(usage?.plan).toBe("pro");
      expect(usage?.primary?.label).toBe("5h");
      expect(usage?.primary?.used_percent).toBe(38);
      expect(usage?.primary?.remaining_percent).toBe(62);
      expect(usage?.secondary?.label).toBe("week");
      expect(usage?.credits_remaining).toBe(123);
      expect(usage?.hint_short).toContain("5h 62%");
      expect(usage?.hint_short).toContain("wk 41%");
    } finally {
      globalThis.fetch = previousFetch;
    }
  });

  test("fetches GitHub Copilot usage from internal usage API", async () => {
    const fetchMock = mock(async () => new Response(JSON.stringify({
      copilot_plan: "individual",
      quota_reset_date: new Date(Date.now() + 86400_000).toISOString(),
      quota_snapshots: {
        premium_interactions: {
          entitlement: 100,
          remaining: 70,
          percent_remaining: 70,
          quota_id: "premium",
        },
        chat: {
          entitlement: 500,
          remaining: 400,
          percent_remaining: 80,
          quota_id: "chat",
        },
      },
    })));
    const previousFetch = globalThis.fetch;
    globalThis.fetch = fetchMock as any;

    try {
      const usage = await getProviderUsage(
        createAuthStorage({
          "github-copilot": {
            type: "oauth",
            access: "copilot_access_token",
            refresh: "github_oauth_token",
            expires: Date.now() + 60_000,
          },
        }),
        "github-copilot"
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(usage?.provider).toBe("github-copilot");
      expect(usage?.plan).toBe("individual");
      expect(usage?.primary?.label).toBe("premium");
      expect(usage?.primary?.remaining_percent).toBe(70);
      expect(usage?.secondary?.label).toBe("chat");
      expect(usage?.secondary?.remaining_percent).toBe(80);
      expect(usage?.hint_short).toContain("premium 70%");
      expect(usage?.hint_short).toContain("chat 80%");
    } finally {
      globalThis.fetch = previousFetch;
    }
  });

  test("fetches Z.ai quota usage from monitor API", async () => {
    const tokensResetAtMs = Date.now() + 5 * 3600_000;
    const toolsResetAtMs = Date.now() + 9 * 86400_000;
    const fetchMock = mock(async () => new Response(JSON.stringify({
      code: 200,
      msg: "Operation successful",
      success: true,
      data: {
        level: "lite",
        limits: [
          {
            type: "TIME_LIMIT",
            unit: 5,
            number: 1,
            usage: 100,
            currentValue: 0,
            remaining: 100,
            percentage: 0,
            nextResetTime: toolsResetAtMs,
            usageDetails: [
              { modelCode: "search-prime", usage: 0 },
              { modelCode: "web-reader", usage: 0 },
              { modelCode: "zread", usage: 0 },
            ],
          },
          {
            type: "TOKENS_LIMIT",
            unit: 3,
            number: 5,
            percentage: 1,
            nextResetTime: tokensResetAtMs,
          },
        ],
      },
    })));
    const previousFetch = globalThis.fetch;
    globalThis.fetch = fetchMock as any;

    try {
      const usage = await getProviderUsage(
        createAuthStorage({
          zai: {
            type: "api_key",
            key: "zai-token",
          },
        }),
        "zai"
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect((fetchMock as any).mock.calls[0][0]).toBe("https://api.z.ai/api/monitor/usage/quota/limit");
      expect((fetchMock as any).mock.calls[0][1]).toMatchObject({
        headers: {
          Authorization: "Bearer zai-token",
          Accept: "application/json",
          "User-Agent": "PiClaw",
        },
      });
      expect(usage?.provider).toBe("zai");
      expect(usage?.plan).toBe("lite");
      expect(usage?.primary?.label).toBe("5h");
      expect(usage?.primary?.used_percent).toBe(1);
      expect(usage?.primary?.remaining_percent).toBe(99);
      expect(usage?.primary?.window_minutes).toBe(300);
      expect(usage?.secondary?.label).toBe("tools");
      expect(usage?.secondary?.used_percent).toBe(0);
      expect(usage?.secondary?.remaining_percent).toBe(100);
      expect(usage?.secondary?.window_minutes).toBeNull();
      expect(usage?.hint_short).toContain("5h 99%");
      expect(usage?.hint_short).toContain("tools 100%");
    } finally {
      globalThis.fetch = previousFetch;
    }
  });

  test("formats long reset windows with a day tier", async () => {
    const secondaryResetAt = Math.floor((Date.now() + ((6 * 24 + 14) * 3600_000)) / 1000);
    const fetchMock = mock(async () => new Response(JSON.stringify({
      plan_type: "pro",
      rate_limit: {
        primary_window: {
          used_percent: 38,
          reset_at: Math.floor(Date.now() / 1000) + 3600,
          limit_window_seconds: 18000,
        },
        secondary_window: {
          used_percent: 59,
          reset_at: secondaryResetAt,
          limit_window_seconds: 604800,
        },
      },
      credits: {
        balance: 123,
        unlimited: false,
      },
    })));
    const previousFetch = globalThis.fetch;
    globalThis.fetch = fetchMock as any;

    try {
      const usage = await getProviderUsage(
        createAuthStorage({
          "openai-codex": {
            type: "oauth",
            access: "token",
            accountId: "acct_123",
            expires: Date.now() + 60_000,
          },
        }),
        "openai-codex"
      );

      expect(usage?.secondary?.reset_description).toBe("resets in ~6d 14h");
    } finally {
      globalThis.fetch = previousFetch;
    }
  });

  test("warms provider usage in the background and reuses the same in-flight refresh", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const fetchMock = mock(async () => {
      await gate;
      return new Response(JSON.stringify({
        plan_type: "pro",
        rate_limit: {
          primary_window: {
            used_percent: 10,
            reset_at: Math.floor(Date.now() / 1000) + 3600,
            limit_window_seconds: 18000,
          },
        },
        credits: {
          balance: 50,
          unlimited: false,
        },
      }));
    });
    const previousFetch = globalThis.fetch;
    globalThis.fetch = fetchMock as any;

    try {
      const first = warmProviderUsage(
        createAuthStorage({
          "openai-codex": {
            type: "oauth",
            access: "token",
            accountId: "acct_123",
            expires: Date.now() + 60_000,
          },
        }),
        "openai-codex"
      );
      const second = warmProviderUsage(
        createAuthStorage({
          "openai-codex": {
            type: "oauth",
            access: "token",
            accountId: "acct_123",
            expires: Date.now() + 60_000,
          },
        }),
        "openai-codex"
      );

      expect(peekProviderUsage("openai-codex", { allowStale: true })).toBeNull();
      await Promise.resolve();
      expect(fetchMock).toHaveBeenCalledTimes(1);

      release();
      const usage = await first;
      expect(await second).toEqual(usage);
      expect(peekProviderUsage("openai-codex", { allowStale: true })?.provider).toBe("openai-codex");
    } finally {
      globalThis.fetch = previousFetch;
    }
  });

  test("returns null for unsupported providers", async () => {
    const usage = await getProviderUsage(createAuthStorage({}), "openai");
    expect(usage).toBeNull();
  });
});

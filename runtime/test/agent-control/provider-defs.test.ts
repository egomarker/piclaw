import { describe, expect, test } from "bun:test";
import { AuthStorage, ModelRegistry } from "@earendil-works/pi-coding-agent";

import { PROVIDER_DEFS, getProviderDefs, getProviderDisplayName } from "../../src/agent-control/provider-defs.js";

describe("provider defs", () => {
  test("OpenCode ZEN is exposed as a custom provider only", () => {
    const provider = PROVIDER_DEFS.find((entry) => entry.id === "opencode-zen");
    expect(provider).toBeDefined();
    expect(provider?.name).toBe("OpenCode ZEN");
    expect(provider?.isCustom).toBe(true);
    expect(provider?.hasApiKey).toBe(false);
    expect(provider?.customApi).toBe("openai-completions");
    expect(provider?.customFields?.map((field) => field.key)).toEqual(["baseUrl", "apiKey", "modelId", "modelIds"]);
  });

  test("tracks current built-in providers and drops removed Google subscription providers", () => {
    const ids = getProviderDefs().map((entry) => entry.id);
    expect(ids).toContain("cloudflare-ai-gateway");
    expect(ids).toContain("cloudflare-workers-ai");
    expect(ids).toContain("moonshotai");
    expect(ids).toContain("moonshotai-cn");
    expect(ids).toContain("xiaomi");
    expect(ids).toContain("xiaomi-token-plan-cn");
    expect(ids).toContain("xiaomi-token-plan-ams");
    expect(ids).toContain("xiaomi-token-plan-sgp");
    expect(ids).not.toContain("google-gemini-cli");
    expect(ids).not.toContain("google-antigravity");
    expect(ids).not.toContain("antigravity");
  });

  test("documents Xiaomi MiMo API billing and regional token-plan provider split", () => {
    const defs = getProviderDefs();
    expect(defs.find((entry) => entry.id === "xiaomi")).toMatchObject({
      name: "Xiaomi MiMo (API billing)",
      hasApiKey: true,
      apiKeyHint: "XIAOMI_API_KEY",
    });
    expect(defs.find((entry) => entry.id === "xiaomi-token-plan-ams")).toMatchObject({
      name: "Xiaomi MiMo Token Plan (AMS)",
      hasApiKey: true,
      apiKeyHint: "XIAOMI_TOKEN_PLAN_AMS_API_KEY",
    });
  });

  test("can enrich provider names from ModelRegistry when available", () => {
    const registry = ModelRegistry.inMemory(AuthStorage.inMemory()) as ModelRegistry & { getProviderDisplayName?: (provider: string) => string };
    const defs = getProviderDefs(registry, registry.authStorage);
    expect(defs.some((entry) => entry.id === "amazon-bedrock")).toBe(true);
    expect(getProviderDisplayName("cloudflare-ai-gateway", registry)).toBe("Cloudflare AI Gateway");
  });
});

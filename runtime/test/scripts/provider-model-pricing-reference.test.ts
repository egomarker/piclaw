import { describe, expect, test } from "bun:test";
import { resolveProviderModelPricing } from "../../skills/operator/token-chart/provider-model-pricing-reference.ts";

describe("provider/model pricing reference", () => {
  test("keeps route-specific prices separate", () => {
    expect(resolveProviderModelPricing("azure-foundry", "deepseek-v4-flash")).toMatchObject({
      canonicalModel: "DeepSeek V4 Flash (Azure Foundry)",
      inputPerMTok: 0.19,
      outputPerMTok: 0.51,
    });
    expect(resolveProviderModelPricing("deepseek", "deepseek-v4-flash")).toMatchObject({
      canonicalModel: "DeepSeek V4 Flash (native)",
      inputPerMTok: 0.14,
      cacheReadPerMTok: 0.0028,
    });
    expect(resolveProviderModelPricing("openrouter", "deepseek/deepseek-v4-flash")).toMatchObject({
      canonicalModel: "DeepSeek V4 Flash (OpenRouter)",
      inputPerMTok: 0.09,
      outputPerMTok: 0.18,
    });
  });

  test("does not inherit a bare model from the wrong provider", () => {
    expect(resolveProviderModelPricing("openrouter", "deepseek-v4-flash").basis).toContain("Unpriced fallback");
    expect(resolveProviderModelPricing("openrouter", "mistral-large-3").basis).toContain("Unpriced fallback");
  });

  test("leaves subscription-only research previews unpriced", () => {
    expect(resolveProviderModelPricing("openai-codex", "gpt-5.3-codex-spark").basis).toContain("Unpriced fallback");
  });

  test("resolves current aliases without conflating GPT-5 Mini variants", () => {
    expect(resolveProviderModelPricing("openai-codex", "gpt-5-4-mini")).toMatchObject({
      canonicalModel: "GPT-5.4 Mini",
      inputPerMTok: 0.75,
      outputPerMTok: 4.5,
    });
    expect(resolveProviderModelPricing("openai-codex", "gpt-5-mini")).toMatchObject({
      canonicalModel: "GPT-5 Mini",
      inputPerMTok: 0.25,
      outputPerMTok: 2,
    });
  });

  test("prices local inference at zero metered API cost", () => {
    expect(resolveProviderModelPricing("milkv-local", "gemma4-e4b-qat-mtp")).toMatchObject({
      inputPerMTok: 0,
      outputPerMTok: 0,
      cacheReadPerMTok: 0,
      cacheWritePerMTok: 0,
    });
  });
});

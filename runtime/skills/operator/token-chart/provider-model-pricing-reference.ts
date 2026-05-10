/**
 * SCRIPT_JDOC:
 * {
 *   "summary": "Provider and model pricing reference data for token cost estimation.",
 *   "role": "module"
 * }
 */
export interface ProviderModelPricingReference {
  canonicalModel: string;
  basis: string;
  inputPerMTok: number;
  outputPerMTok: number;
  cacheReadPerMTok: number;
  cacheWritePerMTok: number;
  notes?: string;
}

interface ProviderModelPricingRule extends ProviderModelPricingReference {
  id: string;
  models: string[];
}

// Tag this reference snapshot with the commit date that introduced it so future
// updates can track pricing provenance without guessing.
export const PROVIDER_MODEL_PRICING_REFERENCE_TAG = "2026-05-09";

const PRIMARY_SOURCE = "exports/ai-provider-pricing-2026-04.docx";
const GPT4O_FALLBACK_SOURCE = "projects/openviktor/apps/bot/src/agent/pricing.ts";

const PRICING_RULES: ProviderModelPricingRule[] = [
  {
    id: "claude-opus-4.5",
    models: ["claude-opus-4.5"],
    canonicalModel: "Claude Opus 4.5",
    basis: `Anthropic Opus pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 5,
    outputPerMTok: 25,
    cacheReadPerMTok: 0.5,
    cacheWritePerMTok: 6.25,
    notes: "Proxying Opus 4.5 to the same Opus 4.x pricing family used for 4.6/4.7.",
  },
  {
    id: "claude-opus-4.6",
    models: ["claude-opus-4.6"],
    canonicalModel: "Claude Opus 4.6",
    basis: `Anthropic Opus pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 5,
    outputPerMTok: 25,
    cacheReadPerMTok: 0.5,
    cacheWritePerMTok: 6.25,
  },
  {
    id: "claude-opus-4.6-1m",
    models: ["claude-opus-4.6-1m"],
    canonicalModel: "Claude Opus 4.6 (1M)",
    basis: `Anthropic Opus pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 5,
    outputPerMTok: 25,
    cacheReadPerMTok: 0.5,
    cacheWritePerMTok: 6.25,
    notes: "Uses standard Opus pricing; long-context premium/meters for 1M context are not modeled.",
  },
  {
    id: "claude-opus-4.7",
    models: ["claude-opus-4.7"],
    canonicalModel: "Claude Opus 4.7",
    basis: `Anthropic Opus pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 5,
    outputPerMTok: 25,
    cacheReadPerMTok: 0.5,
    cacheWritePerMTok: 6.25,
    notes: "Pricing note says Opus 4.7 matches Opus 4.6 API pricing.",
  },
  {
    id: "claude-sonnet-4.6",
    models: ["claude-sonnet-4.6"],
    canonicalModel: "Claude Sonnet 4.6",
    basis: `Anthropic Sonnet pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 3,
    outputPerMTok: 15,
    cacheReadPerMTok: 0.3,
    cacheWritePerMTok: 3.75,
  },
  {
    id: "gpt-5.4",
    models: ["gpt-5.4"],
    canonicalModel: "GPT-5.4",
    basis: `OpenAI pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 2.5,
    outputPerMTok: 15,
    cacheReadPerMTok: 0.25,
    cacheWritePerMTok: 2.5,
    notes: "Cache write estimated at standard input rate; note only publishes cached-input read discount.",
  },
  {
    id: "gpt-5.5",
    models: ["gpt-5.5"],
    canonicalModel: "GPT-5.5",
    basis: `OpenAI Codex pricing page + ${PRIMARY_SOURCE}`,
    inputPerMTok: 5,
    outputPerMTok: 30,
    cacheReadPerMTok: 0.5,
    cacheWritePerMTok: 5,
    notes: "Estimated as 2x GPT-5.4 rates, matching the Codex credits ratio shown for GPT-5.5 vs GPT-5.4.",
  },
  {
    id: "gpt-5.4-pro",
    models: ["gpt-5.4-pro"],
    canonicalModel: "GPT-5.4 Pro",
    basis: `OpenAI pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 30,
    outputPerMTok: 180,
    cacheReadPerMTok: 0,
    cacheWritePerMTok: 30,
    notes: "No cached-input rate published in the note; cache write treated as standard input.",
  },
  {
    id: "gpt-5-mini",
    models: ["gpt-5-mini"],
    canonicalModel: "GPT-5 Mini",
    basis: `OpenAI GPT-5.4 mini pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 0.75,
    outputPerMTok: 4.5,
    cacheReadPerMTok: 0.075,
    cacheWritePerMTok: 0.75,
    notes: "Used as proxy for GPT-5 Mini / Codex-mini variants.",
  },
  {
    id: "gpt-5.1-codex",
    models: ["gpt-5.1-codex"],
    canonicalModel: "GPT-5.1 Codex",
    basis: `OpenAI Codex pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 1.75,
    outputPerMTok: 14,
    cacheReadPerMTok: 0.175,
    cacheWritePerMTok: 1.75,
    notes: "GPT-5.1 Codex proxied to GPT-5.3 Codex pricing from the note.",
  },
  {
    id: "gpt-5.1-codex-mini",
    models: ["gpt-5.1-codex-mini"],
    canonicalModel: "GPT-5.1 Codex Mini",
    basis: `OpenAI GPT-5.4 mini pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 0.75,
    outputPerMTok: 4.5,
    cacheReadPerMTok: 0.075,
    cacheWritePerMTok: 0.75,
    notes: "Codex mini variant proxied to GPT-5 Mini pricing from the note.",
  },
  {
    id: "gpt-5.2-codex",
    models: ["gpt-5.2-codex"],
    canonicalModel: "GPT-5.2 Codex",
    basis: `OpenAI Codex pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 1.75,
    outputPerMTok: 14,
    cacheReadPerMTok: 0.175,
    cacheWritePerMTok: 1.75,
    notes: "GPT-5.2 Codex proxied to GPT-5.3 Codex pricing from the note.",
  },
  {
    id: "gpt-5.3-codex",
    models: ["gpt-5.3-codex"],
    canonicalModel: "GPT-5.3 Codex",
    basis: `OpenAI Codex pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 1.75,
    outputPerMTok: 14,
    cacheReadPerMTok: 0.175,
    cacheWritePerMTok: 1.75,
    notes: "Cache write estimated at standard input rate.",
  },
  {
    id: "gpt-5.3-codex-spark",
    models: ["gpt-5.3-codex-spark"],
    canonicalModel: "GPT-5.3 Codex Spark",
    basis: `OpenAI Codex pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 1.75,
    outputPerMTok: 14,
    cacheReadPerMTok: 0.175,
    cacheWritePerMTok: 1.75,
    notes: "Research-preview Spark tier proxied to GPT-5.3 Codex token pricing.",
  },
  {
    id: "gpt-4o",
    models: ["gpt-4o"],
    canonicalModel: "GPT-4o",
    basis: `Workspace fallback pricing from ${GPT4O_FALLBACK_SOURCE}`,
    inputPerMTok: 2.5,
    outputPerMTok: 10,
    cacheReadPerMTok: 0,
    cacheWritePerMTok: 0,
    notes: "Fallback helper entry for older GPT-4o usage; cache rates not modeled in the fallback source.",
  },
  {
    id: "mistral-large-3",
    models: ["mistral-large-3"],
    canonicalModel: "Mistral Large 3",
    basis: `Mistral pricing from ${PRIMARY_SOURCE}`,
    inputPerMTok: 2,
    outputPerMTok: 6,
    cacheReadPerMTok: 0,
    cacheWritePerMTok: 0,
    notes: "Azure Foundry usage estimated from Mistral Large direct pricing in the pricing note.",
  },
  {
    id: "gpt-oss-120b",
    models: ["gpt-oss-120b"],
    canonicalModel: "GPT-OSS 120B",
    basis: "OpenRouter GPT-OSS 120B pricing reference, used as a proxy for Cerebras rows",
    inputPerMTok: 0.039,
    outputPerMTok: 0.1,
    cacheReadPerMTok: 0,
    cacheWritePerMTok: 0,
    notes: "Cerebras-specific pricing should replace this proxy if direct account pricing differs; current local rows have zero tokens.",
  },
  {
    id: "kimi-k2.6-fire-pass",
    models: ["kimi-k2p6-turbo"],
    canonicalModel: "Kimi K2.6 Turbo (Fire Pass router)",
    basis: "Fireworks Fire Pass docs, accessed 2026-05-09",
    inputPerMTok: 0,
    outputPerMTok: 0,
    cacheReadPerMTok: 0,
    cacheWritePerMTok: 0,
    notes: "Fire Pass is $49/month early access for personal agentic coding; the covered router is accounts/fireworks/routers/kimi-k2p6-turbo and covered token usage is shown as $0 while the pass is active.",
  },
  {
    id: "kimi-k2.6",
    models: ["kimi-k2.6", "kimi-k2p6"],
    canonicalModel: "Kimi K2.6",
    basis: "Fireworks model page, accessed 2026-05-09",
    inputPerMTok: 0.95,
    outputPerMTok: 4,
    cacheReadPerMTok: 0.16,
    cacheWritePerMTok: 0.95,
    notes: "Fireworks serverless PAYG row; page lists input/cached-input/output only, so cache writes are treated as normal input.",
  },
  {
    id: "kimi-k2.5",
    models: ["kimi-k2.5", "kimi-k2p5"],
    canonicalModel: "Kimi K2.5 (legacy/deprecated)",
    basis: "Fireworks model page, accessed 2026-05-09",
    inputPerMTok: 0.6,
    outputPerMTok: 3,
    cacheReadPerMTok: 0.1,
    cacheWritePerMTok: 0.6,
    notes: "Legacy K2.5 row retained for historical charts; prefer Kimi K2.6 or the Fire Pass K2.6 Turbo router for new usage.",
  },
];

function normalizeModel(model: string): string {
  const trimmed = model.trim().toLowerCase().replace(/_/g, "-");
  const aliasMap: Record<string, string> = {
    "gpt-5-4": "gpt-5.4",
    "gpt-5-4-pro": "gpt-5.4-pro",
    "gpt-5-3-codex": "gpt-5.3-codex",
    "gpt-5-3-codex-spark": "gpt-5.3-codex-spark",
    "gpt-5-2-codex": "gpt-5.2-codex",
    "gpt-5-1-codex": "gpt-5.1-codex",
    "gpt-5-1-codex-mini": "gpt-5.1-codex-mini",
    "accounts/fireworks/routers/kimi-k2p6-turbo": "kimi-k2p6-turbo",
    "fireworks/kimi-k2p6-turbo": "kimi-k2p6-turbo",
    "moonshotai/kimi-k2.6": "kimi-k2.6",
    "accounts/fireworks/models/kimi-k2p6": "kimi-k2.6",
    "fireworks/kimi-k2p6": "kimi-k2.6",
    "moonshotai/kimi-k2.5": "kimi-k2.5",
    "accounts/fireworks/models/kimi-k2p5": "kimi-k2.5",
    "fireworks/kimi-k2p5": "kimi-k2.5",
  };
  return aliasMap[trimmed] || trimmed;
}

const UNPRICED_FALLBACK: ProviderModelPricingReference = {
  canonicalModel: "(unpriced)",
  basis: `Unpriced fallback (${PROVIDER_MODEL_PRICING_REFERENCE_TAG})`,
  inputPerMTok: 0,
  outputPerMTok: 0,
  cacheReadPerMTok: 0,
  cacheWritePerMTok: 0,
};

export function resolveProviderModelPricing(provider: string, model: string): ProviderModelPricingReference {
  const normalizedModel = normalizeModel(model);
  const rule = PRICING_RULES.find((candidate) => candidate.models.includes(normalizedModel));
  if (rule) {
    return {
      canonicalModel: rule.canonicalModel,
      basis: rule.basis,
      inputPerMTok: rule.inputPerMTok,
      outputPerMTok: rule.outputPerMTok,
      cacheReadPerMTok: rule.cacheReadPerMTok,
      cacheWritePerMTok: rule.cacheWritePerMTok,
      notes: rule.notes,
    };
  }

  return {
    ...UNPRICED_FALLBACK,
    canonicalModel: model,
    notes: `No pricing reference available for ${provider}/${normalizedModel}.`,
  };
}

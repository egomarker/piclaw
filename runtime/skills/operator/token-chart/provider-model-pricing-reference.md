# Provider/model pricing reference

_Reference tag (snapshot date): 2026-05-09_

This note documents the pricing snapshot used by the estimated provider/model cost chart.

- Source of truth for the chart logic: `provider-model-pricing-reference.ts`
- Primary source: `exports/ai-provider-pricing-2026-04.docx`
- Codex GPT-5.5 source: OpenAI Codex pricing page, using its 2× GPT-5.4 credit ratio as the token-rate estimate
- GPT-4o fallback source: `projects/openviktor/apps/bot/src/agent/pricing.ts`
- GPT-OSS 120B fallback source: OpenRouter model pricing reference, used only as a Cerebras proxy until direct account pricing is confirmed
- Fireworks Fire Pass / Kimi source: Fireworks Fire Pass docs and Fireworks model pages accessed 2026-05-09

## Assumptions

- GitHub Copilot and Azure rows are estimated from underlying vendor token pricing, not seat plans or invoice meters.
- OpenAI cache writes are estimated at the standard input rate when the pricing note only exposes cached-input read discounts.
- Anthropic cache writes use 1.25× input pricing.
- GPT-5.5 is estimated at 2× GPT-5.4 rates based on the Codex pricing page credit ratio.
- GPT-5.1/5.2 Codex variants and Codex Spark are proxied to the GPT-5.3 Codex or GPT-5 Mini rates listed below.
- Claude Opus 4.6 (1M) keeps standard Opus pricing; long-context premiums are not modeled.
- GPT-OSS 120B uses an OpenRouter proxy rate until direct Cerebras account pricing is confirmed; current local rows have zero tokens.
- Fire Pass is modeled as a $49/month subscription outside token charts; the covered `kimi-k2p6-turbo` router is represented as $0/token only when that pass is active.
- Kimi cache writes are treated as normal input because Fireworks publishes input/cached-input/output rates, not a separate cache-write meter.
- Kimi K2.5 is retained only for historical rows; prefer Kimi K2.6 or Kimi K2.6 Turbo under Fire Pass for new routing.

## Reference rows

| Model key | Canonical model | Input / 1M | Output / 1M | Cache read / 1M | Cache write / 1M | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `claude-opus-4.5` | Claude Opus 4.5 | $5.00 | $25.00 | $0.50 | $6.25 | Proxy to Opus 4.x pricing |
| `claude-opus-4.6` | Claude Opus 4.6 | $5.00 | $25.00 | $0.50 | $6.25 |  |
| `claude-opus-4.6-1m` | Claude Opus 4.6 (1M) | $5.00 | $25.00 | $0.50 | $6.25 | No long-context premium modeled |
| `claude-opus-4.7` | Claude Opus 4.7 | $5.00 | $25.00 | $0.50 | $6.25 | Same API price as 4.6 per note |
| `claude-sonnet-4.6` | Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 | $3.75 |  |
| `gpt-5.4` / `gpt-5-4` | GPT-5.4 | $2.50 | $15.00 | $0.25 | $2.50 | Cache write estimated at standard input |
| `gpt-5.5` | GPT-5.5 | $5.00 | $30.00 | $0.50 | $5.00 | Estimated at 2× GPT-5.4 from Codex credit ratio |
| `gpt-5.4-pro` / `gpt-5-4-pro` | GPT-5.4 Pro | $30.00 | $180.00 | $0.00 | $30.00 | No cached-input rate published |
| `gpt-5-mini` | GPT-5 Mini | $0.75 | $4.50 | $0.075 | $0.75 | Proxy for GPT-5 Mini / Codex-mini variants |
| `gpt-5.1-codex` / `gpt-5-1-codex` | GPT-5.1 Codex | $1.75 | $14.00 | $0.175 | $1.75 | Proxy to GPT-5.3 Codex |
| `gpt-5.1-codex-mini` / `gpt-5-1-codex-mini` | GPT-5.1 Codex Mini | $0.75 | $4.50 | $0.075 | $0.75 | Proxy to GPT-5 Mini |
| `gpt-5.2-codex` / `gpt-5-2-codex` | GPT-5.2 Codex | $1.75 | $14.00 | $0.175 | $1.75 | Proxy to GPT-5.3 Codex |
| `gpt-5.3-codex` / `gpt-5-3-codex` | GPT-5.3 Codex | $1.75 | $14.00 | $0.175 | $1.75 | Cache write estimated at standard input |
| `gpt-5.3-codex-spark` / `gpt-5-3-codex-spark` | GPT-5.3 Codex Spark | $1.75 | $14.00 | $0.175 | $1.75 | Proxy to GPT-5.3 Codex |
| `gpt-4o` | GPT-4o | $2.50 | $10.00 | $0.00 | $0.00 | Fallback helper entry |
| `mistral-large-3` | Mistral Large 3 | $2.00 | $6.00 | $0.00 | $0.00 | Azure Foundry usage proxied to Mistral Large |
| `gpt-oss-120b` | GPT-OSS 120B | $0.039 | $0.10 | $0.00 | $0.00 | OpenRouter proxy for Cerebras rows until direct pricing is confirmed |
| `kimi-k2p6-turbo` | Kimi K2.6 Turbo (Fire Pass router) | $0.00 | $0.00 | $0.00 | $0.00 | Covered by Fireworks Fire Pass while active; $49/month subscription tracked separately |
| `kimi-k2.6` / `kimi-k2p6` | Kimi K2.6 | $0.95 | $4.00 | $0.16 | $0.95 | Fireworks serverless PAYG; cache write modeled as normal input |
| `kimi-k2.5` / `kimi-k2p5` | Kimi K2.5 (legacy/deprecated) | $0.60 | $3.00 | $0.10 | $0.60 | Legacy/historical row; avoid for new routing |

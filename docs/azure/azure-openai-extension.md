# Azure OpenAI extension

> **Status:** experimental
>
> This bundled extension adds Azure OpenAI and Azure AI Foundry support to piclaw. Its configuration and internal APIs may still change between releases.

This document focuses on the Azure OpenAI features the extension implements, how it registers providers safely, and the Azure-specific safeguards it applies at runtime.

## What this extension provides

### Azure OpenAI provider

Registers an `azure-openai` provider that routes Azure text models through the **Responses API**.

Key capabilities:

- managed-identity auth via Azure IMDS
- optional static API-key mode
- GPT-5 reasoning support
- streaming output
- tool calling
- model-specific request shaping and safeguards
- cross-model and cross-provider replay cleanup

### Azure AI Foundry provider

Registers an `azure-foundry` provider for Foundry text and image models.

Key capabilities:

- custom provider registration separate from Azure OpenAI
- completions-based text routing for Foundry text models
- image-generation support for Foundry image models
- shared token acquisition path and cache behavior

### Image commands

Adds workspace-backed image commands:

- `/image`
- `/flux`

Features:

- writes generated files to the workspace
- renders inline previews in the timeline
- supports transparent PNG output for `/image` when the Azure OpenAI image model accepts it
- normalizes requested sizes to provider-supported values

---

## Azure OpenAI features implemented here

### 1. Safe provider registration

The extension uses **custom API names** instead of overriding the global OpenAI handlers.

Why this matters:

- prevents collisions with other providers
- avoids breaking providers such as GitHub Copilot
- keeps Azure routing explicit per model

Rules:

- Azure OpenAI models use `azure-openai-responses-mi`
- Foundry text models use `azure-foundry-openai-completions-mi`
- do **not** register this extension as `openai-responses` or `openai-completions`

### 2. Managed-identity-first auth

The extension is designed for Azure environments that can obtain tokens from IMDS.

Supported auth modes:

- **managed identity** by default
- **static API key** when `AOAI_API_KEY` is set

It also maintains a local token cache with refresh skew to avoid unnecessary token fetches.

### 3. Azure Responses streaming

For Azure OpenAI text models, the extension streams via the Responses API and applies Azure-specific request shaping.

This includes:

- text-output forcing so the model returns normal text output, not only reasoning items
- reasoning-effort mapping from piclaw thinking levels
- `prompt_cache_key` seeding from the active session id
- tool-call replay cleanup for Azure validation rules
- request summaries for debugging failed streams

### 4. GPT-5 reasoning support

The extension maps piclaw reasoning controls onto Azure-compatible request fields.

Behavior:

- supports reasoning-enabled GPT-5-family models
- clamps unsupported reasoning levels when necessary
- can disable reasoning globally or per model with env flags
- caps reasoning for known unstable tool-heavy model flows

### 5. GPT-5.3 Codex phase replay

Some GPT-5.3 Codex responses include output-item phase metadata. The extension captures and replays that metadata so follow-up turns preserve continuity.

This is mainly relevant for:

- long multi-step coding sessions
- replay after tool use
- model switching back into GPT-5.3 Codex

### 6. Azure-specific tool-call sanitization

Azure validates replayed tool-call history more strictly than other providers.

The extension compensates for that by:

- normalizing tool-call IDs
- sanitizing `id` / `call_id` fields to Azure-safe formats
- removing provider-specific IDs that become invalid after replay
- filling missing `function_call.arguments` with valid JSON text

This avoids silent stream failures caused by replay artifacts when switching providers or compacting history.

### 7. Strict tool-schema sanitization

Azure validates tool parameter schemas more strictly than OpenAI and Anthropic.

Before sending tool definitions, the extension fixes common schema issues such as:

- `type: "array"` without `items`
- nested schema branches that need the same fix

This is applied recursively so Azure does not reject otherwise-valid tool surfaces that other providers tolerate.

### 8. Tool-history trimming and summarization

Azure requests can fail when too many historical tool calls are replayed.

The extension proactively trims older tool history and replaces it with a compact assistant summary.

Current protections:

- cap historical tool calls before send
- optionally dedupe repeated `tool_output_search` calls
- preserve continuity with a synthetic summary message
- use Azure-safe message IDs for that summary

### 9. Proactive input-budget guard

The extension now applies a **preflight size guard** before sending Azure requests.

It estimates request size and trims older tool history further when the reconstructed input is too large relative to the model's token-per-minute budget.

Why this exists:

- long agent turns replay the full conversation repeatedly
- Azure throttling is token-budget-based
- reducing oversized tool history before send is safer than retrying after a throttle event

### 10. Throttle-aware retry behavior

Azure streaming failures do not always look like normal HTTP throttling.

In some cases, the stream fails with:

- `response.failed`
- `error: null`
- empty output

The extension treats that pattern as likely token-budget exhaustion and:

- uses a longer retry backoff
- emits user-visible retry feedback in the stream
- surfaces a clearer final error if retries are exhausted

### 11. User-visible retry feedback

When Azure throttling or another retryable transient failure is detected, the extension streams a short temporary status note into the active reply.

Examples:

- `Azure rate limit hit — waiting 15s before retry…`
- `Request failed — retrying in Ns…`

This prevents the chat from appearing silently hung during backoff.

### 12. Workspace-friendly image output

Generated images are formatted for normal piclaw usage rather than raw API output.

The extension:

- saves images into the workspace
- returns timeline-friendly output with previews and file paths
- keeps `/image --transparent` on the Azure OpenAI image path
- keeps `/flux` separate, without transparent-background support

---

## Providers registered

### Azure OpenAI

- **Provider ID:** `azure-openai`
- **API name:** `azure-openai-responses-mi`
- **Base URL env:** `AOAI_BASE_URL`
- **Model list env:** `AOAI_MODEL_IDS`

### Azure AI Foundry

- **Provider ID:** `azure-foundry`
- **API name:** `azure-foundry-openai-completions-mi`
- **Base URL env:** `FOUNDRY_BASE_URL`
- **Model list env:** `FOUNDRY_MODEL_IDS`

---

## Important guardrails

- Do **not** use `openai-responses` or `openai-completions` as this extension's API names.
- Always set each Azure model's `api` to the custom Azure API name.
- Do **not** manually inject `Authorization` or `api-key` headers on top of the OpenAI SDK client.
- Managed-identity resource values must match the target Azure resource.
- Do not remove tool-call ID sanitization or replay cleanup.
- Do not remove tool-schema sanitization unless upstream tool schemas are guaranteed Azure-clean.

---

## Configuration

### Required Azure OpenAI settings

- `AOAI_BASE_URL` — accepts Azure OpenAI/Cognitive Services/modern Foundry host roots such as `https://name.openai.azure.com`, `https://name.cognitiveservices.azure.com`, or `https://name.services.ai.azure.com`, plus `/openai` and `/openai/v1` forms. Azure host roots are normalized to `/openai/v1` before the OpenAI SDK appends `/responses`.
- `AOAI_MODEL_ID` or `AOAI_MODEL_IDS`

### Optional Azure OpenAI settings

- `AOAI_API_KEY`
- `AOAI_MODEL_NAME` / `AOAI_MODEL_NAMES`
- `AOAI_IMAGE_MODEL_ID`
- `AOAI_RESOURCE`
- `AOAI_TOKEN_CACHE_DIR`
- `AOAI_TOKEN_CACHE_FILE`
- `AOAI_TOKEN_SKEW_SECONDS`
- `AOAI_API_VERSION`

### Optional behavior flags

- `AOAI_DISABLE_TOOLS`
- `AOAI_DISABLE_REASONING`
- `AOAI_DISABLE_REASONING_MODELS`
- `AOAI_LOG_PHASES`
- `AOAI_MAX_TOOL_CALLS`
- `AOAI_TOOL_CALL_SUMMARY_MAX`
- `AOAI_TOOL_CALL_OUTPUT_CHARS`
- `AOAI_DEDUPE_TOOL_OUTPUT_SEARCH`
- `AOAI_MAX_TPM_SHARE`
- `AOAI_ABSOLUTE_INPUT_TOKEN_CAP`

### Foundry settings

- `FOUNDRY_BASE_URL` — for OpenAI-compatible text models, accepts the same Azure host root and `/openai/v1` forms as `AOAI_BASE_URL`; non-Azure proxy paths are preserved.
- `FOUNDRY_MODEL_IDS`
- `FOUNDRY_MODEL_NAMES`
- `FOUNDRY_IMAGE_MODEL_ID`
- `FOUNDRY_API_VERSION`
- `FOUNDRY_IMAGE_BASE_URL`
- `FOUNDRY_IMAGE_API_VERSION`
- `FOUNDRY_RESOURCE`

---

## User-facing commands

### Image generation

- `/image <prompt> [--size ...] [--count ...] [--quality low|medium|high] [--style natural|vivid] [--transparent]`
- `/flux <prompt> [--size ...] [--count ...] [--quality low|medium|high]`

Notes:

- Default quality is **`medium`** (changed from `high` on 2026-04-20 to avoid Azure S0 tier rate limits).
- `/image --transparent` requests transparent PNG output on the Azure OpenAI image path.
- `/flux` does not support transparent background requests.
- Error messages and generation status are delivered via `pi.sendMessage()` directly so they appear in the correct chat branch. Earlier versions used an HTTP internal-post endpoint that defaulted to the root chat JID and silently dropped messages in branch sessions.

---

## Common Azure-specific failure modes

### Silent streaming throttle/exhaustion

Symptoms:

- `response.failed`
- `error: null`
- empty output

Typical cause:

- the request consumed too much of the model deployment's token-per-minute budget

Mitigations in this extension:

- proactive input-budget trimming
- longer retry backoff
- user-visible retry feedback

### Silent validation failure

Typical causes:

- invalid tool schema
- missing `function_call.arguments`
- oversized or invalid replayed tool history
- unsupported request fields

Mitigations in this extension:

- schema sanitization
- argument sanitization
- tool-history cleanup
- Azure-safe ID normalization

### Missing output text

Typical cause:

- the request did not force normal text output formatting

Mitigation:

- the extension injects a text format block for Azure Responses requests

---

## Harness and upstream Responses notes (2026-04-15)

### Harness surfaces

Development validation currently uses:

- `runtime/scripts/azure-openai-harness.ts`
- `runtime/extensions/experimental/azure-openai.harness.ts`
- `runtime/src/extensions/azure-openai-api.ts`

The harness now bundles under:

- `/workspace/piclaw/.tmp/azure-openai.harness.bundle.mjs`

That avoids Bun resolving dependencies from `/workspace/node_modules` instead of this repo's `node_modules` tree.

### Request/session correlation status

The live Azure extension now mirrors the active session id into:

- `prompt_cache_key`
- `session_id`
- `x-client-request-id`

for Azure Responses requests on the supported path.

Focused Azure harness runs on the upgraded `0.67.2` stack were validated for:

- models: `gpt-5-3-codex`, `gpt-5-4`
- cases: `json`, `tool`, `history`

Representative reports:

- `/workspace/tmp/azure-openai-harness-0672-gpt53.json`
- `/workspace/tmp/azure-openai-harness-0672-gpt54.json`

The harness now checks these invariants automatically and fails if:

- `prompt_cache_key` drifts from the active session id where required
- `session_id` / `x-client-request-id` drift from the active session id
- replayed request payloads still contain leaked `partialJson` scratch buffers

Optional Azure-native request-id mirroring remains available in the harness via:

- `AOAI_EXPERIMENT_AZURE_CLIENT_REQUEST_ID=1`

and also passed focused `json` / `tool` / `history` validation on `gpt-5-3-codex`:

- `/workspace/tmp/azure-openai-harness-0672-gpt53-xms.json`

### Upstream `0.67.2` Responses impact

The `0.67.2` pi-mono update matters for Azure because the shared Responses parser now strips `partialJson` scratch buffers when finalizing tool calls and on error paths.

That matters here because this extension's wrapper imports the shared Responses implementation through `runtime/src/extensions/azure-openai-api.ts`.

Current state:

- the repo is now on the `0.67.2` package set
- focused Azure `json` / `tool` / `history` validation passed on the upgraded stack
- the live Azure extension was updated explicitly to match the upstream-style session-correlation behavior rather than relying on the dependency bump alone

## Troubleshooting checklist

1. Confirm the model is routed through the Azure custom API name, not a global OpenAI handler.
2. Confirm auth mode and resource configuration are correct.
3. If a stream fails silently, compare request size to deployment TPM limits.
4. If needed, replay the same payload non-streaming to get a clearer validation error.
5. Check stream logs for request summaries, tool-call counts, and trim behavior.
6. If failures persist, reduce replayed tool history or raise deployment capacity.

Useful log filter:

```bash
journalctl --user -u piclaw.service --no-pager | rg "azure-openai\] Stream"
```

---

## Source files

- `runtime/extensions/integrations/azure-openai.ts`
- `runtime/src/extensions/azure-openai-api.ts`
- `runtime/src/utils/azure-tool-call-limit.ts`

---

## Summary

This extension is more than a thin Azure transport adapter. It adds the Azure-specific behavior piclaw needs to make Azure OpenAI usable in long-running tool-heavy sessions:

- safe provider registration
- managed-identity auth
- Responses API streaming
- GPT-5 reasoning support
- Codex phase replay
- tool-call and schema sanitization
- proactive history trimming
- token-budget-aware request shaping
- throttle-aware retries
- workspace-friendly image output

Those safeguards are the main reason this extension exists as a separate integration layer instead of relying on the generic OpenAI path.

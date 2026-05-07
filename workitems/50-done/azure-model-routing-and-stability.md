---
id: azure-model-routing-and-stability
title: Harden Azure / Foundry model routing and stability
status: done
priority: high
created: 2026-03-10
updated: 2026-04-15
completed: 2026-04-12
target_release: next
estimate: M
risk: medium
tags:
  - work-item
  - kanban
  - azure
  - llm
  - harness
  - foundry
owner: pi
---

# Harden Azure / Foundry model routing and stability

## Summary

Use the Azure harness evidence to ship a **narrow first production port** for
Azure / Foundry model stability instead of leaving the remaining work as one
large blended bucket.

The first shipped tranche should focus on three concrete outcomes:

1. `gpt-5-4-pro` is treated as **Responses-only** and never routed through chat completions.
2. `gpt-5-mini` gets explicit **tool-flow guardrails** based on the harness findings instead of being left as an unstable default path.
3. Foundry compat fixes proven in the harness for `mistral-large-3` are ported into the live provider path in a minimal, targeted way.

## Problem Statement

The harness work already reduced the uncertainty substantially, but the ticket
still mixes three different kinds of follow-up:

- pure routing correctness (`gpt-5-4-pro`)
- model-specific stability policy (`gpt-5-mini`)
- provider compatibility handling (Foundry / `mistral-large-3`)

That is enough to be actionable, but it is still too broad unless the first
production slice is explicitly chosen.

## Harness findings to carry forward

From `notes/azure-openai-harness.md` and the recorded artifacts:

### Stable controls
- `gpt-5-4`
- `gpt-5-4-pro`
- `gpt-5-3-codex`
- `gpt-4o-mini`

### Main unstable case
- `gpt-5-mini`

### Specific conclusions
- `gpt-5-4-pro` is stable but must stay on the **Responses** path.
- `gpt-5-mini` instability correlates most strongly with **tool-heavy runs at reasoning=high**.
- `gpt-5-mini` is much more stable at `minimal`, and workable-but-not-perfect at `medium`.
- Foundry `mistral-large-3` becomes functionally compatible with the harness compat fixes, but remains sensitive to 429 pressure and benefits from larger cooldown/backoff.
- `gpt-5-4` remains a stable control and validates the harness itself.

## First production-port slice (locked)

Lock the first implementation pass to:

### Slice 1 — Responses-only route guarantee for `gpt-5-4-pro`
- ensure model selection and request shaping always pick the Responses path
- add an explicit regression test so chat-completions routing cannot regress silently

### Slice 2 — Guardrail policy for `gpt-5-mini` tool flows
- do **not** treat `gpt-5-mini` as a normal unrestricted tool-flow model
- cap or normalize the effective reasoning level for tool-heavy runs
- prefer the smallest policy that matches the harness evidence:
  - avoid `reasoning=high` on tool-heavy paths
  - keep `tool_choice=required` available if needed where the harness showed benefit
- if the policy still leaves known instability, document and guard it explicitly rather than pretending it is solved

### Slice 3 — Minimal Foundry compat port
- port only the proven compat changes needed for the live provider path:
  - request-shape differences
  - tool/result ordering expectations
  - rate-limit-aware retry/backoff handling where appropriate
- do **not** broaden this first slice into a full compat-matrix refactor yet

## Out of scope for the first slice

- a full declarative compat-matrix/config refactor across all Azure providers
- generic policy engines above every provider
- broad N-provider config cleanup unless required directly by the first port
- solving all quota/throughput behavior for Foundry beyond the minimal live guardrails needed for correctness and repeatability
- broad Azure feature work unrelated to the harness findings

## Desired Behavior

- `gpt-5-4-pro` never uses the wrong transport.
- `gpt-5-mini` no longer defaults into its most failure-prone tool-flow configuration.
- Foundry models that passed in the harness can use equivalent compat behavior in the live provider path.
- The harness can be rerun against the same targets and still justify the live policy choices.
- Any intentionally deferred broader refactor is called out explicitly rather than implicitly left inside this ticket.

## Acceptance Criteria

- [ ] `gpt-5-4-pro` always routes through the correct Responses path.
- [ ] A focused regression test exists for Responses-only routing.
- [ ] `gpt-5-mini` repeated tool/history runs are either stabilized enough for the shipped policy or explicitly guarded/documented.
- [ ] The shipped `gpt-5-mini` policy reflects the harness evidence rather than a generic guess.
- [ ] Foundry compat fixes proven in the harness are ported into the real provider path where appropriate.
- [ ] At least one production-like provider configuration is validated after the port.
- [ ] Harness results are repeatable and documented, with the chosen live guardrails linked in `## Updates`.
- [ ] Deferred broader compat/config work is captured explicitly if not shipped in this first slice.

## Implementation Paths

### Path A — targeted production port of proven guardrails (recommended)
1. Port the minimal proven Foundry compat knobs into the live provider path.
2. Add an explicit Responses-only route guarantee for `gpt-5-4-pro`.
3. Add a narrow `gpt-5-mini` policy for tool-heavy runs based on the harness matrix.
4. Add focused tests for routing, payload shape, guardrails, and failure handling.

**Pros:**
- smallest path from harness evidence to shipped reliability
- keeps the first tranche measurable
- avoids over-refactoring before the policy is proven useful in the live path

**Cons:**
- still introduces model-specific logic that must be documented clearly
- may leave some technical debt for later compat generalization

### Path B — unified compatibility matrix in config
1. Introduce formal compat schema per model/provider in the live extension.
2. Encode request-shape differences declaratively.
3. Drive routing, max-token fields, tool ordering, and reasoning support from compat flags.

**Pros:**
- scalable long-term shape
- cleaner for future Azure/Foundry growth

**Cons:**
- larger refactor than the immediate production need
- risks delaying fixes that are already well understood

### Path C — provider-agnostic policy layer above transport
1. Add a preflight policy resolver that adjusts stream options by model/case.
2. Keep provider transport thinner and centralize fallback/retry behavior above it.

**Pros:**
- reusable abstraction if many providers need policy overlays

**Cons:**
- can obscure transport-specific nuances that are central to the current Azure / Foundry findings

## Recommended Path

Execute **Path A** now.

Shape the code so it can grow toward **Path B** later, but do not hold the first
production port hostage to the larger refactor.

## Likely implementation surfaces

- `runtime/extensions/integrations/azure-openai.ts`
  - live provider path to harden
- `runtime/extensions/experimental/azure-openai.harness.ts`
  - harness-only comparison source for proven compat behavior
- `runtime/scripts/azure-openai-harness.ts`
  - repeatability / rerun surface for validation
- `runtime/src/extensions/azure-openai-api.ts`
  - shared request-shaping transport utilities
- `runtime/test/extensions/azure-openai-streaming.test.ts`
- `runtime/test/extensions/azure-openai-tool-call-limit.test.ts`

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `gpt-5-mini` still has residual instability even after the first guardrails | medium | document the shipped policy limits explicitly and keep the policy narrow and evidence-based |
| Foundry quota pressure hides functional correctness | medium | separate functional compat from throughput/quota concerns in tests and notes |
| The first slice grows into a full compat refactor | medium | keep the DoD tied to the three locked slices only |
| Model-specific rules become hard to reason about | medium | record the harness evidence directly in ticket updates and tests |

## Test Plan

- Re-run harness matrices for the targeted Azure / Foundry models with documented settings:
  - `gpt-5-4-pro` control
  - `gpt-5-mini` tool/history stress
  - `mistral-large-3` Foundry compat pass
- Add or extend provider tests for:
  - Responses-only routing
  - payload-shape differences
  - retry/guardrail behavior
  - failure handling
- Validate at least one production-like provider configuration after porting the proven harness fixes.
- Record exact commands/artifacts in `## Updates` when the work lands.

## Definition of Done

- [ ] All acceptance criteria satisfied and verified
- [ ] Harness evidence recorded in `## Updates`
- [ ] Live provider path updated and tested where applicable
- [ ] Deferred compat follow-ups captured as tickets if not shipped
- [ ] Quality score ≥ 9 recorded in final update
- [ ] Ticket front matter updated (`status`, `updated`, `completed`)
- [ ] Ticket moved to `50-done/`

## Updates

### 2026-04-15
- Documentation follow-up completed for the repo-side/public notes.
- Updated:
  - `docs/azure/azure-openai-extension.md`
  - `docs/development.md`
- Captured the current harness/runtime paths:
  - `runtime/scripts/azure-openai-harness.ts`
  - `runtime/extensions/experimental/azure-openai.harness.ts`
  - `runtime/extensions/integrations/azure-openai.ts`
  - `runtime/src/extensions/azure-openai-api.ts`
- Recorded the harness bundling-path fix: the harness now bundles under `/workspace/piclaw/.tmp/azure-openai.harness.bundle.mjs` so Bun resolves this repo's dependency tree instead of `/workspace/node_modules`.
- Upgraded the pi-mono package set to `0.67.2`:
  - `@earendil-works/pi-coding-agent`
  - `@earendil-works/pi-agent-core`
  - `@earendil-works/pi-ai`
  - `@earendil-works/pi-tui`
- Updated the live Azure Responses path to mirror the active session id into:
  - `prompt_cache_key`
  - `session_id`
  - `x-client-request-id`
- Tightened the harness so it now fails on:
  - request/session-id drift
  - leaked `partialJson` scratch buffers in replayed request payloads
- Validated focused Azure harness runs on the upgraded stack:
  - models: `gpt-5-3-codex`, `gpt-5-4`
  - cases: `json`, `tool`, `history`
  - result: all tested runs passed
- Optional Azure-native `x-ms-client-request-id` experiment also passed on `gpt-5-3-codex` for `json` / `tool` / `history`.
- Representative evidence files:
  - `/workspace/tmp/azure-openai-harness-0672-gpt53.json`
  - `/workspace/tmp/azure-openai-harness-0672-gpt54.json`
  - `/workspace/tmp/azure-openai-harness-0672-gpt53-xms.json`

### 2026-04-11
- Lane change: `10-next` → `40-review`.
- Review-ready after the Azure / Foundry routing and stability pass landed, including GPT-5.4 routing fixes, Azure Responses replay/schema sanitization, silent-throttle handling, proactive request-budget trimming, and extension/documentation cleanup.
- Evidence: commits `a88e5e36` and `5882e0ab`.
- Validation: `bun test runtime/test/extensions/azure-openai-tool-call-limit.test.ts runtime/test/extensions/azure-openai-routing.test.ts`; `bun run quality` passed.
- Quality: ★★★★☆ 8/10 (problem: 2, scope: 2, test: 2, deps: 1, risk: 1)
- Gap: review should confirm the live Azure behavior remains stable under real long, tool-heavy turns after deployment.

### 2026-04-06
- Refinement pass completed to lock the first production-port slice instead of leaving the Azure / Foundry work as one blended next-up item.
- Locked the first shipped tranche to three deliverables:
  - Responses-only route guarantee for `gpt-5-4-pro`
  - explicit guardrail policy for `gpt-5-mini` tool-heavy flows
  - minimal Foundry compat port for the proven `mistral-large-3` harness fixes
- Carried forward the strongest harness conclusions directly into the ticket so the implementation path is now evidence-led rather than exploratory.
- Kept the broader compat-matrix/config refactor explicitly out of the first slice.
- Quality: ★★★★☆ 8/10 (problem: 2, scope: 2, test: 2, deps: 1, risk: 1)
- Gap: the remaining open execution choice is the exact `gpt-5-mini` shipped policy (for example medium-cap only vs stronger restriction on some tool paths).

### 2026-03-28
- Lane retained: `10-next` via web next-card decision.
- Next-lane outcome recorded from the adaptive-card submission: **Keep in Next**.
- The ticket remains a ready candidate, but there was no decision to pull it into active WIP yet.

### 2026-03-28
- Lane change: `30-blocked` → `10-next` via web blocked-card decision.
- Blocked-lane outcome recorded from the adaptive-card submission: **Move to Next**.
- The recorded blocker was time/prioritization rather than a hard dependency, so the ticket is parked in the ready queue instead of blocked.

### 2026-03-28
- Card submission accepted with decision `next`.
- Lane change: `30-blocked` → `10-next` because the item is no longer being treated as actively blocked; it is deferred behind other priorities but remains a ready next-up candidate.
- Existing harness findings, porting paths, and notes remain valid for the next work window.

### 2026-03-12
- Board quality review: added explicit test plan and DoD checklist.
- Quality: ★★★★☆ 7/10 (problem: 2, scope: 2, test: 1, deps: 1, risk: 1)
- Gap: still blocked on time/priority and needs the first production-port slice selected.

### 2026-03-11
- Lane change: `doing` → `blocked`.
- Blocked on time availability / competing priorities.
- Existing harness findings and implementation paths remain valid for the next work window.

### 2026-03-11 (late)
- v1.2.0 released without Azure routing changes (non-harness work shipped).
- Harness artifacts remain untracked: `runtime/extensions/experimental/azure-openai.harness.ts`, `runtime/scripts/azure-openai-harness.ts`.
- Matrix test results in `/workspace/tmp/aoai-matrix-20260310/`.
- ~50% complete. Remaining: port proven guardrails into real provider code.
- Identified need: refactor extension to support N providers from config instead of hardcoded primary/secondary blocks. Current `azure-openai-2` East US provider was added as a copy-paste block — should become data-driven (array of `{ resource, region, modelIds, api }`) so adding a third region or swapping models is config-only.
- This aligns with **Path B** (unified compat matrix) and should be done as part of a later broader refactor unless the first slice forces it sooner.

### 2026-03-11
- Added explicit implementation-path analysis for production porting.
- Marked recommended path as targeted guardrails + compat-port from harness findings.

### 2026-03-10 (late matrix pass)
- Ran expanded unstable-provider matrix and added `gpt-5-4` control:
  - artifacts under `/workspace/tmp/aoai-matrix-20260310/`
- Added harness switches for this investigation:
  - `--force-tool-choice-required`
  - transformed-payload capture improvements
- Findings:
  - `gpt-5-mini`: failures correlate strongly with `reasoning=high` on tool runs (`missing_tool_call` dominant), with occasional aborts on 2-round medium tool follow-up.
  - `mistral-large-3`: functional with compat changes, but highly 429-sensitive; `cooldown-ms=10000` gave clean pass while lower cooldown produced one strict-format history mismatch.
  - `gpt-5-4`: all matrix control runs passed (`10/10`).

### 2026-03-10
- Promoted from next to doing.
- Renamed to a clearer slug filename.
- Harness created at `runtime/scripts/azure-openai-harness.ts`.
- Harness provider copy created at `runtime/extensions/experimental/azure-openai.harness.ts`.
- Notes captured in `notes/azure-openai-harness.md`.
- Current findings:
  - Stable controls: `gpt-5-4`, `gpt-5-4-pro`, `gpt-5-3-codex`, `gpt-4o-mini`
  - Unstable: `gpt-5-mini`
  - Foundry `mistral-large-3` can pass with compat + retry/cooldown in the harness.

## Notes

Important report files:
- `/workspace/tmp/azure-openai-harness-full.json`
- `/workspace/tmp/azure-openai-harness-focus-openai-v2.json`
- `/workspace/tmp/azure-openai-harness-focus-foundry-v3.json`
- `/workspace/tmp/azure-openai-harness-gpt5mini-payloads.json`
- `/workspace/tmp/azure-openai-harness-gpt54pro-control.json`
- `/workspace/tmp/azure-openai-harness-mistral-payloads.json`

Payload captures for failing runs:
- `/workspace/tmp/azure-openai-harness-payloads/`

## Links

- `notes/azure-openai-harness.md`
- `runtime/scripts/azure-openai-harness.ts`
- `runtime/extensions/experimental/azure-openai.harness.ts`
- `runtime/extensions/integrations/azure-openai.ts`
- `runtime/src/extensions/azure-openai-api.ts`
- `runtime/test/extensions/azure-openai-streaming.test.ts`
- `runtime/test/extensions/azure-openai-tool-call-limit.test.ts`

### 2026-04-10
- All three slices implemented and shipped in commit `82f15fe6`.
- **Slice 1:** `RESPONSES_ONLY_MODELS` set + explicit guard for `gpt-5-4-pro` when ARM caps report `responses=false`.
- **Slice 2:** `capToolFlowReasoning()` exported and tested; caps `gpt-5-mini` to `medium` when tools are present.
  - Harness validation: `high` → 0/4 pass (unchanged model behavior); `medium` → 4/4 pass.
  - The live extension will cap `high` to `medium` for tool-heavy flows automatically.
- **Slice 3:** Foundry `compat` object added to model registration:
  - `supportsStore: false`, `maxTokensField: "max_tokens"`, `supportsReasoningEffort: false`, `requiresAssistantAfterToolResult: true`
  - Harness validation: `mistral-large-3` passes 4/4 with 10s cooldown.
- Also fixed `resolvePiAiResponsesSharedModulePath` fallback for bundled harness contexts.
- New test file: `runtime/test/extensions/azure-openai-routing.test.ts` (13 tests).
- Full quality gate green: 1824 pass, 0 fail.
- Quality: ★★★★☆ 9/10 (problem: 2, scope: 2, test: 2, deps: 2, risk: 1)
- Remaining gap: broader compat-matrix/config refactor deferred to a future ticket.

### 2026-04-11
- **Root cause found for recurring `response.failed` with `error:null`:** TPM rate-limit exhaustion, not validation errors.
  - Deployment had 100K TPM; each agent turn request consumed ~68k input tokens.
  - Agent tool-call loops fire 5–7 requests per turn → 476k tokens in ~2 minutes → ~4.7× over budget.
  - Azure Responses API streaming does not return 429 or Retry-After for TPM overruns; it returns `response.failed` with `error:null` and `output:[]`.
  - Non-streaming replay succeeded because prompt caching reduced cost and the rate window had moved.
- **Deployment quota increased** via `az cognitiveservices account deployment create`:
  - `gpt-5-4`: 100 → 500 capacity (100K → 500K TPM)
  - `gpt-5-3-codex`: 100 → 500 capacity (100K → 500K TPM)
- **Rate-limit-aware retry backoff** added to the extension:
  - Detects `response.failed` + `error:null` + empty output as likely TPM exhaustion.
  - Uses 15-second backoff instead of 2–4 seconds.
- Earlier fixes (tool-schema sanitization, function_call.arguments) were valid bugs but not the cause of this specific live failure.
- Updated `docs/azure/azure-openai-extension.md` with rate-limit troubleshooting guidance.
- Updated `notes/azure-openai-harness.md` with diagnostic procedure and file path corrections.
- Quality: ★★★★★ 9/10 (problem: 2, scope: 2, test: 2, deps: 2, risk: 1)

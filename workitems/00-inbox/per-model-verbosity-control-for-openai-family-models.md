---
id: per-model-verbosity-control-for-openai-family-models
title: Add per-model verbosity control (OpenAI Responses family) with web-first UX
status: inbox
priority: medium
created: 2026-03-18
updated: 2026-03-18
target_release: next
estimate: M
risk: medium
tags:
  - work-item
  - kanban
  - web
  - models
  - extensions
  - openai
owner: pi
---

# Add per-model verbosity control (OpenAI Responses family) with web-first UX

## Summary

Evaluate whether PiClaw can implement functionality similar to npm package
`pi-verbosity-control` (per-model `text.verbosity` injection + quick cycling)
without relying on fragile TUI-only monkeypatches.

## Conclusion

**Yes — we can implement this in PiClaw with no architectural blocker.**

Feasibility assessment:

- Request-time payload rewriting is already supported via Pi extension hook
  `before_provider_request`.
- PiClaw already has model/thinking control surfaces and APIs we can extend.
- A web-first UX is preferable to the package’s `FooterComponent` monkeypatch.

Recommended stance:

1. Implement the **core behavior** (per-model verbosity config + request patching).
2. Implement **web-native controls** (model popup/command/tool), not TUI footer hacks.
3. Keep config **workspace-persistent** (inside `/workspace/.pi/...`) for container reliability.

## Evidence checked

- npm package behavior (`pi-verbosity-control@0.1.0`) shows:
  - `before_provider_request` payload mutation
  - shortcut cycling
  - `FooterComponent` monkeypatch for inline verbosity display
- Upstream docs in installed `@earendil-works/pi-coding-agent` confirm
  `before_provider_request` is a supported extension event.
- PiClaw codebase already mutates OpenAI-family payloads in Azure extension
  (`extensions/integrations/azure-openai.ts`, sets `text.verbosity = "medium"` under specific conditions).
- PiClaw web stack already exposes model state via `/agent/models` and model popup in compose.

## Scope

- Per-model verbosity values: `low | medium | high`.
- Apply to supported APIs only:
  - `openai-responses`
  - `openai-codex-responses`
  - `azure-openai-responses` (and PiClaw variants as applicable)
- Config precedence:
  - exact `provider/model` key first
  - bare model id fallback
- Web-visible current verbosity for active model.

## Out of scope

- TUI footer monkeypatching (`FooterComponent` patch) in PiClaw web flows.
- Introducing provider-specific verbosity behavior beyond OpenAI Responses family.

## Recommended implementation path

### Phase 1 — backend extension

- Add builtin extension, e.g. `src/extensions/model-verbosity.ts`:
  - load/save config JSON
  - resolve effective verbosity for current model
  - hook `before_provider_request` and patch payload safely
- Register in `src/extensions/index.ts`.

### Phase 2 — controls

- Add one control path (or both):
  - tool(s): `get_verbosity_state`, `set_verbosity`
  - command: `/verbosity [low|medium|high|off] [provider/model|model]`
- Keep semantics aligned with existing model-control tools.

### Phase 3 — web UX

- Extend `/agent/models` response (or add dedicated endpoint) to expose
  active verbosity.
- Show current verbosity in compose model metadata/popup.
- Optional: add cycle affordance in model popup.

## Risks / caveats

- Provider payload drift: must patch defensively and preserve unknown fields.
- Config write races across sessions: use atomic write strategy.
- Avoid leaking TUI assumptions into web UI.
- Decide whether `off` means “remove override” or explicit disable key.

## Acceptance Criteria

- [ ] Extension applies configured verbosity at `before_provider_request` for supported APIs.
- [ ] Exact key (`provider/model`) overrides bare model key.
- [ ] Unsupported APIs are untouched.
- [ ] Users can view/set verbosity through at least one first-class interface (tool or command).
- [ ] Web model UI shows active verbosity for current model.
- [ ] Tests cover config parsing/precedence and payload patch behavior.

## Test Plan

- [ ] Unit tests for config parse/precedence/cycling behavior.
- [ ] Unit tests for payload patching by provider API type.
- [ ] Endpoint/UI tests for surfaced active verbosity.
- [ ] Run `cd /workspace/piclaw/piclaw && bun run quality` for implementation PR.

## Updates

### 2026-03-18
- Investigated npm package `pi-verbosity-control` and compared with PiClaw runtime.
- Conclusion: feature is implementable in PiClaw; prefer web-native UX over TUI monkeypatch pattern.

## Links

- `https://www.npmjs.com/package/pi-verbosity-control`
- `piclaw/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md`
- `piclaw/extensions/integrations/azure-openai.ts`
- `piclaw/src/agent-pool.ts`
- `piclaw/src/extensions/model-control.ts`
- `piclaw/web/src/components/compose-box.ts`

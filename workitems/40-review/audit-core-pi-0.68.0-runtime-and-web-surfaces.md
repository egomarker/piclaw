---
id: audit-core-pi-0.70.x-runtime-and-web-surfaces
title: Audit core Pi 0.70.x runtime and web surfaces
status: review
priority: high
created: 2026-04-21
updated: 2026-04-21
estimate: M
risk: medium
tags:
  - work-item
  - kanban
  - upstream
  - runtime
  - web
  - agent-pool
  - compatibility
owner: smith
blocked-by: []
---

# Audit core Pi 0.70.x runtime and web surfaces

## Summary

Piclaw already handled the two blocking adoption issues from `@earendil-works/pi-coding-agent@0.70.x`:

- built-in tool selection now uses tool-name allowlists
- `ExtensionUIContext` now requires `setWorkingIndicator()`

This ticket covers the rest of the **core runtime + web surface audit** so we do not stop at type compatibility. The goal is to document and tighten every Piclaw-owned runtime boundary that was touched by upstream 0.70.x behavior changes.

## Scope

### Core files to audit
- `runtime/src/agent-pool/tool-factory.ts`
- `runtime/src/agent-pool/session-manager.ts`
- `runtime/src/agent-pool/session.ts`
- `runtime/src/agent-control/command-registry.ts`
- `runtime/src/agent-control/command-parsers.ts`
- `runtime/src/agent-control/handlers/session.ts`
- `runtime/src/channels/web/theming/ui-bridge.ts`
- `runtime/web/src/ui/extension-ui-events.ts`
- `runtime/web/src/ui/app-sse-events.ts`
- `runtime/web/src/ui/app-extension-ui-sse.ts`
- `runtime/web/src/app.ts`

### Upstream behavior to verify
- tool allowlist semantics stay correct across default tools, active tools, and custom tools
- `/clone` semantics match current-branch duplication, not `/fork`-from-user-message behavior
- web `ExtensionUIContext` stays in lockstep with upstream interface additions
- built-in tool hook/context behavior still matches Piclaw hook assumptions
- shell-path / cwd behavior follows session cwd, not process cwd

## Acceptance Criteria

- [x] Document the exact Piclaw-owned runtime/web boundaries touched by Pi 0.70.x.
- [x] Verify that tool-name allowlists behave correctly for:
  - [x] default session bootstrap
  - [x] `activate_tools`
  - [x] `reset_active_tools`
  - [x] custom tool overrides
- [x] Verify that `/clone` is wired and tested as “duplicate current active branch into a new session”.
- [x] Verify that web `ExtensionUIContext` implements all upstream-required methods and note which are real vs placeholder implementations.
- [x] Produce explicit follow-ups where compatibility exists but product behavior is still missing.
- [x] Add or update regression coverage for the audited core surfaces.

## Detailed changes to make

### 1. Tool allowlist audit
- confirm `AgentToolFactory.createDefaultTools()` remains name-based by design
- verify interaction with:
  - `runtime/src/extensions/tool-activation.ts`
  - session bootstrap in `agent-pool/session-manager.ts`
- confirm no callers still assume built-in tool objects are passed through

### 2. Slash command/runtime audit
- verify `/clone` behavior in:
  - parser
  - command registry
  - session handler
  - runtime fork semantics
- record any follow-up needed for richer `before` vs `at` semantics in web UX

### 3. Web bridge compatibility audit
- document current mapping status for:
  - `setStatus`
  - `setWorkingMessage`
  - `setWorkingIndicator`
  - `setWidget`
  - `notify`
  - `custom`
- identify which surfaces need real web support rather than no-op compatibility

### 4. Cwd / shell-path audit
- verify session cwd correctness where bash/edit/read/write are created or wrapped
- verify no Piclaw-local wrapper still leaks ambient `process.cwd()` assumptions into session-specific behavior

## Extensions and subsystems to audit as part of core impact
- `tool-activation`
- `internal-tools`
- `ssh-core`
- `keychain-tools`
- packaged `context-mode`

## Implementation Paths

### Path A — Narrow runtime audit
- add only regression coverage and notes
- no feature work unless a concrete mismatch is found

### Path B — Audit plus hardening
- fix any drift discovered during the audit
- land regression tests in the same change set

### Preferred
- Path B

## Test Plan

- Applicable regression classes from `workitems/regression-test-planning-reference.md`:
  - [x] Bug replay / known-regression test
  - [x] State-machine / invariant test
  - [x] Routing matrix test
  - [ ] Interaction scenario test
  - [ ] Restore / reconnect matrix test
  - [x] Pane / viewer contract test
  - [ ] Real-browser smoke test

### Existing tests to rerun
- `runtime/test/agent-control/parser.test.ts`
- `runtime/test/agent-control/agent-control-handlers.test.ts`
- `runtime/test/agent-control/fuzz-audit.ts`
- `runtime/test/agent-pool/tool-factory.test.ts`

### Coverage to add or extend
- `/clone` behavior coverage if any edge is still missing
- tool-activation coverage for built-in allowlist behavior
- web bridge contract coverage for required `ExtensionUIContext` methods

## Definition of Done

- [x] All acceptance criteria satisfied and verified
- [x] Tests added or updated — passing locally
- [x] Type check clean
- [x] Docs and notes updated with links to ticket
- [x] Operational impact assessed
- [x] Follow-up tickets created for deferred scope
- [x] Update history complete with evidence
- [x] Ticket front matter updated

## Update history

- 2026-04-21: Reconciled the core 0.70.x audit against landed changes (`/clone`, tool-name allowlists, and web `ExtensionUIContext.setWorkingIndicator`).
- 2026-04-21: Recorded the exact Piclaw-owned runtime/web boundaries touched by the upstream bump in `runtime/test/workitems/upstream-068-audit-summary.md`.
- 2026-04-21: Confirmed no remaining product gap in the core runtime/web surface beyond optional polish items already tracked separately.
- 2026-04-21: Added/ran focused regression coverage tying built-in and packaged progress adoption back to the audited core web bridge.

## Evidence

- `runtime/test/workitems/upstream-068-audit-summary.md`
- `runtime/test/extensions/upstream-068-builtins-and-integrations.test.ts`
- `runtime/test/agent-pool/tool-factory.test.ts`
- `runtime/test/agent-control/agent-control-handlers.test.ts`
- `runtime/test/channels/web/tool-status-hints.test.ts`

## Links

- Parent: `workitems/20-doing/adopt-pi-coding-agent-0.70.x-followups-and-web-progress-mapping.md`

---
id: adopt-pi-coding-agent-0.70.x-and-runtime-followups
title: Adopt pi-coding-agent 0.70.x and apply Piclaw-side follow-ups
status: next
priority: high
created: 2026-04-17
updated: 2026-04-19
estimate: M
risk: medium
tags:
  - work-item
  - kanban
  - upstream
  - dependencies
  - runtime
  - extensions
  - tests
owner: smith
blocked-by: []
---

# Adopt pi-coding-agent 0.70.x and apply Piclaw-side follow-ups

## Summary

Piclaw is still pinned to `@earendil-works/pi-coding-agent@0.67.6`, while upstream
has moved to `0.70.x`.

A temporary bump assessment against `0.70.x` passed Piclaw typecheck and a
focused regression slice, so the dependency upgrade itself looks low-risk.

The more important follow-up is to use the newer upstream runtime surfaces and
bugfixes to harden Piclaw in the places that already depend on extension hooks,
tool-result handling, packaged runtime launch behavior, and file-discovery
assumptions.

This ticket tracks both:

1. the dependency bump itself, and
2. the Piclaw-local work that should accompany or follow it.

## Why this matters

- Piclaw is already relying on a large amount of upstream Pi runtime behavior.
- Upstream `0.70.x` includes fixes and hook surfaces that are directly useful
  for Piclaw's extension-heavy runtime.
- We should not only bump the dependency; we should also harden the Piclaw code
  paths that benefit from the upstream changes.

## Acceptance Criteria

- [ ] Piclaw is bumped to `@earendil-works/pi-coding-agent@0.70.x` with lockfile
      updates.
- [ ] Matching transitive runtime packages (`pi-agent-core`, `pi-ai`, `pi-tui`)
      are updated via the lockfile.
- [ ] Piclaw has an explicit plan and implementation for provider-response
      diagnostics using `after_provider_response`.
- [ ] Piclaw has stronger regression coverage around error `tool_result`
      handling and hook-driven post-processing.
- [ ] Piclaw has regression coverage for `find`-tool-dependent discovery paths
      we rely on operationally.
- [ ] Packaged/service launch paths are audited for `PI_PACKAGE_DIR`-sensitive
      behavior and updated if needed.
- [ ] Typecheck passes after the bump.
- [ ] Focused regression suites pass after the bump.

## Detailed application areas

### 1. Dependency bump

#### Files to update
- `package.json`
- `bun.lock`

#### Validation surfaces already proven in assessment
- `runtime/test/agent-pool/run-agent-orchestrator.test.ts`
- `runtime/test/agent-pool/session-manager.test.ts`
- `runtime/test/extensions/extensions-keychain-tools.test.ts`
- `runtime/test/extensions/ssh-core.test.ts`
- `runtime/test/extensions/extensions-internal-tools.test.ts`
- `runtime/test/extensions/extensions-workspace-search.test.ts`

### 2. Provider-response diagnostics via `after_provider_response`

#### Why
Upstream now exposes `after_provider_response`, which is a better fit for
provider HTTP diagnostics than ad-hoc post-failure logging.

#### Where we should apply it
- Add a new extension module, likely under:
  - `runtime/src/extensions/provider-response-diagnostics.ts`
- Register it from:
  - `runtime/src/extensions/index.ts`
- Feed it into any existing logging/diagnostic helpers used by runtime and web
  flows:
  - `runtime/src/utils/logger.ts`
  - `runtime/src/runtime.ts`
  - optionally `runtime/src/channels/web/*` status surfaces if we decide to
    surface rate-limit/provider headers to the web UI later

#### Behaviors to cover
- log `429` responses with normalized rate-limit headers
- log `5xx` responses in a provider-aware way
- capture auth/permission failures without leaking secrets
- preserve low-noise behavior during normal successful streaming

#### Tests to add
- `runtime/test/extensions/provider-response-diagnostics.test.ts`
- optional integration-style smoke around extension registration order if the
  hook needs to coexist with other extensions

### 3. Error `tool_result` / hook-path regression coverage

#### Why
Upstream fixed multiple error-path issues around tool results and `afterToolCall`
style handling. Piclaw already depends on tool-result post-processing.

#### Where we should strengthen Piclaw
- `runtime/src/extensions/keychain-tools.ts`
  - redaction path for non-keychain tool outputs
- `runtime/src/extensions/file-attachments.ts`
  - nested `tool_result` block sanitization
- any extension/hook path that expects structured tool error details to survive
  processing

#### Existing files to extend first
- `runtime/test/extensions/extensions-keychain-tools.test.ts`
- `runtime/test/extensions/extension-hook-determinism.test.ts`
- `runtime/test/agent-pool/session-persistence-sanitizer.test.ts`

#### Specific scenarios to cover
- error `tool_result` retains `details`
- error `tool_result` retains `isError`
- keychain redaction still applies when the tool result is already marked as an
  error
- nested tool-result content remains sanitized for attachments and content blocks
- one failing hook in a multi-tool turn does not cause unrelated tool results to
  disappear from downstream handling

### 4. `find`-tool-dependent discovery regressions

#### Why
Upstream fixed path-glob and nested `.gitignore` behavior in the built-in `find`
tool. Piclaw prompts and workflows explicitly steer agents toward repo/workspace
file discovery.

#### Where Piclaw should add coverage
- `runtime/test/extensions/extensions-internal-tools.test.ts`
  - keep discovery guidance pointing agents to `find` where appropriate
- add a dedicated regression file, likely:
  - `runtime/test/extensions/find-tool-regressions.test.ts`
  or
  - `runtime/test/runtime/find-tool-regressions.test.ts`

#### Scenarios to cover
- path-based glob queries such as `src/**/*.ts` return expected results
- sibling `.gitignore` files do not suppress matches outside their subtree
- discovery-oriented prompts still behave correctly when the upstream `find`
  implementation is exercised through a real session/tool call

#### Candidate fixture locations
- temp workspaces created via `runtime/test/helpers.ts`
- small synthetic repo trees embedded inside the new regression test file

### 5. Packaged runtime / `PI_PACKAGE_DIR` audit

#### Why
Upstream fixed package-asset resolution to honor `PI_PACKAGE_DIR`. Piclaw should
verify that its packaged/service-managed entry paths do not accidentally depend
on older implicit resolution behavior.

#### Where we should inspect first
- `supervisor/run-piclaw.sh`
- `entrypoint.sh`
- `supervisor/conf.d/piclaw.conf`
- `scripts/smoke-install-from-repo.sh`
- `scripts/docker/publish-smoke-test.sh`
- `Makefile`
- docs describing install/layout behavior:
  - `docs/install-from-repo.md`
  - `docs/configuration.md`

#### Concrete questions
- Do we want to export `PI_PACKAGE_DIR` explicitly in supervisor-managed runs?
- Do smoke/install paths still resolve bundled assets correctly after the bump?
- Are reload/local-install flows depending on today’s implicit package layout?

#### Tests / validation to add or rerun
- packaged install smoke already in repo:
  - `scripts/smoke-install-from-repo.sh`
  - `scripts/docker/publish-smoke-test.sh`
- any runtime tests that validate packaged script or asset availability

## Implementation Paths

### Path A — Minimal safe bump
- bump dependency + lockfile
- rerun the already-validated targeted suite
- land with no Piclaw code changes beyond dependency metadata
- leave the remaining items as follow-up commits under this ticket

### Path B — Bump plus immediate hardening
- bump dependency + lockfile
- add provider-response diagnostics extension
- add error `tool_result` regression tests
- add `find` regression tests
- audit `PI_PACKAGE_DIR` launch paths and patch only if a real issue is found

### Preferred approach
Path B if time permits, but keep the work split into reviewable commits:
1. dependency bump
2. provider diagnostics
3. tool-result regressions
4. find regressions
5. packaging audit updates (only if needed)

## Test Plan

- Applicable regression classes from `workitems/regression-test-planning-reference.md`:
  - [x] Bug replay / known-regression test
  - [x] State-machine / invariant test
  - [x] Routing matrix test
  - [ ] Interaction scenario test
  - [ ] Restore / reconnect matrix test
  - [ ] Pane / viewer contract test
  - [ ] Real-browser smoke test
- [x] Existing tests to rerun are listed
- [x] New regression coverage to add is listed
- [ ] Real-browser smoke pass required? If yes, record the surface

### Existing tests to rerun
- `runtime/test/agent-pool/run-agent-orchestrator.test.ts`
- `runtime/test/agent-pool/session-manager.test.ts`
- `runtime/test/extensions/extensions-keychain-tools.test.ts`
- `runtime/test/extensions/ssh-core.test.ts`
- `runtime/test/extensions/extensions-internal-tools.test.ts`
- `runtime/test/extensions/extensions-workspace-search.test.ts`

### New regression coverage to add
- `runtime/test/extensions/provider-response-diagnostics.test.ts`
- `runtime/test/extensions/find-tool-regressions.test.ts` (or runtime equivalent)
- expanded cases in:
  - `runtime/test/extensions/extensions-keychain-tools.test.ts`
  - `runtime/test/extensions/extension-hook-determinism.test.ts`
  - `runtime/test/agent-pool/session-persistence-sanitizer.test.ts`

## Definition of Done

- [ ] All acceptance criteria satisfied and verified
- [ ] Tests added or updated — passing locally
- [ ] Type check clean
- [ ] Docs and notes updated with links to ticket
- [ ] Operational impact assessed
- [ ] Follow-up tickets created for deferred scope
- [ ] Update history complete with evidence
- [ ] Ticket front matter updated

## Updates

### 2026-04-19
- Agent audit completed from board batch action.
- Findings:
  - the ticket is already well-scoped for a medium-sized upstream adoption tranche and has concrete validation surfaces
  - acceptance criteria are strong, but execution should stay ordered so the dependency bump itself lands before broader Piclaw-side hardening grows the scope too far
  - keep the first implementation pass to:
    1. bump `@earendil-works/pi-coding-agent` to `0.70.x`
    2. rerun the already-proven focused regression slice
    3. land `after_provider_response` diagnostics as the first Piclaw-local follow-up
- Recommendation: keep in `10-next/`; quality is high enough to pick up, but the implementation should be deliberately staged rather than attempted as one blended mega-change.
- Quality: ★★★★☆ 8/10 (problem: 2, scope: 2, test: 2, deps: 1, risk: 1)

### 2026-04-19
- Queued for agent audit (board batch action). Agent should review quality score, acceptance criteria, and test plan.

### 2026-04-17
- Created after assessing upstream `@earendil-works/pi-coding-agent` updates.
- Temporary bump to `0.70.x` passed Piclaw typecheck and a focused regression
  slice, so the dependency change itself looks safe.
- Captured Piclaw-local follow-up work for provider-response diagnostics,
  error-path tool-result coverage, `find` discovery regressions, and packaged
  runtime audit work.
- Promoted from inbox to next and marked high priority for planned execution.

## Notes

- Bedrock-specific follow-up/documentation is intentionally excluded from this
  ticket per request.
- This ticket should stay focused on Piclaw-side adoption/hardening, not on a
  full upstream feature inventory.
- If the packaging audit finds no real issue, keep the result as a documented
  no-op instead of forcing unnecessary launch-wrapper churn.

## Links

- Upstream package currently used by Piclaw: `@earendil-works/pi-coding-agent@0.67.6`
- Assessed upstream target: `0.70.x`
- Upstream docs: `after_provider_response`, `session_shutdown`, packaged asset
  resolution fixes, and built-in `find` behavior fixes

---
id: automatic-recovery-after-mid-turn-failures-and-context-pressure
title: Automatic recovery after mid-turn failures and context pressure
status: done
priority: high
created: 2026-04-18
updated: 2026-04-21
completed: 2026-04-21
target_release: next
tags:
  - work-item
  - kanban
  - reliability
  - recovery
  - compaction
  - context
  - web
  - agent
  - ux
owner: pi
---

# Automatic recovery after mid-turn failures and context pressure

## Summary

Piclaw still ends too many turns with user-visible fallback text like:

- `⚠️ Response ended with an error before finalization.`

This is especially bad when the model hit context pressure, auto-compaction was
in flight, or the answer had already partially streamed and the user expected the
turn to continue automatically.

The next step is to add a shared automatic recovery engine that can detect
recoverable mid-turn failures, decide whether to retry directly or compact first,
carry on automatically where safe, and surface low-noise recovery UX so the user
gets continuity instead of a dead-end warning.

The feature should be **on by default**, should cover **all agent turn paths**,
and should keep the visible success path as a **single clean final assistant
turn** while still retaining internal recovery metadata and low-noise web
observability.

## Problem Statement

Current behavior is too fragile in the face of mid-turn provider/runtime
failures:

- a turn can stream useful partial text, then collapse into a terminal warning
  instead of finishing automatically
- auto-compaction status exists, but it is not yet tied to a full “recover and
  continue the same turn” path
- context-window exhaustion and other mid-turn failures still force users to
  manually resume too often
- when recovery does happen indirectly, it is not consistently observable enough
  for operators or low-noise enough for users

We already have recovery/finalization hardening and compaction status plumbing,
but we do **not** yet have a cohesive turn-recovery policy that answers:

- which failures should retry automatically
- when to compact first vs retry first
- how many times to retry
- what to do with partial text already shown to the user
- how to avoid replaying side-effecting tools
- how to offer a clean manual resume path when automatic recovery is exhausted

## Refined v1 direction

### User outcome

When a turn fails mid-stream or mid-finalization, Piclaw should usually continue
automatically instead of dumping the user into a dead-end warning. The final
visible result should still look like one coherent assistant answer.

### Core product stance

- **On by default globally**
- **All agent turn paths are in scope**
  - chat turns
  - scheduled agent prompts
  - autoresearch / autonomous loops
  - dream / background agent flows
- **Any mid-turn failure is a recovery candidate**, except configurable
  non-recoverables
- **No automatic replay of side-effecting tools**
- **Recovery state is runtime/session only** for v1
- **If restart happens mid-recovery, fail cleanly** rather than attempting
  cross-restart continuation

## Acceptance Criteria

- [x] Recoverable mid-turn failures no longer commonly end as
      `⚠️ Response ended with an error before finalization.` when the turn can be
      continued safely.
- [x] A shared recovery engine exists for all agent turn paths, not just web
      chat turns.
- [x] Automatic recovery is enabled by default.
- [x] Recovery attempts are bounded by:
  - [x] configurable max attempts (default `2`)
  - [x] configurable total recovery budget (default `30s`)
- [x] Recovery classification distinguishes at least:
  - [x] recoverable failures
  - [x] non-recoverable failures
  - [x] compaction-failure cases
- [x] The retry ladder is classifier-driven:
  - [x] context/overflow-like failures compact first
  - [x] transient/finalization-like failures retry first and compact later
- [x] Side-effecting tools are not automatically replayed during recovery.
- [x] On successful recovery, the user-visible result is a **single final
      assistant turn**, not multiple visible failed/retry fragments.
- [x] On web, partial draft text remains visible during recovery, then collapses
      into the final cleaned answer on success.
- [x] On web, successful recovery leaves a subtle persistent marker:
  - [x] message-level chip
  - [x] turn/status metadata for inspection
- [x] On non-web channels, in-progress recovery uses best-effort existing status
      affordances only.
- [x] When automatic recovery is exhausted:
  - [x] web exposes an explicit resume affordance
  - [x] web offers both:
    - [x] Continue
    - [x] Retry cleanly
  - [x] `Retry cleanly` starts a new isolated recovery-specific run
- [x] If the process restarts during recovery, the system fails cleanly and does
      not attempt cross-restart automatic continuation in v1.
- [x] Observability includes:
  - [x] structured logs
  - [x] counters/status
  - [x] per-turn diagnostic recovery metadata
- [x] The feature materially improves all three minimum success goals:
  - [x] stop the bad UX
  - [x] preserve continuity
  - [x] make recovery observable

## Non-recoverable classifier

v1 should ship with a sensible default classifier, but keep it overrideable in
code/config later.

Default non-recoverable class should include at least:

- auth / credential failures
- model not found / missing deployment
- policy / safety refusal
- invalid request / malformed prompt/tool schema
- explicit capability mismatch / unsupported model path
- clearly permanent local permission or missing-required-resource failures

This classifier should remain a **configurable policy surface**, but v1 operator
configuration should stay minimal.

## Operator configuration surface

Keep v1 configuration intentionally small:

- enable / disable auto-recovery
- max recovery attempts
- total recovery budget

Do **not** make the first version depend on a broad operator policy matrix for:

- per-provider tuning
- per-channel tuning
- per-turn-type tuning

Those can remain internal defaults or later follow-up work.

## Implementation Paths

### Path A — Shared recovery orchestrator inside the existing run lifecycle (recommended)

Add a shared recovery layer around the turn/run lifecycle so all agent turn
paths benefit from the same classification + retry policy.

1. Identify the common turn boundary where mid-turn failure can be intercepted
   before terminal fallback publication.
2. Introduce a recovery attempt state machine that can:
   - classify the failure
   - decide retry-first vs compact-first
   - enforce max-attempt and total-time budgets
   - preserve partial/draft state while recovery is in progress
3. Prevent unsafe tool replay by reusing already persisted tool outputs and
   session state instead of re-invoking side-effecting tools.
4. On success, collapse the recovered output into one final visible assistant
   turn while attaching hidden/internal recovery metadata.
5. On exhaustion, route to:
   - web resume/retry-cleanly affordance
   - best-effort non-web status fallback

**Why recommended:** this matches the refined direction: one shared engine for
all turn paths immediately, not a web-only patch.

### Path B — Web-first recovery wrapper plus later generalization

Not the preferred direction, but useful as a fallback if the shared engine turns
out too invasive.

1. Wrap the web chat path first.
2. Validate retry and compaction policy there.
3. Extract the generic state machine later for scheduled/background turns.

**Trade-off:** lower immediate risk, but violates the chosen direction that all
turn paths should use the shared engine from the start.

## Likely implementation surfaces

### Runtime / orchestration

- `runtime/src/agent-pool/run-agent-orchestrator.ts`
- `runtime/src/channels/web/handlers/agent.ts`
- `runtime/src/channels/web/sse/agent-events.ts`
- `runtime/src/agent-pool/runtime-facade.ts`
- any queue/finalization/run-control helpers that decide terminal fallback

### Recovery / compaction behavior

- `runtime/src/extensions/smart-compaction.ts`
- any session compaction helpers / session manager hooks used before retry
- any run-control state used to distinguish active response / compaction / retry

### Web UX

- web status / turn metadata surfaces
- assistant-message rendering path for subtle recovery chip
- exhausted-recovery affordance surface (card/action/button/pill)

### Other channels / autonomous paths

- scheduled task / background agent turn entrypoints
- autoresearch / dream loop execution paths
- any unified turn runner used by those flows

## Test Plan

- Applicable regression classes from `workitems/regression-test-planning-reference.md`:
  - [x] Bug replay / known-regression test
  - [x] State-machine / invariant test
  - [x] Interaction scenario test
  - [x] Restore / reconnect matrix test
  - [x] Pane / viewer contract test
  - [ ] Real-browser smoke test
- [x] Existing tests to rerun are listed
- [x] New regression coverage to add is listed
- [ ] Real-browser smoke pass required? If yes, record the surface

### Existing tests to rerun

- `runtime/test/channels/web/web-channel.test.ts`
- `runtime/test/channels/web/web-agent-streaming.test.ts`
- `runtime/test/channels/web/web-channel-recovery-state.test.ts`
- `runtime/test/agent-pool/run-agent-orchestrator.test.ts`
- `runtime/test/extensions/smart-compaction.test.ts`
- any tests covering scheduled/background agent turn execution once the shared
  engine touches them

### New regression coverage added

- [x] failure-classification tests: recoverable vs non-recoverable vs
      compaction-failure
- [x] retry-ladder tests: retry-first vs compact-first behavior
- [x] budget tests: max attempts and total recovery timeout enforcement
- [x] side-effect guard tests proving unsafe tools are not auto-replayed
- [x] success-collapse tests proving multiple recovery attempts still produce
      one visible final assistant turn
- [x] web draft-preservation tests during recovery
- [x] web success-marker tests for message chip + status metadata
- [x] exhausted web affordance tests for Continue + Retry cleanly
- [x] restart-during-recovery tests proving the system fails cleanly and does
      not attempt automatic cross-restart continuation in v1
- [x] autonomous-path tests proving the shared engine also covers scheduled /
      background turn paths without web-only assumptions
- [x] counters/logging/diagnostic metadata tests for observability

### Manual / smoke validation

- [ ] Force an answer to fail after partial streaming and confirm automatic
      continuation finishes the turn.
- [ ] Force a context-limit-like failure and confirm compact-first recovery.
- [ ] Force a transient/finalization-like failure and confirm retry-first
      behavior before compaction.
- [ ] Confirm a side-effecting tool turn does not auto-replay unsafe effects.
- [ ] Confirm exhausted recovery on web exposes Continue + Retry cleanly.
- [ ] Confirm successful recovery leaves a subtle web marker but still presents
      one clean final assistant answer.

## Definition of Done

- [x] All acceptance criteria satisfied and verified
- [x] Tests added or updated — passing locally
- [x] Type check clean
- [x] Docs and notes updated with links to ticket
- [x] Operational impact assessed
- [x] Follow-up tickets created for deferred scope (none required for v1 closure)
- [x] Update history complete with evidence
- [x] Ticket front matter updated

## Refinement notes

### Problem statement / urgency
- Users are seeing too many turns terminate with `⚠️ Response ended with an
  error before finalization.` during auto-compaction / context-pressure windows.

### Primary user / workflow
- All Piclaw users and operators across chat, scheduled, and autonomous turn
  paths.

### Success criteria
- Bad UX largely disappears.
- Interrupted turns usually continue automatically.
- Recovery is observable enough for operators without becoming noisy for users.

### MVP behavior
- Shared automatic recovery engine across all turn paths.
- Bounded configurable retries, default `2`.
- Configurable total budget, default `30s`.
- Classifier-driven retry/compaction policy.
- Single final visible assistant turn on success.
- Web-only explicit resume affordance on exhaustion.

### Out of scope / constraints chosen so far
- Automatic replay of side-effecting tools is explicitly disallowed.
- Cross-restart automatic continuation is not required in v1.
- Operator config remains minimal even though the classifier should be designed
  to be overrideable later.

### Error policy
- Recover any failed turn except configurable non-recoverables.
- Compaction failure handling is classifier-driven.

### Persistence / state policy
- Runtime/session only for v1.
- Hidden/internal recovery metadata retained for diagnostics.

### UX policy
- Silent continuation by default.
- Web keeps draft visible during recovery and collapses to final answer on
  success.
- Web success leaves subtle marker chip + status metadata.
- Non-web channels use best-effort existing status affordances only.
- Exhausted web recovery offers:
  - Continue
  - Retry cleanly → new isolated recovery-specific run

### Performance / safety
- Recovery budget bounded by attempts and total time.
- Avoid duplicate side effects by refusing unsafe tool replay.

## Updates

### 2026-04-21
- Follow-up closure audit confirmed that the web recovery marker chip is already implemented in the shipped UI:
  - marker extraction + tooltip formatting in `runtime/web/src/components/post.ts`
  - chip styling in `runtime/web/static/css/content.css`
- Added focused recovery-chip coverage proving the message-level chip is visible and its helper logic behaves as expected:
  - component-level render test: `runtime/test/web/post-recovery-chip.test.ts`
  - helper coverage: `runtime/test/channels/web/post-link-preview-content.test.ts`
    - extracting recovered `recovery_marker` blocks
    - formatting the tooltip text shown on the visible chip
- Attempted the broader cross-path verification sweep using the ticket’s planned runtime test set plus `bunx tsc --noEmit -p runtime/tsconfig.json`.
- The closure sweep is currently blocked by **repo/environment baseline issues unrelated to the recovery changes**:
  - Dream / scheduler / some orchestrator-path tests fail immediately because the installed `/workspace/node_modules/@earendil-works/pi-coding-agent` package does not export `createAgentSessionServices` from its public entrypoint, while `runtime/src/agent-pool/session.ts` still imports that symbol
  - local TypeScript verification is also blocked in this container by missing `bun-types`
- User field report confirmed two still-live failure modes on `main` during long context-pressure runs:
  - the terminal persisted warning `⚠️ Your message was received but the agent produced no response. You may need to re-send it.` was still being emitted after stalled compaction / automatic recovery, which is the wrong classification for that failure path
  - manual `/compact` could itself fail with Anthropic-style transcript validation errors such as orphaned ``tool_result`` / ``tool_use_id`` mismatches, proving the repair path was incomplete for tool-call transcript corruption
- Root-cause audit on `main` (`daffa0f8`) showed:
  - `runtime/src/channels/web/handlers/agent.ts` still finalized some no-output recovery/compaction failures through the benign no-op branch
  - `/compact` in `runtime/src/agent-control/handlers/control.ts` called `session.compact()` directly without first applying the existing orphan-tool-result repair logic already used before normal agent runs
  - user-visible corruption messaging still only mentioned corrupt image blocks even though orphaned tool-result blocks were a real observed corruption class
- Landed a stabilization slice in commit `6eddf72c` (`Fix stalled recovery and compact session repair`):
  - `/compact` now prunes orphaned tool-result blocks before rewriting the session
  - corrupted-session messaging now explicitly covers orphaned tool-result / `tool_use_id` transcript corruption and states that `/compact` repairs both corrupt image blocks and orphaned tool-result blocks automatically
  - the web no-output fallback now detects stalled compaction / recovery activity and records a failed run plus a persistent recovery-needed notice/card instead of the bogus “produced no response” notice
  - recovery-stalled web UX now preserves a durable explanation and same-thread action affordance instead of only transient SSE status text
- Focused verification for the stabilization slice passed locally:
  - `runtime/test/agent-pool/orphan-tool-results.test.ts`
  - `runtime/test/agent-control/agent-control-handlers.test.ts`
  - `runtime/test/channels/web/agent-error-classification.test.ts`
  - `runtime/test/channels/web/web-channel.test.ts`
  - result: `97 pass / 0 fail`
- Closure blocker resolved by adapting `runtime/src/agent-pool/session.ts` to the current `@earendil-works/pi-coding-agent` session-creation API and adding a local compatibility typing for `AgentSessionRuntime`, which restored Dream/scheduler verification for the broader recovery matrix.
- Full closure verification now passes:
  - broader recovery-focused suite:
    - `runtime/test/agent-pool/automatic-recovery.test.ts`
    - `runtime/test/agent-pool/run-agent-orchestrator.test.ts`
    - `runtime/test/channels/web/web-channel.test.ts`
    - `runtime/test/channels/web/web-agent-streaming.test.ts`
    - `runtime/test/channels/web/web-channel-recovery-state.test.ts`
    - `runtime/test/runtime/scheduler.test.ts`
    - `runtime/test/dream-agent-turn.test.ts`
    - `runtime/test/runtime/message-loop.test.ts`
    - `runtime/test/remote/remote-interop.test.ts`
    - `runtime/test/extensions/autoresearch-supervisor-reasons.test.ts`
    - `runtime/test/extensions/autoresearch-supervisor-messaging.test.ts`
    - `runtime/test/web/post-recovery-chip.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
  - `CI=1 make ci-fast`
- With the shipped recovery UX, stalled-compaction repair, visible recovery chip, restored Dream/scheduler verification, clean typecheck, and passing canonical CI gate, the ticket now meets its v1 acceptance surface and is being closed as `done`.

### 2026-04-19
- Moved doing → review via board batch action.

### 2026-04-18
- Created from structured refinement after repeated user reports that auto
  compaction/context pressure still too often ends in terminal fallback warnings
  instead of automatic continuation.
- Refined directly in the web UI using one-question-at-a-time answers and
  Adaptive Cards for structured choices.
- Promoted to `20-doing` and started implementation.
- Landed the first shared runtime slice:
  - added a shared recovery classifier / policy helper at
    `runtime/src/agent-pool/automatic-recovery.ts`
  - added bounded recovery config via env-backed defaults:
    - `PICLAW_TURN_AUTO_RECOVERY_ENABLED`
    - `PICLAW_TURN_AUTO_RECOVERY_MAX_ATTEMPTS`
    - `PICLAW_TURN_AUTO_RECOVERY_TOTAL_BUDGET_MS`
  - updated `run-agent-orchestrator.ts` so recoverable mid-turn failures can
    retry automatically through a shared loop instead of immediately surfacing a
    terminal error
  - recovery is currently conservative about unsafe replay:
    - if tool execution happened during the failed run, automatic retry is
      skipped for now
    - if a completed assistant turn was already emitted during the failed run,
      automatic retry is skipped for now
  - added web recovery status events (`recovery_start` / `recovery_end`) so the
    web status surface can reflect that recovery is in progress or exhausted
  - attached recovery metadata to successful/error run outputs so downstream
    handlers can start surfacing recovery context without changing all turn
    paths at once
- Verification for this first slice:
  - `runtime/test/agent-pool/automatic-recovery.test.ts`
  - `runtime/test/agent-pool/run-agent-orchestrator.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Landed the next web-facing slice:
  - successful recovered final messages now persist a subtle recovery marker via
    `content_blocks` so the web post surface can show a chip without polluting
    the answer body
  - exhausted recovery now emits a web Adaptive Card with:
    - `Continue`
    - `Retry cleanly`
  - the card actions are live:
    - `Continue` forwards a built-in continuation prompt on the same thread
    - `Retry cleanly` starts a new isolated run with a clean-retry prompt
  - fixed web user-message threading so forwarded/internal card actions can
    preserve explicit `thread_id` instead of always self-rooting
- Additional verification for this slice:
  - `runtime/test/channels/web/web-channel.test.ts`
  - `runtime/test/channels/web/web-agent-streaming.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Landed shared operator-visible recovery counters:
  - `AgentPool` now tracks cumulative in-process recovery stats:
    - total recovery attempts
    - recovered runs
    - exhausted runs
  - those counters now flow through `getMemoryInstrumentationSnapshot()` into
    `/agent/system-metrics`
  - this gives the web/runtime status surface a real shared telemetry source
    instead of only per-turn metadata
- Additional verification for the counters slice:
  - `runtime/test/agent-pool/agent-pool.test.ts`
  - `runtime/test/channels/web/system-metrics.test.ts`
  - combined focused rerun:
    - `runtime/test/agent-pool/automatic-recovery.test.ts`
    - `runtime/test/agent-pool/run-agent-orchestrator.test.ts`
    - `runtime/test/agent-pool/agent-pool.test.ts`
    - `runtime/test/channels/web/web-channel.test.ts`
    - `runtime/test/channels/web/web-agent-streaming.test.ts`
    - `runtime/test/channels/web/system-metrics.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Added an explicit regression slice for the exact web fallback pair:
  - `⚠️ Response timed out before finalization.`
  - `ℹ️ Context compaction was in progress`
- Coverage now includes:
  - classifier test proving `timeout before finalization` + active compaction intent
    becomes `context_pressure` → `compact_then_retry`
  - shared orchestrator test proving a timed-out turn during compaction can
    recover automatically and finish as one final success
  - web integration test proving successful recovery does **not** publish the
    timeout/compaction warning pair and instead stores the clean final answer
    plus recovery marker
- Added non-web/autonomous verification and low-noise operator observability:
  - scheduled agent tasks now keep user-facing outbound text clean while task
    logs / `last_result` capture a concise automatic-recovery summary when a run
    recovered or exhausted
  - Dream model-pass summaries now include concise recovery notes for recovered
    or exhausted runs
  - WhatsApp/message-loop logging now records recovery metadata and a compact
    summary without changing normal outbound assistant text
  - remote execute responses now carry structured recovery metadata and remote
    audit rows capture concise recovery summaries for operator diagnosis without
    changing the remote success payload shape beyond the added metadata field
  - shared per-turn recovery metadata now includes attempt-level diagnostic
    entries (attempt failure vs compaction failure, classifier, strategy,
    reason, error, elapsed time, and key safety/partial-output flags)
  - agent disk logs now persist the richer recovery metadata so post-mortem
    debugging does not depend on the caller surfacing every field directly
  - autoresearch supervisor now treats long idle without max-iterations reached
    as a failed/stalled end-state, humanizes terminal reasons for operators, and
    only treats process-exit completion as successful when the max-iteration
    budget was actually reached
- Additional verification for this slice:
  - `runtime/test/runtime/scheduler.test.ts`
  - `runtime/test/dream-agent-turn.test.ts`
  - `runtime/test/runtime/message-loop.test.ts`
  - `runtime/test/remote/remote-interop.test.ts`
  - `runtime/test/agent-pool/run-agent-orchestrator.test.ts`
  - `runtime/test/extensions/autoresearch-supervisor-reasons.test.ts`
  - `runtime/test/extensions/autoresearch-supervisor-messaging.test.ts`
  - focused rerun also included `runtime/test/agent-pool/automatic-recovery.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`

## Notes

### Closure status after the 2026-04-21 completion sweep

This ticket is complete.

The final completion sweep confirmed that the shipped implementation now covers:

- shared automatic recovery loop and bounded recovery budget
- classifier-driven retry vs compact-first behavior
- exhausted recovery affordance on web (`Continue` / `Retry cleanly`)
- persistent web recovery marker storage and visible message-level chip rendering
- persistent recovery-needed UX for stalled compaction / recovery instead of the bogus generic no-response notice
- manual `/compact` repair for orphaned tool-result corruption before rewriting the session
- Dream / scheduler / message-loop / remote-path verification for the broader recovery matrix
- clean local typecheck and passing canonical repo gate during closure

- This ticket builds on existing restart/finalization hardening and compaction
  status work, but is intentionally a new scope: automatic continuation after
  recoverable mid-turn failures.
- Existing compaction UX/status plumbing is useful but not sufficient by itself;
  the missing piece is the actual shared recovery policy/state machine.
- The implementation should prefer deterministic state-machine rules over adding
  ad hoc retries in multiple call sites.

## Links

- Commit: `6eddf72c` — `Fix stalled recovery and compact session repair`
- `runtime/src/channels/web/handlers/agent.ts`
- `runtime/src/agent-control/handlers/control.ts`
- `runtime/src/agent-pool/orphan-tool-results.ts`
- `runtime/src/agent-pool/run-agent-orchestrator.ts`
- `runtime/src/agent-pool/session.ts`
- `runtime/src/types/pi-coding-agent-compat.d.ts`
- `runtime/src/channels/web/sse/agent-events.ts`
- `runtime/src/extensions/smart-compaction.ts`
- `runtime/web/src/components/post.ts`
- `runtime/web/static/css/content.css`
- `runtime/test/web/post-recovery-chip.test.ts`
- `workitems/50-done/restart-recovery-and-terminal-publication-hardening.md`
- `workitems/50-done/model-switch-hang-during-compaction.md`
- `workitems/50-done/incorporate-pi-agentic-compaction.md`

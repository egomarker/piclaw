---
id: session-file-rotation
title: Add session file size monitoring and rotation
status: done
priority: medium
created: 2026-03-13
updated: 2026-03-15
target_release: next
estimate: L
risk: high
completed: 2026-03-15
tags:
  - work-item
  - kanban
  - reliability
  - performance
  - sessions
  - web
owner: pi
---

# Add session file size monitoring and rotation

## Summary

Session JSONL files currently grow without bound.

In the live PiClaw workspace, the active web session file under:

- `/workspace/.piclaw/data/sessions/web_default/`

has reached roughly **186 MB**. PiClaw resumes that file via
`SessionManager.continueRecent(...)`, so the current behaviour is effectively:

- one long-lived chat
- one long-lived session file
- indefinite append-only growth

That is workable, but no longer especially healthy. This ticket refines the
work needed to make session growth observable first, then safely rotatable
without breaking queue state, active turns, or branch/session semantics.

## Problem Statement

PiClaw supports multiple session files, but it does **not** currently perform
operational rotation.

New files are created only by semantic actions such as:

- `/new-session`
- `/fork`
- opening a different session file

There is no:

- rotate-by-size policy
- rotate-by-age policy
- warning threshold
- archive policy
- web-visible size/status signal

Because of that, the web chat tends to accumulate into one very large JSONL
file. The risk is less about model context size — compaction already handles
that — and more about file I/O, recovery ergonomics, reload costs, and general
operational untidiness.

## Refinement Notes

### 20-question pass

1. **Problem / urgency**
   - Session files grow indefinitely; the live `web_default` file is already ~186 MB.
2. **Primary user**
   - The operator using the long-lived PiClaw web chat as a persistent working session.
3. **Success criteria**
   - Session size is visible, warning thresholds exist, and rotation can happen without losing continuity.
4. **MVP**
   - Surface current session size + warning, plus a manual safe rotation path.
5. **Out of scope**
   - Automatic deletion/pruning of history, upstream SDK redesign, and arbitrary session compaction format changes.
6. **In-scope surfaces**
   - agent pool/session lifecycle, control commands, optional web status surfacing, tests.
7. **Platform constraints**
   - Must work in this Docker/Supervisor workspace runtime and preserve persistent state under `/workspace/.piclaw/data`.
8. **Failure behaviour**
   - Rotation must fail safely and leave the current session intact if archiving/new-session handoff cannot complete.
9. **Persistence semantics**
   - Old files must be preserved/archived, not deleted.
10. **Alignment target**
    - Must align with existing `SessionManager.continueRecent(...)` semantics and PiClaw chat-run safety rules.
11. **Lowest-risk slice**
    - Add measurement + warning first, then manual rotation, then optional auto-rotation.
12. **Avoid in v1**
    - Hidden automatic rotation during active turns, silent archival, and policy that changes tree semantics unexpectedly.
13. **Naming / file handling**
    - Reuse the existing timestamp + UUID JSONL naming pattern; archive by moving the previous file, not rewriting IDs.
14. **Inputs / outputs**
    - Input: active session file path + size + chat/session state. Output: warning signal, new session file, archived old file.
15. **Existing behaviour during change**
    - Existing `/new-session`, `/fork`, and session browsing must continue to work unchanged.
16. **Performance expectations**
    - Size checks should be cheap; no full-file parse should be required just to warn on size.
17. **Security / permissions**
    - No new secrets; must respect workspace filesystem permissions and not move files outside the session root.
18. **Export / shareability**
    - Session metadata/status can be shown to the operator, but rotation is primarily an internal persistence concern.
19. **Proof**
    - Unit/integration tests around size detection, safe rotation, queue preservation, and inflight blocking/defer semantics.
20. **Done condition**
    - Manual rotation is safe and tested, file size is surfaced, and optional auto-rotation is either implemented cleanly or explicitly deferred.

## Current Behaviour

- Session files are appended to indefinitely.
- Pi's auto-compaction reduces model-visible context, but the backing JSONL file still grows.
- PiClaw stores sessions under:
  - `/workspace/.piclaw/data/sessions/<chat>/`
- PiClaw initialises sessions with:
  - `SessionManager.continueRecent(WORKSPACE_DIR, chatSessionDir)`
- No alert, metric, or visible status currently exposes session file size.
- No automated rotation, truncation, or archival exists.

## Desired Behaviour

- Session file size is tracked and surfaced to the operator.
- A warning threshold exists for oversized files.
- A manual rotation path creates a new session file while preserving continuity.
- Rotation does not occur during an active turn unless explicitly deferred safely.
- Old session files are archived, not deleted.
- Optional automatic rotation can be added behind config after the manual path is proven safe.

## Acceptance Criteria

- [x] Active session file path and size are available through PiClaw session state or a status surface.
- [x] A warning is logged and/or surfaced when the active session file exceeds a configurable threshold.
- [x] A manual rotation command exists (`/session rotate`, `/session archive`, or equivalent).
- [x] Manual rotation creates a fresh session file using the existing session-file naming style.
- [x] Rotation preserves conversation continuity in a way that is explicit and testable:
  - either by carrying forward the effective compacted context, or
  - by starting from a semantically equivalent new-session boundary documented in the ticket.
- [x] Old session files are archived/preserved rather than deleted.
- [x] Rotation cannot silently lose deferred queued follow-ups, placeholder-backed follow-ups, or pending session state.
- [x] Rotation cannot run unsafely during an inflight turn; it must either:
  - block with a clear reason, or
  - defer until the turn has terminally completed.
- [x] Focused regression coverage exists for rotation with queued state present.
- [x] Optional automatic rotation is either implemented behind config or explicitly split into a follow-up ticket.

## Implementation Paths

### Path A — PiClaw-owned manual rotation first (recommended)

1. Add session-size inspection in PiClaw's agent/session lifecycle.
2. Surface size + warning status in an existing status/control path.
3. Add a manual rotation command that:
   - refuses while inflight, or schedules itself safely,
   - archives the previous file,
   - starts a new session file,
   - restores the correct effective context boundary.
4. Add optional auto-rotation only after the manual path is stable.

**Pros:** smallest safe slice, clear operator control, easiest to validate.
**Cons:** does not immediately solve unattended long-running growth without the later auto step.

### Path B — Automatic size-based rollover from the start

1. Add threshold checks to the agent pool or session append path.
2. Automatically rotate when the active file exceeds threshold.
3. Surface the rollover event afterward.

**Pros:** solves the operational problem directly.
**Cons:** higher risk because it intersects with active turns, queued state, and restart/recovery timing.

### Path C — Upstream-first SDK/session-manager change

Push rotation semantics down into `pi-coding-agent` session management and then adopt them from PiClaw.

**Pros:** cleaner long-term abstraction if multiple consumers need it.
**Cons:** larger scope, slower to validate, and not necessary for a first safe PiClaw fix.

## Recommended Path

Use **Path A**.

Start with PiClaw-owned measurement, warning, and **manual** safe rotation. Do
not add silent automatic rollover until the continuity rules and inflight/queue
interactions are proven in tests.

## Test Plan

- [ ] Unit: add tests for session-size inspection helpers and threshold evaluation.
- [ ] Unit: add tests for any archive-path / session-file-selection helpers.
- [ ] Integration: verify manual rotation creates a new file and preserves old file archive state.
- [ ] Integration: verify `continueRecent(...)` picks up the rotated-to new file after restart.
- [ ] Integration: verify rotation is blocked or deferred during active inflight turns.
- [ ] Integration: verify deferred queue / placeholder-backed follow-up state survives rotation unchanged.
- [ ] Regression: cover the live-shape case of a large `web_default` session directory with one dominant JSONL file.
- [ ] Full validation: `cd /workspace/piclaw/piclaw && bun run quality`.
- [ ] Runtime validation: inspect `/workspace/.piclaw/data/sessions/web_default/` before/after rotation without injecting spurious chat traffic.

## Definition of Done

- [x] Problem statement and scope are explicit
- [x] Chosen implementation path recorded
- [x] Acceptance criteria are measurable
- [x] Test plan covers queue + inflight safety
- [x] Manual rotation path implemented and validated
- [x] Session size/warning signal implemented
- [x] Follow-up ticket created if auto-rotation is deferred
- [x] Ticket update history includes evidence and quality score

## Relevant Areas

- `piclaw/piclaw/src/agent-pool/session.ts` — session creation and directory management
- `piclaw/piclaw/src/agent-pool.ts` — session lifecycle, `getOrCreate`, idle eviction
- `@earendil-works/pi-coding-agent` — `SessionManager`, `findMostRecentSession`, `newSession`, `createBranchedSession`
- `piclaw/piclaw/src/channels/web/handlers/agent.ts` — turn lifecycle / active-turn safety
- `piclaw/piclaw/src/db/chat-cursors.ts` — cursor and deferred queue state
- `piclaw/piclaw/src/channels/web.ts` — placeholder / steering stores and web runtime state

## Notes

- This is distinct from context compaction. Compaction limits model context; it does not reduce JSONL file size.
- The live evidence now says the issue is real rather than hypothetical:
  - `/workspace/.piclaw/data/sessions/web_default/2026-02-28T15-37-29-629Z_4b46edce-24d5-4015-b79a-bdb2a1f929d1.jsonl` ≈ 186 MB
- There is also an older `.bak` in that directory, which suggests prior manual/intermediate handling rather than a formal rotation policy.
- Keep archive location inside the same per-chat session root unless there is a compelling reason to move it elsewhere.

## Links

- `piclaw/piclaw/src/agent-pool/session.ts`
- `piclaw/piclaw/src/agent-pool.ts`
- `piclaw/piclaw/src/channels/web/handlers/agent.ts`
- `piclaw/piclaw/src/db/chat-cursors.ts`
- `piclaw/piclaw/src/channels/web.ts`
- `piclaw/piclaw/node_modules/@earendil-works/pi-coding-agent/docs/session.md`
- `piclaw/piclaw/node_modules/@earendil-works/pi-coding-agent/dist/core/session-manager.js`

## Updates

### 2026-03-15 (closure)
- Closed after the manual + automatic rotation path had already shipped, passed
  coverage, and survived subsequent reload/restart/runtime use without opening
  new follow-up defects in this area.
- Shipped behavior includes:
  - session file size surfaced in `/state`
  - configurable oversized-session warning threshold via `PICLAW_SESSION_MAX_SIZE_MB`
  - manual `/session-rotate [instructions]`
  - shared safe rotation engine in `piclaw/piclaw/src/session-rotation.ts`
  - automatic pre-prompt rotation behind `PICLAW_SESSION_AUTO_ROTATE=1`
- Queue/inflight safety constraints are enforced by the shared rotation path:
  - blocks during streaming/compacting/retrying
  - blocks while queued steering/follow-up messages remain pending
  - archives old files instead of truncating in place
  - seeds the successor session from the effective carried-forward context
- Key implementation commits:
  - `07d03ac` — `Implement safe session rotation and plan draw.io embedding`
  - `fdac04e` — `Finish session auto-rotation and terminal dock cleanup`
- Validation evidence already recorded below remained sufficient for closure.
- Quality: ★★★★★ 9/10 (problem: 2, scope: 2, test: 2, deps: 1, risk: 2)

### 2026-03-14
- Lane change: `20-doing` → `40-review` after completing the auto-rotation scope.
- Factored shared rotation logic into `piclaw/piclaw/src/session-rotation.ts` so both manual and automatic rotation use the same safe path.
- Implemented automatic session rotation before prompt execution in `piclaw/piclaw/src/agent-pool.ts` behind config:
  - `PICLAW_SESSION_AUTO_ROTATE=1`
  - threshold uses `PICLAW_SESSION_MAX_SIZE_MB` (default 100 MB)
- Added integration coverage for automatic rollover in:
  - `piclaw/piclaw/test/agent-pool/session-auto-rotation.test.ts`
- Re-validated web command behavior so `/session-rotate` is not silently deferred while streaming.
- Validation passed:
  - `cd /workspace/piclaw/piclaw && bun test test/agent-control/agent-control-handlers.test.ts test/agent-control/session-rotate-integration.test.ts test/agent-pool/session-auto-rotation.test.ts`
  - `cd /workspace/piclaw/piclaw && bun test test/channels/web/agent-message-handler.test.ts`
  - `cd /workspace/piclaw/piclaw && bun run quality`
- Review focus:
  - verify the auto-rotation config naming/defaults are acceptable
  - verify the blocked-on-pending behavior is sufficient for queued follow-up safety
  - optionally live-test against the oversized `web_default` session before moving to done
- Quality: ★★★★★ 9/10 (problem: 2, scope: 2, test: 2, deps: 1, risk: 2)

### 2026-03-14
- Lane change: `10-next` → `20-doing` for the first implementation slice.
- Implemented manual session rotation via new `/session-rotate [instructions]` control command in:
  - `piclaw/piclaw/src/agent-control/handlers/session.ts`
  - `piclaw/piclaw/src/agent-control/command-parsers.ts`
  - `piclaw/piclaw/src/agent-control/command-registry.ts`
  - `piclaw/piclaw/src/agent-control/agent-control-handlers.ts`
  - `piclaw/piclaw/src/agent-control/agent-control-types.ts`
- Rotation behaviour implemented for v1:
  - blocks while streaming/compacting/retrying
  - blocks if pending steering/follow-up messages still exist in the agent session
  - attempts compaction first, then falls back to the current effective context when compaction is not available
  - archives the old file into a per-chat `archive/` directory
  - starts a fresh session and seeds it from carried-forward summary/context
  - force-persists the new session file so restart/resume sees it immediately
- Surfaced session file size in `/state` via `piclaw/piclaw/src/agent-control/handlers/info.ts`.
- Added configurable oversized-session warning threshold in:
  - `piclaw/piclaw/src/core/config.ts`
  - `piclaw/piclaw/src/agent-control/handlers/info.ts`
  - default: `PICLAW_SESSION_MAX_SIZE_MB=100`
- Added regression coverage in:
  - `piclaw/piclaw/test/agent-control/parser.test.ts`
  - `piclaw/piclaw/test/agent-control/agent-control-handlers.test.ts`
  - `piclaw/piclaw/test/agent-control/session-rotate-integration.test.ts`
  - `piclaw/piclaw/test/channels/web/agent-message-handler.test.ts`
- Validation passed:
  - `cd /workspace/piclaw/piclaw && bun test test/agent-control/parser.test.ts`
  - `cd /workspace/piclaw/piclaw && bun test test/agent-control/agent-control-handlers.test.ts`
  - `cd /workspace/piclaw/piclaw && bun test test/agent-control/session-rotate-integration.test.ts`
  - `cd /workspace/piclaw/piclaw && bun test test/channels/web/agent-message-handler.test.ts`
  - `cd /workspace/piclaw/piclaw && bun run quality`
- Remaining gaps for ticket completion:
  - no explicit web-channel test for queued/deferred follow-up persistence around rotation yet
  - no automatic rotation/configured rollover follow-up split yet
- Quality: ★★★★☆ 8/10 (problem: 2, scope: 2, test: 2, deps: 1, risk: 1)

### 2026-03-14
- Lane change: `00-inbox` → `10-next` after refinement.
- Re-scoped the ticket around the confirmed live reality that PiClaw currently uses semantic session splits (`/new-session`, `/fork`) but no operational file rotation.
- Added explicit refinement notes, a recommended implementation path, a queue/inflight-safe acceptance set, and a concrete test plan.
- Evidence captured during refinement:
  - active web session file under `/workspace/.piclaw/data/sessions/web_default/` is ~186 MB
  - PiClaw uses `SessionManager.continueRecent(...)` against the per-chat session directory
  - no rotate-by-size or rotate-by-age behaviour exists today
- Quality: ★★★★☆ 8/10 (problem: 2, scope: 2, test: 2, deps: 1, risk: 1)

### 2026-03-13
- Ticket created from turn mechanism audit finding.
- Added queue validation and inflight safety acceptance criteria per user request — rotation must not lose queued messages or conflict with active turns.

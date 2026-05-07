---
id: turn-mechanism-audit-2026-04-16
title: "Turn mechanism audit — fix steer drops, cursor skips, flush races, timeout races, and add instrumentation"
status: review
created: 2026-04-16
updated: 2026-04-16T20:48
tags:
  - work-item
  - kanban
  - bug
  - turn-mechanism
  - audit
owner: smith
---

# Turn mechanism audit — fix steer drops, cursor skips, flush races, timeout races, and add instrumentation

## Summary

Deep audit of the full turn lifecycle (message arrival → session prompt → model response → finalization → next turn) identified a mix of confirmed faults, contingent races, and by-design behaviors across 5 user-reported symptoms.

A second pass of direct code audit across the implicated paths narrowed the actionable set to:

- **Confirmed code defects:** H, J, B
- **Confirmed/likely race needing regression proof:** M
- **Instrument-first / evidence-gated items:** C
- **By-design or disproved as root cause:** D, E, F, G, I, K, L, N
- **Real but lower-severity contributors:** A, O, P

1. **Out-of-turn answers** — model fishes context from previous turns
2. **Cross-context leakage** — pulls items from other trees/agents
3. **Queue/steer lock** — falls out of order, gets stuck in steering mode
4. **Premature turn termination** — agent turns end before completion
5. **Staggered turns** — turns overlap or interleave when they shouldn't

Full audit: `notes/audits/turn-mechanism-audit-2026-04-16.md`

## Acceptance Criteria

### P0 — Suspect H: `consumeLatest` drops queued steers

- [ ] `PendingSteeringStore.consumeLatest()` no longer deletes all entries and returns only the latest
- [ ] Either: consume FIFO (one at a time per finalization cycle), or: `finalizeSuccessfulRun` iterates all consumed steers
- [ ] Test: queue 3 steers during a turn → all 3 timestamps are consumed, none dropped

**File:** `runtime/src/channels/web/runtime/pending-steering.ts`
**Also:** `runtime/src/channels/web/handlers/agent.ts` (`finalizeSuccessfulRun`)

### P1 — Suspect J: Steer cursor advance skips normal messages

- [ ] `finalizeSuccessfulRun` no longer advances the cursor to steer timestamps
- [ ] Rationale: steering messages are already filtered from `getMessagesSince` (`is_steering_message = 1`), so cursor advancement is unnecessary and can skip normal follow-up messages with timestamps between the old cursor and the steer timestamp
- [ ] Test: interleave a steer and a normal follow-up at close timestamps → both are processed

**File:** `runtime/src/channels/web/handlers/agent.ts` (`finalizeSuccessfulRun`, lines ~1016-1021)

### P1 — Suspect B: `text_start` flushes before `message_end`

- [ ] Turn coordinator tracks a `messageComplete` flag set on `message_end` and checked on next `text_start`
- [ ] `flushTurn()` on `text_start` only fires if the previous message's `message_end` was received
- [ ] Test: simulate `text_start` → `text_delta` → `text_start` (no `message_end` in between) → the first text block is NOT flushed as a complete turn

**File:** `runtime/src/agent-pool/turn-coordinator.ts`

### P1 — Suspect M: Timeout abort races with normal completion

- [ ] After clearing the timeout in the `finally` block of `runAgentPrompt`, check `timedOutRef.value`
- [ ] If timed out, discard `tracker.getFinalText()` and return a timeout error — do not finalize with potentially incomplete text
- [ ] Test: simulate timeout firing at the same instant as `session.prompt()` resolving → result is a clean timeout error, not partial text

**File:** `runtime/src/agent-pool/run-agent-orchestrator.ts`

### P2 — Suspect C: `waitForSessionIdle` settle window too short (instrument-first)

- [ ] Add instrumentation first to prove whether `session.prompt()` can resolve while trailing session activity is still possible
- [ ] Only then: increase settle ticks from 10 to 20 (1000ms total idle required) OR add a stronger `session.isRunning` / equivalent upstream guard if available
- [ ] Test: session with 600ms gap between tool phases → `waitForSessionIdle` does NOT declare idle prematurely

**File:** `runtime/src/agent-pool/prompt-utils.ts`

### P2 — Suspect A: Compaction summary carries stale topic weight

- [ ] Document that auto-compaction between topic changes can give disproportionate weight to the old topic
- [ ] Optionally: delay auto-compaction until *after* the next user prompt is received (not before), so the model sees the topic change before the summary is generated
- [ ] This is a model behavior issue, not a code bug — document the tradeoff

### P2 — Suspect P: Spurious `processChat` from multiple resume triggers

- [ ] Audit all `resumeChat` call sites to ensure frontier keys prevent double-enqueue of the same logical work unit
- [ ] Log when a `processChat` invocation finds no pending messages (already logged, verify it's actionable)

### Instrumentation

- [ ] **Finalization log enrichment** — add to `finalizeSuccessfulRun`:
  - `pendingSteerCount` (before consume)
  - `pendingSteerTimestamps` (all, before consume)
  - `cursorBefore`, `cursorAfterEnd`, `cursorAfterSteer`
  - `remainingPersistedCount`

- [ ] **Turn coordinator boundary logging** — add structured logs at:
  - `text_start`: `currentTurnTextLength` (before flush), `messageHasDelta`
  - `message_end`: `phase`, `extractedTextLength`, `stopReason`

- [ ] **`waitForSessionIdle` exit log** — add:
  - `totalWaitMs`
  - `isStreaming`, `isCompacting`, `isRetrying` at exit
  - `settleTicks` used

- [ ] **`session.prompt()` resolve log** — add to `runAgentPrompt` after await:
  - `sessionIsStreaming` (should be false)
  - `sessionIsCompacting`
  - `sessionIsRetrying`
  - `promptDurationMs`

## Direct Code Audit Reassessment

| Hypothesis | Paths audited | Verdict | Direct code evidence |
|---|---|---|---|
| **A** Compaction summary stale-topic weight | `runtime/src/agent-pool/run-agent-orchestrator.ts`, upstream `@earendil-works/pi-coding-agent/dist/core/session-manager.js` | **Plausible contributor, not primary bug** | `maybeAutoCompactSessionBeforePrompt()` runs **before** `session.prompt()`. Upstream `buildSessionContext()` emits `compactionSummary` first, then kept messages. This can overweight the previous topic, but it is context shaping/model behavior rather than a broken turn boundary. |
| **B** `text_start` flushes before `message_end` | `runtime/src/agent-pool/turn-coordinator.ts` | **Confirmed defect** | `handleMessageUpdate()` calls `flushTurn()` on every `text_start` whenever `onTurnComplete` exists. There is no guard that the prior assistant message had a `message_end`. Partial accumulated text can therefore be flushed as a complete intermediate turn. |
| **C** `waitForSessionIdle()` settles too early | `runtime/src/agent-pool/prompt-utils.ts`, `runtime/src/agent-pool/run-agent-orchestrator.ts`, upstream `@earendil-works/pi-coding-agent/dist/core/agent-session.js` | **Contingent / instrument first** | Local code awaits `session.prompt(prompt)` **before** `waitForSessionIdle(session)`. Upstream `session.prompt()` already awaits `agent.prompt(messages)` and `waitForRetry()`. So local settle logic is only dangerous if upstream prompt resolution can race ahead of trailing activity. Add logs first; do not treat this as confirmed root cause yet. |
| **D** Session map isolation broken | `runtime/src/agent-pool/session-manager.ts`, `runtime/src/agent-pool/session.ts` | **Disproved** | Main sessions are cached in `pool: Map<string, PoolEntry>` keyed by `chatJid`. Session directories are per-chat via `ensureSessionDir(chatJid)`. No direct cross-chat runtime sharing appears here. |
| **E** Shared workspace state leaks across chats | base prompt / note loading design | **By design, not turn bug** | Shared notes/memory are intentionally global workspace context. This can look like cross-chat recall, but it is not session-state leakage inside the turn mechanism. |
| **F** Branch fork copies source context incorrectly | `runtime/src/agent-pool/branch-manager.ts` | **By design** | `createForkedChatBranch()` intentionally seeds the new branch from `sourceSession.sessionManager.buildSessionContext()` or a stable branch seed. That is snapshot semantics, not leakage. |
| **G** `syncSideSessionFromMain()` leaks main context | `runtime/src/agent-pool/session-manager.ts` | **Intentional behavior; not root cause here** | Side sessions are reseeded from the chat's own main-session context via `buildSessionContext()`, but they live under per-chat named dirs (`btw-side`). This can carry stale main-chat context into side prompts, but not across chats. |
| **H** `consumeLatest()` drops all but latest steer | `runtime/src/channels/web/runtime/pending-steering.ts` | **Confirmed defect** | `consumeLatest()` reads the array, `delete`s the chat key, sorts, and returns only the last timestamp. Every earlier queued steer is dropped. |
| **I** Steer race with stream end silently corrupts state | `runtime/src/channels/web/handlers/agent.ts`, `runtime/src/agent-pool/runtime-facade.ts` | **Downgraded / mostly disproved** | The handler's `isStreaming` check is stale-prone, but `runtime-facade.queueStreamingMessage()` re-checks live `session.isStreaming` and returns `{ queued: false }` if the run already ended. This is a UX race, not a silent state-corruption path. |
| **J** Steer cursor advance skips normal messages | `runtime/src/channels/web/handlers/agent.ts`, `runtime/src/db/messages.ts` | **Confirmed defect** | `finalizeSuccessfulRun()` advances the chat cursor to the pending steer timestamp, but `getMessagesSince()` filters out steering rows with `COALESCE(is_steering_message, 0) = 0`. A normal user message with `timestamp <= steerTs` can be skipped permanently. |
| **K** Settle window alone causes premature turn end | `runtime/src/agent-pool/prompt-utils.ts`, `runtime/src/agent-pool/run-agent-orchestrator.ts` | **Not independent root cause** | Same finding as C: the 500ms idle settle is only relevant after `session.prompt()` returns. On its own, it does not explain a premature end unless upstream completion semantics are already wrong. |
| **L** Config timeout is itself a code bug | `runtime/src/agent-pool/run-agent-orchestrator.ts` | **Not enough evidence** | There is a configurable timeout, but nothing in this code shows the configured value is inherently too short. This is operational/config risk, not currently a demonstrated mechanism bug. |
| **M** Timeout abort races with normal completion | `runtime/src/agent-pool/run-agent-orchestrator.ts`, `runtime/src/agent-pool/turn-coordinator.ts` | **Likely race; regression-proof required** | `clearTimeout(timeoutId)` in `finally` helps, but does not protect against a timeout callback already queued for execution. `timedOutRef.value` can still flip after the success path starts, so this needs a regression test and an explicit completion/timeout guard. |
| **N** Queue lane serialization allows same-chat overlap | `runtime/src/queue.ts`, `runtime/src/channels/web/runtime/chat-run-control.ts` | **Disproved** | `AgentQueue` serializes by lane key (`chat:${chatJid}`), pushing pending work when a lane is already running and only shifting the next item in `finally`. Same-lane overlap is not happening here. |
| **O** `already processing` retry pattern creates stagger | `runtime/src/channels/web/handlers/agent.ts`, `runtime/src/queue.ts` | **Real but lower-severity contributor** | On `already processing`, the handler rolls back the cursor and throws so the queue retries later. This preserves correctness but can create visible pauses and staggered behavior. |
| **P** Multiple `resumeChat()` triggers enqueue benign no-op work | `runtime/src/channels/web/handlers/agent.ts`, `runtime/src/channels/web/runtime/chat-run-control.ts`, `runtime/src/queue.ts` | **Real but secondary** | Several sites call `resumeChat()`. Different frontier keys avoid collapsing legitimate next-turn hand-offs, but also allow extra same-lane resume items that later find no pending messages. This is queue hygiene/observability work, not the primary stale-answer bug. |

## Implementation Plan Checklist

### Phase 1 — P0/P1 runtime fixes
- [x] **H1** Replace single-steer consumption with full pending-steer batch consumption
- [x] **H2** Update finalize path to iterate the consumed steer timestamps instead of silently dropping earlier ones
- [x] **H3** Add/adjust tests for pending-steering store + service/public-surface delegation
- [x] **J1** Remove steer-timestamp cursor advancement from `finalizeSuccessfulRun`
- [x] **J2** Add regression test proving a normal user message is not skipped when a steer timestamp exists after it
- [x] **B1** Guard `text_start` flushes behind a completed-message boundary in `turn-coordinator.ts`
- [x] **B2** Add regression test for `text_start → text_delta → text_start` without `message_end`
- [x] **M1** Harden timeout completion vs abort race in `run-agent-orchestrator.ts`
- [x] **M2** Add regression test for timeout callback vs prompt completion race

### Phase 2 — Instrumentation
- [x] **I1** Log pending-steer counts/timestamps and cursor positions in `finalizeSuccessfulRun`
- [x] **I2** Log `text_start` / `message_end` turn-boundary state in `turn-coordinator.ts`
- [x] **I3** Log `waitForSessionIdle` exit state and duration
- [x] **I4** Log `session.prompt()` resolve state and duration

### Phase 3 — Evidence-gated / secondary items
- [x] **C1** Decide whether `waitForSessionIdle` settle window should change based on logs/tests
- [x] **A1** Document compaction-summary stale-topic tradeoff
- [x] **A1-impl** Implement pivot-aware compaction in `smart-compaction.ts`
- [x] **P1** Audit and trim redundant same-lane `resumeChat()` wakeups where safe

## Test Plan

- Applicable regression classes from `workitems/regression-test-planning-reference.md`:
  - [x] Bug replay / known-regression test — Suspects H, J, B, M are all reproducible in unit tests
  - [x] State-machine / invariant test — cursor ordering, steer queue FIFO, turn text accumulation
  - [x] Interaction scenario test — steer-during-long-turn, follow-up-interleaved-with-steer
  - [ ] Real-browser smoke test — optional, for stagger/UX validation
- Existing tests to rerun:
  - `runtime/test/channels/web/web-channel.test.ts`
  - `runtime/test/agent-pool/agent-pool-tools.test.ts`
- New regression coverage to add:
  - `PendingSteeringStore` FIFO consumption test
  - Cursor-advance-with-steer interleaving test
  - Turn coordinator `text_start`/`message_end` boundary test
  - Timeout-abort race test in `runAgentPrompt`
  - `waitForSessionIdle` extended settle test

## Definition of Done

- [ ] All acceptance criteria satisfied and verified
- [ ] Tests added or updated — passing locally
- [ ] Type check clean (`bun run typecheck`)
- [ ] `bun run ci:fast` passing
- [ ] Instrumentation logs verified in running instance
- [ ] Docs and notes updated with links to ticket
- [ ] Operational impact assessed (no new startup/runtime cost except structured logging)
- [ ] Follow-up tickets created for deferred scope (P2 items if not completed)
- [ ] Update history complete with evidence
- [ ] Ticket front matter updated

## Updates

### 2026-04-16T20:48
- Lane change: `20-doing` → `40-review` during patch-release board cleanup.
- The runtime fix tranche has landed on `main` (`b8979096`) and the remaining work is now review/validation/evidence-oriented rather than active exploratory implementation.
- Keeping it in doing after the bug-fix tranche shipped would blur the distinction between “still coding the fix” and “now confirming the tranche behaves well enough to close”.

### 2026-04-16
- Audit completed — 16 suspects investigated across turn selection, streaming aggregation, cursor movement, steering, timeout, and resume paths
- Full audit document: `notes/audits/turn-mechanism-audit-2026-04-16.md`
- Work item moved to `20-doing/`
- Direct code-audit reassessment tightened the verdicts:
  - Confirmed defects: H (`consumeLatest` drops steers), J (cursor advance can skip normal messages), B (`text_start` can flush before `message_end`)
  - Likely race needing regression proof: M (timeout callback can still win after `clearTimeout` if already queued)
  - Instrument-first, not yet promoted to fix: C (`waitForSessionIdle` is only dangerous if upstream `session.prompt()` resolves too early)
  - By-design / disproved as primary root cause: D, E, F, G, I, K, L, N
  - Real but lower-severity contributors: A, O, P
- Completed **H**:
  - Replaced single pending-steer consumption with batch consumption via `PendingSteeringStore.consumeAll()`
  - Updated runtime-state/runtime-followup/public-surface layers to the new batch semantics
  - Updated pending-steering/runtime-facade/public-surface tests to the new batch semantics
- Completed **J**:
  - Removed steer-timestamp cursor advancement from `finalizeSuccessfulRun()`
  - Added a regression test proving a pending steer no longer skips later persisted user messages with earlier timestamps
- Completed **B**:
  - Added a completed-message boundary guard in `AgentTurnCoordinator` so `text_start` no longer flushes an incomplete prior turn
  - Incomplete accumulated text is discarded rather than emitted as a completed intermediate turn when a new text stream begins before `message_end`
  - Added a regression test for `text_start → text_delta → text_start` without `message_end`
  - Updated the existing streamed-turn test to reflect the required completed-message boundary
- Completed **M**:
  - Added a `completedRef` guard to prompt timeout state so late timeout callbacks do nothing after prompt completion
  - Marked prompt completion before `clearTimeout()` and unsubscribe in `runAgentPrompt()`
  - Added coordinator-level regression coverage proving completed prompts ignore later timeout callbacks
  - Added orchestrator-level regression coverage for a queued late-timeout callback after prompt completion
- Completed **Instrumentation**:
  - `finalizeSuccessfulRun()` now logs `cursorBefore`, `cursorAfterEnd`, `pendingSteerCount`, `pendingSteerTimestamps`, `cursorAfterSteer`, and remaining persisted messages
  - `AgentTurnCoordinator` now logs `text_start` and `message_end` turn-boundary state with lengths/phases/stop reasons
  - `runAgentPrompt()` now logs `session.prompt()` resolve state (`sessionIsStreaming`, `sessionIsCompacting`, `sessionIsRetrying`, `promptDurationMs`)
  - `waitForSessionIdle()` now reports settle duration/state on exit
- Completed **A1** (smart-compaction pivot-aware compaction):
  - Implemented in `runtime/src/extensions/smart-compaction.ts`
  - Added `detectRecentTopicShift()` with three-tier detection:
    - Strong cues (`new topic`, `ignore that`, `unrelated`, `different topic/issue/problem`) fire independently
    - Weak cues (`instead`, `switch to`, `back to`, `moving on`, etc.) only fire when paired with very low lexical overlap (Jaccard ≤ 0.05)
    - Standalone zero lexical overlap between substantial turns fires independently
  - Updated `SYSTEM_PROMPT` with rules 6 (Topic Pivots) and 7 (Active vs Background), and new output sections `## Current Active Topic` and `## Historical / Background Context`
  - Prompt metadata uses `## Detected Active Topic (from latest messages)` to avoid name collision with iterative previous-summary payloads
  - Previous-summary embed now includes disambiguation note for stale `Current Active Topic` sections
  - Minimal-content no-op path now checks `!topicShift` to prevent stale-summary reuse when a short user message is a pivot
  - Added `findLatestUserRequest()` and always pin latest user instruction + context in excerpts
  - Separated `LATEST_REQUEST_CONTEXT_AFTER = 4` from `TOPIC_SHIFT_CONTEXT_AFTER = 6` for independent tuning
  - Added structured logging via `createLogger("ext.smart-compaction")` for pivot detection outcomes
  - Extensive inline A1 requirement comments documenting rationale
  - Audit findings and resolutions:

    | # | Finding | Severity | Resolution |
    |---|---|---|---|
    | 1 | Pivot cue regex false-positive exposure | 🟠 High | Split into `STRONG_PIVOT_CUE_REGEX` (standalone) and `WEAK_PIVOT_CUE_REGEX` (requires overlap confirmation) |
    | 2 | Weak and strong cues OR'd | 🟠 High | Three-tier: strong=standalone, weak=needs overlap ≤ 0.05, standalone overlap=needs Jaccard 0 |
    | 3 | `detectRecentTopicShift` called twice | 🟡 Low | Computed once in handler, passed to both `tryNoOpCompaction()` and `buildSelectivePrompt()` |
    | 4 | `TOPIC_SHIFT_CONTEXT_AFTER` reused for two purposes | 🟡 Low | Separated into `LATEST_REQUEST_CONTEXT_AFTER` and `TOPIC_SHIFT_CONTEXT_AFTER` |
    | 5 | Module docstring missing A1 | 🟡 Low | Added pivot-aware bullet to header |
    | 6 | Iterative compaction heading collision | 🟡 Med | Renamed prompt metadata heading; added disambiguation note before previous summary |
    | 7 | No false-positive resilience tests | 🟠 High | Added 4 tests: "instead"/"back to"/"switch" correctly NOT flagged; "ignore that + unrelated" correctly flagged |
    | 8 | Jaccard boundary untested | 🟡 Low | Added boundary test (2 shared tokens / ~10 unique → overlap ~0.2 → not flagged) |
    | 9 | Non-shift prompt path inert | ✅ OK | Confirmed still inert |
    | 10 | No structured logging | 🟡 Med | Added `log.debug("Pivot detection result", ...)` in handler |

  - Tests: 27 pass / 0 fail in `runtime/test/extensions/smart-compaction.test.ts`
  - Typecheck: clean

- Completed **C1**:
  - Decision: increase the default `waitForSessionIdle()` settle window from 10 ticks (500ms) to 20 ticks (1000ms)
  - Rationale: with instrumentation in place, the remaining risk is a trailing phase gap after `session.prompt()` resolves; a 1s window materially reduces false-idle detection with low cost
  - Added regression coverage proving a 600ms idle gap between phases does not settle early
- Completed **P1** (redundant `resumeChat()` wake deduplication):
  - Audited all 4 `resumeChat` / `resumePendingChats` call sites:
    - **S1** `handleAgentMessage` backlog wake (line 493) — generic "wake the lane"
    - **S2** `materializeNextDeferredFollowup` (line 889) — targeted per-materialized-row
    - **S3** `finalizeSuccessfulRun` remaining-persisted (line 1102) — targeted per-cursor-advance
    - **S4** `resumePendingChats` startup recovery (recovery.ts) — different lane (`__recovery__`)
  - Root cause: S1 used a cursor-snapshot frontier key (`resume:${chatJid}:${cursor}`), which never collided with S3's post-advance key, so the queue couldn't deduplicate them. S1's callback then ran and found nothing → spurious no-op `processChat`.
  - Fix: S1 (no `threadRootId`) now uses a stable key `resume:${chatJid}:wake`. The queue deduplicates repeated generic wakes. S2/S3 still use unique per-row keys.
  - Removed `getChatCursor` from `ResumeChatContext` (no longer needed).
  - Updated `getResumeChatContext()` in `WebChannelRuntimeStateService`.
  - Files: `chat-run-control.ts`, `runtime-state-service.ts`
  - Tests: 78 pass / 0 fail across 5 web channel test files
  - Typecheck: clean
- Verification:
  - `bun test runtime/test/agent-pool/prompt-utils.test.ts runtime/test/agent-pool/run-agent-orchestrator.test.ts runtime/test/agent-pool/turn-coordinator.test.ts`
  - `bun test runtime/test/channels/web/pending-steering.test.ts runtime/test/channels/web/runtime/runtime-state-service.test.ts runtime/test/channels/web/runtime/runtime-followup-facade-service.test.ts runtime/test/channels/web/web-channel-runtime-followup-delegation.test.ts runtime/test/channels/web/core/web-channel-runtime-public-surface-service.test.ts runtime/test/channels/web/web-channel.test.ts`
  - `bun run typecheck`

## Notes

- Cross-context leakage (symptom 2) was investigated but found to be properly isolated at the session level. Shared workspace notes are by design.
- The `AgentQueue` lane serialization (symptom 5) is correct at the queue level. Stagger perception comes from spurious no-op `processChat` invocations and the "already processing" retry pattern.
- The compaction-summary stale topic issue (Suspect A) was a model behavior tradeoff, not a code bug. Addressed with pivot-aware compaction in `smart-compaction.ts` (A1) rather than upstream changes.

## Links

- Audit: `notes/audits/turn-mechanism-audit-2026-04-16.md`
- `runtime/src/channels/web/handlers/agent.ts`
- `runtime/src/channels/web/runtime/pending-steering.ts`
- `runtime/src/agent-pool/turn-coordinator.ts`
- `runtime/src/agent-pool/run-agent-orchestrator.ts`
- `runtime/src/extensions/smart-compaction.ts`
- `runtime/test/extensions/smart-compaction.test.ts`
- `runtime/src/agent-pool/prompt-utils.ts`

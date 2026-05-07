---
id: parallel-web-chat-windows-with-session-forks
title: Support multiple parallel web chat windows backed by resumable forked sessions
status: done
priority: high
created: 2026-03-14
updated: 2026-03-18
completed: 2026-03-18
target_release: v1.5.5
estimate: L
risk: high
tags:
  - work-item
  - kanban
  - web
  - sessions
  - sqlite
  - threading
  - ux
  - architecture
owner: pi
---

# Support multiple parallel web chat windows backed by resumable forked sessions

## Summary

Add support for opening and managing **multiple parallel web chat windows** that
share a common conversation ancestry but run as distinct, resumable session
forks.

A new pop-out chat window should explicitly **fork from the current branch's
session state at creation time** — much like BTW reseeds from the current chat
context — but then continue as a **persistent first-class branch** with its own
runtime identity, queue/recovery state, and resumable history.

The user should be able to duplicate or fork the current chat into a new window
or pane, continue independently there, and later resume that branch without
corrupting, reparenting, or interleaving history from sibling branches.

There should also be a clear **session picker** for reopening/resuming existing
branches, but it must remain extremely easy to start a **new pop-up chat
window** without navigating a heavy management flow first.

That pop-up should be a **chat-only window**: it should include the relevant
compose/timeline/session controls, but **not** the editor or workspace explorer.

This needs a design that fits both:

1. Pi upstream session semantics, especially the append-only JSONL **session
   tree** and explicit `/fork` vs `/tree` behavior.
2. PiClaw’s current SQLite-backed web timeline/runtime model, where per-chat run
   state is currently keyed primarily by `chat_jid` and timeline rows live in a
   shared `messages` table.

## Design Constraints

- Do **not** collapse parallel web branches into one shared monolithic active
  session.
- A new pop-out branch should **fork from the current branch/session context at
  creation time**, rather than starting cold.
- That forking model should be understood as similar in spirit to BTW's
  reseeded side-session behavior, but the resulting pop-out must become a
  **persistent first-class branch**, not an ephemeral side panel.
- Reuse the **same SQLite database** for all parallel sessions/branches rather
  than inventing a separate side store.
- Isolation must come from **branch/session identity inside the existing DB
  model**, not from pretending all windows are one session with one shared leaf.
- Upstream Pi session-tree behavior should inform ancestry/resume design, but
  PiClaw’s web runtime should treat parallel branches as distinct resumable
  execution contexts.

## Why

Today the web UI effectively treats a chat like one active conversation lane.
That is good for a simple timeline, but it becomes limiting when the user wants
to:

- branch an investigation into multiple approaches in parallel
- keep one branch stable while experimenting in another
- open the same conversation context in multiple windows or panes
- start a fresh **chat-only** pop-up chat window with minimal friction
- resume a prior fork from a session picker without mixing its later turns into
  the main branch
- preserve accurate thread ancestry and recovery behavior per branch

The upstream Pi session model already supports tree navigation and forked
sessions. PiClaw should take advantage of that for ancestry, resume, and branch
semantics — and the first pop-out-window mental model should be explicit: fork
from the current session state first, then continue independently. In other
words, treat BTW's reseeded side-session approach as a conceptual stepping stone
for how a branch is born, but not as the final persistence model.

The web runtime should still persist and isolate **multiple parallel sessions
inside the same SQLite database**, not force them through one shared live
session.

## Problem Statement

PiClaw’s current schema and web runtime are optimized for a single active chat
stream per `chat_jid`:

- timeline rows live in `messages`
- per-chat run state lives in `chat_cursors`
- restart/recovery, deferred follow-ups, and inflight bookkeeping are keyed by
  `chat_jid`
- the web UI compose/timeline pair assumes one canonical live conversation
  stream for the chat

That creates several design problems for parallel windows/forks:

- two web windows should not race on the same `chat_cursors` row if they are
  logically different conversation branches
- a resumed fork must not pollute the main branch timeline or steal queued work
  from it
- recovery and queue semantics must remain exactly-once **per branch**, not just
  per top-level chat
- a copied compose/timeline pane or pop-up chat window needs a stable identity
  that survives reloads and restart
- the pop-up chat window should be intentionally **narrower in scope** than the
  main shell: chat/session UI only, with no editor or workspace explorer
- the UI needs both:
  - a lightweight “new pop-up chat” affordance for fast branching
  - a session picker for resuming older branches intentionally
- the storage model should preserve ancestry and enable resuming prior branches,
  not just ephemeral client-side tabs

The ticket is to investigate the best architecture and define an implementable
path, not to immediately code a speculative schema rewrite.

## Required Investigation

### 1) Upstream Pi session model
Investigate and document how Pi’s current session system should shape the web
branching design:

- JSONL session tree format and leaf-pointer behavior
- `/tree` navigation within one session file
- `/fork` creation of a new session file with `parentSession`
- session selector / resume semantics
- branch summaries / compaction interactions
- whether a PiClaw web branch should map to:
  - a new upstream session file,
  - SQLite-managed parallel session metadata that references upstream ancestry,
  - or a hybrid model
- which parts of upstream session trees are useful for ancestry/navigation, and
  which parts should **not** become the sole source of truth for concurrent web
  branches

### 2) Current Pi “multiplayer mode” / adjacent extensions
Investigate what upstream Pi already exposes that is adjacent to multi-window or
multi-actor usage, including:

- current session selector / resume UI behavior
- session metadata extensions such as `session-name.ts`
- tree navigation hooks and branch summarization hooks
- any existing extension or example that approximates “multiplayer mode”,
  collaborative session coordination, or multiple simultaneously visible
  session contexts

If no real multiplayer extension exists upstream, capture that explicitly and
use it to justify a PiClaw-specific design.

### 3) PiClaw SQLite design within the current schema direction
Define the best approach for representing multiple web-visible session branches
without breaking existing data/recovery guarantees.

The design should start from the current schema reality:

- `messages` stores the web-visible timeline rows
- `chat_cursors` is the current source of truth for per-chat run state
- `web_sessions` is authentication/session state, not conversation state

The investigation should compare at least these options:

#### Option A — synthetic branch-specific chat ids
Represent each parallel window as its own logical chat identity (for example,
`web:<root>:<branch>`), keeping current tables mostly intact.

**Pros:** reuses existing queue/recovery machinery keyed by chat id.  
**Cons:** risks awkward UX, duplicated chat metadata, and fuzzy relationship to
one human-visible conversation.

#### Option B — add a branch/session key alongside `chat_jid`
Keep one top-level chat, but introduce a stable branch/session key used by:

- timeline filtering
- compose submission routing
- `chat_cursors` / inflight state
- deferred queued follow-ups
- window/pane restoration
- per-branch resume/recovery

This is still one shared SQLite database, but no longer one shared runtime
session.

**Pros:** models one chat with multiple resumable branches more directly.  
**Cons:** requires schema and API widening across many code paths.

#### Option C — branch registry + materialized per-branch views
Add an explicit branch/session table that maps branch ids to:

- root chat
- upstream session file or ancestry reference
- display name
- parent branch
- active/archived state
- current leaf / last-visible message watermark
- branch-local queue/recovery/session state

Then keep `messages` as the common ledger while deriving branch timelines from
branch metadata.

**Pros:** strongest long-term model for multiple parallel sessions inside one DB.  
**Cons:** biggest design and migration surface.

## Desired Outcome

Pick and justify one recommended approach that:

- supports parallel compose/timeline surfaces safely
- preserves resumability across reload/restart
- keeps branch history isolated unless intentionally merged/navigated
- aligns with upstream Pi session-tree semantics instead of fighting them
- keeps **parallel sessions distinct inside the same SQLite database** instead
  of collapsing them into one live runtime session
- can be implemented incrementally without destabilizing the existing web chat
  loop

## Scope

### In scope
- Define the product and persistence model for parallel web chat windows / panes.
- Investigate how upstream Pi sessions, `/tree`, and `/fork` should map into web
  UX.
- Identify whether branch identity should live in current tables, new tables, or
  a hybrid layer.
- Define how resume/reload/recovery should work per branch.
- Define how copied compose/timeline panes or pop-up chat windows are created,
  named, restored, and closed.
- Define the UI contract for a pop-up chat window as a **chat-only surface**
  with no editor/workspace explorer chrome.
- Define the UX split between:
  - instant “new chat window” creation
  - deliberate resume/reopen via a session picker
- Decide whether branch state is primarily:
  - server-authoritative,
  - browser-restorable,
  - or both.

### Out of scope
- Implementing a full collaborative multi-user editing/chat product in this
  ticket
- True simultaneous shared typing/presence across remote users
- Merging divergent branches back into one transcript automatically
- Replacing upstream Pi session persistence entirely

## Acceptance Criteria

- [x] A written design identifies the recommended persistence model for parallel
      chat windows/forks.
- [x] The design explicitly maps PiClaw web branches to upstream Pi session
      concepts (`/tree`, `/fork`, session file, leaf, branch summary).
- [x] The design explains how multiple compose/timeline panes can coexist
      without sharing or corrupting inflight state.
- [x] The design explains how restart/reload recovery remains exactly-once per
      branch.
- [x] The design explains how branch timelines are isolated in SQLite while
      remaining resumable.
- [x] The design explains how a user reopens or resumes an older branch from a
      session picker UI.
- [x] The design defines a low-friction affordance for starting a new pop-up
      chat window / branch.
- [x] The design explicitly defines the pop-up as a **chat-only** window with
      no editor or workspace explorer.
- [x] The design identifies whether current schema extension is sufficient or a
      new branch/session table is required.
- [x] The design includes at least one incremental implementation path rather
      than an all-or-nothing rewrite.

## Investigation Questions

- Should a web branch correspond to an upstream **forked session file**, to a
  SQLite branch/session row, or to a hybrid of both?
- Which upstream session-tree semantics are useful for ancestry and resume,
  without forcing sibling web windows to share one active leaf pointer?
- If using forked session files underneath, how do we retain a coherent “same
  chat, new branch” experience in the web UI while still keeping one SQLite DB?
- Is `chat_jid` currently too coarse as the primary runtime key for parallel web
  branches?
- Can `chat_cursors` evolve from per-chat to per-chat-per-branch without
  destabilizing existing guarantees?
- Should branch-specific timeline visibility be represented by:
  - explicit branch ids on messages,
  - branch membership metadata elsewhere,
  - or separate logical chats?
- How should queued follow-ups, steering, and restart recovery behave when two
  sibling branches both have pending work?
- How should the UI show branch ancestry, labels, and resume targets in a
  session picker?
- What is the fastest acceptable UX for “new pop-up chat window”:
  - one-click button,
  - duplicate-current-branch action,
  - or keyboard shortcut?
- Which controls still belong in the pop-up chat-only window, and which remain
  exclusive to the main shell?
- What parts of upstream Pi already help here (session tree, session selector,
  session naming, branch summaries), and what is still missing?
- Is there any upstream “multiplayer mode” extension or prior art worth reusing,
  or is this fundamentally a PiClaw-specific orchestration layer?

## Proposed Work Plan

1. **Upstream capability audit**
   - Read and summarize upstream session docs, `/tree`, `/fork`, and session
     selector behavior.
   - Audit extension examples related to session naming, metadata, and branch
     hooks.
   - Confirm whether any real multiplayer/collaboration extension exists.

2. **Current-state PiClaw audit**
   - Trace how `messages`, `thread_id`, `chat_cursors`, deferred follow-ups, and
     recovery currently assume a single active branch per `chat_jid`.
   - Identify which APIs, SSE payloads, and UI stores would need a branch key.

3. **Schema/design options memo**
   - Compare Option A/B/C above against migration risk, UX clarity, and runtime
     safety.
   - Recommend one primary path and one fallback path.

4. **Incremental implementation proposal**
   - Define a smallest shippable slice, e.g.:
     - one-click open current branch in a second pane/window or pop-up
     - fork into new branch id
     - keep branch-local queue/recovery
     - add a basic session picker for reopen/resume
     - restore branch tabs/windows after reload

## Test Plan

- [ ] Add design notes or ADR-level documentation before code.
- [ ] If implementation starts, add DB tests covering branch-local inflight and
      deferred state.
- [ ] Add web tests for duplicated/forked chat panes that submit independently.
- [ ] Add restart/recovery tests proving branches do not steal each other’s
      queued or inflight turns.
- [ ] Run `cd /workspace/piclaw/piclaw && bun run quality` for any code-bearing
      follow-up.

## Definition of Done

- [x] Recommended architecture documented and linked from the ticket
- [x] Upstream Pi session-tree/fork behavior evaluated explicitly
- [x] Current-state SQLite fit/gap analysis documented
- [x] “Multiplayer mode” / adjacent upstream extensions investigated and
      summarized
- [x] Incremental implementation plan identified
- [x] Follow-up execution ticket(s) created if implementation is split

## Updates

### 2026-03-18
- Lane change: `20-doing` → `50-done` after the remaining branch/session hardening work shipped in the `v1.5.5` line and the feature set was judged complete enough to close the umbrella.
- The originally investigatory/design-heavy ticket is now satisfied by the shipped hybrid model: explicit branch registry metadata, forked branch creation, chat-only pop-out windows/new tabs, branch picker/restore flows, rename/prune/archive handling, branch-scoped SSE routing, and per-chat runtime/recovery isolation keyed through distinct branch chat identities.
- User-facing validation during the `v1.5.5` sweep also covered archived restore/current-session targeting, `@handle — chat_jid` labelling, search-view isolation, reload recovery, and other edge hardening that had been keeping this umbrella open past the initial implementation slice.
- Evidence:
  - `piclaw/piclaw/src/channels/web/handlers/agent.ts`
  - `piclaw/piclaw/src/channels/web.ts`
  - `piclaw/piclaw/web/src/app.ts`
  - `piclaw/piclaw/test/channels/web/web-channel.test.ts`
  - `piclaw/piclaw/test/channels/web/browser-chat-isolation.optional.test.ts`
  - GitHub release `v1.5.5 — Flint Castwood`
- Quality: ★★★★★ 10/10 (problem: 2, scope: 2, test: 2, deps: 2, risk: 2)

### 2026-03-17
- Created focused child ticket `workitems/10-next/branch-agent-rename-and-old-branch-reuse.md` to track branch identity lifecycle separately: rename to prior tree-style identities and deliberate archived-branch reuse/reopen.
- This keeps the umbrella ticket focused on cross-cutting multi-chat architecture/runtime work while giving naming/reuse its own acceptance criteria and test surface.

### 2026-03-16
- This ticket remains the main umbrella for the multi-chat / branch-agent work and is now mostly in **hardening/polish** rather than missing-core-architecture territory.
- Major shipped slices now include: branch registry, branch fork/open flow, browser-aware popup/new-tab behaviour, iOS-safe branch opening, branch picker, branch rename, branch prune/archive, branch-aware read/write/action routing, per-chat pane/model/context state, lane-aware parallel runtime execution, strict chat-scoped SSE enforcement, and dedicated multi-chat isolation coverage.
- Current status is best described as “functionally implemented, but still being tightened at the edges” — especially around browser-level isolation/E2E coverage, final UX polish, and any remaining real-world queue/recovery regressions the user can still reproduce.
- Source-only branch fixes from the latest suffix (branch-aware queue steer/remove, stale queued-steer UI clearing, BTW branch-awareness, pruned-handle reuse) remain part of this umbrella until explicitly reloaded/live-validated.

### 2026-03-15
- Refined to make the session-forking model explicit: a new pop-out chat window should fork from the current branch/session context at creation time, in the same broad spirit as BTW reseeding, but then persist as a first-class branch with its own queue/recovery/runtime state.
- Began implementation-adjacent groundwork by adding backend peer-agent messaging substrate:
  - `GET /agent/active-chats`
  - `POST /agent/peer-message`
  - `POST /agent/:id/message?chat_jid=...` now reuses the normal send path for non-default branch chats
- This does not complete pop-out chats by itself, but it establishes a concrete path for active chat windows/agents to communicate with each other using normal target-chat queue/defer semantics.
- Architecture choice was then made explicitly: **Option C** is now the target model, because chat branches need to align with Pi session-tree semantics and may mature into stable named `@agent` identities.
- Implemented the first C-shaped slice as an explicit SQLite branch registry instead of ad hoc handle derivation:
  - added `chat_branches` table with first-class branch/session metadata (`branch_id`, `chat_jid`, `root_chat_jid`, `parent_branch_id`, `agent_name`, `display_name`, lifecycle timestamps)
  - added DB helpers for branch lookup/creation by `chat_jid` and `agent_name`
  - active-chat listing and `@name` routing now prefer registry-backed branch identities
- Implemented the first real branch-fork flow on top of Pi session ancestry:
  - added `POST /agent/branch-fork`
  - backend creates a new branch row, assigns a unique `@agent` name, creates a distinct chat/session identity, and seeds a new Pi session with `parentSession` pointing at the source session plus carried-forward context/model/thinking state
  - compose-corner pop-out now forks a real branch first, then opens that branch in chat-only window mode
- This is intentionally still a first slice of C, not the whole end-state:
  - branch-local runtime/recovery still primarily keys off `chat_jid`
  - the explicit registry now owns naming/ancestry/lifecycle metadata so later work can move queue/recovery/session-picker logic onto it without another conceptual rewrite
- Explicit follow-up reminder: the current registry-backed `agent_name` / handle values are still provisional. We will need a deliberate rename story for branch agents/handles so identities can be cleaned up and retitled after creation without breaking routing or discoverability.
- To fully complete the broader multi-chat / multi-agent feature, the remaining product slices should be treated as first-class requirements rather than polish:
  - complete real browser/device-safe branch opening flows, especially iOS Safari and mobile new-tab behaviour
  - make branch/session switching feel complete, including stronger session picker semantics and clearer active/inactive branch state
  - add deliberate agent/branch rename support so `@agent` identities are not stuck with first-generated handles
  - improve user-facing failure modes for branch open/fork flows (blocked popup, standalone mode, no stable fork point, backend failure)
  - finish branch-aware live updates/reconnect behaviour so branch windows do not need manual refreshes after reload/restart events
  - ensure each chat/branch has its own independent request/tool/draft/thought UI state, rather than sharing a single transient pane state across chats
  - extend the runtime/agent loop so distinct chats can actually make progress in parallel, instead of a nominal multi-chat UI sitting on top of effectively serial handling
  - continue moving from “branch metadata exists” toward “each chat really is a durable addressable agent” across runtime, recovery, and UX

### 2026-03-14
- Ticket created from a user request for multiple parallel chat windows with
  different session forks and resumable history isolation.
- Initial framing assumes the solution should build on upstream Pi session-tree
  semantics rather than invent an unrelated browser-only branch model.
- Current known constraint captured: PiClaw run/recovery state is keyed largely
  by `chat_jid` via `chat_cursors`, which is likely too coarse for safe parallel
  branch execution.
- Upstream session-tree/session-selector capabilities are known to exist, but no
  obvious first-party “multiplayer mode” extension has yet been identified.
- User clarified an important hard requirement: this should **not** become one
  shared monolithic session. The intended direction is **multiple parallel
  sessions reusing the same SQLite database**, with isolated branch/session run
  state inside that DB.
- User also clarified the desired UX shape: there should be a **session picker**
  for resume/reopen, but starting a **new pop-up chat window** should be very
  easy and should not require going through a heavy picker-first flow.
- User further clarified that the pop-up should be **chat-only** and should
  **not** include the editor or workspace explorer.

## Links

- `piclaw/piclaw/node_modules/@earendil-works/pi-coding-agent/docs/session.md`
- `piclaw/piclaw/node_modules/@earendil-works/pi-coding-agent/docs/tree.md`
- `piclaw/piclaw/node_modules/@earendil-works/pi-coding-agent/examples/sdk/11-sessions.ts`
- `piclaw/piclaw/node_modules/@earendil-works/pi-coding-agent/examples/extensions/session-name.ts`
- `piclaw/piclaw/src/db/connection.ts`
- `piclaw/piclaw/src/db/chat-cursors.ts`
- `piclaw/piclaw/src/channels/web/handlers/agent.ts`
- `piclaw/piclaw/src/channels/web/recovery.ts`
- `piclaw/piclaw/src/channels/web/timeline-service.ts`
- `piclaw/piclaw/web/src/app.ts`
- `workitems/10-next/branch-agent-rename-and-old-branch-reuse.md`

---
id: reduce-cold-session-bootstrap-memory-and-eager-extension-load
title: "Reduce cold session bootstrap memory and eager extension load"
status: review
priority: high
created: 2026-04-17
updated: 2026-04-19
tags:
  - work-item
  - kanban
  - memory
  - performance
  - startup
  - extensions
  - session-lifecycle
owner: smith
blocked-by: []
---

# Reduce cold session bootstrap memory and eager extension load

## Summary

Continue the RAM and startup work with a focused cold-session bootstrap pass.

This ticket captures the audited causes of the 2026-04-17 startup crash loop, the quick wins already landed, and the remaining implementation plan to reduce fresh session cost without regressing normal chat behavior.

The core finding is that Piclaw was OOM-killed during startup session creation, then restart-looped under `systemd --user`. The biggest cold-path wins came from disabling startup warmup by default and removing two workspace-local extensions from the active load path. The next tranche should target eager extension loading and `session_start` work that is still executed for every fresh session.

User requirement for this tranche: **workspace indexing must move out of the session bootstrap path into a separate minimal process**. The main runtime should start that work asynchronously, without awaiting it during session creation, and the spawned indexer should load only the code it needs to build or refresh the workspace index.

## Current findings

### Incident summary
- The crash was **not** a normal app exception.
- `journalctl --user -u piclaw.service` showed repeated:
  - `A process of this unit has been killed by the OOM killer`
  - `Failed with result 'oom-kill'`
- The runtime entered a restart storm:
  - boot
  - web listen
  - `agent-pool` logs `Creating new session`
  - OOM kill
  - restart
- During the observed incident window there were **106 `oom-kill` failures**.
- Per failed attempt, systemd logged roughly:
  - **~1.9s CPU time**
  - **~475–477 MB memory peak**
- The visible “100% CPU” symptom was therefore a restart storm, not a confirmed tight render loop.

### Highest-confidence root cause
- The strongest trigger was **startup session creation**.
- The critical journal sequence was consistent:
  - `Web UI listening`
  - `Creating new session`
  - OOM kill within ~1s
- `runtime/src/runtime/startup.ts` had been queuing startup session warmup automatically.
- `AgentSessionManager.prewarm()` ultimately materializes a real runtime, so startup warmup was paying the full session-bootstrap cost on the cold path.

### Quick wins already landed

#### 1. Startup warmup disabled by default
- `runtime/src/runtime/startup.ts`
- `runtime/test/runtime/startup.test.ts`

Behavior now:
- no default-chat warmup by default
- no recent-chat warmup by default
- warmup remains available only through explicit opt-in parameters

#### 2. Workspace-local extension removals
Moved out of active `.pi/extensions/` and into `.pi/disabled-extensions/`:
- `github-copilot-opus-1m-safe.ts`
- `gist-badlogic-edit.ts`

Disabled copies now live under:
- `.pi/disabled-extensions/github-copilot-opus-1m-safe-20260417T183413Z/index.ts`
- `.pi/disabled-extensions/gist-badlogic-edit-20260417T183413Z/index.ts`

### Cold-session measurements

#### Fresh-process cold-session benchmarks
| Scenario | Time | RSS delta | Notes |
|---|---:|---:|---|
| Empty workspace baseline | ~370 ms | ~83.3 MB | no custom workspace extensions |
| Real workspace before removing workspace extensions | ~630 ms | ~133.3 MB | included `.pi/extensions` overrides |
| Real workspace after removing those extensions | ~314 ms | ~81.3 MB | now close to base bootstrap cost |

#### Isolated extension measurements
| Scenario | Time | RSS delta | Finding |
|---|---:|---:|---|
| `github-copilot-opus-1m-safe.ts` only | ~405 ms | ~86.7 MB | small increment over baseline |
| `gist-badlogic-edit.ts` only | ~1956 ms | ~129.8 MB | dominant workspace-specific offender |

#### Workspace search indexing measurement
Standalone `refreshWorkspaceIndex({ scope: "all" })` against the real workspace measured roughly:
- **~842 ms**
- **~7.7 MB RSS delta**
- **178 indexed files**
- roots: `notes`, `.pi/skills`

This is not the biggest RAM spike, but it is still real cold-path work. The intended fix is now explicit: **do not run this inside session bootstrap**. Start it in a separate asynchronous process that loads only the indexing stack it needs.

### Structural findings from code audit

#### 1. `session_start` hooks are on the true cold path
The SDK awaits `session_start` handlers before session startup completes.

Evidence:
- `@earendil-works/pi-coding-agent/dist/core/agent-session.js`
- `await this._extensionRunner.emit(this._sessionStartEvent)`

Implication:
- any extension work registered on `session_start` is part of first-session latency and memory pressure

#### 2. Base session bootstrap is still expensive even after quick wins
Relevant path:
- `runtime/src/agent-pool/session.ts`
- `createAgentSessionServices(...)`
- `createAgentSessionRuntime(...)`
- `SessionManager.continueRecent(...)`

Even with an empty workspace and no local `.pi/extensions`, a cold session still costs roughly:
- **~370 ms**
- **~83.3 MB RSS**

That means there is still meaningful headroom in the base runtime bootstrap.

#### 3. Piclaw eagerly loads more packaged extensions than a normal Linux web chat needs
Relevant path:
- `runtime/src/agent-pool/session.ts`
- `OPTIONAL_EXTENSIONS`
- `getBundledExtensionPaths()`

The cold session path currently includes extensions that are not obviously required for a basic web chat session, including:
- browser CDP
- office viewer
- draw.io editor
- Windows PowerShell
- Windows UI

Observed evidence during profiling:
- `[office-viewer] WARNING: __piclaw_registerRoute not available. Route NOT registered.`
- `[drawio-editor] WARNING: __piclaw_registerRoute not available.`

Implication:
- these modules are being imported on the cold path even when they are not usable in the current runtime mode

#### 4. Some packaged integrations still do eager `session_start` work
Examples:
- `runtime/src/extensions/workspace-search.ts`
  - refreshes the workspace FTS index on `session_start`
- `runtime/extensions/integrations/azure-openai.ts`
  - refreshes provider registration on startup / `session_start`
- `runtime/extensions/integrations/context-mode.ts`
  - starts output-cleanup lifecycle work on `session_start`

These may be individually modest, but together they keep every fresh session heavier than necessary.

## Acceptance Criteria

- [ ] No session is materialized automatically on web startup unless explicitly required by traffic or an intentional warmup path.
- [ ] Fresh-process cold-session benchmarking is a first-class regression tool for this area.
- [ ] The real-workspace cold-session path is reduced again from the current post-removal baseline (~314 ms / ~81.3 MB RSS delta), or blockers are documented with measurements.
- [ ] Eager packaged extension loading is narrowed so platform/viewer/browser-specific modules are not imported for ordinary Linux web sessions unless they are actually needed.
- [ ] `session_start` hooks that do background-maintenance work are moved off the mandatory cold path or made one-time/process-level where appropriate.
- [ ] Workspace indexing no longer runs inside session bootstrap and is instead launched asynchronously in a separate minimal process.
- [ ] The separate workspace-indexing process loads only the code needed to discover, hash, and index configured roots; it does not construct a full agent session runtime.
- [ ] The running service can restart cleanly without re-entering a startup-created session storm.
- [ ] Follow-up work is split if the remaining base bootstrap cost needs a second ticket after the extension/load-path tranche lands.

## Implementation Paths

### Path 1 — Keep the startup warmup fix as a pinned invariant
Already landed, but keep this protected.

Tasks:
- preserve the default “no startup session warmup” policy
- make any future warmup opt-in, bounded, and measurable
- keep tests proving the default cold startup path does not prewarm real sessions

Why first:
- this is the direct mitigation for the restart-storm path already observed in production

### Path 2 — Stop eagerly loading unnecessary packaged extensions on Linux web cold start
Target:
- `runtime/src/agent-pool/session.ts`

Tasks:
- audit `OPTIONAL_EXTENSIONS` and classify each entry as:
  - always-needed
  - platform-specific
  - viewer-specific
  - browser-specific
  - tool-activation-only candidate
- remove obviously irrelevant modules from the default Linux web cold path, especially:
  - `browser/cdp-browser`
  - `viewers/office-viewer`
  - `viewers/drawio-editor`
  - `platform/windows/powershell`
  - `platform/windows/win-ui`
- ensure these still load correctly when their actual surface is used

Why second:
- this is the clearest remaining structural waste on the cold path after the workspace-extension removals

### Path 3 — Move background-maintenance extension work off `session_start`
Targets:
- `runtime/src/extensions/workspace-search.ts`
- `runtime/src/workspace-search.ts`
- new minimal workspace-indexer entrypoint/process
- `runtime/extensions/integrations/azure-openai.ts`
- `runtime/extensions/integrations/context-mode.ts`

Tasks:
- replace mandatory workspace FTS refresh on `session_start` with a **fire-and-forget separate process** started by the main runtime
- ensure the main runtime only:
  - checks whether an index refresh is needed
  - launches the indexer asynchronously
  - records status / staleness / last-run state
  - never awaits the indexing work during session creation
- implement the separate indexer as a **minimal entrypoint** that loads only the code needed to:
  - resolve workspace-search roots and limits
  - open the database
  - walk files
  - update workspace FTS tables / status rows
  - exit
- avoid constructing a full agent session runtime, extension runner, or web runtime inside the indexer process
- decide the trigger policy explicitly:
  - startup kick-off
  - stale-index kick-off
  - first `search_workspace` fallback kick-off when index is missing/stale
- make Azure provider refresh one-time/cached where possible instead of per-session cold work
- ensure tool-output cleanup startup is process-scoped and idempotent rather than session-scoped

Why third:
- these hooks are definitely awaited on the cold path, and workspace indexing in particular is a better fit for an isolated asynchronous process than for session bootstrap

### Path 4 — Introduce clearer bootstrap classes for extensions
Goal:
- make the extension load path explicit instead of relying on all session-owned extensions behaving cheaply

Possible shape:
- process bootstrap
- session bootstrap
- first-use / tool-activation bootstrap
- platform-conditional bootstrap

Tasks:
- document the intended contract
- refactor the worst cold-path modules into the right lifecycle class
- avoid requiring a full extension import just to learn that an extension is irrelevant in the current runtime

Why fourth:
- this prevents the same class of regressions from returning as more extensions accumulate

### Path 5 — Add a repeatable cold-session benchmark harness
Targets:
- new runtime benchmark script or focused test utility

Tasks:
- create a fresh-process benchmark that records at least:
  - elapsed time
  - RSS delta
  - tool count
- support at least these scenarios:
  - empty workspace
  - real workspace
  - real workspace with local extensions disabled
  - isolated extension profiling
- store current baselines in the ticket updates

Why fifth:
- this area is too sensitive to rely on anecdotal “feels faster” verification

### Path 6 — Re-rank the remaining base bootstrap cost after extension/load-path cleanup
Only do this after Paths 2–5 land.

Tasks:
- profile the residual `createAgentSessionServices(...)` / `createAgentSessionRuntime(...)` cost again
- inspect whether remaining cost is dominated by:
  - resource loader construction
  - model registry/provider setup
  - session resume logic
  - system prompt/resource expansion
- split a follow-up ticket if the remaining base cost needs deeper SDK/runtime changes

Why last:
- the recent extension removals collapsed the real-workspace cold session close to the base bootstrap cost; re-ranking only makes sense after the next load-path tranche lands

## Test Plan

- Applicable regression classes from `workitems/regression-test-planning-reference.md`:
  - [x] Bug replay / known-regression test
  - [x] State-machine / invariant test
  - [ ] Routing matrix test
  - [ ] Interaction scenario test
  - [x] Restore / reconnect matrix test
  - [x] Pane / viewer contract test
  - [ ] Real-browser smoke test

- Which regression classes does this ticket risk, and which tests will pin them?
  - **Bug replay / known-regression:** the ticket directly follows a real startup OOM/restart-storm incident. Pin the “no implicit startup warmup” rule and the cold-start session path.
  - **State-machine / invariant:** extension load-path changes must not silently materialize sessions, duplicate startup hooks, or change activation semantics.
  - **Restore / reconnect:** startup/reload behavior must still restore chat state correctly without default prewarm.
  - **Pane / viewer contract:** if office/draw.io/browser-related extensions move off the default cold path, viewer routing and activation rules must be pinned so those features still load when intentionally used.
  - **No routing matrix planned initially:** this work is not primarily changing chat ownership/routing rules.
  - **Real-browser smoke:** not required unless viewer/browser detachment or route activation semantics change in a way unit tests cannot model.

- [ ] Existing tests to rerun are listed
- [ ] New regression coverage to add is listed
- [ ] Real-browser smoke pass required? If yes, record the surface

### Existing tests to rerun
- `runtime/test/runtime/startup.test.ts`
- `runtime/test/agent-pool/session-manager.test.ts`
- `runtime/test/agent-pool/agent-pool.test.ts`
- `runtime/test/agent-pool/mcp-adapter-bundled.test.ts`
- `runtime/test/agent-pool/tool-activation-live-update.test.ts`
- viewer/route tests that cover office and draw.io loading once the gating changes are identified

### New regression coverage to add
- [ ] cold-start regression test proving startup does not implicitly materialize a main session
- [ ] fresh-process cold-session benchmark harness with stable output shape
- [ ] extension-gating regression for Linux web sessions (irrelevant packaged extensions not loaded by default)
- [ ] first-use activation test for any viewer/browser/tool moved off the default cold path
- [ ] workspace-search regression proving indexing is not required during session bootstrap
- [ ] separate-indexer launch test proving the main runtime starts indexing asynchronously without awaiting completion
- [ ] minimal-indexer contract test proving the indexer can refresh the workspace index without constructing a full agent session runtime
- [ ] process-scoped/idempotent startup test for tool-output cleanup and provider-refresh paths

## Definition of Done

- [ ] Audit findings are captured with measured evidence
- [ ] Quick wins already landed are recorded in the ticket history
- [ ] Default startup no longer creates cold sessions implicitly
- [ ] One meaningful additional cold-path reduction tranche lands with regression coverage
- [ ] Cold-session benchmark baselines are refreshed after the next tranche
- [ ] Reload/restart verification is recorded against the running service
- [ ] Deferred work is split into follow-up tickets if needed
- [ ] Ticket front matter and update history are current

## Updates

### 2026-04-19
- Moved doing → review via board batch action.

### 2026-04-17
- Audited the 2026-04-17 crash and confirmed it was a startup session-creation OOM loop, not a normal exception.
- Verified that `session_start` hooks are awaited and therefore sit on the true cold path.
- Landed the first mitigation: startup session warmup is now disabled by default.
- Profiled fresh-process cold-session cost and isolated workspace-specific contributors.
- Identified `gist-badlogic-edit.ts` as the dominant workspace-specific offender.
- Recorded the requirement that workspace indexing must move into a separate minimal asynchronous process rather than running inside session bootstrap.
- Removed the active workspace copies of:
  - `github-copilot-opus-1m-safe.ts`
  - `gist-badlogic-edit.ts`
- Re-profiled the real workspace after removal and saw the cold path drop from roughly **630 ms / 133.3 MB RSS delta** to **314 ms / 81.3 MB RSS delta**.
- Confirmed the running service restarted cleanly after the removals.
- Moved this ticket to `20-doing` and started the first implementation tranche for background workspace indexing.
- Added a separate minimal workspace-index process:
  - `runtime/src/workspace-index-process.ts`
- Wired process startup to launch that indexer asynchronously after DB init:
  - `runtime/src/runtime/startup.ts`
- Removed the blocking workspace-search `session_start` indexing hook:
  - `runtime/src/extensions/workspace-search.ts`
- Updated workspace-index status tracking so a running index job can report `indexing` via status rows.
- Added regression coverage for:
  - async launcher behavior
  - no duplicate relaunch while the child is active
  - no launch when the index is already ready
  - direct indexer entrypoint refresh
  - workspace-search extension no longer registering a blocking `session_start` hook
- Focused verification passed:
  - `runtime/test/workspace-index-process.test.ts`
  - `runtime/test/workspace-search.test.ts`
  - `runtime/test/extensions/extensions-workspace-search.test.ts`
  - `runtime/test/runtime/startup.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Fresh-process cold-session spot-check after removing the session-start indexing hook measured roughly **317 ms / 78.6 MB RSS delta** on the real workspace with background indexing disabled for the benchmark harness.
- Extended the background-indexing tranche so the indexer is now re-requested when workspace content is marked stale.
- Changed normal `search_workspace` behavior to be non-blocking by default:
  - missing/stale indexes now request a background refresh instead of forcing a blocking rebuild
  - `refresh: true` still forces a blocking refresh
  - `refresh_workspace_index` remains the explicit blocking refresh tool
- Added regression coverage for:
  - stale-mark relaunch requests
  - non-blocking search launching a background refresh when the index is missing
  - search extension defaulting to background refresh behavior unless `refresh: true` is provided
- Re-ran focused verification after this change:
  - `runtime/test/workspace-index-process.test.ts`
  - `runtime/test/workspace-search.test.ts`
  - `runtime/test/extensions/extensions-workspace-search.test.ts`
  - `runtime/test/runtime/startup.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Removed additional redundant cold-path hooks:
  - `runtime/extensions/integrations/context-mode.ts` no longer starts cleanup on every `session_start`
  - `runtime/extensions/integrations/azure-openai.ts` no longer performs an extra `session_start` refresh on top of its initial refresh
  - `runtime/extensions/experimental/azure-openai.harness.ts` no longer performs an extra `session_start` refresh on top of its initial refresh
- Narrowed bundled extension loading further in `runtime/src/agent-pool/session.ts`:
  - Windows-only bundled extensions are now excluded at path-selection time on non-Windows platforms
  - web viewer extensions (`office-viewer`, `drawio-editor`) are now excluded for non-web chats
- Added regression coverage for channel/platform gating:
  - `runtime/test/agent-pool/session-bundled-extension-gating.test.ts`
- Re-ran focused verification after this tranche:
  - `runtime/test/agent-pool/session-bundled-extension-gating.test.ts`
  - `runtime/test/extensions/session-shutdown-hooks.test.ts`
  - `runtime/test/workspace-index-process.test.ts`
  - `runtime/test/workspace-search.test.ts`
  - `runtime/test/extensions/extensions-workspace-search.test.ts`
  - `runtime/test/runtime/startup.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Fresh-process spot checks from this tranche:
  - web chat cold session: **296 ms / 80.0 MB RSS delta / 46 tools**
  - non-web chat cold session: **277 ms / 79.3 MB RSS delta / 44 tools**
- Added env-backed startup warmup controls so any intentional warmup stays bounded and deployment-tunable:
  - `PICLAW_STARTUP_WARM_DEFAULT_CHAT`
  - `PICLAW_STARTUP_WARMUP_RECENT_LIMIT`
- Added a hard cap for retained main sessions in `runtime/src/agent-pool/session-manager.ts`:
  - `PICLAW_MAIN_SESSION_POOL_MAX_SIZE`
  - alias: `PICLAW_SESSION_POOL_MAX_SIZE`
  - current default: **2** cached main sessions
- Changed recent-chat background warmup to a lightweight path that primes session/bootstrap caches without materializing a live `AgentSessionRuntime`.
- Kept explicit/priority warmup and deferred-branch realization on the full-runtime path so intentional warmup and branch restore semantics do not change.
- Added regression coverage for:
  - env-backed startup warmup parsing
  - capped main-session eviction behavior
  - lightweight recent prewarm not increasing cached-main-session counts
  - explicit warmup still materializing a live runtime
- Re-ran focused verification after the session-retention tranche:
  - `runtime/test/runtime/startup.test.ts`
  - `runtime/test/agent-pool/session-manager.test.ts`
  - `runtime/test/agent-pool/agent-pool.test.ts`
  - `bun run typecheck`
- Replaced the web-session viewer load path so session bootstrap now loads lightweight tool shims instead of the heavy route-serving viewer extensions:
  - `runtime/extensions/viewers/office-viewer-tool/index.ts`
  - `runtime/extensions/viewers/drawio-editor-tool/index.ts`
- Added lazy route registration at web startup so the actual viewer modules are imported only when `/office-viewer/*` or `/drawio/*` is first requested:
  - `runtime/src/channels/web/http/lazy-viewer-routes.ts`
  - `runtime/src/runtime/startup.ts`
- Updated the viewer session-gating regression to prove the old route-registration warnings no longer appear during session bootstrap while web chats still expose the viewer tools.
- Added lazy-route integration coverage for the on-demand viewer import path:
  - `runtime/test/channels/web/lazy-viewer-routes.test.ts`
- Re-ran focused verification after this tranche:
  - `runtime/test/agent-pool/session-bundled-extension-gating.test.ts`
  - `runtime/test/channels/web/lazy-viewer-routes.test.ts`
  - `runtime/test/channels/web/extension-routes.test.ts`
  - `runtime/test/workspace-index-process.test.ts`
  - `runtime/test/runtime/startup.test.ts`
  - `runtime/test/extensions/optional-bundled-extensions.test.ts`
  - `runtime/test/channels/web/tool-status-hints.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Fresh-process spot check from the workspace source tree against an archived `web:default` session file measured roughly **172 ms / 33.4 MB RSS delta** with background workspace indexing disabled for the harness.
- Installed the tranche with `make local-install`, restarted `piclaw.service` via `systemctl --user`, and verified the service came back cleanly.
- Recorded fresh post-restart memory evidence for the installed build:
  - startup snapshot: `.piclaw/data/startup-memory-snapshots/2026-04-17T22-03-03-224Z_post-web-start.json`
  - clean post-start sample: **218.3 MB RSS / 39.4 MB heap / 15.8 MB external / 0 active chats**
  - settled live sample: **217.7 MB RSS / 216.2 MB PSS / 44.8 MB heap / 14.0 MB external / 1 cached main / 1 active chat**
- Updated `docs/performance/memory-footprint-history.md` with the new live-service snapshot for commit `49fae082`.
- Re-ranked the remaining bundled cold-path cost and confirmed Azure is the next high-yield target.
  - source-tree spot check with Azure session extension enabled: **~192 ms / ~31.4 MB RSS delta / 41 tools**
  - same benchmark with Azure env effectively removed: **~151 ms / ~27.4 MB RSS delta / 41 tools**
  - inferred Azure session-path cost before refactor: roughly **~41 ms / ~4 MB RSS**
- Started the Azure cold-path tranche on `feature/optimize-azure-provider-cold-path`.
- Moved Azure provider registration/refresh responsibility to **process bootstrap** in:
  - `runtime/src/runtime/provider-bootstrap.ts`
  - `runtime/src/runtime/bootstrap.ts`
- Added a lightweight bundled session-path shim at:
  - `runtime/extensions/integrations/azure-openai-session/index.ts`
- Switched the bundled session path to that shim in:
  - `runtime/src/agent-pool/session.ts`
- Kept the heavy Azure extension compatible for direct-load/test use by routing its provider refresh through `session_start` / `session_shutdown`, while the production bundled session path now uses the shim.
- Added focused regression coverage for the new shim and async process bootstrap path:
  - `runtime/test/extensions/azure-openai-session.test.ts`
  - updated `runtime/test/runtime/provider-bootstrap.test.ts`
- Re-ran focused verification for the Azure tranche:
  - `runtime/test/runtime/provider-bootstrap.test.ts`
  - `runtime/test/extensions/session-shutdown-hooks.test.ts`
  - `runtime/test/extensions/azure-openai-routing.test.ts`
  - `runtime/test/extensions/azure-openai-retry-after.test.ts`
  - `runtime/test/extensions/azure-openai-session.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Fresh-process source-tree spot check after the Azure provider-bootstrap + session-shim split measured roughly **169 ms / 26.9 MB RSS delta / 41 active tools**.
- This is the first clearly material post-viewer/post-office/CDP improvement in the recent source-tree cold-session series; the next likely cleanup is to split Azure image generation helpers out of the provider implementation file so process-start import cost falls further without re-coupling those commands to ordinary chat sessions.
- Split Azure image generation out of the provider file into:
  - `runtime/extensions/integrations/azure-openai-images.ts`
- Updated the Azure session shim so `/image` and `/flux` now lazy-import the image module directly, while the provider shim path remains focused on context repair.
- Re-ran focused verification after the image split:
  - `runtime/test/extensions/azure-openai-image-output.test.ts`
  - `runtime/test/extensions/azure-openai-session.test.ts`
  - `runtime/test/runtime/provider-bootstrap.test.ts`
  - `runtime/test/extensions/session-shutdown-hooks.test.ts`
  - `runtime/test/extensions/azure-openai-routing.test.ts`
  - `runtime/test/extensions/azure-openai-retry-after.test.ts`
  - `bunx tsc --noEmit -p runtime/tsconfig.json`
- Fresh-process source-tree spot check after splitting the Azure image helpers out of the provider measured roughly **175 ms / 26.3 MB RSS delta / 41 active tools**.
- Interpretation: RSS improved a bit further while elapsed time stayed within the same noise band as the prior **169 ms / 26.9 MB** run, so this part of the Azure cleanup is best treated as a structural/provider-import optimization rather than a clear additional latency win.

## Notes

### Key evidence files and paths
- Startup policy: `runtime/src/runtime/startup.ts`
- Session bootstrap: `runtime/src/agent-pool/session.ts`
- Session manager: `runtime/src/agent-pool/session-manager.ts`
- Built-in extension registry: `runtime/src/extensions/index.ts`
- Workspace search extension: `runtime/src/extensions/workspace-search.ts`
- Workspace memory bootstrap: `runtime/src/extensions/workspace-memory-bootstrap.ts`
- SSH core extension: `runtime/src/extensions/ssh-core.ts`
- Azure OpenAI packaged extension: `runtime/extensions/integrations/azure-openai.ts`
- Context-mode packaged extension: `runtime/extensions/integrations/context-mode.ts`

### Disabled workspace extensions
- `.pi/disabled-extensions/github-copilot-opus-1m-safe-20260417T183413Z/index.ts`
- `.pi/disabled-extensions/gist-badlogic-edit-20260417T183413Z/index.ts`

## Links

- Parent RAM work: `workitems/50-done/runtime-ram-optimization-opportunities-2026-04-17.md`
- Memory footprint history: `docs/performance/memory-footprint-history.md`
- Regression planning reference: `workitems/regression-test-planning-reference.md`

---
id: timeline-launched-floating-generative-widget-pane
title: Prototype a timeline-launched floating generative widget pane
status: review
priority: medium
created: 2026-03-19
updated: 2026-04-11
target_release: next
estimate: M
risk: high
tags:
  - work-item
  - kanban
  - web
  - ui
  - timeline
  - floating-pane
  - generative-ui
owner: pi
---

# Prototype a timeline-launched floating generative widget pane

## Summary

Build a piclaw-native proof of concept for generative widgets that:

- are launched from a timeline message or card,
- open in a **floating pane / shell-owned overlay surface**,
- can be **dismissed by the user** without mutating timeline history,
- and can be reopened from the originating timeline item.

This should **not** be a direct port of `pi-generative-ui`'s macOS-native
Glimpse/WKWebView model.

For v1, the goal is to prove a safe and useful interaction model inside
piclaw's browser UI while preserving the current product contract:

- timeline history remains the source of truth,
- Adaptive Cards remain the preferred structured chat UI,
- and substantial visual widgets live in a bounded, explicitly opened surface.

## Acceptance Criteria

- [x] A timeline message or card can expose an explicit user action to open a generated widget.
- [x] Opening the widget shows a **floating pane / overlay** in the current web session.
- [x] The floating pane can be dismissed by the user without deleting or altering the originating timeline item.
- [x] The originating timeline item remains a stable reopen point after dismissal.
- [x] V1 renders a bounded widget artifact (SVG and/or sandboxed HTML) rather than raw unsandboxed live DOM execution in the main timeline.
- [x] Widget ownership/context is clear: the pane indicates which message/card launched it.
- [x] Reload/reconnect behavior is defined for v1 (pane is session-local and closes on reload/chat switch; the timeline launch affordance remains).
- [x] Security boundaries are explicit for v1 (sandboxing, allowed capabilities, script policy, asset loading policy).

## Implementation Paths

### Path A — shell-owned floating widget surface launched from timeline (recommended)
1. Introduce a timeline-native launch affordance, likely from a dedicated content block or Adaptive Card action.
2. Add a shell-owned floating pane / overlay component mounted from `web/src/app.ts`.
3. Render widget artifacts in a bounded host, preferably a sandboxed iframe or similarly isolated container.
4. Keep the originating message as the durable history anchor and reopen affordance.
5. Support explicit dismiss/close controls in the floating surface.

**Pros:**
- matches the user-facing product model
- keeps history as the durable source of truth
- avoids forcing a new general pane-placement abstraction in v1
- can reuse existing shell patterns for dismissible surfaces

**Cons:**
- introduces a new shell-owned surface type
- requires careful widget security boundaries

### Path B — generalize the pane system with a new `floating` placement
1. Extend `PanePlacement` beyond `tabs | dock`.
2. Teach `PaneRegistry` and host shell to mount and manage floating pane instances.
3. Route generated widgets through that generalized pane system.

**Pros:**
- cleaner long-term abstraction if more floating surfaces are expected
- reuses pane lifecycle ideas consistently

**Cons:**
- current pane model only supports `tabs` and `dock`
- much broader architectural change than needed for the first experiment
- risks delaying the actual widget PoC behind host-model work

## Recommended Path

Path A — start with a **shell-owned floating widget surface** launched from the timeline.

This satisfies the product intent quickly and safely:
- open from history,
- dismiss without losing the launch point,
- and keep the experiment bounded.

If the pattern proves useful, a later follow-up can decide whether it should be
promoted into a generalized `floating` pane placement.

## Phase 2 Plan — closer to the original `show_widget` runtime

If the goal is to stay as close as possible to the original `pi-generative-ui`
inspiration, the next slice should stop treating this feature as a static
artifact popup and instead implement a **tool-driven live widget runtime**.

### Target behavior

Match the original where practical:

1. the model/tool opens a widget in a separate surface,
2. the widget appears **during** generation rather than only after a final post,
3. the widget can execute bounded client-side code inside an isolated runtime,
4. the timeline still stores the durable receipt / reopen point,
5. and widget interaction back to piclaw happens through a narrow structured bridge.

Do **not** try to port the macOS-native Glimpse/WKWebView model literally.
Piclaw's equivalent should remain browser-native and history-first.

### Server/runtime work

#### 1. Add explicit widget stream SSE events

Extend `runtime/src/channels/web/agent-events.ts` to detect a first-class
widget tool flow (initially `show_widget`) from the underlying agent session
stream and emit dedicated chat-scoped SSE events instead of relying only on the
final persisted message.

Planned event family:

- `generated_widget_open`
- `generated_widget_delta`
- `generated_widget_final`
- `generated_widget_close`
- `generated_widget_error`

Each payload should include at minimum:

- `chat_jid`
- `turn_id`
- `tool_call_id`
- `widget_id`
- `title`
- `mode` (`replace` for v1)
- `html` and/or normalized artifact payload
- optional sizing / capability hints

#### 2. Allow delivery through the existing SSE hub

Add the new event names to the chat-scoped allowlist in:

- `runtime/src/channels/web/sse.ts`

This keeps delivery aligned with the current per-chat SSE model already used by
agent draft/thought/status updates.

#### 3. Persist a final durable receipt

Keep using a final stored timeline item as the canonical history anchor. The
live widget session is transient, but the final turn should persist a stable
`generated_widget` receipt that can reopen the finished widget later.

### Web client work

#### 4. Split live widget sessions from timeline widget receipts

Refactor the widget state in `runtime/web/src/app.ts` so the overlay can be
opened from two sources:

- **live session events** (`generated_widget_*` SSE)
- **stored timeline receipts** (`generated_widget` content blocks)

The current single `floatingWidget` state is enough for v1 display, but not for
an original-style live runtime. It should evolve into a richer session model
that tracks:

- source (`live` vs `timeline`)
- `turnId`
- `toolCallId`
- `widgetId`
- current HTML/document payload
- capabilities
- completion/finalization state

#### 5. Open on stream start, update on deltas

Handle the new SSE events in `runtime/web/src/app.ts`:

- `generated_widget_open` → show the floating pane immediately
- `generated_widget_delta` → update the current widget document
- `generated_widget_final` → mark the widget stable/final and keep it reopenable
- `generated_widget_close` → close only if the current live session still matches

This is the main fidelity step toward the original experience.

#### 6. Upgrade the pane from static artifact host to live sandbox host

Refactor:

- `runtime/web/src/components/floating-widget-pane.ts`
- `runtime/web/src/ui/generated-widget.ts`

So the iframe host can support:

- repeated document replacement for streamed updates (`replace` mode first)
- bounded script execution inside the iframe sandbox
- host ↔ iframe `postMessage` bridge
- explicit empty / loading / error states

### Widget runtime / security model

#### 7. Allow scripts only inside the sandboxed iframe

To get meaningfully closer to the original, `html` widgets cannot remain purely
static forever. The host should allow client-side code only inside the widget
iframe, not in the main timeline DOM.

Initial policy target:

- iframe sandbox: `allow-scripts allow-downloads`
- **not** `allow-same-origin`
- no top navigation
- no popups by default
- no ambient host DOM access
- network disabled by default via CSP unless a later capability explicitly opts in

#### 8. Introduce a minimal bridge instead of arbitrary host reach-through

The widget runtime should use a strict `postMessage` contract rather than ad hoc
DOM coupling.

Initial widget → host actions:

- `widget.ready`
- `widget.resize`
- `widget.submit`
- `widget.close`
- `widget.request_refresh`

Initial host → widget messages:

- `widget.init`
- `widget.update`
- `widget.complete`
- `widget.error`

All messages should be validated against the active `widgetId`, `toolCallId`,
and chat-local session before any action is applied.

### Suggested implementation order

#### Milestone A — live open/update loop

- add SSE event types in `agent-events.ts` + `sse.ts`
- open/update the pane from SSE in `app.ts`
- keep `replace`-whole-document semantics for now
- keep timeline receipt rendering unchanged

#### Milestone B — executable widget runtime

- enable sandboxed scripts in the iframe host
- add loading/final/error chrome
- support repeated live updates without timeline mutation

#### Milestone C — structured widget bridge

- add validated `postMessage` bridge
- support `submit` and `close`
- feed structured submissions back into the existing agent/web flow

#### Milestone D — durability and reconnect behavior

- preserve stable reopen from the final timeline receipt
- define reconnect/reload behavior for in-flight widgets
- ensure chat switching still clears the session-local live pane correctly

### Test additions

Beyond the current helper tests in `runtime/test/web/generated-widget.test.ts`,
add focused coverage for:

- live `open → delta → final` session flow
- dismiss → reopen from timeline receipt
- current-chat scoping for live widget events
- widget bridge message validation
- narrow/mobile pane layout
- reconnect/reload behavior for an in-flight widget session

## Test Plan

- [x] Add focused web tests for launch affordance visibility and click behavior. *(helper-level payload tests added in `runtime/test/web/generated-widget.test.ts`)*
- [x] Add focused web tests for open → dismiss → reopen behavior. *(covered in `runtime/test/web/app-floating-widget.test.ts`)*
- [x] Validate that dismissing the floating pane does not mutate or remove the originating timeline entry. *(covered in `runtime/test/web/app-floating-widget.test.ts` with payload immutability checks)*
- [x] Validate current-chat scoping so a widget launched in one chat/session does not bleed into another. *(covered in `runtime/test/web/app-sse-event-routing.test.ts` for `generated_widget_open` routing)*
- [x] Validate safe fallback behavior when the widget artifact fails to load or is rejected by policy. *(helper-level tests cover unsupported/incomplete artifacts and empty-state srcdoc generation)*
- [x] Validate mobile/narrow-layout behavior for the floating surface. *(responsive breakpoint + stylesheet contract in `runtime/test/web/floating-widget-styles.test.ts`)*
- [x] Run `bun run build:web` from `/workspace/piclaw` if implementation proceeds.
- [x] Run `bun run quality` from `/workspace/piclaw` if implementation proceeds.

## Definition of Done

- [x] Timeline launch affordance exists for the chosen v1 widget artifact.
- [x] Floating pane / overlay opens in the current web session.
- [x] User can dismiss and reopen the widget cleanly.
- [x] Security boundary for widget rendering is documented and enforced for v1.
- [x] Regression coverage exists for launch/dismiss/reopen behavior.
- [x] Any deferred scope (e.g. generalized pane placement, richer callbacks, live streaming widgets) is split into follow-up tickets.
- [x] Update history records implementation and validation evidence.

## Updates

### 2026-04-11
- Added the remaining closeout validation coverage needed to move the v1 floating-widget slice forward:
  - `runtime/test/web/app-floating-widget.test.ts` now covers dismiss → reopen behavior and verifies that closing the pane does not mutate the original timeline payload.
  - `runtime/test/web/app-sse-event-routing.test.ts` now explicitly covers `generated_widget_open` current-chat routing so widget launches stay scoped to the active chat/session.
  - `runtime/web/static/css/overlays.css` now includes a narrow-layout breakpoint for the floating widget shell, with a stylesheet contract test in `runtime/test/web/floating-widget-styles.test.ts`.
- Deferred broader runtime evolution into `workitems/00-inbox/advance-floating-widget-runtime-beyond-v1.md` so this v1 shell ticket can close on its shipped scope.
- Validation evidence: `bun test runtime/test/web/generated-widget.test.ts runtime/test/web/app-floating-widget.test.ts runtime/test/web/app-sse-event-routing.test.ts runtime/test/web/floating-widget-styles.test.ts` ✅; `bun run quality` ✅; `bun run build:web` ✅.
- Recommended lane change: `20-doing` → `40-review`.


### 2026-03-28
- Lane retained: `20-doing` via web doing-card decision.
- Doing-lane outcome recorded from the adaptive-card submission: **Keep in Doing**.
- Interaction regression coverage plus current-chat and narrow/mobile validation remains active work.

### 2026-03-28
- Lane change: `40-review` → `20-doing` via web review-card decision.
- Review outcome recorded from the adaptive-card submission: **Move to Doing**.
- Reason captured in review: interaction regression coverage plus current-chat and narrow/mobile validation are still explicitly missing.

### 2026-03-27
- Lane change: `20-doing` → `40-review`.
- Repo-status audit confirmed the v1 floating-widget implementation is present across the shipped runtime/web path:
  - SSE event allowlist in `runtime/src/channels/web/sse.ts`
  - generated-widget event broadcast wiring in `runtime/src/channels/web/agent-events.ts`
  - live widget session handling in `runtime/web/src/app.ts`
  - floating overlay host in `runtime/web/src/components/floating-widget-pane.ts`
  - timeline `generated_widget` receipt rendering in `runtime/web/src/components/post.ts` and `runtime/web/src/ui/generated-widget.ts`
- The ticket remains in `review` rather than `done` because the remaining gap is validation, not implementation: dismiss/reopen interaction coverage, current-chat scoping verification, narrow/mobile validation, and a final review pass on any deferred phase-2/runtime follow-up split.
- Quality: ★★★★☆ 8/10 (problem: 2, scope: 2, test: 1, deps: 2, risk: 1)

### 2026-03-22
- Continued the Phase 2/runtime slice rather than treating the pane as a static receipt only.
- Landed the interactive widget bridge across the web channel/runtime path: live HTML widgets and timeline widgets with `capabilities: ["interactive"]` now get bounded script execution plus `window.piclawWidget.ready(...)`, `submit(...)`, `close(...)`, and `requestRefresh(...)`.
- Hardened widget host delivery in `runtime/web/src/components/floating-widget-pane.ts` and `runtime/web/src/ui/generated-widget.ts` so host init/state updates keep pushing once the iframe exists, and isolated the `window.name` fallback so cross-origin `name` assignment failures no longer block `postMessage`.
- Repaired the source-backed dashboard host path and reduced flicker by preventing repeated `widget.init` clears, coalescing updates with `requestAnimationFrame`, deduping dashboard payloads, and avoiding full stage rebuilds on metadata-only updates.
- Added a server-side helper at `runtime/src/channels/web/dashboard-widget.ts` plus `WebChannel.postDashboardWidget(...)` wiring in `runtime/src/channels/web.ts` / `runtime/src/channels/web/web-channel-contracts.ts`.
- Confirmed the installed `@earendil-works/pi-coding-agent` extension runner still exposes a fixed `ExtensionCommandContextActions` surface, so extra custom command-context actions do not propagate cleanly through `bindExtensions(...)` yet.
- Prototyped a temporary `/dashboard` caller only to validate the helper path, then removed it after explicit user feedback that no user-facing command was wanted.
- Replaced that shim with an internal built-in tool path: `runtime/src/extensions/send-dashboard-widget.ts` now posts the staged dashboard widget through the existing broadcast-aware message-posting flow, so the helper remains available without adding a chat command.
- Added/updated focused coverage in `runtime/test/channels/web/dashboard-widget.test.ts`, `runtime/test/web/generated-widget.test.ts`, `runtime/test/channels/web/agent-message-handler.test.ts`, and `runtime/test/extensions/send-dashboard-widget.test.ts`.
- Validation evidence: `bun test runtime/test/agent-control/parser.test.ts runtime/test/agent-control/agent-control.test.ts runtime/test/agent-control/agent-control-handlers.test.ts runtime/test/channels/web/agent-message-handler.test.ts runtime/test/channels/web/dashboard-widget.test.ts runtime/test/extensions/send-dashboard-widget.test.ts` ✅; `bun run build:web` ✅; `bun run build` ✅; `bun run check:hook-tdz` ✅.
- Resume point: the helper/action layer is now in place and reachable through the internal tool path, but the real remaining work is typed bidirectional widget state sync, durable reload/resume behavior, current-chat scoping audits, narrow/mobile validation, and a final `bun run quality` before moving this ticket toward review.
- Quality: ★★★★☆ 8/10 (problem: 2, scope: 2, test: 2, deps: 1, risk: 1)

### 2026-03-21
- Moved to `20-doing`.
- Began implementation on the recommended Path A shape: a shell-owned floating overlay launched from a timeline content block.
- Implemented a first v1 path using a new `generated_widget` content block rendered as a launch card in the timeline, opening a dismissible floating pane in the current web session.
- Added the shell-owned overlay component at `runtime/web/src/components/floating-widget-pane.ts` and threaded open/close state through `runtime/web/src/app.ts`.
- Added timeline launch-card rendering in `runtime/web/src/components/post.ts` and `runtime/web/src/components/timeline.ts`.
- Added styling in `runtime/web/static/css/styles.css`.
- The floating pane is intentionally session-local for v1 and closes on reload/chat switch; the originating timeline item remains the reopen point.
- Artifact scope remains intentionally narrow: sandboxed `html` and `svg` only, rendered inside a sandboxed iframe (`srcdoc`) rather than the main timeline DOM.
- The iframe host injects a restrictive CSP and disables script execution; current sandbox allowance is limited to `allow-downloads`.
- `bun run build:web` passed with the current implementation.
- Extracted widget payload/srcdoc logic into `runtime/web/src/ui/generated-widget.ts` so it can be tested directly.
- Added focused tests in `runtime/test/web/generated-widget.test.ts` covering supported payload generation, unsupported/incomplete artifact rejection, and sandboxed `srcdoc` generation.

### 2026-03-19
- Created as the follow-up to `pi-generative-ui-integration-evaluation` after ruling out direct timeline integration.
- Refined with explicit user direction: make the experiment a **floating pane** that can be dismissed from the timeline flow.
- Chosen v1 framing is a **shell-owned floating surface launched from history**, not a direct port of the macOS-native Glimpse model.
- Noted important architectural constraint: the current pane contract in `web/src/panes/pane-types.ts` only supports `tabs` and `dock`, so a generalized floating-pane placement would be a broader follow-up rather than the first slice.
- Quality: ★★★☆☆ 6/10 (problem: 2, scope: 1, test: 1, deps: 1, risk: 1)

## Notes

- Reuse existing shell patterns where possible:
  - dismissible floating/overlay chrome similar in spirit to `web/src/components/btw-panel.ts`
  - close affordances similar to `web/src/components/image-modal.ts`
- Keep v1 artifact support intentionally narrow:
  - SVG
  - sandboxed HTML
  - no unrestricted arbitrary third-party script execution in the main DOM
- The timeline item should remain the canonical receipt / launch point even when the floating pane is closed.
- Adaptive Cards are still the preferred path for compact structured in-chat decisions; this ticket is specifically for richer visual widgets that benefit from a separate transient surface.
- Consider YAML as an alternative streaming payload format for live widget updates if it simplifies stanza framing/parsing compared to the current ad hoc HTML/JSON-oriented flow.

## Links

- `workitems/50-done/pi-generative-ui-integration-evaluation.md`
- `runtime/web/src/app.ts`
- `runtime/src/channels/web.ts`
- `runtime/src/channels/web/web-channel-contracts.ts`
- `runtime/src/channels/web/dashboard-widget.ts`
- `runtime/test/channels/web/dashboard-widget.test.ts`
- `runtime/src/extensions/send-dashboard-widget.ts`
- `runtime/test/extensions/send-dashboard-widget.test.ts`
- `runtime/web/src/components/post.ts`
- `runtime/web/static/css/overlays.css`
- `runtime/test/web/app-floating-widget.test.ts`
- `runtime/test/web/app-sse-event-routing.test.ts`
- `runtime/test/web/floating-widget-styles.test.ts`
- `workitems/00-inbox/advance-floating-widget-runtime-beyond-v1.md`
- `runtime/web/src/components/timeline.ts`
- `runtime/web/src/components/floating-widget-pane.ts`
- `runtime/web/src/ui/generated-widget.ts`
- `runtime/test/web/generated-widget.test.ts`
- `runtime/web/src/components/btw-panel.ts`
- `runtime/web/src/components/image-modal.ts`
- `runtime/web/static/css/styles.css`
- `runtime/web/src/panes/pane-types.ts`
- `runtime/web/src/panes/pane-registry.ts`
- `docs/extension-ui-contract.md`
- `docs/web-pane-extensions.md`

## Completion Evidence (2026-04-11)

### What shipped
- `send_dashboard_widget` tool: agent posts any HTML as interactive widget (no hardcoded default)
- `createGeneratedWidgetBlock()` factory for custom widget content blocks
- System prompt includes piclawWidget bridge docs + vendored Three.js import map
- Widget iframe sandbox: `allow-downloads allow-scripts allow-same-origin`
- Widget CSP: `script-src 'unsafe-inline' 'self'` (enables vendored lib loading)
- Vendored Three.js r170 + OrbitControls at `/static/js/vendor/three/`
- `send_adaptive_card` chat targeting fix (fail closed, no `web:default` fallback)
- Full test coverage: 1855 pass, 0 fail

### Verified live
- System Pulse widget: simulated metrics, submit() → chat, close() works
- Raw WebGL widget: 8 meshes, orbit controls, snapshot pipeline
- Three.js Crystal Garden: MeshPhysicalMaterial, OrbitControls, r170 confirmed
- 3D Source Code Map: 278 files, 15 modules, hover tooltips, summary submit

### Vendored libraries (2026-04-11)
- Babylon.js 7.x (7.7 MB) — 3D, PBR, STL viewer
- ECharts 5.6 (1010 KB) — treemap, bar, line, pie, heatmap, etc.
- D3 7.9 (274 KB) — low-level SVG/Canvas data viz
- Three.js removed (superseded by Babylon.js)

# Atomic Editor live-preview port notes

## Decision summary

Piclaw keeps its source-preserving Markdown live-preview engine as the integration shell and ports Atomic Editor hardening at the logical-extension level. The React wrapper is not adopted.

## Table policy

Piclaw table preview remains source-preserving for this phase.

Atomic's WYSIWYG table widget is stronger for direct table editing, but it serializes the table back to normalized Markdown. That changes source formatting, alignment delimiters, spacing, and escaped pipe handling as a side effect of cell edits. Piclaw's current table preview keeps raw Markdown as the user's primary editing surface, so a wholesale WYSIWYG table replacement is deferred until we explicitly accept normalized table serialization.

Borrowed now:

- Treat a table as an atomic unit at the destructive Backspace boundary so the next paragraph is not merged into the table source accidentally.
- Keep the parity fixture's escaped-pipe and alignment cases as future browser-test anchors.
- Re-evaluated Atomic's WYSIWYG table widget during the speed-audit follow-up; no additional contenteditable/context-menu/table-serialization pieces were ported because they would still normalize or rewrite source Markdown.

Deferred until serialization policy is accepted:

- contenteditable table cells
- IME/dead-key cell composition management
- paste flattening inside cells
- context menu row/column mutation
- per-cell caret preservation after DOM rebuilds

## Ported hardening and ergonomics

- Safe same-line splitting for plugin-sourced `Decoration.replace()` ranges.
- Immediate mapped-decoration normalization on `docChanged`, followed by the debounced full rebuild, so typed edits cannot leave stale replacement ranges that cross newly inserted line breaks.
- Pointer/mouse freeze guard for selection-driven reveal jitter.
- Parser-progress rebuild signal for partial Lezer trees within Piclaw's live-preview size policy.
- Atomic-style image block `StateField` with natural-dimension cache and Piclaw link safety.
- Whole-document decoration coverage for documents that are allowed to use live preview, while avoiding rebuilds on pure viewport changes and on offscreen selection moves.
- Heading typography moved to stable line decorations to reduce active/inactive layout shifts.
- Atomic-style typing ergonomics excluding wiki links:
  - emphasis-pair extension (`*|*` + `*` => `**|**`, same for underscores)
  - code-fence auto-close
  - tight bullet/task-list Enter continuation
  - mid-typing emphasis styling supplement for the active line while parser state catches up

## Search/reveal API

Piclaw now ports Atomic's non-wiki search/reveal API shape at the editor-extension level:

- `openSearch(query?)` opens the existing CM6 search panel, optionally pre-filled.
- `closeSearch()` closes it.
- `isSearchOpen()` reports panel state.
- `revealText(query)` finds the first matching source range using Atomic's progressive fallback strategy (exact text, whitespace-collapsed text, individual lines, and truncated prefixes), scrolls the match near the top, paints a transient `.cm-initialRevealMatch` highlight, and does not move the editor selection.

Wiki links remain intentionally unported.

## Recommendation gate

Keep Piclaw's editor engine and shell, with Atomic hardening borrowed as local CM6 extensions. Do not adopt Atomic's React wrapper or depend on `@atomic-editor/editor` directly unless Piclaw's vendor/import model changes.

Rollback path:

1. Remove `imageBlocks()` from `markdown/index.ts` and restore `ImageWidget` replacement in `link.ts` if image block behavior regresses.
2. Remove `livePreviewPointerFreeze` / `livePreviewFrozenField` from `markdown/index.ts` if pointer capture interferes with editor selection.
3. Keep `pushSafeReplace()` unless it is directly implicated; it only narrows illegal multi-line replacement ranges.
4. Rebuild `build:vendor:codemirror` after any vendor export rollback.

## Validation anchors

- `runtime/test/web/markdown-live-preview-gating.test.ts`
- `runtime/test/web/markdown-live-preview-parity.test.ts`
- `runtime/test/fixtures/markdown-live-preview-parity/atomic-port-parity.md`
- `runtime/scripts/playwright/markdown-live-preview-parity.ts`

Named browser parity command:

```bash
bun run test:e2e:markdown-live-preview
```

Named speed-audit command:

```bash
bun run test:e2e:markdown-editor-speed
```

Useful environment overrides:

```bash
BASELINE_REF=HEAD^ SPEED_AUDIT_RUNS=3 SPEED_AUDIT_WARMUPS=1 SPEED_AUDIT_REPORT=/workspace/tmp/piclaw-editor-speed-audit.json bun run test:e2e:markdown-editor-speed
```

The parity and speed harnesses build temporary browser bundles from source and check desktop, tablet, and mobile viewports without rebuilding checked-in web dist assets or restarting Piclaw.

Latest speed-audit notes:

- Pre-port / committed-baseline typing is skipped in the audit because that path can still hit the stale replacement-range `RangeError` found during the audit; current working tree typing is measured instead.
- Current working tree preserves source before and after the audit scenarios across all tested viewports.
- On a rich ~56 KB Markdown fixture after the doc-change normalization fast path, current typing p95 per character was approximately 2.8–3.0 ms across desktop/tablet/mobile in the speed harness.
- Cursor medians stayed near or faster than the pre-port baseline after the offscreen-selection rebuild guard.
- Scroll medians stayed within small absolute deltas; table-boundary Backspace remains a small absolute-cost increase because it intentionally selects the table atomically before deletion.
- A first normalized/WYSIWYG table-editor slice now exists: rendered contenteditable cells serialize back to normalized Markdown, Tab navigates cells, Tab past the final cell appends a row, toolbar buttons add/remove rows and columns, pasted newlines are flattened, literal pipes are escaped as `\\|`, and alignment buttons update delimiter serialization.
- Browser coverage now exercises search/reveal API behavior, cell edit serialization, Tab and Shift-Tab focus movement, Tab-past-end row append, paste-in-middle flattening with caret preservation, pipe escaping with caret preservation, composition deferral through `compositionend`, alignment changes, row/column add/delete, context-menu row insertion, and focus restoration after mutations across desktop/tablet/mobile.
- Speed-audit coverage now includes editable table typing and row/column mutation timings in addition to table-boundary behavior.
- Full Atomic parity still has follow-up room for manual mobile IME testing and richer Markdown rendering inside table cells, which Atomic also treated as limited/scope-cut behavior in the inspected version.

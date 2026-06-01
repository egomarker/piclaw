# Atomic Editor live-preview port notes

## Decision summary

Piclaw keeps its source-preserving Markdown live-preview engine as the integration shell and ports Atomic Editor hardening at the logical-extension level. The React wrapper is not adopted.

## Table policy

Piclaw table preview remains source-preserving for this phase.

Atomic's WYSIWYG table widget is stronger for direct table editing, but it serializes the table back to normalized Markdown. That changes source formatting, alignment delimiters, spacing, and escaped pipe handling as a side effect of cell edits. Piclaw's current table preview keeps raw Markdown as the user's primary editing surface, so a wholesale WYSIWYG table replacement is deferred until we explicitly accept normalized table serialization.

Borrowed now:

- Treat a table as an atomic unit at the destructive Backspace boundary so the next paragraph is not merged into the table source accidentally.
- Keep the parity fixture's escaped-pipe and alignment cases as future browser-test anchors.

Deferred until serialization policy is accepted:

- contenteditable table cells
- IME/dead-key cell composition management
- paste flattening inside cells
- context menu row/column mutation
- per-cell caret preservation after DOM rebuilds

## Ported Phase 1 hardening

- Safe same-line splitting for plugin-sourced `Decoration.replace()` ranges.
- Pointer/mouse freeze guard for selection-driven reveal jitter.
- Parser-progress rebuild signal for partial Lezer trees within Piclaw's live-preview size policy.
- Atomic-style image block `StateField` with natural-dimension cache and Piclaw link safety.
- Heading typography moved to stable line decorations to reduce active/inactive layout shifts.

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

This builds a temporary browser harness from source and checks desktop, tablet, and mobile viewports without rebuilding checked-in web dist assets or restarting Piclaw.

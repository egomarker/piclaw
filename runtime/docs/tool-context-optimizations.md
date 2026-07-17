# Tool Context Optimizations

PiClaw compacts eligible tool results before they reach provider requests. Full outputs remain searchable.

## Goals

- Minimize large inline `tool_result` payloads in model context.
- Preserve full-fidelity output on disk, with retrieval metadata in SQLite.
- Keep `search_tool_output` as the standard retrieval path.
- Prune old stored outputs automatically.

## Current implementation

PiClaw applies threshold-based compaction for **eligible** `tool_result` events in `runtime/extensions/integrations/context-mode.ts`.

When eligible output crosses configured thresholds, PiClaw:

1. Reads full output text (prefers `details.fullOutputPath` when present).
2. Persists full output via core `saveToolOutput()`.
3. Returns compact replacement text with:
   - `tool-output:<id>` handle
   - line/byte counts
   - semantic summary (when enabled and available) or preview fallback
   - retrieval hint for `search_tool_output`
4. Attaches metadata in `details`:
   - `storedOutputId`
   - `storedOutputPath`
   - `storedOutputLines`
   - `storedOutputBytes`
   - `storedOutputSource`

Small outputs remain inline.

## Optional request-time compaction for legacy history

In addition to live `tool_result` interception, `context-mode` now applies an optional request-time pass on outbound provider context:

- scans legacy inline tool-result messages in `context` events
- compacts oversized eligible tool-result text blocks on-the-fly
- stores full output via `saveToolOutput()` and replaces only outbound context payload text
- leaves persisted session history untouched (fail-open if storage fails)

This layer shrinks provider payloads for older sessions that still contain oversized inline tool-result history.

## Eligibility + idempotency rules

Compaction is skipped when:

- `event.isError` is true.
- tool name is not in the compaction allowlist (`compaction.toolResultCompactionTools`, default: `bash`, `powershell`, `exec_batch`).
- existing stored-output metadata is already present (camel/snake/add-on-style keys).
- payload includes image/binary-heavy blocks.
- payload already includes stored-handle marker text (e.g. `tool-output:<id>`).
- output is below threshold.

If persistence fails, behavior is **fail-open** (original inline output is preserved).
If semantic summarization fails/times out, behavior falls back to preview-based compaction.

## Search and retrieval

`search_tool_output` performs FTS lookup over persisted chunks:

```text
search_tool_output
- handle: out_...
- query: <terms>
- limit: 5 (optional)
```

This returns compact snippets and keeps large logs out of model context.

## Storage and data model

- Log files: `DATA_DIR/tool-output/<id>.log`
- Metadata table: `tool_outputs`
- FTS table: `tool_outputs_fts` (FTS5)

Schema lives in:

- `runtime/src/db/connection.ts`
- `runtime/src/db/tool-outputs.ts`
- `runtime/src/tool-output.ts`

## Cleanup and retention

Cleanup starts at runtime startup (`runtime/src/runtime/startup.ts`) via `startToolOutputCleanup(...)`.

Defaults:

- retention: **4 hours** (`14400000` ms)
- cleanup interval: **15 minutes** (`900000` ms)

Configuration:

- `PICLAW_TOOL_OUTPUT_RETENTION_MS`
- `PICLAW_TOOL_OUTPUT_RETENTION_DAYS` (legacy fallback)
- `PICLAW_TOOL_OUTPUT_CLEANUP_INTERVAL_MS`

## Threshold and preview knobs

Storage threshold (either condition triggers compaction):

- `PICLAW_TOOL_OUTPUT_STORE_BYTES` (default `4096`)
- `PICLAW_TOOL_OUTPUT_STORE_LINES` (default `40`)
- `PICLAW_TOOL_OUTPUT_STORE_THRESHOLDS_BY_TOOL` (optional JSON map override), e.g.
  - `{"proxmox":{"bytes":16384,"lines":200},"portainer":{"bytes":8192}}`

Tool eligibility allowlist:

- `PICLAW_TOOL_RESULT_COMPACTION_TOOLS` (comma-separated or JSON array)
  - default: `bash,powershell,exec_batch`
  - examples:
    - `bash,powershell,exec_batch,proxmox`
    - `["bash","exec_batch","proxmox"]`

Preview formatting:

- `PICLAW_TOOL_OUTPUT_PREVIEW_LINES` (default `8`)
- `PICLAW_TOOL_OUTPUT_PREVIEW_LINE_CHARS` (default `200`)

Semantic summary controls:

- `PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED` (default `true`)
- `PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_MAX_INPUT_CHARS` (default `12000`)
- `PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_MAX_TOKENS` (default `320`)
- `PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_TIMEOUT_MS` (default `12000`)

## Settings controls

Tool-result compaction is gated in **Settings → Compaction**. Tool eligibility is controlled in **Settings → Tools**:

- **Enable tool-result compaction** checkbox (persisted through `/agent/settings/compaction`)
- **Compact** column checkboxes per tool in Settings → Tools (persisted through `/agent/settings/compaction` as `toolResultCompactionTools`)

Persisted/runtime keys:

- `compaction.toolResultCompactionEnabled` in `.piclaw/config.json`
- `compaction.toolResultCompactionTools` in `.piclaw/config.json`
- `compaction.toolResultSemanticSummaryEnabled` in `.piclaw/config.json`
- `compaction.toolResultSemanticSummaryMaxInputChars` in `.piclaw/config.json`
- `compaction.toolResultSemanticSummaryMaxTokens` in `.piclaw/config.json`
- `compaction.toolResultSemanticSummaryTimeoutMs` in `.piclaw/config.json`
- `PICLAW_TOOL_RESULT_COMPACTION_ENABLED` env override (`1/0`, `true/false`, etc.)
- `PICLAW_TOOL_RESULT_COMPACTION_TOOLS` env override
- `PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_ENABLED` env override
- `PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_MAX_INPUT_CHARS` env override
- `PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_MAX_TOKENS` env override
- `PICLAW_TOOL_RESULT_SEMANTIC_SUMMARY_TIMEOUT_MS` env override

When disabled, `context-mode` skips compaction and leaves tool results inline.

## Legacy cleanup utility

For historical sessions with oversized inline `toolResult` entries, run:

```bash
bun scripts/migrate-legacy-inline-tool-results.ts --dry-run --max-files 20
```

Then apply changes:

```bash
bun scripts/migrate-legacy-inline-tool-results.ts --write --max-files 20
```

Useful flags:

- `--sessions-dir <path>` (default `/workspace/.piclaw/data/sessions`)
- `--chat <chatDirName>` (limit to one chat directory)
- `--store-bytes <n>` / `--store-lines <n>`
- `--thresholds-by-tool '<json>'`
- `--verbose`

## Operator notes

- If inline tool payloads look too large, lower store thresholds.
- If summaries are too terse/noisy, tune preview lines/chars.
- If `search_tool_output` misses expected text, confirm handle and retention window.
- Add-ons that already emit stored-output handles are intentionally not re-compacted.
- Stored-output dedupe reuses persisted output identity, but semantic summary text is recomputed per event to avoid stale preview/semantic fallback carry-over.

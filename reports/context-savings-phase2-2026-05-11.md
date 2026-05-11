# Context savings activity (phase 2)

Generated: 2026-05-11

## Scope

- Runtime: settings-gated tool-result compaction + provider-request-time compaction layer
- Migration utility: `scripts/migrate-legacy-inline-tool-results.ts`
- Dry-run targets:
  - Global sessions root
  - `web_default-14`

## Re-baseline (post-gate + request-time layer)

The post-MVP architecture is now in place and active:

- Settings gate exists and defaults to enabled unless explicitly disabled.
- Provider-request-time compaction pass compacts oversized legacy inline tool-result payloads in outbound context without rewriting history.
- Optional migration path is available to rewrite persisted history for long-term debt reduction.

### Baseline comparison with previous sampled impact report

| Source | Before | After | Reduction |
|---|---:|---:|---:|
| Prior sampled impact report (`tool-result-compaction-impact-2026-05-11.md`) | 70.4 MB | 4.9 MB | 93.0% |
| Current global dry-run debt estimate (all sessions) | 81.0 MB | 5.0 MB | 93.9% |

## Remaining historical inline tool-result debt (dry-run)

### Global (`/workspace/.piclaw/data/sessions`)

Command:

```bash
bun ./scripts/migrate-legacy-inline-tool-results.ts --dry-run
```

Results:

- Scanned files: 144
- Scanned lines: 92,166
- Parse errors: 27
- Candidate entries: 9,090
- Changed files: 45
- Estimated bytes before: 81.0 MB
- Estimated bytes after: 5.0 MB
- Estimated reduction: 76.1 MB (93.9%)

### Chat-specific (`web_default-14`)

Command:

```bash
bun ./scripts/migrate-legacy-inline-tool-results.ts --dry-run --chat web_default-14
```

Results:

- Scanned files: 1
- Scanned lines: 3,434
- Parse errors: 0
- Candidate entries: 452
- Changed files: 1
- Estimated bytes before: 3.8 MB
- Estimated bytes after: 248.9 KB
- Estimated reduction: 3.5 MB (93.6%)

## Immediate wins

1. Request-time compaction already cuts provider payload pressure for legacy inline tool-result messages without touching session files.
2. Settings gate allows immediate rollback/disable if needed.
3. Migration script gives deterministic dry-run sizing before any write-mode operation.

## Recommended threshold defaults

Current defaults remain appropriate and should stay as the baseline:

- `PICLAW_TOOL_OUTPUT_STORE_BYTES=4096`
- `PICLAW_TOOL_OUTPUT_STORE_LINES=40`
- `compaction.thresholdPercent=80` (pre-prompt context compaction trigger)

Per-tool overrides should remain optional and only be applied when a specific tool family proves too noisy or too conservative.

## Write-mode migration decision (follow-up confirmation)

Recommendation:

- Do **not** run global write-mode blindly.
- If/when approved, run batched write-mode migrations in this order:
  1. `web_default-14`
  2. `web_default`
  3. high-debt branch chats from the existing impact report

Suggested guarded invocation pattern:

```bash
bun ./scripts/migrate-legacy-inline-tool-results.ts --write --chat web_default-14
```

then validate behavior/searchability, and only then continue with additional chats.

# Tool-result compaction impact summary (sampled sessions)

Generated: 2026-05-11T05:43:43.982Z

## Scope

- Sessions root: `/workspace/.piclaw/data/sessions`
- JSONL files scanned: **168**
- Tool-result entries observed: **44,805**
- Entries already compacted/stored: **7,186** (16.0%)
- Large eligible entries for universal compaction: **8,645** (19.3%)

## Estimated payload reduction (eligible large entries)

- Before (inline text payload): **70.4 MB**
- After (estimated summary+handle payload): **4.9 MB**
- Estimated reduction: **65.5 MB** (93.0%)

## Top sampled chats by reducible payload

| Chat | Tool results | Eligible large | Before | After | Reducible | Reduction % |
|---|---:|---:|---:|---:|---:|---:|
| `web_default_branch_4165db5c5a0f` | 5041 | 1553 | 15.6 MB | 918.0 KB | 14.7 MB | 94.3% |
| `web_chat_94b5b0fe-d4d6-4e37-b6fe-a73f0d8362ec` | 6528 | 1536 | 14.4 MB | 939.4 KB | 13.4 MB | 93.6% |
| `web_default` | 7833 | 1893 | 12.0 MB | 1.0 MB | 10.9 MB | 91.3% |
| `web_default_branch_06b8a8ac3e0a` | 3335 | 624 | 5.5 MB | 384.7 KB | 5.1 MB | 93.1% |
| `web_foobar` | 3950 | 778 | 5.0 MB | 404.3 KB | 4.6 MB | 92.1% |
| `web_addons` | 2882 | 585 | 4.9 MB | 334.5 KB | 4.5 MB | 93.3% |
| `web_default-14` | 1697 | 380 | 3.1 MB | 221.4 KB | 2.9 MB | 93.1% |
| `web_default_branch_9da8460c3677` | 4763 | 416 | 3.1 MB | 234.5 KB | 2.9 MB | 92.6% |

## Rollout status

- Runtime behavior is now **settings-gated**.
- Settings path: **Settings → Compaction → Enable tool-result compaction**.
- API persistence: `POST /agent/settings/compaction` with `toolResultCompactionEnabled`.
- Persisted key: `compaction.toolResultCompactionEnabled` (`.piclaw/config.json`).

## Method notes

- Uses current MVP eligibility rules from `runtime/extensions/integrations/context-mode.ts`.
- Uses current defaults: bytes>4096 OR lines>40, preview 8x200 chars.
- Excludes tool results already compacted/stored (marker text/details) from re-compaction estimates.
- Estimates *provider payload* effect by comparing inline text bytes before/after compaction template replacement.

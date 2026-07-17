---
name: close-of-day
description: Run a daily end-of-day sweep: refresh situation notes, back up state, clean low-value timeline traffic, and run the daily-notes summarisation flow before declaring the day closed.
distribution: private
---

# Close of Day

Run this skill once per day to:

1. generate a situation report
2. back up state before cleanup, if needed
3. clean low-value timeline traffic
4. update daily notes in the same task

## Workflow

This skill runs:

- `/workspace/scripts/situate.ts` with `--update-notes`
- optional restic backup (`/workspace/.piclaw/restic/backup.sh`) before cleanup
- timeline cleanup groups covering reloads, compaction, greetings, slash-command chatter, command responses, one-word acknowledgements, transitions, version/build/git noise, and similar low-value traffic
- the `situate-daily-notes` workflow immediately afterwards for a full close-of-day run

Use the `messages` tool for cleanup and summarisation where available:

- `search` + `delete` for cleanup candidate discovery/removal
- `search` + `get` for daily-note summarisation work

For `web:*`, the session scope covers **all web session trees** (root chats plus branches), not just the visible tab.

## Usage

```bash
bun run /workspace/.pi/skills/close-of-day/close-of-day.ts \
  --days 1 \
  --chat-jid web:default \
  --report /workspace/exports/close-of-day.md \
  --cleanup
```

### Common modes

- `--dry-run` — preview cleanup only (default behaviour for deletion)
- `--apply` — perform deletions
- `--include-media` — allow deletion of messages with attachments
- `--skip-backup` — skip restic backup
- `--situate-only` — generate or update the situation report only; this is a partial maintenance pass
- `--cleanup-only` — run cleanup only; this is a partial maintenance pass

## Flags

- `--days <n>` — how many days to include in the situation report and cleanup search window
- `--since <iso8601>` — override window start for cleanup
- `--chat-jid <jid>` — target chat context (default `web:default`)
- `--report <path>` — report path (default `/workspace/exports/close-of-day-<DATE>.md`)
- `--include-media` — delete messages that still have attachments
- `--skip-backup` — skip restic backup
- `--backup-cmd <command>` — override backup command
- `--situate-only` — skip cleanup and daily-note completion
- `--cleanup-only` — skip situate and daily-note completion

## Completion criteria

Do **not** report “day closed” until all of the following are done:

1. situation report generated
2. backup run, unless explicitly skipped
3. cleanup run
4. `/workspace/.pi/skills/situate-daily-notes/SKILL.md` followed and the relevant daily notes updated in the same task

If you use `--situate-only` or `--cleanup-only`, treat the run as a partial maintenance pass, not as a completed close-of-day.

## Behaviour

- cleanup defaults to dry-run so counts can be reviewed first
- attachment-bearing threads are skipped unless `--include-media` is set
- if `web:*` session trees diverge, preserve branch separation in the resulting daily summaries instead of blending them together
- the generated close-of-day report is an intermediate working artifact for the daily-notes phase

## Output artifacts

Expect these to remain consistent after a full run:

- `notes/daily/YYYY-MM-DD.md`
- `notes/daily/*.agent.json`
- `notes/memory/current-state.md`
- `notes/memory/recent-context.md`
- `notes/memory/MEMORY.md`

For ad-hoc cleanup groups without the daily-note workflow, use `timeline-cleanup` directly.

---
name: situate-daily-notes
description: Situate yourself by generating a 1-page situation report and maintaining Obsidian-style daily summary notes.
distribution: private
---

# Situate daily notes

Use this on demand when the user asks you to catch up, or as the required daily-notes phase of `close-of-day`.

Do not run it automatically at session start.

## Script roles

- `situate.ts` — full situation report + rolling memory refresh + note status check
- `daily-notes.ts` — generate or refresh daily-note skeletons only

## Quick start

```bash
bun run /workspace/.pi/skills/situate-daily-notes/situate.ts
```

This:

1. prints a one-page situation report
2. aggregates activity across the relevant chat/session scope
3. generates missing daily-note skeletons
4. refreshes rolling memory/context files under `notes/memory/`
5. lists notes that still need summaries or partial updates

For `web:*` scopes, all web session trees are included and labelled so parallel branches stay distinguishable.

## Daily note format

Notes live at `notes/daily/YYYY-MM-DD.md` and begin with YAML front matter like:

```yaml
---
date: 2026-03-04
summarised_until: 2026-03-04T17:55:35.286Z
messages_total: 25
messages_user: 10
messages_assistant: 15
session_trees: 2
session_chats: 4
first_message: 2026-03-04T12:31:03.860Z
last_message: 2026-03-04T17:55:17.309Z
scope_mode: all-web-session-trees
scope_anchor: web:default
---
```

Rolling memory outputs live under `notes/memory/`:

- `notes/memory/current-state.md`
- `notes/memory/recent-context.md`
- `notes/memory/MEMORY.md`

## Writing summaries

Daily notes summarise activity. The message database is the source of truth for the full transcript.

When `situate.ts` or `daily-notes.ts` reports notes that need summary work:

1. read the note to confirm the target day and current metadata
2. use the `messages` tool as the primary transcript source
3. write a concise narrative summary covering:
   - work grouped by theme rather than chronology
   - key outcomes / deployments / configurations
   - unresolved blockers or open threads
   - materially different branch conversations kept distinct
4. replace `<!-- NEEDS_SUMMARY -->` or the update marker
5. move `summarised_until` to the last covered message timestamp

If a note is only partially behind, append a short update section and advance the watermark rather than rewriting the whole note.

Keep the prose terse, dense, and matter-of-fact. Preserve existing real summaries; only fill placeholders or append updates.

## Options

| Flag | Default | Description |
|---|---|---|
| `--days <n>` | `7` | How many days of history to include |
| `--out <path>` | `/workspace/exports/situation.md` | Situation report output path |
| `--update-notes` | off | Refresh note metadata and memory outputs while generating the report |

## Standalone daily-note generation

```bash
bun run /workspace/.pi/skills/situate-daily-notes/daily-notes.ts [--days <n>] [--force]
```

For daily-note writing, prefer the `messages` tool over a separate full-transcript export unless you specifically need a transcript artifact.

# Memory outputs

Dream and AutoDream maintain this directory in an out-of-band model turn on a temporary `dream:` channel. That channel is removed after the cycle ends.

Dream follows four phases:

1. Orient
2. Signal
3. Consolidate
4. Prune and Index

Files created and refreshed here include:

- `MEMORY.md` — compact startup index
- `current-state.md` — compact Dream state snapshot
- `recent-context.md` — concise recent digest
- `user.md` — durable role and preference memory
- `feedback.md` — corrections and steering cues
- `project.md` — ongoing work and recent outcomes
- `reference.md` — note index and external pointers
- `days/YYYY-MM-DD.md` — optional sparse per-day memory when a day carries durable agent-facing signal beyond the daily note

`notes/daily/` holds the human-readable overview. `notes/memory/days/` is sparse and should not mirror `notes/daily/`.

`MEMORY.md` should link to a day-memory file only when that file exists. Otherwise it should link back to the daily note.

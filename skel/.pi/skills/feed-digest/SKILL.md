---
name: feed-digest
description: Build a deduped markdown digest from feeds.carmo.io (last N hours) and store links separately.
distribution: public
---

# Feed Digest

Use this skill to build a deduped markdown digest from https://feeds.carmo.io for a chosen time window.
It writes:
- Markdown digest: `/workspace/notes/feeds-digest.md`
- Link index (JSON): `/workspace/notes/feeds-digest-links.json`

## Usage

```bash
/workspace/.pi/skills/feed-digest/run [--hours N] [--simhash N] [--out path] [--links-out path]
```

Defaults:
- `--hours 12`
- `--simhash 8`
- `--out /workspace/notes/feeds-digest.md`
- `--links-out /workspace/notes/feeds-digest-links.json`

## Notes

- Deduping uses simhash with a Hamming distance threshold.
- The markdown digest omits URLs; fetch links from the JSON index when needed.

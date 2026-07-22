# GitHub Issues Migration Plan

## Migration target

Migrate the file-based workitem kanban
(`workitems/{00-inbox,10-next,20-doing,30-done,40-review,50-done}/`) to GitHub
Issues + GitHub Projects (v2) on `rcarmo/piclaw`.

The file kanban stays as the authoritative source during migration. After the
migration is verified, the files become read-only archives and all new work
goes through GitHub Issues.

---

## Corpus

| Lane | Count | Migration order |
|---|---|---|
| `50-done` | 182 | First — closed issues, chronological by `created:` |
| `30-done` | 8 | Second — closed issues |
| `40-review` | 14 | Third — open issues, `In Review` status |
| `20-doing` | 8 | Fourth — open issues, `In Progress` status |
| `10-next` | 23 | Fifth — open issues, `Next` status |
| `00-inbox` | 49 | Sixth — open issues, `Inbox` status |
| **Total** | **284** | |

---

## Phase 1 — Setup (before any issue creation)

### 1.1 GitHub Project (v2)

Create a new Project on `rcarmo/piclaw` with:

- **Name:** Piclaw Kanban
- **Type:** Board view (kanban)

**Status field values** (maps directly from lane names):

| Project status | Source lane | Issue state |
|---|---|---|
| Inbox | `00-inbox` | open |
| Next | `10-next` | open |
| In Progress | `20-doing` | open |
| In Review | `40-review` | open |
| Done | `30-done` + `50-done` | closed |

> `30-done` maps to `Done` with closed state — these are internally-resolved
> items that never needed a formal review gate.

**Custom fields to add:**

| Field | Type | Values |
|---|---|---|
| `Estimate` | Single select | XS, S, M, L, XL |
| `Risk` | Single select | low, medium, high |
| `Source file` | Text | original workitem filename (for traceability) |

### 1.2 Label taxonomy

Extend the existing labels with the following. Labels that already exist are
marked ✅.

**Priority labels** (already partially set up):

| Label | Color | Notes |
|---|---|---|
| `priority:critical` | `#b60205` | rename/add alongside existing p0/p1 |
| `priority:high` | `#d93f0b` | |
| `priority:medium` | `#fbca04` | |
| `priority:low` | `#0e8a16` | |

Existing `priority:p0` / `priority:p1` can coexist or be retired — decide
before migration starts.

**Area labels** (extend existing `area:*`):

| Label | Color |
|---|---|
| `area:extensions` ✅ | `#1d76db` |
| `area:web` ✅ | `#0e8a16` |
| `area:runtime` ✅ | `#5319e7` |
| `area:workspace` ✅ | `#1d76db` |
| `area:providers` ✅ | `#fbca04` |
| `area:container` ✅ | `#0052cc` |
| `area:shell` ✅ | `#5319e7` |
| `area:tools` | `#1d76db` |
| `area:sessions` | `#5319e7` |
| `area:docs` | `#0075ca` |
| `area:packaging` | `#e4e669` |
| `area:security` | `#b60205` |
| `area:desktop-automation` | `#0052cc` |
| `area:m365` | `#0052cc` |

**Type labels:**

| Label | Color |
|---|---|
| `type:feature` | `#a2eeef` |
| `type:bug` | `#d73a4a` |
| `type:refactor` | `#e4e669` |
| `type:audit` | `#fbca04` |
| `type:docs` | `#0075ca` |
| `type:release` | `#5319e7` |
| `type:research` | `#c5def5` |

**State labels** (useful for filtering without relying solely on project status):

| Label | Color |
|---|---|
| `blocked` | `#d73a4a` |
| `deferred` | `#cfd3d7` |

### 1.3 Issue template

Create `.github/ISSUE_TEMPLATE/workitem.md`:

```markdown
---
name: Work item
about: Feature, improvement, refactor, or audit task
title: ''
labels: ''
assignees: ''
---

## Summary

<!-- What is this and why does it matter? -->

## Acceptance Criteria

- [ ] 

## Implementation Notes

<!-- Key files, approach, constraints -->

## Test Plan

- [ ] 

## Definition of Done

- [ ] All acceptance criteria satisfied and verified
- [ ] Tests added or updated — passing locally
- [ ] Type check clean
- [ ] Docs updated if user-facing behaviour changes
- [ ] Update history complete with evidence
```

---

## Phase 2 — Migration script

A Bun script (`scripts/migrate-workitems-to-github.ts`) handles the bulk
migration. It is designed to be **idempotent** — re-running it skips files
that already have a corresponding issue (matched by source file label or
title).

### Script inputs

```
bun scripts/migrate-workitems-to-github.ts \
  --repo rcarmo/piclaw \
  --lanes 50-done,30-done     # comma-separated, controls what is processed
  --dry-run                    # print what would be created; no API calls
  --limit 20                   # max issues to create per run
  --token $GITHUB_PICLAW_BOT_PAT
```

### Script logic per workitem file

1. Parse YAML frontmatter (id, title, status, priority, estimate, risk, tags,
   created, blocked-by).
2. Build label list:
   - `priority:<priority>` if set
   - `area:<tag>` for tags that match known area labels
   - `type:<tag>` for tags that map to type labels
   - `blocked` if `blocked-by` is non-empty
3. Map lane → GitHub issue state:
   - `50-done`, `30-done` → `closed`
   - all others → `open`
4. Build issue body from the markdown file body (everything after `---\n---`).
5. `POST /repos/rcarmo/piclaw/issues` with title, body, labels.
6. For closed issues: immediately `PATCH` the issue to `state: closed`.
7. Add the issue to the Project and set `Status` field to the mapped value.
8. Set `Estimate`, `Risk`, `Source file` custom fields.
9. Record `{filename → issue_number}` in a local state file
   (`scripts/migrate-state.json`) for idempotency.

### Rate limiting

GitHub allows ~5000 API requests/hour for authenticated apps. At ~4 API
calls per issue (create, close, add to project, set fields), 284 issues =
~1136 calls — well within limits. Add a small delay (50ms) between issues
to be conservative.

---

## Phase 3 — Migration order

### Step 1: `50-done` (182 items) — closed issues

- Sort by `created:` ascending (oldest first).
- Create as closed issues in batches of 50 per run (`--limit 50`).
- Verify: spot-check 5 random items after each batch.

### Step 2: `30-done` (8 items) — closed issues

- Same as above; tiny batch, run all at once.

### Step 3: `40-review` (14 items) — open, `In Review`

- Create as open issues; set project status to `In Review`.

### Step 4: `20-doing` (8 items) — open, `In Progress`

- Create as open issues; set project status to `In Progress`.

### Step 5: `10-next` (23 items) — open, `Next`

- Create as open issues; set project status to `Next`.

### Step 6: `00-inbox` (49 items) — open, `Inbox`

- Create as open issues; set project status to `Inbox`.

---

## Phase 4 — Post-migration

- Add a `WORKITEMS.md` to the repo root explaining that `workitems/` is now a
  read-only archive and all new issues go through GitHub Issues.
- Update kanban-management SKILL.md to reference GitHub Issues as the primary
  surface.
- Lock the `workitems/` directory from further writes (or add a CI check that
  rejects new `.md` files in it).
- Update README.md contributing section.

---

## Decisions needed before starting

1. **Priority label naming:** retire `priority:p0`/`p1` in favour of
   `priority:critical`/`high`/`medium`/`low`, or keep both?
2. **Project visibility:** public or private project?
3. **`blocked-by` links:** store as plain text in issue body, or create GitHub
   issue cross-references? (Cross-references require knowing the target issue
   number first — only possible if migration is ordered by dependency graph,
   not by date. Recommend: store as text links in the body for now; resolve
   cross-references in a follow-up pass.)
4. **`30-done` vs `50-done`:** treat both as `Done`/closed, or preserve the
   distinction with a label (e.g. `lane:review-done`)?

---

## Acceptance Criteria

- [ ] GitHub Project `Piclaw Kanban` created with 5 status values.
- [ ] Full label taxonomy created (priority, area, type, state).
- [ ] `.github/ISSUE_TEMPLATE/workitem.md` merged to `main`.
- [ ] Migration script written and `--dry-run` validated against all 284 items.
- [ ] `50-done` (182) migrated as closed issues in chronological order.
- [ ] `30-done` (8) migrated as closed issues.
- [ ] `40-review`, `20-doing`, `10-next`, `00-inbox` migrated as open issues with correct project status.
- [ ] `migrate-state.json` committed as the source-of-truth mapping.
- [ ] `WORKITEMS.md` added; kanban-management skill updated.
- [ ] Spot-check: 10 random issues verified for correct labels, status, and body fidelity.

## Definition of Done

- [ ] All 284 items migrated (verified by `migrate-state.json` entry count)
- [ ] GitHub Project board shows correct lane distribution
- [ ] No duplicate issues created
- [ ] `workitems/` declared read-only
- [ ] kanban-management SKILL.md updated
- [ ] Update history complete

## Updates

### 2026-04-22
- Initial plan written from corpus audit (284 items, 6 lanes).
- Existing label taxonomy partially maps to current tag taxonomy.
- `gh` CLI v2.46.0 available; `GITHUB_PICLAW_BOT_PAT` available.
- Issues enabled on `rcarmo/piclaw`; no existing issues to conflict with.
- 4 decisions flagged before implementation can start.

## Links

- `workitems/_templates/work-item.md`
- `.pi/skills/kanban-management/SKILL.md`
- `scripts/` (migration script target location)

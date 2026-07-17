---
name: kanban-management
description: ARCHIVED — project work items are tracked in GitHub Issues and GitHub Projects. Use the github-issues skill when installed, or use gh directly.
distribution: public
---

# Kanban management — archived

The file-based `workitems/` board is archived. Do not create or move Markdown work-item files unless this workspace explicitly adopts the legacy file-board workflow.

## Current workflow

Use the current Git repository's GitHub Issues and GitHub Projects v2. Confirm the repository before changing it:

```bash
repo=$(gh repo view --json nameWithOwner -q .nameWithOwner)

# Create an issue
gh issue create -R "$repo" --title "..." --body "..."

# List open issues
gh issue list -R "$repo" --state open

# Close a completed issue
gh issue close <number> -R "$repo" --reason completed
```

If the `github-issues` skill is installed, load it for project-field IDs, status changes, labels, and board queries. Otherwise inspect the repository with `gh issue` and `gh project` before changing it.

The local `workitems/` directory remains compatibility scaffolding for older workspaces and project templates. It is not the active tracker unless the workspace says otherwise.

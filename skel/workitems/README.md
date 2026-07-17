# Workitems compatibility scaffold

Use the current Git repository's GitHub Issues and GitHub Projects for active project work. Do not create new Markdown work-item files here unless this workspace explicitly adopts the legacy file-board workflow.

The lane directories and `_templates/work-item.md` remain for compatibility with older workspaces and project templates.

Confirm the repository before changing issues:

```bash
repo=$(gh repo view --json nameWithOwner -q .nameWithOwner)
gh issue list -R "$repo" --state open
gh issue create -R "$repo" --title "..." --body "..."
```

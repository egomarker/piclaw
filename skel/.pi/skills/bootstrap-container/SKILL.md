---
name: bootstrap-container
description: Bootstrap a new container by validating required tools and installing missing dependencies.
distribution: public
---

# Bootstrap container

Use this on a fresh container to install missing CLI tools and workspace dependencies.

## Steps

1. Run the bootstrap script:
   ```bash
   bash /workspace/.pi/skills/bootstrap-container/bootstrap-container.sh
   ```

2. Review the summary output for missing or failed steps.

## Actions

- Installs required CLI tools (curl, wget, git, jq, rg, sqlite3, restic, openssh-client, supervisorctl, iproute2, etc.) if missing.
- Ensures `/workspace/package.json` exists and installs JS deps (`linkedom`, `turndown`, `playwright`).
- Installs Playwright Chromium + OS deps into `/workspace/.cache/ms-playwright`.
- Prints a version/status summary at the end.

## Environment

- `PICLAW_WORKSPACE` (default: `/workspace`)
- `PLAYWRIGHT_BROWSERS_PATH` (default: `/workspace/.cache/ms-playwright`)

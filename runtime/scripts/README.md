# runtime/scripts

This directory contains packaged helper scripts that ship with piclaw.

Store scripts here when they are part of the packaged runtime surface,
including scripts invoked by documented `bun run ...` commands from the repo or
published package.

Examples include:

- packaged vendor/download helpers
- packaged validation helpers tied to runtime behavior
- packaged operator-style helper entrypoints such as `proxmox`

Do **not** store repo-only audits, migrations, or maintainer one-offs here.
Keep those under the repo-root `scripts/` directory.

Related:
- `docs/archive/repo-runtime-boundaries-2026-03-28.md`
- `README.md`

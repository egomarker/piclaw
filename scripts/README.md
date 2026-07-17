# scripts

`scripts/` contains repository maintenance, audit, migration, and operator entrypoints for the source tree.

Use `scripts/` for things like:

- audit helpers
- migration/replay tools
- repo-install smoke checks
- release/build helpers tied to repository maintenance

Do **not** place packaged runtime helpers here. Use `runtime/scripts/` for scripts that ship with Piclaw.

Related:
- `docs/archive/repo-runtime-boundaries-2026-03-28.md`
- `runtime/scripts/README.md`

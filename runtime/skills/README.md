# runtime/skills

This directory contains filesystem-backed packaged runtime skills.

These skills ship with piclaw. They are distinct from workspace or
project-local `.pi/skills/` convention paths, which remain a
compatibility-sensitive public surface.

## Subdirectories

- `builtin/` — packaged built-in workflow skills
- `operator/` — packaged operator/infrastructure skills
- `integrations/` — packaged external/tool-backed integration skills

## Compatibility boundary

Do not rename `.pi/skills/` to mirror this tree. The runtime packaging layout
and workspace convention paths are related, but they are not interchangeable.

Related:
- `docs/archive/stage4-extension-skill-namespacing-inventory-2026-03-28.md`
- `docs/repo-runtime-boundaries-2026-03-28.md`

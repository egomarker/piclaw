---
id: upgrade-pi-0-62-sourceinfo-migration
title: "Upgrade pi to 0.62.0: migrate extensionPath → sourceInfo"
status: done
priority: high
created: 2026-03-23
updated: 2026-03-23
tags:
  - work-item
  - kanban
  - upstream
  - breaking-change
owner: 
---

# Upgrade pi to 0.62.0: migrate extensionPath → sourceInfo

## Summary

Pi upstream `0.62.0` (released 2026-03-23) removes `getRegisteredCommandsWithPaths()` and `extensionPath` from `RegisteredCommand`. All provenance now uses `sourceInfo: SourceInfo` consistently.

Two files require changes:

1. **`runtime/src/agent-control/handlers/info.ts`** (~5 lines)
   - `extensionRunner.getRegisteredCommandsWithPaths()` → `extensionRunner.getRegisteredCommands()`
   - `entry.extensionPath` → `entry.sourceInfo?.path`
   - `isPiBuiltin(extensionPath)` check needs to use `sourceInfo.path`

2. **`runtime/test/agent-control/agent-control-handlers.test.ts`** (~3 lines)
   - Mock `getRegisteredCommandsWithPaths` → `getRegisteredCommands`
   - Mock entries: `{ command, extensionPath }` → `{ command, invocationName, sourceInfo: { path, source, scope, origin } }`

Also: bump `@earendil-works/pi-coding-agent` from `0.61.1` to `0.62.0` globally.

## Acceptance criteria

- [ ] `bun add -g @earendil-works/pi-coding-agent@0.62.0` succeeds
- [ ] `info.ts` compiles with new API shape
- [ ] Test mock updated and all agent-control tests pass
- [ ] Full test suite green

## Updates

### 2026-03-23
- Upstream impact analysis completed — only 2 files affected
- Both changes are mechanical renames

## Notes

- `Skill.source`, `PromptTemplate.source`, `ResourceLoader.getPathMetadata()` also removed upstream but we don't use any of them.
- `renderCall`/`renderResult` semantics changed but we don't define custom tool renderers.

## Links
- Upstream changelog: `@earendil-works/pi-coding-agent` 0.62.0
- Migration notes in CHANGELOG.md under "Breaking Changes"

---
id: add-bun-npm-installable-addon-extension-mechanism
title: Add bun/npm-installable addon extension mechanism
status: next
priority: high
created: 2026-04-21
updated: 2026-04-21
target_release: next
estimate: L
risk: high
tags:
  - work-item
  - kanban
  - extensions
  - packaging
  - bun
  - npm
  - addons
  - ux
owner: pi
blocked-by: []
origin: "User request"
---

# Add bun/npm-installable addon extension mechanism

## Summary

Introduce a first-class addon installation mechanism so Piclaw can install
optional extensions from a companion repository such as
`piclaw-addons` using Bun/npm package flows.

The core model is:

- Piclaw keeps the main repo focused on core and generally useful bundled
  surfaces.
- Complex, niche, or higher-maintenance extensions live in a separate
  `piclaw-addons` repository.
- Piclaw can be pointed at that repo/package source and install selected
  addons from it.
- Installation should be possible from both the CLI and, ideally, a web UI
  wizard / manager flow.

This should become the supported path for shipping optional extensions without
forcing them into the core runtime tree or requiring manual copy/drop-in
extension management.

## Why

The current extension story is split across:

- built-in runtime extensions
- packaged runtime extensions under `runtime/extensions/`
- workspace-local `.pi/extensions/`
- agent-local compatibility surfaces

That works for development, but it is not a clean distribution mechanism for:

- optional integrations
- niche operators/admin tooling
- heavy dependencies
- extensions that should be discoverable and installable after first setup

A companion addon repository gives Piclaw a cleaner packaging boundary and a
clearer support model for non-core surfaces.

## Core requirements

- Piclaw has a companion `piclaw-addons` repository.
- Complex/niche extensions can live there instead of the main repo.
- Piclaw can install selected addons from that source using Bun/npm-friendly
  package flows.
- Piclaw can be configured to point at that addon source.
- A user-facing UI wizard/manager should be considered for browsing and
  installing addons.

## Desired behavior

### CLI / script path

A user or setup flow can run something conceptually like:

```bash
piclaw addons source set github:rcarmo/piclaw-addons
piclaw addons list
piclaw addons install foo
piclaw addons install github:rcarmo/piclaw-addons#bar
piclaw addons remove foo
```

The installed addon becomes discoverable to the runtime without manual file
copying into `.pi/extensions/`.

### UI path

A web UI wizard or manager can:

- list available addons from the configured source
- show name, description, version, and dependency/runtime notes
- install/update/remove selected addons
- explain whether a restart/rebind is required

### Runtime integration

Installed addons should participate in the normal extension discovery/loading
path with a stable, supported install location and metadata model.

## Acceptance criteria

- [ ] Piclaw supports a configured addon source distinct from the core repo.
- [ ] A companion `piclaw-addons` repository can be used as that source.
- [ ] At least one install flow works via Bun/npm package semantics rather than
      manual file copying.
- [ ] Installed addons land in a stable supported location outside the core
      repo tree.
- [ ] Installed addons are discoverable by the runtime after the required
      reload/rebind step.
- [ ] Addon metadata includes enough information for listing/install UX.
- [ ] There is a CLI/admin surface for list/install/remove/update.
- [ ] A web UI wizard/manager path is designed, even if implementation lands in
      a follow-up.
- [ ] Failure modes are explicit: source unavailable, bad package metadata,
      install failure, incompatible addon/runtime version.
- [ ] The mechanism does not require editing `runtime/extensions/` directly on
      the installed core package.

## Design questions

- What is the canonical install target?
  - `~/.pi/agent/addons/`
  - `/workspace/.pi/addons/`
  - both, with precedence rules?
- Does an addon install as:
  - a package exposing one or more extension entrypoints?
  - a bundle of skills + extension code + metadata?
- How is compatibility declared?
  - semver against Piclaw
  - semver against `@earendil-works/pi-coding-agent`
  - both?
- Should addon installation be per-user, per-workspace, or both?
- How are dependency conflicts and duplicate extension IDs handled?
- Should the UI wizard be a standalone `/addons` flow or part of the existing
  extension manager work?

## Recommended implementation path

### Phase 1 — Packaging contract

Define an addon package contract:

- manifest/metadata shape
- install location
- extension entrypoint discovery
- compatibility fields
- reload/rebind behavior

### Phase 2 — CLI install path

Implement the supported install/remove/list flow using Bun/npm package
mechanics.

### Phase 3 — Runtime discovery

Teach Piclaw to discover installed addons from the supported install location.

### Phase 4 — UI wizard / manager

Add a web-facing manager/wizard for browsing and installing addons from the
configured source.

## Non-goals

- [ ] Turning every existing built-in extension into an addon immediately.
- [ ] Supporting arbitrary untrusted package execution without guardrails.
- [ ] Building a public marketplace in the first pass.
- [ ] Solving per-chat extension toggles here unless it directly overlaps.

## Test plan

- Applicable regression classes from `workitems/regression-test-planning-reference.md`:
  - [ ] Installation / upgrade scenario test
  - [ ] Discovery / runtime activation scenario test
- [ ] Unit test: addon metadata parsing and compatibility checks
- [ ] Integration test: install addon package into supported location and load it
- [ ] Integration test: incompatible addon is rejected cleanly
- [ ] Integration test: remove addon and verify it disappears after reload/rebind
- [ ] UI test (if implemented): wizard lists/install actions and error states

## Definition of done

- [ ] Packaging contract documented
- [ ] CLI/admin install path implemented and verified
- [ ] Runtime discovery path implemented and verified
- [ ] At least one addon can be installed from the companion source end-to-end
- [ ] Tests added or updated — passing locally
- [ ] Type check clean
- [ ] Docs updated
- [ ] Follow-up tickets created for deferred UI/marketplace scope
- [ ] Ticket front matter updated

## Links

- `workitems/00-inbox/add-per-chat-extensions-command-and-card.md`
- `runtime/src/agent-pool/session.ts`
- `runtime/extensions/README.md`
- `docs/architecture.md`

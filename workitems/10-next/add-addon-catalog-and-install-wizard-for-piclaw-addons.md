---
id: add-addon-catalog-and-install-wizard-for-piclaw-addons
title: Add addon catalog and install wizard for piclaw-addons
status: next
priority: high
created: 2026-04-21
updated: 2026-04-21
target_release: next
estimate: XL
risk: high
tags:
  - work-item
  - kanban
  - extensions
  - addons
  - packaging
  - bun
  - npm
  - ux
  - security
  - catalog
owner: pi
blocked-by: []
origin: "User request"
---

# Add addon catalog and install wizard for piclaw-addons

## Summary

Create a first-class addon distribution mechanism for Piclaw built around a
companion repository, `piclaw-addons`, plus a runtime installer/discovery flow
that can fetch, install, update, remove, and surface optional extensions using
Bun/npm-compatible package mechanics.

The key idea is to separate:

- **core Piclaw** — stable bundled runtime extensions and generally useful
  built-ins
- **addons** — complex, niche, heavier, or higher-maintenance extensions that
  should be installable on demand

Users should be able to point Piclaw at the companion addon source, browse the
available addons, and install selected ones without manually copying code into
workspace extension folders.

## Problem

Today, Piclaw has several extension surfaces:

- built-in extension factories under `runtime/src/extensions/`
- packaged runtime extensions under `runtime/extensions/`
- workspace-local `.pi/extensions/`
- agent-local compatibility surfaces

Those are sufficient for development and manual customization, but they do not
provide a good story for post-install distribution of optional extensions.

Current pain points:

- niche extensions must either live in the core repo or be copied around
  manually
- there is no official addon package contract
- there is no install/update/remove lifecycle
- there is no discoverable user-facing addon catalog
- there is no stable support boundary between core and optional extension
  ecosystems

## Goals

- Ship an official addon mechanism based on Bun/npm-installable packages.
- Support a companion `piclaw-addons` repository as the primary addon source.
- Keep complex/niche extensions out of the core repo by default.
- Make addon installation discoverable and repeatable.
- Support both CLI/admin flows and a future UI wizard/catalog.
- Keep runtime discovery, compatibility checks, and trust boundaries explicit.

## Non-goals

- [ ] Move every existing extension into addon packaging immediately.
- [ ] Build a public unauthenticated marketplace in the first pass.
- [ ] Allow arbitrary package execution without policy/compatibility checks.
- [ ] Solve per-chat extension toggles here except where integration points are
      necessary.
- [ ] Replace workspace-local `.pi/extensions/` for development workflows.

## Core requirements

- Piclaw has a companion `piclaw-addons` repository.
- Complex/niche extensions can live there instead of the main repo.
- Piclaw can be pointed at that source.
- Piclaw can install selected addons using Bun/npm package flows.
- Installed addons land in a stable supported location outside the core package
  tree.
- Installed addons are discoverable by Piclaw after reload/rebind.
- A user-facing UI wizard/catalog is part of the design target.

## User stories

### Operator / admin

- As an operator, I want to install a supported addon after initial setup
  without editing the Piclaw package tree manually.
- As an operator, I want to update or remove addons cleanly.
- As an operator, I want to know whether an addon is compatible with my Piclaw
  version before installing it.
- As an operator, I want an explicit install location that survives upgrades of
  the core package.

### End user / web user

- As a web user, I want to browse available addons from a catalog-like UI.
- As a web user, I want to see addon descriptions, compatibility, and required
  restart/rebind steps before installing.
- As a web user, I want installation failures explained clearly.

### Maintainer

- As a maintainer, I want a clean packaging contract for addon authors.
- As a maintainer, I want the companion repo to carry niche/high-maintenance
  integrations without bloating the core distribution.
- As a maintainer, I want a support boundary that distinguishes core from addon
  ecosystem issues.

## Desired behavior

### Source configuration

Piclaw can be configured with one or more addon sources, starting with a
primary source such as:

- `github:rcarmo/piclaw-addons`
- a git URL
- an npm package namespace or package index descriptor
- a local/dev addon catalog path (optional for development)

At minimum, one configured source should be treated as the official companion
catalog.

### Install flow

A user can do something like:

```bash
piclaw addons source set github:rcarmo/piclaw-addons
piclaw addons list
piclaw addons info addon-slug
piclaw addons install addon-slug
piclaw addons update addon-slug
piclaw addons remove addon-slug
```

The installed addon is placed in a supported install location and becomes part
of runtime extension discovery after the required reload/rebind.

### UI wizard/catalog

A web UI flow (likely `/addons` or folded into a manager surface) can:

- list available addons from the configured source
- search and filter addons
- show description, author, version, compatibility, and risk notes
- install/update/remove addons
- explain required restart/rebind state
- show install progress / failure details

### Runtime discovery

After install, Piclaw should discover addon-provided extension entrypoints and
skills using the same style of stable contract as core packaged extensions,
without editing `runtime/extensions/` inside the installed package.

## Addon packaging contract

### Package contents

An addon package should be able to provide one or more of:

- runtime extension entrypoints
- colocated skills
- optional assets/templates/docs
- metadata for listing/install UX

### Minimum metadata

Define a manifest such as `piclaw-addon.json` (name tentative) containing at
least:

- addon id / slug
- display name
- summary / description
- version
- author / maintainer
- source repo / homepage
- compatible Piclaw version range
- compatible `@earendil-works/pi-coding-agent` version range if needed
- extension entrypoint paths
- shipped skill paths
- tags/categories
- restart/rebind requirement
- platform constraints (linux/windows/macos, optional)
- dependency metadata (other addons or system deps)
- trust/risk notes if relevant

### Entry points

The runtime should load addon entrypoints from declared manifest paths, not by
blindly executing arbitrary package files.

## Install location and precedence

Design a stable install location outside the core package tree.

Primary candidate:
- `~/.pi/agent/addons/`

Optional workspace-scoped variant:
- `/workspace/.pi/addons/`

Questions to resolve:
- should we support both per-user and per-workspace addons?
- what is the precedence if an addon exists in both locations?
- how do workspace-scoped installs interact with containerized versus
  host-native setups?

Recommended first-pass precedence:
1. workspace-local addon install location
2. user-local addon install location
3. bundled core/package extensions

…but this should be validated explicitly before implementation.

## Source and catalog model

### Companion repository

The official `piclaw-addons` repo should be structured so Piclaw can consume a
catalog and installable packages from it.

Possible models:

#### Model A — monorepo of publishable packages
Each addon is its own Bun/npm package within `piclaw-addons`, with a generated
catalog index.

#### Model B — repo catalog + install-from-git package paths
Catalog points to subdirectories / package specs in the repo and Piclaw uses
Bun/npm/git install semantics directly.

#### Model C — published npm packages plus optional repo metadata
Most scalable long-term, but higher release/ops overhead.

Recommended first pass:
- **Model A or B**, whichever minimizes initial tooling complexity while still
  giving a clear package contract.

## CLI/admin surface

Provide a command/admin flow capable of:

- source configure/show/reset
- list available addons
- show addon metadata/details
- install addon
- update addon
- remove addon
- list installed addons
- validate compatibility / diagnose load failures

Potential command family:

```bash
piclaw addons source set <source>
piclaw addons source show
piclaw addons list
piclaw addons list --installed
piclaw addons info <addon>
piclaw addons install <addon>
piclaw addons update <addon>
piclaw addons remove <addon>
piclaw addons doctor
```

## UI wizard/catalog surface

### UX requirements

- web-first experience
- searchable addon catalog
- cards or rows with summary metadata
- install/update/remove actions
- explicit warnings for incompatible or experimental addons
- clear restart/rebind prompts
- progress/error feedback

### Integration options

#### Path A — dedicated `/addons` command + card/wizard (recommended)
A dedicated addon manager surface in web UI.

#### Path B — extend `/extensions` manager
Possible future convergence, but addon installation and active-per-chat toggles
should stay conceptually distinct.

Recommendation:
- keep addon installation separate from per-chat enable/disable management in
  the first pass

## Runtime loading and reload semantics

Questions to resolve:

- Are addons loaded only at startup/session bind?
- Can they be discovered without full process restart?
- Is chat-session rebind enough, or does addon install require process reload?

Recommended first pass:
- installation writes files/metadata
- runtime requires an explicit reload/rebind step
- UI/CLI communicates that clearly

## Compatibility and trust policy

### Compatibility

Addon install must validate at least:

- Piclaw version compatibility
- runtime API/extension contract compatibility
- required platform support
- dependency availability where declared

### Trust

The first pass should assume:

- explicit trusted source configuration
- explicit user/admin install action
- no silent install of arbitrary remote packages

Possible future enhancements:
- signed catalog metadata
- trusted publisher allowlists
- addon provenance display

## Failure modes

Need clear handling for:

- source unavailable
- malformed catalog metadata
- package install failure
- addon manifest invalid/missing
- incompatible Piclaw/runtime version
- duplicate addon ids
- extension load failure after install
- remove/update leaving stale metadata behind

## Acceptance criteria

- [ ] A supported addon package contract is defined and documented.
- [ ] Piclaw supports a configured addon source distinct from the core repo.
- [ ] A companion `piclaw-addons` repository works as that source.
- [ ] At least one install path works via Bun/npm-compatible package mechanics.
- [ ] Installed addons land in a stable supported location outside the core
      package tree.
- [ ] Runtime discovery finds installed addons after reload/rebind.
- [ ] Addon metadata is rich enough for CLI/UI listing and compatibility checks.
- [ ] CLI/admin flows exist for list/info/install/update/remove.
- [ ] UI wizard/catalog is fully specified, with implementation either landed or
      split into a child ticket.
- [ ] Install/remove/update failure cases are explicit and user-facing.
- [ ] No manual copying into `.pi/extensions/` is required for the supported
      addon flow.

## Implementation phases

### Phase 1 — contract and source model
- addon manifest shape
- install location
- source configuration
- catalog format
- compatibility rules

### Phase 2 — CLI/admin install path
- source config
- catalog listing
- install/update/remove/doctor flows

### Phase 3 — runtime discovery
- discover installed addons from supported locations
- load declared extension entrypoints and skills
- report failures cleanly

### Phase 4 — web wizard/catalog
- browse/search
- install/update/remove UI
- progress and compatibility warnings

## Test plan

- Applicable regression classes from `workitems/regression-test-planning-reference.md`:
  - [ ] Installation/upgrade scenario test
  - [ ] Discovery/load scenario test
  - [ ] UI interaction scenario test
- [ ] Unit test: addon manifest parsing and compatibility checks
- [ ] Unit test: duplicate addon id / bad manifest rejection
- [ ] Integration test: install addon into supported location and discover it
- [ ] Integration test: incompatible addon is rejected without partial enablement
- [ ] Integration test: remove addon and verify it disappears after reload/rebind
- [ ] Integration test: update addon replaces prior version cleanly
- [ ] UI test: addon catalog lists available addons and handles errors cleanly

## Definition of done

- [ ] Packaging contract documented
- [ ] Companion source model documented
- [ ] CLI/admin install path implemented and verified
- [ ] Runtime discovery implemented and verified
- [ ] At least one addon can be installed from `piclaw-addons` end-to-end
- [ ] UI wizard/catalog implemented or split into tracked follow-up with an
      approved spec
- [ ] Tests added or updated — passing locally
- [ ] Type check clean
- [ ] Docs updated
- [ ] Follow-up tickets created for deferred trust/marketplace scope
- [ ] Ticket front matter updated

## Relationship to existing tickets

- This is intentionally broader and more specific than
  `add-bun-npm-installable-addon-extension-mechanism`.
- That earlier ticket can be treated as a precursor or folded into this one if
  we want a single canonical spec ticket.
- Related but distinct from per-chat extension toggling and extension-manager
  UX.

## Links

- `workitems/10-next/add-bun-npm-installable-addon-extension-mechanism.md`
- `workitems/00-inbox/add-per-chat-extensions-command-and-card.md`
- `runtime/src/agent-pool/session.ts`
- `runtime/extensions/README.md`
- `docs/architecture.md`

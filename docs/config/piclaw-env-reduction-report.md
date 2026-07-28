# Piclaw environment configuration reduction

Piclaw reduced literal `process.env.PICLAW_*` reader names in `runtime/src` from 151 to 20 between the #724 baseline and 27 July 2026. The reduction is 131 names, or 86.8%, against the #747 target of at least 60%.

## Measurements

| Measure | Baseline | Final | Change |
|---|---:|---:|---:|
| `runtime/src` direct-reader names | 151 | 20 | −131 (−86.8%) |
| `runtime/src` direct-reader occurrences | not recorded as the target | 58 | — |
| Production direct-reader names (`runtime/src` + packaged extensions) | not recorded as the target | 21 | — |
| Production direct-reader occurrences | not recorded as the target | 63 | — |
| Extension-only direct-reader names | — | 1 (`PICLAW_PORT`) | harness-only |

The machine-readable source is [`piclaw-env-observations.json`](piclaw-env-observations.json). [`piclaw-env-runtime-src-direct-baseline.json`](piclaw-env-runtime-src-direct-baseline.json) freezes the final 20-name reader baseline. [`piclaw-env-support-catalog.json`](piclaw-env-support-catalog.json) records the disposition and contract for every observed name.

## Delivered work

| Work item | Result |
|---|---|
| #750 | Inventory, scan roots, catalog schema, baseline, policy checks |
| #756 / #751 | Typed domain configuration, persistence, compatibility warnings, secret references |
| #752 | Web, identity, authentication and UI migrations |
| #753 | Agent, session, recovery, watchdog and compaction migrations |
| #754 | Tools, workspace, provider, VNC, terminal and tool-output migrations |
| #755 | Remote, Dream, storage, operational, logging and test-only cleanup |
| #747 closure | Search match mode migration, catalog classification, dead migration-code removal and final report |

Compatibility environment aliases warn once and name their `domains.*` replacement and 3.0.0 removal version. Runtime modules use typed domain getters for migrated ordinary settings.

## Final support policy

The final catalog has no `undocumented-runtime` entries. Each entry is one of:

- `bootstrap`: required before ordinary configuration can load, including workspace/data paths, database test mode, TLS paths and service secrets;
- `supported`: deployment bindings, paths, per-invocation context, experimental/harness gates and other intentional environment contracts;
- `compatibility`: legacy environment aliases for typed `domains.*` settings;
- `internal`: implementation-only tuning excluded from the public configuration contract;
- `removed`: obsolete, test-only or reference-only names with no supported environment reader.

The 20 remaining `runtime/src` direct-reader names are retained deployment, bootstrap, security, path or per-invocation contracts. `PICLAW_PORT` is an extension-only fallback in the experimental Azure OpenAI harness.

TOTP and widget secrets continue to accept legacy JSON values for existing runtime setter flows. New deployments should use keychain or service-environment storage; the catalog does not approve plaintext JSON as a secret persistence surface.

## Enforcement

`bun run check:env-surface` fails when:

- direct-reader names differ from the accepted baseline;
- observations or the support catalog are stale;
- a production name lacks a complete disposition or public contract;
- a bootstrap entry is outside the reviewed allowlist;
- a secret claims JSON persistence;
- scan roots change without an explicit version update.

The closure gate also runs lint, typecheck, the focused environment-audit tests, `quality`, and hosted CI. Source merges do not deploy or restart Piclaw.

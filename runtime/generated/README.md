# runtime/generated

This subtree contains runtime build output and other disposable generated files.

## Intended contents

- `dist/` — TypeScript build output from `bun run build`
- `coverage/` — Bun coverage output from `bun run test:coverage` and related audits
- `cache/` — transient runtime/tool caches
- `tmp/` — disposable generated scratch output only
- `reports/` — transient local reports written only when a command explicitly requests them

## Controlled test reports

`bun run test`, `bun run quality`, `make ci-fast`, and `make pre-push-ci` do not write a controlled-test JSON report by default. They keep console summaries, exit codes, stage results, and memory sampling in the terminal output without changing tracked files.

Use `--report` when a workflow needs a JSON artifact:

```bash
bun run runtime/scripts/controlled-test-runner.ts --report artifacts/performance/controlled-test-report.json
```

Use `artifacts/performance/` or another deliberate artifact path for durable #394 evidence. Use `runtime/generated/reports/` for disposable local reports.

## Explicit Stage 2 classifications

- `runtime/node_modules/` stays in place as a toolchain-sensitive exception.
- VNC harness reports are durable repo evidence and now live under
  `artifacts/vnc-harness/` instead of `runtime/reports/`.
- `runtime/tmp/` is not treated as generated output yet because the current
  local contents are operator-authored scratch scripts rather than emitted
  artifacts.
- `runtime/artifacts/` is retired in favor of repo-level `artifacts/` for
  durable evidence.

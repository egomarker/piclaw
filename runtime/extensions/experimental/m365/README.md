# Experimental M365 extension

This experimental packaged extension adds Microsoft 365 tools to Piclaw.

## Scope

It provides tools for:

- Teams chat listing, reading, and sending
- Microsoft Graph profile, people, and mail operations
- OneDrive and SharePoint browse/search/download/upload/share flows
- calendar queries and calendar SVG output
- Teams file-card helpers that upload/share documents before sending

## Safety and audit

This copy was reviewed before import into the Piclaw tree.

Findings:

- no embedded credentials, cookies, or tokens were found
- auth state is RAM-only inside the running process
- destructive/send flows use `confirm` and usually support `dryRun`
- fresh authentication shows a consent page unless `PICLAW_M365_YOLO=1`; cached browser sessions may supply existing tokens

## Supported platforms

The extension targets:

- Windows
- macOS
- Linux

Browser search order is always:

1. Edge
2. Chrome
3. Chromium

That order is applied for:

- Windows
- macOS
- Linux
- PATH fallback lookup

Stale browser/CDP cleanup also has platform-aware equivalents:

- Windows: PowerShell process filtering + `taskkill`
- macOS/Linux: `ps` process enumeration + `process.kill()` process-group cleanup

Most testing used **Windows**, especially with:

- `PICLAW_ENABLE_M365_EXPERIMENTAL=1`
- `PICLAW_M365_YOLO=1`

If browser auto-detection is not enough, set:

```bash
M365_EDGE_PATH=/full/path/to/browser
```

## Runtime gating

This extension is bundled but **not active by default**.

Enable it with:

```bash
PICLAW_ENABLE_M365_EXPERIMENTAL=1
```

Optional behavior flags:

```bash
PICLAW_M365_YOLO=1
M365_USE_TEMP_EDGE_PROFILE=true
M365_EDGE_PATH=/full/path/to/browser
M365_TENANT_ID=<tenant-or-common>
M365_CHATSVC_REGION=<emea|amer|apac>
```

## Validation

From the repo root:

```bash
bun x tsc --noEmit -p runtime/extensions/experimental/m365/tsconfig.json
bun run runtime/extensions/experimental/m365/tests/validate.ts
```

## Limitations

- experimental
- many auth-sensitive flows depend on a signed-in browser session
- Windows with Edge or another Chrome-family browser has the best test coverage
- non-Windows browser lookup is implemented, but it has less field testing than Windows

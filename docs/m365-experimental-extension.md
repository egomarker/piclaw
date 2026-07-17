# Experimental M365 extension

Piclaw ships an experimental Microsoft 365 extension bundle at:

- `runtime/extensions/experimental/m365/`

## Enable it

Set:

```bash
PICLAW_ENABLE_M365_EXPERIMENTAL=1
```

The session loader will then add the packaged extension entry:

- `runtime/extensions/experimental/m365/index.ts`

## Capabilities

The extension exposes tools for:

- Teams chats and messages
- Teams message sending and file-card helpers
- Microsoft Graph profile / people / mail queries
- OneDrive helpers
- SharePoint browse / search / download / upload / move flows
- Calendar queries and calendar SVG rendering
- **Microsoft To Do tasks and flagged emails** (`m365_todo`)

### `m365_todo` — To Do and flagged emails

Read-only task view combining Microsoft To Do task lists and flagged emails
surfaced through To Do.

```ts
m365_todo({ action: "list" })  // default: open tasks from Tasks + Flagged Emails
m365_todo({ sources: ["flaggedEmails"] })  // only flagged emails
m365_todo({ search: "contract", dueBefore: "2026-05-01" })
m365_todo({ includeCompleted: true, top: 100 })
```

Parameters:
- `sources` — `tasks`, `flaggedEmails`, `allLists` (default: `["tasks","flaggedEmails"]`)
- `includeCompleted` — include completed items (default `false`)
- `status` — filter by status array
- `search` — search title, body, linked resource name
- `dueBefore` / `dueAfter` — ISO date filters
- `top` — max items (default 50, max 200)
- `listIds` — explicit list IDs (overrides `sources`)

Output includes normalized task items with:
- `source` — `tasks`, `flaggedEmails`, or `list`
- `linkedWebUrl` — Outlook item URL for flagged email tasks
- Human-readable summary: total open, by source, first N items with title/source/status/due

Partial list failures are tolerated; errors are reported in `details.errors`.

## Account support

The Graph-backed part of the extension supports consumer Microsoft accounts.

### Works with personal Microsoft accounts

- Graph token acquisition can use an Outlook Live browser session (`outlook.live.com`) via the consumer OAuth flow in `shared.ts`
- Graph-backed reads such as profile / people / mail / calendar can authenticate through that consumer flow
- `m365_onedrive_share_local_file` is the intended personal-OneDrive upload/share helper

### Still requires a work/school M365 account

- Teams chat tools (`m365_teams_*`) — guarded by `requireTeams(...)`
- SharePoint/enterprise document flows where Teams/SharePoint work context is required

In code, consumer accounts are detected via the Microsoft consumer tenant id (`9188040d-6c67-4c5b-b112-36a304b66dad`). When a consumer session is visible, Graph auth prefers the Outlook Live PKCE flow before enterprise Teams-based token recovery.

## Platform support

The bundled copy is intended to run on:

- Windows
- macOS
- Linux

Browser detection order is always:

1. Edge
2. Chrome
3. Chromium

Supported lookup surfaces:

- well-known install paths for Windows, macOS, and Linux
- PATH fallback lookup
- explicit override with `M365_EDGE_PATH`

Stale browser/CDP cleanup also has platform-aware support:

- Windows: PowerShell process filtering and `taskkill`
- macOS/Linux: `ps` enumeration plus signal-based process-group cleanup

## Operational notes

The bundled extension is still **experimental**.

Current behaviour:

- validated mainly on Windows
- reuses an existing browser session when possible; fresh authentication shows an explicit consent interstitial unless `PICLAW_M365_YOLO=1`
- browser sign-in follows the MFA and policy controls already applied to the account
- supports one active account/browser session at a time
- supports `dryRun` where available; mail flows draft messages instead of sending them
- `PICLAW_M365_YOLO=1` skips the explicit consent interstitial and was the main Windows validation mode
- this redistributed copy keeps auth, token, and cookie caches in RAM only
- state-changing and send actions use `confirm`; supported flows offer `dryRun` previews
- Teams token refresh and browser reuse follow the current Teams web-app entry host instead of the old `teams.microsoft.com/v2` route

## Audit summary

Before import, the redistributed bundle was checked for:

- embedded secrets or credentials
- hard-coded local-only operational assumptions
- obvious Windows-only path lock-in

Results:

- no embedded private credentials were found
- personal/local Windows path references from the bundle README were removed from the adopted docs
- browser lookup was expanded so Windows/macOS/Linux all search Edge, then Chrome, then Chromium

## Configuration knobs

| Variable | Purpose |
|---|---|
| `PICLAW_ENABLE_M365_EXPERIMENTAL=1` | Enable the packaged M365 extension |
| `M365_EDGE_PATH` | Explicit Edge/Chrome/Chromium executable override |
| `M365_USE_TEMP_EDGE_PROFILE=true` | Use a temporary browser profile instead of the normal logged-in profile |
| `PICLAW_M365_YOLO=1` | Skip the explicit consent interstitial before auth navigation |
| `M365_TENANT_ID` | Force the tenant id instead of starting from `common` and auto-discovering |
| `M365_CHATSVC_REGION` | Force the Teams chatsvc region instead of auto-discovering it |

## Validation

```bash
bun x tsc --noEmit -p runtime/extensions/experimental/m365/tsconfig.json
bun run runtime/extensions/experimental/m365/tests/validate.ts
```

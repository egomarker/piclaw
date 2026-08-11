# Piclaw Ungit add-on

Adds a small Git-branch action to every folder row in Piclaw's workspace explorer. The action opens that folder in an iframe-backed **Ungit** tab and reuses the same tab when clicked again.

## Automatic startup

At Piclaw startup, the add-on checks `http://127.0.0.1:8448/ungit/api/ping`. If Ungit is already live, it is left alone. Otherwise the add-on resolves `egomarker/ungit`'s remote `main` branch to a full commit SHA and launches that immutable GitHub package:

```sh
bunx --bun \
  --package github:egomarker/ungit#<full-commit-sha> \
  ungit \
  --ungitBindIp=127.0.0.1 \
  --port=8448 \
  --rootPath=/ungit \
  --no-launchBrowser
```

The mutable branch name is never passed to Bun, avoiding stale `#main` package-cache entries. Resolution uses a bounded `git ls-remote` request. After launch, the add-on waits for the health endpoint and required browser assets before recording the revision as last known good. Concurrent startup requests share one launch attempt.

The launcher runs from `/workspace/.piclaw`, giving the Ungit server the writable `/workspace` working directory. The add-on does not monitor or stop the process after startup verification; if it survives a Piclaw restart, the next startup check reuses it.

The path configured as **Workspace root** must refer to Piclaw's workspace from the Ungit process. The default is `/workspace`.

Piclaw serves the browser-facing `/ungit/` route through its authenticated origin, so port `8448` does not need to be published from the container. Ungit uses Socket.IO's HTTP-polling transport through this route; WebSocket upgrades are not proxied.

## Updates, fallback, and rollback

A healthy running process is deliberately reused. To load a newer fork revision, use **Settings → Ungit → Stop Ungit**, then **Start Ungit**. The new start resolves the current remote `main` SHA.

The verified revision is written atomically to `ungit-launch-state.json` under `PICLAW_DATA` (default `/workspace/.piclaw/data`). If remote resolution fails, startup selects this last-known-good SHA. If a newly resolved remote revision launches but fails readiness, it is stopped and the last-known-good SHA is tried once. If no valid fallback exists, startup fails without launching an unpinned package.

For an explicit rollback, set `PICLAW_UNGIT_SHA` to a full 40-character commit SHA, then stop and start Ungit. Invalid or abbreviated overrides fail closed. Remove the override and stop/start again to resume tracking remote `main`.

The fork's selected commit must be a complete runnable package containing its current prebuilt browser assets.

## Install from this checkout

```sh
cd /workspace/.pi/extensions
bun add file:/workspace/piclaw/addons/ungit
```

Restart Piclaw after installation.

## Configuration

Open **Settings → Ungit** to configure:

- **Use the same-origin proxy** — enabled by default; embeds `/ungit/` while forwarding HTTP requests to `127.0.0.1:8448`
- **Direct Ungit URL** — used only when the same-origin proxy is disabled
- **Workspace root** — the workspace path visible to Ungit, defaults to `/workspace`
- **Default zoom** — initial iframe zoom for each Ungit tab, defaults to `60%`; the per-tab picker can override it
- **Hide the Ungit header** — enabled by default for embedded tabs

Settings shows **Live** when its one-time health check succeeds and provides a single **Start Ungit**/**Stop Ungit** button. Stopping finds the matching loopback Ungit PIDs and sends `SIGTERM`; the status is checked once after each action, with no continuous polling.

Configuration is stored in Piclaw's extension KV store and applies without a restart. Open Ungit tabs reload after saving. The proxy target is deliberately fixed to loopback rather than using the configurable direct URL, so the route cannot become an arbitrary authenticated forward proxy. Piclaw authentication cookies and authorization headers are not forwarded to Ungit.

## URL and tab behavior

With the same-origin proxy enabled, a workspace folder such as `projects/demo` maps to:

```text
/ungit/?noheader=true#/repository?path=/workspace/projects/demo
```

The internal tab id is path-specific (`piclaw://ungit/<encoded-path>`), so each repository gets one reusable Piclaw tab.

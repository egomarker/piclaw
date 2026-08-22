# Piclaw Ungit-Go add-on

Adds a Git-branch action to every folder row in Piclaw's workspace explorer. The action opens that folder in an iframe-backed **Ungit-Go** tab and reuses the same tab when clicked again.

## Requirements

Ungit-Go itself needs Git 2.34 or newer. This add-on provisions an immutable Go module revision directly from GitHub, so the runtime also needs Go 1.22 or newer. Piclaw's container image includes the Go toolchain; host-native installs must provide it separately.

The Ungit-Go source includes its generated browser assets and has no external Go module dependencies. The launcher does not create a repository checkout: it provisions the selected module revision with `go install` on first use, stores the executable by full Git SHA, and then runs that executable directly.

## Automatic startup

At Piclaw startup, the add-on checks both the health endpoint and the embedded document identity at `127.0.0.1:8448`. If the matching Ungit-Go service is already live, it is left alone. A healthy legacy Node Ungit service is rejected with a clear stop-first error instead of being mistaken for Ungit-Go.

Otherwise the add-on resolves `egomarker/ungit-go`'s remote `main` branch to a full commit SHA and launches that immutable module revision:

```sh
sha=<full-commit-sha>
mkdir -p "/workspace/.piclaw/bin/ungit-go/$sha"
GOBIN="/workspace/.piclaw/bin/ungit-go/$sha" \
GOCACHE=/workspace/.piclaw/cache/ungit-go/build \
GOMODCACHE=/workspace/.piclaw/cache/ungit-go/modules \
CGO_ENABLED=0 \
  go install "github.com/egomarker/ungit-go/cmd/ungit-go@$sha"

"/workspace/.piclaw/bin/ungit-go/$sha/ungit-go" \
  --ungitBindIp=127.0.0.1 \
  --port=8448 \
  --rootPath=/ungit \
  --no-launchBrowser
```

The mutable branch name is never passed to Go. Resolution uses a bounded `git ls-remote` request. After launch, the add-on waits for the health endpoint, the Ungit-Go document marker, and required browser assets before recording the revision as last known good. Concurrent startup requests share one launch attempt.

The launcher runs from `/workspace/.piclaw`. Installed executables are kept under `/workspace/.piclaw/bin/ungit-go/<sha>` and the module/build caches under `/workspace/.piclaw/cache/ungit-go`. These immutable revision artifacts survive Piclaw and container restarts with the workspace. The add-on does not monitor or stop the process after startup verification; if it survives a Piclaw restart, the next startup check reuses it.

## Updates, fallback, and rollback

A healthy running process is deliberately reused. To load a newer revision, use **Settings → Ungit-Go → Stop Ungit-Go**, then **Start Ungit-Go**. The new start resolves the current remote `main` SHA.

The verified revision is written atomically to `ungit-go-launch-state.json` under `PICLAW_DATA` (default `/workspace/.piclaw/data`). The state includes the implementation and repository identity, so the old Node Ungit launch state cannot be reused accidentally.

If remote resolution fails, startup selects the last-known-good Go SHA. If a newly resolved revision launches but fails readiness, it is stopped and the last-known-good revision is tried once. Offline fallback uses the installed executable for that immutable SHA; if it has not been installed yet, provisioning still depends on the revision being available through Go's module cache or the network.

For an explicit rollback, set `PICLAW_UNGIT_GO_SHA` to a full 40-character commit SHA, then stop and start Ungit-Go. Invalid or abbreviated overrides fail closed. The legacy `PICLAW_UNGIT_SHA` variable is rejected to prevent a Node Ungit SHA from being applied to the Go repository.

## Process migration

Node Ungit and Ungit-Go use the same loopback port. Stop the legacy process before the first Go launch. The Settings stop action deliberately retains a broad process match during migration so it can terminate either implementation with `SIGTERM`.

Old Bun package caches and `ungit-launch-state.json` are not deleted automatically. They can be removed later after the Go service and rollback path have been verified.

## Same-origin proxy

Piclaw serves `/ungit/` through its authenticated origin, forwarding HTTP requests to `127.0.0.1:8448`; port `8448` does not need to be published from the container.

Ungit-Go's Socket.IO-compatible browser client uses same-origin EventSource/SSE plus HTTP POST requests. Piclaw forwards those streams and requests but continues to reject WebSocket upgrades. Piclaw authentication cookies and authorization headers are not forwarded to the loopback service, and the service cannot set cookies on Piclaw's origin.

The path configured as **Workspace root** must refer to Piclaw's workspace as visible to the Ungit-Go process. The default is `/workspace`.

## Install from this checkout

```sh
cd /workspace/.pi/extensions
bun add file:/workspace/piclaw/addons/ungit
```

Restart Piclaw after installation.

## Configuration

Open **Settings → Ungit-Go** to configure:

- **Use the same-origin proxy** — enabled by default; embeds `/ungit/`
- **Direct Ungit-Go URL** — used only when the proxy is disabled
- **Workspace root** — path visible to Ungit-Go, defaults to `/workspace`
- **Default zoom** — initial iframe zoom, defaults to `60%`; each tab can override it
- **Hide the Ungit-Go header** — enabled by default for embedded tabs

Configuration remains stored under the stable `ungit` add-on ID in Piclaw's extension KV store, so existing settings survive the runtime replacement. Open tabs reload when settings are saved.

## URL and tab behavior

With the same-origin proxy enabled, a workspace folder such as `projects/demo` maps to:

```text
/ungit/?noheader=true#/repository?path=/workspace/projects/demo
```

The internal tab ID remains path-specific (`piclaw://ungit/<encoded-path>`), preserving one reusable retained tab per repository.

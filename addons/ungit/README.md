# Piclaw Ungit add-on

Adds a small Git-branch action to every folder row in Piclaw's workspace explorer. The action opens that folder in an iframe-backed **Ungit** tab and reuses the same tab when clicked again.

## Requirements

- Ungit must already be running on Piclaw's loopback interface at `http://127.0.0.1:8448`.
- Start Ungit with `--rootPath=/ungit` so its assets, API calls, and Socket.IO endpoint remain under the add-on's same-origin proxy path.
- The path configured as **Workspace root** must refer to Piclaw's workspace from the Ungit process. The default is `/workspace`.

The add-on does not install or start Ungit. A suitable command is:

```sh
bunx --bun ungit \
  --ungitBindIp=127.0.0.1 \
  --port=8448 \
  --rootPath=/ungit \
  --no-launchBrowser
```

Piclaw serves the browser-facing `/ungit/` route through its authenticated origin, so port `8448` does not need to be published from the container. Ungit uses Socket.IO's HTTP-polling transport through this route; WebSocket upgrades are not proxied.

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
- **Hide the Ungit header** — enabled by default for embedded tabs

Configuration is stored in Piclaw's extension KV store and applies without a restart. Open Ungit tabs reload after saving. The proxy target is deliberately fixed to loopback rather than using the configurable direct URL, so the route cannot become an arbitrary authenticated forward proxy. Piclaw authentication cookies and authorization headers are not forwarded to Ungit.

## URL and tab behavior

With the same-origin proxy enabled, a workspace folder such as `projects/demo` maps to:

```text
/ungit/?noheader=true#/repository?path=/workspace/projects/demo
```

The internal tab id is path-specific (`piclaw://ungit/<encoded-path>`), so each repository gets one reusable Piclaw tab.

# Piclaw Ungit add-on

Adds a small Git-branch action to every folder row in Piclaw's workspace explorer. The action opens that folder in an iframe-backed **Ungit** tab and reuses the same tab when clicked again.

## Requirements

- Ungit must already be running and reachable **from the browser**. The default is `http://127.0.0.1:8448/`.
- The path configured as **Workspace root** must refer to Piclaw's workspace from the Ungit process. The default is `/workspace`.
- The browser must permit the Ungit page to be framed. Ungit does not set an `X-Frame-Options` header by default.

The add-on does not install or start Ungit.

## Install from this checkout

```sh
cd /workspace/.pi/extensions
bun add file:/workspace/piclaw/addons/ungit
```

Restart Piclaw after installation.

## Configuration

Open **Settings → Ungit** to configure:

- **Ungit URL** — defaults to `http://127.0.0.1:8448/`
- **Workspace root** — the workspace path visible to Ungit, defaults to `/workspace`
- **Hide the Ungit header** — enabled by default for embedded tabs

Configuration is stored in Piclaw's extension KV store and applies without a restart. Open Ungit tabs reload after saving.

## URL and tab behavior

A workspace folder such as `projects/demo` maps to:

```text
http://127.0.0.1:8448/?noheader=true#/repository?path=/workspace/projects/demo
```

The internal tab id is path-specific (`piclaw://ungit/<encoded-path>`), so each repository gets one reusable Piclaw tab.

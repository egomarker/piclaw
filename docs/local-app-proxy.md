# Local App Proxy

Piclaw can publish a trusted HTTP and WebSocket application listening inside the Piclaw environment at a protected path:

```text
http://127.0.0.1:4173/  →  https://piclaw.example/apps/demo/
```

When Piclaw web authentication is configured, every proxied request requires it. With authentication disabled, enabled mappings are reachable by anyone who can access Piclaw. Mutating requests still pass through Piclaw's CSRF Origin checks. The upstream host is fixed to `127.0.0.1`; Local App Proxy cannot forward to remote hosts or arbitrary TCP services.

## Configure an app

Open **Settings → Local Apps** and provide:

- a display name
- a unique lowercase slug
- the loopback HTTP port (`1024`–`65535`)
- an optional upstream base path (default `/`)
- an optional health path (default `/`)
- whether to forward WebSocket upgrades (default on)
- an optional cookie-name allowlist (default `[]`)

Persistent mappings are stored under `domains.localAppProxy.apps` in `.piclaw/config.json`. Agent-created mappings are temporary in-memory leases and disappear when Piclaw restarts. Removing a mapping never stops its application process.

The Settings form exposes both proxy controls. Cookie names may be separated with commas or whitespace; an empty allowlist forwards no cookies. Existing mappings without `webSocketEnabled` retain the previous behavior and default to WebSocket forwarding on. The settings API/config use `webSocketEnabled` and `cookieAllowlist`; agent lease creation uses `websocket_enabled` and `cookie_allowlist`.

Open `/apps/` to browse all enabled mappings, copy their public URLs, or launch them.

## Application contract

Apps must listen on `127.0.0.1` in the same container or machine as Piclaw. In a container, `127.0.0.1` means the Piclaw container—not the physical host.

Use relative URLs or configure the framework's base path:

```js
fetch('./api/status');

const endpoint = new URL('api/status', document.baseURI);
fetch(endpoint);
```

For a mapping named `demo`, configure framework public/base paths as `/apps/demo/` when relative URLs are not available.

Root-relative URLs bypass the mount and are unsupported:

```js
fetch('/api/status'); // wrong: reaches Piclaw, not the local app
```

Piclaw does not rewrite HTML, JavaScript, CSS, `Link` headers, or meta-refresh content.

## Forwarding behavior

HTTP forwarding supports methods `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS`. Request bodies are buffered up to 32 MiB before forwarding. Responses are streamed, so SSE, long polling, and downloads can remain open.

Piclaw supplies controlled forwarding metadata:

```text
X-Forwarded-Prefix: /apps/demo
X-Forwarded-Host: <public Piclaw host>
X-Forwarded-Proto: https
```

Same-upstream redirects are rewritten below the application mount. Redirects that escape a configured upstream base path are rejected.

## Security model

Path-based apps execute on Piclaw's browser origin. **Only publish code you trust.** A proxied app can call same-origin Piclaw APIs from the browser, and shares origin-wide browser state such as `localStorage`. When Piclaw authentication is disabled, enabled apps are also unauthenticated. Use a separate origin to isolate untrusted code.

Piclaw never forwards `Authorization`, `Origin`, `Referer`, client-supplied forwarding headers, or cookies by default. A mapping may opt in to specific application cookie names through its `cookieAllowlist`. The filter applies to inbound HTTP and WebSocket upgrade `Cookie` headers and outbound HTTP `Set-Cookie` headers. All other cookies are dropped, and `piclaw_session` is always blocked even if it appears in an allowlist.

Allowlisted `Set-Cookie` attributes are preserved. The upstream app should scope each cookie's `Path` to its public mount (for example `/apps/demo/`). Piclaw still drops CORS policy headers and origin-wide destructive response headers. HTTP Authorization remains unsupported.

Assets must be self-contained or compatible with Piclaw's Content Security Policy. A badly configured upstream can still expose its own files; the proxy cannot determine which upstream resources are intended to be public.

## WebSockets

WebSocket upgrades below an enabled application mount are forwarded to the corresponding loopback path when **Forward WebSockets** is on for that mapping. For example:

```text
wss://piclaw.example/apps/demo/ws?room=one
  → ws://127.0.0.1:4173/ws?room=one
```

The proxy preserves text and binary message boundaries, query strings, negotiated subprotocols, close codes and reasons, and Ping/Pong payloads. It applies bounded buffering and pauses the loopback connection when the browser is under backpressure. Individual messages are limited to 16 MiB.

Upgrade requests pass through Piclaw authentication and same-origin checks. `Authorization`, client-supplied forwarding headers, and WebSocket extensions are not forwarded. Only cookies named in the mapping's allowlist are forwarded; `piclaw_session` is unconditionally removed.

## Agent tool

The on-demand `local_app_proxy` tool lets an agent create a temporary mapping, list its chat-owned mappings, probe status, renew a lease, and remove it. Pass `websocket_enabled: false` during creation for an HTTP-only mapping. Pass `cookie_allowlist` to opt specific application cookies into HTTP and WebSocket forwarding. The tool does not start, kill, or supervise app processes. Default lease duration is two hours; the maximum is 24 hours.

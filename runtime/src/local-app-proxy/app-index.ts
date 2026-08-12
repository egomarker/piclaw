import { getRequestOriginParts } from "../channels/web/http/client.js";
import type { ResolvedLocalApp } from "./types.js";

type LocalAppIndexEntry = Pick<ResolvedLocalApp, "name" | "publicPath" | "enabled">;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function resolvePublicUrl(request: Request, publicPath: string): string {
  const requestUrl = new URL(request.url);
  const { proto, host } = getRequestOriginParts(request);
  try {
    return new URL(publicPath, `${proto}://${host}/`).toString();
  } catch {
    return new URL(publicPath, requestUrl.origin).toString();
  }
}

function renderAppCard(request: Request, app: LocalAppIndexEntry): string {
  const name = escapeHtml(app.name);
  const publicUrl = escapeHtml(resolvePublicUrl(request, app.publicPath));
  return `<article class="app-card">
    <div class="app-details">
      <h2>${name}</h2>
      <a class="app-url" href="${publicUrl}">${publicUrl}</a>
    </div>
    <div class="app-actions">
      <button type="button" data-copy-url="${publicUrl}">Copy URL</button>
      <a class="button primary" href="${publicUrl}">Go to</a>
    </div>
  </article>`;
}

export function localAppIndexResponse(request: Request, apps: LocalAppIndexEntry[]): Response {
  const available = apps.filter((app) => app.enabled);
  const content = available.length > 0
    ? `<div class="app-list">${available.map((app) => renderAppCard(request, app)).join("")}</div>`
    : `<div class="empty-state"><strong>No local apps available</strong><span>Enabled apps will appear here.</span></div>`;
  const countLabel = `${available.length} ${available.length === 1 ? "app" : "apps"}`;
  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>Local Apps · Piclaw</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0b0d12; color: #f5f7fb; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: radial-gradient(circle at 15% 0%, #17233a 0, transparent 34rem), #0b0d12; }
    main { width: min(880px, calc(100% - 32px)); margin: 0 auto; padding: 64px 0; }
    header { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
    h1 { margin: 0; font-size: clamp(2rem, 6vw, 3.4rem); letter-spacing: -0.055em; }
    .eyebrow { margin: 0 0 10px; color: #8ca3c7; font-size: .75rem; font-weight: 750; letter-spacing: .14em; text-transform: uppercase; }
    .count { flex: none; padding: 7px 11px; border: 1px solid #2b3443; border-radius: 999px; color: #b8c4d8; background: #121722; font-size: .82rem; }
    .app-list { display: grid; gap: 12px; }
    .app-card { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 20px; border: 1px solid #252d3a; border-radius: 16px; background: rgba(19, 24, 34, .88); box-shadow: 0 14px 40px rgba(0, 0, 0, .16); }
    .app-details { min-width: 0; }
    h2 { margin: 0 0 7px; font-size: 1.05rem; }
    .app-url { display: block; overflow: hidden; color: #8eadd9; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .82rem; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
    .app-url:hover { color: #b9d2f5; text-decoration: underline; }
    .app-actions { display: flex; flex: none; gap: 8px; }
    button, .button { min-height: 38px; padding: 9px 14px; border: 1px solid #364154; border-radius: 9px; color: #e9eef7; background: #181f2b; font: inherit; font-size: .86rem; font-weight: 680; line-height: 18px; text-decoration: none; cursor: pointer; }
    button:hover, .button:hover { border-color: #56657e; background: #202a39; }
    .primary { border-color: #447bc4; background: #2867b7; color: white; }
    .primary:hover { border-color: #68a0e7; background: #3476ca; }
    .empty-state { display: grid; gap: 7px; padding: 54px 24px; border: 1px dashed #30394a; border-radius: 16px; color: #8f9db2; text-align: center; }
    .empty-state strong { color: #e6ebf3; }
    @media (max-width: 640px) {
      main { width: min(100% - 24px, 880px); padding: 36px 0; }
      header { align-items: start; }
      .app-card { align-items: stretch; flex-direction: column; gap: 18px; }
      .app-actions { width: 100%; }
      .app-actions > * { flex: 1; text-align: center; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div><p class="eyebrow">Piclaw</p><h1>Local Apps</h1></div>
      <span class="count">${countLabel}</span>
    </header>
    ${content}
  </main>
  <script>
    document.addEventListener("click", async (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("[data-copy-url]");
      if (!(button instanceof HTMLButtonElement)) return;
      const url = button.dataset.copyUrl;
      const originalLabel = button.textContent;
      try {
        await navigator.clipboard.writeText(url);
        button.textContent = "Copied";
        setTimeout(() => { button.textContent = originalLabel; }, 1400);
      } catch {
        window.prompt("Copy URL", url);
      }
    });
  </script>
</body>
</html>`;

  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers: {
      "cache-control": "private, no-store",
      "content-type": "text/html; charset=utf-8",
    },
  });
}

/**
 * image-viewer-route.ts — Lightweight authenticated image viewer route.
 *
 * Serves a same-origin zoomable image viewer that loads workspace images via
 * /workspace/raw.
 */

import { registerExtensionRoute } from "./extension-routes.js";

const ROUTE_PREFIX = "/image-viewer";
const VIEWER_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function generateImageViewerPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Image Viewer</title>
<style>
  * { box-sizing: border-box; }
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
    background: #1e1e1e;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .stage {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-image:
      linear-gradient(45deg, rgba(128,128,128,0.08) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(128,128,128,0.08) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(128,128,128,0.08) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(128,128,128,0.08) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0;
  }
  .inner {
    min-width: 100%; min-height: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
  }
  img {
    max-width: none; max-height: none;
    transform-origin: center center;
    border-radius: 2px;
    background: white;
  }
  /* Hover toolbar — top-right */
  #toolbar-trigger { position: fixed; top: 0; right: 0; width: 140px; height: 24px; z-index: 99; }
  #toolbar {
    position: fixed; top: 0; right: 0; z-index: 100;
    display: flex; gap: 4px; padding: 6px 8px;
    background: rgba(30,30,30,0.92); border-bottom-left-radius: 6px;
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    opacity: 0; transition: opacity 0.2s;
  }
  #toolbar-trigger:hover + #toolbar, #toolbar:hover { opacity: 1; }
  #toolbar button {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 28px; height: 24px; padding: 0 6px;
    border: none; border-radius: 3px; background: rgba(255,255,255,0.08);
    color: #ccc; font: 12px system-ui, sans-serif; cursor: pointer;
  }
  #toolbar button:hover { background: rgba(255,255,255,0.15); color: #fff; }
  #toolbar .zoom-label { font-size: 11px; color: #999; min-width: 36px; text-align: center; line-height: 24px; }
  .empty {
    display: flex; width: 100%; height: 100%;
    align-items: center; justify-content: center;
    color: #888; font-size: 14px; padding: 24px; text-align: center;
  }
</style>
</head>
<body>
<div id="toolbar-trigger"></div>
<div id="toolbar">
  <button id="zoomOut">−</button>
  <span class="zoom-label" id="zoomLabel">100%</span>
  <button id="zoomIn">+</button>
  <button id="zoomReset">1:1</button>
</div>
<div id="stage" class="stage"><div class="inner"></div></div>
<script>
(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  var path = params.get('path') || '';
  var stageEl = document.getElementById('stage');

  if (!path) {
    document.body.innerHTML = '<div class="empty">Missing <code>?path=...</code> query parameter.</div>';
    return;
  }

  var fileName = path.split('/').pop() || 'image';
  document.title = fileName + ' · Image Viewer';

  var rawUrl = '/workspace/raw?path=' + encodeURIComponent(path);
  var scale = 1;
  var img = document.createElement('img');
  img.alt = fileName;
  img.src = rawUrl;

  var zoomLabel = document.getElementById('zoomLabel');
  function applyScale() {
    img.style.transform = 'scale(' + scale + ')';
    zoomLabel.textContent = Math.round(scale * 100) + '%';
  }
  function clamp(v) { return Math.max(0.1, Math.min(8, v)); }

  document.getElementById('zoomOut').addEventListener('click', function () { scale = clamp(scale / 1.25); applyScale(); });
  document.getElementById('zoomIn').addEventListener('click', function () { scale = clamp(scale * 1.25); applyScale(); });
  document.getElementById('zoomReset').addEventListener('click', function () { scale = 1; applyScale(); });
  stageEl.addEventListener('wheel', function (e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    scale = clamp(scale * (e.deltaY < 0 ? 1.08 : 1 / 1.08));
    applyScale();
  }, { passive: false });

  img.addEventListener('error', function () {
    stageEl.innerHTML = '<div class="inner"><div class="empty">Failed to load image.</div></div>';
  });

  var inner = stageEl.querySelector('.inner');
  inner.appendChild(img);
  applyScale();
})();
</script>
</body>
</html>`;
}

function handleImageViewerRoute(req: Request, pathname: string): Response | null {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const relative = pathname.replace(/^\/image-viewer\/?/, "");
  if (relative && !relative.startsWith("?")) {
    return new Response("Not Found", { status: 404 });
  }

  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache",
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": VIEWER_CSP,
  };

  if (req.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }

  return new Response(generateImageViewerPage(), { status: 200, headers });
}

registerExtensionRoute(ROUTE_PREFIX, handleImageViewerRoute, import.meta.dir);

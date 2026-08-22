/**
 * pdf-viewer-route.ts — Authenticated, same-origin PDF viewer route.
 *
 * Desktop browsers retain their native PDF <object>. Mobile browsers and
 * touch-first installed PWAs lazy-load the separately bundled PDF.js viewer.
 */

import { registerExtensionRoute } from "./extension-routes.js";
import { MediaService } from "../media/media-service.js";

const ROUTE_PREFIX = "/pdf-viewer";
const mediaService = new MediaService();

const VIEWER_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'self' blob:",
  "frame-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export function generatePdfViewerPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>PDF Viewer</title>
<style>
  * { box-sizing: border-box; }
  :root {
    color-scheme: dark;
    --pdf-toolbar-bg: #17191d;
    --pdf-toolbar-border: #34383f;
    --pdf-toolbar-text: #f3f4f6;
    --pdf-button-bg: #292d34;
    --pdf-button-active: #1769aa;
    --pdf-stage-bg: #25282d;
  }
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
    background: var(--pdf-stage-bg);
    color: var(--pdf-toolbar-text);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  object {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
    background: #1e1e1e;
  }
  .empty,
  .fallback {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
  }
  .empty { color: #aaa; font-size: 14px; }
  .fallback-card { max-width: 420px; }
  .fallback-card p { line-height: 1.5; }
  .fallback-card a,
  .fallback-card button {
    color: #b9dcff;
  }
  .fallback-card button {
    min-height: 42px;
    margin: 6px;
    padding: 8px 16px;
    border: 1px solid #59616d;
    border-radius: 8px;
    background: #292d34;
    font: inherit;
  }
  .pdfjs-mobile-shell {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    background: var(--pdf-stage-bg);
  }
  .pdfjs-mobile-toolbar {
    position: relative;
    z-index: 5;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 6px;
    min-height: 50px;
    padding: max(5px, env(safe-area-inset-top)) max(7px, env(safe-area-inset-right)) 5px max(7px, env(safe-area-inset-left));
    overflow-x: auto;
    border-bottom: 1px solid var(--pdf-toolbar-border);
    background: var(--pdf-toolbar-bg);
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .pdfjs-mobile-toolbar::-webkit-scrollbar { display: none; }
  .pdfjs-mobile-title {
    min-width: 80px;
    max-width: min(30vw, 240px);
    overflow: hidden;
    color: #d7dbe1;
    font-size: 13px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pdfjs-mobile-page,
  .pdfjs-mobile-zoom {
    flex: 0 0 auto;
    min-width: 48px;
    color: #d7dbe1;
    font-variant-numeric: tabular-nums;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
  }
  .pdfjs-mobile-toolbar button,
  .pdfjs-mobile-download {
    display: inline-flex;
    flex: 0 0 auto;
    width: 40px;
    min-width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid #444a54;
    border-radius: 8px;
    background: var(--pdf-button-bg);
    color: var(--pdf-toolbar-text);
    font: 600 18px/1 system-ui, sans-serif;
    text-decoration: none;
    touch-action: manipulation;
  }
  .pdfjs-mobile-toolbar button[data-pdf-action="fit-width"] {
    width: 44px;
    min-width: 44px;
    font-size: 12px;
  }
  .pdfjs-mobile-toolbar button.is-active {
    border-color: #4ea8ef;
    background: var(--pdf-button-active);
  }
  .pdfjs-mobile-toolbar button:focus-visible,
  .pdfjs-mobile-download:focus-visible {
    outline: 2px solid #70bdff;
    outline-offset: 1px;
  }
  .pdfjs-mobile-stage {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
  }
  .pdfjs-mobile-container {
    position: absolute;
    inset: 0;
    overflow: auto;
    background: var(--pdf-stage-bg);
    outline: none;
    overscroll-behavior: contain;
    touch-action: pan-x pan-y;
    -webkit-overflow-scrolling: touch;
  }
  .pdfjs-mobile-container .pdfViewer {
    min-width: min-content;
    padding-top: 8px;
    padding-bottom: max(14px, env(safe-area-inset-bottom));
  }
  .pdfjs-mobile-container .pdfViewer .page {
    box-shadow: 0 2px 10px rgb(0 0 0 / 35%);
  }
  .pdfjs-mobile-state {
    position: absolute;
    z-index: 4;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    background: var(--pdf-stage-bg);
    color: #d7dbe1;
    text-align: center;
  }
  .pdfjs-mobile-state.is-hidden {
    visibility: hidden;
    pointer-events: none;
  }
  .pdfjs-mobile-state.is-error { background: #25282d; }
  .pdfjs-mobile-state [data-pdf-state-detail] {
    max-width: 520px;
    color: #aeb4bd;
    font-size: 13px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
  .pdfjs-mobile-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #555d68;
    border-top-color: #70bdff;
    border-radius: 50%;
    animation: pdfjs-mobile-spin .8s linear infinite;
  }
  .pdfjs-mobile-progress {
    width: min(260px, 70vw);
    height: 4px;
    overflow: hidden;
    border-radius: 4px;
    background: #414750;
  }
  .pdfjs-mobile-progress span {
    display: block;
    width: 0;
    height: 100%;
    background: #4ea8ef;
    transition: width .12s linear;
  }
  .pdfjs-mobile-state-actions button,
  .pdfjs-mobile-state-actions a {
    display: inline-flex;
    min-height: 42px;
    align-items: center;
    margin: 4px;
    padding: 8px 14px;
    border: 1px solid #59616d;
    border-radius: 8px;
    background: #292d34;
    color: #b9dcff;
    font: 600 14px system-ui, sans-serif;
    text-decoration: none;
  }
  @keyframes pdfjs-mobile-spin { to { transform: rotate(360deg); } }
  @media (max-width: 520px) {
    .pdfjs-mobile-title { display: none; }
    .pdfjs-mobile-page { margin-right: auto; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pdfjs-mobile-spinner { animation-duration: 1.8s; }
    .pdfjs-mobile-progress span { transition: none; }
  }
</style>
</head>
<body>
<script>
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var hashParams = new URLSearchParams((location.hash || '').replace(/^#/, ''));

  function getFlexibleParam(name) {
    var direct = params.get(name);
    if (direct) return direct;
    for (var it = params.entries(), next = it.next(); !next.done; next = it.next()) {
      var key = String(next.value[0] || '');
      var normalized = key.replace(/^amp;/i, '');
      if (normalized === name) return String(next.value[1] || '');
    }
    return '';
  }

  function firstNonEmpty(parts) {
    for (var i = 0; i < parts.length; i++) {
      if (parts[i]) return parts[i];
    }
    return '';
  }

  function shouldUsePdfJs() {
    var override = getFlexibleParam('renderer').toLowerCase();
    if (override === 'pdfjs') return true;
    if (override === 'native') return false;

    var ua = navigator.userAgent || '';
    var mobileUa = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    var ipad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var userAgentDataMobile = !!(navigator.userAgentData && navigator.userAgentData.mobile);
    var standalone = !!(
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      navigator.standalone === true
    );
    var coarsePointer = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    return mobileUa || ipad || userAgentDataMobile || (standalone && coarsePointer);
  }

  function installCollectionUpsertCompatibility(Collection) {
    var prototype = Collection.prototype;
    var nativeHas = prototype.has;
    var nativeGet = prototype.get;
    var nativeSet = prototype.set;
    var probeKey = Collection === WeakMap ? {} : '__piclaw_pdfjs_probe__';

    function methodWorks(name, computed) {
      if (typeof prototype[name] !== 'function') return false;
      try {
        var probe = new Collection();
        var marker = {};
        var value = computed
          ? prototype[name].call(probe, probeKey, function () { return marker; })
          : prototype[name].call(probe, probeKey, marker);
        return value === marker && nativeGet.call(probe, probeKey) === marker;
      } catch (error) {
        console.warn('[pdf-viewer] Replacing broken ' + name + ' implementation.', error);
        return false;
      }
    }

    if (!methodWorks('getOrInsertComputed', true)) {
      Object.defineProperty(prototype, 'getOrInsertComputed', {
        configurable: true,
        writable: true,
        value: function (key, callbackfn) {
          var hasKey = nativeHas.call(this, key);
          if (typeof callbackfn !== 'function') throw new TypeError('callbackfn must be callable');
          if (hasKey) return nativeGet.call(this, key);
          var value = callbackfn(key);
          nativeSet.call(this, key, value);
          return value;
        },
      });
    }

    if (!methodWorks('getOrInsert', false)) {
      Object.defineProperty(prototype, 'getOrInsert', {
        configurable: true,
        writable: true,
        value: function (key, value) {
          if (nativeHas.call(this, key)) return nativeGet.call(this, key);
          nativeSet.call(this, key, value);
          return value;
        },
      });
    }
  }

  function installPdfJsCompatibility() {
    installCollectionUpsertCompatibility(Map);
    installCollectionUpsertCompatibility(WeakMap);
  }

  function shouldUseFakeWorker() {
    var override = getFlexibleParam('worker').toLowerCase();
    if (override === 'fake') return true;
    if (override === 'real') return false;
    return /Android/i.test(navigator.userAgent || '') && typeof globalThis.Iterator !== 'function';
  }

  function loadStylesheet(url) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = function () { resolve(); };
      link.onerror = function () { reject(new Error('Unable to load PDF viewer styles.')); };
      document.head.appendChild(link);
    });
  }

  function showFallback(message, sourceUrl, allowRetry) {
    document.body.replaceChildren();
    var wrapper = document.createElement('div');
    wrapper.className = 'fallback';
    var card = document.createElement('div');
    card.className = 'fallback-card';
    var text = document.createElement('p');
    text.textContent = message;
    card.appendChild(text);
    if (allowRetry) {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Retry';
      retry.addEventListener('click', function () { location.reload(); });
      card.appendChild(retry);
    }
    var download = document.createElement('a');
    download.href = sourceUrl;
    download.download = '';
    download.textContent = 'Download PDF';
    card.appendChild(download);
    wrapper.appendChild(card);
    document.body.appendChild(wrapper);
  }

  var path = firstNonEmpty([
    getFlexibleParam('path'),
    hashParams.get('path') || '',
  ]);
  var media = firstNonEmpty([
    getFlexibleParam('media'),
    hashParams.get('media') || '',
  ]);
  var explicitName = firstNonEmpty([
    getFlexibleParam('name'),
    hashParams.get('name') || '',
  ]);

  var sourceUrl = '';
  if (path) {
    sourceUrl = '/workspace/raw?path=' + encodeURIComponent(path);
  } else if (/^\\d+$/.test(media) && Number(media) > 0) {
    sourceUrl = '/pdf-viewer/source?media=' + encodeURIComponent(media);
  }

  if (!sourceUrl) {
    var empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Missing ?path=… or ?media=… query parameter.';
    document.body.appendChild(empty);
    return;
  }

  var inferredName = path ? (path.split('/').pop() || 'document.pdf') : ('attachment-' + media + '.pdf');
  var name = explicitName || inferredName;

  if (!shouldUsePdfJs()) {
    document.body.dataset.pdfRenderer = 'native';
    var objectEl = document.createElement('object');
    objectEl.data = sourceUrl;
    objectEl.type = 'application/pdf';
    objectEl.setAttribute('aria-label', name);
    var fallback = document.createElement('div');
    fallback.className = 'fallback';
    var fallbackCard = document.createElement('div');
    fallbackCard.className = 'fallback-card';
    var fallbackText = document.createElement('p');
    fallbackText.textContent = 'PDF preview is unavailable in this browser context.';
    var fallbackLink = document.createElement('a');
    fallbackLink.href = sourceUrl;
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener noreferrer';
    fallbackLink.textContent = 'Open PDF in a new tab';
    fallbackCard.append(fallbackText, fallbackLink);
    fallback.appendChild(fallbackCard);
    objectEl.appendChild(fallback);
    document.body.appendChild(objectEl);
    return;
  }

  document.body.dataset.pdfRenderer = 'pdfjs-loading';
  var forceFakeWorker = shouldUseFakeWorker();
  try {
    installPdfJsCompatibility();
  } catch (error) {
    showFallback('This browser could not initialize PDF compatibility support.', sourceUrl, true);
    return;
  }
  Promise.all([
    loadStylesheet('/static/common/pdfjs/pdf_viewer.css?v=6.2.108-piclaw3'),
    import('/static/common/dist/pdf-viewer-mobile.bundle.js?v=6.2.108-piclaw3'),
  ]).then(function (loaded) {
    var viewerModule = loaded[1];
    if (!viewerModule || typeof viewerModule.mountMobilePdfViewer !== 'function') {
      throw new Error('The mobile PDF viewer module is invalid.');
    }
    return viewerModule.mountMobilePdfViewer({
      sourceUrl: sourceUrl,
      name: name,
      forceFakeWorker: forceFakeWorker,
    });
  }).catch(function (error) {
    var detail = error && error.message ? error.message : 'The mobile PDF viewer could not start.';
    showFallback(detail, sourceUrl, true);
  });
})();
</script>
</body>
</html>`;
}

function parsePositiveInt(value: string | null): number | null {
  if (!value) return null;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function handlePdfMediaSource(req: Request): Response {
  const url = new URL(req.url);
  const mediaId = parsePositiveInt(url.searchParams.get("media"));
  if (!mediaId) {
    return new Response("Missing or invalid media id", { status: 400 });
  }

  const result = mediaService.getMedia(mediaId, false);
  if (result.status !== 200) {
    return new Response("Not Found", { status: 404 });
  }

  const contentType = (result.contentType || "").toLowerCase();
  if (contentType !== "application/pdf") {
    return new Response("Unsupported Media Type", { status: 415 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Content-Disposition": "inline",
    "Cache-Control": "no-cache",
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": VIEWER_CSP,
  };

  if (req.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }

  return new Response(result.body, { status: 200, headers });
}

export function handlePdfViewerRoute(req: Request, pathname: string): Response | null {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const relative = pathname.replace(/^\/pdf-viewer\/?/, "");

  if (relative === "source") {
    return handlePdfMediaSource(req);
  }

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

  return new Response(generatePdfViewerPage(), { status: 200, headers });
}

registerExtensionRoute(ROUTE_PREFIX, handlePdfViewerRoute, import.meta.dir);

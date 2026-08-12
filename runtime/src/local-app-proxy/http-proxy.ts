import { getRequestOriginParts } from "../channels/web/http/client.js";
import { createLogger } from "../utils/logger.js";
import {
  LOCAL_APP_PUBLIC_ROOT,
  MAX_PROXY_REQUEST_BODY_BYTES,
  LocalAppProxyError,
  type ResolvedLocalApp,
} from "./types.js";
import { buildLocalAppUpstreamUrl } from "./urls.js";

const log = createLogger("local-app-proxy.http");
const UPSTREAM_HEADER_TIMEOUT_MS = 10_000;
const FORWARD_METHODS = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);

const HOP_BY_HOP_HEADERS = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

const REQUEST_BLOCKED_HEADERS = [
  "accept-encoding",
  "authorization",
  "content-length",
  "cookie",
  "forwarded",
  "host",
  "origin",
  "referer",
];

const RESPONSE_BLOCKED_HEADERS = [
  "access-control-allow-credentials",
  "access-control-allow-headers",
  "access-control-allow-methods",
  "access-control-allow-origin",
  "access-control-expose-headers",
  "access-control-max-age",
  "alt-svc",
  "clear-site-data",
  "content-security-policy",
  "content-security-policy-report-only",
  "permissions-policy",
  "proxy-authenticate",
  "referrer-policy",
  "report-to",
  "set-cookie",
  "set-cookie2",
  "www-authenticate",
  "x-frame-options",
];

export type LocalAppProxyFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

function removeConnectionNamedHeaders(headers: Headers): void {
  const connection = headers.get("connection");
  if (connection) {
    for (const name of connection.split(",")) headers.delete(name.trim());
  }
  for (const name of HOP_BY_HOP_HEADERS) headers.delete(name);
}

function removeHeadersByPrefix(headers: Headers, prefixes: string[]): void {
  for (const name of [...headers.keys()]) {
    if (prefixes.some((prefix) => name.toLowerCase().startsWith(prefix))) headers.delete(name);
  }
}

export function buildLocalAppUpstreamHeaders(request: Request, app: ResolvedLocalApp): Headers {
  const headers = new Headers(request.headers);
  removeConnectionNamedHeaders(headers);
  for (const name of REQUEST_BLOCKED_HEADERS) headers.delete(name);
  removeHeadersByPrefix(headers, ["proxy-", "sec-websocket-", "x-forwarded-"]);

  const { proto, host } = getRequestOriginParts(request);
  headers.set("x-forwarded-prefix", `${LOCAL_APP_PUBLIC_ROOT}/${app.slug}`);
  if (host) headers.set("x-forwarded-host", host);
  if (proto) headers.set("x-forwarded-proto", proto);
  return headers;
}

export function buildLocalAppDownstreamHeaders(headersLike: Headers, app: ResolvedLocalApp): Headers {
  const headers = new Headers(headersLike);
  removeConnectionNamedHeaders(headers);
  for (const name of RESPONSE_BLOCKED_HEADERS) headers.delete(name);
  removeHeadersByPrefix(headers, ["access-control-"]);

  // Bun fetch may transparently decode an upstream body while retaining stale
  // encoding metadata. Browsers would otherwise attempt to decode it twice.
  if (headers.has("content-encoding")) {
    headers.delete("content-encoding");
    headers.delete("content-length");
  }
  headers.set("cache-control", "private, no-store");
  headers.set("service-worker-allowed", `${LOCAL_APP_PUBLIC_ROOT}/${app.slug}/`);
  return headers;
}

async function readRequestBodyWithLimit(request: Request, maxBytes: number): Promise<Uint8Array | undefined> {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || !request.body) return undefined;

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new LocalAppProxyError("body_too_large", `Request body exceeds the ${Math.floor(maxBytes / (1024 * 1024))} MiB proxy limit.`, 413);
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel("request body too large").catch(() => undefined);
      throw new LocalAppProxyError("body_too_large", `Request body exceeds the ${Math.floor(maxBytes / (1024 * 1024))} MiB proxy limit.`, 413);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function isLoopbackHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return normalized === "localhost"
    || normalized === "::1"
    || normalized === "0.0.0.0"
    || normalized.startsWith("127.");
}

function effectivePort(url: URL): string {
  return url.port || (url.protocol === "https:" ? "443" : url.protocol === "http:" ? "80" : "");
}

function isSameLoopbackEndpoint(left: URL, right: URL): boolean {
  return left.protocol === right.protocol
    && effectivePort(left) === effectivePort(right)
    && isLoopbackHostname(left.hostname)
    && isLoopbackHostname(right.hostname);
}

export function rewriteLocalAppLocation(
  headers: Headers,
  upstreamRequestUrl: URL,
  app: ResolvedLocalApp,
): void {
  const location = headers.get("location");
  if (!location) return;

  let resolved: URL;
  try {
    resolved = new URL(location, upstreamRequestUrl);
  } catch {
    throw new LocalAppProxyError("invalid_redirect", "The local app returned an invalid redirect.", 502);
  }

  if (resolved.origin !== upstreamRequestUrl.origin && !isSameLoopbackEndpoint(resolved, upstreamRequestUrl)) {
    if (isLoopbackHostname(resolved.hostname)) {
      throw new LocalAppProxyError("unsafe_redirect", "The local app attempted to redirect to an exposed loopback URL.", 502);
    }
    return;
  }

  const baseRoot = app.upstreamBasePath === "/" ? "" : app.upstreamBasePath.replace(/\/$/, "");
  if (baseRoot && resolved.pathname !== baseRoot && !resolved.pathname.startsWith(`${baseRoot}/`)) {
    throw new LocalAppProxyError("redirect_escaped_base", "The local app redirect escaped its configured upstream base path.", 502);
  }

  let relativePath = baseRoot ? resolved.pathname.slice(baseRoot.length) : resolved.pathname;
  if (!relativePath || relativePath === "/") relativePath = "/";
  else if (!relativePath.startsWith("/")) relativePath = `/${relativePath}`;
  headers.set(
    "location",
    `${LOCAL_APP_PUBLIC_ROOT}/${app.slug}${relativePath}${resolved.search}${resolved.hash}`,
  );
}

interface UpstreamFetchHandle {
  response: Response;
  controller: AbortController;
  cleanup: () => void;
}

async function fetchUpstreamWithHeaderTimeout(
  target: URL,
  init: RequestInit,
  requestSignal: AbortSignal,
  fetchImpl: LocalAppProxyFetch,
): Promise<UpstreamFetchHandle> {
  const controller = new AbortController();
  let timedOut = false;
  const relayAbort = () => controller.abort(requestSignal.reason);
  if (requestSignal.aborted) relayAbort();
  else requestSignal.addEventListener("abort", relayAbort, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort("upstream header timeout");
  }, UPSTREAM_HEADER_TIMEOUT_MS);
  const cleanup = () => {
    clearTimeout(timer);
    requestSignal.removeEventListener("abort", relayAbort);
  };

  try {
    const response = await fetchImpl(target, { ...init, signal: controller.signal });
    clearTimeout(timer);
    return { response, controller, cleanup };
  } catch (error) {
    cleanup();
    if (timedOut) throw new LocalAppProxyError("upstream_timeout", "The local app did not respond in time.", 504);
    throw error;
  }
}

function wrapUpstreamBody(handle: UpstreamFetchHandle): ReadableStream<Uint8Array> | null {
  if (!handle.response.body) {
    handle.cleanup();
    return null;
  }
  const reader = handle.response.body.getReader();
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    handle.cleanup();
  };
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await reader.read();
        if (done) {
          finish();
          controller.close();
          return;
        }
        controller.enqueue(value);
      } catch (error) {
        finish();
        controller.error(error);
      }
    },
    async cancel(reason) {
      handle.controller.abort(reason);
      finish();
      await reader.cancel(reason).catch(() => undefined);
    },
  });
}

function textResponse(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

function responseMayHaveBody(method: string, status: number): boolean {
  return method !== "HEAD" && status !== 204 && status !== 205 && status !== 304;
}

export function isLocalAppWebSocketRequest(request: Request): boolean {
  return request.headers.get("upgrade")?.toLowerCase() === "websocket";
}

export function localAppWebSocketUnsupportedResponse(): Response {
  return textResponse("WebSocket forwarding is not available in Local App Proxy V1.", 426);
}

export async function proxyLocalAppHttpRequest(
  request: Request,
  app: ResolvedLocalApp,
  suffix: string,
  options: {
    fetchImpl?: LocalAppProxyFetch;
    maxBodyBytes?: number;
  } = {},
): Promise<Response> {
  if (isLocalAppWebSocketRequest(request)) return localAppWebSocketUnsupportedResponse();

  const method = request.method.toUpperCase();
  if (!FORWARD_METHODS.has(method)) {
    return textResponse("Method not allowed.", 405);
  }

  try {
    const target = buildLocalAppUpstreamUrl(app, suffix, new URL(request.url).search);
    const body = await readRequestBodyWithLimit(
      request,
      options.maxBodyBytes ?? MAX_PROXY_REQUEST_BODY_BYTES,
    );
    const upstreamHeaders = buildLocalAppUpstreamHeaders(request, app);
    if (body) upstreamHeaders.set("content-length", String(body.byteLength));
    const handle = await fetchUpstreamWithHeaderTimeout(
      target,
      {
        method,
        headers: upstreamHeaders,
        body: body ? body.buffer as ArrayBuffer : undefined,
        redirect: "manual",
      },
      request.signal,
      options.fetchImpl ?? globalThis.fetch,
    );

    const headers = buildLocalAppDownstreamHeaders(handle.response.headers, app);
    try {
      rewriteLocalAppLocation(headers, target, app);
    } catch (error) {
      handle.controller.abort(error);
      handle.cleanup();
      await handle.response.body?.cancel(error).catch(() => undefined);
      throw error;
    }

    const bodyStream = responseMayHaveBody(method, handle.response.status)
      ? wrapUpstreamBody(handle)
      : null;
    if (!bodyStream) handle.cleanup();
    return new Response(bodyStream, {
      status: handle.response.status,
      statusText: handle.response.statusText,
      headers,
    });
  } catch (error) {
    if (error instanceof LocalAppProxyError) return textResponse(error.message, error.status);
    log.warn("Unable to reach local app upstream", {
      operation: "local_app_proxy.upstream_failure",
      slug: app.slug,
      port: app.port,
      err: error,
    });
    return textResponse("Unable to reach the local app.", 502);
  }
}

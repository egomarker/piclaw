export const UNGIT_PROXY_PATH = "/ungit";
export const UNGIT_PROXY_UPSTREAM = "http://127.0.0.1:8448";

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

export type UngitProxyFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type ExtensionRouteHandler = (request: Request, pathname: string) => Response | Promise<Response> | null;
type ExtensionRouteRegistrar = (
  prefix: string,
  handler: ExtensionRouteHandler,
  extensionPath?: string,
) => "created" | "updated" | "rejected";

export interface UngitProxyOptions {
  upstreamUrl?: string;
  fetchImpl?: UngitProxyFetch;
}

function removeHopByHopHeaders(headers: Headers): void {
  for (const name of HOP_BY_HOP_HEADERS) headers.delete(name);
}

function createUpstreamHeaders(request: Request): Headers {
  const headers = new Headers(request.headers);
  removeHopByHopHeaders(headers);
  headers.delete("accept-encoding");
  headers.delete("authorization");
  headers.delete("content-length");
  headers.delete("cookie");
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");
  return headers;
}

function createDownstreamHeaders(response: Response): Headers {
  const headers = new Headers(response.headers);
  removeHopByHopHeaders(headers);
  // Do not let the loopback service set cookies on Piclaw's authenticated origin.
  headers.delete("set-cookie");
  return headers;
}

function isProxyPath(pathname: string): boolean {
  return pathname === UNGIT_PROXY_PATH || pathname.startsWith(`${UNGIT_PROXY_PATH}/`);
}

function rewriteUpstreamLocation(
  headers: Headers,
  incomingUrl: URL,
  upstreamUrl: URL,
): void {
  const location = headers.get("location");
  if (!location) return;
  try {
    const resolved = new URL(location, upstreamUrl);
    if (resolved.origin !== upstreamUrl.origin) return;
    headers.set("location", `${incomingUrl.origin}${resolved.pathname}${resolved.search}${resolved.hash}`);
  } catch {
    // Preserve malformed or non-URL Location values exactly as Ungit returned them.
  }
}

export function createUngitProxyHandler(options: UngitProxyOptions = {}): ExtensionRouteHandler {
  const upstreamOrigin = new URL(options.upstreamUrl || UNGIT_PROXY_UPSTREAM);
  const fetchImpl = options.fetchImpl || globalThis.fetch;

  return async (request) => {
    const incomingUrl = new URL(request.url);
    if (!isProxyPath(incomingUrl.pathname)) return null;

    if (request.headers.get("upgrade")?.toLowerCase() === "websocket") {
      return new Response("Ungit WebSocket upgrades are not proxied; Socket.IO should continue over HTTP polling.", {
        status: 426,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const targetUrl = new URL(upstreamOrigin.href);
    targetUrl.pathname = incomingUrl.pathname;
    targetUrl.search = incomingUrl.search;
    targetUrl.hash = "";

    try {
      const method = request.method.toUpperCase();
      const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();
      const upstreamResponse = await fetchImpl(targetUrl, {
        method,
        headers: createUpstreamHeaders(request),
        body,
        redirect: "manual",
        signal: request.signal,
      });
      const headers = createDownstreamHeaders(upstreamResponse);
      rewriteUpstreamLocation(headers, incomingUrl, targetUrl);
      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers,
      });
    } catch (error) {
      console.warn("[ungit] same-origin proxy could not reach the loopback Ungit service", error);
      return new Response("Unable to reach Ungit on 127.0.0.1:8448.", {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }
  };
}

export function registerUngitProxyRoute(extensionPath: string): boolean {
  const registerRoute = (globalThis as Record<string, unknown>).__piclaw_registerRoute as ExtensionRouteRegistrar | undefined;
  if (typeof registerRoute !== "function") return false;
  return registerRoute(UNGIT_PROXY_PATH, createUngitProxyHandler(), extensionPath) !== "rejected";
}

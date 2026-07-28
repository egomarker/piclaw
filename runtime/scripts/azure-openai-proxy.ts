#!/usr/bin/env bun
/**
 * azure-openai-proxy.ts — Lightweight reverse proxy for Azure OpenAI.
 *
 * Listens on a configurable host:port, authenticates clients with a shared
 * secret (Bearer token), fetches/caches Azure managed-identity tokens from
 * IMDS, and proxies requests to the Azure OpenAI endpoint — including
 * streaming (SSE) responses.
 *
 * Environment variables:
 *   PROXY_BIND        – Bind address (default: 0.0.0.0)
 *   PROXY_PORT        – Listen port (default: 3100)
 *   PROXY_KEY         – Shared secret clients must send as Bearer token
 *   PROXY_TARGETS     – Comma-separated list of target base URLs to allow
 *                        (default: AOAI_BASE_URL + FOUNDRY_BASE_URL)
 *   AOAI_BASE_URL     – Azure OpenAI base URL (required)
 *   FOUNDRY_BASE_URL  – Azure Foundry base URL (optional)
 *   AOAI_RESOURCE     – AAD resource scope (default: https://cognitiveservices.azure.com/)
 *   FOUNDRY_SERVICES_BASE_URL – Azure AI Foundry services base URL for BFL/non-OpenAI models
 *                        (auto-derived from FOUNDRY_BASE_URL if not set)
 */

const BIND = process.env.PROXY_BIND || "0.0.0.0";
const PORT = Number(process.env.PROXY_PORT || "3100");
const PROXY_KEY = process.env.PROXY_KEY || "";
const AOAI_BASE_URL = process.env.AOAI_BASE_URL || "";
const FOUNDRY_BASE_URL = process.env.FOUNDRY_BASE_URL || "";
const RESOURCE = process.env.AOAI_RESOURCE || process.env.FOUNDRY_RESOURCE || "https://cognitiveservices.azure.com/";

// Derive the AI Foundry services base URL for non-OpenAI providers (BFL, etc.).
// The services endpoint uses .services.ai.azure.com without the /openai/v1 path.
function deriveServicesBaseUrl(foundryUrl: string): string {
  if (!foundryUrl) return "";
  try {
    const u = new URL(foundryUrl);
    // Strip /openai/v1 or /openai path suffix
    u.pathname = u.pathname.replace(/\/openai(\/v\d+)?\/?$/, "");
    // Rewrite known Azure hostnames to .services.ai.azure.com
    if (u.hostname.endsWith(".cognitiveservices.azure.com")) {
      u.hostname = u.hostname.replace(".cognitiveservices.azure.com", ".services.ai.azure.com");
    } else if (u.hostname.endsWith(".openai.azure.com")) {
      u.hostname = u.hostname.replace(".openai.azure.com", ".services.ai.azure.com");
    }
    return u.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}

const FOUNDRY_SERVICES_BASE_URL =
  (process.env.FOUNDRY_SERVICES_BASE_URL || "").trim().replace(/\/+$/, "") ||
  deriveServicesBaseUrl(FOUNDRY_BASE_URL);

// Allowed target base URLs — requests must target one of these.
const ALLOWED_TARGETS = (process.env.PROXY_TARGETS || [AOAI_BASE_URL, FOUNDRY_BASE_URL].filter(Boolean).join(","))
  .split(",")
  .map((u) => u.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// ── IMDS token cache ──────────────────────────────────────────────────
const IMDS_URL = "http://169.254.169.254/metadata/identity/oauth2/token";
const IMDS_API_VERSION = "2018-02-01";
const SKEW_SECONDS = 300;

interface TokenCache {
  accessToken: string;
  expiresOnEpoch: number;
}

type StreamingRequestInit = RequestInit & {
  duplex?: "half";
};

let tokenCache: TokenCache | null = null;

function isTokenValid(cache: TokenCache | null): cache is TokenCache {
  if (!cache?.accessToken) return false;
  return cache.expiresOnEpoch - Math.floor(Date.now() / 1000) > SKEW_SECONDS;
}

async function fetchToken(): Promise<TokenCache> {
  const url = `${IMDS_URL}?api-version=${IMDS_API_VERSION}&resource=${encodeURIComponent(RESOURCE)}`;
  const res = await fetch(url, { headers: { Metadata: "true" } });
  if (!res.ok) throw new Error(`IMDS ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { access_token?: string; expires_on?: string };
  if (!data.access_token) throw new Error("IMDS response missing access_token");
  let epoch = Number(data.expires_on || "");
  if (!Number.isFinite(epoch) || epoch <= 0) epoch = Math.floor(Date.now() / 1000) + 3300;
  return { accessToken: data.access_token, expiresOnEpoch: epoch };
}

async function getToken(): Promise<string> {
  if (isTokenValid(tokenCache)) return tokenCache.accessToken;
  tokenCache = await fetchToken();
  console.log(`[proxy] Token refreshed, expires in ${tokenCache.expiresOnEpoch - Math.floor(Date.now() / 1000)}s`);
  return tokenCache.accessToken;
}

// ── Request handling ──────────────────────────────────────────────────

function matchTarget(requestUrl: URL): { target: string; pathPrefix: string; stripV1?: boolean } | null {
  // Path-based routing:
  //   /v1/...          → first allowed target (AOAI)
  //   /foundry/v1/...  → second allowed target (Foundry OpenAI)
  //   /bfl/...         → Foundry services base (BFL/non-OpenAI providers, no /v1 strip)
  //   /t/<index>/v1/...→ target by index
  const path = requestUrl.pathname;

  // /t/<index>/... — explicit target by index
  const indexMatch = path.match(/^\/t\/(\d+)(\/.*)?$/);
  if (indexMatch) {
    const idx = parseInt(indexMatch[1], 10);
    if (idx >= 0 && idx < ALLOWED_TARGETS.length) {
      return { target: ALLOWED_TARGETS[idx], pathPrefix: `/t/${idx}` };
    }
    return null;
  }

  // /bfl/... — Black Forest Labs / AI Foundry services providers (no /v1 stripping)
  if (path.startsWith("/bfl/") || path === "/bfl") {
    if (FOUNDRY_SERVICES_BASE_URL) {
      return { target: FOUNDRY_SERVICES_BASE_URL, pathPrefix: "/bfl", stripV1: false };
    }
    return null;
  }

  // /foundry/... — shorthand for second target
  if (path.startsWith("/foundry/") || path === "/foundry") {
    if (ALLOWED_TARGETS.length > 1) {
      return { target: ALLOWED_TARGETS[1], pathPrefix: "/foundry" };
    }
    return null;
  }

  // Default: first target
  if (ALLOWED_TARGETS.length > 0) {
    return { target: ALLOWED_TARGETS[0], pathPrefix: "" };
  }
  return null;
}

const server = Bun.serve({
  hostname: BIND,
  port: PORT,
  // LLM streaming responses can have long pauses between chunks (reasoning,
  // tool execution, etc.). The default Bun idle timeout of 10 s is far too
  // short; set to Bun's maximum of 255 s so connections aren't killed mid-stream.
  idleTimeout: 255,

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Health check
    if (url.pathname === "/health") {
      return new Response("ok", { status: 200 });
    }

    // List targets (for diagnostics)
    if (url.pathname === "/targets") {
      const info = ALLOWED_TARGETS.map((t, i) => ({
        index: i,
        url: t,
        path: i === 0 ? "/v1/..." : i === 1 ? "/foundry/v1/..." : `/t/${i}/v1/...`,
      }));
      if (FOUNDRY_SERVICES_BASE_URL) {
        info.push({ index: -1, url: FOUNDRY_SERVICES_BASE_URL, path: "/bfl/..." });
      }
      return Response.json(info);
    }

    // Authenticate
    if (PROXY_KEY) {
      const auth = req.headers.get("authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      if (token !== PROXY_KEY) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    // Determine upstream target
    const routing = matchTarget(url);
    if (!routing) {
      return new Response("Bad target", { status: 400 });
    }

    // Build upstream URL: strip the routing prefix and /v1 (target already has /v1)
    let upstreamPath = url.pathname;
    if (routing.pathPrefix) {
      upstreamPath = upstreamPath.slice(routing.pathPrefix.length);
    }
    if (routing.stripV1 !== false && (upstreamPath.startsWith("/v1/") || upstreamPath === "/v1")) {
      upstreamPath = upstreamPath.slice(3); // "/v1/responses" → "/responses"
    }
    const upstreamUrl = `${routing.target}${upstreamPath}${url.search || ""}`;

    // Get MI token
    let miToken: string;
    try {
      miToken = await getToken();
    } catch (err) {
      console.error("[proxy] Token error:", err);
      return new Response("Token fetch failed", { status: 502 });
    }

    // Forward headers (drop hop-by-hop and auth, inject MI token)
    const fwdHeaders = new Headers();
    for (const [key, value] of req.headers.entries()) {
      const lower = key.toLowerCase();
      if (["host", "authorization", "connection", "transfer-encoding"].includes(lower)) continue;
      fwdHeaders.set(key, value);
    }
    fwdHeaders.set("Authorization", `Bearer ${miToken}`);

    // Forward request body
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    try {
      const upstreamInit: StreamingRequestInit = {
        method: req.method,
        headers: fwdHeaders,
        body: hasBody ? req.body : undefined,
        duplex: hasBody && req.body ? "half" : undefined,
      };
      const upstream = await fetch(upstreamUrl, upstreamInit);

      // Forward response headers
      const respHeaders = new Headers();
      for (const [key, value] of upstream.headers.entries()) {
        const lower = key.toLowerCase();
        if (["transfer-encoding", "connection"].includes(lower)) continue;
        respHeaders.set(key, value);
      }
      // Allow CORS from Tailscale
      respHeaders.set("Access-Control-Allow-Origin", "*");

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: respHeaders,
      });
    } catch (err) {
      console.error("[proxy] Upstream error:", err);
      return new Response("Upstream error", { status: 502 });
    }
  },
});

if (!PROXY_KEY) {
  console.warn("[proxy] WARNING: No PROXY_KEY set — proxy is unauthenticated!");
}
console.log(`[proxy] Azure OpenAI proxy listening on ${server.hostname}:${server.port}`);
console.log(`[proxy] Allowed targets: ${ALLOWED_TARGETS.join(", ")}`);
if (FOUNDRY_SERVICES_BASE_URL) {
  console.log(`[proxy] Foundry services (BFL) base: ${FOUNDRY_SERVICES_BASE_URL} → /bfl/...`);
}

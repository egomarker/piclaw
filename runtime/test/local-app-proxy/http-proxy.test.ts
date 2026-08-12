import { describe, expect, test } from "bun:test";
import {
  buildLocalAppDownstreamHeaders,
  buildLocalAppUpstreamHeaders,
  proxyLocalAppHttpRequest,
  rewriteLocalAppLocation,
} from "../../src/local-app-proxy/http-proxy.js";
import type { ResolvedLocalApp } from "../../src/local-app-proxy/types.js";

const app: ResolvedLocalApp = {
  id: "app-demo",
  name: "Demo",
  slug: "demo",
  port: 4173,
  upstreamBasePath: "/workbench/",
  healthPath: "/health",
  enabled: true,
  createdAt: "2026-08-12T12:00:00.000Z",
  updatedAt: "2026-08-12T12:00:00.000Z",
  kind: "persistent",
  publicPath: "/apps/demo/",
  upstreamOrigin: "http://127.0.0.1:4173",
};

describe("local app HTTP proxy", () => {
  test("strips credentials, spoofed forwarding headers, and origin policy response headers", () => {
    const request = new Request("https://piclaw.test/apps/demo/", {
      headers: {
        cookie: "piclaw_session=secret; app=also-secret",
        authorization: "Bearer secret",
        origin: "https://piclaw.test",
        referer: "https://piclaw.test/",
        "x-forwarded-host": "attacker.invalid",
        "proxy-authorization": "secret",
      },
    });
    const upstream = buildLocalAppUpstreamHeaders(request, app);
    expect(upstream.get("cookie")).toBeNull();
    expect(upstream.get("authorization")).toBeNull();
    expect(upstream.get("origin")).toBeNull();
    expect(upstream.get("referer")).toBeNull();
    expect(upstream.get("proxy-authorization")).toBeNull();
    expect(upstream.get("x-forwarded-prefix")).toBe("/apps/demo");
    expect(upstream.get("x-forwarded-host")).toBe("piclaw.test");
    expect(upstream.get("x-forwarded-proto")).toBe("https");

    const downstream = buildLocalAppDownstreamHeaders(new Headers({
      "set-cookie": "app=secret",
      "clear-site-data": '"*"',
      "access-control-allow-origin": "*",
      "content-security-policy": "default-src *",
      "service-worker-allowed": "/",
    }), app);
    expect(downstream.get("set-cookie")).toBeNull();
    expect(downstream.get("clear-site-data")).toBeNull();
    expect(downstream.get("access-control-allow-origin")).toBeNull();
    expect(downstream.get("content-security-policy")).toBeNull();
    expect(downstream.get("service-worker-allowed")).toBe("/apps/demo/");
  });

  test("rewrites same-port loopback aliases and blocks redirects escaping the configured base", () => {
    const headers = new Headers({ location: "http://localhost:4173/workbench/login?next=1" });
    rewriteLocalAppLocation(headers, new URL("http://127.0.0.1:4173/workbench/start"), app);
    expect(headers.get("location")).toBe("/apps/demo/login?next=1");

    expect(() => rewriteLocalAppLocation(
      new Headers({ location: "/admin" }),
      new URL("http://127.0.0.1:4173/workbench/start"),
      app,
    )).toThrow(/escaped/);
  });

  test("preserves path/query/body while filtering headers", async () => {
    let captured: { url?: string; init?: RequestInit } = {};
    const response = await proxyLocalAppHttpRequest(new Request("https://piclaw.test/apps/demo/api/items?q=one", {
      method: "POST",
      headers: {
        cookie: "piclaw_session=secret",
        "content-type": "application/json",
      },
      body: JSON.stringify({ hello: "world" }),
    }), app, "/api/items", {
      fetchImpl: async (input, init) => {
        captured = { url: String(input), init };
        return new Response("streamed", { status: 201, headers: { "content-type": "text/plain" } });
      },
    });

    expect(captured.url).toBe("http://127.0.0.1:4173/workbench/api/items?q=one");
    expect((captured.init?.headers as Headers).get("cookie")).toBeNull();
    expect((captured.init?.headers as Headers).get("content-length")).toBe("17");
    expect(new TextDecoder().decode(captured.init?.body as ArrayBuffer)).toBe('{"hello":"world"}');
    expect(response.status).toBe(201);
    expect(await response.text()).toBe("streamed");
  });

  test("rejects WebSocket upgrades and oversized bodies before contacting upstream", async () => {
    let calls = 0;
    const websocket = await proxyLocalAppHttpRequest(new Request("https://piclaw.test/apps/demo/", {
      headers: { upgrade: "websocket" },
    }), app, "/", { fetchImpl: async () => { calls += 1; return new Response(); } });
    expect(websocket.status).toBe(426);

    const tooLarge = await proxyLocalAppHttpRequest(new Request("https://piclaw.test/apps/demo/", {
      method: "POST",
      body: "12345",
    }), app, "/", { maxBodyBytes: 4, fetchImpl: async () => { calls += 1; return new Response(); } });
    expect(tooLarge.status).toBe(413);
    expect(calls).toBe(0);
  });
});

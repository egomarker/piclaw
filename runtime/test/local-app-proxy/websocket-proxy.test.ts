import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  LocalAppWebSocketProxy,
  type LocalAppSocketData,
} from "../../src/local-app-proxy/websocket-proxy.js";
import type { ResolvedLocalApp } from "../../src/local-app-proxy/types.js";

const servers: Bun.Server<any>[] = [];
const proxies: LocalAppWebSocketProxy[] = [];

async function waitFor(predicate: () => boolean, message: string): Promise<void> {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (predicate()) return;
    await Bun.sleep(5);
  }
  throw new Error(message);
}

afterEach(() => {
  for (const proxy of proxies.splice(0)) proxy.shutdown();
  for (const server of servers.splice(0)) server.stop(true);
});

function resolvedApp(port: number): ResolvedLocalApp {
  return {
    id: "app-demo",
    name: "Demo",
    slug: "demo",
    port,
    upstreamBasePath: "/base",
    healthPath: "/health",
    enabled: true,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    kind: "persistent",
    publicPath: "/apps/demo/",
    upstreamOrigin: `http://127.0.0.1:${port}`,
  };
}

describe("LocalAppWebSocketProxy", () => {
  test("relays paths, messages, ping payloads, protocols, and close details", async () => {
    const upstreamMessages: Array<string | Buffer> = [];
    const upstreamPongs: Buffer[] = [];
    let upstreamHeaders: Headers | null = null;

    const upstream = Bun.serve<{ fixture: true }>({
      hostname: "127.0.0.1",
      port: 0,
      fetch(request, server) {
        upstreamHeaders = new Headers(request.headers);
        const url = new URL(request.url);
        expect(`${url.pathname}${url.search}`).toBe("/base/ws?session=abc");
        if (!server.upgrade(request, {
          data: { fixture: true },
          headers: { "sec-websocket-protocol": "chat" },
        })) {
          return new Response("upgrade failed", { status: 400 });
        }
        return undefined;
      },
      websocket: {
        sendPings: false,
        open(ws) {
          ws.sendText("server-text");
          ws.sendBinary(Buffer.from([4, 5, 6]));
          ws.ping(Buffer.from("ping-payload"));
        },
        message(ws, message) {
          upstreamMessages.push(typeof message === "string" ? message : Buffer.from(message));
          if (message === "close-upstream") ws.close(4002, "fixture close");
        },
        pong(_ws, data) {
          upstreamPongs.push(Buffer.from(data));
        },
      },
    });
    servers.push(upstream);

    const app = resolvedApp(upstream.port);
    const proxy = new LocalAppWebSocketProxy();
    proxies.push(proxy);
    const request = new Request("http://piclaw.test/apps/demo/ws?session=abc", {
      headers: {
        authorization: "Bearer must-not-leak",
        connection: "Upgrade",
        cookie: "piclaw_session=must-not-leak",
        host: "piclaw.test",
        origin: "http://piclaw.test",
        "sec-websocket-key": "browser-key-is-replaced",
        "sec-websocket-protocol": "chat, other",
        "sec-websocket-version": "13",
        upgrade: "websocket",
        "x-forwarded-host": "spoofed.example",
      },
    });

    const prepared = await proxy.prepare(request, app, "/ws");
    expect(prepared).not.toBeInstanceOf(Response);
    if (prepared instanceof Response) throw new Error(await prepared.text());
    expect(new Headers(prepared.headers).get("sec-websocket-protocol")).toBe("chat");
    expect(upstreamHeaders?.get("authorization")).toBeNull();
    expect(upstreamHeaders?.get("cookie")).toBeNull();
    expect(upstreamHeaders?.get("x-forwarded-prefix")).toBe("/apps/demo");
    expect(upstreamHeaders?.get("x-forwarded-host")).toBe("piclaw.test");

    const browserText: string[] = [];
    const browserBinary: Buffer[] = [];
    const browserPings: Buffer[] = [];
    const browserCloses: Array<{ code: number; reason: string }> = [];
    let browser: any;
    browser = {
      data: prepared.data as LocalAppSocketData,
      sendText: mock((value: string) => {
        browserText.push(value);
        return 1;
      }),
      sendBinary: mock((value: Buffer) => {
        browserBinary.push(Buffer.from(value));
        return 1;
      }),
      ping: mock((value: Buffer) => {
        const payload = Buffer.from(value);
        browserPings.push(payload);
        proxy.handlePong(browser, payload);
        return 1;
      }),
      pong: mock(() => 1),
      close: mock((code: number, reason: string) => {
        browserCloses.push({ code, reason });
      }),
      terminate: mock(() => {}),
    };

    proxy.attachBrowser(browser);
    await waitFor(() => upstreamPongs.length === 1, "upstream did not receive proxied pong");
    expect(browserText).toEqual(["server-text"]);
    expect(browserBinary).toEqual([Buffer.from([4, 5, 6])]);
    expect(browserPings).toEqual([Buffer.from("ping-payload")]);
    expect(upstreamPongs).toEqual([Buffer.from("ping-payload")]);

    proxy.handleMessage(browser, "browser-text");
    proxy.handleMessage(browser, Buffer.from([1, 2, 3]));
    await waitFor(() => upstreamMessages.length === 2, "upstream did not receive browser messages");
    expect(upstreamMessages[0]).toBe("browser-text");
    expect(upstreamMessages[1]).toEqual(Buffer.from([1, 2, 3]));

    proxy.handleMessage(browser, "close-upstream");
    await waitFor(() => browserCloses.length === 1, "browser did not receive upstream close");
    expect(browserCloses).toEqual([{ code: 4002, reason: "fixture close" }]);
  });

  test("returns a bounded HTTP error when the upstream refuses its handshake", async () => {
    const upstream = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      fetch() {
        return new Response("no upgrade", { status: 403 });
      },
    });
    servers.push(upstream);
    const proxy = new LocalAppWebSocketProxy();
    proxies.push(proxy);

    const result = await proxy.prepare(
      new Request("http://piclaw.test/apps/demo/ws", {
        headers: { "sec-websocket-version": "13" },
      }),
      resolvedApp(upstream.port),
      "/ws",
    );

    expect(result).toBeInstanceOf(Response);
    if (!(result instanceof Response)) throw new Error("Expected handshake failure response");
    expect(result.status).toBe(502);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.text()).toContain("refused");
  });
});

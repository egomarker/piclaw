import { afterEach, expect, test } from "bun:test";

import {
  createUngitProxyHandler,
  UNGIT_PROXY_PATH,
} from "../../../addons/ungit/proxy.ts";
import { DEFAULT_UNGIT_CONFIG, normalizeUngitConfig } from "../../../addons/ungit/storage.ts";
import { importFresh } from "../helpers.js";
import {
  buildUngitTabPath,
  buildUngitUrl,
  DEFAULT_UNGIT_ZOOM_PERCENT,
  parseUngitTabPath,
  registerUngitAddon,
  resolveUngitRepositoryPath,
  resolveUngitZoomLayout,
  UNGIT_ZOOM_PERCENTAGES,
} from "../../../addons/ungit/web/index.ts";

afterEach(() => {
  delete (globalThis as Record<string, unknown>).__piclawRuntimeInterop;
  delete (globalThis as Record<string, unknown>).__piclaw_registerAddonConfigApi;
});

test("Ungit URLs select the repository path and hide the header by default", () => {
  expect(buildUngitUrl("projects/foo bar")).toBe(
    "/ungit/?noheader=true#/repository?path=/workspace/projects/foo%20bar",
  );
  expect(buildUngitUrl(".", {
    baseUrl: "https://git.example.test/ungit?theme=dark",
    workspaceRoot: "/srv/piclaw data",
    hideHeader: false,
    proxyEnabled: false,
  })).toBe(
    "https://git.example.test/ungit?theme=dark#/repository?path=/srv/piclaw%20data",
  );
});

test("Ungit iframe zoom uses fixed choices and starts each tab at 60 percent", () => {
  expect([...UNGIT_ZOOM_PERCENTAGES]).toEqual([30, 40, 50, 60, 70, 80, 90, 100]);
  expect(DEFAULT_UNGIT_ZOOM_PERCENT).toBe(60);

  const initial = resolveUngitZoomLayout();
  expect(initial.percent).toBe(60);
  expect(initial.scale).toBe(0.6);
  expect(initial.viewportPercent).toBeCloseTo(166.67, 2);

  expect(resolveUngitZoomLayout("80")).toEqual({
    percent: 80,
    scale: 0.8,
    viewportPercent: 125,
  });
  expect(resolveUngitZoomLayout(55).percent).toBe(60);
});

test("Ungit repository path mapping remains inside the configured workspace root", () => {
  expect(resolveUngitRepositoryPath(".", "/workspace/")).toBe("/workspace");
  expect(resolveUngitRepositoryPath("repos/demo", "/workspace/")).toBe("/workspace/repos/demo");
  expect(resolveUngitRepositoryPath("repos/demo", "C:\\workspace\\")).toBe("C:\\workspace\\repos\\demo");
  expect(() => resolveUngitRepositoryPath("../outside", "/workspace")).toThrow("escapes the workspace root");
});

test("Ungit tab paths round-trip and provide stable per-folder tab reuse keys", () => {
  const first = buildUngitTabPath("repos/foo bar");
  expect(first).toBe("piclaw://ungit/repos%2Ffoo%20bar");
  expect(parseUngitTabPath(first)).toBe("repos/foo bar");
  expect(buildUngitTabPath("repos/foo bar")).toBe(first);
  expect(buildUngitTabPath("repos/other")).not.toBe(first);
  expect(parseUngitTabPath("piclaw://terminal")).toBeNull();
});

test("Ungit registers a tab pane and directory row action without main-bundle imports", () => {
  const panes: any[] = [];
  const actions: any[] = [];
  const settings: any[] = [];
  const api = {
    registerPane(definition: any) {
      panes.push(definition);
      return true;
    },
    registerWorkspaceRowAction(definition: any) {
      actions.push(definition);
      return () => {};
    },
    registerSettingsPane(definition: any) {
      settings.push(definition);
      return () => {};
    },
  };

  expect(registerUngitAddon(api)).toBe(true);
  expect(panes.map((pane) => pane.id)).toEqual(["ungit"]);
  expect(actions.map((action) => action.id)).toEqual(["ungit.open-repository"]);
  expect(settings).toEqual([]); // Preact settings globals are intentionally absent in this unit test.
  expect(actions[0].canHandle({ type: "dir" })).toBe(true);
  expect(actions[0].canHandle({ type: "file" })).toBe(false);

  const opened: unknown[][] = [];
  actions[0].onActivate({
    path: "projects/demo",
    name: "demo",
    type: "dir",
    depth: 1,
    openTab: (...args: unknown[]) => opened.push(args),
  });
  expect(opened).toEqual([[
    "piclaw://ungit/projects%2Fdemo",
    { label: "Git: demo", paneOverrideId: "ungit" },
  ]]);
});

test("Ungit registers a direct backend config API backed by extension KV storage", async () => {
  const stored = new Map<string, unknown>();
  let registration: { addonId: string; action: string; handlers: any } | null = null;
  let routeRegistration: { prefix: string; handler: any; extensionPath: string } | null = null;
  const previousRegisterRoute = (globalThis as any).__piclaw_registerRoute;
  (globalThis as any).__piclawRuntimeInterop = {
    getExtensionKvStore: () => ({
      get: (_extensionId: string, key: string) => stored.get(key) ?? null,
      set: (_extensionId: string, key: string, value: unknown) => { stored.set(key, value); },
    }),
  };
  (globalThis as any).__piclaw_registerAddonConfigApi = (addonId: string, action: string, handlers: any) => {
    registration = { addonId, action, handlers };
    return "created";
  };
  (globalThis as any).__piclaw_registerRoute = (prefix: string, handler: any, extensionPath: string) => {
    routeRegistration = { prefix, handler, extensionPath };
    return "created";
  };

  try {
    await importFresh("../../../addons/ungit/index.ts", import.meta.url);
  } finally {
    if (previousRegisterRoute === undefined) delete (globalThis as any).__piclaw_registerRoute;
    else (globalThis as any).__piclaw_registerRoute = previousRegisterRoute;
  }
  expect(registration?.addonId).toBe("ungit");
  expect(registration?.action).toBe("config");
  expect(routeRegistration?.prefix).toBe(UNGIT_PROXY_PATH);
  expect(routeRegistration?.extensionPath).toEndWith("/addons/ungit");
  expect(await registration?.handlers.get()).toMatchObject(DEFAULT_UNGIT_CONFIG);

  const saved = await registration?.handlers.set({
    baseUrl: "https://git.example.test/",
    workspaceRoot: "/srv/workspace",
    hideHeader: false,
    proxyEnabled: false,
  });
  expect(saved).toMatchObject({
    baseUrl: "https://git.example.test/",
    workspaceRoot: "/srv/workspace",
    hideHeader: false,
    proxyEnabled: false,
    restartRequired: false,
  });
  expect(stored.get("config")).toMatchObject({ workspaceRoot: "/srv/workspace" });
});

test("Ungit backend config normalization rejects unsafe URLs and keeps embedding defaults", () => {
  expect(normalizeUngitConfig({
    baseUrl: "javascript:alert(1)",
    workspaceRoot: "",
    hideHeader: undefined,
  })).toEqual(DEFAULT_UNGIT_CONFIG);

  expect(normalizeUngitConfig({
    baseUrl: "https://git.example.test/ungit#old-route",
    workspaceRoot: "/srv/repos",
    hideHeader: false,
    proxyEnabled: false,
  })).toEqual({
    baseUrl: "https://git.example.test/ungit",
    workspaceRoot: "/srv/repos",
    hideHeader: false,
    proxyEnabled: false,
  });
});

test("Ungit same-origin proxy forwards HTTP without leaking Piclaw credentials", async () => {
  let forwardedUrl = "";
  let forwardedInit: RequestInit | undefined;
  const handler = createUngitProxyHandler({
    fetchImpl: async (input, init) => {
      forwardedUrl = String(input);
      forwardedInit = init;
      return new Response("pong", {
        status: 200,
        headers: {
          Location: "http://127.0.0.1:8448/ungit/next",
          "Set-Cookie": "ungit=test",
          "X-Ungit": "yes",
        },
      });
    },
  });
  const response = await handler(new Request("https://piclaw.example.test/ungit/api/ping?check=1", {
    method: "POST",
    headers: {
      Authorization: "Bearer piclaw-secret",
      Cookie: "piclaw-session=secret",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ping: true }),
  }), "/ungit/api/ping");

  expect(forwardedUrl).toBe("http://127.0.0.1:8448/ungit/api/ping?check=1");
  expect(forwardedInit?.method).toBe("POST");
  const forwardedHeaders = new Headers(forwardedInit?.headers);
  expect(forwardedHeaders.get("authorization")).toBeNull();
  expect(forwardedHeaders.get("cookie")).toBeNull();
  expect(forwardedHeaders.get("content-type")).toBe("application/json");
  expect(await new Response(forwardedInit?.body).json()).toEqual({ ping: true });
  expect(response?.status).toBe(200);
  expect(response?.headers.get("location")).toBe("/ungit/next");
  expect(response?.headers.get("set-cookie")).toBeNull();
  expect(response?.headers.get("x-ungit")).toBe("yes");
  expect(await response?.text()).toBe("pong");
});

test("Ungit same-origin proxy supplies the document headers required by Ungit", async () => {
  const handler = createUngitProxyHandler({
    fetchImpl: async () => new Response(
      new TextEncoder().encode("<!doctype html><title>ungit</title>"),
      { status: 200 },
    ),
  });

  const response = await handler(
    new Request("https://piclaw.example.test/ungit/?noheader=true"),
    "/ungit/",
  );

  expect(response?.headers.get("content-type")).toBe("text/html; charset=utf-8");
  expect(response?.headers.get("content-security-policy")).toContain(
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'",
  );
  expect(response?.headers.get("content-security-policy")).toContain("frame-ancestors 'self'");
  expect(await response?.text()).toContain("<title>ungit</title>");
});

test("Ungit same-origin proxy strips stale compression metadata from decoded bodies", async () => {
  const handler = createUngitProxyHandler({
    fetchImpl: async () => new Response("window.io = {};", {
      status: 200,
      headers: {
        "Content-Encoding": "gzip",
        "Content-Length": "8",
        "Content-Type": "application/javascript; charset=utf-8",
      },
    }),
  });

  const response = await handler(
    new Request("https://piclaw.example.test/ungit/socket.io/socket.io.js"),
    "/ungit/socket.io/socket.io.js",
  );

  expect(response?.headers.get("content-encoding")).toBeNull();
  expect(response?.headers.get("content-length")).toBeNull();
  expect(response?.headers.get("content-type")).toBe("application/javascript; charset=utf-8");
  expect(await response?.text()).toBe("window.io = {};");
});

test("Ungit same-origin proxy leaves unrelated paths alone and rejects WebSocket upgrades", async () => {
  const handler = createUngitProxyHandler({
    fetchImpl: async () => new Response("unexpected"),
  });
  expect(await handler(new Request("https://piclaw.example.test/other"), "/other")).toBeNull();

  const websocketResponse = await handler(new Request("https://piclaw.example.test/ungit/socket.io", {
    headers: { Upgrade: "websocket" },
  }), "/ungit/socket.io");
  expect(websocketResponse?.status).toBe(426);
  expect(await websocketResponse?.text()).toContain("HTTP polling");
});

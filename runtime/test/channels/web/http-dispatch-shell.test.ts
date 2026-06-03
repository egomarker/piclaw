import { describe, expect, test } from "bun:test";
import { handleShellRoutes } from "../../../src/channels/web/http/dispatch-shell.js";
import { buildRouteFlags } from "./helpers/route-flags.js";

describe("web http shell dispatch", () => {
  test("returns null when no shell route matches", async () => {
    const channel = {} as any;
    const req = new Request("https://example.com/unknown", { method: "GET" });
    const response = await handleShellRoutes(channel, req, "/unknown", buildRouteFlags(), async () => new Response());
    expect(response).toBeNull();
  });

  test("dispatches index/manifest/service-worker/static/docs/sse/terminal-session/vnc routes without ghostty compatibility assets", async () => {
    const staticRequests: string[] = [];
    const channel = {
      serveStatic: (rel: string, req?: Request) => {
        staticRequests.push(`${rel}:${req?.url || "missing"}`);
        return new Response(`static:${rel}`);
      },
      handleManifest: () => new Response("manifest"),
      serveDocsStatic: (rel: string) => new Response(`docs:${rel}`),
      handleSse: () => new Response("sse"),
      handleTerminalSession: () => new Response("terminal-session"),
      handleTerminalHandoff: async () => new Response("terminal-handoff"),
      handleVncSession: () => new Response("vnc-session"),
      handleVncHandoff: async () => new Response("vnc-handoff"),
      handleAvatar: async () => new Response("avatar", { status: 200 }),
    } as any;

    const indexFlags = buildRouteFlags({ isIndex: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/", { method: "GET" }), "/", indexFlags, async () => new Response()))?.text()).toBe("static:classic/index.html");

    const manifestFlags = buildRouteFlags({ isManifest: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/manifest.json", { method: "GET" }), "/manifest.json", manifestFlags, async () => new Response()))?.text()).toBe("manifest");

    const serviceWorkerFlags = buildRouteFlags({ isServiceWorker: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/sw.js", { method: "GET" }), "/sw.js", serviceWorkerFlags, async () => new Response()))?.text()).toBe("static:sw.js");

    expect(await handleShellRoutes(channel, new Request("https://e/ghostty-vt.wasm", { method: "GET" }), "/ghostty-vt.wasm", buildRouteFlags(), async () => new Response())).toBeNull();

    const staticFlags = buildRouteFlags({ isStaticAsset: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/static/x.js", { method: "GET" }), "/static/x.js", staticFlags, async () => new Response()))?.text()).toBe("static:x.js");
    expect(staticRequests).toContain("classic/index.html:https://e/");
    expect(staticRequests).toContain("sw.js:https://e/sw.js");
    expect(staticRequests.some((entry) => entry.includes("ghostty"))).toBe(false);
    expect(staticRequests).toContain("x.js:https://e/static/x.js");

    const docsFlags = buildRouteFlags({ isDocsAsset: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/docs/a.md", { method: "GET" }), "/docs/a.md", docsFlags, async () => new Response()))?.text()).toBe("docs:a.md");

    expect(await (await handleShellRoutes(channel, new Request("https://e/sse/stream", { method: "GET" }), "/sse/stream", buildRouteFlags(), async () => new Response()))?.text()).toBe("sse");
    expect(await (await handleShellRoutes(channel, new Request("https://e/terminal/session", { method: "GET" }), "/terminal/session", buildRouteFlags(), async () => new Response()))?.text()).toBe("terminal-session");
    expect(await (await handleShellRoutes(channel, new Request("https://e/terminal/handoff", { method: "POST" }), "/terminal/handoff", buildRouteFlags(), async () => new Response()))?.text()).toBe("terminal-handoff");
    expect(await (await handleShellRoutes(channel, new Request("https://e/vnc/session?target=desk", { method: "GET" }), "/vnc/session", buildRouteFlags(), async () => new Response()))?.text()).toBe("vnc-session");
    expect(await (await handleShellRoutes(channel, new Request("https://e/vnc/handoff?target=desk", { method: "POST" }), "/vnc/handoff", buildRouteFlags(), async () => new Response()))?.text()).toBe("vnc-handoff");
    expect(await handleShellRoutes(channel, new Request("https://e/agents", { method: "GET" }), "/agents", buildRouteFlags(), async () => new Response())).toBeNull();
  });

  test("dispatches avatar routes and favicon/apple fallback", async () => {
    const fallback = async (_req: Request, relPath: string) => new Response(`fallback:${relPath}`);
    const avatarRequests: string[] = [];

    const channel = {
      handleAvatar: async (_kind: string, req: Request) => {
        avatarRequests.push(req.url);
        return new Response("not-found", { status: 404 });
      },
      serveStatic: (_rel: string) => new Response("unused"),
      handleManifest: () => new Response("unused"),
      serveDocsStatic: (_rel: string) => new Response("unused"),
      handleSse: () => new Response("unused"),
    } as any;

    const faviconFlags = buildRouteFlags({ isFavicon: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/favicon.ico", { method: "GET" }), "/favicon.ico", faviconFlags, fallback))?.text()).toBe("fallback:favicon.ico");

    const appleFlags = buildRouteFlags({ isAppleIcon: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/apple-touch-icon.png", { method: "GET" }), "/apple-touch-icon.png", appleFlags, fallback))?.text()).toBe("fallback:apple-touch-icon.png");
    expect(avatarRequests.at(-1)).toContain("format=png");
    expect(avatarRequests.at(-1)).toContain("size=180");

    expect(await (await handleShellRoutes(channel, new Request("https://e/apple-touch-icon-152x152.png", { method: "GET" }), "/apple-touch-icon-152x152.png", appleFlags, fallback))?.text()).toBe("fallback:apple-touch-icon-152x152.png");
    expect(avatarRequests.at(-1)).toContain("format=png");
    expect(avatarRequests.at(-1)).toContain("size=152");

    const avatarFlags = buildRouteFlags({ isAvatar: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/avatar/agent", { method: "GET" }), "/avatar/agent", avatarFlags, fallback))?.status).toBe(404);

    const userAvatarFlags = buildRouteFlags({ isGetOrHead: true });
    expect(await (await handleShellRoutes(channel, new Request("https://e/avatar/user", { method: "GET" }), "/avatar/user", userAvatarFlags, fallback))?.status).toBe(404);
  });
});

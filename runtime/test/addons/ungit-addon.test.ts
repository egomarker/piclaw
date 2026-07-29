import { afterEach, expect, test } from "bun:test";

import { DEFAULT_UNGIT_CONFIG, normalizeUngitConfig } from "../../../addons/ungit/storage.ts";
import { importFresh } from "../helpers.js";
import {
  buildUngitTabPath,
  buildUngitUrl,
  parseUngitTabPath,
  registerUngitAddon,
  resolveUngitRepositoryPath,
} from "../../../addons/ungit/web/index.ts";

afterEach(() => {
  delete (globalThis as Record<string, unknown>).__piclawRuntimeInterop;
  delete (globalThis as Record<string, unknown>).__piclaw_registerAddonConfigApi;
});

test("Ungit URLs select the repository path and hide the header by default", () => {
  expect(buildUngitUrl("projects/foo bar")).toBe(
    "http://127.0.0.1:8448/?noheader=true#/repository?path=/workspace/projects/foo%20bar",
  );
  expect(buildUngitUrl(".", {
    baseUrl: "https://git.example.test/ungit?theme=dark",
    workspaceRoot: "/srv/piclaw data",
    hideHeader: false,
  })).toBe(
    "https://git.example.test/ungit?theme=dark#/repository?path=/srv/piclaw%20data",
  );
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

  await importFresh("../../../addons/ungit/index.ts", import.meta.url);
  expect(registration?.addonId).toBe("ungit");
  expect(registration?.action).toBe("config");
  expect(await registration?.handlers.get()).toMatchObject(DEFAULT_UNGIT_CONFIG);

  const saved = await registration?.handlers.set({
    baseUrl: "https://git.example.test/",
    workspaceRoot: "/srv/workspace",
    hideHeader: false,
  });
  expect(saved).toMatchObject({
    baseUrl: "https://git.example.test/",
    workspaceRoot: "/srv/workspace",
    hideHeader: false,
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
  })).toEqual({
    baseUrl: "https://git.example.test/ungit",
    workspaceRoot: "/srv/repos",
    hideHeader: false,
  });
});

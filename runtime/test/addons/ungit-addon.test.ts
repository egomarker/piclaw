import { afterEach, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  createUngitProxyHandler,
  UNGIT_PROXY_PATH,
} from "../../../addons/ungit/proxy.ts";
import {
  buildUngitStartCommand,
  isUngitLive,
  loadLastKnownGoodUngitSha,
  normalizeUngitSha,
  parseUngitLsRemote,
  resolveRemoteUngitSha,
  resolveUngitRevision,
  runGitCommand,
  saveLastKnownGoodUngitRevision,
  startUngitIfNeeded,
  stopUngit,
  UNGIT_HEALTH_URL,
  UNGIT_LAUNCH_CWD,
  UNGIT_PACKAGE_PREFIX,
  UNGIT_REPOSITORY_REF,
  UNGIT_REPOSITORY_URL,
  UNGIT_REQUIRED_ASSET_URLS,
  verifyUngitRuntime,
} from "../../../addons/ungit/service.ts";
import { DEFAULT_UNGIT_CONFIG, normalizeUngitConfig } from "../../../addons/ungit/storage.ts";
import { importFresh } from "../helpers.js";
import {
  buildUngitTabPath,
  buildUngitUrl,
  DEFAULT_UNGIT_ZOOM_PERCENT,
  normalizeUngitWebConfig,
  parseUngitTabPath,
  registerUngitAddon,
  requestUngitAction,
  requestUngitHealth,
  resolveUngitRepositoryPath,
  resolveUngitZoomLayout,
  ungitPaneExtension,
  UNGIT_ZOOM_PERCENTAGES,
} from "../../../addons/ungit/web/index.ts";

afterEach(() => {
  delete (globalThis as Record<string, unknown>).__piclawRuntimeInterop;
  delete (globalThis as Record<string, unknown>).__piclaw_registerAddonConfigApi;
});

function createFakeUngitPaneDom() {
  const ownerDocument: any = {
    defaultView: {
      addEventListener() {}, removeEventListener() {}, open() {},
      setTimeout() { return 1; }, clearTimeout() {},
    },
    getElementById() { return null; },
  };
  ownerDocument.createElement = (tagName: string) => ({
    tagName,
    ownerDocument,
    children: [],
    style: {},
    id: "",
    className: "",
    value: "",
    textContent: "",
    src: "",
    append(...children: any[]) { this.children.push(...children); },
    appendChild(child: any) { this.children.push(child); return child; },
    addEventListener() {},
    setAttribute() {},
    remove() {},
  });
  ownerDocument.head = ownerDocument.createElement("head");
  return { ownerDocument, container: ownerDocument.createElement("div") };
}

test("Ungit manifest declares its singleton startup runtime", async () => {
  const manifest = await Bun.file(new URL("../../../addons/ungit/package.json", import.meta.url)).json();
  expect(manifest?.pi?.runtime?.entries).toEqual(["runtime.ts"]);
});

test("Ungit pane opts into retention across tab switches", () => {
  expect(ungitPaneExtension.retainOnTabSwitch).toBe(true);
});

test("Ungit health check recognizes only a successful JSON ping", async () => {
  let requestedUrl = "";
  expect(await isUngitLive(async (input) => {
    requestedUrl = String(input);
    return Response.json({});
  })).toBe(true);
  expect(requestedUrl).toBe(UNGIT_HEALTH_URL);
  expect(await isUngitLive(async () => new Response("{}", { status: 503 }))).toBe(false);
  expect(await isUngitLive(async () => new Response("not json", { status: 200 }))).toBe(false);
});

const TEST_UNGIT_SHA = "7c295c1edbe37ef990461e3d2abc9eeb98b106c8";
const OTHER_UNGIT_SHA = "55d5080fe67ea85953771c078d267e3a97c24ba2";

test("Ungit parses only the requested full remote main SHA", async () => {
  expect(normalizeUngitSha(`  ${TEST_UNGIT_SHA.toUpperCase()}  `)).toBe(TEST_UNGIT_SHA);
  expect(normalizeUngitSha(TEST_UNGIT_SHA.slice(0, 12))).toBeNull();
  expect(parseUngitLsRemote(`${TEST_UNGIT_SHA}\t${UNGIT_REPOSITORY_REF}\n`)).toBe(
    TEST_UNGIT_SHA,
  );
  expect(() => parseUngitLsRemote(`${TEST_UNGIT_SHA}\trefs/tags/main\n`)).toThrow(
    "Unable to resolve",
  );

  let requestedCommand: string[] = [];
  let requestedTimeout = 0;
  expect(
    await resolveRemoteUngitSha({
      timeoutMs: 25,
      runGitImpl: async (command, timeoutMs) => {
        requestedCommand = command;
        requestedTimeout = timeoutMs;
        return {
          exitCode: 0,
          stdout: `${TEST_UNGIT_SHA}\t${UNGIT_REPOSITORY_REF}\n`,
          stderr: "",
        };
      },
    }),
  ).toBe(TEST_UNGIT_SHA);
  expect(requestedCommand).toEqual([
    "git",
    "ls-remote",
    "--exit-code",
    UNGIT_REPOSITORY_URL,
    UNGIT_REPOSITORY_REF,
  ]);
  expect(requestedTimeout).toBe(25);

  await expect(
    resolveRemoteUngitSha({
      runGitImpl: async () => ({ exitCode: 0, stdout: "malformed\n", stderr: "" }),
    }),
  ).rejects.toThrow("Unable to resolve");
  await expect(
    resolveRemoteUngitSha({
      runGitImpl: async () => ({ exitCode: 2, stdout: "", stderr: "offline" }),
    }),
  ).rejects.toThrow("offline");

  await expect(
    runGitCommand([process.execPath, "-e", "await Bun.sleep(5_000)"], 25),
  ).rejects.toThrow("Timed out after 25ms");
});

test("Ungit revision resolution supports override, remote main, and last-known-good fallback", async () => {
  expect(
    await resolveUngitRevision({
      env: { PICLAW_UNGIT_SHA: TEST_UNGIT_SHA },
      resolveRemoteSha: async () => {
        throw new Error("override must skip remote resolution");
      },
    }),
  ).toEqual({ sha: TEST_UNGIT_SHA, source: "override" });

  await expect(
    resolveUngitRevision({
      env: { PICLAW_UNGIT_SHA: "main" },
    }),
  ).rejects.toThrow("full 40-character Git SHA");

  expect(
    await resolveUngitRevision({
      env: {},
      resolveRemoteSha: async () => TEST_UNGIT_SHA,
      loadLastKnownGood: () => OTHER_UNGIT_SHA,
    }),
  ).toEqual({ sha: TEST_UNGIT_SHA, source: "remote-main" });

  expect(
    await resolveUngitRevision({
      env: {},
      resolveRemoteSha: async () => {
        throw new Error("offline");
      },
      loadLastKnownGood: () => OTHER_UNGIT_SHA,
    }),
  ).toEqual({ sha: OTHER_UNGIT_SHA, source: "last-known-good" });

  await expect(
    resolveUngitRevision({
      env: {},
      resolveRemoteSha: async () => {
        throw new Error("offline without fallback");
      },
      loadLastKnownGood: () => null,
    }),
  ).rejects.toThrow("offline without fallback");
});

test("Ungit persists verified state atomically and ignores malformed state", () => {
  const root = mkdtempSync(join(tmpdir(), "piclaw-ungit-state-"));
  const statePath = join(root, "nested", "ungit-launch-state.json");
  try {
    expect(loadLastKnownGoodUngitSha(statePath)).toBeNull();
    saveLastKnownGoodUngitRevision(
      { sha: TEST_UNGIT_SHA, source: "remote-main" },
      statePath,
    );
    expect(loadLastKnownGoodUngitSha(statePath)).toBe(TEST_UNGIT_SHA);
    expect(statSync(statePath).mode & 0o777).toBe(0o600);
    expect(readdirSync(join(root, "nested"))).toEqual(["ungit-launch-state.json"]);
    expect(JSON.parse(readFileSync(statePath, "utf8"))).toMatchObject({
      version: 1,
      sha: TEST_UNGIT_SHA,
      source: "remote-main",
    });

    writeFileSync(statePath, '{"version":1,"sha":"main","source":"remote-main"}', "utf8");
    expect(loadLastKnownGoodUngitSha(statePath)).toBeNull();
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Ungit runtime verification requires health and all routed assets", async () => {
  const requestedUrls: string[] = [];
  const healthyFetch = async (input: string | URL | Request) => {
    const url = String(input);
    requestedUrls.push(url);
    return url === UNGIT_HEALTH_URL ? Response.json({}) : new Response("asset");
  };
  expect(await verifyUngitRuntime(healthyFetch)).toBe(true);
  expect(requestedUrls).toEqual([UNGIT_HEALTH_URL, ...UNGIT_REQUIRED_ASSET_URLS]);

  expect(
    await verifyUngitRuntime(async (input) => {
      const url = String(input);
      if (url === UNGIT_HEALTH_URL) return Response.json({});
      return new Response("missing", {
        status: url === UNGIT_REQUIRED_ASSET_URLS.at(-1) ? 404 : 200,
      });
    }),
  ).toBe(false);
});

test("Ungit autostart skips a live service and launches the resolved immutable package", async () => {
  let spawnCount = 0;
  await startUngitIfNeeded({
    fetchImpl: async () => Response.json({}),
    ensureLaunchCwd: () => {
      throw new Error("live service must not prepare a launch directory");
    },
    spawnImpl: () => {
      spawnCount += 1;
      return {};
    },
  });
  expect(spawnCount).toBe(0);

  let launchedCommand: string[] = [];
  let launchedOptions: Record<string, unknown> = {};
  let unrefCalled = false;
  let preparedCwd = "";
  let savedRevision: unknown;
  let waitCount = 0;
  await startUngitIfNeeded({
    fetchImpl: async () => new Response("{}", { status: 503 }),
    ensureLaunchCwd: (cwd) => {
      preparedCwd = cwd;
    },
    resolveRevision: async () => ({ sha: TEST_UNGIT_SHA, source: "remote-main" }),
    spawnImpl: (command, options) => {
      spawnCount += 1;
      launchedCommand = command;
      launchedOptions = options;
      return {
        pid: 123,
        unref: () => {
          unrefCalled = true;
        },
      };
    },
    waitForRuntime: async () => {
      waitCount += 1;
    },
    saveLastKnownGood: (revision) => {
      savedRevision = revision;
    },
  });

  expect(spawnCount).toBe(1);
  expect(preparedCwd).toBe(UNGIT_LAUNCH_CWD);
  expect(launchedCommand).toEqual(buildUngitStartCommand(TEST_UNGIT_SHA));
  expect(launchedCommand.slice(0, 5)).toEqual([
    "bunx",
    "--bun",
    "--package",
    `${UNGIT_PACKAGE_PREFIX}#${TEST_UNGIT_SHA}`,
    "ungit",
  ]);
  expect(launchedOptions).toEqual({
    cwd: "/workspace/.piclaw",
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });
  expect(unrefCalled).toBe(true);
  expect(waitCount).toBe(1);
  expect(savedRevision).toEqual({ sha: TEST_UNGIT_SHA, source: "remote-main" });
});

test("Ungit shares concurrent startup and records state only after readiness", async () => {
  let releaseRuntime!: () => void;
  const runtimeReady = new Promise<void>((resolve) => {
    releaseRuntime = resolve;
  });
  let spawnCount = 0;
  let saveCount = 0;
  const firstStart = startUngitIfNeeded({
    fetchImpl: async () => new Response("{}", { status: 503 }),
    ensureLaunchCwd: () => {},
    resolveRevision: async () => ({ sha: TEST_UNGIT_SHA, source: "remote-main" }),
    spawnImpl: () => {
      spawnCount += 1;
      return {};
    },
    waitForRuntime: () => runtimeReady,
    saveLastKnownGood: () => {
      saveCount += 1;
    },
  });
  const secondStart = startUngitIfNeeded();
  expect(secondStart).toBe(firstStart);
  expect(saveCount).toBe(0);
  releaseRuntime();
  await Promise.all([firstStart, secondStart]);
  expect(spawnCount).toBe(1);
  expect(saveCount).toBe(1);

  await expect(
    startUngitIfNeeded({
      fetchImpl: async () => new Response("{}", { status: 503 }),
      ensureLaunchCwd: () => {},
      resolveRevision: async () => ({ sha: TEST_UNGIT_SHA, source: "remote-main" }),
      spawnImpl: () => ({}),
      waitForRuntime: async () => {
        throw new Error("readiness timeout");
      },
      loadLastKnownGood: () => null,
      cleanupFailedLaunch: () => {},
      saveLastKnownGood: () => {
        saveCount += 1;
      },
    }),
  ).rejects.toThrow("readiness timeout");
  expect(saveCount).toBe(1);
});

test("Ungit reports an early launcher exit without waiting for the readiness timeout", async () => {
  await expect(
    startUngitIfNeeded({
      fetchImpl: async () => new Response("{}", { status: 503 }),
      ensureLaunchCwd: () => {},
      resolveRevision: async () => ({ sha: TEST_UNGIT_SHA, source: "remote-main" }),
      spawnImpl: () => ({ exited: Promise.resolve(17) }),
      waitForRuntime: () => new Promise(() => {}),
      loadLastKnownGood: () => null,
      cleanupFailedLaunch: () => {},
      saveLastKnownGood: () => {
        throw new Error("failed launch must not be saved");
      },
    }),
  ).rejects.toThrow(`revision ${TEST_UNGIT_SHA} exited with code 17 before readiness`);
});

test("Ungit retries last-known-good after a newly resolved revision fails readiness", async () => {
  const launchedCommands: string[][] = [];
  const savedRevisions: unknown[] = [];
  let waitCount = 0;
  let cleanupCount = 0;

  await startUngitIfNeeded({
    fetchImpl: async () => new Response("{}", { status: 503 }),
    ensureLaunchCwd: () => {},
    resolveRevision: async () => ({ sha: TEST_UNGIT_SHA, source: "remote-main" }),
    spawnImpl: (command) => {
      launchedCommands.push(command);
      return {};
    },
    waitForRuntime: async () => {
      waitCount += 1;
      if (waitCount === 1) throw new Error("new revision is incomplete");
    },
    loadLastKnownGood: () => OTHER_UNGIT_SHA,
    cleanupFailedLaunch: () => {
      cleanupCount += 1;
    },
    saveLastKnownGood: (revision) => {
      savedRevisions.push(revision);
    },
  });

  expect(launchedCommands).toEqual([
    buildUngitStartCommand(TEST_UNGIT_SHA),
    buildUngitStartCommand(OTHER_UNGIT_SHA),
  ]);
  expect(waitCount).toBe(2);
  expect(cleanupCount).toBe(1);
  expect(savedRevisions).toEqual([
    { sha: OTHER_UNGIT_SHA, source: "last-known-good" },
  ]);
});

test("Ungit stop finds matching PIDs and terminates them", () => {
  const killed: Array<{ pid: number; signal: string }> = [];
  expect(stopUngit({
    findPids: () => [101, 102, 103],
    killImpl: (pid, signal) => { killed.push({ pid, signal }); },
  })).toBe(3);
  expect(killed).toEqual([
    { pid: 101, signal: "SIGTERM" },
    { pid: 102, signal: "SIGTERM" },
    { pid: 103, signal: "SIGTERM" },
  ]);
});

test("Ungit web settings health request returns only the live boolean", async () => {
  const previousFetch = globalThis.fetch;
  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;
  try {
    globalThis.fetch = async (input, init) => {
      requestedUrl = String(input);
      requestedInit = init;
      return Response.json({ live: true });
    };
    expect(await requestUngitHealth()).toBe(true);
    expect(requestedUrl).toBe("/agent/addons/api/ungit/health");
    expect(requestedInit).toMatchObject({ credentials: "same-origin" });

    globalThis.fetch = async () => Response.json({ live: false });
    expect(await requestUngitHealth()).toBe(false);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("Ungit web settings sends a start or stop action", async () => {
  const previousFetch = globalThis.fetch;
  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;
  try {
    globalThis.fetch = async (input, init) => {
      requestedUrl = String(input);
      requestedInit = init;
      return Response.json({ live: false });
    };
    expect(await requestUngitAction("stop")).toEqual({ live: false });
    expect(requestedUrl).toBe("/agent/addons/api/ungit/health");
    expect(requestedInit).toMatchObject({
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "stop" }),
    });
  } finally {
    globalThis.fetch = previousFetch;
  }
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
  expect(normalizeUngitWebConfig({ defaultZoomPercent: 80 }).defaultZoomPercent).toBe(80);
  expect(normalizeUngitWebConfig({ defaultZoomPercent: 55 }).defaultZoomPercent).toBe(60);
});

test("Ungit applies configured default zoom inside a clipped viewport", async () => {
  const previousFetch = globalThis.fetch;
  const { ownerDocument, container } = createFakeUngitPaneDom();
  globalThis.fetch = async () => Response.json({
    ok: true,
    config: { workspaceRoot: "/workspace", defaultZoomPercent: 80 },
  });
  const pane: any = ungitPaneExtension.mount(container, { path: buildUngitTabPath("piclaw") });

  try {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const root = container.children[0];
    const [viewport, _status, picker] = root.children;
    const iframe = viewport.children[0];

    expect(viewport.className).toBe("ungit-pane-frame-viewport");
    expect(viewport.children).toEqual([iframe]);
    expect(root.children).not.toContain(iframe);
    expect(picker.value).toBe("80");
    expect(iframe.style.transform).toBe("scale(0.8)");
    expect(iframe.style.width).toBe("125%");

    const injectedStyles = ownerDocument.head.children[0].textContent;
    expect(injectedStyles).toContain(
      ".ungit-pane-frame-viewport { position:absolute; inset:0; overflow:hidden; overflow:clip;",
    );
    expect(injectedStyles).toContain(".ungit-pane iframe { position:absolute; top:0; left:0;");
  } finally {
    pane.dispose();
    globalThis.fetch = previousFetch;
  }
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

test("Ungit registers direct backend config and health APIs", async () => {
  const stored = new Map<string, unknown>();
  const registrations = new Map<string, { addonId: string; action: string; handlers: any }>();
  let routeRegistration: { prefix: string; handler: any; extensionPath: string } | null = null;
  const previousFetch = globalThis.fetch;
  const previousRegisterRoute = (globalThis as any).__piclaw_registerRoute;
  (globalThis as any).__piclawRuntimeInterop = {
    getExtensionKvStore: () => ({
      get: (_extensionId: string, key: string) => stored.get(key) ?? null,
      set: (_extensionId: string, key: string, value: unknown) => { stored.set(key, value); },
    }),
  };
  (globalThis as any).__piclaw_registerAddonConfigApi = (addonId: string, action: string, handlers: any) => {
    registrations.set(action, { addonId, action, handlers });
    return "created";
  };
  (globalThis as any).__piclaw_registerRoute = (prefix: string, handler: any, extensionPath: string) => {
    routeRegistration = { prefix, handler, extensionPath };
    return "created";
  };

  globalThis.fetch = async () => Response.json({});
  try {
    await importFresh("../../../addons/ungit/index.ts", import.meta.url);
    const configRegistration = registrations.get("config");
    const healthRegistration = registrations.get("health");
    expect(configRegistration?.addonId).toBe("ungit");
    expect(configRegistration?.action).toBe("config");
    expect(healthRegistration?.addonId).toBe("ungit");
    expect(await healthRegistration?.handlers.get()).toEqual({ live: true });
    expect(await healthRegistration?.handlers.set({ action: "start" })).toEqual({ live: true });
    await expect(healthRegistration?.handlers.set({ action: "invalid" })).rejects.toThrow("must be start or stop");
    expect(routeRegistration?.prefix).toBe(UNGIT_PROXY_PATH);
    expect(routeRegistration?.extensionPath).toEndWith("/addons/ungit");
    expect(await configRegistration?.handlers.get()).toMatchObject(DEFAULT_UNGIT_CONFIG);

    const saved = await configRegistration?.handlers.set({
      baseUrl: "https://git.example.test/",
      workspaceRoot: "/srv/workspace",
      hideHeader: false,
      proxyEnabled: false,
      defaultZoomPercent: 80,
    });
    expect(saved).toMatchObject({
      baseUrl: "https://git.example.test/",
      workspaceRoot: "/srv/workspace",
      hideHeader: false,
      proxyEnabled: false,
      defaultZoomPercent: 80,
      restartRequired: false,
    });
    expect(stored.get("config")).toMatchObject({
      workspaceRoot: "/srv/workspace",
      defaultZoomPercent: 80,
    });
  } finally {
    globalThis.fetch = previousFetch;
    if (previousRegisterRoute === undefined) delete (globalThis as any).__piclaw_registerRoute;
    else (globalThis as any).__piclaw_registerRoute = previousRegisterRoute;
  }
});

test("Ungit backend config normalization rejects unsafe URLs and keeps embedding defaults", () => {
  expect(normalizeUngitConfig({
    baseUrl: "javascript:alert(1)",
    workspaceRoot: "",
    hideHeader: undefined,
  })).toEqual(DEFAULT_UNGIT_CONFIG);

  expect(normalizeUngitConfig({ defaultZoomPercent: 55 }).defaultZoomPercent).toBe(60);

  expect(normalizeUngitConfig({
    baseUrl: "https://git.example.test/ungit#old-route",
    workspaceRoot: "/srv/repos",
    hideHeader: false,
    proxyEnabled: false,
    defaultZoomPercent: 80,
  })).toEqual({
    baseUrl: "https://git.example.test/ungit",
    workspaceRoot: "/srv/repos",
    hideHeader: false,
    proxyEnabled: false,
    defaultZoomPercent: 80,
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

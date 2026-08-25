import { createServer } from "node:net";
import { dirname, join } from "node:path";

import {
  ApplicationMenu,
  BrowserWindow,
  PATHS,
  Utils,
  type ApplicationMenuItemConfig,
} from "electrobun/bun";

const DEFAULT_DESKTOP_PORT_START = 18080;
const STARTUP_TIMEOUT_MS = 120_000;
const STARTUP_POLL_MS = 500;
const APP_NAME = "PiClaw";
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

let activeWindow: BrowserWindow | null = null;
let runtimeUrl: string | null = null;

function isTruthy(value: string | undefined): boolean {
  return /^(1|true|yes|on)$/i.test(String(value || "").trim());
}

async function findAvailablePort(startPort: number): Promise<number> {
  let lastError: unknown = null;
  for (let port = startPort; port < startPort + 100; port += 1) {
    const available = await new Promise<boolean>((resolve, reject) => {
      const server = createServer();
      server.once("error", (error: NodeJS.ErrnoException) => {
        lastError = error;
        if (error.code === "EADDRINUSE" || error.code === "EACCES") {
          resolve(false);
        } else {
          reject(error);
        }
      });
      server.listen(port, "127.0.0.1", () => {
        server.close(() => resolve(true));
      });
    });
    if (available) return port;
  }
  const reason = lastError instanceof Error ? ` Last probe error: ${lastError.message}` : "";
  throw new Error(`No available localhost port found from ${startPort} to ${startPort + 99}.${reason}`);
}

async function waitForHttpReady(url: string, timeoutMs = STARTUP_TIMEOUT_MS): Promise<void> {
  const started = Date.now();
  let lastError: unknown = null;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      await response.body?.cancel().catch(() => {});
      return;
    } catch (error) {
      lastError = error;
      await Bun.sleep(STARTUP_POLL_MS);
    }
  }
  throw new Error(`Piclaw web UI did not become ready at ${url}: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

function setDefaultEnv(name: string, value: string): void {
  if (!process.env[name]) process.env[name] = value;
}

async function configureDesktopRuntime(): Promise<{ url: string; ownsRuntime: boolean }> {
  const externalUrl = process.env.PICLAW_DESKTOP_URL?.trim();
  if (externalUrl) {
    return { url: externalUrl, ownsRuntime: false };
  }

  const resourcesAppDir = dirname(PATHS.VIEWS_FOLDER);
  const runtimeRoot = join(resourcesAppDir, "runtime");
  const desktopWorkspace = join(Utils.paths.appData, "PiClaw", "workspace");
  const requestedPort = Number.parseInt(process.env.PICLAW_WEB_PORT || "", 10);
  const port = Number.isFinite(requestedPort) && requestedPort > 0
    ? requestedPort
    : await findAvailablePort(DEFAULT_DESKTOP_PORT_START);

  setDefaultEnv("PICLAW_DESKTOP", "1");
  setDefaultEnv("PICLAW_WEB_HOST", "127.0.0.1");
  setDefaultEnv("PICLAW_WEB_PORT", String(port));
  setDefaultEnv("PICLAW_WEB_EXTERNAL_URL", `http://127.0.0.1:${port}`);
  setDefaultEnv("PICLAW_WORKSPACE", desktopWorkspace);
  setDefaultEnv("PICLAW_RUNTIME_ROOT", runtimeRoot);
  setDefaultEnv("PICLAW_WEB_STATIC_DIR", join(runtimeRoot, "web", "static"));
  setDefaultEnv("PICLAW_RUNTIME_DOCS_DIR", join(runtimeRoot, "docs"));
  setDefaultEnv("PICLAW_SKEL_DIR", join(resourcesAppDir, "skel"));

  // The desktop shell owns the long-lived process; keep helper child processes
  // opt-in until packaged executable path handling is validated per platform.
  setDefaultEnv("PICLAW_EXTERNAL_PROGRESS_WATCHDOG", "0");
  setDefaultEnv("PICLAW_DISABLE_BACKGROUND_WORKSPACE_INDEX", "1");

  return {
    url: process.env.PICLAW_WEB_EXTERNAL_URL,
    ownsRuntime: true,
  };
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]!));
}

function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 10) / 10));
}

function runInActiveWindow(script: string): void {
  activeWindow?.webview?.executeJavascript(script);
}

function reloadActiveWindow(force = false): void {
  const win = activeWindow;
  if (!win) return;
  if (force && runtimeUrl) {
    win.webview.loadURL(runtimeUrl);
    return;
  }
  win.webview.executeJavascript("globalThis.location.reload();");
}

function setActiveWindowZoom(zoom: number): void {
  activeWindow?.setPageZoom(clampZoom(zoom));
}

function adjustActiveWindowZoom(delta: number): void {
  const currentZoom = activeWindow?.getPageZoom() ?? 1;
  setActiveWindowZoom(currentZoom + delta);
}

function openDesktopWindow(): BrowserWindow | null {
  if (!runtimeUrl) return null;
  return openWindow(runtimeUrl);
}

function menuItem(role: string, accelerator?: string): ApplicationMenuItemConfig {
  return { role, accelerator };
}

function separator(): ApplicationMenuItemConfig {
  return { type: "divider" };
}

function configureApplicationMenu(): void {
  const menu: ApplicationMenuItemConfig[] = [
    {
      label: APP_NAME,
      submenu: [
        menuItem("about"),
        separator(),
        {
          label: "Settings...",
          action: "open-settings",
          accelerator: "Command+,",
        },
        separator(),
        menuItem("hide", "Command+H"),
        menuItem("hideOthers", "Command+Option+H"),
        menuItem("showAll"),
        separator(),
        menuItem("quit", "Command+Q"),
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "New Window",
          action: "new-window",
          accelerator: "Command+N",
        },
        separator(),
        menuItem("close", "Command+W"),
      ],
    },
    {
      label: "Edit",
      submenu: [
        menuItem("undo", "Command+Z"),
        menuItem("redo", "Command+Shift+Z"),
        separator(),
        menuItem("cut", "Command+X"),
        menuItem("copy", "Command+C"),
        menuItem("paste", "Command+V"),
        menuItem("pasteAndMatchStyle", "Command+Option+Shift+V"),
        menuItem("delete"),
        separator(),
        menuItem("selectAll", "Command+A"),
        separator(),
        {
          label: "Speech",
          submenu: [
            menuItem("startSpeaking"),
            menuItem("stopSpeaking"),
          ],
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          action: "reload",
          accelerator: "Command+R",
        },
        {
          label: "Force Reload",
          action: "force-reload",
          accelerator: "Command+Shift+R",
        },
        separator(),
        {
          label: "Actual Size",
          action: "actual-size",
          accelerator: "Command+0",
        },
        {
          label: "Zoom In",
          action: "zoom-in",
          accelerator: "Command+=",
        },
        {
          label: "Zoom Out",
          action: "zoom-out",
          accelerator: "Command+-",
        },
        separator(),
        menuItem("toggleFullScreen", "Control+Command+F"),
        separator(),
        {
          label: "Toggle Developer Tools",
          action: "toggle-devtools",
          accelerator: "Option+Command+I",
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        menuItem("minimize", "Command+M"),
        menuItem("zoom"),
        separator(),
        menuItem("cycleThroughWindows", "Command+`"),
        separator(),
        menuItem("bringAllToFront"),
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: `${APP_NAME} Help`,
          action: "open-help",
          accelerator: "Command+?",
        },
      ],
    },
  ];

  ApplicationMenu.setApplicationMenu(menu);
  ApplicationMenu.on("application-menu-clicked", (event) => {
    const action = (event as { data?: { action?: string } })?.data?.action;
    switch (action) {
      case "new-window":
        openDesktopWindow();
        break;
      case "open-settings":
        runInActiveWindow("window.dispatchEvent(new CustomEvent('piclaw:open-settings'));");
        break;
      case "reload":
        reloadActiveWindow();
        break;
      case "force-reload":
        reloadActiveWindow(true);
        break;
      case "actual-size":
        setActiveWindowZoom(1);
        break;
      case "zoom-in":
        adjustActiveWindowZoom(ZOOM_STEP);
        break;
      case "zoom-out":
        adjustActiveWindowZoom(-ZOOM_STEP);
        break;
      case "toggle-devtools":
        activeWindow?.webview?.toggleDevTools();
        break;
      case "open-help":
        runInActiveWindow("window.dispatchEvent(new CustomEvent('piclaw:open-settings', { detail: { section: 'keyboard' } }));");
        break;
    }
  });
}

function openWindow(url: string): BrowserWindow {
  const win = new BrowserWindow({
    title: "PiClaw",
    url,
    frame: {
      width: 1440,
      height: 960,
      x: 80,
      y: 60,
    },
    titleBarStyle: "default",
  });
  activeWindow = win;
  win.on("focus", () => {
    activeWindow = win;
  });
  return win;
}

function openStartupErrorWindow(error: unknown): void {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  new BrowserWindow({
    title: "PiClaw startup failed",
    frame: {
      width: 900,
      height: 520,
      x: 120,
      y: 90,
    },
    html: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>PiClaw startup failed</title>
  <style>
    body { margin: 0; padding: 32px; font: 14px system-ui, sans-serif; background: #111827; color: #f9fafb; }
    h1 { margin: 0 0 16px; font-size: 22px; }
    pre { white-space: pre-wrap; background: #030712; border: 1px solid #374151; padding: 16px; border-radius: 8px; overflow: auto; }
  </style>
</head>
<body>
  <h1>PiClaw could not start</h1>
  <pre>${escapeHtml(message)}</pre>
</body>
</html>`,
  });
}

try {
  const runtime = await configureDesktopRuntime();
  runtimeUrl = runtime.url;
  configureApplicationMenu();

  if (runtime.ownsRuntime && !isTruthy(process.env.PICLAW_DESKTOP_SKIP_RUNTIME)) {
    const { main } = await import("../src/runtime.js");
    void main().catch((error) => {
      console.error("[piclaw-desktop] Runtime failed", error);
      openStartupErrorWindow(error);
    });
    await waitForHttpReady(runtime.url);
  }

  openWindow(runtime.url);
} catch (error) {
  console.error("[piclaw-desktop] Startup failed", error);
  openStartupErrorWindow(error);
}

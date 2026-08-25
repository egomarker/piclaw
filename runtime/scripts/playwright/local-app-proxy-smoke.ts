#!/usr/bin/env bun

import { chromium, type Browser } from "playwright";
import { createLogger, debugSuppressedError } from "../../src/utils/logger.js";
import { bootstrapE2EStorageState } from "./web-auth-bootstrap.js";

const log = createLogger("local-app-proxy-smoke");

const baseUrl = (process.env.PICLAW_E2E_BASE_URL || "http://127.0.0.1:8080").replace(/\/+$/, "");
const appName = process.env.PICLAW_PROXY_TEST_NAME || "Proxy Test";
const slug = process.env.PICLAW_PROXY_TEST_SLUG || "proxy-test";
const port = Number(process.env.PICLAW_PROXY_TEST_PORT || "18094");
const executablePath = process.env.PICLAW_PLAYWRIGHT_EXECUTABLE_PATH || undefined;

if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error(`Invalid PICLAW_PROXY_TEST_PORT: ${process.env.PICLAW_PROXY_TEST_PORT || ""}`);
}

let browser: Browser | null = null;
let createdId = "";

async function apiRequest(
  request: import("playwright").APIRequestContext,
  path: string,
  init: { method?: "GET" | "POST"; data?: Record<string, unknown> } = {},
) {
  const response = init.method === "POST"
    ? await request.post(`${baseUrl}${path}`, { data: init.data })
    : await request.get(`${baseUrl}${path}`);
  const body = await response.text();
  let json: any = null;
  try {
    json = JSON.parse(body);
  } catch (error) {
    debugSuppressedError(log, "Failed to parse Local App Proxy API response as JSON; preserving raw text for diagnostics.", error, {
      method: init.method || "GET",
      path,
      status: response.status(),
    });
  }
  if (!response.ok()) {
    throw new Error(`${init.method || "GET"} ${path} failed: HTTP ${response.status()} ${json?.error || body}`);
  }
  return json;
}

try {
  const storageState = await bootstrapE2EStorageState({ baseUrl });
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const context = await browser.newContext({ storageState });
  try {
    const existing = await apiRequest(context.request, "/agent/local-apps?chat_jid=web:default");
    const conflict = Array.isArray(existing?.apps)
      ? existing.apps.find((app: any) => app?.slug === slug)
      : null;
    if (conflict?.id) {
      await apiRequest(context.request, "/agent/local-apps/action?chat_jid=web:default", {
        method: "POST",
        data: { action: "remove", id: conflict.id },
      });
    }

    const created = await apiRequest(context.request, "/agent/local-apps/action?chat_jid=web:default", {
      method: "POST",
      data: {
        action: "create",
        app: {
          name: appName,
          slug,
          port,
          upstreamBasePath: "/",
          healthPath: "/health",
          enabled: true,
        },
      },
    });
    createdId = String(created?.app?.id || "");
    if (!createdId) throw new Error("Local App Proxy create response did not include an app id.");

    const probe = await apiRequest(context.request, "/agent/local-apps/action?chat_jid=web:default", {
      method: "POST",
      data: { action: "probe", id: createdId },
    });
    if (probe?.health?.state !== "reachable") {
      throw new Error(`Local app health probe failed: ${JSON.stringify(probe?.health || null)}`);
    }

    const page = await context.newPage();
    try {
      await page.goto(`${baseUrl}/apps/${slug}/`, { waitUntil: "domcontentloaded" });
      const heading = await page.getByRole("heading", { name: "Hello from Local App Proxy" }).textContent();
      if (heading?.trim() !== "Hello from Local App Proxy") {
        throw new Error(`Unexpected proxied heading: ${heading || "<missing>"}`);
      }
      const api = await page.evaluate(async () => {
        const response = await fetch("./api/hello");
        return { status: response.status, json: await response.json() };
      });
      if (api.status !== 200 || api.json?.message !== "Hello through Piclaw") {
        throw new Error(`Unexpected proxied API response: ${JSON.stringify(api)}`);
      }
    } finally {
      await page.close();
    }

    console.log(JSON.stringify({
      ok: true,
      baseUrl,
      appPort: port,
      publicPath: `/apps/${slug}/`,
      heading: "Hello from Local App Proxy",
      apiMessage: "Hello through Piclaw",
    }));
  } finally {
    if (createdId) {
      await apiRequest(context.request, "/agent/local-apps/action?chat_jid=web:default", {
        method: "POST",
        data: { action: "remove", id: createdId },
      }).catch((error) => console.error(`cleanup warning: ${error instanceof Error ? error.message : String(error)}`));
    }
    await context.close();
  }
} finally {
  await browser?.close();
}

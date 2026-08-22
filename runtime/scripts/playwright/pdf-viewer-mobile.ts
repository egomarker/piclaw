#!/usr/bin/env bun

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  chromium,
  type Browser,
  type BrowserContext,
  type CDPSession,
  type Page,
} from "playwright";
import { bootstrapE2EStorageState } from "./web-auth-bootstrap.js";

const FIXTURE_PDF_PATH = "__piclaw_pdfjs_mobile_e2e__.pdf";
const FIXTURE_PAGE_COUNT = 18;

interface Args {
  baseUrl: string;
  executablePath: string;
  internalSecret: string;
  headless: boolean;
  artifactDir: string;
  pdfPath: string;
  expectedPageCount: number;
  emulateLegacyRuntime: boolean;
}

interface ScenarioResult {
  name: string;
  ok: boolean;
  details: Record<string, unknown>;
}

function argumentValue(argv: string[], name: string): string {
  const index = argv.indexOf(name);
  return index >= 0 ? String(argv[index + 1] || "") : "";
}

function parseArgs(argv: string[]): Args {
  const repoRoot = resolve(import.meta.dir, "..", "..", "..");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const pdfPath = argumentValue(argv, "--pdf-path") || process.env.PICLAW_E2E_PDF_PATH || FIXTURE_PDF_PATH;
  const expectedPageCountRaw =
    argumentValue(argv, "--expected-pages") ||
    process.env.PICLAW_E2E_EXPECTED_PAGES ||
    (pdfPath === FIXTURE_PDF_PATH ? String(FIXTURE_PAGE_COUNT) : "");
  const expectedPageCount = Number(expectedPageCountRaw);
  if (!Number.isInteger(expectedPageCount) || expectedPageCount < 1) {
    throw new Error("A positive --expected-pages value is required when testing a non-fixture PDF.");
  }

  return {
    baseUrl: (
      argumentValue(argv, "--base-url") ||
      process.env.PICLAW_E2E_BASE_URL ||
      "http://127.0.0.1:8080"
    ).replace(/\/+$/, ""),
    executablePath: argumentValue(argv, "--executable-path") || process.env.PICLAW_PLAYWRIGHT_EXECUTABLE_PATH || "",
    internalSecret: argumentValue(argv, "--internal-secret") || process.env.PICLAW_INTERNAL_SECRET || "",
    headless: !argv.includes("--headed"),
    artifactDir: argumentValue(argv, "--artifact-dir") || resolve(
      repoRoot,
      "runtime/generated/cache/playwright-pdf-viewer-mobile",
      stamp,
    ),
    pdfPath,
    expectedPageCount,
    emulateLegacyRuntime: !argv.includes("--native-runtime"),
  };
}

function buildPdf(pageCount: number): Buffer {
  const objects = new Map<number, string>();
  const pageObjectIds: number[] = [];
  const fontObjectId = 3 + pageCount * 2;

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const pageObjectId = 3 + (pageNumber - 1) * 2;
    const contentObjectId = pageObjectId + 1;
    pageObjectIds.push(pageObjectId);
    const stream = [
      "BT",
      "/F1 28 Tf",
      "72 700 Td",
      `(Piclaw mobile PDF viewer - page ${pageNumber}) Tj`,
      "0 -48 Td",
      "/F1 14 Tf",
      "(Scroll, pinch, zoom, rotate, and fit-width test fixture.) Tj",
      "ET",
      "",
    ].join("\n");
    objects.set(pageObjectId, [
      "<< /Type /Page",
      "   /Parent 2 0 R",
      "   /MediaBox [0 0 612 792]",
      `   /Resources << /Font << /F1 ${fontObjectId} 0 R >> >>`,
      `   /Contents ${contentObjectId} 0 R`,
      ">>",
    ].join("\n"));
    objects.set(contentObjectId, `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`);
  }

  objects.set(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objects.set(2, `<< /Type /Pages /Count ${pageCount} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] >>`);
  objects.set(fontObjectId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n% Piclaw PDF.js E2E fixture\n";
  const offsets = new Array<number>(fontObjectId + 1).fill(0);
  for (let id = 1; id <= fontObjectId; id += 1) {
    offsets[id] = Buffer.byteLength(pdf);
    pdf += `${id} 0 obj\n${objects.get(id)}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${fontObjectId + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let id = 1; id <= fontObjectId; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${fontObjectId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf);
}

async function installFixtureRoute(
  context: BrowserContext,
  baseUrl: string,
  pdfPath: string,
  pdf: Buffer | null,
): Promise<void> {
  if (!pdf) return;
  await context.route(`${baseUrl}/workspace/raw?*`, async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("path") !== pdfPath) {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/pdf",
      headers: {
        "Cache-Control": "no-store",
        "Content-Length": String(pdf.byteLength),
      },
      body: pdf,
    });
  });
}

async function installLegacyRuntimeEmulation(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    Reflect.deleteProperty(globalThis, "Iterator");
    Reflect.deleteProperty(Promise, "withResolvers");
    Reflect.deleteProperty(Math, "sumPrecise");
    for (const prototype of [Map.prototype, WeakMap.prototype]) {
      Reflect.deleteProperty(prototype, "getOrInsert");
      Object.defineProperty(prototype, "getOrInsertComputed", {
        configurable: true,
        writable: true,
        value() {
          throw new TypeError("simulated broken getOrInsertComputed implementation");
        },
      });
    }
  });
}

interface WorkerCompatibilityResult {
  __piclawCompatProbe?: boolean;
  ok: boolean;
  error?: string;
  iteratorType?: string;
  mapComputedWorks?: boolean;
}

async function probeWorkerCompatibility(page: Page): Promise<WorkerCompatibilityResult> {
  return page.evaluate(async () => {
    const workerBundleUrl = new URL(
      "/static/common/dist/pdf-viewer-worker.bundle.js?v=6.2.108-piclaw3-worker-probe",
      location.href,
    ).href;
    const source = `
      Reflect.deleteProperty(globalThis, "Iterator");
      Reflect.deleteProperty(Promise, "withResolvers");
      Reflect.deleteProperty(Math, "sumPrecise");
      for (const prototype of [Map.prototype, WeakMap.prototype]) {
        Reflect.deleteProperty(prototype, "getOrInsert");
        Object.defineProperty(prototype, "getOrInsertComputed", {
          configurable: true,
          writable: true,
          value() { throw new TypeError("simulated broken getOrInsertComputed implementation"); },
        });
      }
      import(${JSON.stringify(workerBundleUrl)}).then(() => {
        const marker = {};
        const map = new Map();
        const method = Reflect.get(Map.prototype, "getOrInsertComputed");
        const value = Reflect.apply(method, map, ["key", () => marker]);
        postMessage({
          __piclawCompatProbe: true,
          ok: true,
          iteratorType: typeof globalThis.Iterator,
          mapComputedWorks: value === marker && map.get("key") === marker,
        });
      }).catch((error) => {
        postMessage({ __piclawCompatProbe: true, ok: false, error: error && (error.stack || error.message) || String(error) });
      });
    `;
    const blobUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    const worker = new Worker(blobUrl, { type: "module" });
    try {
      return await new Promise<WorkerCompatibilityResult>((resolvePromise) => {
        const timeout = window.setTimeout(() => {
          resolvePromise({ ok: false, error: "Worker compatibility probe timed out." });
        }, 20_000);
        worker.onmessage = (event: MessageEvent<WorkerCompatibilityResult>) => {
          if (!event.data?.__piclawCompatProbe) return;
          window.clearTimeout(timeout);
          resolvePromise(event.data);
        };
        worker.onerror = (event) => {
          window.clearTimeout(timeout);
          resolvePromise({ ok: false, error: event.message || "Worker compatibility probe failed." });
        };
      });
    } finally {
      worker.terminate();
      URL.revokeObjectURL(blobUrl);
    }
  });
}

function watchPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText || "unknown";
    // PDF.js may intentionally abort its initial full request after selecting a
    // more suitable loading strategy. Rendering success is asserted separately.
    if (errorText === "net::ERR_ABORTED") return;
    errors.push(`Request failed: ${request.url()} (${errorText})`);
  });
  return errors;
}

async function swipeUp(cdp: CDPSession, x: number, fromY: number, toY: number): Promise<void> {
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y: fromY, id: 1, radiusX: 2, radiusY: 2, force: 1 }],
  });
  for (let step = 1; step <= 9; step += 1) {
    const y = fromY + ((toY - fromY) * step) / 9;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y, id: 1, radiusX: 2, radiusY: 2, force: 1 }],
    });
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 22));
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

async function pinchOut(cdp: CDPSession, centerX: number, centerY: number): Promise<void> {
  const point = (id: number, x: number) => ({
    x,
    y: centerY,
    id,
    radiusX: 2,
    radiusY: 2,
    force: 1,
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [point(1, centerX - 36), point(2, centerX + 36)],
  });
  for (let step = 1; step <= 8; step += 1) {
    const spread = 36 + step * 8;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [point(1, centerX - spread), point(2, centerX + spread)],
    });
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 25));
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function runDesktopScenario(
  browser: Browser,
  storageState: Awaited<ReturnType<typeof bootstrapE2EStorageState>> | undefined,
  args: Args,
  pdf: Buffer | null,
): Promise<ScenarioResult> {
  const context = await browser.newContext({
    storageState,
    viewport: { width: 1280, height: 800 },
  });
  const requests: string[] = [];
  try {
    await installFixtureRoute(context, args.baseUrl, args.pdfPath, pdf);
    const page = await context.newPage();
    const errors = watchPageErrors(page);
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(`${args.baseUrl}/pdf-viewer/?path=${encodeURIComponent(args.pdfPath)}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(() => document.body.dataset.pdfRenderer === "native");

    const objectData = await page.locator("object[type='application/pdf']").getAttribute("data");
    assert(objectData === `/workspace/raw?path=${encodeURIComponent(args.pdfPath)}`, `Unexpected native object URL: ${objectData}`);
    assert(!requests.some((url) => url.includes("pdf-viewer-mobile.bundle.js")), "Desktop loaded the mobile PDF.js bundle");
    assert(errors.length === 0, `Desktop page errors: ${errors.join(" | ")}`);

    return {
      name: "desktop-native-object",
      ok: true,
      details: {
        renderer: "native",
        objectData,
        loadedMobileBundle: false,
      },
    };
  } finally {
    await context.close();
  }
}

async function runMobileScenario(
  browser: Browser,
  storageState: Awaited<ReturnType<typeof bootstrapE2EStorageState>> | undefined,
  args: Args,
  pdf: Buffer | null,
): Promise<ScenarioResult> {
  const context = await browser.newContext({
    storageState,
    viewport: { width: 390, height: 780 },
    screen: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
    userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  });
  const requests: string[] = [];
  try {
    if (args.emulateLegacyRuntime) await installLegacyRuntimeEmulation(context);
    await installFixtureRoute(context, args.baseUrl, args.pdfPath, pdf);
    const page = await context.newPage();
    const errors = watchPageErrors(page);
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(`${args.baseUrl}/pdf-viewer/?path=${encodeURIComponent(args.pdfPath)}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(() => document.body.dataset.pdfRenderer === "pdfjs", null, { timeout: 60_000 });
    try {
      await page.locator(`.page[data-page-number="1"] canvas`).waitFor({ state: "visible", timeout: 60_000 });
      await page.getByText(`1 / ${args.expectedPageCount}`, { exact: true }).waitFor({ timeout: 30_000 });
    } catch (error) {
      const stateTitle = await page.locator("[data-pdf-state-title]").textContent().catch(() => "");
      const stateDetail = await page.locator("[data-pdf-state-detail]").textContent().catch(() => "");
      throw new Error([
        "PDF.js did not render page 1.",
        stateTitle || "",
        stateDetail || "",
        ...errors,
        error instanceof Error ? error.message : String(error),
      ].filter(Boolean).join(" | "), { cause: error });
    }

    const pageCompatibility = await page.evaluate(() => {
      const marker = {};
      const map = new Map();
      const weakMap = new WeakMap();
      const weakKey = {};
      const mapMethod = Reflect.get(Map.prototype, "getOrInsertComputed");
      const weakMapMethod = Reflect.get(WeakMap.prototype, "getOrInsertComputed");
      const mapValue = Reflect.apply(mapMethod, map, ["key", () => marker]);
      const weakMapValue = Reflect.apply(weakMapMethod, weakMap, [weakKey, () => marker]);
      return {
        iteratorType: typeof Reflect.get(globalThis, "Iterator"),
        mapComputedWorks: mapValue === marker && map.get("key") === marker,
        weakMapComputedWorks: weakMapValue === marker && weakMap.get(weakKey) === marker,
        workerMode: document.body.dataset.pdfWorkerMode || "",
      };
    });
    assert(pageCompatibility.iteratorType === "function", `Iterator compatibility was not installed (${pageCompatibility.iteratorType})`);
    assert(pageCompatibility.mapComputedWorks, "Map.getOrInsertComputed compatibility failed");
    assert(pageCompatibility.weakMapComputedWorks, "WeakMap.getOrInsertComputed compatibility failed");
    const expectedWorkerMode = args.emulateLegacyRuntime ? "fake" : "worker";
    assert(
      pageCompatibility.workerMode === expectedWorkerMode,
      `Unexpected PDF worker mode: ${pageCompatibility.workerMode} (expected ${expectedWorkerMode})`,
    );

    const workerCompatibility = await probeWorkerCompatibility(page);
    assert(workerCompatibility.ok, `Worker compatibility failed: ${workerCompatibility.error || "unknown error"}`);
    assert(workerCompatibility.iteratorType === "function", `Worker Iterator compatibility was not installed (${workerCompatibility.iteratorType})`);
    assert(workerCompatibility.mapComputedWorks, "Worker Map.getOrInsertComputed compatibility failed");

    const container = page.locator("[data-pdf-container]");
    const initialMetrics = await container.evaluate((element) => ({
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    }));
    const initialPageWidth = await page.locator('.page[data-page-number="1"]').evaluate((element) => element.getBoundingClientRect().width);
    assert(initialMetrics.scrollHeight > initialMetrics.clientHeight * 4, "PDF pages do not create a vertically scrollable document");
    assert(initialPageWidth <= initialMetrics.clientWidth + 1, "Fit-width page overflows the mobile viewport");
    assert(initialPageWidth >= initialMetrics.clientWidth * 0.75, "Fit-width page is unexpectedly narrow");

    const box = await container.boundingBox();
    assert(box, "PDF scroll container has no bounding box");
    const cdp = await context.newCDPSession(page);
    await swipeUp(cdp, box.x + box.width / 2, box.y + box.height * 0.8, box.y + box.height * 0.25);
    await page.waitForTimeout(350);
    const touchScrollTop = await container.evaluate((element) => element.scrollTop);
    assert(touchScrollTop > 80, `One-finger touch did not scroll the PDF container (${touchScrollTop}px)`);

    await container.evaluate((element) => { element.scrollTop = 0; });
    const beforePinchWidth = await page.locator('.page[data-page-number="1"]').evaluate((element) => element.getBoundingClientRect().width);
    await pinchOut(cdp, box.x + box.width / 2, box.y + Math.min(box.height * 0.45, 320));
    await page.waitForTimeout(500);
    const afterPinchWidth = await page.locator('.page[data-page-number="1"]').evaluate((element) => element.getBoundingClientRect().width);
    assert(afterPinchWidth > beforePinchWidth * 1.12, `Pinch zoom did not enlarge the page (${beforePinchWidth} -> ${afterPinchWidth})`);

    await page.getByRole("button", { name: "Fit to width" }).click();
    await page.waitForFunction((width) => {
      const pageElement = document.querySelector('.page[data-page-number="1"]');
      return !!pageElement && Math.abs(pageElement.getBoundingClientRect().width - width) < 3;
    }, initialPageWidth);
    const fitWidth = await page.locator('.page[data-page-number="1"]').evaluate((element) => element.getBoundingClientRect().width);

    await page.getByRole("button", { name: "Zoom in" }).click();
    await page.waitForFunction((width) => {
      const pageElement = document.querySelector('.page[data-page-number="1"]');
      return !!pageElement && pageElement.getBoundingClientRect().width > width * 1.05;
    }, fitWidth);
    const toolbarZoomWidth = await page.locator('.page[data-page-number="1"]').evaluate((element) => element.getBoundingClientRect().width);

    await page.getByRole("button", { name: "Fit to width" }).click();
    await container.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    await page.locator(`.page[data-page-number="${args.expectedPageCount}"] canvas`).waitFor({ state: "visible", timeout: 60_000 });
    await page.getByText(`${args.expectedPageCount} / ${args.expectedPageCount}`, { exact: true }).waitFor({ timeout: 30_000 });
    const canvasCount = await page.locator(".pdfViewer canvas").count();
    assert(canvasCount <= 10, `Too many page canvases retained after a long scroll: ${canvasCount}`);

    const screenshotPath = resolve(args.artifactDir, "mobile-pdf-viewer.png");
    await page.screenshot({ path: screenshotPath, fullPage: false });

    const requiredAssets = [
      "pdf-viewer-mobile.bundle.js",
      "pdf-viewer-worker.bundle.js",
      "/static/common/pdfjs/pdf_viewer.css",
    ];
    for (const asset of requiredAssets) {
      assert(requests.some((url) => url.includes(asset)), `Required PDF.js asset was not requested: ${asset}`);
    }
    assert(errors.length === 0, `Mobile page errors: ${errors.join(" | ")}`);

    return {
      name: "android-pdfjs",
      ok: true,
      details: {
        renderer: "pdfjs",
        pageCount: args.expectedPageCount,
        pdfPath: args.pdfPath,
        emulatedLegacyRuntime: args.emulateLegacyRuntime,
        pageCompatibility,
        workerCompatibility,
        initialPageWidth,
        touchScrollTop,
        afterPinchWidth,
        toolbarZoomWidth,
        retainedCanvasCount: canvasCount,
        screenshotPath,
      },
    };
  } finally {
    await context.close();
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  mkdirSync(args.artifactDir, { recursive: true });
  const reportPath = resolve(args.artifactDir, "report.json");
  const pdf = args.pdfPath === FIXTURE_PDF_PATH ? buildPdf(args.expectedPageCount) : null;
  const scenarios: ScenarioResult[] = [];
  let browser: Browser | null = null;
  let failure: unknown = null;

  try {
    const storageState = args.internalSecret
      ? await bootstrapE2EStorageState({ baseUrl: args.baseUrl, internalSecret: args.internalSecret })
      : undefined;
    browser = await chromium.launch({
      headless: args.headless,
      ...(args.executablePath ? { executablePath: args.executablePath } : {}),
    });
    scenarios.push(await runDesktopScenario(browser, storageState, args, pdf));
    scenarios.push(await runMobileScenario(browser, storageState, args, pdf));
  } catch (error) {
    failure = error;
  } finally {
    await browser?.close();
    const report = {
      ok: failure === null,
      baseUrl: args.baseUrl,
      pdfPath: args.pdfPath,
      expectedPageCount: args.expectedPageCount,
      emulatedLegacyRuntime: args.emulateLegacyRuntime,
      generatedAt: new Date().toISOString(),
      scenarios,
      error: failure instanceof Error ? failure.message : failure ? String(failure) : null,
    };
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    process.stdout.write(`${JSON.stringify({ ...report, reportPath })}\n`);
  }

  if (failure) throw failure;
}

await main();

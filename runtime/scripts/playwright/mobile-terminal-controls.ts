#!/usr/bin/env bun

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Locator,
  type Page,
} from 'playwright';

import { bootstrapE2EStorageState } from './web-auth-bootstrap.ts';

const DEFAULT_BASE_URL = process.env.PICLAW_E2E_BASE_URL || 'http://127.0.0.1:8080';
const DEFAULT_HEADLESS = process.env.PICLAW_E2E_HEADLESS !== '0';
const DEFAULT_EXECUTABLE_PATH = process.env.PICLAW_PLAYWRIGHT_EXECUTABLE_PATH || '';
const TOOLBAR_LABELS = ['Esc', 'Alt', 'Home', '↑', 'End', 'PgUp', 'Tab', 'Ctrl', '←', '↓', '→', 'PgDn'];

interface ScenarioResult {
  name: string;
  passed: boolean;
  details: Record<string, unknown>;
  error?: string;
}

function parseArgs(argv: string[]) {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    headless: DEFAULT_HEADLESS,
    executablePath: DEFAULT_EXECUTABLE_PATH,
    internalSecret: process.env.PICLAW_INTERNAL_SECRET || process.env.PICLAW_WEB_INTERNAL_SECRET || '',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const next = index + 1 < argv.length ? argv[index + 1] : '';
    if (value === '--base-url' && next) {
      args.baseUrl = next;
      index += 1;
    } else if (value === '--executable-path' && next) {
      args.executablePath = next;
      index += 1;
    } else if (value === '--internal-secret' && next) {
      args.internalSecret = next;
      index += 1;
    } else if (value === '--headed') {
      args.headless = false;
    }
  }
  return args;
}

function stampNow() {
  return new Date().toISOString().replace(/[.:]/g, '-');
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function countOccurrences(text: string, needle: string) {
  if (!needle) return 0;
  let count = 0;
  let offset = 0;
  while ((offset = text.indexOf(needle, offset)) >= 0) {
    count += 1;
    offset += needle.length;
  }
  return count;
}

function markerCommand(marker: string) {
  const splitAt = Math.floor(marker.length / 2);
  return `printf '%s%s\\n' '${marker.slice(0, splitAt)}' '${marker.slice(splitAt)}'`;
}

async function waitForApp(page: Page, baseUrl: string) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('.compose-box, .compose-editor, [data-testid="compose-box"]').first()
    .waitFor({ state: 'visible', timeout: 30_000 });
}

async function openConnectedTerminal(page: Page, options: { controlsVisible?: boolean } = {}) {
  const visibleRoot = page.locator('.terminal-pane-xterm:visible').first();
  if (!(await visibleRoot.isVisible().catch(() => false))) {
    await page.keyboard.press('Control+Backquote');
  }
  await visibleRoot.waitFor({ state: 'visible', timeout: 15_000 });
  await page.waitForFunction(() => {
    const root = document.querySelector('.terminal-pane-xterm');
    return root?.getAttribute('data-connection-status') === 'Connected';
  }, undefined, { timeout: 20_000 });
  const controls = visibleRoot.locator('[data-testid="terminal-mobile-controls"]');
  await controls.waitFor({ state: options.controlsVisible === false ? 'attached' : 'visible', timeout: 10_000 });
  return visibleRoot;
}

async function terminalTextarea(root: Locator) {
  const textarea = root.locator('.xterm-helper-textarea');
  await textarea.waitFor({ state: 'attached', timeout: 10_000 });
  return textarea;
}

async function typeInTerminal(page: Page, root: Locator, text: string) {
  const textarea = await terminalTextarea(root);
  await textarea.focus();
  await page.keyboard.type(text, { delay: 4 });
}

async function waitForOutputOccurrences(root: Locator, marker: string, minimum: number, timeout = 10_000) {
  const output = root.locator('[data-testid="terminal-output"]');
  await output.waitFor({ state: 'attached', timeout });
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const occurrences = countOccurrences(await output.textContent() || '', marker);
    if (occurrences >= minimum) return occurrences;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
  }
  const actual = countOccurrences(await output.textContent() || '', marker);
  throw new Error(`expected ${minimum} occurrences of ${marker} in terminal output, found ${actual}`);
}

async function inspectToolbar(root: Locator) {
  const toolbar = root.locator('[role="toolbar"][aria-label="Terminal controls"]');
  const buttons = toolbar.locator('button[data-terminal-control]');
  await toolbar.waitFor({ state: 'visible', timeout: 10_000 });
  const labels = await buttons.allTextContents();
  assert(labels.length === 12, `expected 12 terminal controls, found ${labels.length}`);
  assert(JSON.stringify(labels) === JSON.stringify(TOOLBAR_LABELS), `unexpected toolbar order: ${JSON.stringify(labels)}`);

  const sizes = await buttons.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  }));
  assert(sizes.every(({ width, height }) => width > 0 && height >= 44), `toolbar target size failure: ${JSON.stringify(sizes)}`);
  return { labels, sizes };
}

async function runMouseOnlyGate(page: Page, baseUrl: string, artifactDir: string) {
  await waitForApp(page, baseUrl);
  const root = await openConnectedTerminal(page, { controlsVisible: false });
  const surface = root.locator('[data-testid="terminal-mobile-controls"]');
  const buttonCount = await surface.locator('button').count();
  const surfaceBox = await surface.boundingBox();
  const media = await page.evaluate(() => ({
    fineHover: matchMedia('(hover: hover) and (pointer: fine)').matches,
    anyCoarse: matchMedia('(any-pointer: coarse)').matches,
  }));

  assert(media.fineHover, `mouse-only context did not expose fine hover media: ${JSON.stringify(media)}`);
  assert(!media.anyCoarse, `mouse-only context unexpectedly exposed a coarse pointer: ${JSON.stringify(media)}`);
  assert(await surface.isHidden(), 'touch-control surface should be hidden on a mouse-only device');
  assert(surfaceBox === null, `hidden touch-control surface retained layout space: ${JSON.stringify(surfaceBox)}`);
  assert(buttonCount === 13, `expected the hidden surface to retain 12 controls plus clipboard action, found ${buttonCount}`);
  await page.screenshot({ path: resolve(artifactDir, 'mouse-only-pane.png'), fullPage: true });

  return { media, surfaceHidden: true, surfaceBox, buttonCount };
}

async function runDesktopPaneAndPopout(page: Page, baseUrl: string, artifactDir: string) {
  await waitForApp(page, baseUrl);
  const root = await openConnectedTerminal(page);
  const toolbar = await inspectToolbar(root);

  const homeMarker = `__PICLAW_HOME_${Date.now()}__`;
  await typeInTerminal(page, root, 'this-command-must-stay-commented');
  await root.locator('[data-testid="terminal-control-home"]').click();
  await page.keyboard.type(`${markerCommand(homeMarker)}; # `, { delay: 4 });
  await page.keyboard.press('Enter');
  const homeOccurrences = await waitForOutputOccurrences(root, homeMarker, 1);

  await typeInTerminal(page, root, 'sleep 30');
  await page.keyboard.press('Enter');
  const ctrlButton = root.locator('[data-testid="terminal-control-ctrl"]');
  await ctrlButton.click();
  assert(await ctrlButton.getAttribute('aria-pressed') === 'true', 'Ctrl did not latch');
  await page.keyboard.press('c');
  assert(await ctrlButton.getAttribute('aria-pressed') === 'false', 'Ctrl did not clear after one character');

  const ctrlMarker = `__PICLAW_CTRL_${Date.now()}__`;
  await typeInTerminal(page, root, markerCommand(ctrlMarker));
  await page.keyboard.press('Enter');
  await waitForOutputOccurrences(root, ctrlMarker, 1);

  const clipboardButton = root.locator('[data-testid="terminal-clipboard-action"]');
  assert(await clipboardButton.isVisible(), 'desktop Paste action should be visible without a selection');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(page.url()).origin });
  const pasteMarker = `__PICLAW_PASTE_${Date.now()}__`;
  await page.evaluate(async (value) => navigator.clipboard.writeText(value), markerCommand(pasteMarker));
  await clipboardButton.click();
  await page.keyboard.press('Enter');
  await waitForOutputOccurrences(root, pasteMarker, 1);

  await page.screenshot({ path: resolve(artifactDir, 'desktop-pane.png'), fullPage: true });

  const popoutButton = page.getByRole('button', { name: 'Open terminal in window' }).first();
  await popoutButton.waitFor({ state: 'visible', timeout: 10_000 });
  const popupPromise = page.waitForEvent('popup', { timeout: 15_000 });
  await popoutButton.click();
  const popup = await popupPromise;
  let popoutDetails: Record<string, unknown>;

  try {
    await popup.waitForLoadState('domcontentloaded');
    const popupRoot = popup.locator('.terminal-pane-xterm:visible').first();
    await popupRoot.waitFor({ state: 'visible', timeout: 20_000 });
    await popup.waitForFunction(() => {
      const terminal = document.querySelector('.terminal-pane-xterm');
      return terminal?.getAttribute('data-connection-status') === 'Connected';
    }, undefined, { timeout: 25_000 });

    const popupToolbar = await inspectToolbar(popupRoot);
    const controlCount = await popup.locator('[data-testid="terminal-mobile-controls"]').count();
    const styleCount = await popup.locator('head #piclaw-terminal-style').count();
    assert(controlCount === 1, `expected one popout control surface, found ${controlCount}`);
    assert(styleCount === 1, `expected one owner-document terminal style, found ${styleCount}`);

    const popoutMarker = `__PICLAW_POPOUT_${Date.now()}__`;
    await typeInTerminal(popup, popupRoot, markerCommand(popoutMarker));
    await popup.keyboard.press('Enter');
    const popoutOccurrences = await waitForOutputOccurrences(popupRoot, popoutMarker, 1, 15_000);
    await popup.screenshot({ path: resolve(artifactDir, 'desktop-popout.png'), fullPage: true });
    popoutDetails = { controlCount, styleCount, toolbar: popupToolbar, popoutOccurrences };
  } finally {
    await popup.close().catch(() => undefined);
  }

  return {
    toolbar,
    homeOccurrences,
    ctrlConsumed: true,
    clipboardPaste: true,
    popout: popoutDetails,
  };
}

async function runAndroidGate(page: Page, baseUrl: string, artifactDir: string) {
  await waitForApp(page, baseUrl);
  const root = await openConnectedTerminal(page);
  const toolbar = await inspectToolbar(root);
  const clipboardButton = root.locator('[data-testid="terminal-clipboard-action"]');
  assert(await clipboardButton.isHidden(), 'Android Paste action should be hidden without a selection');

  const ctrlButton = root.locator('[data-testid="terminal-control-ctrl"]');
  await ctrlButton.tap();
  assert(await ctrlButton.getAttribute('aria-pressed') === 'true', 'Android touch did not latch Ctrl');
  const textarea = await terminalTextarea(root);
  await textarea.focus();
  await page.keyboard.press('c');
  assert(await ctrlButton.getAttribute('aria-pressed') === 'false', 'Android Ctrl did not clear after input');
  await page.screenshot({ path: resolve(artifactDir, 'android-pane.png'), fullPage: true });

  return { toolbar, clipboardHidden: true, ctrlTouchActivation: true };
}

async function runScenario(
  name: string,
  createContext: () => Promise<BrowserContext>,
  run: (page: Page) => Promise<Record<string, unknown>>,
  artifactDir: string,
): Promise<ScenarioResult> {
  let context: BrowserContext | null = null;
  try {
    context = await createContext();
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    const page = await context.newPage();
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));
    const details = await run(page);
    await context.tracing.stop({ path: resolve(artifactDir, `${name}-trace.zip`) });
    return { name, passed: true, details: { ...details, pageErrors } };
  } catch (error) {
    if (context) {
      const page = context.pages()[0];
      await page?.screenshot({ path: resolve(artifactDir, `${name}-failure.png`), fullPage: true }).catch(() => undefined);
      await context.tracing.stop({ path: resolve(artifactDir, `${name}-failure-trace.zip`) }).catch(() => undefined);
    }
    return {
      name,
      passed: false,
      details: {},
      error: error instanceof Error ? `${error.message}\n${error.stack || ''}` : String(error),
    };
  } finally {
    await context?.close().catch(() => undefined);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const response = await fetch(args.baseUrl);
  assert(response.ok, `Piclaw is not reachable at ${args.baseUrl}: HTTP ${response.status}`);

  const repoRoot = resolve(import.meta.dir, '..', '..', '..');
  const artifactDir = resolve(repoRoot, 'runtime', 'generated', 'cache', 'playwright-mobile-terminal-controls', stampNow());
  mkdirSync(artifactDir, { recursive: true });

  const storageState = args.internalSecret
    ? await bootstrapE2EStorageState({ baseUrl: args.baseUrl, internalSecret: args.internalSecret })
    : undefined;

  let browser: Browser | null = null;
  const results: ScenarioResult[] = [];
  try {
    browser = await chromium.launch({
      headless: args.headless,
      executablePath: args.executablePath || undefined,
    });

    results.push(await runScenario(
      'mouse-only-hidden',
      () => browser!.newContext({ storageState, viewport: { width: 1280, height: 900 } }),
      (page) => runMouseOnlyGate(page, args.baseUrl, artifactDir),
      artifactDir,
    ));

    results.push(await runScenario(
      'touch-capable-pane-and-popout',
      () => browser!.newContext({ storageState, viewport: { width: 1280, height: 900 }, hasTouch: true }),
      (page) => runDesktopPaneAndPopout(page, args.baseUrl, artifactDir),
      artifactDir,
    ));

    results.push(await runScenario(
      'android-pane',
      () => browser!.newContext({
        storageState,
        viewport: { width: 393, height: 851 },
        deviceScaleFactor: 2.75,
        hasTouch: true,
        isMobile: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
      }),
      (page) => runAndroidGate(page, args.baseUrl, artifactDir),
      artifactDir,
    ));
  } finally {
    await browser?.close().catch(() => undefined);
  }

  const report = {
    baseUrl: args.baseUrl,
    artifactDir,
    generatedAt: new Date().toISOString(),
    results,
  };
  writeFileSync(resolve(artifactDir, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  const failures = results.filter((result) => !result.passed);
  if (failures.length > 0) {
    throw new Error(`${failures.length} mobile terminal E2E scenario(s) failed. Artifacts: ${artifactDir}`);
  }
  console.log(`[mobile-terminal-controls] PASS — artifacts: ${artifactDir}`);
}

await main();

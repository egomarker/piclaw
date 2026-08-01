#!/usr/bin/env bun

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

import { bootstrapE2EStorageState } from './web-auth-bootstrap.ts';

const DEFAULT_BASE_URL = process.env.PICLAW_E2E_BASE_URL || 'http://127.0.0.1:8080';
const DEFAULT_EXECUTABLE_PATH = process.env.PICLAW_PLAYWRIGHT_EXECUTABLE_PATH || '';
const DEFAULT_HEADLESS = process.env.PICLAW_E2E_HEADLESS !== '0';
const DEFAULT_FILE_PATH = process.env.PICLAW_MOBILE_E2E_FILE || 'AGENTS.md';

const viewports = [
  { name: 'phone-portrait', width: 390, height: 664, compactWorkspace: true },
  { name: 'tablet-portrait', width: 768, height: 1024, compactWorkspace: true },
  { name: 'tablet-landscape', width: 1024, height: 800, compactWorkspace: false },
] as const;

type ScenarioResult = Record<string, unknown>;
type ScenarioContext = {
  context: BrowserContext;
  page: Page;
  consoleLines: string[];
  pageErrors: string[];
};

function parseArgs(argv: string[]) {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    executablePath: DEFAULT_EXECUTABLE_PATH,
    filePath: DEFAULT_FILE_PATH,
    headless: DEFAULT_HEADLESS,
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
    } else if (value === '--file-path' && next) {
      args.filePath = next;
      index += 1;
    } else if (value === '--internal-secret' && next) {
      args.internalSecret = next;
      index += 1;
    } else if (value === '--headed') {
      args.headless = false;
    }
  }

  args.baseUrl = args.baseUrl.trim().replace(/\/$/, '');
  args.filePath = args.filePath.trim().replace(/^\/+/, '');
  if (!args.baseUrl) throw new Error('Missing --base-url.');
  if (!args.filePath) throw new Error('Missing --file-path.');
  return args;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stampNow() {
  return new Date().toISOString().replace(/[.:]/g, '-');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tabByLabel(page: Page, label: string) {
  return page.locator('[role="tab"]').filter({ hasText: new RegExp(`^${escapeRegExp(label)}$`) });
}

async function readRect(page: Page, selector: string) {
  return await page.locator(selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });
}

async function assertMobileShell(page: Page) {
  const mode = await page.evaluate(() => document.documentElement.dataset.piclawUi || null);
  assert(mode === 'mobile', `Expected Mobile UI mode, received ${String(mode)}.`);
  await page.locator('.app-shell.mobile-interface').waitFor({ state: 'visible', timeout: 20000 });
}

async function showWorkspace(page: Page, compactWorkspace: boolean) {
  const sidebar = page.locator('.workspace-sidebar');
  await sidebar.waitFor({ state: 'attached', timeout: 15000 });

  if (compactWorkspace) {
    const workspaceTab = page.locator('#piclaw-mobile-surface-tab-workspace');
    await workspaceTab.waitFor({ state: 'visible', timeout: 15000 });
    await workspaceTab.click();
  } else {
    assert(await page.locator('#piclaw-mobile-surface-tab-workspace').count() === 0,
      'Wide Mobile must use the Workspace rail instead of a Workspace tab.');
    if (!(await sidebar.isVisible())) {
      const toggle = page.locator('.workspace-toggle-tab');
      await toggle.waitFor({ state: 'visible', timeout: 15000 });
      await toggle.click();
    }
  }

  await sidebar.waitFor({ state: 'visible', timeout: 15000 });
  const rect = await readRect(page, '.workspace-sidebar');
  assert(rect.width > 0 && rect.height > 0,
    `Workspace has zero geometry: ${JSON.stringify(rect)}.`);
  return rect;
}

async function openWorkspaceFile(page: Page, filePath: string) {
  const fileLabel = basename(filePath);
  const rowSelector = `.workspace-row[data-path=${JSON.stringify(filePath)}]`;
  const row = page.locator(rowSelector);
  await row.waitFor({ state: 'visible', timeout: 20000 });
  await row.click();

  const previewTitle = page.locator('.workspace-preview-title');
  await previewTitle.waitFor({ state: 'visible', timeout: 15000 });
  assert((await previewTitle.textContent())?.trim() === filePath,
    `Workspace preview selected the wrong path: ${String(await previewTitle.textContent())}.`);

  const editButton = page.locator('.workspace-preview-actions .workspace-edit');
  await editButton.waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForFunction(() => {
    const button = document.querySelector<HTMLButtonElement>('.workspace-preview-actions .workspace-edit');
    return button && !button.disabled;
  }, undefined, { timeout: 15000 });
  await editButton.click();

  const fileTab = tabByLabel(page, fileLabel);
  await fileTab.waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForFunction((label) => {
    const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
    const tab = tabs.find((candidate) => candidate.querySelector('.tab-label')?.textContent?.trim() === label);
    return tab?.getAttribute('aria-selected') === 'true';
  }, fileLabel, { timeout: 15000 });

  const paneRect = await readRect(page, '.editor-pane-host');
  assert(paneRect.width > 0 && paneRect.height > 0,
    `Opened pane has zero geometry: ${JSON.stringify(paneRect)}.`);
  return { fileLabel, paneRect };
}

async function openTerminalFromMenu(page: Page) {
  const menuButton = page.locator('[data-testid="hamburger"]');
  await menuButton.waitFor({ state: 'visible', timeout: 15000 });
  await menuButton.click();
  const terminalMenuItem = page.getByRole('menuitem', { name: /open terminal/i });
  await terminalMenuItem.waitFor({ state: 'visible', timeout: 15000 });
  await terminalMenuItem.click();

  const terminalTab = tabByLabel(page, 'Terminal');
  await terminalTab.waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForFunction(() => {
    const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
    const tab = tabs.find((candidate) => candidate.querySelector('.tab-label')?.textContent?.trim() === 'Terminal');
    return tab?.getAttribute('aria-selected') === 'true';
  }, undefined, { timeout: 15000 });
  return terminalTab;
}

async function collectTabState(page: Page) {
  return await page.evaluate(() => ({
    activeElementId: (document.activeElement as HTMLElement | null)?.id || null,
    shellClass: document.querySelector('.app-shell')?.className || null,
    tabs: Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]')).map((tab) => ({
      id: tab.id || null,
      label: tab.querySelector('.tab-label')?.textContent?.trim() || '',
      selected: tab.getAttribute('aria-selected'),
      tabIndex: tab.tabIndex,
      controls: tab.getAttribute('aria-controls'),
    })),
    chatPanel: (() => {
      const panel = document.getElementById('piclaw-mobile-surface-panel-chat');
      return panel ? {
        labelledBy: panel.getAttribute('aria-labelledby'),
        ariaHidden: panel.getAttribute('aria-hidden'),
        inert: panel.hasAttribute('inert'),
      } : null;
    })(),
    panePanel: (() => {
      const panel = document.getElementById('piclaw-mobile-surface-panel-pane');
      return panel ? {
        labelledBy: panel.getAttribute('aria-labelledby'),
        ariaHidden: panel.getAttribute('aria-hidden'),
        inert: panel.hasAttribute('inert'),
      } : null;
    })(),
  }));
}

async function createScenarioContext(browser: Browser, storageState: any, viewport: { width: number; height: number }): Promise<ScenarioContext> {
  const context = await browser.newContext({
    storageState,
    viewport,
    screen: viewport,
    hasTouch: true,
    isMobile: true,
    locale: 'en-US',
  });
  await context.addInitScript(() => {
    localStorage.setItem('piclaw:oobe:provider-missing:dismissed', 'true');
    localStorage.setItem('piclawPwaDisplayScalePercent', '100');
    localStorage.setItem('workspaceOpen.desktop', 'true');
  });
  const page = await context.newPage();
  const consoleLines: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (message) => consoleLines.push(`[${message.type()}] ${message.text()}`));
  page.on('pageerror', (error) => pageErrors.push(error.message));
  return { context, page, consoleLines, pageErrors };
}

async function runScenario(options: {
  browser: Browser;
  storageState: any;
  baseUrl: string;
  artifactDir: string;
  name: string;
  viewport: { width: number; height: number };
  run: (page: Page) => Promise<ScenarioResult>;
}) {
  const scenario = await createScenarioContext(options.browser, options.storageState, options.viewport);
  const tracePath = join(options.artifactDir, `${options.name}-trace.zip`);
  const screenshotPath = join(options.artifactDir, `${options.name}.png`);
  const failurePath = join(options.artifactDir, `${options.name}-failure.png`);
  await scenario.context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  try {
    await scenario.page.goto(options.baseUrl, { waitUntil: 'domcontentloaded' });
    await assertMobileShell(scenario.page);
    const result = await options.run(scenario.page);
    await scenario.page.screenshot({ path: screenshotPath, fullPage: true });
    assert(scenario.pageErrors.length === 0,
      `${options.name} raised browser page errors: ${scenario.pageErrors.join('; ')}`);
    return {
      name: options.name,
      viewport: options.viewport,
      screenshotPath,
      tracePath,
      consoleLines: scenario.consoleLines,
      pageErrors: scenario.pageErrors,
      ...result,
    };
  } catch (error) {
    try {
      await scenario.page.screenshot({ path: failurePath, fullPage: true });
      writeFileSync(join(options.artifactDir, `${options.name}-failure.html`), await scenario.page.content());
    } catch (captureError) {
      console.warn(`[mobile-interface-e2e] Failure artifact capture also failed for ${options.name}:`, captureError);
    }
    throw error;
  } finally {
    try {
      await scenario.context.tracing.stop({ path: tracePath });
    } catch (traceError) {
      console.warn(`[mobile-interface-e2e] Trace capture failed for ${options.name}:`, traceError);
    }
    await scenario.context.close();
  }
}

async function runViewportScenario(page: Page, compactWorkspace: boolean, filePath: string) {
  const workspaceRect = await showWorkspace(page, compactWorkspace);
  const opened = await openWorkspaceFile(page, filePath);
  return {
    compactWorkspace,
    workspaceRect,
    ...opened,
  };
}

async function runKeyboardScenario(page: Page, filePath: string) {
  await showWorkspace(page, true);
  const opened = await openWorkspaceFile(page, filePath);
  const terminalTab = await openTerminalFromMenu(page);
  await terminalTab.focus();

  await page.keyboard.press('Home');
  await page.waitForFunction(() => {
    const chat = document.getElementById('piclaw-mobile-surface-tab-chat');
    return document.activeElement === chat && chat?.getAttribute('aria-selected') === 'true';
  }, undefined, { timeout: 15000 });
  const chatState = await collectTabState(page);
  assert(chatState.chatPanel?.ariaHidden === null && chatState.chatPanel?.inert === false,
    `Chat panel is inactive after keyboard navigation: ${JSON.stringify(chatState.chatPanel)}.`);
  assert(chatState.panePanel?.ariaHidden === 'true' && chatState.panePanel?.inert === true,
    `Pane panel remains exposed while Chat is active: ${JSON.stringify(chatState.panePanel)}.`);

  await page.keyboard.press('End');
  await page.waitForFunction(() => {
    const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
    const terminal = tabs.find((tab) => tab.querySelector('.tab-label')?.textContent?.trim() === 'Terminal');
    return terminal?.getAttribute('aria-selected') === 'true';
  }, undefined, { timeout: 15000 });
  const terminalState = await collectTabState(page);
  assert(terminalState.chatPanel?.ariaHidden === 'true' && terminalState.chatPanel?.inert === true,
    `Chat panel remains exposed while Terminal is active: ${JSON.stringify(terminalState.chatPanel)}.`);
  assert(terminalState.panePanel?.ariaHidden === null && terminalState.panePanel?.inert === false,
    `Pane panel is inactive after keyboard navigation: ${JSON.stringify(terminalState.panePanel)}.`);

  const activeTerminalTab = tabByLabel(page, 'Terminal');
  const closeButton = activeTerminalTab.locator('.tab-close');
  await closeButton.focus();
  await page.keyboard.press('Enter');
  await activeTerminalTab.waitFor({ state: 'detached', timeout: 15000 });
  await page.waitForFunction((expectedLabel) => {
    const active = document.activeElement as HTMLElement | null;
    return active?.getAttribute('role') === 'tab'
      && active.getAttribute('aria-selected') === 'true'
      && active.tabIndex === 0
      && active.querySelector('.tab-label')?.textContent?.trim() === expectedLabel;
  }, opened.fileLabel, { timeout: 15000 });

  const afterCloseState = await collectTabState(page);
  const zeroTabStops = afterCloseState.tabs.filter((tab) => tab.tabIndex === 0);
  assert(zeroTabStops.length === 1 && zeroTabStops[0]?.label === opened.fileLabel,
    `Close focus did not land on the sole roving tab stop: ${JSON.stringify(afterCloseState.tabs)}.`);

  return {
    opened,
    chatState,
    terminalState,
    afterCloseState,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = resolve(import.meta.dir, '..', '..', '..');
  const artifactDir = resolve(repoRoot, 'runtime', 'generated', 'cache', 'playwright-mobile-interface', stampNow());
  mkdirSync(artifactDir, { recursive: true });

  const storageState = args.internalSecret.trim()
    ? await bootstrapE2EStorageState({ baseUrl: args.baseUrl, internalSecret: args.internalSecret })
    : undefined;
  const browser = await chromium.launch({
    headless: args.headless,
    executablePath: args.executablePath || undefined,
  });
  const results: ScenarioResult[] = [];

  try {
    for (const viewport of viewports) {
      results.push(await runScenario({
        browser,
        storageState,
        baseUrl: args.baseUrl,
        artifactDir,
        name: viewport.name,
        viewport,
        run: (page) => runViewportScenario(page, viewport.compactWorkspace, args.filePath),
      }));
    }

    results.push(await runScenario({
      browser,
      storageState,
      baseUrl: args.baseUrl,
      artifactDir,
      name: 'keyboard-navigation-and-close-focus',
      viewport: { width: 390, height: 664 },
      run: (page) => runKeyboardScenario(page, args.filePath),
    }));

    const reportPath = join(artifactDir, 'report.json');
    writeFileSync(reportPath, JSON.stringify({
      baseUrl: args.baseUrl,
      filePath: args.filePath,
      generatedAt: new Date().toISOString(),
      results,
    }, null, 2));
    console.log(`[mobile-interface-e2e] PASS (${results.length} scenarios)`);
    console.log(`[mobile-interface-e2e] Report: ${reportPath}`);
  } finally {
    await browser.close();
  }
}

await main();

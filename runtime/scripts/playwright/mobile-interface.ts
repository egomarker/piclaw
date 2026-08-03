#!/usr/bin/env bun

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { chromium, type Browser, type BrowserContext, type Locator, type Page } from 'playwright';

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

async function readReplyAvatarProbe(page: Page) {
  return await page.evaluate(() => {
    const shell = document.querySelector<HTMLElement>('.app-shell.mobile-interface');
    const container = shell?.querySelector<HTMLElement>(':scope > .container');
    if (!shell || !container) return null;

    const reply = document.createElement('article');
    reply.className = 'post thread-reply';
    reply.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
    const avatar = document.createElement('div');
    avatar.className = 'post-avatar';
    avatar.textContent = 'A';
    reply.appendChild(avatar);
    container.appendChild(reply);

    const style = getComputedStyle(avatar);
    const rect = avatar.getBoundingClientRect();
    const result = {
      editorOpen: shell.classList.contains('editor-open'),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      minWidth: Math.round(Number.parseFloat(style.minWidth) || 0),
      minHeight: Math.round(Number.parseFloat(style.minHeight) || 0),
      flexBasis: style.flexBasis,
    };
    reply.remove();
    return result;
  });
}

async function assertMobileShell(page: Page) {
  const mode = await page.evaluate(() => document.documentElement.dataset.piclawUi || null);
  assert(mode === 'mobile', `Expected Mobile UI mode, received ${String(mode)}.`);
  await page.locator('.app-shell.mobile-interface').waitFor({ state: 'visible', timeout: 20000 });
}

async function verifyComposeTerminalDockControl(page: Page) {
  const button = page.locator('[data-testid="compose-terminal-dock-toggle"]');
  await button.waitFor({ state: 'visible', timeout: 15000 });
  const initialState = await button.evaluate((element) => ({
    firstComposeAction: element.parentElement?.firstElementChild === element,
    ariaPressed: element.getAttribute('aria-pressed'),
    ariaLabel: element.getAttribute('aria-label'),
  }));
  assert(initialState.firstComposeAction,
    'Terminal dock control is not the first compose action.');
  assert(initialState.ariaPressed === 'false' && initialState.ariaLabel === 'Show terminal',
    `Terminal dock control has the wrong closed state: ${JSON.stringify(initialState)}.`);

  await button.click();
  await page.waitForFunction(() => {
    const control = document.querySelector('[data-testid="compose-terminal-dock-toggle"]');
    const dock = document.querySelector('.dock-panel');
    return control?.getAttribute('aria-pressed') === 'true'
      && control?.getAttribute('aria-label') === 'Hide terminal'
      && dock && !dock.classList.contains('hidden');
  }, undefined, { timeout: 15000 });
  const dockRect = await readRect(page, '.dock-panel:not(.hidden)');
  assert(dockRect.width > 0 && dockRect.height > 0,
    `Terminal dock has zero geometry: ${JSON.stringify(dockRect)}.`);

  await button.click();
  await page.waitForFunction(() => {
    const control = document.querySelector('[data-testid="compose-terminal-dock-toggle"]');
    const dock = document.querySelector('.dock-panel');
    return control?.getAttribute('aria-pressed') === 'false'
      && dock?.classList.contains('hidden');
  }, undefined, { timeout: 15000 });

  return { initialState, openDockRect: dockRect };
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

  const firstRow = sidebar.locator('.workspace-row').first();
  await firstRow.waitFor({ state: 'visible', timeout: 20000 });
  const treeSizing = await sidebar.evaluate((element) => {
    const row = element.querySelector<HTMLElement>('.workspace-row');
    const label = row?.querySelector<HTMLElement>('.workspace-label');
    const shell = element.closest<HTMLElement>('.app-shell.mobile-interface');
    const sidebarStyle = getComputedStyle(element);
    return {
      scale: element.getAttribute('data-workspace-scale'),
      workspaceTabActive: Boolean(shell?.classList.contains('mobile-workspace-active')),
      configuredRowHeight: sidebarStyle.getPropertyValue('--workspace-row-height').trim(),
      measuredRowHeight: row ? Math.round(row.getBoundingClientRect().height) : 0,
      configuredFontSize: sidebarStyle.getPropertyValue('--workspace-tree-font-size').trim(),
      measuredLabelFontSize: label ? getComputedStyle(label).fontSize : null,
    };
  });
  const expectedRowHeight = compactWorkspace ? 44 : 30;
  const expectedFontSize = compactWorkspace ? 16 : 14;
  assert(
    treeSizing.scale === 'comfortable'
      && treeSizing.workspaceTabActive === compactWorkspace
      && treeSizing.configuredRowHeight === `${expectedRowHeight}px`
      && treeSizing.measuredRowHeight === expectedRowHeight
      && treeSizing.configuredFontSize === `${expectedFontSize}px`
      && treeSizing.measuredLabelFontSize === `${expectedFontSize}px`,
    `Mobile comfortable Workspace sizing is wrong: ${JSON.stringify(treeSizing)}.`,
  );

  return { ...rect, treeSizing };
}

async function dispatchWorkspaceTouch(
  target: Locator,
  type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel',
  identifier: number,
  x: number,
  y: number,
) {
  await target.evaluate((element, touchInit) => {
    const touch = new Touch({
      identifier: touchInit.identifier,
      target: element,
      clientX: touchInit.x,
      clientY: touchInit.y,
      pageX: touchInit.x,
      pageY: touchInit.y,
      screenX: touchInit.x,
      screenY: touchInit.y,
      radiusX: 1,
      radiusY: 1,
      force: 0.5,
    });
    const touches = touchInit.type === 'touchend' || touchInit.type === 'touchcancel' ? [] : [touch];
    element.dispatchEvent(new TouchEvent(touchInit.type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      touches,
      targetTouches: touches,
      changedTouches: [touch],
    }));
  }, { type, identifier, x, y });
}

async function verifyWorkspaceTouchDragLongPress(page: Page, filePath: string) {
  const row = page.locator(`.workspace-row[data-path=${JSON.stringify(filePath)}]`);
  const label = row.locator('.workspace-label-text');
  await label.waitFor({ state: 'visible', timeout: 20000 });
  const point = await label.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.left + Math.min(rect.width / 2, 24)),
      y: Math.round(rect.top + (rect.height / 2)),
    };
  });
  const ghost = page.locator('.workspace-drag-ghost');
  const sidebar = page.locator('.workspace-sidebar');

  await dispatchWorkspaceTouch(label, 'touchstart', 201, point.x, point.y);
  await page.waitForTimeout(50);
  await dispatchWorkspaceTouch(label, 'touchmove', 201, point.x, point.y + 16);
  await page.waitForTimeout(750);
  assert(await ghost.count() === 0 && !(await sidebar.evaluate((element) => element.classList.contains('workspace-drop-active'))),
    'Workspace touch movement before the long-press delay started a drag instead of preserving scroll intent.');
  await dispatchWorkspaceTouch(label, 'touchend', 201, point.x, point.y + 16);

  await dispatchWorkspaceTouch(label, 'touchstart', 202, point.x, point.y);
  await page.waitForTimeout(200);
  assert(await ghost.count() === 0,
    'Workspace touch drag activated before the 700ms long-press delay elapsed.');
  await ghost.waitFor({ state: 'visible', timeout: 1500 });
  const active = await sidebar.evaluate((element) => element.classList.contains('workspace-drop-active'));
  assert(active, 'Workspace long press rendered a drag ghost without entering active drag mode.');
  await page.waitForTimeout(50);
  const ghostPosition = await ghost.evaluate((element, contactPoint) => {
    const rect = element.getBoundingClientRect();
    const desiredLeft = contactPoint.x - (rect.width / 2);
    const expectedLeft = Math.min(
      Math.max(desiredLeft, 8),
      Math.max(8, window.innerWidth - rect.width - 8),
    );
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      expectedLeft,
      horizontalCenterDeltaPx: (rect.left + (rect.width / 2)) - contactPoint.x,
      gapAboveFingerPx: contactPoint.y - rect.bottom,
    };
  }, point);
  assert(Math.abs(ghostPosition.left - ghostPosition.expectedLeft) <= 1,
    `Touch drag ghost was not horizontally centered or edge-clamped: ${JSON.stringify(ghostPosition)}.`);
  assert(Math.abs(ghostPosition.gapAboveFingerPx - 50) <= 1,
    `Touch drag ghost was not positioned 50px above the finger: ${JSON.stringify(ghostPosition)}.`);
  await dispatchWorkspaceTouch(label, 'touchcancel', 202, point.x, point.y);
  await ghost.waitFor({ state: 'detached', timeout: 1500 });
  assert(!(await sidebar.evaluate((element) => element.classList.contains('workspace-drop-active'))),
    'Workspace touch cancel left drag mode active.');

  return {
    delayMs: 700,
    preDelayMovementPx: 16,
    preDelayMovementCancelledDrag: true,
    longPressActivatedDrag: true,
    touchGhostPosition: {
      horizontalCenterDeltaPx: ghostPosition.horizontalCenterDeltaPx,
      gapAboveFingerPx: ghostPosition.gapAboveFingerPx,
      edgePaddingPx: 8,
    },
    touchCancelClearedDrag: true,
  };
}

async function openWorkspaceFile(page: Page, filePath: string) {
  const fileLabel = basename(filePath);
  const rowSelector = `.workspace-row[data-path=${JSON.stringify(filePath)}]`;
  const row = page.locator(rowSelector);
  await row.waitFor({ state: 'visible', timeout: 20000 });
  const topAnchorSelector = await page.locator('.tab-strip').count() > 0
    ? '.tab-strip'
    : '.workspace-header';
  const topAnchorBefore = (await readRect(page, topAnchorSelector)).y;
  await row.tap();

  const previewTitle = page.locator('.workspace-preview-title');
  await previewTitle.waitFor({ state: 'visible', timeout: 15000 });
  assert((await previewTitle.textContent())?.trim() === filePath,
    `Workspace preview selected the wrong path: ${String(await previewTitle.textContent())}.`);
  await page.waitForTimeout(250);

  const touchPreviewState = await page.evaluate((selector) => {
    const active = document.activeElement as HTMLElement | null;
    const topAnchor = document.querySelector<HTMLElement>(selector);
    return {
      activeClass: active?.className || null,
      treeListFocused: Boolean(active?.classList.contains('workspace-tree-list')),
      windowScrollY: Math.round(window.scrollY),
      scrollingElementScrollTop: Math.round(document.scrollingElement?.scrollTop || 0),
      visualViewportPageTop: Math.round(window.visualViewport?.pageTop || 0),
      visualViewportOffsetTop: Math.round(window.visualViewport?.offsetTop || 0),
      topAnchor: selector,
      topAnchorTop: Math.round(topAnchor?.getBoundingClientRect().top || 0),
    };
  }, topAnchorSelector);
  assert(!touchPreviewState.treeListFocused,
    `Touch selection forced focus onto the Workspace tree: ${JSON.stringify(touchPreviewState)}.`);
  assert(
    touchPreviewState.windowScrollY === 0
      && touchPreviewState.scrollingElementScrollTop === 0
      && touchPreviewState.visualViewportPageTop === 0
      && touchPreviewState.visualViewportOffsetTop === 0,
    `Workspace preview refresh shifted the root viewport: ${JSON.stringify(touchPreviewState)}.`,
  );
  assert(Math.abs(touchPreviewState.topAnchorTop - topAnchorBefore) <= 1,
    `Workspace preview refresh moved ${topAnchorSelector}: before=${topAnchorBefore}, after=${touchPreviewState.topAnchorTop}.`);

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
  return { fileLabel, paneRect, touchPreviewState };
}

async function verifyTouchTabContextMenu(page: Page, filePath: string, fileLabel: string) {
  const chatTab = page.locator('#piclaw-mobile-surface-tab-chat');
  const fileTab = tabByLabel(page, fileLabel);
  const menu = page.locator('[data-testid="tab-context-menu"]');
  const point = await fileTab.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.left + Math.min(rect.width / 2, 28)),
      y: Math.round(rect.top + (rect.height / 2)),
    };
  });
  const pointer = (type: 'pointerdown' | 'pointermove' | 'pointerup', pointerId: number, x = point.x, y = point.y) => fileTab.dispatchEvent(type, {
    pointerType: 'touch',
    pointerId,
    isPrimary: true,
    button: 0,
    buttons: type === 'pointerup' ? 0 : 1,
    clientX: x,
    clientY: y,
  });
  const compatibilityMouseDown = () => fileTab.dispatchEvent('mousedown', {
    button: 0,
    buttons: 1,
    clientX: point.x,
    clientY: point.y,
  });
  const compatibilityClick = () => fileTab.dispatchEvent('click', {
    button: 0,
    buttons: 0,
    detail: 1,
    clientX: point.x,
    clientY: point.y,
  });
  const readSelection = async () => ({
    chat: await chatTab.getAttribute('aria-selected'),
    file: await fileTab.getAttribute('aria-selected'),
  });

  await chatTab.click();
  await page.waitForFunction(() => document.getElementById('piclaw-mobile-surface-tab-chat')?.getAttribute('aria-selected') === 'true');

  // A drag must cancel the timer and must not activate the held background tab.
  await pointer('pointerdown', 71);
  await compatibilityMouseDown();
  await pointer('pointermove', 71, point.x + 24, point.y);
  await page.waitForTimeout(600);
  assert(await menu.count() === 0, 'Moving a touch press opened a tab context menu.');
  await pointer('pointerup', 71, point.x + 24, point.y);
  await compatibilityClick();
  const afterDrag = await readSelection();
  assert(afterDrag.chat === 'true' && afterDrag.file === 'false',
    `A moved touch press activated the background tab: ${JSON.stringify(afterDrag)}.`);

  // Holding the close target must neither start the fallback timer nor bubble a native context menu.
  const closeButton = fileTab.locator('.tab-close');
  const closePoint = await closeButton.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { x: Math.round(rect.left + (rect.width / 2)), y: Math.round(rect.top + (rect.height / 2)) };
  });
  await closeButton.dispatchEvent('pointerdown', {
    pointerType: 'touch', pointerId: 74, isPrimary: true, button: 0, buttons: 1,
    clientX: closePoint.x, clientY: closePoint.y,
  });
  await closeButton.dispatchEvent('contextmenu', {
    button: 2, clientX: closePoint.x, clientY: closePoint.y,
  });
  await page.waitForTimeout(600);
  assert(await menu.count() === 0, 'Holding a Mobile tab close target opened the tab context menu.');
  await closeButton.dispatchEvent('pointerup', {
    pointerType: 'touch', pointerId: 74, isPrimary: true, button: 0, buttons: 0,
    clientX: closePoint.x, clientY: closePoint.y,
  });

  // A short touch still activates normally even though its compatibility mouse events are suppressed.
  await pointer('pointerdown', 72);
  await compatibilityMouseDown();
  await page.waitForTimeout(50);
  await pointer('pointerup', 72);
  await compatibilityClick();
  await page.waitForFunction((label) => {
    const tab = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'))
      .find((candidate) => candidate.querySelector('.tab-label')?.textContent?.trim() === label);
    return tab?.getAttribute('aria-selected') === 'true';
  }, fileLabel);

  await chatTab.click();
  await page.waitForFunction(() => document.getElementById('piclaw-mobile-surface-tab-chat')?.getAttribute('aria-selected') === 'true');

  // A recognized long press opens the held tab's menu without activating it.
  await pointer('pointerdown', 73);
  await compatibilityMouseDown();
  await page.waitForTimeout(600);
  await menu.waitFor({ state: 'visible', timeout: 15000 });
  assert(await menu.count() === 1, `Long press rendered ${await menu.count()} context menus.`);
  const longPressState = {
    ...(await readSelection()),
    targetId: await menu.getAttribute('data-tab-id'),
  };
  assert(
    longPressState.chat === 'true'
      && longPressState.file === 'false'
      && longPressState.targetId === filePath,
    `Long press targeted or activated the wrong tab: ${JSON.stringify(longPressState)}.`,
  );

  await pointer('pointerup', 73);
  await compatibilityClick();
  assert(await menu.isVisible(), 'The compatibility click dismissed the recognized long-press menu.');
  const afterRelease = await readSelection();
  assert(afterRelease.chat === 'true' && afterRelease.file === 'false',
    `Long-press release activated the background tab: ${JSON.stringify(afterRelease)}.`);

  await chatTab.click();
  await menu.waitFor({ state: 'detached', timeout: 15000 });

  // Android can emit native contextmenu before the fallback timer. It must reuse
  // the same menu state and cancel the pending fallback rather than rendering twice.
  await pointer('pointerdown', 75);
  await compatibilityMouseDown();
  await page.waitForTimeout(100);
  await fileTab.dispatchEvent('contextmenu', {
    button: 2,
    clientX: point.x,
    clientY: point.y,
  });
  await page.waitForTimeout(600);
  await menu.waitFor({ state: 'visible', timeout: 15000 });
  const nativeMenuCount = await menu.count();
  assert(nativeMenuCount === 1, `Native contextmenu plus fallback rendered ${nativeMenuCount} menus.`);
  assert(await menu.getAttribute('data-tab-id') === filePath,
    `Native contextmenu targeted ${String(await menu.getAttribute('data-tab-id'))} instead of ${filePath}.`);
  const afterNativeContextMenu = await readSelection();
  assert(afterNativeContextMenu.chat === 'true' && afterNativeContextMenu.file === 'false',
    `Native contextmenu activated the background tab: ${JSON.stringify(afterNativeContextMenu)}.`);
  await pointer('pointerup', 75);
  await compatibilityClick();
  assert(await menu.isVisible(), 'Native contextmenu was dismissed by its compatibility click.');
  await chatTab.click();
  await menu.waitFor({ state: 'detached', timeout: 15000 });

  await fileTab.click();
  await page.waitForFunction((label) => {
    const tab = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'))
      .find((candidate) => candidate.querySelector('.tab-label')?.textContent?.trim() === label);
    return tab?.getAttribute('aria-selected') === 'true';
  }, fileLabel);

  return {
    movementCancelled: true,
    closeTargetExcluded: true,
    shortTouchActivated: true,
    backgroundTabStayedInactive: true,
    targetId: longPressState.targetId,
    compatibilityClickSuppressed: true,
    nativeContextMenuDeduplicated: true,
  };
}

async function verifyAttachToChatControl(
  page: Page,
  filePath: string,
  fileLabel: string,
  exerciseFlow = false,
  expectWorkspaceSelectionAttachment = false,
) {
  const action = page.locator('[data-testid="mobile-attach-to-chat"]');
  await action.waitFor({ state: 'visible', timeout: 15000 });

  const workspaceSelectionState = await action.evaluate((element) => ({
    title: element.getAttribute('title'),
    ariaPressed: element.getAttribute('aria-pressed'),
    disabled: (element as HTMLButtonElement).disabled,
  }));
  assert(
    workspaceSelectionState.ariaPressed === String(expectWorkspaceSelectionAttachment)
      && !workspaceSelectionState.disabled,
    `Workspace selection attachment state is wrong: ${JSON.stringify(workspaceSelectionState)}.`,
  );

  // Wide Mobile preserves the Workspace rail's legacy selection behavior. Clear
  // that setup state so the remaining assertions exercise the explicit action.
  if (expectWorkspaceSelectionAttachment) {
    await page.locator('#piclaw-mobile-surface-tab-chat').click();
    const existingPill = page.locator(`.compose-file-pill[title=${JSON.stringify(filePath)}]`);
    await existingPill.waitFor({ state: 'visible', timeout: 15000 });
    await existingPill.locator('.compose-file-remove').click();
    await tabByLabel(page, fileLabel).click();
    await page.waitForFunction(() => {
      const control = document.querySelector<HTMLButtonElement>('[data-testid="mobile-attach-to-chat"]');
      return control && !control.disabled && control.getAttribute('aria-pressed') === 'false';
    }, undefined, { timeout: 15000 });
  }

  const initialState = await action.evaluate((element) => {
    const next = element.nextElementSibling;
    return {
      title: element.getAttribute('title'),
      ariaLabel: element.getAttribute('aria-label'),
      ariaPressed: element.getAttribute('aria-pressed'),
      disabled: (element as HTMLButtonElement).disabled,
      immediatelyBeforeTerminalDock: Boolean(
        next?.classList.contains('tab-strip-dock-toggle')
        && !next.classList.contains('tab-strip-attach-to-chat'),
      ),
    };
  });
  assert(initialState.title === `Attach ${fileLabel} to Chat`,
    `Attach to Chat has the wrong title: ${JSON.stringify(initialState)}.`);
  assert(initialState.ariaLabel === initialState.title && initialState.ariaPressed === 'false' && !initialState.disabled,
    `Attach to Chat has the wrong available state: ${JSON.stringify(initialState)}.`);
  assert(initialState.immediatelyBeforeTerminalDock,
    'Attach to Chat is not immediately before Terminal Dock.');
  assert(await page.locator('.attach-editor-btn').count() === 0,
    'Mobile still renders the old composer Attach open file action.');

  if (!exerciseFlow) return { workspaceSelectionState, initialState };

  const fileTab = tabByLabel(page, fileLabel);
  await action.click();
  await page.waitForFunction(({ path, label }) => {
    const chat = document.getElementById('piclaw-mobile-surface-tab-chat');
    const control = document.querySelector<HTMLButtonElement>('[data-testid="mobile-attach-to-chat"]');
    const active = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'))
      .find((tab) => tab.querySelector('.tab-label')?.textContent?.trim() === label);
    const attached = Array.from(document.querySelectorAll<HTMLElement>('.compose-file-pill'))
      .some((pill) => pill.getAttribute('title') === path);
    return active?.getAttribute('aria-selected') === 'true'
      && chat?.getAttribute('aria-selected') !== 'true'
      && control?.getAttribute('aria-pressed') === 'true'
      && !control.disabled
      && attached;
  }, { path: filePath, label: fileLabel }, { timeout: 15000 });
  const attachedState = await action.evaluate((element) => ({
    title: element.getAttribute('title'),
    ariaPressed: element.getAttribute('aria-pressed'),
    disabled: (element as HTMLButtonElement).disabled,
  }));
  assert(attachedState.title === `Detach ${fileLabel} from Chat`
    && attachedState.ariaPressed === 'true'
    && !attachedState.disabled,
    `Attach to Chat has the wrong attached state: ${JSON.stringify(attachedState)}.`);
  const tabSelectionPreservedAfterAttach = await fileTab.getAttribute('aria-selected') === 'true';
  assert(tabSelectionPreservedAfterAttach,
    `Attaching ${fileLabel} switched away from its document tab.`);
  const normalFilePickerPresent = await page.locator('label.icon-btn[title="Attach file"]').count() === 1;
  assert(normalFilePickerPresent, 'The normal Mobile Attach file picker disappeared.');

  await action.click();
  await page.waitForFunction(({ path, label }) => {
    const control = document.querySelector<HTMLButtonElement>('[data-testid="mobile-attach-to-chat"]');
    const active = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'))
      .find((tab) => tab.querySelector('.tab-label')?.textContent?.trim() === label);
    const attached = Array.from(document.querySelectorAll<HTMLElement>('.compose-file-pill'))
      .some((pill) => pill.getAttribute('title') === path);
    return active?.getAttribute('aria-selected') === 'true'
      && control?.getAttribute('aria-pressed') === 'false'
      && !control.disabled
      && !attached;
  }, { path: filePath, label: fileLabel }, { timeout: 15000 });
  const detachedState = await action.evaluate((element) => ({
    title: element.getAttribute('title'),
    ariaPressed: element.getAttribute('aria-pressed'),
    disabled: (element as HTMLButtonElement).disabled,
  }));
  assert(detachedState.title === `Attach ${fileLabel} to Chat`
    && detachedState.ariaPressed === 'false'
    && !detachedState.disabled,
    `Attach to Chat has the wrong detached state: ${JSON.stringify(detachedState)}.`);

  // Reattach before closing to preserve coverage for the independent attachment lifecycle.
  await action.click();
  await page.waitForFunction((path) => {
    const control = document.querySelector<HTMLButtonElement>('[data-testid="mobile-attach-to-chat"]');
    return control?.getAttribute('aria-pressed') === 'true'
      && !control.disabled
      && Array.from(document.querySelectorAll<HTMLElement>('.compose-file-pill'))
        .some((pill) => pill.getAttribute('title') === path);
  }, filePath, { timeout: 15000 });

  await fileTab.locator('.tab-close').click();
  await fileTab.waitFor({ state: 'detached', timeout: 15000 });
  await page.locator('#piclaw-mobile-surface-tab-chat').click();
  const retainedPill = page.locator(`.compose-file-pill[title=${JSON.stringify(filePath)}]`);
  await retainedPill.waitFor({ state: 'visible', timeout: 15000 });
  const attachmentPersistsAfterTabClose = await retainedPill.isVisible();
  assert(attachmentPersistsAfterTabClose,
    `Closing ${fileLabel} detached its Chat file reference.`);

  return {
    workspaceSelectionState,
    initialState,
    attachedState,
    detachedState,
    tabSelectionPreservedAfterAttach,
    normalFilePickerPresent,
    attachmentPersistsAfterTabClose,
  };
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
    serviceWorkers: 'block',
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

async function runViewportScenario(
  page: Page,
  compactWorkspace: boolean,
  filePath: string,
  verifyTerminalDockControl = false,
  exerciseAttachToChat = false,
) {
  const replyAvatarWithoutClosableTab = await readReplyAvatarProbe(page);
  assert(
    replyAvatarWithoutClosableTab
      && !replyAvatarWithoutClosableTab.editorOpen
      && replyAvatarWithoutClosableTab.width === 28
      && replyAvatarWithoutClosableTab.height === 28,
    `Reply avatar has the wrong baseline geometry: ${JSON.stringify(replyAvatarWithoutClosableTab)}.`,
  );

  const terminalDockControl = verifyTerminalDockControl
    ? await verifyComposeTerminalDockControl(page)
    : null;
  const workspaceRect = await showWorkspace(page, compactWorkspace);
  const workspaceTouchDragLongPress = exerciseAttachToChat
    ? await verifyWorkspaceTouchDragLongPress(page, filePath)
    : null;
  const opened = await openWorkspaceFile(page, filePath);
  const replyAvatarWithClosableTab = await readReplyAvatarProbe(page);
  assert(
    replyAvatarWithClosableTab
      && replyAvatarWithClosableTab.editorOpen
      && replyAvatarWithClosableTab.width === 28
      && replyAvatarWithClosableTab.height === 28
      && replyAvatarWithClosableTab.minWidth === 28
      && replyAvatarWithClosableTab.minHeight === 28
      && replyAvatarWithClosableTab.flexBasis === '28px',
    `Closable tab changed reply avatar geometry: ${JSON.stringify(replyAvatarWithClosableTab)}.`,
  );
  const touchTabContextMenu = exerciseAttachToChat
    ? await verifyTouchTabContextMenu(page, filePath, opened.fileLabel)
    : null;
  const attachToChatControl = await verifyAttachToChatControl(
    page,
    filePath,
    opened.fileLabel,
    exerciseAttachToChat,
    !compactWorkspace,
  );
  return {
    compactWorkspace,
    terminalDockControl,
    touchTabContextMenu,
    attachToChatControl,
    replyAvatarWithoutClosableTab,
    replyAvatarWithClosableTab,
    workspaceRect,
    workspaceTouchDragLongPress,
    ...opened,
  };
}

async function runKeyboardScenario(page: Page, filePath: string) {
  await showWorkspace(page, true);
  const opened = await openWorkspaceFile(page, filePath);
  const terminalTab = await openTerminalFromMenu(page);
  const inactiveFileCloseState = await tabByLabel(page, opened.fileLabel).locator('.tab-close').evaluate((button) => {
    const style = getComputedStyle(button);
    const rect = button.getBoundingClientRect();
    return {
      coarsePointer: matchMedia('(pointer: coarse)').matches,
      anyFinePointer: matchMedia('(any-pointer: fine)').matches,
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });
  assert(inactiveFileCloseState.coarsePointer && !inactiveFileCloseState.anyFinePointer,
    `Touch scenario did not use coarse-only pointer media: ${JSON.stringify(inactiveFileCloseState)}.`);
  assert(inactiveFileCloseState.opacity === '1' && inactiveFileCloseState.pointerEvents === 'auto',
    `Inactive Mobile close target is not visibly interactive: ${JSON.stringify(inactiveFileCloseState)}.`);
  assert(inactiveFileCloseState.width === 30 && inactiveFileCloseState.height === 30,
    `Inactive Mobile close target has the wrong touch geometry: ${JSON.stringify(inactiveFileCloseState)}.`);

  // Terminal mount intentionally claims focus. Wait for that lifecycle to settle,
  // then move focus back to the tab before exercising roving-key navigation.
  await page.waitForTimeout(100);
  await terminalTab.focus();
  await page.waitForFunction(() => {
    const active = document.activeElement as HTMLElement | null;
    return active?.getAttribute('role') === 'tab'
      && active.querySelector('.tab-label')?.textContent?.trim() === 'Terminal';
  }, undefined, { timeout: 15000 });

  await terminalTab.press('Home');
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
  assert(await page.locator('[data-testid="mobile-attach-to-chat"]').count() === 0,
    'Attach to Chat remains visible for the synthetic Terminal tab.');
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
    inactiveFileCloseState,
    chatState,
    terminalState,
    afterCloseState,
  };
}

async function runChatSessionContextMenuScenario(page: Page) {
  const currentChatJid = 'web:default';
  const targetChatJid = 'web:running-other';
  const fixtureChats = [
    {
      chat_jid: currentChatJid,
      agent_name: 'default',
      is_active: true,
      activity_status: 'working',
      activity_label: 'Working',
      archived_at: null,
    },
    {
      chat_jid: targetChatJid,
      agent_name: 'running-other',
      is_active: true,
      activity_status: 'bash_running',
      activity_label: 'Running shell',
      archived_at: null,
    },
    {
      chat_jid: 'web:idle-resident',
      agent_name: 'idle-resident',
      is_active: false,
      activity_status: 'idle',
      activity_label: 'Idle',
      archived_at: null,
    },
  ];
  let responseMode: 'error' | 'empty' | 'success' = 'error';
  let requestCount = 0;

  await page.route('**/agent/active-chats', async (route) => {
    requestCount += 1;
    if (responseMode === 'error') {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'temporary test failure' }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ chats: responseMode === 'empty' ? [] : fixtureChats }),
    });
  });

  const chatTab = page.locator('#piclaw-mobile-surface-tab-chat');
  const workspaceTab = page.locator('#piclaw-mobile-surface-tab-workspace');
  const menu = page.locator('[data-testid="tab-context-menu"]');
  const sessionMenu = page.locator('[data-testid="chat-session-menu"]');
  await chatTab.waitFor({ state: 'visible', timeout: 15000 });
  await workspaceTab.waitFor({ state: 'visible', timeout: 15000 });

  const initialUrl = page.url();
  const beforeFirstOpen = requestCount;
  await chatTab.click({ button: 'right' });
  await menu.waitFor({ state: 'visible', timeout: 15000 });
  assert(await menu.getAttribute('data-menu-kind') === 'chat-sessions',
    `Chat right-click opened the wrong menu kind: ${String(await menu.getAttribute('data-menu-kind'))}.`);
  await page.locator('[data-testid="chat-session-menu-loading"]').waitFor({ state: 'visible', timeout: 5000 });
  await sessionMenu.getByRole('alert').waitFor({ state: 'visible', timeout: 5000 });
  assert(requestCount > beforeFirstOpen, 'Opening the Chat context menu did not fetch active sessions.');

  responseMode = 'success';
  await sessionMenu.getByRole('button', { name: 'Retry' }).click();
  const currentRow = sessionMenu.locator(`[data-chat-jid=${JSON.stringify(currentChatJid)}]`);
  const targetRow = sessionMenu.locator(`[data-chat-jid=${JSON.stringify(targetChatJid)}]`);
  await currentRow.waitFor({ state: 'visible', timeout: 5000 });
  await targetRow.waitFor({ state: 'visible', timeout: 5000 });
  const visibleSessionLabels = await sessionMenu.locator('.chat-session-menu-label').allTextContents();
  assert(
    visibleSessionLabels.join('|') === '@default|@running-other'
      && visibleSessionLabels.every((label) => !label.includes('web:') && !label.includes('—')),
    `Session rows did not show handle-only labels: ${JSON.stringify(visibleSessionLabels)}.`,
  );
  assert(await currentRow.getAttribute('aria-current') === 'page', 'The current running session is not marked current.');
  assert(await sessionMenu.locator('[data-chat-jid="web:idle-resident"]').count() === 0,
    'The Chat context menu included an idle pool-resident session.');

  await currentRow.click();
  await menu.waitFor({ state: 'detached', timeout: 5000 });
  assert(page.url() === initialUrl, `Selecting the current session navigated from ${initialUrl} to ${page.url()}.`);

  await workspaceTab.click();
  await page.waitForFunction(() => document.getElementById('piclaw-mobile-surface-tab-workspace')?.getAttribute('aria-selected') === 'true');
  responseMode = 'empty';
  const beforeEmptyOpen = requestCount;
  await chatTab.click({ button: 'right' });
  await page.locator('[data-testid="chat-session-menu-empty"]').waitFor({ state: 'visible', timeout: 5000 });
  assert(requestCount > beforeEmptyOpen, 'Reopening the Chat context menu did not fetch fresh session data.');
  assert(await workspaceTab.getAttribute('aria-selected') === 'true' && await chatTab.getAttribute('aria-selected') === 'false',
    'Right-clicking the background Chat tab activated it.');
  await page.keyboard.press('Escape');
  await menu.waitFor({ state: 'detached', timeout: 5000 });

  responseMode = 'success';
  const beforeLongPress = requestCount;
  const point = await chatTab.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.left + Math.min(rect.width / 2, 28)),
      y: Math.round(rect.top + (rect.height / 2)),
    };
  });
  await chatTab.dispatchEvent('pointerdown', {
    pointerType: 'touch', pointerId: 81, isPrimary: true, button: 0, buttons: 1,
    clientX: point.x, clientY: point.y,
  });
  await chatTab.dispatchEvent('mousedown', {
    button: 0, buttons: 1, clientX: point.x, clientY: point.y,
  });
  await page.waitForTimeout(600);
  await menu.waitFor({ state: 'visible', timeout: 5000 });
  await targetRow.waitFor({ state: 'visible', timeout: 5000 });
  assert(requestCount > beforeLongPress, 'Long-pressing Chat did not fetch fresh session data.');
  assert(await workspaceTab.getAttribute('aria-selected') === 'true' && await chatTab.getAttribute('aria-selected') === 'false',
    'Long-pressing the background Chat tab activated it.');
  const menuRect = await readRect(page, '[data-testid="tab-context-menu"]');
  const viewport = page.viewportSize();
  assert(Boolean(viewport) && menuRect.x >= 0 && menuRect.x + menuRect.width <= viewport!.width,
    `The Chat session menu overflowed the viewport: ${JSON.stringify({ menuRect, viewport })}.`);

  await chatTab.dispatchEvent('pointerup', {
    pointerType: 'touch', pointerId: 81, isPrimary: true, button: 0, buttons: 0,
    clientX: point.x, clientY: point.y,
  });
  await chatTab.dispatchEvent('click', {
    button: 0, buttons: 0, detail: 1, clientX: point.x, clientY: point.y,
  });
  assert(await menu.isVisible(), 'The long-press compatibility click dismissed the Chat session menu.');

  await targetRow.click();
  await page.waitForURL((url) => url.searchParams.get('chat_jid') === targetChatJid, { timeout: 15000 });

  return {
    rightClickOpened: true,
    longPressOpened: true,
    currentSessionNoOp: true,
    idleResidentExcluded: true,
    loadingStateShown: true,
    retryRecovered: true,
    emptyStateShown: true,
    freshRequestCount: requestCount,
    switchedTo: targetChatJid,
    menuRect,
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
        run: (page) => runViewportScenario(
          page,
          viewport.compactWorkspace,
          args.filePath,
          viewport.name === 'phone-portrait',
          viewport.name === 'phone-portrait',
        ),
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

    results.push(await runScenario({
      browser,
      storageState,
      baseUrl: args.baseUrl,
      artifactDir,
      name: 'chat-session-context-menu',
      viewport: { width: 390, height: 664 },
      run: runChatSessionContextMenuScenario,
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

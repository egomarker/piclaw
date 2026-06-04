import { test, expect } from '../support/world';
import { sel } from '../support/selectors';

// US-24: Hamburger Menu Items and State
//
// Today's commits:
// - a64069340: Add New file, Refresh tree, Reindex workspace to hamburger menu
// - 3fe19e4e4: Add show/hide hidden files toggle
// - 14753253e: Fix disabled state for all items based on workspace state
// - 34f171a62: Grey out items that don't work in chat-only mode
// - 75aff0c5c: Hide terminal dock toggle when editor is not open
// - 2a7410726: Terminal/VNC tab items always enabled, dock only needs workspace open
// - a5df7f332: Terminal/VNC tab items active whenever not in chat-only mode

const HAMBURGER = '.hamburger-menu, [data-testid="hamburger"]';
const MENU = '.timeline-menu-dropdown, .workspace-menu-dropdown';
const MENU_ITEM = '.workspace-menu-item';

async function ensureWorkspaceVisible(page: import('@playwright/test').Page) {
  const explorer = page.locator(sel.workspaceExplorer).first();
  if (await explorer.isVisible().catch(() => false)) return explorer;

  await page.locator(HAMBURGER).click();
  await page.waitForSelector(MENU, { timeout: 3000 });
  const openWorkspace = page.locator(MENU_ITEM, { hasText: /show workspace|open explorer/i }).first();
  await expect(openWorkspace).toBeVisible({ timeout: 5000 });
  await openWorkspace.click();
  await expect(explorer).toBeVisible({ timeout: 5000 });
  return explorer;
}

test.describe('US-24: Hamburger Menu Items', () => {
  test('hamburger menu contains New file, Refresh tree, Reindex workspace', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    await page.locator(HAMBURGER).click();
    await page.waitForSelector(MENU, { timeout: 3000 });

    const menuText = await page.locator(MENU).textContent();
    expect(menuText).toContain('New file');
    expect(menuText).toContain('Refresh tree');
    expect(menuText).toContain('Reindex workspace');
  });

  test('hamburger menu contains hidden files toggle', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    await page.locator(HAMBURGER).click();
    await page.waitForSelector(MENU, { timeout: 3000 });

    const menuText = await page.locator(MENU).textContent();
    // Should have show/hide hidden files
    expect(menuText).toMatch(/[Ss]how hidden|[Hh]ide hidden|hidden files/);
  });

  test('workspace-dependent items are disabled in chat-only mode', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    await page.locator(HAMBURGER).click();
    await page.waitForSelector(MENU, { timeout: 3000 });

    // Check if we're in chat-only mode by looking for disabled items
    const disabledItems = await page.locator(`${MENU_ITEM}[disabled]`).allTextContents();
    const enabledItems = await page.locator(`${MENU_ITEM}:not([disabled])`).allTextContents();

    // If workspace is open, New file/Refresh should be enabled
    // If chat-only, they should be disabled
    const workspaceOpen = await page.locator(sel.workspaceExplorer).isVisible().catch(() => false);

    if (!workspaceOpen) {
      // Chat-only: workspace actions should be disabled
      const wsActions = ['New file', 'Refresh tree', 'Reindex workspace'];
      for (const action of wsActions) {
        const isDisabled = disabledItems.some(t => t.includes(action));
        expect(isDisabled).toBe(true);
      }
    } else {
      // Workspace open: actions should be enabled
      const wsActions = ['New file', 'Refresh tree', 'Reindex workspace'];
      for (const action of wsActions) {
        const isEnabled = enabledItems.some(t => t.includes(action));
        expect(isEnabled).toBe(true);
      }
    }

    await page.keyboard.press('Escape');
  });

  test('terminal dock toggle hidden when editor not open', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    await page.locator(HAMBURGER).click();
    await page.waitForSelector(MENU, { timeout: 3000 });

    const editorOpen = await page.locator(sel.editorPane).isVisible().catch(() => false);
    const menuText = await page.locator(MENU).textContent() || '';

    if (!editorOpen) {
      // Terminal dock toggle should not appear without editor
      expect(menuText).not.toMatch(/[Ss]how terminal dock|[Hh]ide terminal dock/);
    } else {
      // Should appear when editor is open
      expect(menuText).toMatch(/terminal dock/i);
    }

    await page.keyboard.press('Escape');
  });

  test('terminal and VNC items enabled when not in chat-only mode', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    await page.locator(HAMBURGER).click();
    await page.waitForSelector(MENU, { timeout: 3000 });

    const terminalItem = page.locator(`${MENU_ITEM}`, { hasText: /[Tt]erminal/ }).first();
    if (await terminalItem.isVisible()) {
      const isDisabled = await terminalItem.evaluate(el => (el as HTMLButtonElement).disabled);
      // Should be enabled (not chat-only mode)
      expect(isDisabled).toBe(false);
    }

    await page.keyboard.press('Escape');
  });

  test('workspace header menu exposes Settings and opens the settings dialog', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);
    const explorer = await ensureWorkspaceVisible(page);

    const workspaceMenuButton = explorer.getByRole('button', { name: /workspace actions/i }).first();
    await expect(workspaceMenuButton).toBeVisible({ timeout: 5000 });
    await workspaceMenuButton.click();

    const workspaceMenu = explorer.locator('.workspace-menu-dropdown[aria-label="Workspace options"]').first();
    await expect(workspaceMenu).toBeVisible({ timeout: 3000 });

    const settingsItem = workspaceMenu.locator('.workspace-menu-item', { hasText: /^Settings$/ }).first();
    await expect(settingsItem).toBeVisible({ timeout: 3000 });
    await settingsItem.click();

    await expect(page.locator(sel.settingsDialog).first()).toBeVisible({ timeout: 5000 });
  });
});

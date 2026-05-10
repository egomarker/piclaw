import { test, expect } from '../support/world';
import { sel } from '../support/selectors';

// US-22: Settings Dialog Layering
//
// When settings opens, a .settings-portal (z-index: 2400) is rendered containing:
//   .settings-dialog-backdrop (rgba(0,0,0,0.5), covers viewport)
//   .settings-dialog (centered modal)
//
// The backdrop must be:
//   - Above ALL other elements (workspace z-index max ~9999 on tooltips, 80 on panels)
//   - Partially opaque (0.5 alpha)
//   - Blocking pointer events to elements beneath
//
// The workspace pane (.workspace-explorer) is at z-index 9.
// As long as .settings-portal is at 2400 and creates a stacking context, it wins.

test.describe('US-22: Settings Dialog Layering', () => {
  test('backdrop covers workspace pane when settings is open', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    // Ensure workspace is visible
    const explorer = page.locator(sel.workspaceExplorer);
    if (!(await explorer.isVisible())) {
      const hamburger = page.locator(sel.hamburgerMenu);
      if (await hamburger.isVisible()) await hamburger.click();
      await page.waitForTimeout(500);
    }

    // Open settings
    await page.keyboard.press('Meta+Comma');
    await page.waitForSelector(sel.settingsDialog, { timeout: 5000 });

    // Backdrop should be visible
    const backdrop = page.locator('.settings-dialog-backdrop').first();
    await expect(backdrop).toBeVisible();

    // Backdrop should cover the full viewport
    const backdropBox = await backdrop.boundingBox();
    const viewport = page.viewportSize();
    expect(backdropBox).toBeTruthy();
    expect(backdropBox!.width).toBeGreaterThanOrEqual(viewport!.width - 2);
    expect(backdropBox!.height).toBeGreaterThanOrEqual(viewport!.height - 2);
  });

  test('backdrop is partially opaque (not fully transparent or opaque)', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);
    await page.keyboard.press('Meta+Comma');
    await page.waitForSelector(sel.settingsDialog, { timeout: 5000 });

    const backdrop = page.locator('.settings-dialog-backdrop').first();
    const bg = await backdrop.evaluate((el) => getComputedStyle(el).backgroundColor);

    // Should be rgba with alpha ~0.5 (e.g. "rgba(0, 0, 0, 0.5)")
    expect(bg).toContain('rgba');
    const alphaMatch = bg.match(/[\d.]+\s*\)$/);
    expect(alphaMatch).toBeTruthy();
    const alpha = parseFloat(alphaMatch![0]);
    expect(alpha).toBeGreaterThan(0.2);
    expect(alpha).toBeLessThan(0.9);

    await page.keyboard.press('Escape');
  });

  test('settings dialog renders above workspace (stacking order)', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    // Open workspace
    const explorer = page.locator(sel.workspaceExplorer);
    if (!(await explorer.isVisible())) {
      const hamburger = page.locator(sel.hamburgerMenu);
      if (await hamburger.isVisible()) await hamburger.click();
      await page.waitForTimeout(500);
    }

    // Open settings
    await page.keyboard.press('Meta+Comma');
    await page.waitForSelector(sel.settingsDialog, { timeout: 5000 });

    // Verify settings is visually above workspace by checking:
    // 1. The backdrop/portal has position:fixed (creates stacking context)
    // 2. The dialog is visible and not obscured
    const layering = await page.evaluate(() => {
      const portal = document.querySelector('.settings-portal') as HTMLElement;
      const backdrop = document.querySelector('.settings-dialog-backdrop') as HTMLElement;
      const dialog = document.querySelector('.settings-dialog') as HTMLElement;
      const workspace = document.querySelector('.workspace-sidebar, .workspace-explorer') as HTMLElement;

      const portalPosition = portal ? getComputedStyle(portal).position : 'none';
      const backdropPosition = backdrop ? getComputedStyle(backdrop).position : 'none';
      const dialogVisible = dialog ? dialog.offsetParent !== null : false;

      // Check if dialog center point is the top-most element
      if (dialog) {
        const rect = dialog.getBoundingClientRect();
        const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        const isDialogOnTop = dialog.contains(topEl) || dialog === topEl;
        return { portalPosition, backdropPosition, dialogVisible, isDialogOnTop };
      }
      return { portalPosition, backdropPosition, dialogVisible, isDialogOnTop: false };
    });

    // Portal or backdrop must be fixed (stacking context)
    expect(layering.portalPosition === 'fixed' || layering.backdropPosition === 'fixed').toBe(true);
    // Dialog must be visible
    expect(layering.dialogVisible).toBe(true);
    // Dialog must be the topmost element at its center
    expect(layering.isDialogOnTop).toBe(true);

    await page.keyboard.press('Escape');
  });

  test('workspace is not clickable through backdrop', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    // Open workspace
    const explorer = page.locator(sel.workspaceExplorer);
    if (!(await explorer.isVisible())) {
      const hamburger = page.locator(sel.hamburgerMenu);
      if (await hamburger.isVisible()) await hamburger.click();
      await page.waitForTimeout(500);
    }

    // Open settings
    await page.keyboard.press('Meta+Comma');
    await page.waitForSelector(sel.settingsDialog, { timeout: 5000 });

    // Try to click a workspace row — it should be blocked by the backdrop
    const workspaceRow = page.locator(sel.workspaceRow).first();
    if (await workspaceRow.isVisible()) {
      const box = await workspaceRow.boundingBox();
      if (box) {
        // Click at the workspace row's position
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(300);

        // Settings should still be open (click didn't reach workspace)
        await expect(page.locator(sel.settingsDialog)).toBeVisible();
      }
    }

    await page.keyboard.press('Escape');
  });

  test('closing settings restores workspace interactivity', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    // Open workspace
    const explorer = page.locator(sel.workspaceExplorer);
    if (!(await explorer.isVisible())) {
      const hamburger = page.locator(sel.hamburgerMenu);
      if (await hamburger.isVisible()) await hamburger.click();
      await page.waitForTimeout(500);
    }

    // Open then close settings
    await page.keyboard.press('Meta+Comma');
    await page.waitForSelector(sel.settingsDialog, { timeout: 5000 });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Backdrop should be gone. Hidden portals can remain mounted briefly between
    // settings open/close cycles, so avoid strict-mode visibility checks across
    // multiple matching nodes and assert that none are actually visible.
    const visibleBackdropCount = await page.locator('.settings-dialog-backdrop').evaluateAll((nodes) =>
      nodes.filter((node) => {
        const el = node as HTMLElement;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      }).length
    );
    expect(visibleBackdropCount).toBe(0);

    // Workspace should be interactive again
    const workspaceRow = page.locator(sel.workspaceRow).first();
    if (await workspaceRow.isVisible()) {
      // Should be clickable (no pointer-events: none)
      const pointerEvents = await workspaceRow.evaluate((el) =>
        getComputedStyle(el).pointerEvents
      );
      expect(pointerEvents).not.toBe('none');
    }
  });

  test('settings dialog is not clipped by workspace pane', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    // Open workspace
    const explorer = page.locator(sel.workspaceExplorer);
    if (!(await explorer.isVisible())) {
      const hamburger = page.locator(sel.hamburgerMenu);
      if (await hamburger.isVisible()) await hamburger.click();
      await page.waitForTimeout(500);
    }

    // Open settings
    await page.keyboard.press('Meta+Comma');
    await page.waitForSelector(sel.settingsDialog, { timeout: 5000 });

    const dialog = page.locator(sel.settingsDialog);
    const dialogBox = await dialog.boundingBox();
    const viewport = page.viewportSize();

    expect(dialogBox).toBeTruthy();
    // Dialog should be within viewport bounds (not clipped off-screen)
    expect(dialogBox!.x).toBeGreaterThanOrEqual(0);
    expect(dialogBox!.y).toBeGreaterThanOrEqual(0);
    expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(viewport!.width + 1);
    expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(viewport!.height + 1);

    await page.keyboard.press('Escape');
  });
});

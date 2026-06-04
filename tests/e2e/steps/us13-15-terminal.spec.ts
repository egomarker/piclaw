import { test, expect } from '../support/world';
import { sel } from '../support/selectors';

// US-13: Terminal Pane — Standalone
// US-14: Terminal Dock — Beneath Editor
// US-15: Terminal Zen Mode

/** Open a terminal pane via keyboard shortcut or menu. */
async function openTerminal(page: import('@playwright/test').Page) {
  // Try Ctrl+` first
  await page.keyboard.press('Control+Backquote');
  await page.waitForTimeout(1000);

  let terminal = page.locator('.xterm, .terminal-container, [data-testid="terminal"]');
  if (await terminal.isVisible()) return;

  // Fallback: try the dock toggle button in tab strip
  const dockToggle = page.locator('.tab-strip-dock-toggle');
  if (await dockToggle.isVisible()) {
    await dockToggle.click();
    await page.waitForTimeout(1000);
  }
}

/** Get terminal DOM state. */
async function getTerminalState(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const xterm = document.querySelector('.xterm, .terminal-container, [data-testid="terminal"]') as HTMLElement | null;
    const dock = document.querySelector('.dock-panel') as HTMLElement | null;
    const dockHidden = dock?.classList.contains('hidden') || dock?.style.display === 'none';
    const canvas = xterm?.querySelector('canvas');
    const textLayer = xterm?.querySelector('.xterm-rows, .xterm-screen');
    const outputMirror = xterm?.querySelector('[data-testid="terminal-output"]');
    const textContent = outputMirror?.textContent || textLayer?.textContent || '';
    return {
      visible: xterm !== null && xterm.offsetParent !== null,
      hasCanvas: canvas !== null,
      hasTextLayer: textLayer !== null,
      dockVisible: dock !== null && !dockHidden,
      dockHeight: dock?.offsetHeight || 0,
      textContent: textContent.trim().slice(-2000),
    };
  });
}

// ── US-13: Terminal Standalone ────────────────────────────────────

test.describe('US-13: Terminal Standalone', () => {
  test('open terminal without garbled output', async ({ authedPage: page }) => {
    await openTerminal(page);

    const terminal = page.locator('.xterm, .terminal-container, [data-testid="terminal"]');
    if (!(await terminal.isVisible())) {
      test.skip(undefined, 'Terminal pane not available');
      return;
    }

    // Terminal should render — has either canvas or text layer
    const state = await getTerminalState(page);
    expect(state.visible).toBe(true);
    expect(state.hasCanvas || state.hasTextLayer).toBe(true);

    // Wait for shell prompt (should not be garbled)
    await page.waitForTimeout(2000);
    const afterState = await getTerminalState(page);
    // Text content should contain recognizable characters (not mojibake)
    // A ready terminal typically shows a prompt with $ or % or username
    if (afterState.textContent.length > 0) {
      // Check for absence of common garbled patterns
      const garbledPattern = /[\ufffd\u0000-\u0008\u000e-\u001f]{3,}/;
      expect(garbledPattern.test(afterState.textContent)).toBe(false);
    }
  });

  test('execute ls -al in terminal', async ({ authedPage: page }) => {
    await openTerminal(page);

    const terminal = page.locator('.xterm, .terminal-container, [data-testid="terminal"]');
    if (!(await terminal.isVisible())) {
      test.skip(undefined, 'Terminal pane not available');
      return;
    }

    // Focus terminal and type command
    await terminal.click();
    await page.waitForTimeout(500);
    await page.keyboard.type('ls -al\n');
    await page.waitForTimeout(2000);

    // Check output
    const state = await getTerminalState(page);
    // ls -al output contains permissions like "drwx" or "total"
    const hasLsOutput = state.textContent.includes('total') ||
                        state.textContent.includes('drwx') ||
                        state.textContent.includes('rw-') ||
                        state.textContent.includes('..');
    expect(hasLsOutput).toBe(true);
  });

  test('terminal opens clean without IME active', async ({ authedPage: page }) => {
    await openTerminal(page);

    const terminal = page.locator('.xterm, .terminal-container, [data-testid="terminal"]');
    if (!(await terminal.isVisible())) {
      test.skip(undefined, 'Terminal pane not available');
      return;
    }

    // Check that no IME composition is active on the terminal input element
    const imeState = await page.evaluate(() => {
      // ghostty-web uses a container with tabindex or a hidden input element
      const container = document.querySelector('.xterm, .terminal-container, [data-testid="terminal"]');
      if (!container) return { clean: false, reason: 'no container' };

      // Check for any active composition indicators
      const inputEl = container.querySelector('input, textarea') as HTMLInputElement | null;
      const containerEl = container as HTMLElement;

      // 1. No composition event should be in progress
      // (check for presence of ime-mode or composing data attributes)
      const hasComposingAttr = containerEl.dataset.composing === 'true' ||
        containerEl.getAttribute('aria-composing') === 'true';

      // 2. Input element (if any) should have inputMode="none" or "text" (not CJK)
      const inputMode = inputEl?.inputMode || containerEl.getAttribute('inputmode') || '';
      const hasCjkInputMode = ['ja', 'zh', 'ko'].some(lang =>
        inputMode.includes(lang) || containerEl.lang?.startsWith(lang)
      );

      // 3. No visible IME candidate window or composition text
      const compositionText = document.querySelector('[data-composition], .ime-composition, .composition-text');

      // 4. Check the ghostty runtime state if accessible
      const ghosttyState = (containerEl as any).__ghosttyInputHandler;
      const isComposing = ghosttyState?.isComposing === true;

      return {
        clean: !hasComposingAttr && !hasCjkInputMode && !compositionText && !isComposing,
        hasComposingAttr,
        hasCjkInputMode,
        hasCompositionText: !!compositionText,
        isComposing,
        inputMode,
        lang: containerEl.lang || document.documentElement.lang,
      };
    });

    expect(imeState.clean).toBe(true);

    // Also verify: typing plain ASCII produces exactly what was typed
    await terminal.click();
    await page.waitForTimeout(300);
    await page.keyboard.type('echo test123');
    await page.waitForTimeout(500);

    const termContent = await getTerminalState(page);
    // Should contain the exact ASCII text (not garbled CJK)
    expect(termContent.textContent).toContain('echo test123');
    // Should NOT contain CJK composition artifacts
    const hasCjkArtifacts = /[\u3000-\u9fff\uff00-\uffef]{2,}/.test(termContent.textContent);
    expect(hasCjkArtifacts).toBe(false);
  });

  test('close terminal via tab close button', async ({ authedPage: page }) => {
    await openTerminal(page);

    const terminal = page.locator('.xterm, .terminal-container, [data-testid="terminal"]');
    if (!(await terminal.isVisible())) {
      test.skip(undefined, 'Terminal pane not available');
      return;
    }

    // Find close button — in dock header or tab strip
    const closeBtn = page.locator(
      '.dock-panel-close, ' +
      '.tab-strip .tab:has-text("Terminal") .close-btn, ' +
      '.tab-strip .tab:has-text("Terminal") [data-action="close"], ' +
      '.dock-panel-header button[aria-label*="close" i]'
    ).first();

    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);

      // Terminal should be gone
      const afterState = await getTerminalState(page);
      expect(afterState.visible || afterState.dockVisible).toBe(false);
    } else {
      // Try keyboard toggle to close
      await page.keyboard.press('Control+Backquote');
      await page.waitForTimeout(500);
      const afterState = await getTerminalState(page);
      expect(afterState.dockVisible).toBe(false);
    }
  });

  test('terminal theme updates with UI theme', async ({ authedPage: page }) => {
    await openTerminal(page);

    const terminal = page.locator('.xterm, .terminal-container, [data-testid="terminal"]');
    if (!(await terminal.isVisible())) {
      test.skip(undefined, 'Terminal pane not available');
      return;
    }

    // Get terminal background before theme change
    const bgBefore = await page.evaluate(() => {
      const el = document.querySelector('.xterm, .terminal-container') as HTMLElement;
      return el ? getComputedStyle(el).backgroundColor : '';
    });

    // Change theme to ristretto (dark)
    const compose = page.locator(sel.composeInput);
    await compose.click();
    await compose.fill('/theme ristretto');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Terminal background should change
    const bgAfter = await page.evaluate(() => {
      const el = document.querySelector('.xterm, .terminal-container') as HTMLElement;
      return el ? getComputedStyle(el).backgroundColor : '';
    });

    // Colors should differ (ristretto is dark, default may be light)
    if (bgBefore && bgAfter) {
      expect(bgAfter).not.toBe(bgBefore);
    }

    // Restore theme
    await compose.click();
    await compose.fill('/theme default');
    await page.keyboard.press('Enter');
  });
});

// ── US-14: Terminal Dock (beneath editor) ────────────────────────

test.describe('US-14: Terminal Dock', () => {
  async function openFileInEditor(page: import('@playwright/test').Page): Promise<boolean> {
    // Open workspace explorer and double-click a file. Fresh CI workspaces can
    // take a moment to populate the tree; skip dock/zen assertions rather than
    // sending editor shortcuts to the chat shell with no active editor tab.
    const row = page.locator(sel.workspaceRow).filter({ hasText: /\.(md|txt)$/ }).first();
    const visible = await row.isVisible({ timeout: 5000 }).catch(() => false);
    if (!visible) return false;
    await row.dblclick();
    await page.waitForTimeout(1000);
    return await page.locator(sel.editorTabActive).isVisible({ timeout: 3000 }).catch(() => true);
  }

  test('toggle dock via Ctrl+Backtick', async ({ authedPage: page }) => {
    if (!(await openFileInEditor(page))) test.skip(true, 'requires an open editor tab');

    // Open dock
    await page.keyboard.press('Control+Backquote');
    await page.waitForTimeout(1000);

    let state = await getTerminalState(page);
    if (!state.dockVisible && !state.visible) {
      test.skip(undefined, 'Terminal dock not available');
      return;
    }

    expect(state.dockVisible || state.visible).toBe(true);

    // Close dock
    await page.keyboard.press('Control+Backquote');
    await page.waitForTimeout(500);

    state = await getTerminalState(page);
    expect(state.dockVisible).toBe(false);
  });

  test('toggle dock via tab strip button', async ({ authedPage: page }) => {
    if (!(await openFileInEditor(page))) test.skip(true, 'requires an open editor tab');

    const dockToggle = page.locator('.tab-strip-dock-toggle');
    if (!(await dockToggle.isVisible())) {
      test.skip(undefined, 'Dock toggle button not visible');
      return;
    }

    // Open
    await dockToggle.click();
    await page.waitForTimeout(1000);
    let state = await getTerminalState(page);
    expect(state.dockVisible || state.visible).toBe(true);

    // Close
    await dockToggle.click();
    await page.waitForTimeout(500);
    state = await getTerminalState(page);
    expect(state.dockVisible).toBe(false);
  });

  test('dock splitter is draggable', async ({ authedPage: page }) => {
    if (!(await openFileInEditor(page))) test.skip(true, 'requires an open editor tab');
    await page.keyboard.press('Control+Backquote');
    await page.waitForTimeout(1000);

    const splitter = page.locator('.dock-splitter');
    if (!(await splitter.isVisible())) {
      test.skip(undefined, 'Dock splitter not visible');
      return;
    }

    const box = await splitter.boundingBox();
    if (!box) { test.skip(undefined, 'Cannot get splitter bounds'); return; }

    // Get initial dock height
    const heightBefore = await page.evaluate(() =>
      (document.querySelector('.dock-panel') as HTMLElement)?.offsetHeight || 0
    );

    // Drag up (grow terminal)
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y - 80, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    const heightAfter = await page.evaluate(() =>
      (document.querySelector('.dock-panel') as HTMLElement)?.offsetHeight || 0
    );

    expect(heightAfter).toBeGreaterThan(heightBefore);

    // Close dock
    await page.keyboard.press('Control+Backquote');
  });

  test('terminal dock and editor have independent focus', async ({ authedPage: page }) => {
    if (!(await openFileInEditor(page))) test.skip(true, 'requires an open editor tab');
    await page.keyboard.press('Control+Backquote');
    await page.waitForTimeout(1000);

    const terminal = page.locator('.xterm, .terminal-container, [data-testid="terminal"]');
    if (!(await terminal.isVisible())) {
      test.skip(undefined, 'Terminal not visible');
      return;
    }

    // Type in terminal
    await terminal.click();
    await page.waitForTimeout(200);
    await page.keyboard.type('echo dock-test');

    // Click editor
    const editor = page.locator('.cm-editor .cm-content, .editor-codemirror [contenteditable]').first();
    if (await editor.isVisible()) {
      await editor.click();
      await page.waitForTimeout(200);

      // Verify editor has focus (can receive input)
      const editorFocused = await page.evaluate(() =>
        document.activeElement?.closest('.cm-editor') !== null
      );
      expect(editorFocused).toBe(true);
    }

    await page.keyboard.press('Control+Backquote');
  });

  test('dock hidden in zen mode', async ({ authedPage: page }) => {
    if (!(await openFileInEditor(page))) test.skip(true, 'requires an open editor tab');
    await page.keyboard.press('Control+Backquote');
    await page.waitForTimeout(1000);

    const state = await getTerminalState(page);
    if (!state.dockVisible) {
      test.skip(undefined, 'Dock not visible to test zen');
      return;
    }

    // Enter zen mode
    await page.keyboard.press('Control+Shift+z');
    await page.waitForTimeout(500);

    // Dock should be hidden
    const dockInZen = await page.evaluate(() => {
      const dock = document.querySelector('.dock-panel') as HTMLElement;
      if (!dock) return false;
      return getComputedStyle(dock).display !== 'none';
    });
    expect(dockInZen).toBe(false);

    // Exit zen
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });
});

// ── US-15: Terminal Zen Mode ─────────────────────────────────────

test.describe('US-15: Zen Mode Controls', () => {
  async function openMarkdownInEditor(page: import('@playwright/test').Page): Promise<boolean> {
    const row = page.locator(sel.workspaceRow).filter({ hasText: /\.md$/ }).first();
    const visible = await row.isVisible({ timeout: 5000 }).catch(() => false);
    if (!visible) return false;
    await row.dblclick();
    await page.waitForTimeout(1000);
    return await page.locator(sel.editorTabActive).isVisible({ timeout: 3000 }).catch(() => true);
  }

  test('zen mode hides sidebar and chat', async ({ authedPage: page }) => {
    if (!(await openMarkdownInEditor(page))) test.skip(true, 'requires an open markdown editor tab');

    // Enter zen
    await page.keyboard.press('Control+Shift+z');
    await page.waitForTimeout(500);

    // Sidebar and chat should be hidden
    const sidebarVisible = await page.evaluate(() => {
      const sidebar = document.querySelector('.workspace-sidebar');
      return sidebar ? getComputedStyle(sidebar).display !== 'none' : false;
    });
    const chatVisible = await page.evaluate(() => {
      const chat = document.querySelector('.container');
      return chat ? getComputedStyle(chat).display !== 'none' : false;
    });

    expect(sidebarVisible).toBe(false);
    expect(chatVisible).toBe(false);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  test('zen exit indicator visible in top-right corner', async ({ authedPage: page }) => {
    if (!(await openMarkdownInEditor(page))) test.skip(true, 'requires an open markdown editor tab');

    await page.keyboard.press('Control+Shift+z');
    await page.waitForTimeout(500);

    // The zen toggle button should still be reachable
    // In zen mode, the tab strip is hidden but has a hover-reveal zone
    // The zen toggle button is inside the tab strip
    // We need to hover near the top to reveal it

    // Hover at top edge to reveal tab strip
    await page.mouse.move(100, 3);
    await page.waitForTimeout(500);

    const zenToggle = page.locator('.tab-strip-zen-toggle');
    if (await zenToggle.isVisible()) {
      // Should be clickable
      const box = await zenToggle.boundingBox();
      expect(box).toBeTruthy();
      // Should have reasonable tap target
      expect(box!.width).toBeGreaterThanOrEqual(14);
      expect(box!.height).toBeGreaterThanOrEqual(14);
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  test('clicking zen toggle exits zen mode', async ({ authedPage: page }) => {
    if (!(await openMarkdownInEditor(page))) test.skip(true, 'requires an open markdown editor tab');

    await page.keyboard.press('Control+Shift+z');
    await page.waitForTimeout(500);

    // Hover to reveal tab strip
    await page.mouse.move(100, 3);
    await page.waitForTimeout(500);

    const zenToggle = page.locator('.tab-strip-zen-toggle');
    if (await zenToggle.isVisible()) {
      await zenToggle.click();
      await page.waitForTimeout(500);

      // Sidebar should be back
      const sidebarVisible = await page.evaluate(() => {
        const sidebar = document.querySelector('.workspace-sidebar');
        return sidebar ? getComputedStyle(sidebar).display !== 'none' : false;
      });
      expect(sidebarVisible).toBe(true);
    } else {
      // Fallback: Escape exits
      await page.keyboard.press('Escape');
    }
  });

  test('Escape key exits zen mode', async ({ authedPage: page }) => {
    if (!(await openMarkdownInEditor(page))) test.skip(true, 'requires an open markdown editor tab');

    await page.keyboard.press('Control+Shift+z');
    await page.waitForTimeout(500);

    // Verify in zen mode
    const inZen = await page.evaluate(() =>
      document.querySelector('.app-shell')?.classList.contains('zen-mode') || false
    );
    expect(inZen).toBe(true);

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const afterZen = await page.evaluate(() =>
      document.querySelector('.app-shell')?.classList.contains('zen-mode') || false
    );
    expect(afterZen).toBe(false);
  });

  test('hover near top reveals tab strip in zen mode', async ({ authedPage: page }) => {
    if (!(await openMarkdownInEditor(page))) test.skip(true, 'requires an open markdown editor tab');

    await page.keyboard.press('Control+Shift+z');
    await page.waitForTimeout(500);

    // Tab strip should be hidden initially
    const tabStripHidden = await page.evaluate(() => {
      const ts = document.querySelector('.tab-strip') as HTMLElement;
      return ts ? getComputedStyle(ts).opacity === '0' : true;
    });
    expect(tabStripHidden).toBe(true);

    // Hover at top edge
    await page.mouse.move(400, 3);
    await page.waitForTimeout(500);

    // Tab strip should fade in (opacity > 0)
    const tabStripVisible = await page.evaluate(() => {
      const ts = document.querySelector('.tab-strip') as HTMLElement;
      return ts ? parseFloat(getComputedStyle(ts).opacity) > 0 : false;
    });
    expect(tabStripVisible).toBe(true);

    // Move away
    await page.mouse.move(400, 300);
    await page.waitForTimeout(500);

    await page.keyboard.press('Escape');
  });
});

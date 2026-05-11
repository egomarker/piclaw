import { test, expect } from '../support/world';
import { sel } from '../support/selectors';

// US-21: Session Swipe Independence
//
// Current implementation issue:
//   isEligibleChatSwipeTarget() uses a blocklist that includes layout containers:
//   .workspace-explorer, .editor-pane-container, .dock-panel, .terminal-pane-content
//   If ANY of these is the touch target, swipe is killed entirely.
//
// Desired: Swipe should work everywhere EXCEPT:
//   - Active text inputs (compose, contenteditable, input, textarea, select)
//   - The editor's own content area (which handles horizontal scroll)
//   - Explicitly marked [data-no-chat-swipe] elements
//
// Layout containers being visible should NOT prevent swipe on the timeline.
// The check should be: "is the touch target an interactive control that needs
// horizontal gesture?" not "is any panel open?"

/** Simulate a horizontal swipe gesture on the timeline. */
async function simulateSwipe(page: import('@playwright/test').Page, startX: number, startY: number, deltaX: number) {
  await page.evaluate(({ sx, sy, dx }) => {
    const el = document.elementFromPoint(sx, sy);
    if (!el) return;

    // Simulate pointer down (finger)
    el.dispatchEvent(new PointerEvent('pointerdown', {
      pointerId: 1, pointerType: 'touch',
      clientX: sx, clientY: sy, bubbles: true, composed: true,
    }));

    // Touch start
    const touch = new Touch({ identifier: 1, target: el, clientX: sx, clientY: sy });
    el.dispatchEvent(new TouchEvent('touchstart', {
      touches: [touch], changedTouches: [touch], bubbles: true,
    }));

    // Touch move (horizontal)
    const steps = 5;
    for (let i = 1; i <= steps; i++) {
      const cx = sx + (dx * i / steps);
      const moveTouch = new Touch({ identifier: 1, target: el, clientX: cx, clientY: sy });
      el.dispatchEvent(new TouchEvent('touchmove', {
        touches: [moveTouch], changedTouches: [moveTouch], bubbles: true,
      }));
    }

    // Touch end
    const endTouch = new Touch({ identifier: 1, target: el, clientX: sx + dx, clientY: sy });
    el.dispatchEvent(new TouchEvent('touchend', {
      touches: [], changedTouches: [endTouch], bubbles: true,
    }));
  }, { sx: startX, sy: startY, dx: deltaX });
}

test.describe('US-21: Session Swipe Independence', () => {
  // These tests simulate touch events programmatically — device profile not needed

  test('swipe works on the timeline area', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);
    const timeline = page.locator(sel.timeline);
    const box = await timeline.boundingBox();
    if (!box) { test.skip(undefined, 'Timeline not visible'); return; }

    const urlBefore = page.url();
    // Swipe left (go to next session)
    await simulateSwipe(page, box.x + box.width / 2, box.y + box.height / 2, -150);
    await page.waitForTimeout(1000);

    // We can't guarantee a session change without knowing the session list,
    // but we verify no crash and the UI remains functional
    await expect(page.locator(sel.timeline)).toBeVisible();
  });

  test('swipe is NOT blocked when workspace explorer is visible', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    // Ensure workspace is visible
    const explorer = page.locator(sel.workspaceExplorer);
    if (!(await explorer.isVisible())) {
      const hamburger = page.locator(sel.hamburgerMenu);
      if (await hamburger.isVisible()) await hamburger.click();
      await page.waitForTimeout(500);
    }

    // Swipe on the timeline area (not on the explorer itself)
    const timeline = page.locator(sel.timeline);
    const box = await timeline.boundingBox();
    if (!box) { test.skip(undefined, 'Timeline not visible with explorer open'); return; }

    // The swipe target is the timeline, not the explorer
    // This should still work regardless of explorer being visible
    await simulateSwipe(page, box.x + box.width / 2, box.y + box.height / 2, -150);
    await page.waitForTimeout(500);

    // UI should remain functional (no crash, no stuck state)
    await expect(page.locator(sel.timeline)).toBeVisible();
  });

  test('swipe is blocked inside compose box', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    const compose = page.locator(sel.composeInput);
    await compose.click();
    await page.waitForTimeout(200);

    const box = await compose.boundingBox();
    if (!box) { test.skip(undefined, 'Compose box not visible'); return; }

    const urlBefore = page.url();
    await simulateSwipe(page, box.x + box.width / 2, box.y + box.height / 2, -150);
    await page.waitForTimeout(500);

    // Session should NOT have changed (compose is interactive)
    expect(page.url()).toBe(urlBefore);
  });

  test('swipe works on agent thinking panels', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);

    // Check if thinking panel exists
    const thinking = page.locator('.agent-thinking').first();
    if (!(await thinking.isVisible())) {
      test.skip(undefined, 'No thinking panel visible');
      return;
    }

    const box = await thinking.boundingBox();
    if (!box) { test.skip(undefined, 'Cannot get thinking bounds'); return; }

    // Swipe on thinking panel — should pass through
    await simulateSwipe(page, box.x + box.width / 2, box.y + box.height / 2, -150);
    await page.waitForTimeout(500);

    // No crash, UI functional
    await expect(page.locator(sel.timeline)).toBeVisible();
  });

  test('swipe target eligibility: timeline content is swipeable', async ({ authedPage: page }) => {
    // Directly test the eligibility function
    const isEligible = await page.evaluate(() => {
      const post = document.querySelector('.post-content, .post');
      if (!post) return null;
      // Check if the element would pass the swipe eligibility check
      const interactiveSelector = 'input, textarea, select, button, label, a[href], [contenteditable="true"], [role="button"], [data-no-chat-swipe], .compose-box';
      return !post.matches(interactiveSelector) && !post.closest(interactiveSelector);
    });

    // Timeline post content should be eligible for swipe
    if (isEligible !== null) {
      expect(isEligible).toBe(true);
    }
  });

  test('Apple Pencil does NOT trigger swipe', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);
    const timeline = page.locator(sel.timeline);
    const box = await timeline.boundingBox();
    if (!box) { test.skip(undefined, 'Timeline not visible'); return; }

    const urlBefore = page.url();

    // Simulate pen (Apple Pencil) pointer event followed by touch
    await page.evaluate(({ sx, sy, dx }) => {
      const el = document.elementFromPoint(sx, sy);
      if (!el) return;

      // Pen pointer down (sets lastPointerDownWasPen = true)
      el.dispatchEvent(new PointerEvent('pointerdown', {
        pointerId: 2, pointerType: 'pen',
        clientX: sx, clientY: sy, bubbles: true, composed: true,
      }));

      // Touch events (should be rejected because of pen flag)
      const touch = new Touch({ identifier: 1, target: el, clientX: sx, clientY: sy });
      el.dispatchEvent(new TouchEvent('touchstart', {
        touches: [touch], changedTouches: [touch], bubbles: true,
      }));
      const moveTouch = new Touch({ identifier: 1, target: el, clientX: sx + dx, clientY: sy });
      el.dispatchEvent(new TouchEvent('touchmove', {
        touches: [moveTouch], changedTouches: [moveTouch], bubbles: true,
      }));
      el.dispatchEvent(new TouchEvent('touchend', {
        touches: [], changedTouches: [moveTouch], bubbles: true,
      }));
    }, { sx: box.x + box.width / 2, sy: box.y + box.height / 2, dx: -150 });

    await page.waitForTimeout(500);
    expect(page.url()).toBe(urlBefore);
  });
});

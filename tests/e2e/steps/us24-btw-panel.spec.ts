import { test, expect } from '../support/world';
import { sel } from '../support/selectors';

// Regression: long /btw side conversations must not push compose off-screen;
// the BTW panel itself must become a bounded scroll container.

test.describe('US-24: BTW panel layout', () => {
  test('long BTW panel content is internally scrollable', async ({ authedPage: page }) => {
    await page.waitForSelector(sel.timeline);
    await page.waitForSelector(sel.composeBox);

    await page.evaluate(() => {
      document.querySelector('#e2e-btw-scroll-fixture')?.remove();
      const panel = document.createElement('section');
      panel.id = 'e2e-btw-scroll-fixture';
      panel.className = 'btw-panel';
      panel.setAttribute('aria-label', 'BTW side conversation');
      const lines = Array.from({ length: 80 }, (_, i) => `<p>BTW answer line ${i + 1}: enough text to force internal scrolling.</p>`).join('');
      panel.innerHTML = `
        <div class="btw-panel-header"><div class="btw-panel-title-wrap"><span class="btw-panel-title">Question</span><span class="btw-panel-status">Done</span></div></div>
        <div class="btw-block btw-question">Why is this panel scrollable?</div>
        <div class="btw-block btw-answer"><div class="btw-answer-label">Answer</div><div class="btw-answer-body post-content">${lines}</div></div>
        <div class="btw-panel-footer"><button class="btw-btn">Retry</button><button class="btw-btn btw-btn-primary">Inject into chat</button></div>
      `;
      const compose = document.querySelector('.compose-box');
      compose?.parentElement?.insertBefore(panel, compose);
    });

    const state = await page.evaluate(() => {
      const panel = document.querySelector('#e2e-btw-scroll-fixture') as HTMLElement | null;
      const compose = document.querySelector('.compose-box') as HTMLElement | null;
      if (!panel || !compose) return null;
      const style = getComputedStyle(panel);
      const panelRect = panel.getBoundingClientRect();
      const composeRect = compose.getBoundingClientRect();
      return {
        overflowY: style.overflowY,
        maxHeight: style.maxHeight,
        scrollHeight: panel.scrollHeight,
        clientHeight: panel.clientHeight,
        composeVisible: composeRect.bottom <= window.innerHeight + 1 && composeRect.top < window.innerHeight,
        panelAboveCompose: panelRect.bottom <= composeRect.top + 1,
      };
    });

    expect(state).toBeTruthy();
    expect(state!.overflowY).toBe('auto');
    expect(state!.maxHeight).not.toBe('none');
    expect(state!.scrollHeight).toBeGreaterThan(state!.clientHeight);
    expect(state!.composeVisible).toBe(true);
    expect(state!.panelAboveCompose).toBe(true);
  });
});

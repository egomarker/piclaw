import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

const baseUrl = process.env.PICLAW_E2E_BASE_URL || 'http://127.0.0.1:8080';
const reportPath = resolve(
  process.env.PICLAW_E2E_REPORT_PATH || '/tmp/piclaw-timeline-virtualization-report.json',
);
const executablePath = process.env.PICLAW_PLAYWRIGHT_EXECUTABLE_PATH || undefined;
const totalPosts = 120;
const pageSize = 10;
const chatJid = 'web:timeline-virtualization-e2e';

interface TimelineRequest {
  before: number | null;
  ids: number[];
}

interface AnchorSnapshot {
  id: string;
  offset: number;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  visibleIds: string[];
}

const requests: TimelineRequest[] = [];
const pageErrors: string[] = [];
const report: Record<string, unknown> = {
  baseUrl,
  totalPosts,
  pageSize,
  requests,
  pageErrors,
  passed: false,
};

function makePost(id: number) {
  const paragraphs = Array.from(
    { length: 6 + (id % 5) },
    (_unused, index) => `Visible fixture line ${index + 1} for post ${id}.`,
  ).join('\n\n');
  // Deliberately make the estimator very wrong while keeping rendered height
  // moderate. The transition must use measured rows rather than trusting this.
  const invisibleEstimateStress = '\u200b'.repeat(5200);
  return {
    id,
    chat_jid: chatJid,
    timestamp: new Date(Date.UTC(2026, 0, 1, 0, 0, id)).toISOString(),
    data: {
      type: 'user_message',
      content: `Timeline virtualization fixture ${id}\n\n${paragraphs}\n\n${invisibleEstimateStress}`,
      sender_name: 'Timeline Test',
    },
  };
}

async function waitForBeforeCount(count: number, timeoutMs = 5000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const unique = new Set(requests.filter((request) => request.before !== null).map((request) => request.before));
    if (unique.size >= count) return;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 25));
  }
  throw new Error(`Timed out waiting for ${count} history requests`);
}

async function settle(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolvePromise) => {
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => resolvePromise())));
  }));
  await page.waitForTimeout(80);
}

async function setTimelineContentOffset(page: Page, offset: number): Promise<void> {
  await page.evaluate((targetOffset) => {
    const root = document.querySelector<HTMLElement>('.timeline.reverse');
    if (!root) throw new Error('Timeline DOM is missing');
    const range = Math.max(0, root.scrollHeight - root.clientHeight);
    root.scrollTop = Math.max(0, targetOffset) - range;
    root.dispatchEvent(new Event('scroll', { bubbles: true }));
  }, offset);
}

async function scrollNearHistoryEdge(page: Page): Promise<AnchorSnapshot> {
  return page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('.timeline.reverse');
    const content = document.querySelector<HTMLElement>('.timeline-content');
    if (!root || !content) throw new Error('Timeline DOM is missing');
    const range = Math.max(0, root.scrollHeight - root.clientHeight);
    root.scrollTop = -Math.max(0, range - 250);
    const rootRect = root.getBoundingClientRect();
    const visible = Array.from(content.querySelectorAll<HTMLElement>(':scope > .post'))
      .filter((post) => {
        const rect = post.getBoundingClientRect();
        return rect.bottom > rootRect.top && rect.top < rootRect.bottom;
      });
    const anchor = visible[0];
    if (!anchor) throw new Error('No visible post was available before loading history');
    const snapshot = {
      id: anchor.id.replace(/^post-/, ''),
      offset: anchor.getBoundingClientRect().top - rootRect.top,
      scrollTop: root.scrollTop,
      scrollHeight: root.scrollHeight,
      clientHeight: root.clientHeight,
      visibleIds: visible.map((post) => post.id.replace(/^post-/, '')),
    };
    root.dispatchEvent(new Event('scroll', { bubbles: true }));
    return snapshot;
  });
}

async function inspectTimeline(page: Page, anchorId: string) {
  return page.evaluate((expectedAnchorId) => {
    const root = document.querySelector<HTMLElement>('.timeline.reverse');
    const content = document.querySelector<HTMLElement>('.timeline-content');
    if (!root || !content) throw new Error('Timeline DOM is missing after virtualization');
    const rootRect = root.getBoundingClientRect();
    const posts = Array.from(content.querySelectorAll<HTMLElement>(':scope > .post'));
    const visible = posts.filter((post) => {
      const rect = post.getBoundingClientRect();
      return rect.bottom > rootRect.top && rect.top < rootRect.bottom;
    });
    const anchor = document.getElementById(`post-${expectedAnchorId}`) as HTMLElement | null;
    const anchorRect = anchor?.getBoundingClientRect();
    return {
      scrollTop: root.scrollTop,
      scrollHeight: root.scrollHeight,
      clientHeight: root.clientHeight,
      postCount: posts.length,
      postIds: posts.map((post) => post.id.replace(/^post-/, '')),
      visibleIds: visible.map((post) => post.id.replace(/^post-/, '')),
      spacerHeights: Array.from(content.querySelectorAll<HTMLElement>(':scope > .timeline-virtual-spacer'))
        .map((spacer) => spacer.getBoundingClientRect().height),
      anchorPresent: Boolean(anchor),
      anchorVisible: Boolean(anchorRect && anchorRect.bottom > rootRect.top && anchorRect.top < rootRect.bottom),
      anchorOffset: anchorRect ? anchorRect.top - rootRect.top : null,
    };
  }, anchorId);
}

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | undefined;
let failure: Error | null = null;

try {
  browser = await chromium.launch({ headless: true, executablePath });
  context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
  });
  page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(String(error)));

  await page.route(/\/timeline(?:\?|$)/, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.method() !== 'GET'
      || url.pathname !== '/timeline'
      || url.searchParams.get('chat_jid') !== chatJid) {
      await route.continue();
      return;
    }
    const requestedLimit = Number(url.searchParams.get('limit')) || pageSize;
    const limit = Math.max(1, Math.min(pageSize, requestedLimit));
    const rawBefore = url.searchParams.get('before');
    const before = rawBefore === null ? null : Number(rawBefore);
    const endExclusive = before === null ? totalPosts + 1 : before;
    const start = Math.max(1, endExclusive - limit);
    const ids = Array.from({ length: Math.max(0, endExclusive - start) }, (_unused, index) => start + index);
    requests.push({ before, ids });
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        posts: ids.map(makePost),
        has_more: start > 1,
      }),
    });
  });

  await page.goto(`${baseUrl}/?chat_jid=${encodeURIComponent(chatJid)}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.timeline.reverse .post', { timeout: 15000 });
  await settle(page);

  while (new Set(requests.filter((request) => request.before !== null).map((request) => request.before)).size < 9) {
    const beforeCount = new Set(requests.filter((request) => request.before !== null).map((request) => request.before)).size;
    await scrollNearHistoryEdge(page);
    await waitForBeforeCount(beforeCount + 1);
    await settle(page);
  }

  const preTransition = await page.evaluate(() => ({
    postCount: document.querySelectorAll('.timeline-content > .post').length,
    spacerCount: document.querySelectorAll('.timeline-content > .timeline-virtual-spacer').length,
  }));
  if (preTransition.postCount !== 100 || preTransition.spacerCount !== 0) {
    throw new Error(`Expected 100 fully rendered posts before engagement, got ${JSON.stringify(preTransition)}`);
  }

  const beforeAnchor = await scrollNearHistoryEdge(page);
  report.beforeAnchor = beforeAnchor;
  await waitForBeforeCount(10);
  await page.waitForFunction(() => (
    document.querySelectorAll('.timeline-content > .post').length === 16
    && document.querySelectorAll('.timeline-content > .timeline-virtual-spacer').length > 0
  ), undefined, { timeout: 5000 });
  await settle(page);

  const afterTransition = await inspectTimeline(page, beforeAnchor.id);
  report.afterTransition = afterTransition;

  if (afterTransition.postCount !== 16) {
    throw new Error(`Expected a bounded 16-post window, got ${afterTransition.postCount}`);
  }
  if (afterTransition.visibleIds.length === 0) {
    throw new Error('Virtualization left the viewport entirely inside a spacer');
  }
  if (!afterTransition.anchorPresent || !afterTransition.anchorVisible) {
    throw new Error(`Anchor post ${beforeAnchor.id} was unmounted or moved outside the viewport`);
  }
  if (afterTransition.anchorOffset === null || Math.abs(afterTransition.anchorOffset - beforeAnchor.offset) > 3) {
    throw new Error(
      `Anchor post moved ${Math.abs((afterTransition.anchorOffset ?? 0) - beforeAnchor.offset).toFixed(2)}px during engagement`,
    );
  }
  if (afterTransition.scrollTop >= -2) {
    throw new Error('Timeline snapped to the newest position during engagement');
  }

  // Move the virtual window toward older rows without loading. This forces a
  // spacer-to-real-row exchange before the next prepend.
  await setTimelineContentOffset(page, 800);
  await settle(page);
  const shiftedWindow = await inspectTimeline(page, beforeAnchor.id);
  report.shiftedWindow = shiftedWindow;
  if (shiftedWindow.visibleIds.length === 0) {
    throw new Error('Scrolling an engaged virtual window produced an empty viewport');
  }

  // Load one more page while already windowed and verify that the element anchor,
  // not a raw estimated offset, survives the prepend as well.
  const beforeWindowedPrepend = await scrollNearHistoryEdge(page);
  report.beforeWindowedPrepend = beforeWindowedPrepend;
  await waitForBeforeCount(11);
  await settle(page);
  const afterWindowedPrepend = await inspectTimeline(page, beforeWindowedPrepend.id);
  report.afterWindowedPrepend = afterWindowedPrepend;
  if (afterWindowedPrepend.visibleIds.length === 0) {
    throw new Error('Windowed history prepend produced an empty viewport');
  }
  if (!afterWindowedPrepend.anchorPresent || !afterWindowedPrepend.anchorVisible) {
    throw new Error(`Windowed prepend lost anchor post ${beforeWindowedPrepend.id}`);
  }
  if (afterWindowedPrepend.anchorOffset === null
    || Math.abs(afterWindowedPrepend.anchorOffset - beforeWindowedPrepend.offset) > 3) {
    throw new Error('Windowed prepend moved the captured anchor');
  }
  if (pageErrors.length > 0) {
    throw new Error(`Browser page errors: ${pageErrors.join('; ')}`);
  }

  report.passed = true;
  console.log(`timeline virtualization E2E passed; report: ${reportPath}`);
} catch (error) {
  failure = error instanceof Error ? error : new Error(String(error));
  report.error = failure.stack || failure.message;
  if (page) {
    report.page = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      bodyText: document.body?.innerText?.slice(0, 2000) || '',
      bodyClass: document.body?.className || '',
    })).catch((captureError) => ({ captureError: String(captureError) }));
  }
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

if (failure) {
  console.error(`timeline virtualization E2E failed: ${failure.message}`);
  console.error(`report: ${reportPath}`);
  process.exitCode = 1;
}

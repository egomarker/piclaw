import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

const baseUrl = process.env.PICLAW_E2E_BASE_URL || 'http://127.0.0.1:8080';
const reportPath = resolve(
  process.env.PICLAW_E2E_REPORT_PATH || '/tmp/piclaw-markdown-table-alignment-report.json',
);
const executablePath = process.env.PICLAW_PLAYWRIGHT_EXECUTABLE_PATH || undefined;
const chatJid = 'web:markdown-table-alignment-e2e';
const markdown = [
  '| Left | Center | Right |',
  '| :--- | :---: | ---: |',
  '| alpha | beta | gamma |',
].join('\n');

const pageErrors: string[] = [];
const report: Record<string, unknown> = {
  baseUrl,
  chatJid,
  pageErrors,
  passed: false,
};

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;
let failure: Error | null = null;

try {
  browser = await chromium.launch({ headless: true, executablePath });
  context = await browser.newContext({
    viewport: { width: 1100, height: 800 },
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
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        posts: [{
          id: 1,
          chat_jid: chatJid,
          timestamp: '2026-01-01T00:00:00.000Z',
          data: {
            type: 'user_message',
            content: markdown,
            sender_name: 'Markdown Alignment Test',
          },
        }],
        has_more: false,
      }),
    });
  });

  await page.goto(`${baseUrl}/?chat_jid=${encodeURIComponent(chatJid)}`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('.post-content table tbody td', { timeout: 15_000 });

  const result = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>('.post-content table tbody td'));
    const headers = Array.from(document.querySelectorAll<HTMLElement>('.post-content table thead th'));
    const inspect = (elements: HTMLElement[]) => elements.map((element) => ({
      text: element.textContent?.trim() || '',
      align: element.getAttribute('align'),
      computedTextAlign: getComputedStyle(element).textAlign,
    }));
    return {
      cells: inspect(cells),
      headers: inspect(headers),
      tableCount: document.querySelectorAll('.post-content table').length,
    };
  });
  report.result = result;

  const expected = ['left', 'center', 'right'];
  for (const [kind, entries] of [['headers', result.headers], ['cells', result.cells]] as const) {
    if (entries.length !== expected.length) {
      throw new Error(`Expected three ${kind}, found ${entries.length}`);
    }
    entries.forEach((entry, index) => {
      if (entry.align !== expected[index]) {
        throw new Error(`${kind}[${index}] lost align=${expected[index]}: ${JSON.stringify(entry)}`);
      }
      if (entry.computedTextAlign !== expected[index]) {
        throw new Error(`${kind}[${index}] rendered ${entry.computedTextAlign}, expected ${expected[index]}`);
      }
    });
  }
  if (pageErrors.length > 0) {
    throw new Error(`Browser page errors: ${pageErrors.join('; ')}`);
  }

  report.passed = true;
  console.log(`markdown table alignment E2E passed; report: ${reportPath}`);
} catch (error) {
  failure = error instanceof Error ? error : new Error(String(error));
  report.error = failure.stack || failure.message;
  if (page) {
    report.page = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      bodyText: document.body?.innerText?.slice(0, 2000) || '',
    })).catch((captureError) => ({ captureError: String(captureError) }));
  }
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

if (failure) {
  console.error(`markdown table alignment E2E failed: ${failure.message}`);
  console.error(`report: ${reportPath}`);
  process.exitCode = 1;
}

#!/usr/bin/env bun

import { chromium, type Page } from 'playwright';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const runtimeRoot = resolve(import.meta.dir, '../..');
const repoRoot = resolve(runtimeRoot, '..');
const fixturePath = join(runtimeRoot, 'test/fixtures/markdown-live-preview-parity/atomic-port-parity.md');
const workDir = join(runtimeRoot, 'generated/cache/markdown-live-preview-parity');
const outDir = join(workDir, 'dist');
const source = readFileSync(fixturePath, 'utf8');

const scenarios = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function writeHarness() {
  rmSync(workDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const entry = `
import {
  EditorState,
  EditorView,
  lineNumbers,
  markdown,
  markdownLanguage,
  minimalSetup,
} from '#editor-vendor/codemirror';
import { markdownLivePreview, markdownParserExtensions } from '../../../extensions/viewers/editor/markdown/index.ts';
import { livePreviewFrozenField } from '../../../extensions/viewers/editor/markdown/live-preview.ts';

const source = ${JSON.stringify(source)};
const root = document.getElementById('editor');
if (!root) throw new Error('Missing #editor');

const view = new EditorView({
  parent: root,
  state: EditorState.create({
    doc: source,
    extensions: [
      minimalSetup,
      lineNumbers(),
      markdown({ base: markdownLanguage, extensions: markdownParserExtensions }),
      EditorView.lineWrapping,
      markdownLivePreview,
    ],
  }),
});

window.__piclawMarkdownHarness = {
  source,
  view,
  doc: () => view.state.doc.toString(),
  isFrozen: () => view.state.field(livePreviewFrozenField, false),
  focus: () => view.focus(),
  setCursor: (pos) => view.dispatch({ selection: { anchor: pos }, scrollIntoView: true }),
  scrollTo: (pos) => view.dispatch({ effects: EditorView.scrollIntoView(pos, { y: 'center' }) }),
  selection: () => ({
    from: view.state.selection.main.from,
    to: view.state.selection.main.to,
    head: view.state.selection.main.head,
    anchor: view.state.selection.main.anchor,
  }),
};
`;

  const html = `<!doctype html>
<html data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Piclaw Markdown Live Preview Parity Harness</title>
  <style>
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #111; color: #ddd; }
    #editor { width: 100vw; height: 100vh; }
    .cm-editor { height: 100%; }
  </style>
</head>
<body>
  <div id="editor"></div>
  <script type="module" src="./dist/harness.js"></script>
</body>
</html>`;

  const entryPath = join(workDir, 'harness.ts');
  writeFileSync(entryPath, entry);
  writeFileSync(join(workDir, 'index.html'), html);
  return entryPath;
}

async function buildHarness(entryPath: string) {
  const result = await Bun.build({
    entrypoints: [entryPath],
    outdir: outDir,
    target: 'browser',
    format: 'esm',
    sourcemap: 'none',
    naming: { entry: 'harness.js' },
  });
  if (!result.success) {
    for (const log of result.logs) console.error(log);
    throw new Error('Failed to build markdown live-preview browser harness.');
  }
}

async function count(page: Page, selector: string): Promise<number> {
  return page.locator(selector).count();
}

function serveHarness() {
  return Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    fetch(request) {
      const url = new URL(request.url);
      const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
      const safePath = pathname.replace(/^\/+/, '');
      const filePath = resolve(workDir, safePath);
      if (!filePath.startsWith(workDir) || !existsSync(filePath)) {
        return new Response('Not found', { status: 404 });
      }
      const headers = new Headers();
      if (filePath.endsWith('.html')) headers.set('content-type', 'text/html; charset=utf-8');
      else if (filePath.endsWith('.js')) headers.set('content-type', 'text/javascript; charset=utf-8');
      return new Response(Bun.file(filePath), { headers });
    },
  });
}

async function runScenario(page: Page, baseUrl: string, scenario: typeof scenarios[number]) {
  await page.setViewportSize({ width: scenario.width, height: scenario.height });
  await page.goto(baseUrl, { waitUntil: 'load' });
  await page.waitForSelector('.cm-editor');
  await page.waitForTimeout(250);

  assert(await count(page, '.cm-md-h1-line') >= 1, `${scenario.name}: missing live heading line decoration`);
  assert(await count(page, '.cm-md-heading-fold') >= 1, `${scenario.name}: missing heading fold affordance`);
  assert(await count(page, '.cm-md-callout') >= 1, `${scenario.name}: missing callout decoration`);
  assert(await count(page, '.cm-md-frontmatter-line') >= 1, `${scenario.name}: missing frontmatter decoration`);

  await page.evaluate(() => {
    const harness = (window as any).__piclawMarkdownHarness;
    harness.scrollTo(harness.source.indexOf('![Alt image'));
  });
  await page.waitForTimeout(150);
  assert(await count(page, '.cm-md-image-block') >= 1, `${scenario.name}: missing image block widget`);

  await page.evaluate(() => {
    const harness = (window as any).__piclawMarkdownHarness;
    harness.scrollTo(harness.source.indexOf('| Left | Center | Right |'));
  });
  await page.waitForTimeout(150);
  assert(await count(page, '.cm-md-table-line') >= 1, `${scenario.name}: missing table line decoration`);

  const initialDocMatches = await page.evaluate(() => {
    const harness = (window as any).__piclawMarkdownHarness;
    return harness.doc() === harness.source;
  });
  assert(initialDocMatches, `${scenario.name}: rendered preview changed raw Markdown source`);

  await page.evaluate(() => {
    const harness = (window as any).__piclawMarkdownHarness;
    const event = new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1 });
    harness.view.contentDOM.dispatchEvent(event);
  });
  assert(await page.evaluate(() => (window as any).__piclawMarkdownHarness.isFrozen()), `${scenario.name}: pointerdown did not freeze preview reveal`);
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: 1 })));
  await page.waitForTimeout(150);
  assert(!await page.evaluate(() => (window as any).__piclawMarkdownHarness.isFrozen()), `${scenario.name}: pointerup did not release preview freeze`);

  const tableSelection = await page.evaluate(async () => {
    const harness = (window as any).__piclawMarkdownHarness;
    const sourceText = harness.source as string;
    const tableFrom = sourceText.indexOf('| Left | Center | Right |');
    const tableTo = sourceText.indexOf('\n\nFootnote reference');
    if (tableFrom < 0 || tableTo < 0) throw new Error('table range not found');
    harness.focus();
    harness.setCursor(tableTo + 1);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    return { tableFrom, tableTo };
  });
  await page.keyboard.press('Backspace');
  const selected = await page.evaluate(() => (window as any).__piclawMarkdownHarness.selection());
  assert(selected.from === tableSelection.tableFrom && selected.to === tableSelection.tableTo, `${scenario.name}: Backspace did not select table atomically`);

  const finalDocMatches = await page.evaluate(() => {
    const harness = (window as any).__piclawMarkdownHarness;
    return harness.doc() === harness.source;
  });
  assert(finalDocMatches, `${scenario.name}: browser interactions changed raw Markdown source`);

  const viewportOk = await page.evaluate(() => {
    const scroller = document.querySelector('.cm-scroller') as HTMLElement | null;
    return !!scroller && scroller.clientWidth <= window.innerWidth;
  });
  assert(viewportOk, `${scenario.name}: editor scroller exceeds viewport width`);
}

async function main() {
  const entryPath = writeHarness();
  await buildHarness(entryPath);

  const server = serveHarness();
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    page.on('console', (message) => {
      if (message.type() === 'error') console.error(`[browser:${message.type()}] ${message.text()}`);
    });
    for (const scenario of scenarios) {
      await runScenario(page, server.url.href, scenario);
      console.log(`[markdown-live-preview-parity] ${scenario.name}: ok`);
    }
  } finally {
    await browser.close();
    server.stop(true);
  }
}

await main();

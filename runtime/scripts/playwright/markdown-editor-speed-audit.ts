#!/usr/bin/env bun
import { chromium, type Browser, type Page } from 'playwright';
import { existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { $ } from 'bun';

const runtimeRoot = resolve(import.meta.dir, '../..');
const repoRoot = resolve(runtimeRoot, '..');
const baselineRoot = join(runtimeRoot, 'generated/cache/markdown-editor-speed-baseline');
const tmpRoot = join(runtimeRoot, 'generated/cache/markdown-editor-speed-audit');
const baselineRef = process.env.BASELINE_REF || 'HEAD^';

const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

const runs = Number(process.env.SPEED_AUDIT_RUNS || 7);
const warmups = Number(process.env.SPEED_AUDIT_WARMUPS || 2);
const stressTables = process.env.SPEED_AUDIT_STRESS_TABLES === '1';

function median(values: number[]): number {
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}
function p95(values: number[]): number {
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)] ?? 0;
}
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildSource(): string {
  const image = `![Inline chart](data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='320'%20height='120'%3E%3Crect%20width='320'%20height='120'%20fill='%23233'%2F%3E%3Ctext%20x='20'%20y='70'%20fill='white'%3Espeed%20audit%3C%2Ftext%3E%3C%2Fsvg%3E)`;
  const intro = [
    '---',
    'title: Speed Audit',
    'tags: [editor, atomic-port]',
    '---',
    '',
    '# Speed Audit Heading',
    '',
    'Intro paragraph with **bold text** and _italic text_ for typing audit plus #tag and [safe link](https://example.com).',
    '',
    '> [!note]+ Interaction audit',
    '> This callout checks line-stable block rendering during scroll.',
    '',
    '| Name | Value | Notes |',
    '| --- | ---: | --- |',
    '| Alpha | 10 | stable |',
    '| Beta | 20 | source-preserving |',
    '',
    image,
    '',
    '```ts',
    'const sample = "code block";',
    '```',
    '',
    '[^a]: footnote text for parser extension coverage.',
    '',
  ].join('\n');
  const para = `Paragraph for typing and scroll audit with **strong** text, _emphasis_, #topic tags, and [links](https://example.com/path). `.repeat(2);
  const chunks: string[] = [intro];
  for (let i = 0; i < 180; i++) {
    chunks.push(`\n## Section ${i}\n\n${para}\n\n- [ ] task ${i}\n- [x] done ${i}\n`);
    if (i % 20 === 0) chunks.push(`\n| Col A | Col B |\n| --- | --- |\n| ${i} | table row |\n`);
    if (i % 30 === 0) chunks.push(`\n${image}\n`);
  }
  if (stressTables) {
    for (let table = 0; table < 48; table++) {
      chunks.push(`\n### Stress table ${table}\n\n| A | B | C | D | E | F |\n| --- | ---: | :---: | --- | --- | --- |\n`);
      for (let row = 0; row < 18; row++) {
        chunks.push(`| ${table}-${row}-0 | ${row} | center ${row} | text ${row} | pipe \\| value | tail |\n`);
      }
    }
  }
  return chunks.join('');
}

const source = buildSource();

async function ensureBaselineWorktree() {
  rmSync(baselineRoot, { recursive: true, force: true });
  await $`git -C ${repoRoot} worktree add --detach --quiet ${baselineRoot} ${baselineRef}`;
  const currentNodeModules = join(repoRoot, 'node_modules');
  const baselineNodeModules = join(baselineRoot, 'node_modules');
  if (existsSync(currentNodeModules) && !existsSync(baselineNodeModules)) symlinkSync(currentNodeModules, baselineNodeModules, 'dir');
}

async function cleanupBaselineWorktree() {
  try {
    await $`git -C ${repoRoot} worktree remove --force ${baselineRoot}`.quiet();
  } catch (error) {
    console.warn('[markdown-editor-speed-audit] failed to remove baseline worktree', error);
  }
  rmSync(baselineRoot, { recursive: true, force: true });
}

function writeHarness(label: string, root: string): { workDir: string; entryPath: string } {
  const workDir = join(tmpRoot, label);
  const outDir = join(workDir, 'dist');
  rmSync(workDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const importPrefix = `${root}/runtime`;

  const entry = `
import {
  EditorState,
  EditorView,
  lineNumbers,
  markdown,
  markdownLanguage,
  minimalSetup,
} from ${JSON.stringify(`${importPrefix}/extensions/viewers/editor/vendor/codemirror.js`)};
import { markdownLivePreview, markdownParserExtensions } from ${JSON.stringify(`${importPrefix}/extensions/viewers/editor/markdown/index.ts`)};

const source = ${JSON.stringify(source)};
const root = document.getElementById('editor');
if (!root) throw new Error('Missing #editor');

const mountStart = performance.now();
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
let mountPaintMs = null;
requestAnimationFrame(() => { mountPaintMs = performance.now() - mountStart; });

function quantile(values, q) {
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * q) - 1))] || 0;
}
function nextFrame() { return new Promise((resolve) => requestAnimationFrame(() => resolve())); }
function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

window.__speedHarness = {
  source,
  view,
  mountPaint: async () => { while (mountPaintMs == null) await nextFrame(); return mountPaintMs; },
  docMatches: () => view.state.doc.toString() === source,
  decorationCounts: () => ({
    headings: document.querySelectorAll('.cm-md-h1-line,.cm-md-h2-line').length,
    callouts: document.querySelectorAll('.cm-md-callout').length,
    frontmatter: document.querySelectorAll('.cm-md-frontmatter-line').length,
    images: document.querySelectorAll('.cm-md-image-block,.cm-md-image-wrap').length,
    tables: document.querySelectorAll('.cm-md-editable-table,.cm-md-table-line').length,
  }),
  measureTyping: async () => {
    const marker = 'Intro paragraph';
    let pos = source.indexOf(marker) + marker.length;
    view.focus();
    view.dispatch({ selection: { anchor: pos } });
    await nextFrame();
    const sample = ' abcdefghijklmnopqrstuvwxyz'.repeat(4);
    const times = [];
    for (const ch of sample) {
      const start = performance.now();
      view.dispatch({ changes: { from: pos, to: pos, insert: ch }, selection: { anchor: pos + ch.length } });
      times.push(performance.now() - start);
      pos += ch.length;
    }
    await wait(380);
    const totalMs = times.reduce((a, b) => a + b, 0);
    const medianMs = quantile(times, 0.5);
    const p95Ms = quantile(times, 0.95);
    if (view.state.doc.toString() !== source) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: source }, selection: { anchor: pos - sample.length } });
      await nextFrame();
    }
    return { totalMs, medianMs, p95Ms, chars: sample.length };
  },
  measureCursor: async () => {
    const positions = [];
    let cursor = 0;
    for (let i = 0; i < 120; i++) {
      cursor = source.indexOf('## Section ' + i, cursor + 1);
      if (cursor < 0) break;
      positions.push(cursor + 3);
    }
    const times = [];
    for (const pos of positions) {
      const start = performance.now();
      view.dispatch({ selection: { anchor: pos }, scrollIntoView: false });
      times.push(performance.now() - start);
    }
    await nextFrame();
    return { totalMs: times.reduce((a, b) => a + b, 0), medianMs: quantile(times, 0.5), p95Ms: quantile(times, 0.95), moves: times.length };
  },
  measurePointerDispatch: async () => {
    const target = view.contentDOM;
    const times = [];
    for (let i = 0; i < 80; i++) {
      const down = new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: i + 1 });
      const up = new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: i + 1 });
      const start = performance.now();
      target.dispatchEvent(down);
      window.dispatchEvent(up);
      times.push(performance.now() - start);
    }
    await wait(140);
    return { totalMs: times.reduce((a, b) => a + b, 0), medianMs: quantile(times, 0.5), p95Ms: quantile(times, 0.95), events: times.length };
  },
  measureScroll: async () => {
    const scroller = view.scrollDOM;
    const start = performance.now();
    for (let i = 0; i < 80; i++) {
      scroller.scrollTop = Math.min(scroller.scrollHeight, i * 180);
      scroller.dispatchEvent(new Event('scroll', { bubbles: true }));
      if (i % 8 === 0) await nextFrame();
    }
    await nextFrame();
    return { totalMs: performance.now() - start, steps: 80, scrollTop: scroller.scrollTop, scrollHeight: scroller.scrollHeight };
  },
  measureTableEdit: async () => {
    const cell = document.querySelector('.cm-md-editable-table tbody td');
    if (!cell) return { totalMs: Number.NaN, p95Ms: Number.NaN, operations: 0, skipped: 'no editable table' };
    const times = [];
    cell.focus();
    cell.textContent = '';
    const sample = 'abcdefghijklmnopqrstuvwxyz'.repeat(2);
    for (const ch of sample) {
      const start = performance.now();
      cell.textContent = (cell.textContent || '') + ch;
      cell.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: ch }));
      times.push(performance.now() - start);
    }
    await wait(120);
    if (view.state.doc.toString() !== source) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: source }, selection: { anchor: 0 } });
      await nextFrame();
    }
    return { totalMs: times.reduce((a, b) => a + b, 0), p95Ms: quantile(times, 0.95), operations: times.length };
  },
  measureTableMutation: async () => {
    const addRow = Array.from(document.querySelectorAll('.cm-md-editable-table-button')).find((button) => button.textContent === '+ row');
    const addCol = Array.from(document.querySelectorAll('.cm-md-editable-table-button')).find((button) => button.textContent === '+ col');
    if (!addRow || !addCol) return { totalMs: Number.NaN, operations: 0, skipped: 'no editable table controls' };
    const times = [];
    for (const button of [addRow, addCol]) {
      const start = performance.now();
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      times.push(performance.now() - start);
      await wait(40);
    }
    if (view.state.doc.toString() !== source) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: source }, selection: { anchor: 0 } });
      await nextFrame();
    }
    return { totalMs: times.reduce((a, b) => a + b, 0), operations: times.length };
  },
  measureTableBoundary: async () => {
    const currentDoc = view.state.doc.toString();
    const tableFrom = currentDoc.indexOf('| Name | Value | Notes |');
    if (tableFrom < 0) return { totalMs: 0, selectedChars: 0, skipped: 'no table' };
    const tableTo = currentDoc.indexOf('\\n\\n', tableFrom);
    const boundary = tableTo > tableFrom ? tableTo : tableFrom;
    view.focus();
    view.dispatch({ selection: { anchor: boundary } });
    await nextFrame();
    const start = performance.now();
    view.contentDOM.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
    const totalMs = performance.now() - start;
    await nextFrame();
    const selectedChars = view.state.selection.main.to - view.state.selection.main.from;
    if (view.state.doc.toString() !== source) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: source }, selection: { anchor: boundary } });
    }
    return { totalMs, selectedChars };
  },
};
`;

  const html = `<!doctype html><html data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#111;color:#ddd}#editor{width:100vw;height:100vh}.cm-editor{height:100%}</style></head><body><div id="editor"></div><script type="module" src="./dist/harness.js"></script></body></html>`;
  const entryPath = join(workDir, 'harness.ts');
  writeFileSync(entryPath, entry);
  writeFileSync(join(workDir, 'index.html'), html);
  return { workDir, entryPath };
}

async function buildHarness(entryPath: string, outDir: string) {
  const result = await Bun.build({ entrypoints: [entryPath], outdir: outDir, target: 'browser', format: 'esm', sourcemap: 'none', naming: { entry: 'harness.js' } });
  if (!result.success) {
    for (const log of result.logs) console.error(log);
    throw new Error(`Build failed: ${entryPath}`);
  }
}

function serve(workDir: string) {
  return Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    fetch(request) {
      const url = new URL(request.url);
      const rel = (url.pathname === '/' ? '/index.html' : url.pathname).replace(/^\/+/, '');
      const filePath = resolve(workDir, rel);
      if (!filePath.startsWith(workDir) || !existsSync(filePath)) return new Response('Not found', { status: 404 });
      const headers = new Headers();
      if (filePath.endsWith('.html')) headers.set('content-type', 'text/html; charset=utf-8');
      else if (filePath.endsWith('.js')) headers.set('content-type', 'text/javascript; charset=utf-8');
      return new Response(Bun.file(filePath), { headers });
    },
  });
}

type RunMetric = Record<string, any>;

async function runOne(page: Page, baseUrl: string, viewport: typeof viewports[number], options: { skipTyping?: boolean } = {}): Promise<RunMetric> {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(baseUrl, { waitUntil: 'load' });
  await page.waitForSelector('.cm-editor');
  const mountPaintMs = await page.evaluate(() => (window as any).__speedHarness.mountPaint());
  const counts = await page.evaluate(() => (window as any).__speedHarness.decorationCounts());
  const docMatchesBefore = await page.evaluate(() => (window as any).__speedHarness.docMatches());
  console.log(`[audit] ${viewport.name}: typing`);
  const typing = options.skipTyping
    ? { totalMs: Number.NaN, medianMs: Number.NaN, p95Ms: Number.NaN, chars: 0, skipped: 'pre-port baseline throws RangeError on docChanged live-preview rebuild for this audit document' }
    : await page.evaluate(() => (window as any).__speedHarness.measureTyping());
  console.log(`[audit] ${viewport.name}: cursor`);
  const cursor = await page.evaluate(() => (window as any).__speedHarness.measureCursor());
  console.log(`[audit] ${viewport.name}: pointer`);
  const pointer = await page.evaluate(() => (window as any).__speedHarness.measurePointerDispatch());
  console.log(`[audit] ${viewport.name}: scroll`);
  const scroll = await page.evaluate(() => (window as any).__speedHarness.measureScroll());
  console.log(`[audit] ${viewport.name}: table edit`);
  const tableEdit = await page.evaluate(() => (window as any).__speedHarness.measureTableEdit());
  console.log(`[audit] ${viewport.name}: table mutation`);
  const tableMutation = await page.evaluate(() => (window as any).__speedHarness.measureTableMutation());
  console.log(`[audit] ${viewport.name}: table`);
  const table = await page.evaluate(() => (window as any).__speedHarness.measureTableBoundary());
  const docMatchesAfter = await page.evaluate(() => (window as any).__speedHarness.docMatches());
  return { mountPaintMs, counts, docMatchesBefore, docMatchesAfter, typing, cursor, pointer, scroll, tableEdit, tableMutation, table };
}

function summarize(samples: RunMetric[]) {
  const field = (path: string) => samples.map((s) => path.split('.').reduce((v: any, k) => v?.[k], s)).filter((v) => Number.isFinite(v));
  return {
    mountPaintMs: { median: round(median(field('mountPaintMs'))), p95: round(p95(field('mountPaintMs'))) },
    typingTotalMs: { median: round(median(field('typing.totalMs'))), p95: round(p95(field('typing.totalMs'))) },
    typingP95PerCharMs: { median: round(median(field('typing.p95Ms'))), p95: round(p95(field('typing.p95Ms'))) },
    cursorTotalMs: { median: round(median(field('cursor.totalMs'))), p95: round(p95(field('cursor.totalMs'))) },
    cursorP95Ms: { median: round(median(field('cursor.p95Ms'))), p95: round(p95(field('cursor.p95Ms'))) },
    pointerTotalMs: { median: round(median(field('pointer.totalMs'))), p95: round(p95(field('pointer.totalMs'))) },
    pointerP95Ms: { median: round(median(field('pointer.p95Ms'))), p95: round(p95(field('pointer.p95Ms'))) },
    scrollTotalMs: { median: round(median(field('scroll.totalMs'))), p95: round(p95(field('scroll.totalMs'))) },
    tableEditMs: { median: round(median(field('tableEdit.totalMs'))), p95: round(p95(field('tableEdit.totalMs'))) },
    tableEditP95Ms: { median: round(median(field('tableEdit.p95Ms'))), p95: round(p95(field('tableEdit.p95Ms'))) },
    tableMutationMs: { median: round(median(field('tableMutation.totalMs'))), p95: round(p95(field('tableMutation.totalMs'))) },
    tableBoundaryMs: { median: round(median(field('table.totalMs'))), p95: round(p95(field('table.totalMs'))) },
    tableSelectedChars: { median: round(median(field('table.selectedChars'))), p95: round(p95(field('table.selectedChars'))) },
    docMatchesBefore: samples.every((s) => s.docMatchesBefore),
    docMatchesAfter: samples.every((s) => s.docMatchesAfter),
    lastCounts: samples.at(-1)?.counts,
  };
}

async function runSuite(browser: Browser, label: string, root: string, options: { skipTyping?: boolean } = {}) {
  const { workDir, entryPath } = writeHarness(label, root);
  await buildHarness(entryPath, join(workDir, 'dist'));
  const server = serve(workDir);
  try {
    const page = await browser.newPage();
    page.on('console', (m) => console.log(`[browser:${label}:${m.type()}] ${m.text()}`));
    const results: Record<string, any> = {};
    for (const viewport of viewports) {
      const samples: RunMetric[] = [];
      for (let i = 0; i < warmups + runs; i++) {
        const sample = await runOne(page, server.url.href, viewport, options);
        if (i >= warmups) samples.push(sample);
      }
      results[viewport.name] = summarize(samples);
      console.log(`[${label}] ${viewport.name}`, JSON.stringify(results[viewport.name]));
    }
    await page.close();
    return results;
  } finally {
    server.stop(true);
  }
}

function compare(base: any, head: any) {
  const metrics = ['mountPaintMs', 'typingTotalMs', 'typingP95PerCharMs', 'cursorTotalMs', 'cursorP95Ms', 'pointerTotalMs', 'pointerP95Ms', 'scrollTotalMs', 'tableEditMs', 'tableEditP95Ms', 'tableMutationMs', 'tableBoundaryMs'];
  const rows: any[] = [];
  for (const viewport of viewports) {
    for (const metric of metrics) {
      const b = base[viewport.name][metric].median;
      const h = head[viewport.name][metric].median;
      const delta = round(h - b);
      const ratio = b > 0 ? round(h / b) : null;
      rows.push({ viewport: viewport.name, metric, baselineMedian: b, headMedian: h, delta, ratio });
    }
  }
  return rows;
}

async function main() {
  rmSync(tmpRoot, { recursive: true, force: true });
  mkdirSync(tmpRoot, { recursive: true });
  await ensureBaselineWorktree();
  const browser = await chromium.launch({ headless: true });
  try {
    const baseline = await runSuite(browser, 'baseline-head-parent', baselineRoot, { skipTyping: true });
    const head = await runSuite(browser, 'atomic-port-head', repoRoot);
    const rows = compare(baseline, head);
    const output = { baselineRef, headRef: 'working-tree', runs, warmups, stressTables, sourceLength: source.length, baseline, head, comparison: rows };
    const reportPath = process.env.SPEED_AUDIT_REPORT || join(runtimeRoot, 'generated/cache/markdown-editor-speed-audit.json');
    writeFileSync(reportPath, JSON.stringify(output, null, 2));
    console.log(`REPORT ${reportPath}`);
    console.table(rows);
  } finally {
    await browser.close();
    await cleanupBaselineWorktree();
  }
}

await main();

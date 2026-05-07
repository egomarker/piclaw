/**
 * CDP Browser Control Extension for pi.
 *
 * Controls Chromium-family browsers (Edge/Chrome/Chromium) via the Chrome
 * DevTools Protocol. Supports tab listing, evaluation, navigation, clicking,
 * screenshots, sleeping, and PDF export.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import * as fs from "node:fs";
import * as path from "node:path";
import { tmpdir } from "node:os";
import {
  cdpSend,
  ensureBrowser,
  findBrowser,
  findCdpPort,
  getTargets,
  httpGet,
  httpPut,
  printToPdf,
  sleepWithSignal,
  withConnectedTab,
} from "./cdp.ts";

function buildClickExpression(selector: string): string {
  const selectorLiteral = JSON.stringify(selector);
  return `(() => {
    const selector = ${selectorLiteral};
    const el = document.querySelector(selector);
    if (!el) return 'not found: ' + selector;
    el.click();
    return 'clicked: ' + ((el.textContent || el.tagName || '').substring(0, 60));
  })()`;
}

function truncate(text: string, max = 40000): string {
  if (text.length <= max) return text;
  return text.substring(0, max) + `\n\n[Truncated at ${max} chars]`;
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "cdp_browser",
    label: "CDP Browser Control",
    description:
      "Control any Chromium browser (Edge/Chrome) via Chrome DevTools Protocol. " +
      "Actions: tabs (list tabs), eval (run JS), navigate (go to URL), open (new tab), " +
      "close (close tabs), click (click element), screenshot (capture page), print_pdf (export page to PDF), sleep (wait ms).",
    promptSnippet: "Control Edge browser tabs, evaluate JS, navigate, screenshot or export PDF via CDP",
    parameters: Type.Object({
      action: Type.String({ description: "One of: tabs, eval, navigate, open, close, click, screenshot, print_pdf, sleep" }),
      expr: Type.Optional(Type.String({ description: "JS expression (for eval action)" })),
      url: Type.Optional(Type.String({ description: "URL (for navigate/open/print_pdf actions)" })),
      selector: Type.Optional(Type.String({ description: "CSS selector (for click action)" })),
      match: Type.Optional(Type.String({ description: "Tab title/URL substring to target a specific tab" })),
      outPath: Type.Optional(Type.String({ description: "Output file path (for screenshot/print_pdf)" })),
      ms: Type.Optional(Type.Number({ description: "Milliseconds to sleep (sleep) or wait before printing (print_pdf)" })),
      landscape: Type.Optional(Type.Boolean({ description: "Landscape orientation for print_pdf" })),
      displayHeaderFooter: Type.Optional(Type.Boolean({ description: "Whether print_pdf should render header/footer HTML" })),
      headerTemplate: Type.Optional(Type.String({ description: "HTML header template for print_pdf" })),
      footerTemplate: Type.Optional(Type.String({ description: "HTML footer template for print_pdf" })),
      preferCSSPageSize: Type.Optional(Type.Boolean({ description: "Prefer CSS @page size for print_pdf (default true)" })),
    }),
    async execute(_id, params, signal, _onUpdate, ctx) {
      if (params.action === "sleep") {
        const ms = params.ms || 3000;
        await sleepWithSignal(ms, signal);
        return { content: [{ type: "text", text: `Slept ${ms}ms` }], details: { ms } };
      }
      if (params.action === "print_pdf" && !params.url && !params.match) {
        throw new Error("url or match is required for print_pdf action");
      }

      const port = await findCdpPort(signal) ?? await ensureBrowser(signal);
      if (!port) {
        const browser = findBrowser();
        return {
          content: [{
            type: "text",
            text: browser
              ? `No CDP browser found. ${browser.name} exists at ${browser.command} but couldn't launch with CDP. Try: "${browser.command}" --remote-debugging-port=9224`
              : "No Chromium browser found. Install Edge, Chrome, or Chromium and launch with --remote-debugging-port=9224",
          }],
          details: {},
        };
      }

      switch (params.action) {
        case "tabs": {
          const version = await httpGet(`http://localhost:${port}/json/version`, 3000, signal);
          const pages = await getTargets(port, signal);
          const lines = [`CDP: port ${port} | ${version.Browser}`, `Tabs: ${pages.length}`, ""];
          pages.forEach((page, index) => {
            lines.push(`${index + 1}. ${page.title}`);
            lines.push(`   ${page.url.substring(0, 150)}`);
          });
          return { content: [{ type: "text", text: lines.join("\n") }], details: { port, tabCount: pages.length } };
        }

        case "eval": {
          if (!params.expr) throw new Error("expr is required for eval action");
          return withConnectedTab(port, params.match, async (ws) => {
            const result = await cdpSend(ws, "Runtime.evaluate", {
              expression: params.expr,
              returnByValue: true,
              awaitPromise: true,
            }, signal);
            const value = result?.result?.value;
            const text = value !== undefined
              ? (typeof value === "string" ? value : JSON.stringify(value, null, 2))
              : JSON.stringify(result, null, 2);
            return { content: [{ type: "text", text: truncate(text) }], details: {} };
          }, signal);
        }

        case "navigate": {
          if (!params.url) throw new Error("url is required for navigate action");
          return withConnectedTab(port, params.match, async (ws) => {
            await cdpSend(ws, "Page.enable", undefined, signal);
            await cdpSend(ws, "Page.navigate", { url: params.url }, signal);
            return { content: [{ type: "text", text: `Navigated to: ${params.url}` }], details: {} };
          }, signal);
        }

        case "open": {
          if (!params.url) throw new Error("url is required for open action");
          await httpPut(`http://localhost:${port}/json/new?${encodeURIComponent(params.url)}`, 5000, signal);
          return { content: [{ type: "text", text: `Opened new tab: ${params.url}` }], details: {} };
        }

        case "close": {
          if (!params.match) throw new Error("match is required for close action");
          const pages = await getTargets(port, signal);
          const matching = pages.filter((page) => page.url?.includes(params.match!) || page.title?.toLowerCase().includes(params.match!.toLowerCase()));
          const closed: string[] = [];
          for (const page of matching) {
            await httpPut(`http://localhost:${port}/json/close/${page.id}`, 5000, signal);
            closed.push(page.title);
          }
          return {
            content: [{ type: "text", text: closed.length > 0 ? `Closed ${closed.length} tab(s): ${closed.join(", ")}` : `No tabs matching "${params.match}"` }],
            details: { closed },
          };
        }

        case "click": {
          if (!params.selector) throw new Error("selector is required for click action");
          return withConnectedTab(port, params.match, async (ws) => {
            const result = await cdpSend(ws, "Runtime.evaluate", {
              expression: buildClickExpression(params.selector),
              returnByValue: true,
            }, signal);
            return { content: [{ type: "text", text: result?.result?.value ?? "no result" }], details: {} };
          }, signal);
        }

        case "screenshot": {
          return withConnectedTab(port, params.match, async (ws) => {
            await cdpSend(ws, "Page.enable", undefined, signal);
            const result = await cdpSend(ws, "Page.captureScreenshot", { format: "png" }, signal);
            if (!result?.data) {
              return { content: [{ type: "text", text: "Failed to capture screenshot" }], details: {} };
            }
            const defaultDir = ctx?.cwd ? path.join(ctx.cwd, "tmp") : tmpdir();
            fs.mkdirSync(defaultDir, { recursive: true });
            const file = params.outPath || path.join(defaultDir, "cdp-screenshot.png");
            fs.writeFileSync(file, Buffer.from(result.data, "base64"));
            return { content: [{ type: "text", text: `Screenshot saved: ${file}` }], details: { file } };
          }, signal);
        }

        case "print_pdf": {
          if (!params.url && !params.match) {
            throw new Error("url or match is required for print_pdf action");
          }
          const defaultDir = ctx?.cwd ? path.join(ctx.cwd, "tmp") : tmpdir();
          fs.mkdirSync(defaultDir, { recursive: true });
          const file = params.outPath || path.join(defaultDir, "cdp-print.pdf");
          const result = await printToPdf({
            port,
            outPath: file,
            url: params.url,
            match: params.match,
            waitMs: params.ms ?? 1500,
            landscape: params.landscape,
            displayHeaderFooter: params.displayHeaderFooter,
            headerTemplate: params.headerTemplate,
            footerTemplate: params.footerTemplate,
            preferCSSPageSize: params.preferCSSPageSize,
            signal,
          });
          return {
            content: [{ type: "text", text: `PDF saved: ${result.file}` }],
            details: { file: result.file, title: result.title, url: result.url },
          };
        }

        default:
          throw new Error("Unknown action: " + params.action + ". Use: tabs, eval, navigate, open, close, click, screenshot, print_pdf, sleep");
      }
    },
  });

  pi.registerCommand("cdp-tabs", {
    description: "List browser tabs via CDP",
    handler: async (_args, ctx) => {
      const port = await findCdpPort();
      if (!port) {
        ctx.ui.notify("No CDP browser found", "warning");
        return;
      }
      const pages = await getTargets(port);
      ctx.ui.notify(`${pages.length} tabs: ${pages.map((page) => page.title).join(" | ")}`, "info");
    },
  });
}

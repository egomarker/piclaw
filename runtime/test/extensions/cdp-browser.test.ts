import { describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import cdpBrowserExtension from "../../extensions/browser/cdp-browser/index.ts";

type ToolDef = { name: string; execute: (...args: any[]) => Promise<any> };

function createFakeApi() {
  const tools = new Map<string, ToolDef>();

  const api: ExtensionAPI = {
    on() {},
    registerTool(tool: any) { tools.set(tool.name, tool); },
    registerCommand() {},
    registerShortcut() {},
    registerFlag() {},
    getFlag() { return undefined; },
    registerMessageRenderer() {},
    sendMessage() {},
    sendUserMessage() {},
    appendEntry() {},
    setSessionName() {},
    getSessionName() { return undefined; },
    setLabel() {},
    exec: async () => ({ exitCode: 0, stdout: "", stderr: "" }),
    getActiveTools: () => [],
    getAllTools: () => [],
    setActiveTools() {},
    getCommands: () => [],
    setModel: async () => true,
    getThinkingLevel: () => "medium" as any,
    setThinkingLevel() {},
    registerProvider() {},
    unregisterProvider() {},
  } as unknown as ExtensionAPI;

  return { api, tools };
}

describe("cdp-browser extension", () => {
  test("sleep action completes without requiring a browser session", async () => {
    const fake = createFakeApi();
    cdpBrowserExtension(fake.api);
    const tool = fake.tools.get("cdp_browser");
    expect(tool).toBeDefined();

    const result = await tool!.execute("call-1", { action: "sleep", ms: 1 }, undefined, undefined, { cwd: "/tmp" });
    expect(result.content[0].text).toBe("Slept 1ms");
    expect(result.details.ms).toBe(1);
  });

  test("print_pdf validates target before attempting browser work", async () => {
    const fake = createFakeApi();
    cdpBrowserExtension(fake.api);
    const tool = fake.tools.get("cdp_browser");
    expect(tool).toBeDefined();

    await expect(tool!.execute("call-0", { action: "print_pdf" }, undefined, undefined, { cwd: "/tmp" }))
      .rejects.toThrow("url or match is required for print_pdf action");
  });

  test("sleep action respects cancellation signal", async () => {
    const fake = createFakeApi();
    cdpBrowserExtension(fake.api);
    const tool = fake.tools.get("cdp_browser");
    expect(tool).toBeDefined();

    const controller = new AbortController();
    const pending = tool!.execute("call-1", { action: "sleep", ms: 1000 }, controller.signal, undefined, { cwd: "/tmp" });
    setTimeout(() => controller.abort(), 10);

    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });
});

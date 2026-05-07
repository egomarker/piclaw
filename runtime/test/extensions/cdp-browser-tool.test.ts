import { describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import cdpBrowserToolExtension from "../../extensions/browser/cdp-browser-tool/index.ts";

type ToolDef = { name: string; execute: (...args: any[]) => Promise<any> };
type CommandDef = { name: string; handler: (...args: any[]) => Promise<any> | any };

function createFakeApi() {
  const tools = new Map<string, ToolDef>();
  const commands = new Map<string, CommandDef>();

  const api: ExtensionAPI = {
    on() {},
    registerTool(tool: any) { tools.set(tool.name, tool); },
    registerCommand(name: string, command: any) { commands.set(name, { name, ...command }); },
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

  return { api, tools, commands };
}

describe("cdp-browser tool shim", () => {
  test("registers the cdp_browser tool and cdp-tabs command", () => {
    const fake = createFakeApi();
    cdpBrowserToolExtension(fake.api);

    expect(fake.tools.has("cdp_browser")).toBe(true);
    expect(fake.commands.has("cdp-tabs")).toBe(true);
  });

  test("sleep action completes without requiring a browser session", async () => {
    const fake = createFakeApi();
    cdpBrowserToolExtension(fake.api);
    const tool = fake.tools.get("cdp_browser");
    expect(tool).toBeDefined();

    const result = await tool!.execute("call-1", { action: "sleep", ms: 1 }, undefined, undefined, { cwd: "/tmp" });
    expect(result.content[0].text).toBe("Slept 1ms");
    expect(result.details.ms).toBe(1);
  });
});

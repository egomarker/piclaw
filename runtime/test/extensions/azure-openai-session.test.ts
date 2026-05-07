import { afterEach, describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import azureOpenAiSessionExtension, {
  setAzureOpenAiSessionModuleLoadersForTests,
} from "../../extensions/integrations/azure-openai-session/index.ts";

type CommandDef = { name: string; handler: (...args: any[]) => Promise<any> | any };

afterEach(() => {
  setAzureOpenAiSessionModuleLoadersForTests(null);
});

describe("azure-openai session shim", () => {
  test("registers the lightweight context hook plus image/flux commands", () => {
    const handlers: Array<{ event: string; handler: (...args: any[]) => any }> = [];
    const commands = new Map<string, CommandDef>();

    const api: ExtensionAPI = {
      on(event: string, handler: (...args: any[]) => any) { handlers.push({ event, handler }); },
      registerTool() {},
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
      getThinkingLevel: () => "off" as any,
      setThinkingLevel() {},
      registerProvider() {},
      unregisterProvider() {},
    } as unknown as ExtensionAPI;

    azureOpenAiSessionExtension(api);

    expect(handlers.some((entry) => entry.event === "context")).toBe(true);
    expect(commands.has("image")).toBe(true);
    expect(commands.has("flux")).toBe(true);
    expect(handlers.some((entry) => entry.event === "session_start")).toBe(false);
    expect(handlers.some((entry) => entry.event === "session_shutdown")).toBe(false);
  });

  test("keeps provider and image modules lazy until the matching hook runs", async () => {
    const handlers: Array<{ event: string; handler: (...args: any[]) => any }> = [];
    const commands = new Map<string, CommandDef>();
    const calls = {
      provider: 0,
      images: 0,
      repaired: 0,
      image: [] as string[],
      flux: [] as string[],
    };

    setAzureOpenAiSessionModuleLoadersForTests({
      provider: async () => ({
        repairAzureContext: async () => {
          calls.provider += 1;
          calls.repaired += 1;
          return { messages: [] };
        },
      } as any),
      images: async () => ({
        executeAzureImageCommand: async (_pi: unknown, input: string) => {
          calls.images += 1;
          calls.image.push(input);
        },
        executeAzureFluxCommand: async (_pi: unknown, input: string) => {
          calls.images += 1;
          calls.flux.push(input);
        },
      } as any),
    });

    const api: ExtensionAPI = {
      on(event: string, handler: (...args: any[]) => any) { handlers.push({ event, handler }); },
      registerTool() {},
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
      getThinkingLevel: () => "off" as any,
      setThinkingLevel() {},
      registerProvider() {},
      unregisterProvider() {},
    } as unknown as ExtensionAPI;

    azureOpenAiSessionExtension(api);

    expect(calls).toEqual({
      provider: 0,
      images: 0,
      repaired: 0,
      image: [],
      flux: [],
    });

    await handlers.find((entry) => entry.event === "context")?.handler({ messages: [] }, { model: undefined });
    expect(calls.provider).toBe(1);
    expect(calls.repaired).toBe(1);
    expect(calls.images).toBe(0);

    await commands.get("image")?.handler("draw cat");
    expect(calls.images).toBe(1);
    expect(calls.image).toEqual(["draw cat"]);
    expect(calls.flux).toEqual([]);

    await commands.get("flux")?.handler("draw dog");
    expect(calls.images).toBe(2);
    expect(calls.image).toEqual(["draw cat"]);
    expect(calls.flux).toEqual(["draw dog"]);
  });
});

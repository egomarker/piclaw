import { afterEach, describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import azureOpenAiExtension, {
  setAzureProviderBootstrapFactoryForTests,
} from "../../extensions/integrations/azure-openai.ts";

type Handler = { event: string; handler: (...args: any[]) => any };

describe("azure-openai bootstrap lifecycle", () => {
  afterEach(() => {
    setAzureProviderBootstrapFactoryForTests(null);
  });

  test("session_start drives bootstrap refresh and web progress UI", async () => {
    const handlers: Handler[] = [];
    const providerRegistrations: string[] = [];

    const api: ExtensionAPI = {
      on(event: string, handler: (...args: any[]) => any) { handlers.push({ event, handler }); },
      registerTool() {},
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
      getThinkingLevel: () => "off" as any,
      setThinkingLevel() {},
      registerProvider(name: string) { providerRegistrations.push(name); },
      unregisterProvider() {},
    } as unknown as ExtensionAPI;

    let refreshCalls = 0;
    let stopCalls = 0;
    setAzureProviderBootstrapFactoryForTests((register) => ({
      stop() { stopCalls += 1; },
      async refresh() {
        refreshCalls += 1;
        register("azure-openai", { ok: true });
      },
    }));

    azureOpenAiExtension(api);

    const sessionStart = handlers.find((entry) => entry.event === "session_start")?.handler;
    expect(typeof sessionStart).toBe("function");

    const calls = {
      messages: [] as Array<string | undefined>,
      indicators: [] as Array<{ frames?: string[]; intervalMs?: number } | undefined>,
      statuses: [] as Array<[string, string | undefined]>,
      notifications: [] as Array<[string, string | undefined]>,
    };
    const ui = {
      setWorkingMessage(message?: string) { calls.messages.push(message); },
      setWorkingIndicator(options?: { frames?: string[]; intervalMs?: number }) { calls.indicators.push(options); },
      setStatus(key: string, value: string | undefined) { calls.statuses.push([key, value]); },
      notify(message: string, level?: string) { calls.notifications.push([message, level]); },
    };

    await sessionStart?.({}, { hasUI: true, ui });

    expect(refreshCalls).toBe(1);
    expect(stopCalls).toBe(0);
    expect(providerRegistrations).toContain("azure-openai");
    expect(calls.messages[0]).toBe("Azure: refreshing provider bootstrap…");
    expect(calls.indicators[0]).toEqual({
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      intervalMs: 90,
    });
    expect(calls.statuses[calls.statuses.length - 1]).toEqual(["azure-openai", "Azure providers ready"]);
    expect(calls.messages[calls.messages.length - 1]).toBeUndefined();
    expect(calls.indicators[calls.indicators.length - 1]).toEqual({ frames: [] });
  });

  test("session_start clears status and notifies on bootstrap failure", async () => {
    const handlers: Handler[] = [];

    const api: ExtensionAPI = {
      on(event: string, handler: (...args: any[]) => any) { handlers.push({ event, handler }); },
      registerTool() {},
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
      getThinkingLevel: () => "off" as any,
      setThinkingLevel() {},
      registerProvider() {},
      unregisterProvider() {},
    } as unknown as ExtensionAPI;

    let stopCalls = 0;
    setAzureProviderBootstrapFactoryForTests(() => ({
      stop() { stopCalls += 1; },
      async refresh() {
        throw new Error("token unavailable");
      },
    }));

    azureOpenAiExtension(api);

    const sessionStart = handlers.find((entry) => entry.event === "session_start")?.handler;
    expect(typeof sessionStart).toBe("function");

    const calls = {
      messages: [] as Array<string | undefined>,
      indicators: [] as Array<{ frames?: string[]; intervalMs?: number } | undefined>,
      statuses: [] as Array<[string, string | undefined]>,
      notifications: [] as Array<[string, string | undefined]>,
    };
    const ui = {
      setWorkingMessage(message?: string) { calls.messages.push(message); },
      setWorkingIndicator(options?: { frames?: string[]; intervalMs?: number }) { calls.indicators.push(options); },
      setStatus(key: string, value: string | undefined) { calls.statuses.push([key, value]); },
      notify(message: string, level?: string) { calls.notifications.push([message, level]); },
    };

    await expect(sessionStart?.({}, { hasUI: true, ui })).rejects.toThrow("token unavailable");

    expect(stopCalls).toBe(1);
    expect(calls.statuses).toContainEqual(["azure-openai", undefined]);
    expect(calls.notifications).toContainEqual(["Azure provider bootstrap failed: token unavailable", "error"]);
    expect(calls.messages[calls.messages.length - 1]).toBeUndefined();
    expect(calls.indicators[calls.indicators.length - 1]).toEqual({ frames: [] });
  });

  test("session_shutdown stops the active bootstrap instance", async () => {
    const handlers: Handler[] = [];

    const api: ExtensionAPI = {
      on(event: string, handler: (...args: any[]) => any) { handlers.push({ event, handler }); },
      registerTool() {},
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
      getThinkingLevel: () => "off" as any,
      setThinkingLevel() {},
      registerProvider() {},
      unregisterProvider() {},
    } as unknown as ExtensionAPI;

    let stopCalls = 0;
    setAzureProviderBootstrapFactoryForTests(() => ({
      stop() { stopCalls += 1; },
      async refresh() {},
    }));

    azureOpenAiExtension(api);

    const sessionStart = handlers.find((entry) => entry.event === "session_start")?.handler;
    const sessionShutdown = handlers.find((entry) => entry.event === "session_shutdown")?.handler;
    expect(typeof sessionStart).toBe("function");
    expect(typeof sessionShutdown).toBe("function");

    await sessionStart?.({}, { hasUI: false });
    sessionShutdown?.({ type: "session_shutdown", reason: "fork", targetSessionFile: "/tmp/forked.jsonl" });

    expect(stopCalls).toBe(1);
  });
});

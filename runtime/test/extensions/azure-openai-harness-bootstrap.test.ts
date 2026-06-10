import { describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import "../helpers.js";
import { createFakeExtensionApi } from "./fake-extension-api.js";
import { importFresh, waitFor } from "../helpers.js";

type FakeHandler = { event: string; handler: (...args: any[]) => any };

function getHandler(handlers: FakeHandler[], event: string): FakeHandler {
  const found = handlers.find((entry) => entry.event === event);
  expect(found).toBeDefined();
  return found!;
}

function makeTimerApi() {
  const scheduled: any[] = [];
  const cleared: any[] = [];
  return {
    scheduled,
    cleared,
    api: {
      setTimeout(_fn: (...args: any[]) => unknown, ms?: number) {
        const handle = { id: scheduled.length + 1, ms: Number(ms) || 0 };
        scheduled.push(handle);
        return handle as unknown as ReturnType<typeof setTimeout>;
      },
      clearTimeout(handle: ReturnType<typeof setTimeout>) {
        cleared.push(handle);
      },
    },
  };
}

function tokenCacheForTests() {
  const expiresOnEpoch = Math.floor(Date.now() / 1000) + 3600;
  return {
    accessToken: "token-for-tests",
    expiresOn: String(expiresOnEpoch),
    expiresOnEpoch,
  };
}

async function withHarnessModule<T>(
  run: (context: {
    mod: any;
    api: ReturnType<typeof createFakeExtensionApi>;
    scheduled: any[];
    cleared: any[];
  }) => Promise<T>,
): Promise<T> {
  const mod = await importFresh<any>("../extensions/experimental/azure-openai.harness.ts");
  const timers = makeTimerApi();
  mod.setAzureHarnessBootstrapHooksForTests({
    timerApi: timers.api,
    ensureToken: async () => tokenCacheForTests(),
    ensureModelCaps: async () => {},
    staticApiKey: "",
  });

  try {
    const api = createFakeExtensionApi({ allTools: [] });
    mod.default(api.api as ExtensionAPI);
    return await run({ mod, api, scheduled: timers.scheduled, cleared: timers.cleared });
  } finally {
    mod.setAzureHarnessBootstrapHooksForTests(null);
  }
}

describe("azure-openai harness bootstrap lifecycle", () => {
  test("session_start drives bootstrap refresh and web progress UI", async () => {
    await withHarnessModule(async ({ api }) => {
      const start = getHandler(api.handlers as FakeHandler[], "session_start");
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

      await start.handler({}, { hasUI: true, ui });

      expect(calls.messages[0]).toBe("Azure harness: refreshing provider bootstrap…");
      expect(calls.indicators[0]).toEqual({
        frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
        intervalMs: 90,
      });
      expect(calls.statuses[calls.statuses.length - 1]).toEqual(["azure-openai", "Azure harness providers ready"]);
      expect(calls.notifications).toEqual([]);
      expect(calls.messages[calls.messages.length - 1]).toBeUndefined();
      expect(calls.indicators[calls.indicators.length - 1]).toEqual({ frames: [] });
    });
  });

  test("session_start clears status and notifies on bootstrap failure", async () => {
    await withHarnessModule(async ({ api }) => {
      const start = getHandler(api.handlers as FakeHandler[], "session_start");
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

      (api.api as any).registerProvider = () => {
        throw new Error("provider register failed");
      };

      await expect(start.handler({}, { hasUI: true, ui })).rejects.toThrow("provider register failed");

      expect(calls.statuses).toContainEqual(["azure-openai", undefined]);
      expect(calls.notifications).toContainEqual(["Azure harness bootstrap failed: provider register failed", "error"]);
      expect(calls.messages[calls.messages.length - 1]).toBeUndefined();
      expect(calls.indicators[calls.indicators.length - 1]).toEqual({ frames: [] });
    });
  });

  test("session_shutdown logs metadata and clears the active refresh timer", async () => {
    await withHarnessModule(async ({ api, scheduled, cleared }) => {
      const start = getHandler(api.handlers as FakeHandler[], "session_start");
      const shutdown = getHandler(api.handlers as FakeHandler[], "session_shutdown");
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => { logs.push(args.map((value) => String(value)).join(" ")); };

      try {
        await start.handler({}, { hasUI: false });
        await waitFor(() => scheduled.some((handle) => Number(handle?.ms) >= 60000), 1000, 10);
        const lastHandle = [...scheduled].reverse().find((handle) => Number(handle?.ms) >= 60000);
        expect(lastHandle).toBeDefined();

        await shutdown.handler({ type: "session_shutdown", reason: "fork", targetSessionFile: "/tmp/forked-harness.jsonl" });

        expect(cleared).toContain(lastHandle);
        expect(logs.some((entry) => entry.includes("[azure-openai-harness] session shutdown (fork) → /tmp/forked-harness.jsonl"))).toBe(true);
      } finally {
        console.log = originalLog;
      }
    });
  });
});

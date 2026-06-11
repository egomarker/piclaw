import { describe, expect, test } from "bun:test";
import "../helpers.js";
import { createFakeExtensionApi } from "./fake-extension-api.js";
import {
  importFresh,
  waitFor,
} from "../helpers.js";

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

describe("session_shutdown upgrade regressions", () => {
  test("azure-openai provider bootstrap stop clears its scheduled refresh timer", async () => {
    const mod = await importFresh<any>("../extensions/integrations/azure-openai.ts");
    const timers = makeTimerApi();
    const registrations: string[] = [];

    const bootstrap = mod.startAzureProviderBootstrap((name: string) => registrations.push(name), {
      timerApi: timers.api,
      ensureToken: async () => tokenCacheForTests(),
      ensureModelCaps: async () => {},
      staticApiKey: "",
    });
    await waitFor(() => timers.scheduled.some((handle) => Number(handle?.ms) >= 60000), 1000, 10);
    const lastHandle = [...timers.scheduled].reverse().find((handle) => Number(handle?.ms) >= 60000);
    expect(lastHandle).toBeDefined();
    expect(registrations.length).toBeGreaterThan(0);

    bootstrap.stop();
    expect(timers.cleared).toContain(lastHandle);
  });

  test("azure-openai integration session_shutdown stops its active bootstrap", async () => {
    const mod = await importFresh<any>("../extensions/integrations/azure-openai.ts");
    let stopCalls = 0;
    let refreshCalls = 0;
    mod.setAzureProviderBootstrapFactoryForTests(() => ({
      stop: () => { stopCalls++; },
      refresh: async () => { refreshCalls++; },
    }));
    try {
      const fake = createFakeExtensionApi({ allTools: [] });
      mod.default(fake.api);

      const start = getHandler(fake.handlers as FakeHandler[], "session_start");
      const shutdown = getHandler(fake.handlers as FakeHandler[], "session_shutdown");

      await start.handler({}, { hasUI: false });
      expect(refreshCalls).toBe(1);

      await shutdown.handler({ type: "session_shutdown", reason: "fork", targetSessionFile: "/tmp/forked.jsonl" });
      expect(stopCalls).toBe(1);
    } finally {
      mod.setAzureProviderBootstrapFactoryForTests(null);
    }
  });

  test("azure-openai harness clears its refresh timer on session shutdown", async () => {
    const mod = await importFresh<any>("../extensions/experimental/azure-openai.harness.ts");
    const timers = makeTimerApi();
    mod.setAzureHarnessBootstrapHooksForTests({
      timerApi: timers.api,
      ensureToken: async () => tokenCacheForTests(),
      ensureModelCaps: async () => {},
      staticApiKey: "",
    });
    try {
      const fake = createFakeExtensionApi({ allTools: [] });
      mod.default(fake.api);

      const start = getHandler(fake.handlers as FakeHandler[], "session_start");
      const shutdown = getHandler(fake.handlers as FakeHandler[], "session_shutdown");

      await start.handler({}, { hasUI: false });
      await waitFor(() => timers.scheduled.some((handle) => Number(handle?.ms) >= 60000), 1000, 10);
      const lastHandle = [...timers.scheduled].reverse().find((handle) => Number(handle?.ms) >= 60000);
      expect(lastHandle).toBeDefined();

      await shutdown.handler({ type: "session_shutdown", reason: "fork", targetSessionFile: "/tmp/forked-harness.jsonl" });
      expect(timers.cleared).toContain(lastHandle);
    } finally {
      mod.setAzureHarnessBootstrapHooksForTests(null);
    }
  });

  test("chat SSH core unregisters the live SSH session on session shutdown", async () => {
    const chatJid = `web:test-${Date.now()}`;
    const mod = await import("../../src/extensions/ssh-core.ts");
    await mod.unregisterLiveChatSshSession(chatJid);

    const fake = createFakeExtensionApi({ allTools: [] });
    mod.createChatSshCoreExtension(chatJid, null)(fake.api);

    const start = getHandler(fake.handlers as FakeHandler[], "session_start");
    const shutdown = getHandler(fake.handlers as FakeHandler[], "session_shutdown");

    await start.handler({}, { hasUI: false });
    expect(mod.hasLiveChatSshSession(chatJid)).toBe(true);

    await shutdown.handler();
    expect(mod.hasLiveChatSshSession(chatJid)).toBe(false);
  });

});

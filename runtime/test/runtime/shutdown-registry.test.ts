import { afterEach, describe, expect, test } from "bun:test";

import {
  finalizePendingShutdownAfterTurn,
  isPendingShutdown,
  markPendingShutdown,
} from "../../src/runtime/shutdown-registry.js";

type ExitSchedulerGlobal = typeof globalThis & {
  __PICLAW_EXIT_SCHEDULER__?: () => void;
};

const exitSchedulerGlobal = globalThis as ExitSchedulerGlobal;

afterEach(() => {
  if (isPendingShutdown()) {
    exitSchedulerGlobal.__PICLAW_EXIT_SCHEDULER__ = () => {};
    finalizePendingShutdownAfterTurn("test-cleanup");
  }
  delete exitSchedulerGlobal.__PICLAW_EXIT_SCHEDULER__;
});

describe("pending shutdown finalization", () => {
  test("a terminal turn finalizer schedules shutdown exactly once", () => {
    let shutdownRequests = 0;
    exitSchedulerGlobal.__PICLAW_EXIT_SCHEDULER__ = () => {
      shutdownRequests += 1;
    };

    markPendingShutdown("test terminal finalization", 1_000);

    expect(isPendingShutdown()).toBe(true);
    expect(finalizePendingShutdownAfterTurn("telegram")).toBe(true);
    expect(finalizePendingShutdownAfterTurn("web")).toBe(false);
    expect(isPendingShutdown()).toBe(false);
    expect(shutdownRequests).toBe(1);
  });

  test("the bounded fallback requests shutdown when no channel finalizer runs", async () => {
    let shutdownRequests = 0;
    exitSchedulerGlobal.__PICLAW_EXIT_SCHEDULER__ = () => {
      shutdownRequests += 1;
    };

    markPendingShutdown("test fallback", 5);

    const deadline = Date.now() + 500;
    while (shutdownRequests === 0 && Date.now() < deadline) {
      await Bun.sleep(5);
    }

    expect(shutdownRequests).toBe(1);
    expect(isPendingShutdown()).toBe(false);
  });

  test("terminal finalization cancels the fallback timer", async () => {
    let shutdownRequests = 0;
    exitSchedulerGlobal.__PICLAW_EXIT_SCHEDULER__ = () => {
      shutdownRequests += 1;
    };

    markPendingShutdown("test fallback cancellation", 20);
    expect(finalizePendingShutdownAfterTurn("telegram")).toBe(true);
    await Bun.sleep(40);

    expect(shutdownRequests).toBe(1);
    expect(isPendingShutdown()).toBe(false);
  });
});

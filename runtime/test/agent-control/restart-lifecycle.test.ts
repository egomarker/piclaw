import { afterEach, expect, test } from "bun:test";

import "../helpers.js";
import { handleRestart, setKillTrackedProcessesForRestartForTests } from "../../src/agent-control/handlers/control.js";

const events: string[] = [];
let restoreKillHook: (() => void) | null = null;

afterEach(() => {
  restoreKillHook?.();
  restoreKillHook = null;
  events.length = 0;
});

type ReloadOptions = { beforeSessionStart?: () => void | Promise<void> };

function useRestartKillHook(fn: () => number): void {
  restoreKillHook = setKillTrackedProcessesForRestartForTests(() => {
    events.push("kill");
    return fn();
  });
}

function makeSession(reload: (options?: ReloadOptions) => Promise<void> | void) {
  return {
    async abort() {
      events.push("abort");
    },
    reload,
  } as any;
}

test("handleRestart aborts first and runs deterministic cleanup inside beforeSessionStart", async () => {
  useRestartKillHook(() => 2);
  const session = makeSession(async (options) => {
    events.push("reload_enter");
    await options?.beforeSessionStart?.();
    events.push("reload_after_before");
  });

  const result = await handleRestart(session, { type: "restart", raw: "/restart" });

  expect(result).toEqual({
    status: "success",
    message: "Agent restarted. Killed 2 subprocesses.",
    refresh_runtime: true,
  });
  expect(events).toEqual(["abort", "reload_enter", "kill", "reload_after_before"]);
});

test("handleRestart preserves killed subprocess count when reload fails after cleanup", async () => {
  useRestartKillHook(() => 1);
  const session = makeSession(async (options) => {
    events.push("reload_enter");
    await options?.beforeSessionStart?.();
    throw new Error("reload failed");
  });

  const result = await handleRestart(session, { type: "restart", raw: "/restart" });

  expect(result).toEqual({
    status: "error",
    message: "Restart failed after killing 1 subprocess: reload failed",
  });
  expect(events).toEqual(["abort", "reload_enter", "kill"]);
});

test("handleRestart treats beforeSessionStart cleanup failures as restart failures", async () => {
  useRestartKillHook(() => {
    throw new Error("cleanup failed");
  });
  const session = makeSession(async (options) => {
    events.push("reload_enter");
    await options?.beforeSessionStart?.();
    events.push("reload_after_before");
  });

  const result = await handleRestart(session, { type: "restart", raw: "/restart" });

  expect(result).toEqual({
    status: "error",
    message: "Restart failed after killing 0 subprocesses: cleanup failed",
  });
  expect(events).toEqual(["abort", "reload_enter", "kill"]);
});

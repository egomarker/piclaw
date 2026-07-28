import { expect, test } from "bun:test";
import "../helpers.js";

import { getDb, initDatabase, isLikelyTestHarnessProcess, setAllowLiveDbInTestsForTests, shouldBlockLiveDatabaseOpenInTests } from "../../src/db/connection.js";

test("isLikelyTestHarnessProcess detects direct test argv values", () => {
  expect(isLikelyTestHarnessProcess(["bun", "test/channels/web/oobe-instance-state.test.ts"])).toBe(true);
  expect(isLikelyTestHarnessProcess(["bun", "src/index.ts"])).toBe(false);
});

test("shouldBlockLiveDatabaseOpenInTests refuses the canonical live db for test processes", () => {
  expect(shouldBlockLiveDatabaseOpenInTests({
    useMemory: false,
    nextPath: "/workspace/.piclaw/store/messages.db",
    workspaceDir: "/workspace",
    argv: ["bun", "test/channels/web/oobe-instance-state.test.ts"],
  })).toBe(true);

  expect(shouldBlockLiveDatabaseOpenInTests({
    useMemory: true,
    nextPath: "/workspace/.piclaw/store/messages.db",
    workspaceDir: "/workspace",
    argv: ["bun", "test/channels/web/oobe-instance-state.test.ts"],
  })).toBe(false);

  expect(shouldBlockLiveDatabaseOpenInTests({
    useMemory: false,
    nextPath: "/tmp/piclaw-test/store/messages.db",
    workspaceDir: "/tmp/piclaw-test",
    argv: ["bun", "test/channels/web/oobe-instance-state.test.ts"],
  })).toBe(false);

  const restore = setAllowLiveDbInTestsForTests(true);
  try {
    expect(shouldBlockLiveDatabaseOpenInTests({
      useMemory: false,
      nextPath: "/workspace/.piclaw/store/messages.db",
      workspaceDir: "/workspace",
      argv: ["bun", "test/channels/web/oobe-instance-state.test.ts"],
    })).toBe(false);
  } finally {
    restore();
  }
});

test("initDatabase reopens a stale cached sqlite handle", () => {
  initDatabase();
  const first = getDb();
  first.close();

  expect(() => initDatabase()).not.toThrow();

  const reopened = getDb();
  const row = reopened.query("SELECT 1 AS ok").get() as { ok: number } | null;
  expect(row?.ok).toBe(1);
});

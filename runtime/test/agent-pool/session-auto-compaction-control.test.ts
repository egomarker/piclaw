import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SettingsManager, type CacheWarmingDecisionEvent } from "@earendil-works/pi-coding-agent";

import { setEnv } from "../helpers.js";
import { createSessionInDir } from "../../src/agent-pool/session.ts";
import { createRealTestModelServices } from "../model-services-fixture.js";

describe("session auto-compaction controls", () => {
  test("createSessionInDir disables upstream auto-compaction with the public session API", async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-session-auto-compaction-"));
    const workspaceDir = join(tempRoot, "workspace");
    const sessionDir = join(tempRoot, "session");
    mkdirSync(workspaceDir, { recursive: true });
    const restoreEnv = setEnv({ PICLAW_WORKSPACE: workspaceDir });
    const { modelRuntime } = await createRealTestModelServices(join(tempRoot, "agent"));
    const settingsManager = SettingsManager.inMemory();

    try {
      const runtime = await createSessionInDir(sessionDir, { modelRuntime, settingsManager, tools: [] });
      try {
        expect(runtime.cwd).toBe(workspaceDir);
        expect(runtime.session.autoCompactionEnabled).toBe(false);
      } finally {
        await runtime.dispose();
      }
    } finally {
      restoreEnv();
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }, 20_000);

  test("cache warming requires explicit opt-in without rewriting user settings", async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-cache-warming-policy-"));
    const workspaceDir = join(tempRoot, "workspace");
    mkdirSync(workspaceDir, { recursive: true });
    const restoreEnv = setEnv({ PICLAW_WORKSPACE: workspaceDir });
    const { modelRuntime } = await createRealTestModelServices(join(tempRoot, "agent"));
    const settingsManager = SettingsManager.inMemory();
    const runtime = await createSessionInDir(join(tempRoot, "session"), { modelRuntime, settingsManager, tools: [] });
    const event = { type: "cache_warming_decision", action: "warm" } as CacheWarmingDecisionEvent;
    try {
      // Pi's default mode is streaming, but absence of an explicit preference
      // must not opt a Piclaw user into new background provider calls/costs.
      expect(settingsManager.getGlobalSettings().cacheWarming).toBeUndefined();
      expect(await runtime.session.extensionRunner.emitCacheWarmingDecision(event)).toBe("stop");
      expect(settingsManager.getGlobalSettings().cacheWarming).toBeUndefined();
      for (const mode of ["streaming", "idle", "off"] as const) {
        settingsManager.setCacheWarmingMode(mode);
        expect(await runtime.session.extensionRunner.emitCacheWarmingDecision(event)).toBe(mode === "off" ? "stop" : "warm");
        expect(settingsManager.getGlobalSettings().cacheWarming).toBe(mode);
      }
      expect(runtime.session.autoCompactionEnabled).toBe(false);
    } finally {
      await runtime.dispose();
      restoreEnv();
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }, 30_000);
});

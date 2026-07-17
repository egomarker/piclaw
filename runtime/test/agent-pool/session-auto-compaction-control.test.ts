import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";

import "../helpers.js";
import { createSessionInDir } from "../../src/agent-pool/session.ts";
import { createRealTestModelServices } from "../model-services-fixture.js";

describe("session auto-compaction controls", () => {
  test("createSessionInDir disables upstream auto-compaction with the public session API", async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-session-auto-compaction-"));
    const workspaceDir = join(tempRoot, "workspace");
    const sessionDir = join(tempRoot, "session");
    mkdirSync(workspaceDir, { recursive: true });
    const { modelRuntime } = await createRealTestModelServices(join(tempRoot, "agent"));
    const settingsManager = SettingsManager.create(workspaceDir, getAgentDir());

    try {
      const runtime = await createSessionInDir(sessionDir, {
        modelRuntime,
        settingsManager,
        tools: [],
        cwd: workspaceDir,
      } as any);

      expect(runtime.session.autoCompactionEnabled).toBe(false);
      runtime.session.dispose?.();
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }, 20_000);
});

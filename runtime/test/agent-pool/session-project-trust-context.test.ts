import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SettingsManager, getAgentDir, type ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { setEnv } from "../helpers.js";
import { createSessionInDir } from "../../src/agent-pool/session.ts";
import { createRealTestModelServices } from "../model-services-fixture.js";

describe("project trust extension context", () => {
  test("extension command contexts expose ctx.isProjectTrusted", async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-project-trust-context-"));
    const { modelRuntime } = await createRealTestModelServices(join(tempRoot, "agent"));
    const workspaceDir = join(tempRoot, "workspace");
    mkdirSync(workspaceDir, { recursive: true });
    const storeDir = join(tempRoot, "store");
    const dataDir = join(tempRoot, "data");
    mkdirSync(storeDir, { recursive: true });
    mkdirSync(dataDir, { recursive: true });
    const restoreEnv = setEnv({ PICLAW_WORKSPACE: workspaceDir, PICLAW_STORE: storeDir, PICLAW_DATA: dataDir });
    const settingsManager = SettingsManager.create(workspaceDir, getAgentDir());
    const sessionDir = join(tempRoot, "session");
    let observed: unknown;

    const extension: ExtensionFactory = (pi) => {
      pi.registerCommand("project-trust-context-test", {
        description: "capture project trust context for regression tests",
        handler: async (_args, ctx) => {
          observed = {
            hasMethod: typeof ctx.isProjectTrusted === "function",
            trusted: ctx.isProjectTrusted(),
          };
        },
      });
    };

    try {
      const runtime = await createSessionInDir(sessionDir, {
        modelRuntime,
        settingsManager,
        tools: [],
        extensionFactories: [extension],
        cwd: workspaceDir,
      });

      await runtime.session.prompt("/project-trust-context-test");

      expect((observed as any).hasMethod).toBe(true);
      expect(typeof (observed as any).trusted).toBe("boolean");
      runtime.session.dispose?.();
    } finally {
      restoreEnv();
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }, 20_000);
});

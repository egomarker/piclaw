import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AuthStorage, ModelRegistry, SettingsManager, getAgentDir, type ExtensionFactory } from "@earendil-works/pi-coding-agent";
import "../helpers.js";
import { createSessionInDir } from "../../src/agent-pool/session.ts";

describe("project trust extension context", () => {
  test("extension command contexts expose ctx.isProjectTrusted", async () => {
    const authStorage = AuthStorage.create();
    const modelRegistry = ModelRegistry.inMemory(authStorage);
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-project-trust-context-"));
    const workspaceDir = join(tempRoot, "workspace");
    mkdirSync(workspaceDir, { recursive: true });
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
        authStorage,
        modelRegistry,
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
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }, 20_000);
});

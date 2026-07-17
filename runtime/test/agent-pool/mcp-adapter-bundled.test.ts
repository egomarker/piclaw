import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";
import { setEnv } from "../helpers.js";
import { createSessionInDir } from "../../src/agent-pool/session.ts";
import { createRealTestModelServices } from "../model-services-fixture.js";

describe("bundled pi-mcp-adapter integration", () => {
  test("registers the mcp proxy tool and slash commands for piclaw sessions", async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "piclaw-mcp-adapter-"));
    const { modelRuntime } = await createRealTestModelServices(join(tempRoot, "agent"));
    const sessionDir = join(tempRoot, "session");
    const workspaceDir = join(tempRoot, "workspace");
    const storeDir = join(tempRoot, "store");
    const dataDir = join(tempRoot, "data");
    mkdirSync(workspaceDir, { recursive: true });
    mkdirSync(storeDir, { recursive: true });
    mkdirSync(dataDir, { recursive: true });
    const restoreEnv = setEnv({ PICLAW_WORKSPACE: workspaceDir, PICLAW_STORE: storeDir, PICLAW_DATA: dataDir });
    const settingsManager = SettingsManager.create(workspaceDir, getAgentDir());

    try {
      const runtime = await createSessionInDir(sessionDir, {
        modelRuntime,
        settingsManager,
        tools: [],
        cwd: workspaceDir,
      });

      const session: any = runtime.session;
      const allTools = session._extensionRunner?.getAllRegisteredTools?.() ?? [];
      const mcpTool = allTools.find((t: any) => t.definition?.name === "mcp");
      expect(mcpTool).toBeTruthy();
      const tool = mcpTool;
      expect(typeof tool?.definition?.description).toBe("string");
      expect(tool.definition.description).toContain("MCP");

      expect(typeof session.extensionRunner?.getCommand).toBe("function");
      const mcpCommand = session.extensionRunner.getCommand("mcp");
      expect(mcpCommand).toBeTruthy();
      expect(typeof mcpCommand?.description).toBe("string");
      expect(mcpCommand.description).toContain("MCP");
      expect(session.extensionRunner.getCommand("mcp-auth")).toBeTruthy();

      session.dispose?.();
    } finally {
      restoreEnv();
      rmSync(tempRoot, { recursive: true, force: true });
    }
  }, 20_000);
});

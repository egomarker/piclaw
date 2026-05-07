/**
 * test/extensions/extensions-sql-introspect.test.ts – Tests for sql-introspect extension.
 */

import { beforeEach, afterEach, describe, expect, test } from "bun:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { createTempWorkspace, importFresh, setEnv } from "../helpers.js";

function makeFakeApi() {
  const tools = new Map<string, any>();
  return {
    api: {
      on() {},
      registerTool(tool: any) { tools.set(tool.name, tool); },
      registerCommand() {},
      registerShortcut() {},
      registerFlag() {},
      getFlag() { return undefined; },
      registerMessageRenderer() {},
      sendMessage() {},
      sendUserMessage() {},
      appendEntry() {},
      setSessionName() {},
      getSessionName() { return undefined; },
      setLabel() {},
      exec: async () => ({ exitCode: 0, stdout: "", stderr: "" }),
      getActiveTools: () => [],
      getAllTools: () => [],
      setActiveTools() {},
      getCommands: () => [],
      setModel: async () => true,
      getThinkingLevel: () => "off" as any,
      setThinkingLevel() {},
      registerProvider() {},
      unregisterProvider() {},
    } as unknown as ExtensionAPI,
    tools,
  };
}

describe("sql-introspect extension", () => {
  let ws: ReturnType<typeof createTempWorkspace>;
  let restoreEnv: (() => void) | null = null;

  beforeEach(async () => {
    ws = createTempWorkspace("piclaw-sql-introspect-");
    restoreEnv = setEnv({
      PICLAW_WORKSPACE: ws.workspace,
      PICLAW_STORE: ws.store,
      PICLAW_DATA: ws.data,
    });

    const db = await importFresh<typeof import("../src/db.js")>("../src/db.js");
    db.initDatabase();
  });

  afterEach(() => {
    restoreEnv?.();
    restoreEnv = null;
    ws.cleanup();
  });

  async function getTool() {
    const { sqlIntrospect } = await importFresh<typeof import("../src/extensions/sql-introspect.js")>(
      "../src/extensions/sql-introspect.js",
    );
    const fake = makeFakeApi();
    sqlIntrospect(fake.api);
    return fake.tools.get("introspect_sql");
  }

  test("registers introspect_sql tool", async () => {
    const tool = await getTool();
    expect(tool).toBeDefined();
    expect(tool.name).toBe("introspect_sql");
  });

  test("runs read-only introspection query", async () => {
    const tool = await getTool();
    const result = await tool.execute("s1", {
      query: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name LIMIT 5",
    });

    expect(result.details.count).toBeGreaterThan(0);
    expect(result.content[0].text).toContain("Query returned");
  });

  test("blocks mutating SQL", async () => {
    const tool = await getTool();
    const result = await tool.execute("s2", { query: "DELETE FROM messages" });
    expect(result.content[0].text).toContain("Only read-only");
  });

  test("supports PRAGMA introspection", async () => {
    const tool = await getTool();
    const result = await tool.execute("s3", { query: "PRAGMA table_info(messages)" });
    expect(result.details.count).toBeGreaterThan(0);
    expect(Array.isArray(result.details.rows)).toBe(true);
  });
});

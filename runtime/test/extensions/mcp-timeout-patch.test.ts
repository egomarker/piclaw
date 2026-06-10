import { afterEach, describe, expect, test } from "bun:test";

import { getMcpToolTimeoutMs, mcpTimeoutPatch } from "../../src/extensions/mcp-timeout-patch.js";

function createPatchHarness() {
  const handlers: Array<{ event: string; handler: (...args: any[]) => any }> = [];
  const api = {
    on(event: string, handler: (...args: any[]) => any) {
      handlers.push({ event, handler });
    },
  } as any;
  mcpTimeoutPatch(api);
  return { handlers };
}

describe("mcp-timeout-patch configuration", () => {
  const previous = process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;
    } else {
      process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = previous;
    }
  });

  test("defaults to the built-in two-minute timeout", () => {
    delete process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;
    expect(getMcpToolTimeoutMs()).toBe(120_000);
  });

  test("honors a positive timeout override", () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "60000";
    expect(getMcpToolTimeoutMs()).toBe(60_000);
  });

  test("treats zero as timeout disabled", () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "0";
    expect(getMcpToolTimeoutMs()).toBeNull();
  });

  test("falls back to the default for invalid or negative values", () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "not-a-number";
    expect(getMcpToolTimeoutMs()).toBe(120_000);

    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "0abc";
    expect(getMcpToolTimeoutMs()).toBe(120_000);

    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "-1";
    expect(getMcpToolTimeoutMs()).toBe(120_000);
  });

  test("does not install a session_start hook when the wrapper timeout is disabled", () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "0";
    const { handlers } = createPatchHarness();
    expect(handlers).toEqual([]);
  });

  test("wraps MCP tools but leaves unrelated tools untouched", async () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "5000";
    const { handlers } = createPatchHarness();
    expect(handlers.map((entry) => entry.event)).toEqual(["session_start"]);

    const originalMcpExecute = async (...args: unknown[]) => ({ args });
    const originalRegularExecute = async () => "ok";
    const mcpTool = { name: "mcp_echo", execute: originalMcpExecute };
    const regularTool = { name: "bash", execute: originalRegularExecute };

    await handlers[0].handler({}, { _agent: { tools: [mcpTool, regularTool] } });

    expect(mcpTool.execute).not.toBe(originalMcpExecute);
    expect(regularTool.execute).toBe(originalRegularExecute);
    await expect(mcpTool.execute("call-1", { tool: "echo" }, undefined, "rest")).resolves.toEqual({
      args: ["call-1", { tool: "echo" }, undefined, "rest"],
    });
  });

  test("patched MCP tools reject when their abort signal fires", async () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "5000";
    const { handlers } = createPatchHarness();
    const mcpTool = {
      name: "mcp",
      execute: async () => new Promise(() => {}),
    };
    await handlers[0].handler({}, { _agent: { tools: [mcpTool] } });

    const controller = new AbortController();
    const call = mcpTool.execute("call-1", { tool: "slow", server: "test" }, controller.signal);
    controller.abort();

    await expect(call).rejects.toThrow("MCP tool call aborted: mcp → slow (test)");
  });

  test("patched MCP tools reject when the wrapper timeout expires", async () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "10";
    const { handlers } = createPatchHarness();
    const mcpTool = {
      name: "mcp_slow",
      execute: async () => new Promise(() => {}),
    };
    await handlers[0].handler({}, { _agent: { tools: [mcpTool] } });

    await expect(mcpTool.execute("call-1", {}, undefined)).rejects.toThrow("MCP tool call timed out after 0s: mcp_slow");
  });
});

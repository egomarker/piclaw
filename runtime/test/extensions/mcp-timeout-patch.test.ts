import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Type } from "typebox";
import {
  getMcpToolTimeoutMs,
  withMcpToolDeadline,
  withMcpToolDeadlines,
} from "../../src/extensions/mcp-timeout-patch.js";

const parameters = Type.Object({ text: Type.Optional(Type.String()) });
const ctx = { cwd: "/fixture" } as any;
const result = { content: [{ type: "text" as const, text: "ok" }], details: { ok: true } };
function tool(execute: (...args: any[]) => any, name = "fixture_echo") {
  return { name, label: name, description: "fixture", parameters, execute };
}
function execute(definition: ReturnType<typeof tool>, signal?: AbortSignal, onUpdate?: any) {
  return definition.execute("call-1", { text: "hello" }, signal, onUpdate, ctx);
}

// These tests exercise the public definition/API boundary, never a fabricated _agent.
describe("MCP deadline configuration", () => {
  const previous = process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;
  afterEach(() => {
    if (previous === undefined) delete process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;
    else process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = previous;
  });
  test("defaults to two minutes", () => {
    delete process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;
    expect(getMcpToolTimeoutMs()).toBe(120_000);
  });
  test("honors a positive compatibility override", () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "60000";
    expect(getMcpToolTimeoutMs()).toBe(60_000);
  });
  test("zero disables only the outer deadline", () => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "0";
    expect(getMcpToolTimeoutMs()).toBeNull();
  });
  test.each(["not-a-number", "0abc", "-1"])("rejects invalid override %s", (value) => {
    process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = value;
    expect(getMcpToolTimeoutMs()).toBe(120_000);
  });
});

describe("public adapter registration decoration", () => {
  test("preserves schemas, metadata, invocation context, progress, and mixed results", async () => {
    const mixed = {
      content: [
        { type: "text", text: "fixture" },
        { type: "image", data: "AA==", mimeType: "image/png" },
      ],
      details: { structuredContent: { answer: 42 }, isError: false },
    };
    let invocation: any[] = [];
    const receivers: unknown[] = [];
    const original = {
      ...tool(function (this: unknown, ...args: any[]) {
        receivers.push(this);
        invocation = args;
        args[3](result);
        return Promise.resolve(mixed);
      }),
      outputSchema: Type.Object({ answer: Type.Number() }),
      prepareArguments: (params: unknown) => params,
      namespace: "fixture",
      exposure: "gateway",
      annotations: { readOnlyHint: true },
      defaultActive: false,
      renderCall: () => null,
      renderResult: () => null,
    } as any;
    const wrapped = withMcpToolDeadline(original, () => 1000);
    for (const key of Object.keys(original).filter((key) => key !== "execute")) {
      expect((wrapped as any)[key]).toBe(original[key]);
    }
    const updates: unknown[] = [];
    const caller = new AbortController();
    expect(await execute(wrapped, caller.signal, (value: unknown) => updates.push(value))).toBe(mixed);
    expect(invocation[0]).toBe("call-1");
    expect(invocation[1]).toEqual({ text: "hello" });
    expect(invocation[2]).not.toBe(caller.signal);
    expect(invocation[2].aborted).toBe(false);
    expect(invocation[4]).toBe(ctx);
    expect(receivers[0]).toBe(original);
    expect(updates).toEqual([result]);
  });

  test("wraps initial and later direct registrations regardless of prefix; leaves other owners alone", () => {
    const registered: any[] = [];
    const unregisterTool = () => true;
    const events = {};
    const api = { registerTool: (value: unknown) => registered.push(value), unregisterTool, events } as any;
    const adapterApi = withMcpToolDeadlines(api);
    const proxy = tool(async () => result, "mcp");
    const direct = tool(async () => result, "fixture_echo");
    const refreshed = tool(async () => result, "custom-prefix_echo");
    const other = tool(async () => result, "bash");
    adapterApi.registerTool(proxy);
    adapterApi.registerTool(direct);
    api.registerTool(other);
    adapterApi.registerTool(refreshed);
    expect(registered[0].execute).not.toBe(proxy.execute);
    expect(registered[1].execute).not.toBe(direct.execute);
    expect(registered[2]).toBe(other);
    expect(registered[3].execute).not.toBe(refreshed.execute);
    expect(adapterApi.unregisterTool).toBe(unregisterTool);
    expect(adapterApi.events).toBe(events);
  });

  test("reads the timeout at invocation, not registration", async () => {
    const previous = process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;
    try {
      process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "5000";
      const registered: any[] = [];
      const api = withMcpToolDeadlines({ registerTool: (value: unknown) => registered.push(value) } as any);
      api.registerTool(tool(() => new Promise(() => {})));
      process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "15";
      await expect(execute(registered[0])).rejects.toThrow("MCP tool call timed out");
    } finally {
      if (previous === undefined) delete process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;
      else process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = previous;
    }
  });
});

describe("absolute MCP deadline and abort", () => {
  test("aborts the executor before reporting an outer timeout", async () => {
    let child: AbortSignal | undefined;
    const wrapped = withMcpToolDeadline(tool((_id, _params, signal) => {
      child = signal;
      return new Promise(() => {});
    }), () => 15);
    await expect(execute(wrapped)).rejects.toThrow("MCP tool call timed out after 0s: fixture_echo");
    expect(child?.aborted).toBe(true);
  });

  test("does not invoke a pre-aborted call", async () => {
    let invoked = false;
    const caller = new AbortController();
    caller.abort("already stopped");
    const wrapped = withMcpToolDeadline(tool(async () => { invoked = true; return result; }), () => 1000);
    await expect(execute(wrapped, caller.signal)).rejects.toMatchObject({ cause: "already stopped" });
    expect(invoked).toBe(false);
  });

  test.each([null, 1000])("forwards caller abort with outer deadline %s", async (timeout) => {
    let child: AbortSignal | undefined;
    const caller = new AbortController();
    const wrapped = withMcpToolDeadline(tool((_id, _params, signal) => {
      child = signal;
      return new Promise(() => {});
    }), () => timeout);
    const call = execute(wrapped, caller.signal);
    caller.abort("caller reason");
    await expect(call).rejects.toMatchObject({ message: "MCP tool call aborted: fixture_echo", cause: "caller reason" });
    expect(child?.aborted).toBe(true);
  });

  test("progress never extends the cap and late progress is suppressed", async () => {
    let emit: ((value: unknown) => void) | undefined;
    let child: AbortSignal | undefined;
    const wrapped = withMcpToolDeadline(tool((_id, _params, signal, onUpdate) => {
      emit = onUpdate;
      child = signal;
      return new Promise(() => {});
    }), () => 25);
    const updates: unknown[] = [];
    const call = execute(wrapped, undefined, (value: unknown) => updates.push(value));
    emit?.(result);
    const interval = setInterval(() => emit?.(result), 2);
    try { await expect(call).rejects.toThrow("MCP tool call timed out"); } finally { clearInterval(interval); }
    expect(updates.length).toBeGreaterThan(0);
    expect(child?.aborted).toBe(true);
    const count = updates.length;
    emit?.(result);
    expect(updates.length).toBe(count);
  });

  test.each([false, true])("observes late settlement (reject=%s) and releases caller listeners", async (rejectLate) => {
    let resolve!: (value: unknown) => void;
    let reject!: (value: unknown) => void;
    let emit: ((value: unknown) => void) | undefined;
    const pending = new Promise((yes, no) => { resolve = yes; reject = no; });
    const caller = new AbortController();
    const remove = spyOn(caller.signal, "removeEventListener");
    const unhandled: unknown[] = [];
    const onUnhandled = (error: unknown) => { unhandled.push(error); };
    process.on("unhandledRejection", onUnhandled);
    try {
      const wrapped = withMcpToolDeadline(tool((_id, _params, _signal, update) => {
        emit = update;
        return pending;
      }), () => 15);
      const updates: unknown[] = [];
      await expect(execute(wrapped, caller.signal, (value: unknown) => updates.push(value))).rejects.toThrow("timed out");
      expect(remove).toHaveBeenCalledTimes(1);
      emit?.(result);
      if (rejectLate) reject(new Error("late rejection"));
      else resolve(result);
      await Bun.sleep(20);
      expect(updates).toEqual([]);
      expect(unhandled).toEqual([]);
    } finally {
      process.off("unhandledRejection", onUnhandled);
      remove.mockRestore();
    }
  });

  test.each([false, true])("releases listeners on executor failure (sync=%s)", async (sync) => {
    const caller = new AbortController();
    const remove = spyOn(caller.signal, "removeEventListener");
    const failure = new Error("native failure");
    try {
      const wrapped = withMcpToolDeadline(tool(() => {
        if (sync) throw failure;
        return Promise.reject(failure);
      }), () => 1000);
      await expect(execute(wrapped, caller.signal)).rejects.toBe(failure);
      expect(remove).toHaveBeenCalledTimes(1);
    } finally { remove.mockRestore(); }
  });

  test.each([null, 1000])("preserves a shorter native timeout (outer=%s)", async (timeout) => {
    const failure = new Error("Request timed out");
    const wrapped = withMcpToolDeadline(tool(() => new Promise((_resolve, reject) => {
      setTimeout(() => reject(failure), 10);
    })), () => timeout);
    await expect(execute(wrapped)).rejects.toBe(failure);
  });

  test("checks the absolute deadline even when synchronous work delays timer delivery", async () => {
    const wrapped = withMcpToolDeadline(tool(() => {
      const until = performance.now() + 20;
      while (performance.now() < until) { /* Fixture-only synchronous executor. */ }
      return Promise.resolve(result);
    }), () => 5);
    await expect(execute(wrapped)).rejects.toThrow("timed out");
  });

  test.each([false, true])("an elapsed absolute deadline wins over a late executor failure (sync=%s)", async (sync) => {
    let child: AbortSignal | undefined;
    const wrapped = withMcpToolDeadline(tool((_id, _params, signal) => {
      child = signal;
      const until = performance.now() + 20;
      while (performance.now() < until) { /* Delay timer delivery deliberately. */ }
      const failure = new Error("late native failure");
      if (sync) throw failure;
      return Promise.reject(failure);
    }), () => 5);
    await expect(execute(wrapped)).rejects.toThrow("MCP tool call timed out");
    expect(child?.aborted).toBe(true);
  });

  test("clears the timer and listener after success", async () => {
    let child: AbortSignal | undefined;
    const caller = new AbortController();
    const remove = spyOn(caller.signal, "removeEventListener");
    try {
      const wrapped = withMcpToolDeadline(tool(async (_id, _params, signal) => {
        child = signal;
        return result;
      }), () => 15);
      expect(await execute(wrapped, caller.signal)).toBe(result);
      caller.abort();
      await Bun.sleep(25);
      expect(child?.aborted).toBe(false);
      expect(remove).toHaveBeenCalledTimes(1);
    } finally { remove.mockRestore(); }
  });
});

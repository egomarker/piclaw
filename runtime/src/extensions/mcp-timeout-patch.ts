/**
 * extensions/mcp-timeout-patch.ts – Patches pi-mcp-adapter tool execution
 * with proper timeout and abort signal handling.
 *
 * The upstream pi-mcp-adapter (≤2.9.0) does not forward the abort signal
 * or apply a timeout to MCP callTool() invocations. If a server hangs,
 * the entire agent turn stalls indefinitely. This extension wraps registered
 * MCP tools with a timeout race and signal abort listener.
 *
 * Configurable via PICLAW_MCP_TOOL_TIMEOUT_MS (default: 120000 = 2 minutes).
 * Set PICLAW_MCP_TOOL_TIMEOUT_MS=0 to disable the wrapper timeout while still
 * leaving upstream MCP adapter behavior untouched.
 */

import type { ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";

const DEFAULT_MCP_TOOL_TIMEOUT_MS = 120_000; // 2 minutes

export function getMcpToolTimeoutMs(): number | null {
  const env = process.env.PICLAW_MCP_TOOL_TIMEOUT_MS;
  if (env) {
    const parsed = Number(env);
    if (Number.isFinite(parsed)) {
      if (parsed === 0) return null;
      if (parsed > 0) return parsed;
    }
  }
  return DEFAULT_MCP_TOOL_TIMEOUT_MS;
}

/**
 * Wrap a promise with a timeout and abort signal. Rejects with a
 * descriptive error if the timeout fires or the signal is aborted
 * before the promise settles.
 */
function withTimeoutAndSignal<T>(
  promise: Promise<T>,
  timeoutMs: number,
  signal: AbortSignal | undefined,
  label: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const timer = setTimeout(() => {
      settle(() => reject(new Error(`MCP tool call timed out after ${Math.round(timeoutMs / 1000)}s: ${label}`)));
    }, timeoutMs);

    if (signal) {
      if (signal.aborted) {
        clearTimeout(timer);
        settle(() => reject(new Error(`MCP tool call aborted: ${label}`)));
        return;
      }
      const onAbort = () => {
        clearTimeout(timer);
        settle(() => reject(new Error(`MCP tool call aborted: ${label}`)));
      };
      signal.addEventListener("abort", onAbort, { once: true });
      promise.finally(() => signal.removeEventListener("abort", onAbort)).catch(() => undefined);
    }

    promise.then(
      (value) => { clearTimeout(timer); settle(() => resolve(value)); },
      (error) => { clearTimeout(timer); settle(() => reject(error)); },
    );
  });
}

/** Determine if a tool name belongs to the MCP adapter. */
function isMcpTool(name: string): boolean {
  return name === "mcp" || name.startsWith("mcp_");
}

/** Build a human-readable label for the MCP call for error messages. */
function getMcpCallLabel(toolName: string, params: unknown): string {
  if (toolName === "mcp" && params && typeof params === "object") {
    const p = params as Record<string, unknown>;
    if (p.tool) return `mcp → ${p.tool}${p.server ? ` (${p.server})` : ""}`;
    if (p.connect) return `mcp connect → ${p.connect}`;
    if (p.describe) return `mcp describe → ${p.describe}`;
    if (p.search) return `mcp search → ${p.search}`;
    return "mcp (status)";
  }
  return toolName;
}

export const mcpTimeoutPatch: ExtensionFactory = (pi: ExtensionAPI): void => {
  const timeoutMs = getMcpToolTimeoutMs();
  if (timeoutMs === null) return;

  // Patch MCP tools after the MCP adapter has registered them.
  // The MCP adapter registers tools synchronously during its own session_start
  // handler. We run after with a microtask yield to ensure they exist.
  pi.on("session_start", async (_event, ctx) => {
    // Yield to ensure MCP adapter's session_start has completed
    await new Promise(resolve => setTimeout(resolve, 0));

    const session = ctx as unknown as {
      _agent?: {
        tools?: Array<{ name: string; execute: (...args: unknown[]) => Promise<unknown> }>;
      };
    };
    const tools = session?._agent?.tools;
    if (!Array.isArray(tools)) return;

    for (const tool of tools) {
      if (!isMcpTool(tool.name) || !tool.execute) continue;
      const originalExecute = tool.execute.bind(tool);
      tool.execute = async function patchedMcpExecute(
        toolCallId: unknown,
        params: unknown,
        signal: unknown,
        ...rest: unknown[]
      ) {
        const label = getMcpCallLabel(tool.name, params);
        const resultPromise = originalExecute(toolCallId, params, signal, ...rest);
        return withTimeoutAndSignal(
          resultPromise as Promise<unknown>,
          timeoutMs,
          signal as AbortSignal | undefined,
          label,
        );
      };
    }
  });
};

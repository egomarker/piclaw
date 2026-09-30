/**
 * extensions/mcp-timeout-patch.ts – Decorates public MCP tool registrations
 * with Piclaw's absolute outer deadline and cancellation guard.
 *
 * pi-mcp-adapter 2.11 forwards abort signals and supports requestTimeoutMs for
 * MCP protocol requests. This outer guard remains for existing Piclaw installs
 * that rely on the legacy PICLAW_MCP_TOOL_TIMEOUT_MS alias and Piclaw's 120-second default.
 * The shorter of this guard and the adapter/SDK request timeout wins.
 *
 * Configurable via domains.tools.mcpToolTimeoutMs (default: 120000 = 2 minutes).
 * Set the field to 0 to disable the wrapper timeout while still
 * leaving upstream MCP adapter behavior untouched.
 */

import type { ExtensionAPI, ToolDefinition } from "@earendil-works/pi-coding-agent";
import type { TSchema } from "typebox";

import { getToolsIntegrationConfig } from "../core/config.js";

export function getMcpToolTimeoutMs(): number | null {
  const timeoutMs = getToolsIntegrationConfig().mcpToolTimeoutMs;
  return timeoutMs === 0 ? null : timeoutMs;
}

/** Wrap one adapter-owned definition without changing its schema or metadata. */
export function withMcpToolDeadline<TParams extends TSchema, TDetails>(
  tool: ToolDefinition<TParams, TDetails>,
  getTimeoutMs: () => number | null = getMcpToolTimeoutMs,
): ToolDefinition<TParams, TDetails> {
  return {
    ...tool,
    execute(toolCallId, params, signal, onUpdate, ctx) {
      const timeoutMs = getTimeoutMs();
      const deadline = timeoutMs === null ? null : performance.now() + timeoutMs;
      const label = getMcpCallLabel(tool.name, params);
      const controller = new AbortController();
      return new Promise((resolve, reject) => {
        let settled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const cleanup = () => {
          clearTimeout(timer);
          signal?.removeEventListener("abort", onAbort);
        };
        const fail = (error: unknown, abort = false) => {
          if (settled) return;
          settled = true;
          cleanup();
          // Settle first: abort handlers may synchronously emit progress or reject.
          if (abort) controller.abort(error);
          reject(error);
        };
        const expire = () => fail(new Error(
          `MCP tool call timed out after ${Math.round(timeoutMs! / 1000)}s: ${label}`,
        ), true);
        const onError = (error: unknown) => {
          if (deadline !== null && performance.now() >= deadline) expire();
          fail(error);
        };
        const onAbort = () => fail(new Error(`MCP tool call aborted: ${label}`, {
          cause: signal?.reason,
        }), true);
        if (signal?.aborted) {
          onAbort();
          return;
        }
        signal?.addEventListener("abort", onAbort, { once: true });
        if (timeoutMs !== null) timer = setTimeout(expire, timeoutMs);
        const update: typeof onUpdate = onUpdate ? (result) => {
          if (deadline !== null && performance.now() >= deadline) expire();
          if (!settled) onUpdate(result);
        } : undefined;
        try {
          // Observe both outcomes even after an uncancellable call settles late.
          Promise.resolve(tool.execute.call(tool, toolCallId, params, controller.signal, update, ctx)).then(
            (result) => {
              if (deadline !== null && performance.now() >= deadline) expire();
              if (settled) return;
              settled = true;
              cleanup();
              resolve(result);
            },
            onError,
          );
        } catch (error) {
          onError(error);
        }
      });
    },
  };
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

/**
 * Only the adapter receives this API. Wrap every registration, including direct
 * tools without an `mcp_` prefix and definitions refreshed after startup.
 * Other extensions, events, activation, and withdrawal keep the original API.
 */
export function withMcpToolDeadlines(pi: ExtensionAPI): ExtensionAPI {
  return {
    ...pi,
    registerTool(tool) {
      return pi.registerTool(withMcpToolDeadline(tool));
    },
  };
}

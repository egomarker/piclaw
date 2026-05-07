/**
 * open-workspace-file – web-only tool that asks the active browser session to
 * open a workspace file in the editor.
 *
 * The runtime side validates that the requested path stays inside the current
 * workspace and only issues the UI request for web chats. The browser side then
 * decides whether it can satisfy the request in a tab or popout window.
 *
 * Popouts are intentionally gated by the browser, not the server: only the
 * browser knows the current viewport/screen size and whether opening another
 * editor window would be usable.
 */
import fs from "node:fs";
import path from "node:path";
import { Type } from "typebox";
import type { AgentToolResult, ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { getChatChannel, getChatJid } from "../core/chat-context.js";

const OpenWorkspaceFileSchema = Type.Object({
  path: Type.String({ description: "Workspace-relative file path to open in the web editor." }),
  target: Type.Optional(Type.Union([
    Type.Literal("tab"),
    Type.Literal("popout"),
  ], { description: "Where to open the file. Defaults to popout." })),
  label: Type.Optional(Type.String({ description: "Optional editor label/window title override." })),
});

type OpenWorkspaceFileParams = {
  path: string;
  target?: "tab" | "popout";
  label?: string;
};

type OpenWorkspaceFileOutcome = {
  ok?: boolean;
  opened?: boolean;
  target?: "tab" | "popout";
  path?: string;
  reason?: string;
  detail?: string;
  viewport?: { width?: number; height?: number };
  minimum_viewport?: { width?: number; height?: number };
};

const HINT = [
  "## Editor window control",
  "Use open_workspace_file to ask the web UI to open a workspace file in an editor tab or popout window.",
  "Prefer target='popout' only when the user would benefit from a separate review window.",
].join("\n");

function buildResult(message: string, details: Record<string, unknown>): AgentToolResult<Record<string, unknown>> {
  return {
    content: [{ type: "text", text: message }],
    details,
  };
}

function normalizeWorkspaceRelativePath(rawPath: string, cwd: string): { relativePath: string; absolutePath: string } | null {
  const trimmed = String(rawPath || "").trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") || trimmed.startsWith("\\") || trimmed.includes("://")) return null;
  const normalized = path.posix.normalize(trimmed.replace(/\\+/g, "/")).replace(/^\.\//, "");
  if (!normalized || normalized === "." || normalized.startsWith("../") || normalized === "..") return null;
  const absolutePath = path.resolve(cwd, normalized);
  const relativeToCwd = path.relative(cwd, absolutePath);
  if (!relativeToCwd || relativeToCwd.startsWith("..") || path.isAbsolute(relativeToCwd)) return null;
  return { relativePath: normalized, absolutePath };
}

/** Built-in tool that bridges an agent turn to the current web session's editor. */
export const openWorkspaceFile: ExtensionFactory = (pi: ExtensionAPI) => {
  pi.on("before_agent_start", async (event) => ({
    systemPrompt: `${event.systemPrompt}\n\n${HINT}`,
  }));

  pi.registerTool({
    name: "open_workspace_file",
    label: "open_workspace_file",
    description: "Ask the active web UI to open a workspace file in an editor tab or popout window.",
    promptSnippet: "open_workspace_file: open a workspace file in the current web UI editor tab or popout window.",
    parameters: OpenWorkspaceFileSchema,
    async execute(_toolCallId, params: OpenWorkspaceFileParams, _signal, _onUpdate, ctx) {
      const channel = getChatChannel();
      const chatJid = getChatJid();
      if (channel !== "web" || !chatJid.startsWith("web:")) {
        return buildResult("open_workspace_file only works in the web UI.", {
          ok: false,
          reason: "unsupported_channel",
          channel,
          chat_jid: chatJid,
        });
      }
      if (!ctx.hasUI) {
        return buildResult("Web UI is not available for this turn.", {
          ok: false,
          reason: "ui_unavailable",
          chat_jid: chatJid,
        });
      }

      const normalized = normalizeWorkspaceRelativePath(params.path, ctx.cwd);
      if (!normalized) {
        return buildResult("Provide a workspace-relative file path.", {
          ok: false,
          reason: "invalid_path",
          input_path: params.path,
        });
      }

      let stat: fs.Stats;
      try {
        stat = fs.statSync(normalized.absolutePath);
      } catch {
        return buildResult(`File not found: ${normalized.relativePath}`, {
          ok: false,
          reason: "not_found",
          path: normalized.relativePath,
        });
      }
      if (!stat.isFile()) {
        return buildResult(`Not a file: ${normalized.relativePath}`, {
          ok: false,
          reason: "not_a_file",
          path: normalized.relativePath,
        });
      }

      // `custom()` is the only existing request/response bridge that lets a tool
      // synchronously ask the active web browser to do something and wait for the
      // outcome. We pass a typed browser-action payload via the otherwise-generic
      // options object; the web channel forwards it verbatim and the browser
      // returns a structured result.
      const outcome = await (ctx.ui.custom as any)(
        () => null,
        {
          timeout: 15000,
          action: "open_workspace_file",
          path: normalized.relativePath,
          label: params.label?.trim() || undefined,
          target: params.target || "popout",
        },
      ) as OpenWorkspaceFileOutcome | undefined;

      if (!outcome || outcome.ok === false || outcome.opened === false) {
        const reason = outcome?.reason || "request_rejected";
        const detail = typeof outcome?.detail === "string" && outcome.detail.trim()
          ? outcome.detail.trim()
          : reason === "insufficient_screen_space"
            ? "The current browser window is too small to open another editor window comfortably."
            : "The web UI did not open the requested file.";
        return buildResult(detail, {
          ok: false,
          reason,
          path: normalized.relativePath,
          target: params.target || "popout",
          viewport: outcome?.viewport,
          minimum_viewport: outcome?.minimum_viewport,
          chat_jid: chatJid,
        });
      }

      const target = outcome.target || params.target || "popout";
      return buildResult(
        target === "tab"
          ? `Opened ${normalized.relativePath} in the editor tab.`
          : `Opened ${normalized.relativePath} in a popout editor window.`,
        {
          ok: true,
          opened: true,
          path: normalized.relativePath,
          target,
          chat_jid: chatJid,
        },
      );
    },
  });
};

export { normalizeWorkspaceRelativePath };

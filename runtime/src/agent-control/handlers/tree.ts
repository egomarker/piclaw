/**
 * agent-control/handlers/tree.ts – Handler for the /tree command.
 *
 * Renders the session message tree in a compact text format, supporting
 * head/tail modes, pagination, summarisation, and label display.
 *
 * Consumers: agent-control-handlers.ts dispatches to this handler.
 */

import type { AgentSession } from "@earendil-works/pi-coding-agent";
import type { AgentControlCommand, AgentControlResult } from "../agent-control-types.js";
import { extractTextFromContent, truncateText } from "../agent-control-helpers.js";
import { getWidgetKindRenderer } from "../../channels/web/http/extension-routes.js";

type TreeCommand = Extract<AgentControlCommand, { type: "tree" }>;
type LabelCommand = Extract<AgentControlCommand, { type: "label" }>;
type LabelsCommand = Extract<AgentControlCommand, { type: "labels" }>;
type SessionTreeNode = ReturnType<AgentSession["sessionManager"]["getTree"]>[number];
type SessionTreeEntry = SessionTreeNode["entry"];

/** Handle /tree: render the session message tree in text format. */
export async function handleTree(session: AgentSession, command: TreeCommand): Promise<AgentControlResult> {
  const sessionManager = session.sessionManager;
  const leafId = sessionManager.getLeafId();

  if (!command.targetId) {
    const roots = sessionManager.getTree();
    if (roots.length === 0) {
      return { status: "success", message: "Tree is empty." };
    }

    // If the session-tree addon is loaded, emit an HTML dashboard widget.
    // Otherwise fall back to the legacy session_tree content block (or plain text
    // when session_tree rendering is also removed from core).
    const renderer = getWidgetKindRenderer("session_tree");
    if (renderer) {
      const chatJid = (session as any)._chatJid ?? "";
      const html = renderer({ leafId: leafId ?? "", chatJid });
      const widgetBlock = {
        type: "generated_widget",
        widget_id: `session-tree-${Date.now()}`,
        title: "Session Tree",
        open_label: "Open tree viewer",
        auto_open: true,
        capabilities: ["interactive"],
        artifact: { kind: "html", html },
      };
      return { status: "success", message: "", contentBlocks: [widgetBlock] };
    }

    // Legacy: session_tree kind (rendered by Preact SessionTreeWidget in core web app).
    const widgetBlock = {
      type: "generated_widget",
      widget_id: `session-tree-${Date.now()}`,
      title: "Session Tree",
      subtitle: `${roots.length > 0 ? 'Interactive session tree viewer with live refresh' : 'Empty'}`,
      description: "Keeps the tree pane open while you navigate branches or request branch summaries.",
      open_label: "Open tree viewer",
      auto_open: true,
      capabilities: ["interactive"],
      artifact: {
        kind: "session_tree",
        tree: { leafId },
      },
    };
    return { status: "success", message: "", contentBlocks: [widgetBlock] };
  }

  const options = {
    summarize: command.summarize ?? false,
    customInstructions: command.customInstructions,
    replaceInstructions: command.replaceInstructions,
    label: command.label,
  };

  try {
    const result = await session.navigateTree(command.targetId, options);
    if (result.cancelled) {
      return { status: "error", message: "Tree navigation cancelled." };
    }
    if (result.aborted) {
      return { status: "error", message: "Tree navigation aborted." };
    }
    if (result.editorText) {
      return {
        status: "success",
        message: `Navigation complete. Selected text:\n${result.editorText}`,
      };
    }
    return { status: "success", message: "Navigation complete." };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", message };
  }
}

/** Handle /label: set or clear a label on a specific entry. */
export async function handleLabel(session: AgentSession, command: LabelCommand): Promise<AgentControlResult> {
  if (!command.targetId) {
    return { status: "error", message: "Usage: /label <entryId> <label|clear>" };
  }
  const rawLabel = command.label?.trim();
  const label = rawLabel && !["clear", "none", "off"].includes(rawLabel.toLowerCase()) ? rawLabel : "";
  session.sessionManager.appendLabelChange(command.targetId.trim(), label);
  return {
    status: "success",
    message: label ? `Label set on ${command.targetId}: ${label}` : `Label cleared on ${command.targetId}.`,
  };
}

/** Handle /labels: list all currently labeled entries. */
export async function handleLabels(session: AgentSession, _command: LabelsCommand): Promise<AgentControlResult> {
  const roots = session.sessionManager.getTree();
  const labels: Array<{ id: string; label: string; summary: string }> = [];

  const describeLabelEntry = (entry: SessionTreeEntry): string => {
    if (entry.type === "message") {
      const msg = (entry.message && typeof entry.message === "object")
        ? (entry.message as unknown as Record<string, unknown>)
        : {};
      const role = typeof msg.role === "string" ? msg.role : "message";
      const text = extractTextFromContent(msg.content);
      if (text) return `${role}: "${truncateText(text, 60)}"`;
      return role;
    }
    return `[${entry.type}]`;
  };

  const walk = (node: SessionTreeNode) => {
    if (node.label) {
      labels.push({ id: node.entry.id, label: node.label, summary: describeLabelEntry(node.entry) });
    }
    for (const child of node.children || []) {
      walk(child);
    }
  };

  for (const root of roots) walk(root);

  if (labels.length === 0) {
    return { status: "success", message: "No labels set." };
  }

  const lines = ["Labels:", ...labels.map((item) => `• ${item.id} [${item.label}] ${item.summary}`)];
  return { status: "success", message: lines.join("\n") };
}

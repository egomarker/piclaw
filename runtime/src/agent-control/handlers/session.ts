/**
 * agent-control/handlers/session.ts – Handlers for session management commands.
 *
 * Handles /session-name, /new-session, /switch-session, /session-rotate,
 * /fork, /clone, /forks, and /export-html commands for managing the pi-agent session tree.
 *
 * Consumers: agent-control-handlers.ts dispatches to these handlers.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { AgentSession, AgentSessionRuntime } from "@earendil-works/pi-coding-agent";
import type { AgentControlCommand, AgentControlResult } from "../agent-control-types.js";
import { truncateText } from "../agent-control-helpers.js";
import { rotateSession } from "../../session-rotation.js";
import { getChatJid } from "../../core/chat-context.js";
import { noteCompactionSuccess, resetCompactionSuccessCount } from "../../agent-pool/compaction.js";

type SessionNameCommand = Extract<AgentControlCommand, { type: "session_name" }>;
type NewSessionCommand = Extract<AgentControlCommand, { type: "new_session" }>;
type SwitchSessionCommand = Extract<AgentControlCommand, { type: "switch_session" }>;
type SessionRotateCommand = Extract<AgentControlCommand, { type: "session_rotate" }>;
type ForkCommand = Extract<AgentControlCommand, { type: "fork" }>;
type CloneCommand = Extract<AgentControlCommand, { type: "clone" }>;
type ForksCommand = Extract<AgentControlCommand, { type: "forks" }>;
type ExportHtmlCommand = Extract<AgentControlCommand, { type: "export_html" }>;

/** Handle /session-name: rename the current session. */
export async function handleSessionName(session: AgentSession, command: SessionNameCommand): Promise<AgentControlResult> {
  if (!command.name) {
    return {
      status: "success",
      message: `Session name: ${session.sessionName || "none"}.`,
    };
  }
  const name = command.name.trim();
  const normalized = name.toLowerCase();
  if (["clear", "none", "off"].includes(normalized)) {
    session.setSessionName("");
    return { status: "success", message: "Session name cleared." };
  }
  session.setSessionName(name);
  return { status: "success", message: `Session name set to "${name}".` };
}

/** Handle /new-session: create a new session, optionally under a parent. */
export async function handleNewSession(session: AgentSession, runtime: AgentSessionRuntime, command: NewSessionCommand): Promise<AgentControlResult> {
  const result = await runtime.newSession(command.parent ? { parentSession: command.parent } : undefined);
  if (result.cancelled) {
    return { status: "error", message: "New session cancelled." };
  }
  // Eagerly flush the new session header to disk so the file exists
  // immediately for session pickers and survives runtime eviction.
  // The SDK defers persistence until the first assistant message, but in
  // web mode the runtime may be evicted before the user sends a follow-up.
  ensureSessionFileOnDisk(runtime.session);
  return { status: "success", message: "Started a new session." };
}

/**
 * If the session file hasn't been written to disk yet, write the header
 * and any initial entries so the file is discoverable by session pickers
 * and `continueRecent()` after pool eviction.
 *
 * Note: pi-coding-agent 0.76 writes the initial persisted file with `wx`
 * when the first assistant message arrives. If we create the file eagerly, we
 * must also mark the manager as flushed so later SDK appends use append mode
 * instead of trying to exclusively create an already-existing file.
 */
function ensureSessionFileOnDisk(session: AgentSession): void {
  const sm = session.sessionManager;
  if (!sm || typeof sm.getSessionFile !== "function") return;
  if (typeof sm.isPersisted === "function" && !sm.isPersisted()) return;
  const filePath = sm.getSessionFile();
  if (!filePath || existsSync(filePath)) return;
  const header = sm.getHeader();
  if (!header) return;
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true });
  // Write only the header — minimal content for isValidSessionFile() to pass.
  writeFileSync(filePath, JSON.stringify(header) + "\n");
  (sm as unknown as { flushed?: boolean }).flushed = true;
}

/** Handle /switch-session: switch to an existing session by path. */
export async function handleSwitchSession(session: AgentSession, runtime: AgentSessionRuntime, command: SwitchSessionCommand): Promise<AgentControlResult> {
  if (!command.path) {
    return { status: "error", message: "Usage: /switch-session <path>" };
  }
  const result = await runtime.switchSession(command.path.trim());
  if (result.cancelled) {
    return { status: "error", message: "Switch session cancelled." };
  }
  return { status: "success", message: `Switched to session: ${command.path.trim()}.` };
}

/** Handle /session-rotate: archive the current session file and start a compact carried-forward successor. */
export async function handleSessionRotate(session: AgentSession, runtime: AgentSessionRuntime, command: SessionRotateCommand): Promise<AgentControlResult> {
  const chatJid = getChatJid("control:/session-rotate");
  const result = await rotateSession(session, runtime, {
    instructions: command.instructions,
    reason: "manual",
    fallbackOnCompactionFailure: true,
    chatJid,
  });
  if (result.status === "success") {
    resetCompactionSuccessCount(chatJid);
    noteCompactionSuccess(runtime.session, chatJid, "rotation", {
      countSuccess: false,
      clearBackoff: false,
    });
  }
  return {
    status: result.status,
    message: result.message,
  };
}

/** Handle /fork: fork the conversation from a specific entry. */
export async function handleFork(session: AgentSession, runtime: AgentSessionRuntime, command: ForkCommand): Promise<AgentControlResult> {
  if (!command.entryId) {
    return { status: "error", message: "Usage: /fork <entryId>" };
  }
  try {
    const result = await runtime.fork(command.entryId.trim());
    if (result.cancelled) {
      return { status: "error", message: "Fork cancelled." };
    }
    const selected = result.selectedText ? `Selected text:\n${result.selectedText}` : "Fork created.";
    return { status: "success", message: selected };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", message };
  }
}

/** Handle /clone: fork from the current tree leaf into a new session. */
export async function handleClone(session: AgentSession, runtime: AgentSessionRuntime, _command: CloneCommand): Promise<AgentControlResult> {
  const leafId = session.sessionManager.getLeafId();
  if (!leafId) {
    return { status: "error", message: "Nothing to clone yet." };
  }
  try {
    const result = await runtime.fork(leafId);
    if (result.cancelled) {
      return { status: "error", message: "Clone cancelled." };
    }
    const selected = result.selectedText ? `Selected text:\n${result.selectedText}` : "Clone created.";
    return { status: "success", message: selected };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", message };
  }
}

/** Handle /forks: list forkable messages. */
export async function handleForks(session: AgentSession, _command: ForksCommand): Promise<AgentControlResult> {
  const messages = session.getUserMessagesForForking();
  if (messages.length === 0) {
    return { status: "success", message: "No user messages available for forking." };
  }
  const lines = ["Forkable messages:", ...messages.map((msg) => `• ${msg.entryId}: ${truncateText(msg.text, 120)}`)];
  return { status: "success", message: lines.join("\n") };
}

/** Handle /export-html: export the session as an HTML file. */
export async function handleExportHtml(session: AgentSession, command: ExportHtmlCommand): Promise<AgentControlResult> {
  try {
    const outputPath = command.path?.trim() || undefined;
    const path = await session.exportToHtml(outputPath);
    return { status: "success", message: `Exported session to ${path}.` };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", message };
  }
}

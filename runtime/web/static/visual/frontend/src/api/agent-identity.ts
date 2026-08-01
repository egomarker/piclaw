/**
 * Shared agent identity state for the visual UI.
 * Populated by status polling; consumed by MessageItem, page title, notifications.
 */
import { signal } from "@preact/signals";
import { formatSessionBrowserTitle } from "../../../../../src/ui/browser-title";

const DEFAULT_AGENT_NAME = "PiClaw";

export const agentDisplayName = signal<string>(DEFAULT_AGENT_NAME);
export const activeSessionHandle = signal<string | null>(null);

function applyVisualBrowserTitle(): void {
  document.title = formatSessionBrowserTitle(agentDisplayName.value, activeSessionHandle.value);
}

export function updateAgentDisplayName(name: string | null | undefined): void {
  const resolved = (typeof name === "string" && name.trim()) ? name.trim() : DEFAULT_AGENT_NAME;
  if (agentDisplayName.value !== resolved) {
    agentDisplayName.value = resolved;
  }
  applyVisualBrowserTitle();
}

export function updateActiveSessionHandle(handle: string | null | undefined): void {
  const resolved = typeof handle === "string" && handle.trim() ? handle.trim().replace(/^@+/, "") : null;
  if (activeSessionHandle.value !== resolved) {
    activeSessionHandle.value = resolved;
  }
  applyVisualBrowserTitle();
}

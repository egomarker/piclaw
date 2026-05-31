import type { AgentControlCommand } from "../agent-control/index.js";
import { getAddonNonWebCommandPolicies } from "../addons/manifest-discovery.js";

function normalizeChatJid(value: string): string {
  return String(value || "").trim().toLowerCase();
}

function extractInvocationToken(rawText: string, fallback = "/command"): string {
  const trimmed = String(rawText || "").trim();
  if (!trimmed) return fallback;
  return trimmed.match(/^\S+/)?.[0] || fallback;
}

function extractSlashCommandName(rawText: string): string | null {
  const trimmed = String(rawText || "").trim();
  if (!trimmed.startsWith("/")) return null;

  const rawCommand = trimmed.slice(1);
  const argIndex = rawCommand.search(/\s/);
  const commandName = argIndex === -1 ? rawCommand : rawCommand.slice(0, argIndex);
  if (!/^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(commandName)) return null;
  return commandName.toLowerCase();
}

function resolveAllowedCommandsForChat(chatJid: string): { restricted: boolean; allowedCommands: Set<string> } {
  const normalizedChatJid = normalizeChatJid(chatJid);
  const allowedCommands = new Set<string>();
  let restricted = false;

  for (const policy of getAddonNonWebCommandPolicies()) {
    const matches = policy.chatJidPrefixes.some((prefix) => normalizedChatJid.startsWith(prefix));
    if (!matches) continue;
    restricted = true;
    for (const commandName of policy.allowedCommands) {
      allowedCommands.add(commandName);
    }
  }

  return { restricted, allowedCommands };
}

function isAllowedForChat(chatJid: string, commandName: string | null | undefined): boolean {
  const normalizedCommandName = String(commandName || "").trim().toLowerCase();
  if (!normalizedCommandName) return true;

  const { restricted, allowedCommands } = resolveAllowedCommandsForChat(chatJid);
  if (!restricted) return true;
  return allowedCommands.has(normalizedCommandName);
}

export function getBlockedNonWebCommandMessage(rawText: string): string {
  const token = extractInvocationToken(rawText);
  return `${token} is not available in this channel. Open this chat in the web UI for full command access.`;
}

export function isAllowedNonWebControlCommand(chatJid: string, command: AgentControlCommand): boolean {
  const commandName = command.type.replace(/_/g, "-").toLowerCase();
  return isAllowedForChat(chatJid, commandName);
}

export function isAllowedNonWebSlashCommand(chatJid: string, rawText: string): boolean {
  return isAllowedForChat(chatJid, extractSlashCommandName(rawText));
}

/**
 * chat-address – strict one-hop addressing for the chat transport registry.
 *
 * Local addresses contain no bang (for example `@research`). Remote-style
 * addresses contain exactly one bang (for example `lab!@research`). Core does
 * not interpret the peer or remote target components; the registered bang
 * transport owns those semantics.
 */

export type ChatAddressKind = "local" | "bang";

export type ParsedLocalChatAddress = {
  kind: "local";
  raw: string;
  target: string;
  targetKind: "agent" | "chat";
};

export type ParsedBangChatAddress = {
  kind: "bang";
  raw: string;
  peer: string;
  target: string;
};

export type ParsedChatAddress = ParsedLocalChatAddress | ParsedBangChatAddress;

export type ChatAddressErrorCode =
  | "empty_address"
  | "empty_peer"
  | "empty_target"
  | "invalid_component"
  | "multi_hop_not_supported";

export class ChatAddressError extends Error {
  constructor(
    readonly code: ChatAddressErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ChatAddressError";
  }
}

function assertComponent(value: string, label: "peer" | "target"): void {
  if (!value) {
    throw new ChatAddressError(
      label === "peer" ? "empty_peer" : "empty_target",
      `Chat address ${label} cannot be empty.`,
    );
  }
  if (/\p{Cc}/u.test(value) || /\s/u.test(value)) {
    throw new ChatAddressError(
      "invalid_component",
      `Chat address ${label} cannot contain whitespace or control characters.`,
    );
  }
}

/** Parse a user-facing local or one-hop bang address. */
export function parseChatAddress(input: string): ParsedChatAddress {
  const raw = String(input || "").trim();
  if (!raw) throw new ChatAddressError("empty_address", "Chat address cannot be empty.");

  const bangCount = Array.from(raw).filter((char) => char === "!").length;
  if (bangCount > 1) {
    throw new ChatAddressError(
      "multi_hop_not_supported",
      "Chat addresses support one hop only; multi-hop bang paths are not supported.",
    );
  }

  if (bangCount === 1) {
    const separator = raw.indexOf("!");
    const peer = raw.slice(0, separator).trim();
    const target = raw.slice(separator + 1).trim();
    assertComponent(peer, "peer");
    assertComponent(target, "target");
    return { kind: "bang", raw, peer, target };
  }

  assertComponent(raw, "target");
  const target = raw.replace(/^@+/, "");
  assertComponent(target, "target");
  return {
    kind: "local",
    raw,
    target,
    targetKind: "agent",
  };
}

/** Build a local address from the legacy explicit target selectors. */
export function localChatAddressFromSelector(input: {
  targetChatJid?: string;
  targetAgentName?: string;
}): ParsedLocalChatAddress {
  const targetChatJid = String(input.targetChatJid || "").trim();
  const targetAgentName = String(input.targetAgentName || "").trim().replace(/^@+/, "").trim();
  if (targetChatJid) {
    return {
      kind: "local",
      raw: targetChatJid,
      target: targetChatJid,
      targetKind: "chat",
    };
  }
  assertComponent(targetAgentName, "target");
  return {
    kind: "local",
    raw: `@${targetAgentName}`,
    target: targetAgentName,
    targetKind: "agent",
  };
}

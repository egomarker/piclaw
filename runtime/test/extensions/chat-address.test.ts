import { describe, expect, test } from "bun:test";

import {
  ChatAddressError,
  localChatAddressFromSelector,
  parseChatAddress,
} from "../../src/extensions/chat-address.js";

describe("chat address parser", () => {
  test("parses local aliases and one-hop bang addresses", () => {
    expect(parseChatAddress("  @research  ")).toEqual({
      kind: "local",
      raw: "@research",
      target: "research",
      targetKind: "agent",
    });
    expect(parseChatAddress("lab!@research")).toEqual({
      kind: "bang",
      raw: "lab!@research",
      peer: "lab",
      target: "@research",
    });
    expect(parseChatAddress("münchen!inbox")).toEqual({
      kind: "bang",
      raw: "münchen!inbox",
      peer: "münchen",
      target: "inbox",
    });
  });

  test("builds local addresses from legacy target selectors", () => {
    expect(localChatAddressFromSelector({ targetAgentName: "@@research" })).toEqual({
      kind: "local",
      raw: "@research",
      target: "research",
      targetKind: "agent",
    });
    expect(localChatAddressFromSelector({ targetChatJid: "web:target" })).toEqual({
      kind: "local",
      raw: "web:target",
      target: "web:target",
      targetKind: "chat",
    });
  });

  test.each([
    ["", "empty_address"],
    ["!inbox", "empty_peer"],
    ["lab!", "empty_target"],
    ["a!b!inbox", "multi_hop_not_supported"],
    ["lab name!inbox", "invalid_component"],
    ["lab!target name", "invalid_component"],
    ["@@@", "empty_target"],
  ])("rejects invalid address %j", (input, code) => {
    try {
      parseChatAddress(input);
      throw new Error("expected parse failure");
    } catch (error) {
      expect(error).toBeInstanceOf(ChatAddressError);
      expect((error as ChatAddressError).code).toBe(code);
    }
  });
});

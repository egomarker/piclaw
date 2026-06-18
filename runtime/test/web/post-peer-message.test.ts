/**
 * test/web/post-peer-message.test.ts – UI helpers for peer-message rendering.
 */
import { describe, expect, test } from "bun:test";
import { getPeerMessageDisplayContent, getPeerMessageMeta } from "../../web/src/components/post.js";

describe("peer-message post helpers", () => {
  test("extracts source metadata and hides the internal relay header from timeline rendering", () => {
    const blocks = [{
      type: "peer_message",
      source_chat_jid: "web:source",
      source_agent_name: "research",
      source_agent_display_name: "Smith",
      target_chat_jid: "web:target",
      target_agent_name: "review",
      target_agent_display_name: "Smith",
      body: "Please inspect the branch.",
    }];

    expect(getPeerMessageMeta(blocks)).toEqual({
      block: blocks[0],
      sourceChatJid: "web:source",
      sourceAgentName: "research",
      sourceAgentDisplayName: "Smith",
      targetChatJid: "web:target",
      targetAgentName: "review",
      targetAgentDisplayName: "Smith",
      body: "Please inspect the branch.",
    });

    expect(getPeerMessageDisplayContent(
      "from: @research <jid:web:source>\n\nPlease inspect the branch.",
      blocks,
    )).toBe("Please inspect the branch.");
  });
});

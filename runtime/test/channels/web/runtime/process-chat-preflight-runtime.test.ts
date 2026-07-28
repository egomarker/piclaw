import { describe, expect, test } from "bun:test";
import { runProcessChatPreflight } from "../../../../src/channels/web/runtime/process-chat-preflight-runtime.js";
import { getChatCursor, initDatabase, storeChatMetadata } from "../../../../src/db.js";
import { withTempWorkspaceEnv } from "../../../helpers.js";

describe("process chat preflight runtime", () => {
  test("falls back to a normal chat run when introspection is unavailable", async () => {
    await withTempWorkspaceEnv("preflight-runtime-", {}, async () => {
      initDatabase();
      const chatJid = "web:test";
      storeChatMetadata(chatJid, "2026-01-01T00:00:00.000Z", "Web");
      const result = await runProcessChatPreflight({ channel: { agentPool: {} } as any, chatJid, agentId: "default", message: { id: "m1", timestamp: "2026-01-01T00:00:01.000Z" }, prevCursor: getChatCursor(chatJid), effectiveThreadRootId: null, turnId: "turn-1", runStartedAt: new Date().toISOString(), streamingHandler() {}, compactionState: { lastCompactionErrorMessage: null, lastCompactionSuppressed: false }, enqueueResume() {} });
      expect(result).toBe("continue");
    });
  });
});

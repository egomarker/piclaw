import { describe, expect, test } from "bun:test";

import { finalizeSuccessfulProcessChatRun, persistIntermediateProcessChatTurn } from "../../../../src/channels/web/runtime/process-chat-finalization-runtime.js";
import { getChatCursor, initDatabase, setChatCursor, storeChatMetadata } from "../../../../src/db.js";
import {
  finalizePendingShutdownAfterTurn,
  isPendingShutdown,
  markPendingShutdown,
} from "../../../../src/runtime/shutdown-registry.js";
import { withTempWorkspaceEnv } from "../../../helpers.js";

function emitter(statuses: Array<Record<string, unknown>>) {
  return {
    status: (payload: Record<string, unknown>) => statuses.push(payload),
    response() {}, thought() {}, thoughtDelta() {}, draft() {}, draftDelta() {},
    generatedWidgetOpen() {}, generatedWidgetDelta() {}, generatedWidgetFinal() {}, generatedWidgetClose() {}, generatedWidgetError() {}, modelChanged() {},
  };
}

describe("process chat finalization runtime", () => {
  test("finalizes cursor/state and resumes persisted work before queued materialization", async () => {
    await withTempWorkspaceEnv("process-chat-finalize-", {}, async () => {
      initDatabase();
      const chatJid = "web:test";
      storeChatMetadata(chatJid, "2026-01-01T00:00:00.000Z", "Web");
      setChatCursor(chatJid, "2026-01-01T00:00:00.000Z");
      const statuses: Array<Record<string, unknown>> = [];
      const calls: string[] = [];
      const channel: any = {
        agentPool: { getContextUsageForChat: async () => ({ tokens: 10, contextWindow: 100, percent: 10 }) },
        consumePendingSteering: () => [], saveState: () => calls.push("save"), setContextUsage: () => calls.push("context"),
        resumeChat: () => calls.push("resume"), consumeQueuedFollowupItem: () => { calls.push("consume-queue"); return null; },
        prependQueuedFollowupItem() {}, storeMessage() { return null; }, broadcastEvent() {}, sendMessage: async () => {}, updateAgentStatus() {}, retryFailedOnModelSwitch: () => false,
      };
      await finalizeSuccessfulProcessChatRun({ channel, emitter: emitter(statuses) as any, chatJid, agentId: "default", turnId: "turn-1", threadId: 1, prevCursor: getChatCursor(chatJid), recovery: null });
      expect(calls).toEqual(["save", "context", "consume-queue"]);
      expect(statuses).toEqual([expect.objectContaining({ type: "done", context_usage: { tokens: 10, contextWindow: 100, percent: 10 } })]);
    });
  });

  test("finalizes a pending shutdown through the shared web turn finalizer", async () => {
    await withTempWorkspaceEnv("process-chat-finalize-", {}, async () => {
      initDatabase();
      const chatJid = "web:pending-shutdown";
      storeChatMetadata(chatJid, "2026-01-01T00:00:00.000Z", "Web");
      setChatCursor(chatJid, "2026-01-01T00:00:00.000Z");
      const channel: any = {
        agentPool: { getContextUsageForChat: async () => null },
        consumePendingSteering: () => [], saveState() {}, setContextUsage() {},
        resumeChat() {}, consumeQueuedFollowupItem: () => null,
        prependQueuedFollowupItem() {}, storeMessage() { return null; }, broadcastEvent() {}, sendMessage: async () => {}, updateAgentStatus() {}, retryFailedOnModelSwitch: () => false,
      };

      let shutdownRequests = 0;
      (globalThis as any).__PICLAW_EXIT_SCHEDULER__ = () => {
        shutdownRequests += 1;
      };
      markPendingShutdown("web restart test", 1_000);

      try {
        await finalizeSuccessfulProcessChatRun({ channel, emitter: emitter([]) as any, chatJid, agentId: "default", turnId: "turn-pending", threadId: 1, prevCursor: getChatCursor(chatJid), recovery: null });
        expect(shutdownRequests).toBe(1);
        expect(isPendingShutdown()).toBe(false);
      } finally {
        if (isPendingShutdown()) finalizePendingShutdownAfterTurn("test-cleanup");
        delete (globalThis as any).__PICLAW_EXIT_SCHEDULER__;
      }
    });
  });

  test("intermediate persistence preserves skip-placeholder and draft-clear ordering", () => {
    const calls: string[] = [];
    const channel: any = {
      consumeQueuedFollowupPlaceholder: () => { calls.push("consume"); return null; },
      storeMessage: (_chat: string, _text: string, _bot: boolean, _media: number[], options: any) => { calls.push(`store:${options.threadId}`); return { id: 42, chat_jid: "web:test" }; },
      broadcastEvent() {},
    };
    const result = persistIntermediateProcessChatTurn({ channel, emitter: emitter([]) as any, chatJid: "web:test", text: "partial", attachments: [], channelName: "web", threadId: 7, skipPlaceholder: true, timingBlock: { type: "agent_timing" }, followedByToolUse: true, clearCommittedDraft: () => calls.push("clear-draft") });
    expect(result).toBe(42);
    expect(calls).toEqual(["store:7", "clear-draft"]);
  });
});

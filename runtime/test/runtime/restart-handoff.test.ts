import { afterEach, beforeAll, describe, expect, test } from "bun:test";
import "../helpers.js";
import {
  extensionKvClear,
  getDb,
  initDatabase,
} from "../../src/db.js";
import { storeWebMessage } from "../../src/channels/web/messaging/message-store.js";
import {
  EXIT_PROCESS_HANDOFF_EXTENSION_ID,
  RESTART_CONTINUATION_LABEL,
  listRestartHandoffs,
  markRestartHandoffReady,
  prepareRestartHandoff,
  recoverPendingRestartHandoffs,
  type RestartHandoffRecoveryWebChannel,
} from "../../src/runtime/restart-handoff.js";

interface RecoveryEvent {
  kind: "store" | "broadcast" | "resume";
  chatJid?: string;
  content?: string;
  isBot?: boolean;
  eventType?: string;
  rowId?: number;
}

function createRecoveryWeb(
  events: RecoveryEvent[],
  options: { failStorePhase?: "completion" | "resume"; throwOnResume?: boolean } = {},
): RestartHandoffRecoveryWebChannel {
  const linkPreviewChannel = {
    pendingLinkPreviews: new Set<number>(),
    broadcastEvent: () => {},
  };

  return {
    storeMessage(chatJid, content, isBot, mediaIds, storeOptions = {}) {
      const phase = isBot ? "completion" : "resume";
      events.push({ kind: "store", chatJid, content, isBot });
      if (options.failStorePhase === phase) return null;
      return storeWebMessage(
        linkPreviewChannel,
        {
          chatJid,
          content,
          isBot,
          mediaIds,
          agentId: "default",
          agentName: "PiClaw",
          userName: "You",
        },
        storeOptions,
      );
    },
    broadcastEvent(eventType, data) {
      events.push({
        kind: "broadcast",
        eventType,
        rowId: typeof (data as { id?: unknown })?.id === "number"
          ? (data as { id: number }).id
          : undefined,
      });
    },
    resumeChat(chatJid, rowId) {
      events.push({ kind: "resume", chatJid, rowId: rowId ?? undefined });
      if (options.throwOnResume) throw new Error("simulated queue interruption");
    },
  };
}

function createReadyHandoff(input: {
  chatJid: string;
  reason: string;
  resumeMessage?: string | null;
}) {
  const preparing = prepareRestartHandoff(input);
  return markRestartHandoffReady(preparing, Math.floor(Math.random() * 100_000) + 1);
}

function getChatMessages(chatJid: string): Array<{
  rowid: number;
  content: string;
  content_blocks: string | null;
  screen_hint: string | null;
  is_bot_message: number;
}> {
  return getDb().prepare(`
    SELECT rowid, content, content_blocks, screen_hint, is_bot_message
    FROM messages
    WHERE chat_jid = ?
    ORDER BY timestamp ASC, rowid ASC
  `).all(chatJid) as ReturnType<typeof getChatMessages>;
}

describe("restart handoff recovery", () => {
  beforeAll(() => {
    initDatabase();
  });

  afterEach(() => {
    extensionKvClear(EXIT_PROCESS_HANDOFF_EXTENSION_ID);
  });

  test("posts the visible completion before a labelled inbound continuation and starts one turn", () => {
    const chatJid = `web:restart-resume-${crypto.randomUUID()}`;
    const handoff = createReadyHandoff({
      chatJid,
      reason: "Load the phase 2 build.",
      resumeMessage: "Continue the most recent task after recovery.",
    });
    const events: RecoveryEvent[] = [];

    const summary = recoverPendingRestartHandoffs(createRecoveryWeb(events));

    expect(summary).toEqual({
      discovered: 1,
      recovered: 1,
      discarded: 0,
      failed: 0,
      completionMessagesCreated: 1,
      resumeMessagesCreated: 1,
      turnsResumed: 1,
    });
    expect(events.map((event) => `${event.kind}:${event.eventType || (event.isBot ? "agent" : "inbound")}`)).toEqual([
      "store:agent",
      "broadcast:agent_response",
      "store:inbound",
      "broadcast:new_post",
      "resume:inbound",
    ]);

    const messages = getChatMessages(chatJid);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({
      content: "Restart completed",
      is_bot_message: 1,
    });
    expect(messages[1]).toMatchObject({
      content: "Continue the most recent task after recovery.",
      screen_hint: RESTART_CONTINUATION_LABEL,
      is_bot_message: 0,
    });

    const completionBlocks = JSON.parse(messages[0].content_blocks || "[]");
    const resumeBlocks = JSON.parse(messages[1].content_blocks || "[]");
    expect(completionBlocks).toContainEqual(expect.objectContaining({
      type: "restart_handoff",
      source: "exit_process",
      restart_id: handoff.restartId,
      phase: "completion",
    }));
    expect(resumeBlocks).toContainEqual(expect.objectContaining({
      type: "self_continuation",
      source: "exit_process",
      restart_id: handoff.restartId,
      label: RESTART_CONTINUATION_LABEL,
    }));
    expect(listRestartHandoffs()).toEqual([]);

    const repeated = recoverPendingRestartHandoffs(createRecoveryWeb(events));
    expect(repeated.discovered).toBe(0);
    expect(getChatMessages(chatJid)).toHaveLength(2);
  });

  test("posts only the completion message when no continuation was requested", () => {
    const chatJid = `web:restart-no-resume-${crypto.randomUUID()}`;
    createReadyHandoff({
      chatJid,
      reason: "Restart without follow-up.",
    });
    const events: RecoveryEvent[] = [];

    const summary = recoverPendingRestartHandoffs(createRecoveryWeb(events));

    expect(summary.recovered).toBe(1);
    expect(summary.completionMessagesCreated).toBe(1);
    expect(summary.resumeMessagesCreated).toBe(0);
    expect(summary.turnsResumed).toBe(0);
    expect(events.map((event) => event.kind)).toEqual(["store", "broadcast"]);
    expect(getChatMessages(chatJid).map((message) => message.content)).toEqual([
      "Restart completed",
    ]);
    expect(listRestartHandoffs()).toEqual([]);
  });

  test("retries an interrupted recovery without duplicating either timeline message", () => {
    const chatJid = `web:restart-interrupted-${crypto.randomUUID()}`;
    createReadyHandoff({
      chatJid,
      reason: "Exercise duplicate protection.",
      resumeMessage: "Resume exactly once.",
    });
    const interruptedEvents: RecoveryEvent[] = [];

    const interrupted = recoverPendingRestartHandoffs(createRecoveryWeb(interruptedEvents, {
      throwOnResume: true,
    }));

    expect(interrupted.failed).toBe(1);
    expect(interrupted.recovered).toBe(0);
    expect(getChatMessages(chatJid)).toHaveLength(2);
    expect(listRestartHandoffs()).toEqual([
      expect.objectContaining({ state: "resume_posted" }),
    ]);

    const retryEvents: RecoveryEvent[] = [];
    const retried = recoverPendingRestartHandoffs(createRecoveryWeb(retryEvents));

    expect(retried).toMatchObject({
      discovered: 1,
      recovered: 1,
      failed: 0,
      completionMessagesCreated: 0,
      resumeMessagesCreated: 0,
      turnsResumed: 1,
    });
    expect(retryEvents).toEqual([
      expect.objectContaining({ kind: "resume", chatJid }),
    ]);
    expect(getChatMessages(chatJid)).toHaveLength(2);
    expect(listRestartHandoffs()).toEqual([]);
  });

  test("leaves a ready handoff recoverable when startup message persistence fails", () => {
    const chatJid = `web:restart-store-failure-${crypto.randomUUID()}`;
    createReadyHandoff({
      chatJid,
      reason: "Retry after startup storage failure.",
      resumeMessage: "Continue after retry.",
    });

    const failed = recoverPendingRestartHandoffs(createRecoveryWeb([], {
      failStorePhase: "completion",
    }));

    expect(failed.failed).toBe(1);
    expect(failed.recovered).toBe(0);
    expect(getChatMessages(chatJid)).toEqual([]);
    expect(listRestartHandoffs()).toEqual([
      expect.objectContaining({ state: "ready", chatJid }),
    ]);

    const recovered = recoverPendingRestartHandoffs(createRecoveryWeb([]));
    expect(recovered.recovered).toBe(1);
    expect(getChatMessages(chatJid)).toHaveLength(2);
    expect(listRestartHandoffs()).toEqual([]);
  });

  test("discards an incomplete preparing handoff without posting anything", () => {
    const chatJid = `web:restart-preparing-${crypto.randomUUID()}`;
    prepareRestartHandoff({
      chatJid,
      reason: "The pre-shutdown notice never completed.",
      resumeMessage: "Do not run this.",
    });
    const events: RecoveryEvent[] = [];

    const summary = recoverPendingRestartHandoffs(createRecoveryWeb(events));

    expect(summary).toMatchObject({
      discovered: 1,
      recovered: 0,
      discarded: 1,
      failed: 0,
      turnsResumed: 0,
    });
    expect(events).toEqual([]);
    expect(getChatMessages(chatJid)).toEqual([]);
    expect(listRestartHandoffs()).toEqual([]);
  });
});

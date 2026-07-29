import { afterEach, describe, expect, test } from "bun:test";
import "../helpers.js";
import { withChatContext } from "../../src/core/chat-context.js";
import { exitProcess } from "../../src/extensions/exit-process.js";
import { setMessagesPostFn } from "../../src/extensions/messages-crud.js";
import {
  checkPendingShutdown,
  isPendingShutdown,
} from "../../src/runtime/shutdown-registry.js";
import { createFakeExtensionApi } from "./fake-extension-api.js";

type PostedMessage = {
  chatJid: string;
  content: string;
  isBot: boolean;
  mediaIds: number[];
  contentBlocks?: unknown[];
};

function getTool() {
  const fake = createFakeExtensionApi();
  exitProcess(fake.api);
  return toolOrThrow(fake.tools.get("exit_process"));
}

function toolOrThrow(tool: any) {
  if (!tool) throw new Error("exit_process was not registered");
  return tool;
}

describe("exit_process extension", () => {
  afterEach(async () => {
    setMessagesPostFn(undefined);
    if (!isPendingShutdown()) return;

    await new Promise<void>((resolve) => {
      (globalThis as { __PICLAW_EXIT_SCHEDULER__?: () => void }).__PICLAW_EXIT_SCHEDULER__ = resolve;
      checkPendingShutdown();
    });
    delete (globalThis as { __PICLAW_EXIT_SCHEDULER__?: () => void }).__PICLAW_EXIT_SCHEDULER__;
  });

  test("requires a non-empty reason in its schema", () => {
    const tool = getTool();
    expect(tool.parameters.required).toEqual(["reason"]);
    expect(tool.parameters.properties.reason.minLength).toBe(1);
    expect(tool.parameters.properties.reason.pattern).toBe("\\S");
    expect(tool.description).toContain("non-empty reason is required");
  });

  test("rejects missing or blank reasons without posting or scheduling shutdown", async () => {
    const tool = getTool();
    let postCalls = 0;
    setMessagesPostFn(() => {
      postCalls += 1;
      return 1;
    });

    for (const params of [{}, { reason: "  \n\t" }]) {
      const result = await withChatContext("web:exit-phase-1", "web", () => tool.execute("tool-exit", params));
      expect(result.details.scheduled).toBe(false);
      expect(result.details.error).toContain("non-empty reason");
      expect(result.terminate).toBeUndefined();
      expect(isPendingShutdown()).toBe(false);
    }

    expect(postCalls).toBe(0);
  });

  test("does not schedule shutdown when the restart notice cannot be stored", async () => {
    const tool = getTool();
    setMessagesPostFn(() => null);

    const result = await withChatContext("web:exit-phase-1", "web", () => tool.execute("tool-exit", {
      reason: "Load the verified phase 1 build.",
    }));

    expect(result.details.scheduled).toBe(false);
    expect(result.details.error).toContain("restart notice");
    expect(result.terminate).toBeUndefined();
    expect(isPendingShutdown()).toBe(false);
  });

  test("does not schedule shutdown without an active chat", async () => {
    const tool = getTool();
    let postCalls = 0;
    setMessagesPostFn(() => {
      postCalls += 1;
      return 1;
    });

    const result = await tool.execute("tool-exit", {
      reason: "Load the verified phase 1 build.",
    });

    expect(result.details.scheduled).toBe(false);
    expect(result.details.error).toContain("active chat");
    expect(result.terminate).toBeUndefined();
    expect(postCalls).toBe(0);
    expect(isPendingShutdown()).toBe(false);
  });

  test("posts an agent-owned restart notice before scheduling shutdown", async () => {
    const tool = getTool();
    const posted: PostedMessage[] = [];
    let pendingAtPost = true;
    setMessagesPostFn((chatJid, content, isBot, mediaIds, contentBlocks) => {
      pendingAtPost = isPendingShutdown();
      posted.push({ chatJid, content, isBot, mediaIds, contentBlocks });
      return 4242;
    });

    const result = await withChatContext("web:exit-phase-1", "web", () => tool.execute("tool-exit", {
      reason: "  Load the verified phase 1 build.  ",
    }));

    expect(posted).toEqual([{
      chatJid: "web:exit-phase-1",
      content: "Restarting now — Reason: Load the verified phase 1 build.",
      isBot: true,
      mediaIds: [],
      contentBlocks: undefined,
    }]);
    expect(result.details).toMatchObject({
      tool: "exit_process",
      scheduled: true,
      reason: "Load the verified phase 1 build.",
      chat_jid: "web:exit-phase-1",
      restart_message: "Restarting now — Reason: Load the verified phase 1 build.",
      restart_message_row_id: 4242,
      restart_message_broadcast: true,
    });
    expect(pendingAtPost).toBe(false);
    expect(result.terminate).toBe(true);
    expect(isPendingShutdown()).toBe(true);
  });
});

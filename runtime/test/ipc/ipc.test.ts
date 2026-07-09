/**
 * test/ipc/ipc.test.ts – Tests for the IPC file-based messaging system.
 *
 * Verifies IPC file creation, watcher detection, message parsing,
 * scheduled task registration, and cleanup of processed files.
 */

import { beforeAll, afterAll, expect, test } from "bun:test";
import { mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { join } from "path";
import { getTestWorkspace, setEnv, waitFor } from "../helpers.js";

let restoreEnv: (() => void) | null = null;
let db: typeof import("../../src/db.js");
let ipc: typeof import("../../src/ipc.js");
let config: typeof import("../../src/core/config.js");
let deps: import("../../src/ipc.js").IpcDeps;

const sentMessages: Array<{ jid: string; text: string; options?: { mediaIds?: number[]; contentBlocks?: Array<Record<string, unknown>> } }> = [];
const sentNudges: string[] = [];
const resumedChats: Array<Record<string, any>> = [];
const resumePendingCalls: Array<Record<string, any> | undefined> = [];

function findUndocumentedExports(source: string): Array<{ line: number; text: string }> {
  const lines = source.split("\n");
  const missing: Array<{ line: number; text: string }> = [];
  const exportPattern = /^export\s+(?:interface|type|class|const|let|var|(?:async\s+)?function)\b/;

  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i].trim();
    if (!exportPattern.test(current)) continue;

    let cursor = i - 1;
    while (cursor >= 0 && lines[cursor].trim() === "") cursor -= 1;
    if (cursor < 0 || !lines[cursor].trim().endsWith("*/")) {
      missing.push({ line: i + 1, text: current });
      continue;
    }

    let hasJSDoc = false;
    for (let j = cursor; j >= 0; j -= 1) {
      const text = lines[j].trim();
      if (text.startsWith("/**")) {
        hasJSDoc = true;
        break;
      }
      if (text.startsWith("/*") && !text.startsWith("/**")) break;
      if (!(text.startsWith("*") || text.endsWith("*/"))) break;
    }

    if (!hasJSDoc) missing.push({ line: i + 1, text: current });
  }

  return missing;
}

beforeAll(async () => {
  const ws = getTestWorkspace();
  restoreEnv = setEnv({
    PICLAW_WORKSPACE: ws.workspace,
    PICLAW_STORE: ws.store,
    PICLAW_DATA: ws.data,
  });

  db = await import("../../src/db.js");
  db.initDatabase();

  ipc = await import("../../src/ipc.js");
  config = await import("../../src/core/config.js");
  deps = {
    sendMessage: async (jid, text, options) => {
      sentMessages.push({ jid, text, options });
    },
    sendNudge: async (text) => {
      sentNudges.push(text);
    },
    resolveModel: (input) => {
      if (input === "valid/model") return { model: "valid/model" };
      return { error: "Invalid model." };
    },
    resumeChat: async (data) => {
      resumedChats.push(data);
    },
    resumePending: async (data) => {
      resumePendingCalls.push(data);
    },
  };
  ipc.startIpcWatcher(deps);

});


afterAll(async () => {
  await ipc.stopIpcWatcher();
  restoreEnv?.();
});

test("IPC message sends to web chat", async () => {
  const start = sentMessages.length;
  await ipc.processMessageCommand({ type: "message", chatJid: "web:default", text: "hello" }, deps);
  await waitFor(() => sentMessages.length > start);

  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.jid).toBe("web:default");
  expect(msg.text).toBe("hello");
});

test("IPC message falls back to PICLAW_CHAT_JID when chatJid is omitted", async () => {
  const restore = setEnv({ PICLAW_CHAT_JID: "web:test-chat" });
  const start = sentMessages.length;
  try {
    await ipc.processMessageCommand({ type: "message", text: "hello env" }, deps);
    await waitFor(() => sentMessages.length > start);
  } finally {
    restore();
  }

  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.jid).toBe("web:test-chat");
  expect(msg.text).toBe("hello env");
});

test("IPC message rejects unknown message types", async () => {
  await expect(
    ipc.processMessageCommand({ type: "messages", chatJid: "web:default", text: "hello" }, deps),
  ).rejects.toThrow("Unsupported IPC message type");
});

test("IPC message with media attaches files and supports inline rendering hints", async () => {
  const dataDir = config.DATA_DIR;
  const mediaPath = join(dataDir, `ipc_media_${Date.now()}.svg`);
  writeFileSync(mediaPath, "<svg xmlns='http://www.w3.org/2000/svg'><rect width='10' height='10' /></svg>");

  const start = sentMessages.length;
  await ipc.processMessageCommand(
    {
      type: "message",
      chatJid: "web:default",
      text: "Kanban board",
      media: [
        {
          path: mediaPath,
          content_type: "image/svg+xml",
          inline: true,
        },
      ],
    },
    deps,
  );
  await waitFor(() => sentMessages.length > start);

  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.jid).toBe("web:default");
  expect(msg.text).toBe("Kanban board");
  expect(msg.options?.mediaIds?.length).toBe(1);
  expect(msg.options?.mediaIds?.[0]).toBeGreaterThan(0);
  expect(msg.options?.contentBlocks?.[0]).toMatchObject({
    type: "image",
    mime_type: "image/svg+xml",
  });

  unlinkSync(mediaPath);

});

test("IPC string inline hint is parsed for SVG media", async () => {
  const dataDir = config.DATA_DIR;
  const mediaPath = join(dataDir, `ipc_media_string_inline_${Date.now()}.svg`);
  writeFileSync(mediaPath, "<svg xmlns='http://www.w3.org/2000/svg'><rect width='10' height='10' /></svg>");

  const start = sentMessages.length;
  await ipc.processMessageCommand(
    {
      type: "message",
      chatJid: "web:default",
      text: "String inline hint",
      media: [
        {
          path: mediaPath,
          content_type: "image/svg+xml",
          inline: "true",
        } as { path: string; content_type: string; inline: string },
      ],
    },
    deps,
  );
  await waitFor(() => sentMessages.length > start);

  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.options?.mediaIds?.length).toBe(1);
  expect(msg.options?.contentBlocks?.[0]).toMatchObject({
    type: "image",
    mime_type: "image/svg+xml",
  });

  unlinkSync(mediaPath);
});

test("IPC message with missing media file still posts with warning", async () => {
  const start = sentMessages.length;
  await ipc.processMessageCommand(
    {
      type: "message",
      chatJid: "web:default",
      text: "board",
      media: [
        {
          path: join(config.DATA_DIR, "missing_file.svg"),
        },
      ],
    },
    deps,
  );
  await waitFor(() => sentMessages.length > start);

  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.jid).toBe("web:default");
  expect(msg.text).toContain("⚠️ Media attachment warnings:");
  expect(msg.text).toContain("missing_file.svg");
  expect(msg.options?.mediaIds?.length || 0).toBe(0);
});

test("IPC media messages respect noNudge flag", async () => {
  const startNudges = sentNudges.length;
  const dataDir = config.DATA_DIR;
  const mediaPath = join(dataDir, `ipc_media_no_nudge_${Date.now()}.svg`);
  writeFileSync(mediaPath, "<svg xmlns='http://www.w3.org/2000/svg'></svg>");

  const start = sentMessages.length;
  await ipc.processMessageCommand(
    {
      type: "message",
      chatJid: "web:default",
      text: "No nudge",
      noNudge: true,
      media: [
        {
          path: mediaPath,
          content_type: "image/svg+xml",
        },
      ],
    },
    deps,
  );
  await waitFor(() => sentMessages.length > start);

  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.text).toContain("No nudge");
  expect(msg.options?.mediaIds?.length).toBe(1);
  expect(sentNudges.length).toBe(startNudges);

  unlinkSync(mediaPath);
});

test("IPC media-only warning still posts warning text", async () => {
  const start = sentMessages.length;
  await ipc.processMessageCommand(
    {
      type: "message",
      chatJid: "web:default",
      media: [
        {
          path: join(config.DATA_DIR, "missing_media_only.svg"),
        },
      ],
    },
    deps,
  );
  await waitFor(() => sentMessages.length > start);

  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.text).toContain("⚠️ Media attachment warnings:");
  expect(msg.text).toContain("missing_media_only.svg");
  expect(msg.options?.mediaIds?.length || 0).toBe(0);
});

test("IPC media-only message can post with no text", async () => {
  const dataDir = config.DATA_DIR;
  const mediaPath = join(dataDir, `ipc_media_only_${Date.now()}.png`);
  writeFileSync(mediaPath, "\x89PNG\r\n", "binary");

  const start = sentMessages.length;
  await ipc.processMessageCommand(
    {
      type: "message",
      chatJid: "web:default",
      media: [
        {
          path: mediaPath,
          content_type: "image/png",
          inline: true,
        },
      ],
    },
    deps,
  );
  await waitFor(() => sentMessages.length > start);

  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.jid).toBe("web:default");
  expect(msg.text).toBe("");
  expect(msg.options?.mediaIds?.length).toBe(1);
  unlinkSync(mediaPath);
});

test("IPC injected SVG text is indexed and searchable via FTS", async () => {
  const chatJid = `web:ipc-fts-${Date.now()}`;
  const timestamp = new Date().toISOString();
  db.storeChatMetadata(chatJid, timestamp, "IPC FTS");

  const token = `ipc_svg_fts_${Date.now()}`;
  const mediaPath = join(config.DATA_DIR, `ipc_media_fts_${Date.now()}.svg`);
  writeFileSync(
    mediaPath,
    `<svg xmlns='http://www.w3.org/2000/svg'><text>${token}</text></svg>`,
    "utf-8",
  );

  const ftsDeps: import("../../src/ipc.js").IpcDeps = {
    ...deps,
    sendMessage: async (jid, text, options) => {
      const rowId = db.storeMessage({
        id: `ipc-fts-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        chat_jid: jid,
        sender: "web-agent",
        sender_name: "PiClaw",
        content: text,
        timestamp: new Date().toISOString(),
        is_from_me: false,
        is_bot_message: true,
        content_blocks: options?.contentBlocks,
      });

      const mediaIds = options?.mediaIds || [];
      if (mediaIds.length > 0) {
        db.attachMediaToMessage(rowId, mediaIds);
      }
    },
  };

  await ipc.processMessageCommand(
    {
      type: "message",
      chatJid,
      text: "FTS media test",
      media: [
        {
          path: mediaPath,
          content_type: "image/svg+xml",
          inline: true,
        },
      ],
    },
    ftsDeps,
  );

  const searchResults = db.searchMessages(chatJid, token, 10, 0);
  expect(searchResults.length).toBeGreaterThan(0);
  expect(searchResults.some((entry) => entry.data.content.includes("FTS media test"))).toBe(true);

  unlinkSync(mediaPath);
});

test("IPC schedule_task creates a due agent task", async () => {
  await ipc.processTaskCommand({
    type: "schedule_task",
    chatJid: "web:default",
    prompt: "say hi",
    schedule_type: "once",
    schedule_value: "2020-01-01T00:00:00.000Z",
  }, deps);

  await waitFor(() => db.getDueTasks().length > 0);

  const due = db.getDueTasks();
  expect(due.length).toBeGreaterThan(0);
  expect(due[0].task_kind ?? "agent").toBe("agent");
});

test("IPC schedule_task and mute_task can suppress Pushover nudges", async () => {
  await ipc.processTaskCommand({
    type: "schedule_task",
    chatJid: "web:default",
    prompt: "quiet",
    muted: true,
    schedule_type: "once",
    schedule_value: "2020-01-01T00:00:00.000Z",
  }, deps);

  const created = db.getDb()
    .prepare("SELECT id, notify_on_complete FROM scheduled_tasks WHERE prompt = ? ORDER BY rowid DESC LIMIT 1")
    .get("quiet") as { id: string; notify_on_complete: number } | undefined;

  expect(created?.notify_on_complete).toBe(0);

  await ipc.processTaskCommand({ type: "unmute_task", taskId: created!.id }, deps);
  expect(db.getTaskById(created!.id)?.notify_on_complete).toBe(1);

  await ipc.processTaskCommand({ type: "mute_task", taskId: created!.id }, deps);
  expect(db.getTaskById(created!.id)?.notify_on_complete).toBe(0);
});

test("IPC schedule_task creates a due shell task", async () => {
  await ipc.processTaskCommand({
    type: "schedule_task",
    chatJid: "web:default",
    task_kind: "shell",
    command: "echo hi",
    schedule_type: "once",
    schedule_value: "2020-01-01T00:00:00.000Z",
  }, deps);

  await waitFor(() => db.getDueTasks().some((t) => t.task_kind === "shell"));

  const due = db.getDueTasks().find((t) => t.task_kind === "shell");
  expect(due?.command).toBe("echo hi");
});

test("IPC schedule_task accepts numeric schedule values and numeric-string timeouts", async () => {
  await ipc.processTaskCommand({
    type: "schedule_task",
    chatJid: "web:default",
    task_kind: "shell",
    command: "echo hi",
    timeout_sec: "45",
    schedule_type: "interval",
    schedule_value: 60000,
  } as Record<string, unknown>, deps);

  const created = db.getDb()
    .prepare("SELECT schedule_value, timeout_sec FROM scheduled_tasks WHERE task_kind = 'shell' ORDER BY rowid DESC LIMIT 1")
    .get() as { schedule_value: string; timeout_sec: number | null } | undefined;

  expect(created?.schedule_value).toBe("60000");
  expect(created?.timeout_sec).toBe(45);
});

test("IPC schedule_task rejects unsafe shell command", async () => {
  const start = sentMessages.length;
  await ipc.processTaskCommand({
    type: "schedule_task",
    chatJid: "web:default",
    task_kind: "shell",
    command: "rm -rf /",
    schedule_type: "once",
    schedule_value: "2020-01-01T00:00:00.000Z",
  }, deps);
  await waitFor(() => sentMessages.length > start);
  expect(sentMessages[sentMessages.length - 1].text).toContain("Cannot schedule shell task");
});

test("IPC resume_pending triggers resumePending handler", async () => {
  const start = resumePendingCalls.length;
  await ipc.processTaskCommand({ type: "resume_pending", chatJid: "web:default" }, deps);
  await waitFor(() => resumePendingCalls.length > start, 10000);
  expect(resumePendingCalls[resumePendingCalls.length - 1]?.chatJid).toBe("web:default");
});

test("IPC task commands reject unknown task types", async () => {
  await expect(
    ipc.processTaskCommand({ type: "task_typo", chatJid: "web:default" }, deps),
  ).rejects.toThrow("Unsupported IPC task type");
});

test("IPC renames malformed task files", async () => {
  const ipcDir = join(config.DATA_DIR, "ipc");
  const tasksDir = join(ipcDir, "tasks");
  mkdirSync(tasksDir, { recursive: true });
  const fileName = `bad_${Date.now()}.json`;
  const filePath = join(tasksDir, fileName);
  writeFileSync(filePath, "{not valid json");

  await waitFor(() => readdirSync(ipcDir).some((file) => file === `error-${fileName}`));

  const errorPath = join(ipcDir, `error-${fileName}`);
  expect(readdirSync(tasksDir).includes(fileName)).toBe(false);
  expect(readdirSync(ipcDir).includes(`error-${fileName}`)).toBe(true);
  unlinkSync(errorPath);
});

test("IPC update_task with invalid model reports error", async () => {
  const taskId = `task_${Date.now()}`;
  db.createTask({
    id: taskId,
    chat_jid: "web:default",
    prompt: "hello",
    model: null,
    schedule_type: "once",
    schedule_value: new Date().toISOString(),
    next_run: new Date().toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  });

  const start = sentMessages.length;
  await ipc.processTaskCommand({
    type: "update_task",
    taskId,
    chatJid: "web:default",
    model: "invalid/model",
  }, deps);
  await waitFor(() => sentMessages.length > start);
  const msg = sentMessages[sentMessages.length - 1];
  expect(msg.jid).toBe("web:default");
  expect(msg.text).toContain("Cannot update task");

  const task = db.getTaskById(taskId);
  expect(task?.model ?? null).toBe(null);
});

test("IPC update_task ignores invalid schedule values", async () => {
  const taskId = `task_schedule_${Date.now()}`;
  const originalNextRun = new Date(Date.now() + 60_000).toISOString();
  db.createTask({
    id: taskId,
    chat_jid: "web:default",
    prompt: "hello",
    model: null,
    schedule_type: "interval",
    schedule_value: "60000",
    next_run: originalNextRun,
    status: "active",
    created_at: new Date().toISOString(),
  });

  await ipc.processTaskCommand({
    type: "update_task",
    taskId,
    schedule_type: "interval",
    schedule_value: "not-a-number",
  }, deps);

  const task = db.getTaskById(taskId);
  expect(task?.next_run).toBe(originalNextRun);
});

test("IPC update_task accepts numeric schedule values", async () => {
  const taskId = `task_schedule_numeric_${Date.now()}`;
  db.createTask({
    id: taskId,
    chat_jid: "web:default",
    prompt: "hello",
    model: null,
    schedule_type: "interval",
    schedule_value: "60000",
    next_run: new Date(Date.now() + 60_000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  });

  await ipc.processTaskCommand({
    type: "update_task",
    taskId,
    schedule_type: "interval",
    schedule_value: 120000,
  } as Record<string, unknown>, deps);

  const task = db.getTaskById(taskId);
  expect(task?.schedule_value).toBe("120000");
});

test("IPC cleanup_tasks removes completed tasks and logs", async () => {
  const tasksDir = join(config.DATA_DIR, "ipc", "tasks");
  mkdirSync(tasksDir, { recursive: true });

  const completedId = `task_completed_${Date.now()}`;
  db.createTask({
    id: completedId,
    chat_jid: "web:default",
    prompt: "done",
    model: null,
    schedule_type: "once",
    schedule_value: new Date().toISOString(),
    next_run: null,
    status: "completed",
    created_at: new Date().toISOString(),
  });
  db.logTaskRun({
    task_id: completedId,
    run_at: new Date().toISOString(),
    duration_ms: 10,
    status: "success",
    result: "ok",
    error: null,
  });

  const activeId = `task_active_${Date.now()}`;
  db.createTask({
    id: activeId,
    chat_jid: "web:default",
    prompt: "active",
    model: null,
    schedule_type: "once",
    schedule_value: new Date().toISOString(),
    next_run: null,
    status: "active",
    created_at: new Date().toISOString(),
  });

  const start = sentMessages.length;
  await ipc.processTaskCommand({ type: "cleanup_tasks", chatJid: "web:default" }, deps);
  await waitFor(() => sentMessages.length > start, 10000);
  expect(sentMessages[sentMessages.length - 1].text).toContain("Cleaned up 1 completed task");
  expect(db.getTaskById(completedId)).toBeNull();
  expect(db.getTaskRunLogs(completedId).length).toBe(0);
  expect(db.getTaskById(activeId)).not.toBeNull();
});

test("IPC cleanup_tasks does not fail after deleting rows when notification sending throws", async () => {
  const completedId = `task_cleanup_notify_${Date.now()}`;
  db.createTask({
    id: completedId,
    chat_jid: "web:default",
    prompt: "done",
    model: null,
    schedule_type: "once",
    schedule_value: new Date().toISOString(),
    next_run: null,
    status: "completed",
    created_at: new Date().toISOString(),
  });
  db.logTaskRun({
    task_id: completedId,
    run_at: new Date().toISOString(),
    duration_ms: 10,
    status: "success",
    result: "ok",
    error: null,
  });

  await expect(ipc.processTaskCommand(
    { type: "cleanup_tasks", chatJid: "web:default" },
    {
      ...deps,
      sendMessage: async () => {
        throw new Error("notify failed");
      },
    },
  )).resolves.toBeUndefined();

  expect(db.getTaskById(completedId)).toBeNull();
  expect(db.getTaskRunLogs(completedId).length).toBe(0);
});

test("IPC pause_task resume_task and cancel_task mutate lifecycle", async () => {
  const taskId = `task_lifecycle_${Date.now()}`;
  db.createTask({
    id: taskId,
    chat_jid: "web:default",
    prompt: "hello",
    model: null,
    schedule_type: "interval",
    schedule_value: "60000",
    next_run: new Date(Date.now() + 60_000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  });

  await ipc.processTaskCommand({ type: "pause_task", taskId }, deps);
  expect(db.getTaskById(taskId)?.status).toBe("paused");

  await ipc.processTaskCommand({ type: "resume_task", taskId }, deps);
  expect(db.getTaskById(taskId)?.status).toBe("active");

  await ipc.processTaskCommand({ type: "cancel_task", taskId }, deps);
  expect(db.getTaskById(taskId)).toBeNull();
});

test("IPC watcher stop waits for the active poll to finish", async () => {
  await ipc.stopIpcWatcher();

  const messagesDir = join(config.DATA_DIR, "ipc", "messages");
  mkdirSync(messagesDir, { recursive: true });
  const fileName = `slow_${Date.now()}.json`;
  const filePath = join(messagesDir, fileName);
  writeFileSync(filePath, JSON.stringify({ type: "message", chatJid: "web:default", text: "slow" }));

  let releaseSend!: () => void;
  const sendStarted = new Promise<void>((resolve) => {
    releaseSend = resolve;
  });

  let unblockSend!: () => void;
  const sendBlocked = new Promise<void>((resolve) => {
    unblockSend = resolve;
  });

  ipc.startIpcWatcher({
    ...deps,
    sendMessage: async () => {
      releaseSend();
      await sendBlocked;
    },
  });

  await sendStarted;

  let stopped = false;
  const stopPromise = ipc.stopIpcWatcher().then(() => {
    stopped = true;
  });

  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(stopped).toBe(false);

  unblockSend();
  await stopPromise;
  expect(stopped).toBe(true);
  expect(readdirSync(messagesDir)).not.toContain(fileName);

  ipc.startIpcWatcher(deps);
});

test("IPC-related exported symbols keep JSDoc coverage", () => {
  const files = [
    new URL("../../src/ipc.ts", import.meta.url),
    new URL("../../src/channels/web/media/media-service.ts", import.meta.url),
  ];

  for (const fileUrl of files) {
    const source = readFileSync(fileUrl, "utf-8");
    const missing = findUndocumentedExports(source);
    expect(missing).toEqual([]);
  }
});

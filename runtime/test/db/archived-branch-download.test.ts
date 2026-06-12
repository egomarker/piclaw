import { expect, test } from "bun:test";

import { createTempWorkspace, importFresh, setEnv } from "../helpers.js";

test("exportArchivedBranchDownloadData returns archived branch session data", async () => {
  const ws = createTempWorkspace("piclaw-archived-download-");
  const restore = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });
  try {
    const dbModule = await importFresh<typeof import("../../src/db.js")>("../../src/db.js", import.meta.url);
    dbModule.initDatabase();
    const db = dbModule.getDb();

    db.prepare(`INSERT INTO chats (jid, name, last_message_time) VALUES (?, ?, ?)`).run(
      "web:archived-download",
      "Archived Download",
      "2026-06-12T00:00:00.000Z",
    );
    db.prepare(`INSERT INTO chat_branches (branch_id, chat_jid, root_chat_jid, parent_branch_id, agent_name, created_at, updated_at, archived_at)
      VALUES (?, ?, ?, NULL, ?, ?, ?, ?)`).run(
      "branch-archived-download",
      "web:archived-download",
      "web:archived-download",
      "download-test",
      "2026-06-11T00:00:00.000Z",
      "2026-06-12T00:00:00.000Z",
      "2026-06-12T01:00:00.000Z",
    );
    db.prepare(`INSERT INTO messages (id, chat_jid, sender, sender_name, content, timestamp, is_from_me, is_bot_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      "msg-1",
      "web:archived-download",
      "web-user",
      "You",
      "hello archived session",
      "2026-06-12T00:00:01.000Z",
      0,
      0,
    );
    db.prepare(`INSERT INTO chat_cursors (chat_jid, cursor_ts) VALUES (?, ?)`).run(
      "web:archived-download",
      "2026-06-12T00:00:01.000Z",
    );

    const exported = dbModule.exportArchivedBranchDownloadData("web:archived-download");
    expect(exported.schema).toBe("piclaw.archived-session.v1");
    expect(exported.branch.chat_jid).toBe("web:archived-download");
    expect(exported.chat?.jid).toBe("web:archived-download");
    expect(exported.messages).toHaveLength(1);
    expect(exported.messages[0]?.content).toBe("hello archived session");
    expect(exported.chat_cursor?.chat_jid).toBe("web:archived-download");
  } finally {
    restore();
    ws.cleanup();
  }
});

test("exportArchivedBranchDownloadData rejects non-archived branches", async () => {
  const ws = createTempWorkspace("piclaw-active-download-");
  const restore = setEnv({ PICLAW_WORKSPACE: ws.workspace, PICLAW_STORE: ws.store, PICLAW_DATA: ws.data });
  try {
    const dbModule = await importFresh<typeof import("../../src/db.js")>("../../src/db.js", import.meta.url);
    dbModule.initDatabase();
    const db = dbModule.getDb();
    db.prepare(`INSERT INTO chats (jid, name, last_message_time) VALUES (?, ?, ?)`).run("web:active-download", "Active", "");
    db.prepare(`INSERT INTO chat_branches (branch_id, chat_jid, root_chat_jid, parent_branch_id, agent_name, created_at, updated_at, archived_at)
      VALUES (?, ?, ?, NULL, ?, ?, ?, NULL)`).run(
      "branch-active-download",
      "web:active-download",
      "web:active-download",
      "active-download",
      "2026-06-12T00:00:00.000Z",
      "2026-06-12T00:00:00.000Z",
    );

    expect(() => dbModule.exportArchivedBranchDownloadData("web:active-download")).toThrow("Cannot download a branch that is not archived");
  } finally {
    restore();
    ws.cleanup();
  }
});

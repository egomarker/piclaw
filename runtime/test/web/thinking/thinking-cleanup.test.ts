// Self-isolating: forces PICLAW_DB_IN_MEMORY=1 via shared test helpers
import "../../helpers.js";

import { describe, test, expect, beforeAll, beforeEach } from "bun:test";
import { getDb, initDatabase } from "../../../src/db/connection.js";
import {
  storeThinkingContent,
  getThinkingContent,
  deleteThinkingContentByMessageRowIds,
  deleteThinkingContentByChatJid,
  deleteThinkingContentByChatJidPattern,
  deleteMessageByRowId,
  deleteThreadByRowId,
} from "../../../src/db/messages.js";

/**
 * Regression tests for R3+I1 — every code path that deletes from `messages`
 * must also delete the matching `thinking_content` rows. No FK CASCADE is
 * possible (see I2 in PR #655 issues tracker).
 *
 * "Orphans" = thinking_content rows whose message_id no longer maps to a
 * messages.rowid. The invariant: after any delete, orphan count is 0.
 */
describe("thinking_content cleanup across all delete paths", () => {
  beforeAll(() => {
    initDatabase();
  });

  /** Reset both tables and seed a message + matching thinking row.
   *  Returns the message rowid so the caller can assert against it. */
  function seedMessageWithThinking(chatJid: string, content: string, isBot = true): number {
    const db = getDb();
    db.exec("DELETE FROM thinking_content");
    db.exec("DELETE FROM messages");
    db.exec("DELETE FROM chats");
    // Chat row required by messages FK
    db.prepare("INSERT OR IGNORE INTO chats(jid, name) VALUES (?, ?)").run(chatJid, chatJid);
    // Insert message
    const messageId = `test-${Date.now()}-${Math.random()}`;
    db.prepare(
      `INSERT INTO messages(id, chat_jid, sender, sender_name, content, timestamp, is_from_me, is_bot_message, is_terminal_agent_reply)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, 1)`
    ).run(messageId, chatJid, isBot ? "web-agent" : "web-user", "tester", content, new Date().toISOString(), isBot ? 1 : 0);
    const row = db.prepare("SELECT rowid FROM messages WHERE id = ? AND chat_jid = ?").get(messageId, chatJid) as { rowid: number };
    storeThinkingContent(String(row.rowid), "thought traces", 3, 100, "test-model");
    return row.rowid;
  }

  /** Count thinking_content rows whose message_id no longer maps to any
   *  messages.rowid. This should always be 0 after a delete. */
  function countOrphans(): number {
    const result = getDb().prepare(
      `SELECT COUNT(*) as n FROM thinking_content
       WHERE CAST(message_id AS INTEGER) NOT IN (SELECT rowid FROM messages)`
    ).get() as { n: number };
    return result.n;
  }

  describe("helper: deleteThinkingContentByMessageRowIds", () => {
    test("removes specified thinking rows", () => {
      const rowId = seedMessageWithThinking("test-chat-1", "hi");
      expect(getThinkingContent(String(rowId))).not.toBeNull();
      deleteThinkingContentByMessageRowIds([rowId]);
      expect(getThinkingContent(String(rowId))).toBeNull();
    });

    test("no-op on empty list", () => {
      const rowId = seedMessageWithThinking("test-chat-1", "hi");
      deleteThinkingContentByMessageRowIds([]);
      expect(getThinkingContent(String(rowId))).not.toBeNull();
    });

    test("handles multiple rowids", () => {
      const r1 = seedMessageWithThinking("c", "first");
      // Add a second message in same chat
      const db = getDb();
      db.prepare(
        `INSERT INTO messages(id, chat_jid, sender, content, timestamp, is_from_me, is_bot_message, is_terminal_agent_reply)
         VALUES (?, ?, ?, ?, ?, 0, 1, 1)`
      ).run("m2", "c", "web-agent", "second", new Date().toISOString());
      const r2 = (db.prepare("SELECT rowid FROM messages WHERE id = 'm2'").get() as { rowid: number }).rowid;
      storeThinkingContent(String(r2), "second thought", 1, 50);
      deleteThinkingContentByMessageRowIds([r1, r2]);
      expect(getThinkingContent(String(r1))).toBeNull();
      expect(getThinkingContent(String(r2))).toBeNull();
    });
  });

  describe("helper: deleteThinkingContentByChatJid", () => {
    test("removes thinking for all messages in a chat", () => {
      const rowId = seedMessageWithThinking("chat-A", "hi");
      expect(getThinkingContent(String(rowId))).not.toBeNull();
      deleteThinkingContentByChatJid("chat-A");
      expect(getThinkingContent(String(rowId))).toBeNull();
    });

    test("does not touch other chats", () => {
      const rA = seedMessageWithThinking("chat-A", "hi");
      // Seed another chat with a separate message
      const db = getDb();
      db.prepare("INSERT OR IGNORE INTO chats(jid, name) VALUES (?, ?)").run("chat-B", "chat-B");
      db.prepare(
        `INSERT INTO messages(id, chat_jid, sender, content, timestamp, is_from_me, is_bot_message, is_terminal_agent_reply)
         VALUES (?, ?, ?, ?, ?, 0, 1, 1)`
      ).run("mB", "chat-B", "web-agent", "B", new Date().toISOString());
      const rB = (db.prepare("SELECT rowid FROM messages WHERE id = 'mB'").get() as { rowid: number }).rowid;
      storeThinkingContent(String(rB), "B thought", 1, 50);

      deleteThinkingContentByChatJid("chat-A");
      expect(getThinkingContent(String(rA))).toBeNull();
      expect(getThinkingContent(String(rB))).not.toBeNull();
    });
  });

  describe("helper: deleteThinkingContentByChatJidPattern", () => {
    test("matches LIKE pattern across multiple chats", () => {
      const db = getDb();
      db.exec("DELETE FROM thinking_content");
      db.exec("DELETE FROM messages");
      db.exec("DELETE FROM chats");
      for (const jid of ["dream:auto:1", "dream:manual:2", "normal-chat"]) {
        db.prepare("INSERT INTO chats(jid, name) VALUES (?, ?)").run(jid, jid);
        const msgId = `m-${jid}`;
        db.prepare(
          `INSERT INTO messages(id, chat_jid, sender, content, timestamp, is_from_me, is_bot_message, is_terminal_agent_reply)
           VALUES (?, ?, 'web-agent', 'x', ?, 0, 1, 1)`
        ).run(msgId, jid, new Date().toISOString());
        const r = (db.prepare("SELECT rowid FROM messages WHERE id = ?").get(msgId) as { rowid: number }).rowid;
        storeThinkingContent(String(r), `${jid} thought`, 1, 50);
      }
      // Wipe dream: but exclude "dream:manual:2"
      deleteThinkingContentByChatJidPattern("dream:%", "dream:manual:2");
      const remaining = (db.prepare(
        `SELECT m.chat_jid FROM thinking_content tc
         JOIN messages m ON m.rowid = CAST(tc.message_id AS INTEGER)`
      ).all() as Array<{ chat_jid: string }>).map((r) => r.chat_jid).sort();
      expect(remaining).toEqual(["dream:manual:2", "normal-chat"]);
    });

    test("no exclusion wipes all matching", () => {
      const db = getDb();
      db.exec("DELETE FROM thinking_content");
      db.exec("DELETE FROM messages");
      db.exec("DELETE FROM chats");
      for (const jid of ["dream:auto:1", "dream:manual:2", "normal-chat"]) {
        db.prepare("INSERT INTO chats(jid, name) VALUES (?, ?)").run(jid, jid);
        const msgId = `m-${jid}`;
        db.prepare(
          `INSERT INTO messages(id, chat_jid, sender, content, timestamp, is_from_me, is_bot_message, is_terminal_agent_reply)
           VALUES (?, ?, 'web-agent', 'x', ?, 0, 1, 1)`
        ).run(msgId, jid, new Date().toISOString());
        const r = (db.prepare("SELECT rowid FROM messages WHERE id = ?").get(msgId) as { rowid: number }).rowid;
        storeThinkingContent(String(r), `${jid} thought`, 1, 50);
      }
      deleteThinkingContentByChatJidPattern("dream:%");
      const remaining = (db.prepare(
        `SELECT m.chat_jid FROM thinking_content tc
         JOIN messages m ON m.rowid = CAST(tc.message_id AS INTEGER)`
      ).all() as Array<{ chat_jid: string }>).map((r) => r.chat_jid).sort();
      expect(remaining).toEqual(["normal-chat"]);
    });
  });

  describe("integration: deleteMessageByRowId leaves no thinking orphans", () => {
    test("single-message delete purges thinking", () => {
      const rowId = seedMessageWithThinking("c", "hi");
      expect(getThinkingContent(String(rowId))).not.toBeNull();
      deleteMessageByRowId("c", rowId);
      expect(getThinkingContent(String(rowId))).toBeNull();
      expect(countOrphans()).toBe(0);
    });
  });

  describe("integration: deleteThreadByRowId leaves no thinking orphans", () => {
    test("thread delete purges thinking for parent and replies", () => {
      const db = getDb();
      db.exec("DELETE FROM thinking_content");
      db.exec("DELETE FROM messages");
      db.exec("DELETE FROM chats");
      db.prepare("INSERT INTO chats(jid, name) VALUES (?, ?)").run("c", "c");
      // Parent message
      db.prepare(
        `INSERT INTO messages(id, chat_jid, sender, content, timestamp, is_from_me, is_bot_message, is_terminal_agent_reply, thread_id)
         VALUES ('p', 'c', 'web-agent', 'parent', ?, 0, 1, 1, NULL)`
      ).run(new Date().toISOString());
      const parentRowId = (db.prepare("SELECT rowid FROM messages WHERE id = 'p'").get() as { rowid: number }).rowid;
      // Self-thread the parent
      db.prepare("UPDATE messages SET thread_id = ? WHERE rowid = ?").run(parentRowId, parentRowId);
      // Reply
      db.prepare(
        `INSERT INTO messages(id, chat_jid, sender, content, timestamp, is_from_me, is_bot_message, is_terminal_agent_reply, thread_id)
         VALUES ('r', 'c', 'web-agent', 'reply', ?, 0, 1, 1, ?)`
      ).run(new Date().toISOString(), parentRowId);
      const replyRowId = (db.prepare("SELECT rowid FROM messages WHERE id = 'r'").get() as { rowid: number }).rowid;
      storeThinkingContent(String(parentRowId), "parent thought", 2, 200);
      storeThinkingContent(String(replyRowId), "reply thought", 1, 50);

      const deleted = deleteThreadByRowId("c", parentRowId);
      expect(deleted.sort()).toEqual([parentRowId, replyRowId].sort());
      expect(getThinkingContent(String(parentRowId))).toBeNull();
      expect(getThinkingContent(String(replyRowId))).toBeNull();
      expect(countOrphans()).toBe(0);
    });
  });

  describe("invariant: no path leaves orphans", () => {
    beforeEach(() => {
      const db = getDb();
      db.exec("DELETE FROM thinking_content");
      db.exec("DELETE FROM messages");
      db.exec("DELETE FROM chats");
    });

    test("after every delete helper, orphans are zero", () => {
      // Seed a mixed corpus
      const db = getDb();
      const seedChat = (jid: string, msgCount: number) => {
        db.prepare("INSERT OR IGNORE INTO chats(jid, name) VALUES (?, ?)").run(jid, jid);
        const ids: number[] = [];
        for (let i = 0; i < msgCount; i++) {
          const msgId = `${jid}-${i}`;
          db.prepare(
            `INSERT INTO messages(id, chat_jid, sender, content, timestamp, is_from_me, is_bot_message, is_terminal_agent_reply)
             VALUES (?, ?, 'web-agent', ?, ?, 0, 1, 1)`
          ).run(msgId, jid, `msg ${i}`, new Date().toISOString());
          const r = (db.prepare("SELECT rowid FROM messages WHERE id = ?").get(msgId) as { rowid: number }).rowid;
          storeThinkingContent(String(r), `${jid} thought ${i}`, 1, 50);
          ids.push(r);
        }
        return ids;
      };

      const chatA = seedChat("chat-A", 3);
      const chatB = seedChat("chat-B", 2);
      const dream1 = seedChat("dream:auto:1", 1);
      const dream2 = seedChat("dream:manual:2", 1);

      // 1. delete a single message by rowid
      deleteMessageByRowId("chat-A", chatA[0]);
      expect(countOrphans()).toBe(0);

      // 2. delete remaining chat-A by chat_jid
      deleteThinkingContentByChatJid("chat-A");
      db.prepare("DELETE FROM messages WHERE chat_jid = 'chat-A'").run();
      expect(countOrphans()).toBe(0);

      // 3. delete dream chats by pattern
      deleteThinkingContentByChatJidPattern("dream:%");
      db.prepare("DELETE FROM messages WHERE chat_jid LIKE 'dream:%'").run();
      expect(countOrphans()).toBe(0);

      // 4. delete chat-B by rowid list
      deleteThinkingContentByMessageRowIds(chatB);
      db.prepare("DELETE FROM messages WHERE chat_jid = 'chat-B'").run();
      expect(countOrphans()).toBe(0);

      // Final sanity: all gone
      const total = (db.prepare("SELECT COUNT(*) as n FROM thinking_content").get() as { n: number }).n;
      expect(total).toBe(0);
    });
  });
});

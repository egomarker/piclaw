// Side-effect import: forces PICLAW_DB_IN_MEMORY=1 and shared temp workspace
// so this test self-isolates and never touches the live messages.db.
import "../../helpers.js";

import { describe, test, expect, beforeAll, beforeEach } from "bun:test";
import { getDb, initDatabase } from "../../../src/db/connection.js";
import { storeThinkingContent, getThinkingContent } from "../../../src/db/messages.js";
import { isPersistThinkingEnabled, getPersistThinkingMaxChars } from "../../../src/core/config.js";

describe("thinking persistence", () => {

  describe("config", () => {
    test("disabled by default", () => {
      delete process.env.PICLAW_WEB_PERSIST_THINKING;
      expect(isPersistThinkingEnabled()).toBe(false);
    });

    test("enabled via env var", () => {
      process.env.PICLAW_WEB_PERSIST_THINKING = "1";
      expect(isPersistThinkingEnabled()).toBe(true);
      delete process.env.PICLAW_WEB_PERSIST_THINKING;
    });

    test("max chars defaults to 100000", () => {
      delete process.env.PICLAW_WEB_PERSIST_THINKING_MAX_CHARS;
      expect(getPersistThinkingMaxChars()).toBe(100000);
    });

    test("max chars from env", () => {
      process.env.PICLAW_WEB_PERSIST_THINKING_MAX_CHARS = "5000";
      expect(getPersistThinkingMaxChars()).toBe(5000);
      delete process.env.PICLAW_WEB_PERSIST_THINKING_MAX_CHARS;
    });

    test("max chars rejects zero and negative", () => {
      process.env.PICLAW_WEB_PERSIST_THINKING_MAX_CHARS = "0";
      expect(getPersistThinkingMaxChars()).toBe(100000);
      process.env.PICLAW_WEB_PERSIST_THINKING_MAX_CHARS = "-100";
      expect(getPersistThinkingMaxChars()).toBe(100000);
      delete process.env.PICLAW_WEB_PERSIST_THINKING_MAX_CHARS;
    });
  });

  describe("database CRUD", () => {
    beforeAll(() => {
      initDatabase();
    });

    beforeEach(() => {
      getDb().exec("DELETE FROM thinking_content");
    });

    test("store and retrieve thinking content", () => {
      storeThinkingContent("101", "I think therefore I am", 5, 3200, "claude-opus-4.6");
      const result = getThinkingContent("101");
      expect(result).not.toBeNull();
      expect(result!.text).toBe("I think therefore I am");
      expect(result!.lines).toBe(5);
      expect(result!.duration_ms).toBe(3200);
      expect(result!.model).toBe("claude-opus-4.6");
      expect(result!.truncated).toBe(false);
    });

    test("returns null for missing message", () => {
      expect(getThinkingContent("99999")).toBeNull();
    });

    test("stores truncated flag", () => {
      storeThinkingContent("102", "truncated text", 1, 100, undefined, true);
      expect(getThinkingContent("102")!.truncated).toBe(true);
    });

    test("handles missing model", () => {
      storeThinkingContent("103", "no model", 1, 100);
      expect(getThinkingContent("103")!.model).toBeNull();
    });

    test("replace on duplicate message_id", () => {
      storeThinkingContent("104", "first", 1, 100);
      storeThinkingContent("104", "second", 2, 200);
      const result = getThinkingContent("104");
      expect(result!.text).toBe("second");
      expect(result!.lines).toBe(2);
    });

    test("zero duration", () => {
      storeThinkingContent("106", "test", 1, 0);
      expect(getThinkingContent("106")!.duration_ms).toBe(0);
    });

    test("negative values clamped to 0", () => {
      storeThinkingContent("107", "test", -5, -100);
      const result = getThinkingContent("107");
      expect(result!.lines).toBe(0);
      expect(result!.duration_ms).toBe(0);
    });
  });
});

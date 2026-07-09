/**
 * test/agent-pool/usage.test.ts – Tests for token usage recording.
 *
 * Verifies recordMessageUsage() correctly extracts token counts,
 * cache metrics, and cost data from agent message objects and
 * persists them to the token_usage database table.
 */

import { describe, test, expect } from "bun:test";
import "../helpers.js";

import { initDatabase } from "../../src/db.js";
import { getDb } from "../../src/db/connection.js";
import { recordMessageUsage } from "../../src/agent-pool/usage.js";

describe("recordMessageUsage", () => {
  test("stores usage from a well-formed message", () => {
    initDatabase();
    const db = getDb();

    recordMessageUsage("test:usage-1", {
      role: "assistant",
      usage: {
        input: 100,
        output: 50,
        reasoningTokens: 11,
        cacheRead: 10,
        cacheWrite: 5,
        totalTokens: 165,
        cost: {
          input: 0.001,
          output: 0.002,
          cacheRead: 0.0001,
          cacheWrite: 0.00005,
          total: 0.00315,
        },
      },
      model: "gpt-4o",
      provider: "openai",
      api: "chat",
      timestamp: "2025-06-01T12:00:00Z",
    });

    const row = db.prepare("SELECT * FROM token_usage WHERE chat_jid = ?").get("test:usage-1") as any;
    expect(row).toBeDefined();
    expect(row.input_tokens).toBe(100);
    expect(row.output_tokens).toBe(50);
    expect(row.reasoning_tokens).toBe(11);
    expect(row.total_tokens).toBe(165);
    expect(row.model).toBe("gpt-4o");
    expect(row.run_at).toBe("2025-06-01T12:00:00.000Z");
  });

  test("computes totals when not provided", () => {
    initDatabase();
    const db = getDb();

    recordMessageUsage("test:usage-2", {
      role: "assistant",
      usage: {
        input: 40,
        output: 20,
        cacheRead: 0,
        cacheWrite: 0,
        cost: {},
      },
    });

    const row = db.prepare("SELECT * FROM token_usage WHERE chat_jid = ?").get("test:usage-2") as any;
    expect(row).toBeDefined();
    expect(row.total_tokens).toBe(60); // 40 + 20
    expect(row.cost_total).toBe(0);
  });

  test("skips non-assistant messages", () => {
    initDatabase();
    const db = getDb();

    const before = db.prepare("SELECT COUNT(*) as count FROM token_usage WHERE chat_jid = ?").get("test:usage-skip") as any;
    recordMessageUsage("test:usage-skip", { role: "user", usage: { input: 10 } });
    const after = db.prepare("SELECT COUNT(*) as count FROM token_usage WHERE chat_jid = ?").get("test:usage-skip") as any;
    expect(after.count).toBe(before.count);
  });

  test("skips null/undefined messages", () => {
    // Should not throw
    recordMessageUsage("test:usage-null", null);
    recordMessageUsage("test:usage-null", undefined);
  });

  test("skips messages without usage", () => {
    recordMessageUsage("test:usage-nousage", { role: "assistant" });
    // Should not throw, should not insert
  });

  test("uses current time for invalid timestamp", () => {
    initDatabase();
    const db = getDb();

    recordMessageUsage("test:usage-badts", {
      role: "assistant",
      usage: { input: 1, output: 1 },
      timestamp: "not-a-date",
    });

    const row = db.prepare("SELECT * FROM token_usage WHERE chat_jid = ?").get("test:usage-badts") as any;
    expect(row).toBeDefined();
    // Should have a valid ISO date, not "not-a-date"
    expect(row.run_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test("uses current time when no timestamp", () => {
    initDatabase();
    const db = getDb();
    const before = new Date().toISOString();

    recordMessageUsage("test:usage-nots", {
      role: "assistant",
      usage: { input: 1, output: 1 },
    });

    const row = db.prepare("SELECT * FROM token_usage WHERE chat_jid = ?").get("test:usage-nots") as any;
    expect(row).toBeDefined();
    expect(row.run_at >= before).toBe(true);
  });
});

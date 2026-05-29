/**
 * Test: /new-session eagerly flushes the session header to disk.
 *
 * Verifies that after handleNewSession, the JSONL file exists on disk
 * with a valid session header, even before any assistant message.
 */
import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { SessionManager } from "@earendil-works/pi-coding-agent";
import { handleNewSession } from "../../src/agent-control/handlers/session.js";

describe("/new-session JSONL flush", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "piclaw-new-session-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("creates the JSONL file on disk immediately after /new-session", async () => {
    const sessionDir = join(tempDir, "sessions");
    const sm = SessionManager.create(tempDir, sessionDir);

    // Mock session and runtime that exercise the real SessionManager
    const mockSession = {
      sessionManager: sm,
      sessionFile: sm.getSessionFile(),
      extensionRunner: { hasHandlers: () => false, emit: async () => ({}) },
      dispose: () => {},
      isStreaming: false,
    };

    let newSessionCalled = false;
    const newSm = SessionManager.create(tempDir, sessionDir);
    const newMockSession = {
      sessionManager: newSm,
      sessionFile: newSm.getSessionFile(),
      extensionRunner: { hasHandlers: () => false, emit: async () => ({}) },
      dispose: () => {},
      isStreaming: false,
    };

    const mockRuntime = {
      get session() { return newSessionCalled ? newMockSession : mockSession; },
      cwd: tempDir,
      newSession: async () => {
        newSessionCalled = true;
        return { cancelled: false };
      },
    };

    const result = await handleNewSession(
      mockSession as any,
      mockRuntime as any,
      { type: "new_session", raw: "/new-session" },
    );

    expect(result.status).toBe("success");

    // The new session file should exist on disk
    const filePath = newSm.getSessionFile();
    expect(filePath).toBeTruthy();
    expect(existsSync(filePath!)).toBe(true);

    // File should contain a valid session header
    const content = readFileSync(filePath!, "utf8").trim();
    const lines = content.split("\n");
    expect(lines.length).toBe(1); // just the header
    const header = JSON.parse(lines[0]);
    expect(header.type).toBe("session");
    expect(header.version).toBeDefined();
    expect(header.cwd).toBe(tempDir);
  });

  it("pre-written header does not break SDK persistence when assistant arrives", async () => {
    const sessionDir = join(tempDir, "sessions");

    // Simulate what happens: create SM, write header, then SDK appends
    const sm = SessionManager.create(tempDir, sessionDir);
    const filePath = sm.getSessionFile()!;
    expect(existsSync(filePath)).toBe(false);

    // Write just the header and mark the SDK manager flushed (what our fix does)
    const { writeFileSync, mkdirSync } = await import("node:fs");
    const { dirname } = await import("node:path");
    const header = sm.getHeader();
    expect(header).toBeTruthy();
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(header) + "\n");
    (sm as any).flushed = true;

    // Now the SDK appends messages as it normally would (user + assistant)
    sm.appendMessage({ role: "user", content: "hello" });
    sm.appendMessage({ role: "assistant", content: "hi" });

    // File should exist and be loadable
    expect(existsSync(filePath)).toBe(true);
    const content = readFileSync(filePath, "utf8").trim();
    const allLines = content.split("\n").filter(Boolean);

    // Has the eager header plus entries, and is loadable by the SDK
    const parsed = allLines.map((l) => JSON.parse(l));
    const headers = parsed.filter((e) => e.type === "session");
    const messages = parsed.filter((e) => e.type === "message");

    expect(headers.length).toBe(1);
    // Should have both user and assistant messages
    expect(messages.length).toBe(2);
    expect(messages[0].message.role).toBe("user");
    expect(messages[1].message.role).toBe("assistant");

    // Verify the file can be reopened correctly
    const loaded = SessionManager.open(filePath, sessionDir);
    expect(loaded.getSessionFile()).toBe(filePath);
    expect(loaded.getHeader()?.id).toBe(header!.id);
  });
});

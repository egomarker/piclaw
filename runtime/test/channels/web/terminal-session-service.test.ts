import { beforeEach, expect, test } from "bun:test";

import { WEB_RUNTIME_CONFIG } from "../../../src/core/config.js";
import { createWebSession, deleteExpiredWebSessions, getDb, initDatabase } from "../../../src/db.js";
import { TerminalSessionService } from "../../../src/channels/web/terminal/terminal-session-service.js";

class FakeStream {
  listeners: Array<(chunk: string) => void> = [];

  on(event: "data", listener: (chunk: string) => void) {
    if (event === "data") this.listeners.push(listener);
  }

  emit(chunk: string) {
    for (const listener of this.listeners) listener(chunk);
  }
}

class FakeProcess {
  stdinWrites: string[] = [];
  stdout = new FakeStream();
  stderr = new FakeStream();
  exitListeners: Array<(code: number | null, signal: NodeJS.Signals | null) => void> = [];
  killed = false;

  stdin = {
    write: (chunk: string | Uint8Array) => {
      this.stdinWrites.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
    },
    end: () => {},
  };

  on(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void) {
    if (event === "exit") this.exitListeners.push(listener);
  }

  kill() {
    this.killed = true;
    return true;
  }

  emitExit(code: number | null = 0, signal: NodeJS.Signals | null = null) {
    for (const listener of this.exitListeners) listener(code, signal);
  }
}

beforeEach(() => {
  initDatabase();
  getDb().prepare("DELETE FROM web_sessions").run();
  deleteExpiredWebSessions(new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000));
});

test("terminal session service resolves owner from web session cookie", () => {
  createWebSession("terminal-token", "user-1", 3600, "totp");
  const service = new TerminalSessionService({
    spawnProcess: () => new FakeProcess() as any,
  });

  const req = new Request("https://example.com/terminal/session", {
    headers: { cookie: "piclaw_session=terminal-token" },
  });

  expect(service.resolveOwnerFromRequest(req)).toEqual({ kind: "terminal", token: "terminal-token", userId: "user-1", handoffToken: null });
});

test("terminal session service derives an anonymous owner from the per-client token when allowed", () => {
  const service = new TerminalSessionService({
    spawnProcess: () => new FakeProcess() as any,
  });

  const req = new Request("https://example.com/terminal/session", {
    headers: { "x-piclaw-terminal-client": "anon-client-1" },
  });
  expect(service.resolveOwnerFromRequest(req, true)).toEqual({
    kind: "terminal",
    token: "web-terminal-anon:anon-client-1",
    userId: "default",
    handoffToken: null,
  });
});

test("terminal session service refuses unauthenticated fallback when no per-client token is supplied", () => {
  const service = new TerminalSessionService({
    spawnProcess: () => new FakeProcess() as any,
  });

  const req = new Request("https://example.com/terminal/session");
  expect(service.resolveOwnerFromRequest(req, true)).toBeNull();
});

test("terminal session service passes the configured image protocol into spawned shells", () => {
  const previousProtocol = WEB_RUNTIME_CONFIG.terminalImageProtocol;
  const previousInlineProtocol = process.env.TERM_INLINE_IMAGE_PROTOCOL;
  const spawnedEnvs: NodeJS.ProcessEnv[] = [];

  try {
    WEB_RUNTIME_CONFIG.terminalImageProtocol = "sixel";
    delete process.env.TERM_INLINE_IMAGE_PROTOCOL;

    const service = new TerminalSessionService({
      spawnProcess: (_cwd, env) => {
        spawnedEnvs.push({ ...env });
        return new FakeProcess() as any;
      },
    });
    const ws = {
      data: { kind: "terminal", token: "terminal-config", userId: "user-config", handoffToken: null },
      send: () => {},
    } as any;

    service.attachClient(ws);

    expect(spawnedEnvs).toHaveLength(1);
    expect(spawnedEnvs[0]?.PICLAW_TERMINAL).toBe("1");
    expect(spawnedEnvs[0]?.PICLAW_TERMINAL_IMAGE_PROTOCOL).toBe("sixel");
    expect(spawnedEnvs[0]?.TERM_INLINE_IMAGE_PROTOCOL).toBe("sixel");
  } finally {
    WEB_RUNTIME_CONFIG.terminalImageProtocol = previousProtocol;
    if (previousInlineProtocol === undefined) delete process.env.TERM_INLINE_IMAGE_PROTOCOL;
    else process.env.TERM_INLINE_IMAGE_PROTOCOL = previousInlineProtocol;
  }
});

test("terminal session service spawns one shell per web session and relays IO", () => {
  createWebSession("terminal-io", "user-io", 3600, "totp");
  const processes: FakeProcess[] = [];
  const service = new TerminalSessionService({
    spawnProcess: () => {
      const proc = new FakeProcess();
      processes.push(proc);
      return proc as any;
    },
  });

  const owner = { token: "terminal-io", userId: "user-io" };
  const sent: string[] = [];
  const ws = {
    data: owner,
    send: (payload: string) => sent.push(payload),
  } as any;

  expect(service.getSessionInfo(owner).active).toBe(false);
  service.attachClient(ws);
  expect(processes.length).toBe(1);
  expect(service.getSessionInfo(owner).active).toBe(true);
  expect(service.getSessionInfo(owner).connected_clients).toBe(1);

  service.handleMessage(ws, JSON.stringify({ type: "input", data: "pwd\n" }));
  service.handleMessage(ws, JSON.stringify({ type: "resize", cols: 100, rows: 40 }));

  expect(processes[0].stdinWrites.some((entry) => entry.includes("pwd\n"))).toBe(true);
  expect(processes[0].stdinWrites.some((entry) => entry.includes("stty cols 100 rows 40"))).toBe(false);
  expect(processes[0].stdinWrites.some((entry) => entry.includes("\\033[?25h"))).toBe(false);

  processes[0].stdout.emit("hello from shell\r\n");
  expect(sent.some((payload) => payload.includes("hello from shell"))).toBe(true);

  processes[0].emitExit(0, null);
  expect(service.getSessionInfo(owner).active).toBe(false);
});

test("terminal session handoff ignores already-closing prior clients during takeover", () => {
  createWebSession("terminal-handoff-throws", "user-handoff", 3600, "totp");
  const proc = new FakeProcess();
  const service = new TerminalSessionService({
    spawnProcess: () => proc as any,
  });
  const first = {
    data: { kind: "terminal", token: "terminal-handoff-throws", userId: "user-handoff", handoffToken: null },
    send: () => {},
    close: () => { throw new Error("already closing"); },
  } as any;

  service.attachClient(first);
  const req = new Request("https://example.com/terminal/handoff", {
    method: "POST",
    headers: { cookie: "piclaw_session=terminal-handoff-throws" },
  });
  const handoff = service.createHandoffFromRequest(req);

  const second = {
    data: { kind: "terminal", token: "terminal-handoff-throws", userId: "user-handoff", handoffToken: handoff?.token || null },
    send: () => {},
    close: () => undefined,
  } as any;

  expect(() => service.attachClient(second)).not.toThrow();
  expect(service.getSessionInfo({ token: "terminal-handoff-throws", userId: "user-handoff" }).connected_clients).toBe(1);
});

test("terminal session handoff tokens are issued for live sessions and close prior clients on takeover", () => {
  createWebSession("terminal-handoff", "user-handoff", 3600, "totp");
  const proc = new FakeProcess();
  const service = new TerminalSessionService({
    spawnProcess: () => proc as any,
  });
  const closes: string[] = [];
  const first = {
    data: { kind: "terminal", token: "terminal-handoff", userId: "user-handoff", handoffToken: null },
    send: () => {},
    close: () => closes.push("first"),
  } as any;

  service.attachClient(first);
  const req = new Request("https://example.com/terminal/handoff", {
    method: "POST",
    headers: { cookie: "piclaw_session=terminal-handoff" },
  });
  const handoff = service.createHandoffFromRequest(req);
  expect(handoff?.token).toBeTruthy();

  const second = {
    data: { kind: "terminal", token: "terminal-handoff", userId: "user-handoff", handoffToken: handoff?.token || null },
    send: () => {},
    close: () => closes.push("second"),
  } as any;

  service.attachClient(second);
  expect(closes).toEqual(["first"]);
  expect(service.getSessionInfo({ token: "terminal-handoff", userId: "user-handoff" }).connected_clients).toBe(1);
});

test("terminal session service ignores input from detached clients during reconnect grace", () => {
  createWebSession("terminal-detached", "user-detached", 3600, "totp");
  const proc = new FakeProcess();
  const service = new TerminalSessionService({
    spawnProcess: () => proc as any,
    reconnectGraceMs: 1_000,
  });
  const ws = {
    data: { kind: "terminal", token: "terminal-detached", userId: "user-detached", handoffToken: null },
    send: () => {},
  } as any;

  service.attachClient(ws);
  service.detachClient(ws);

  expect(service.getSessionInfo({ token: "terminal-detached", userId: "user-detached" }).active).toBe(true);
  expect(service.getSessionInfo({ token: "terminal-detached", userId: "user-detached" }).connected_clients).toBe(0);

  service.handleMessage(ws, JSON.stringify({ type: "input", data: "whoami\n" }));
  expect(proc.stdinWrites).toEqual([]);
});

test("terminal session shutdown kills live shells", () => {
  const proc = new FakeProcess();
  const service = new TerminalSessionService({
    spawnProcess: () => proc as any,
  });
  const owner = { token: "terminal-shutdown", userId: "user-shutdown" };
  const ws = {
    data: owner,
    send: () => {},
  } as any;

  service.attachClient(ws);
  service.shutdown();
  expect(proc.killed).toBe(true);
});

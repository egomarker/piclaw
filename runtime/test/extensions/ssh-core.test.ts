import { afterEach, describe, expect, test } from "bun:test";
import { EventEmitter } from "node:events";
import { execFileSync } from "node:child_process";
import { PassThrough, Writable } from "node:stream";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import sshCoreExtension, {
  applyLiveSshConfig,
  createChatSshCoreExtension,
  createSshCoreExtension,
  hasLiveChatSshSession,
  parseSshFlag,
  parseSshPort,
  parseStrictHostKeyCheckingMode,
  registerLiveChatSshSession,
  resolveRemoteTarget,
  setSshConnectionResolverForTests,
  unregisterLiveChatSshSession,
} from "../../extensions/integrations/ssh-core/index.ts";
import {
  buildScopedBashCommand,
  PersistentRemoteShell,
  setPersistentSshInterruptGraceMsForTests,
  setPersistentSshSpawnForTests,
} from "../../src/extensions/ssh-core.js";

type FakeState = {
  tools: Map<string, any>;
  flags: Map<string, any>;
  handlers: Map<string, (...args: any[]) => any>;
  flagValues: Map<string, string | undefined>;
};

function createFakeApi(flagEntries?: Record<string, string | undefined>): { api: ExtensionAPI; state: FakeState } {
  const state: FakeState = {
    tools: new Map<string, any>(),
    flags: new Map<string, any>(),
    handlers: new Map<string, (...args: any[]) => any>(),
    flagValues: new Map(Object.entries(flagEntries ?? {})),
  };

  const api: ExtensionAPI = {
    on(event: string, handler: (...args: any[]) => any) { state.handlers.set(event, handler); },
    registerTool(tool: any) {
      state.tools.set(tool.name, tool);
    },
    registerCommand() {},
    registerShortcut() {},
    registerFlag(name: string, options: any) {
      state.flags.set(name, options);
    },
    getFlag(name: string) { return state.flagValues.get(name); },
    registerMessageRenderer() {},
    sendMessage() {},
    sendUserMessage() {},
    appendEntry() {},
    setSessionName() {},
    getSessionName() { return undefined; },
    setLabel() {},
    exec: async () => ({ exitCode: 0, stdout: "", stderr: "" }),
    getActiveTools: () => [],
    getAllTools: () => [],
    setActiveTools() {},
    getCommands: () => [],
    setModel: async () => true,
    getThinkingLevel: () => "off" as any,
    setThinkingLevel() {},
    registerProvider() {},
    unregisterProvider() {},
  } as unknown as ExtensionAPI;

  return { api, state };
}

class FakeSshChild extends EventEmitter {
  stdinWrites: string[] = [];
  stdout = new PassThrough();
  stderr = new PassThrough();
  killed = false;
  killCalls = 0;
  stdin = new Writable({
    write: (chunk, _encoding, callback) => {
      this.stdinWrites.push(Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk));
      callback();
    },
  });

  kill(): boolean {
    this.killed = true;
    this.killCalls += 1;
    queueMicrotask(() => this.emit("close", null));
    return true;
  }
}

const fakeConnection = {
  sshTarget: "agent@example.com",
  port: 22,
  remoteCwd: "/srv/project",
  remoteHome: "/home/agent",
  localCwd: "/workspace",
  localHome: "/home/agent",
  privateKeyPath: "/tmp/test-key",
  controlPath: "/tmp/test-control",
  strictHostKeyChecking: "yes" as const,
  tempDir: "/tmp/piclaw-ssh-test",
};

afterEach(() => {
  setPersistentSshSpawnForTests(null);
  setPersistentSshInterruptGraceMsForTests(null);
  setSshConnectionResolverForTests(null);
});

describe("ssh-core helpers", () => {
  test("parseSshFlag handles remote host and explicit remote path", () => {
    expect(parseSshFlag("user@example.com")).toEqual({ remote: "user@example.com" });
    expect(parseSshFlag("user@example.com:/srv/app")).toEqual({ remote: "user@example.com", remotePath: "/srv/app" });
    expect(parseSshFlag("host:~/repo")).toEqual({ remote: "host", remotePath: "~/repo" });
  });

  test("resolveRemoteTarget uses username fallback when target omits it", () => {
    expect(resolveRemoteTarget("example.com:/srv/app", "alice")).toEqual({
      sshTarget: "alice@example.com",
      remotePath: "/srv/app",
    });
  });

  test("buildScopedBashCommand wraps commands in a clean bash scope and env", () => {
    expect(buildScopedBashCommand("echo hi")).toContain("bash --noprofile --norc -lc 'echo hi'");
    expect(buildScopedBashCommand("echo $TOKEN", { TOKEN: "secret", USERNAME: "alice" })).toContain(
      "env TOKEN='secret' USERNAME='alice' bash --noprofile --norc -lc 'echo $TOKEN'"
    );
  });

  test("buildScopedBashCommand preserves commands that contain single quotes", () => {
    const scoped = buildScopedBashCommand("printf 'ok:%s' 'quoted'");
    const output = execFileSync("bash", ["-lc", `if true; then ${scoped}; fi`], { encoding: "utf8" });
    expect(output).toBe("ok:quoted");
  });

  test("parseSshPort and host key mode validate inputs", () => {
    expect(parseSshPort(undefined)).toBe(22);
    expect(parseSshPort("2222")).toBe(2222);
    expect(parseStrictHostKeyCheckingMode(undefined)).toBe("yes");
    expect(parseStrictHostKeyCheckingMode("accept-new")).toBe("accept-new");
    expect(() => parseSshPort("0")).toThrow();
    expect(() => parseStrictHostKeyCheckingMode("maybe")).toThrow();
  });
});

describe("ssh-core persistent shell", () => {
  test("hard-stops a wedged command after timeout", async () => {
    const child = new FakeSshChild();
    let capturedArgs: string[] = [];
    setPersistentSshSpawnForTests((args) => {
      capturedArgs = args;
      return child as unknown as any;
    });
    setPersistentSshInterruptGraceMsForTests(10);

    const shell = new PersistentRemoteShell(fakeConnection as any);
    const result = shell.exec("sleep 99", "/workspace", { onData() {}, timeout: 0.01 });

    await expect(result).rejects.toThrow("timeout:0.01");
    expect(capturedArgs).toEqual(expect.arrayContaining([
      "-o", "ConnectTimeout=10",
      "-o", "ConnectionAttempts=1",
      "-o", "ServerAliveInterval=15",
      "-o", "ServerAliveCountMax=2",
    ]));
    expect(child.stdinWrites.some((value) => value.includes("\x03"))).toBe(true);
    expect(child.killCalls).toBeGreaterThanOrEqual(1);
  });

  test("hard-stops a wedged command after abort", async () => {
    const child = new FakeSshChild();
    setPersistentSshSpawnForTests(() => child as unknown as any);
    setPersistentSshInterruptGraceMsForTests(10);

    const shell = new PersistentRemoteShell(fakeConnection as any);
    const controller = new AbortController();
    const result = shell.exec("sleep 99", "/workspace", { onData() {}, signal: controller.signal, timeout: 60 });
    controller.abort();

    await expect(result).rejects.toThrow("aborted");
    expect(child.stdinWrites.some((value) => value.includes("\x03"))).toBe(true);
    expect(child.killCalls).toBeGreaterThanOrEqual(1);
  });
});

describe("ssh-core live state", () => {
  test("applies SSH config immediately for a registered live chat session", async () => {
    setSshConnectionResolverForTests(async (_rawTarget, localCwd, localHome, port) => ({
      sshTarget: "agent@example.com",
      port,
      remoteCwd: "/srv/project",
      remoteHome: "/home/agent",
      localCwd,
      localHome,
      privateKeyPath: "/tmp/test-key",
      controlPath: "/tmp/test-control",
      strictHostKeyChecking: "yes",
      tempDir: "/tmp/piclaw-ssh-test",
    }) as any);

    await registerLiveChatSshSession("web:default", { localCwd: "/workspace", localHome: "/home/agent" });
    expect(hasLiveChatSshSession("web:default")).toBe(true);

    const connection = await applyLiveSshConfig("web:default", {
      target: "agent@example.com:/srv/project",
      port: 22,
      privateKeyKeychain: "ssh-prod",
      strictHostKeyChecking: "yes",
    });

    expect(connection.remoteCwd).toBe("/srv/project");

    await unregisterLiveChatSshSession("web:default");
    setSshConnectionResolverForTests(null);
    expect(hasLiveChatSshSession("web:default")).toBe(false);
  });
});

describe("ssh-core extension registration", () => {
  test("registers core tool overrides and SSH flags", () => {
    const fake = createFakeApi();

    sshCoreExtension(fake.api);

    expect(Array.from(fake.state.tools.keys())).toEqual(["read", "write", "edit", "bash"]);
    expect(fake.state.flags.has("ssh")).toBe(true);
    expect(fake.state.flags.has("ssh-port")).toBe(true);
    expect(fake.state.flags.has("p")).toBe(true);
    expect(fake.state.flags.has("ssh-keychain")).toBe(true);
    expect(fake.state.flags.has("ssh-known-hosts-keychain")).toBe(true);
    expect(fake.state.flags.has("ssh-strict-host-key-checking")).toBe(true);
  });

  test("session_start shows progress UI for configured SSH bootstrap", async () => {
    const fake = createFakeApi();
    const uiCalls = {
      messages: [] as Array<string | undefined>,
      indicators: [] as Array<{ frames?: string[]; intervalMs?: number } | undefined>,
      statuses: [] as Array<[string, string | undefined]>,
      notifications: [] as Array<[string, string | undefined]>,
    };
    const ui = {
      setWorkingMessage(message?: string) { uiCalls.messages.push(message); },
      setWorkingIndicator(options?: { frames?: string[]; intervalMs?: number }) { uiCalls.indicators.push(options); },
      setStatus(key: string, value: string | undefined) { uiCalls.statuses.push([key, value]); },
      notify(message: string, level?: string) { uiCalls.notifications.push([message, level]); },
      theme: { fg: (_color: string, text: string) => `accent:${text}` },
    };

    setSshConnectionResolverForTests(async (_rawTarget, localCwd, localHome, port) => ({
      sshTarget: "agent@example.com",
      port,
      remoteCwd: "/srv/project",
      remoteHome: "/home/agent",
      localCwd,
      localHome,
      privateKeyPath: "/tmp/test-key",
      controlPath: "/tmp/test-control",
      strictHostKeyChecking: "yes",
      tempDir: "/tmp/piclaw-ssh-test",
    }) as any);

    createSshCoreExtension({
      target: "agent@example.com:/srv/project",
      port: 22,
      privateKeyKeychain: "ssh/piclaw",
      strictHostKeyChecking: "yes",
    })(fake.api);

    await fake.state.handlers.get("session_start")?.({}, { hasUI: true, ui });

    expect(uiCalls.messages[0]).toBe("SSH: connecting to agent@example.com:/srv/project…");
    expect(uiCalls.indicators[0]).toEqual({
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      intervalMs: 90,
    });
    expect(uiCalls.statuses).toContainEqual(["ssh-core", "accent:SSH agent@example.com:/srv/project (port 22)"]);
    expect(uiCalls.notifications).toContainEqual(["ssh-core enabled: agent@example.com:/srv/project (port 22)", "info"]);
    expect(uiCalls.messages[uiCalls.messages.length - 1]).toBeUndefined();
    expect(uiCalls.indicators[uiCalls.indicators.length - 1]).toEqual({ frames: [] });
  });

  test("before_agent_start uses systemPromptOptions.cwd for configured SSH sessions", async () => {
    const fake = createFakeApi();

    setSshConnectionResolverForTests(async (_rawTarget, localCwd, localHome, port) => ({
      sshTarget: "agent@example.com",
      port,
      remoteCwd: "/srv/project",
      remoteHome: "/home/agent",
      localCwd,
      localHome,
      privateKeyPath: "/tmp/test-key",
      controlPath: "/tmp/test-control",
      strictHostKeyChecking: "yes",
      tempDir: "/tmp/piclaw-ssh-test",
    }) as any);

    createSshCoreExtension({
      target: "agent@example.com:/srv/project",
      port: 22,
      privateKeyKeychain: "ssh/piclaw",
      strictHostKeyChecking: "yes",
    })(fake.api);

    await fake.state.handlers.get("session_start")?.({}, { hasUI: false });

    const result = await fake.state.handlers.get("before_agent_start")?.({
      systemPrompt: "Current working directory: /workspace/branches/demo",
      systemPromptOptions: { cwd: "/workspace/branches/demo" },
    });

    expect(result).toEqual({
      systemPrompt: "Current working directory: /srv/project (via SSH agent@example.com, port 22)",
    });
  });

  test("chat session lifecycle logs shutdown metadata and unregisters live state", async () => {
    const fake = createFakeApi();
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => { logs.push(args.map((value) => String(value)).join(" ")); };

    try {
      setSshConnectionResolverForTests(async (_rawTarget, localCwd, localHome, port) => ({
        sshTarget: "agent@example.com",
        port,
        remoteCwd: "/srv/project",
        remoteHome: "/home/agent",
        localCwd,
        localHome,
        privateKeyPath: "/tmp/test-key",
        controlPath: "/tmp/test-control",
        strictHostKeyChecking: "yes",
        tempDir: "/tmp/piclaw-ssh-test",
      }) as any);

      createChatSshCoreExtension("web:test", {
        target: "agent@example.com:/srv/project",
        port: 22,
        privateKeyKeychain: "ssh/piclaw",
        strictHostKeyChecking: "yes",
      })(fake.api);

      await fake.state.handlers.get("session_start")?.({}, { hasUI: false });
      expect(hasLiveChatSshSession("web:test")).toBe(true);

      const beforeAgentStart = await fake.state.handlers.get("before_agent_start")?.({
        systemPrompt: "Current working directory: /workspace/branches/chat-demo",
        systemPromptOptions: { cwd: "/workspace/branches/chat-demo" },
      });
      expect(beforeAgentStart).toEqual({
        systemPrompt: "Current working directory: /srv/project (via SSH agent@example.com, port 22)",
      });

      await fake.state.handlers.get("session_shutdown")?.({
        type: "session_shutdown",
        reason: "fork",
        targetSessionFile: "/tmp/forked-session.jsonl",
      });

      expect(hasLiveChatSshSession("web:test")).toBe(false);
      expect(logs.some((entry) => entry.includes("[ssh-core] session shutdown (fork) → /tmp/forked-session.jsonl"))).toBe(true);
    } finally {
      console.log = originalLog;
      await unregisterLiveChatSshSession("web:test");
    }
  });
});

import { describe, expect, test } from "bun:test";
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createAssistantMessageEventStream, InMemoryCredentialStore, InMemoryModelsStore } from "@earendil-works/pi-ai";
import { createAgentSession, createAgentSessionRuntime, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager } from "@earendil-works/pi-coding-agent";
import { createSessionInDir } from "../../src/agent-pool/session.js";
import { mcpAdapterExtension } from "../../src/extensions/mcp-adapter.js";
import { getMcpToolTimeoutMs } from "../../src/extensions/mcp-timeout-patch.js";
import { clearHydratedMcpCredentials, hydrateMcpKeychainCredentials } from "../../src/secure/mcp-keychain.js";
import { setEnv } from "../helpers.js";

const fixture = resolve(import.meta.dir, "../fixtures/mcp-compat-server.mjs");
const sentinel = "fixture-only-http-token";
type Mode = "stdio" | "http";
type Event = { event: string; pid: number; at: number; tag?: string; url?: string; [key: string]: unknown };
function readEvents(path: string): Event[] {
  return existsSync(path) ? readFileSync(path, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line)) : [];
}
async function waitFor(predicate: () => boolean, label: string, timeout = 8000) {
  const deadline = Date.now() + timeout;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error(`Fixture wait expired: ${label}`);
    await Bun.sleep(10);
  }
}
function alive(pid: number) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}
function text(result: any) {
  return result.content.filter((block: any) => block.type === "text").map((block: any) => block.text).join("\n");
}

async function scenario(options: { mode: Mode; outer?: number; native?: number; bind?: boolean; startupDelay?: number; directEnv?: string; hosted?: boolean }) {
  const root = mkdtempSync(join(process.env.PICLAW_MCP_TEST_EVIDENCE_DIR ?? tmpdir(), `piclaw-mcp-${options.mode}-`));
  const workspace = join(root, "workspace");
  const agentDir = join(root, "agent");
  for (const path of [workspace, join(workspace, ".pi"), join(workspace, ".piclaw"), agentDir, join(root, "home")]) mkdirSync(path, { recursive: true });
  const logPath = join(root, "server.jsonl");
  const configPath = join(workspace, ".piclaw", "config.json");
  const writeDeadline = (value?: number) => writeFileSync(configPath, JSON.stringify(value === undefined ? {} : { domains: { tools: { mcpToolTimeoutMs: value } } }));
  writeDeadline(options.outer);
  const previousCwd = process.cwd();
  const restoreEnv = setEnv({
    HOME: join(root, "home"), PI_CODING_AGENT_DIR: agentDir, PICLAW_PI_AGENT_DIR: agentDir,
    PICLAW_WORKSPACE: workspace, PICLAW_CONFIG_PATH: configPath,
    PICLAW_MCP_TOOL_TIMEOUT_MS: undefined, MCP_DIRECT_TOOLS: options.directEnv,
    PICLAW_MCP_FIXTURE_VALUE: "fixture-env-value", PICLAW_MCP_FIXTURE_TOKEN: undefined,
    PI_MCP_ADAPTER_TEST_AUTH_STORE: "memory",
  });
  process.chdir(workspace);
  let child: ReturnType<typeof Bun.spawn> | undefined;
  let runtime: Awaited<ReturnType<typeof createAgentSessionRuntime>> | undefined;
  let hydrated: Awaited<ReturnType<typeof hydrateMcpKeychainCredentials>> = [];
  const events = () => readEvents(logPath);
  const finish = async () => {
    try {
      await runtime?.dispose();
    } finally {
      try {
        if (child) { child.kill(); await child.exited; }
        clearHydratedMcpCredentials(hydrated);
        const pids = [...new Set(events().filter((event) => event.event === "process_start").map((event) => event.pid))];
        await waitFor(() => pids.every((pid) => !alive(pid)), "fixture processes exited", 3000);
        const alivePids = pids.filter(alive);
        writeFileSync(join(root, "report.json"), JSON.stringify({ options, pids, alivePids, events: events(), credentialsCleared: process.env.PICLAW_MCP_FIXTURE_TOKEN === undefined }, null, 2));
        expect(alivePids).toEqual([]);
        expect(events().filter((event) => event.event === "unhandled_rejection")).toEqual([]);
        expect(events().filter((event) => event.event === "sdk_extension_error")).toEqual([]);
      } finally {
        process.chdir(previousCwd);
        restoreEnv();
      }
    }
  };
  try {
    let definition: Record<string, unknown> = {
      command: process.execPath, args: [fixture, "stdio", logPath, String(options.startupDelay ?? 0)], lifecycle: "eager", directTools: true,
      env: { MCP_FROM_BRACES: "${PICLAW_MCP_FIXTURE_VALUE}", MCP_FROM_ENV_PREFIX: "$env:PICLAW_MCP_FIXTURE_VALUE", MCP_FROM_ADAPTER_FORM: "{env:PICLAW_MCP_FIXTURE_VALUE}", MCP_PLAIN_LITERAL: "$PICLAW_MCP_FIXTURE_VALUE", MCP_ESCAPED_BANG: "!!${PICLAW_MCP_FIXTURE_VALUE}" },
    };
    if (options.mode === "http") {
      child = Bun.spawn([process.execPath, fixture, "http", logPath], {
        env: { PATH: process.env.PATH!, HOME: join(root, "home"), MCP_HTTP_AUTH_TOKEN: sentinel }, stdout: "ignore", stderr: "inherit",
      });
      await waitFor(() => events().some((event) => event.event === "http_listen"), "HTTP listener");
      definition = {
        url: events().find((event) => event.event === "http_listen")!.url, lifecycle: "eager", directTools: true, auth: "bearer",
        bearerTokenKeychain: "mcp/pi99-fixture", bearerTokenEnv: "PICLAW_MCP_FIXTURE_TOKEN",
        headers: { "X-Fixture-Token": "${PICLAW_MCP_FIXTURE_TOKEN}" },
      };
    }
    const config = { settings: { requestTimeoutMs: options.native ?? 8000, enableProxyTool: "always", idleTimeout: 0, showStatusIcon: false }, mcpServers: { fixture: definition } };
    const mcpConfigPath = join(workspace, ".pi", "mcp.json");
    writeFileSync(mcpConfigPath, JSON.stringify(config));
    const model: any = { id: "fixture", name: "MCP phase3 fixture", provider: "mcp-phase3-fixture", api: "openai-responses", baseUrl: "https://invalid.example/no-network", reasoning: false, input: ["text", "image"], contextWindow: 100000, maxTokens: 1024, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } };
    const credentials = new InMemoryCredentialStore();
    await credentials.modify(model.provider, () => ({ type: "api_key", key: "fixture-only" }));
    const modelRuntime = await ModelRuntime.create({ credentials, modelsStore: new InMemoryModelsStore(), modelsPath: null, allowModelNetwork: false });
    let script: Array<{ name: string; args: Record<string, unknown> }> = [];
    let calls = 0;
    const stream = () => {
      const entry = script.shift();
      const message: any = { role: "assistant", api: model.api, provider: model.provider, model: model.id, content: entry ? [{ type: "toolCall", id: `fixture-${++calls}`, name: entry.name, arguments: entry.args }] : [{ type: "text", text: "fixture complete" }], stopReason: entry ? "toolUse" : "stop", usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, totalTokens: 2, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } }, timestamp: Date.now() };
      const output = createAssistantMessageEventStream();
      queueMicrotask(() => { output.push({ type: "done", reason: message.stopReason, message }); output.end(); });
      return output;
    };
    modelRuntime.registerNativeProvider({ id: model.provider, name: model.name, auth: { apiKey: { name: "Fixture", resolve: async ({ credential }: any) => credential?.key ? { auth: { apiKey: credential.key }, source: "fixture" } : undefined } }, getModels: () => [model], stream, streamSimple: stream });
    const settingsManager = SettingsManager.inMemory({ defaultProvider: model.provider, defaultModel: model.id, packages: [], extensions: [], cacheWarming: "off", compaction: { enabled: false }, retry: { enabled: false } });
    const observeLifecycle: typeof mcpAdapterExtension = (pi) => {
      pi.on("session_start", (_event, ctx) => { appendFileSync(logPath, JSON.stringify({ event: "sdk_session_start", pid: process.pid, at: Date.now(), cwd: ctx.cwd }) + "\n"); });
      pi.on("session_shutdown", () => { appendFileSync(logPath, JSON.stringify({ event: "sdk_session_shutdown", pid: process.pid, at: Date.now() }) + "\n"); });
    };
    if (options.hosted) {
      runtime = await createSessionInDir(join(root, "sessions"), { modelRuntime, settingsManager, tools: [], extensionFactories: [observeLifecycle] });
    } else {
      const resourceLoader = new DefaultResourceLoader({ cwd: workspace, agentDir, settingsManager, extensionFactories: [mcpAdapterExtension, observeLifecycle], noSkills: true, noPromptTemplates: true, noThemes: true, agentsFilesOverride: () => ({ agentsFiles: [] }), systemPromptOverride: () => "Isolated MCP compatibility fixture." });
      await resourceLoader.reload();
      runtime = await createAgentSessionRuntime(async ({ sessionManager }) => ({
        ...await createAgentSession({ cwd: workspace, agentDir, model, thinkingLevel: "off", modelRuntime, settingsManager, resourceLoader, sessionManager }),
        services: { cwd: workspace, agentDir, modelRuntime, settingsManager, resourceLoader, diagnostics: [] },
      }), { cwd: workspace, agentDir, sessionManager: SessionManager.inMemory(workspace) });
    }
    const loader = runtime.services.resourceLoader;
    appendFileSync(logPath, JSON.stringify({ event: "extensions_loaded", pid: process.pid, at: Date.now(), paths: loader.getExtensions().extensions.map((extension) => extension.path) }) + "\n");
    expect(loader.getExtensions().errors).toEqual([]);
    if (options.mode === "http") expect(events().filter((event) => event.event === "http_request")).toHaveLength(0);
    const session = runtime.session;
    // Hydrate AFTER factory loading: deferred startup must use runtime credentials.
    if (options.mode === "http") hydrated = await hydrateMcpKeychainCredentials(workspace, async (name) => ({ name, type: "token", secret: sentinel, username: null }));
    const bind = async () => {
      await session.bindExtensions({ onError: (error) => {
        appendFileSync(logPath, JSON.stringify({ event: "sdk_extension_error", pid: process.pid, at: Date.now(), error }) + "\n");
      } });
      if (!options.startupDelay) await waitFor(() => !!session.getToolDefinition("fixture_echo"), "live direct tools");
    };
    if (options.bind !== false) await bind();
    const invoke = (name: string, params: Record<string, unknown>, signal?: AbortSignal) => {
      const tool = session.getToolDefinition(name);
      if (!tool) throw new Error(`Missing fixture tool: ${name}`);
      return tool.execute(`manual-${++calls}`, params, signal, undefined, session.extensionRunner.createContext());
    };
    const turn = async (sequence: typeof script) => {
      const previous = session.messages.length;
      script = [...sequence];
      await session.prompt("Execute the fixture sequence.");
      return session.messages.slice(previous).filter((message: any) => message.role === "toolResult") as any[];
    };
    return { root, session, loader, events, bind, invoke, turn, finish, writeDeadline, mcpConfigPath };
  } catch (error) {
    await finish();
    throw error;
  }
}

// Fresh SDK sessions, native transports, and public tool definitions only.
// Scenario evidence is retained; no live workspace/server/config is used.
describe("Pi 0.99 MCP compatibility", () => {
  test.each(["stdio", "http"] as const)("%s: proxy/direct turns preserve mixed, structured-only, error, and empty results", async (mode) => {
    const fixture = await scenario({ mode, outer: 5000 });
    try {
      const results = await fixture.turn([
        { name: "mcp", args: { tool: "fixture_echo", args: { text: "proxy" } } },
        { name: "fixture_echo", args: { text: "direct" } },
        { name: "mcp", args: { tool: "fixture_results", args: { kind: "mixed" } } },
        { name: "fixture_results", args: { kind: "mixed" } },
        { name: "mcp", args: { tool: "fixture_results", args: { kind: "structured" } } },
        { name: "fixture_results", args: { kind: "structured" } },
        { name: "mcp", args: { tool: "fixture_results", args: { kind: "error" } } },
        { name: "fixture_results", args: { kind: "error" } },
        { name: "fixture_results", args: { kind: "empty" } },
      ]);
      expect(results).toHaveLength(9);
      expect(text(results[0])).toBe("echo:proxy");
      expect(results[0].details.mcpResult.structuredContent).toEqual({ echoed: "proxy" });
      expect(text(results[1])).toBe("echo:direct");
      for (const index of [2, 3]) {
        expect(results[index].content.some((block: any) => block.type === "image" && block.mimeType === "image/png")).toBe(true);
        expect(text(results[index])).toContain("mixed:fixture");
      }
      for (const index of [4, 5]) expect(text(results[index])).toContain('"answer": 42');
      for (const index of [6, 7]) { expect(results[index].isError).toBe(true); expect(text(results[index])).toContain("fixture-tool-error"); }
      expect(results[8].isError).toBe(false);
      expect(text(results[8])).toContain("empty");
      // MCP client v2's stdio negotiation creates one disposable probe sibling.
      expect(fixture.events().filter((event) => event.event === "process_start")).toHaveLength(mode === "stdio" ? 2 : 1);
      expect(fixture.events().filter((event) => event.event === "process_start" && alive(event.pid))).toHaveLength(1);
      expect(fixture.events().filter((event) => event.event === "sdk_session_start")).toHaveLength(1);
      if (mode === "stdio") {
        const env = await fixture.invoke("mcp", { tool: "fixture_results", args: { kind: "env" } });
        expect((env.details as any).mcpResult.structuredContent).toEqual({ braces: "fixture-env-value", envPrefix: "fixture-env-value", adapterForm: "fixture-env-value", plain: "$PICLAW_MCP_FIXTURE_VALUE", escapedBang: "!fixture-env-value" });
      } else {
        const requests = fixture.events().filter((event) => event.event === "http_request");
        expect(requests.length).toBeGreaterThan(0);
        expect(requests.every((event) => event.authorized && event.headerExpanded)).toBe(true);
        expect(readFileSync(fixture.mcpConfigPath, "utf8")).not.toContain(sentinel);
      }
    } finally { await fixture.finish(); }
  }, 20000);

  test.each([
    { mode: "stdio", name: "mcp", outer: 150, native: 2000, winner: "outer" },
    { mode: "stdio", name: "fixture_slow", outer: 150, native: 2000, winner: "outer" },
    { mode: "http", name: "mcp", outer: 200, native: 2000, winner: "outer" },
    { mode: "http", name: "fixture_slow", outer: 200, native: 2000, winner: "outer" },
    { mode: "stdio", name: "mcp", outer: 6000, native: 3000, winner: "native" },
    { mode: "http", name: "fixture_slow", outer: 6000, native: 3000, winner: "native" },
    { mode: "stdio", name: "mcp", outer: 0, native: 3000, winner: "native" },
    { mode: "http", name: "fixture_slow", outer: 0, native: 3000, winner: "native" },
    { mode: "stdio", name: "mcp", outer: undefined, native: 3000, winner: "native" },
  ] as const)("deadline matrix: %j", async ({ mode, name, outer, native, winner }) => {
    const fixture = await scenario({ mode, outer, native });
    try {
      expect(getMcpToolTimeoutMs()).toBe(outer === 0 ? null : outer ?? 120000);
      const tag = `${name}-${winner}`;
      const args = { delayMs: 9000, tag };
      const start = performance.now();
      const outcome = await fixture.invoke(name, name === "mcp" ? { tool: "fixture_slow", args } : args).then((value) => ({ value, error: undefined }), (error) => ({ value: undefined, error }));
      const elapsed = performance.now() - start;
      if (winner === "outer") {
        expect(outcome.error?.message).toContain("MCP tool call timed out");
        expect(elapsed).toBeLessThan(native - 300);
      } else {
        expect(outcome.error).toBeUndefined();
        expect(text(outcome.value)).toMatch(/timed out/i);
        expect(elapsed).toBeGreaterThan(native - 150);
        if (outer) expect(elapsed).toBeLessThan(outer - 300);
      }
      await waitFor(() => fixture.events().some((event) => event.event === "slow_abort" && event.tag === tag), "transport cancellation");
      expect(fixture.events().some((event) => event.event === "slow_complete" && event.tag === tag)).toBe(false);
      expect(fixture.events().filter((event) => event.event === "progress" && event.tag === tag).length).toBeGreaterThan(1);
    } finally { await fixture.finish(); }
  }, 15000);

  test.each(["stdio", "http"] as const)("%s: caller abort and pre-abort cancel without starting a later request", async (mode) => {
    const fixture = await scenario({ mode, outer: 0, native: 3000 });
    try {
      const caller = new AbortController();
      const args = { delayMs: 3000, tag: "caller-abort" };
      const outcome = fixture.invoke("fixture_slow", args, caller.signal).then((value) => ({ value, error: undefined }), (error) => ({ value: undefined, error }));
      await waitFor(() => fixture.events().some((event) => event.event === "slow_start" && event.tag === args.tag), "slow call started");
      caller.abort("fixture caller stopped");
      expect((await outcome).error?.message).toContain("MCP tool call aborted");
      await waitFor(() => fixture.events().some((event) => event.event === "slow_abort" && event.tag === args.tag), "caller cancellation reached transport");
      const pre = new AbortController();
      pre.abort();
      await expect(fixture.invoke("mcp", { tool: "fixture_slow", args: { ...args, tag: "pre-abort" } }, pre.signal)).rejects.toThrow("MCP tool call aborted");
      expect(fixture.events().some((event) => event.event === "slow_start" && event.tag === "pre-abort")).toBe(false);
    } finally { await fixture.finish(); }
  }, 15000);

  test("legacy env overrides domain config and the deadline covers initialization wait", async () => {
    const fixture = await scenario({ mode: "stdio", outer: 5000, native: 3000, startupDelay: 1000 });
    try {
      await waitFor(() => fixture.events().some((event) => event.event === "initialize_wait"), "pending native initialization");
      process.env.PICLAW_MCP_TOOL_TIMEOUT_MS = "100";
      expect(getMcpToolTimeoutMs()).toBe(100);
      await expect(fixture.invoke("mcp", { connect: "fixture" })).rejects.toThrow("MCP tool call timed out");
      expect(fixture.events().filter((event) => event.event === "echo_call")).toEqual([]);
    } finally { await fixture.finish(); }
  }, 15000);

  test("SDK load/prewarm stays dormant; start/reload each own one eager worker plus the native probe", async () => {
    const fixture = await scenario({ mode: "stdio", outer: 5000, bind: false });
    try {
      await Bun.sleep(1200);
      expect(fixture.events().filter((event) => event.event === "process_start")).toHaveLength(0);
      await fixture.bind();
      expect(fixture.events().filter((event) => event.event === "process_start")).toHaveLength(2);
      expect(fixture.events().filter((event) => event.event === "process_start" && alive(event.pid))).toHaveLength(1);
      expect(text(await fixture.invoke("fixture_echo", { text: "before-reload" }))).toBe("echo:before-reload");
      await fixture.session.reload();
      await waitFor(() => !!fixture.session.getToolDefinition("fixture_echo"), "direct tools after reload");
      expect(text(await fixture.invoke("mcp", { tool: "fixture_echo", args: { text: "after-reload" } }))).toBe("echo:after-reload");
      expect(fixture.events().filter((event) => event.event === "process_start")).toHaveLength(4);
      expect(fixture.events().filter((event) => event.event === "sdk_session_start")).toHaveLength(2);
      expect(fixture.events().filter((event) => event.event === "process_start" && alive(event.pid))).toHaveLength(1);
      const oldPids = fixture.events().filter((event) => event.event === "process_start").slice(0, 2).map((event) => event.pid);
      await waitFor(() => oldPids.every((pid) => !alive(pid)), "old probe and worker reaped at reload");
    } finally { await fixture.finish(); }
  }, 20000);

  test("Piclaw's production session loader owns one decorated adapter, without a stock duplicate", async () => {
    const fixture = await scenario({ mode: "stdio", outer: 180, native: 2000, bind: false, hosted: true });
    try {
      await Bun.sleep(1200);
      expect(fixture.events().filter((event) => event.event === "process_start")).toHaveLength(0);
      expect(fixture.session.getAllTools().filter((tool) => tool.name === "mcp")).toHaveLength(1);
      await fixture.bind();
      expect(fixture.events().filter((event) => event.event === "sdk_session_start")).toHaveLength(1);
      expect(fixture.events().filter((event) => event.event === "process_start")).toHaveLength(2);
      expect(fixture.events().filter((event) => event.event === "process_start" && alive(event.pid))).toHaveLength(1);
      for (const name of ["mcp", "fixture_slow"]) {
        const args = { delayMs: 3000, tag: `hosted-${name}` };
        await expect(fixture.invoke(name, name === "mcp" ? { tool: "fixture_slow", args } : args)).rejects.toThrow("MCP tool call timed out");
      }
    } finally { await fixture.finish(); }
  }, 20000);

  test("cold-cache env-selected direct startup uses one worker plus the native probe and the real context", async () => {
    const fixture = await scenario({ mode: "stdio", outer: 5000, directEnv: "fixture/echo" });
    try {
      expect(fixture.session.getToolDefinition("fixture_echo")).toBeDefined();
      expect(fixture.events().filter((event) => event.event === "process_start")).toHaveLength(2);
      expect(fixture.events().filter((event) => event.event === "process_start" && alive(event.pid))).toHaveLength(1);
      expect(fixture.events().filter((event) => event.event === "sdk_session_start")).toHaveLength(1);
      expect(text(await fixture.invoke("fixture_echo", { text: "cold-cache" }))).toBe("echo:cold-cache");
    } finally { await fixture.finish(); }
  }, 15000);

  test.each(["stdio", "http"] as const)("%s: live additions/updates retain deadlines and removed tools become uncallable", async (mode) => {
    const fixture = await scenario({ mode, outer: 180, native: 2000 });
    try {
      await fixture.invoke("fixture_mutate", { action: "add" });
      await waitFor(() => !!fixture.session.getToolDefinition("fixture_late"), "live addition");
      await expect(fixture.invoke("fixture_late", { delayMs: 3000, tag: "late-added" })).rejects.toThrow("MCP tool call timed out");
      await fixture.invoke("fixture_mutate", { action: "update" });
      await waitFor(() => fixture.session.getToolDefinition("fixture_late")?.description.includes("updated") === true, "live update");
      await expect(fixture.invoke("fixture_late", { delayMs: 3000, tag: "late-updated" })).rejects.toThrow("MCP tool call timed out");
      await fixture.invoke("fixture_mutate", { action: "remove" });
      await waitFor(() => !fixture.session.getCallableToolNames().includes("fixture_late"), "live withdrawal");
      expect(fixture.session.getActiveToolNames()).not.toContain("fixture_late");
    } finally { await fixture.finish(); }
  }, 20000);
});

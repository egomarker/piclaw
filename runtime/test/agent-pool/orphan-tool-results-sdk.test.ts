/** Real Pi SDK canaries for canonical, append-only context repair (no network). */
import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Type } from "typebox";
import "../helpers.js";
import {
  createAssistantMessageEventStream,
  InMemoryCredentialStore,
  InMemoryModelsStore,
  type Api,
  type AssistantMessage,
  type Model,
  type Provider,
  type ToolResultMessage,
  type TranscriptContext,
} from "@earendil-works/pi-ai";
import {
  createAgentSession,
  createExtensionRuntime,
  DefaultResourceLoader,
  ModelRuntime,
  type ExtensionFactory,
  type ResourceLoader,
  type ToolDefinition,
  SessionManager,
  SettingsManager,
} from "@earendil-works/pi-coding-agent";
import { pruneOrphanToolResults } from "../../src/agent-pool/orphan-tool-results.js";
import { persistedToolResultSanitizer, retainTransientToolResultImages } from "../../src/extensions/persisted-tool-result-sanitizer.js";

const MODEL: Model<Api> = {
  provider: "piclaw-context-fixture", id: "fixture", name: "Context fixture",
  api: "openai-responses", baseUrl: "https://example.invalid/no-network",
  reasoning: false, input: ["text", "image"], contextWindow: 100_000, maxTokens: 1024,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
};

function assistant(content: AssistantMessage["content"] = [{ type: "text", text: "fixture response" }]): AssistantMessage {
  return {
    role: "assistant", content, api: MODEL.api, provider: MODEL.provider, model: MODEL.id,
    stopReason: content.some((block) => block.type === "toolCall") ? "toolUse" : "stop",
    usage: { input: 10, output: 5, cacheRead: 0, cacheWrite: 0, totalTokens: 15,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
    timestamp: 1_000,
  };
}

function result(id: string, visual = false): ToolResultMessage {
  return {
    role: "toolResult", toolCallId: id, toolName: "read", isError: false, timestamp: 2_000,
    content: visual ? [{ type: "image", data: "fixture-base64", mimeType: "image/png" }]
      : [{ type: "text", text: `fixture result ${id}` }],
  };
}

function gate() {
  let resolve!: () => void;
  const promise = new Promise<void>((release) => { resolve = release; });
  return { promise, resolve };
}

async function createNativeSession(manager: SessionManager, cwd: string, blocking = false, extra?: {
  responses?: AssistantMessage[];
  customTools?: ToolDefinition[];
  extensionFactories?: ExtensionFactory[];
}) {
  const requests: TranscriptContext[] = [];
  const started = gate();
  const release = gate();
  const credentials = new InMemoryCredentialStore();
  await credentials.modify(MODEL.provider, () => ({ type: "api_key", key: "fixture-key" }));
  const runtime = await ModelRuntime.create({ credentials, modelsStore: new InMemoryModelsStore(),
    modelsPath: null, allowModelNetwork: false });
  const stream: Provider["streamSimple"] = (_model, context, options) => {
    requests.push(structuredClone(context));
    const events = createAssistantMessageEventStream();
    void (async () => {
      started.resolve();
      if (blocking && requests.length === 1) await release.promise;
      const message = extra?.responses?.[requests.length - 1] ?? assistant();
      if (options?.signal?.aborted) {
        events.push({ type: "error", reason: "aborted", error: { ...message, stopReason: "aborted", errorMessage: "fixture aborted" } });
      } else {
        events.push({ type: "done", reason: "stop", message });
      }
      events.end();
    })();
    return events;
  };
  runtime.registerNativeProvider({
    id: MODEL.provider, name: "Context fixture",
    auth: { apiKey: {
      name: "Fixture key",
      resolve: async ({ credential }) => credential?.key ? { auth: { apiKey: credential.key }, source: "fixture" } : undefined,
    } },
    getModels: () => [MODEL],
    stream, streamSimple: stream,
  });
  const resourceLoader: ResourceLoader = {
    getExtensions: () => ({ extensions: [], errors: [], runtime: createExtensionRuntime() }),
    getSkills: () => ({ skills: [], diagnostics: [] }),
    getPrompts: () => ({ prompts: [], diagnostics: [] }),
    getThemes: () => ({ themes: [], diagnostics: [] }),
    getAgentsFiles: () => ({ agentsFiles: [] }),
    getSystemPrompt: () => "Isolated context fixture.",
    getSystemPromptSource: () => undefined,
    getAppendSystemPrompt: () => [],
    getAppendSystemPromptSources: () => [],
    extendResources: () => {}, reload: async () => {},
  };
  const settingsManager = SettingsManager.inMemory({
    cacheWarming: "off", compaction: { enabled: false, keepRecentTokens: 1, reserveTokens: 1024 },
    retry: { enabled: false },
  });
  const loader = extra?.extensionFactories ? new DefaultResourceLoader({
    cwd, agentDir: join(cwd, "agent"), settingsManager,
    extensionFactories: extra.extensionFactories,
    systemPromptOverride: () => "Isolated context fixture.",
    agentsFilesOverride: () => ({ agentsFiles: [] }),
    noSkills: true, noPromptTemplates: true, noThemes: true,
  }) : resourceLoader;
  if (extra?.extensionFactories) await loader.reload();
  const { session } = await createAgentSession({
    cwd, agentDir: join(cwd, "agent"), model: MODEL, thinkingLevel: "off", modelRuntime: runtime,
    resourceLoader: loader, tools: extra?.customTools?.map((tool) => tool.name) ?? [],
    customTools: extra?.customTools, sessionManager: manager, settingsManager,
  });
  if (extra?.extensionFactories) await session.bindExtensions({});
  return { session, requests, started, release };
}

function hasOrphan(messages: readonly { role: string }[]): boolean {
  return messages.some((message) => message.role === "toolResult"
    && (message as ToolResultMessage).toolCallId.startsWith("orphan"));
}

function seed(manager: SessionManager) {
  manager.appendMessage({ role: "user", content: "Read the fixture.", timestamp: 1_000 });
  manager.appendMessage(assistant([{ type: "toolCall", id: "known|encrypted-signature", name: "read", arguments: {} }]));
  manager.appendMessage(result("known", true));
  const orphan = manager.appendMessage(result("orphan"));
  manager.appendModelChange(MODEL.provider, MODEL.id);
  manager.appendThinkingLevelChange("off");
  manager.appendUsage("fixture_usage", MODEL.provider, MODEL.id, assistant().usage);
  return orphan;
}

describe("canonical orphan repair with the real Pi SDK", () => {
  test("real tool execution keeps images through recovery, sanitizes disk, and releases them at the final boundary", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "piclaw-image-sdk-"));
    const manager = SessionManager.create(cwd, join(cwd, "sessions"));
    const toolName = "fixture_image";
    const toolCallId = "known_image";
    const image = { type: "image" as const, data: "fixture-base64", mimeType: "image/png" };
    const { session, requests } = await createNativeSession(manager, cwd, false, {
      responses: [{ ...assistant([{ type: "toolCall", id: toolCallId, name: toolName, arguments: {} }]), stopReason: "toolUse" }],
      customTools: [{
        name: toolName, label: "Fixture image", description: "Return an isolated image", parameters: Type.Object({}),
        execute: async () => ({ content: [{ type: "text", text: "Fixture image result" }, image], details: undefined }),
      }],
      extensionFactories: [persistedToolResultSanitizer],
    });
    const releaseImages = retainTransientToolResultImages(manager);
    const imageResult = (context: TranscriptContext) => context.messages.find((message) => message.role === "toolResult"
      && message.toolCallId === toolCallId) as ToolResultMessage | undefined;
    try {
      await session.prompt("Read an image.");
      await session.waitForIdle();
      expect(requests).toHaveLength(2);
      expect(imageResult(requests[1]!)?.content).toContainEqual(image);
      expect(session.getSessionStats().tokens.total).toBe(30);
      const file = manager.getSessionFile()!;
      expect(readFileSync(file, "utf8")).not.toContain('"type":"image"');
      expect(readFileSync(file, "utf8")).toContain("Persisted tool result sanitized");
      session.refreshContext();
      expect(pruneOrphanToolResults(session, "web:image-sdk-fixture")).toBe(0);
      await session.prompt("Continue recovery with the same image.");
      await session.waitForIdle();
      expect(requests).toHaveLength(3);
      expect(imageResult(requests[2]!)?.content).toContainEqual(image);
      expect(session.getSessionStats().tokens.total).toBe(45);
      releaseImages();
      releaseImages();
      session.refreshContext();
      await session.prompt("Start a separate turn after cleanup.");
      await session.waitForIdle();
      expect(requests).toHaveLength(4);
      expect(imageResult(requests[3]!)?.content.some((block) => block.type === "image")).toBe(false);
      expect(readFileSync(file, "utf8")).not.toContain('"type":"image"');
    } finally {
      releaseImages();
      session.dispose();
      rmSync(cwd, { recursive: true, force: true });
    }
  }, 30_000);

  test("in-memory edits survive refresh, provider requests, navigation and native compaction", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "piclaw-orphan-sdk-"));
    const manager = SessionManager.inMemory(cwd);
    const orphanId = seed(manager);
    const raw = structuredClone(manager.getEntries());
    const { session, requests } = await createNativeSession(manager, cwd);
    const initialUsage = session.getSessionStats().tokens;
    try {
      expect(initialUsage.total).toBe(30); // assistant 15 + non-context usage 15
      expect(session.isIdle).toBe(true);
      expect(pruneOrphanToolResults(session, "web:sdk-fixture")).toBe(1);
      expect(manager.getEntries().slice(0, raw.length)).toEqual(raw);
      expect(session.getSessionStats().tokens).toEqual(initialUsage);
      const editedLeaf = manager.getLeafId()!;
      expect(manager.getLeafEntry()).toMatchObject({ type: "context_edit", targetId: orphanId, replacement: null });
      session.refreshContext();
      expect(hasOrphan(session.messages)).toBe(false);
      expect(session.model?.id).toBe(MODEL.id);
      expect(session.thinkingLevel).toBe("off");
      const linked = session.messages.find((message) => message.role === "toolResult") as ToolResultMessage;
      expect(linked.content).toEqual(result("known", true).content);
      expect(pruneOrphanToolResults(session, "web:sdk-fixture")).toBe(0);

      await session.navigateTree(orphanId, { summarize: false });
      expect(hasOrphan(session.messages)).toBe(true);
      await session.navigateTree(editedLeaf, { summarize: false });
      expect(hasOrphan(session.messages)).toBe(false);

      await session.prompt("Continue.");
      await session.waitForIdle();
      expect(requests).toHaveLength(1);
      expect(hasOrphan(requests[0]!.messages)).toBe(false);
      expect(requests[0]!.messages.filter((message) => message.role === "toolResult")).toHaveLength(1);
      expect(JSON.stringify(requests[0])).not.toContain("fixture_usage");
      await session.prompt("One more turn before compaction.");
      await session.waitForIdle();
      const count = requests.length;
      await session.compact();
      expect(requests.length).toBeGreaterThan(count);
      expect(requests.slice(count).every((context) => !JSON.stringify(context).includes("fixture result orphan"))).toBe(true);
      session.refreshContext();
      expect(hasOrphan(session.messages)).toBe(false);
      await session.prompt("Continue after compaction.");
      await session.waitForIdle();
      expect(hasOrphan(requests.at(-1)!.messages)).toBe(false);
      expect(manager.getEntries().slice(0, raw.length)).toEqual(raw);
    } finally {
      session.dispose();
      rmSync(cwd, { recursive: true, force: true });
    }
  }, 30_000);

  test("persisted history is a byte-for-byte prefix after repair and a reopened SDK session stays repaired", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "piclaw-orphan-reopen-"));
    const sessionDir = join(cwd, "sessions");
    mkdirSync(sessionDir, { recursive: true });
    const manager = SessionManager.create(cwd, sessionDir);
    const orphanId = seed(manager);
    const file = manager.getSessionFile()!;
    const before = readFileSync(file, "utf8");
    const first = await createNativeSession(manager, cwd);
    try {
      expect(pruneOrphanToolResults(first.session, "web:sdk-fixture")).toBe(1);
      const after = readFileSync(file, "utf8");
      expect(after.startsWith(before)).toBe(true);
      const appended = after.slice(before.length).trim().split("\n").map((line) => JSON.parse(line));
      expect(appended).toHaveLength(1);
      expect(appended[0]).toMatchObject({ type: "context_edit", targetId: orphanId, replacement: null });
      first.session.dispose();
      const reopened = await createNativeSession(SessionManager.open(file), cwd);
      try {
        reopened.session.refreshContext();
        expect(hasOrphan(reopened.session.messages)).toBe(false);
        await reopened.session.prompt("Resume the repaired history.");
        await reopened.session.waitForIdle();
        expect(reopened.requests).toHaveLength(1);
        expect(hasOrphan(reopened.requests[0]!.messages)).toBe(false);
        expect(readFileSync(file, "utf8").startsWith(before)).toBe(true);
      } finally {
        reopened.session.dispose();
      }
    } finally {
      first.session.dispose();
      rmSync(cwd, { recursive: true, force: true });
    }
  }, 30_000);

  test("an in-flight abort does not edit context; the next idle boundary repairs and continues once", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "piclaw-orphan-abort-"));
    const manager = SessionManager.inMemory(cwd);
    seed(manager);
    const { session, requests, started, release } = await createNativeSession(manager, cwd, true);
    const prompting = session.prompt("Start an abortable turn.");
    try {
      await Promise.race([
        started.promise,
        prompting.then(() => { throw new Error(`Fixture prompt ended before dispatch: ${JSON.stringify(session.messages.at(-1))}`); }),
      ]);
      const before = structuredClone(manager.getEntries());
      expect(session.isIdle).toBe(false);
      expect(pruneOrphanToolResults(session, "web:sdk-fixture")).toBe(0);
      expect(manager.getEntries()).toEqual(before);
      const aborting = session.abort();
      release.resolve();
      await aborting;
      await prompting;
      await session.waitForIdle();
      expect(pruneOrphanToolResults(session, "web:sdk-fixture")).toBe(1);
      session.refreshContext();
      await session.prompt("Continue after cancellation.");
      await session.waitForIdle();
      expect(requests).toHaveLength(2);
      expect(hasOrphan(requests[1]!.messages)).toBe(false);
      expect(manager.getEntries().filter((entry) => entry.type === "context_edit")).toHaveLength(1);
    } finally {
      release.resolve();
      await session.abort();
      await prompting;
      session.dispose();
      rmSync(cwd, { recursive: true, force: true });
    }
  }, 30_000);
});

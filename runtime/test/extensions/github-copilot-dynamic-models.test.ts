import { afterEach, describe, expect, test } from "bun:test";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { Model } from "@earendil-works/pi-ai";

import {
  fetchGitHubCopilotLiveModels,
  githubCopilotDynamicModels,
  mergeGitHubCopilotDynamicModels,
  refreshGitHubCopilotDynamicModelsAtBoot,
  setGitHubCopilotDynamicModelsFetchForTests,
  shouldImportGitHubCopilotLiveModelId,
} from "../../src/extensions/github-copilot-dynamic-models.js";

function makeModel(overrides: Partial<Model<any>> = {}): Model<any> {
  return {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "github-copilot",
    api: "openai-responses" as any,
    baseUrl: "https://api.individual.githubcopilot.com",
    reasoning: true,
    thinkingLevelMap: { off: null, minimal: "low", xhigh: "xhigh" } as any,
    input: ["text", "image"],
    cost: { input: 5, output: 30, cacheRead: 0.5, cacheWrite: 0 },
    contextWindow: 400000,
    maxTokens: 128000,
    headers: { "Copilot-Integration-Id": "vscode-chat" },
    ...overrides,
  };
}

function makeLiveModel(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    name: id,
    supported_endpoints: ["/responses"],
    capabilities: {
      family: id,
      limits: {
        max_context_window_tokens: 1050000,
        max_output_tokens: 128000,
        vision: { max_prompt_images: 1 },
      },
      supports: {
        reasoning_effort: ["none", "low", "medium", "high", "xhigh"],
      },
    },
    ...overrides,
  };
}

describe("github-copilot dynamic models extension", () => {
  afterEach(() => {
    setGitHubCopilotDynamicModelsFetchForTests(null);
  });

  test("filters live model IDs to chat-capable non-embedding model IDs", () => {
    expect(shouldImportGitHubCopilotLiveModelId("gpt-5.5")).toBe(true);
    expect(shouldImportGitHubCopilotLiveModelId("claude-opus-4.7-high")).toBe(true);
    expect(shouldImportGitHubCopilotLiveModelId("mai-code-1-flash-internal")).toBe(true);
    expect(shouldImportGitHubCopilotLiveModelId("gemini-3.5-flash")).toBe(true);
    expect(shouldImportGitHubCopilotLiveModelId("grok-code-fast-1")).toBe(true);
    expect(shouldImportGitHubCopilotLiveModelId("text-embedding-3-small")).toBe(false);
    expect(shouldImportGitHubCopilotLiveModelId("trajectory-compaction")).toBe(false);
  });

  test("merges live github-copilot chat models while preserving static provider entries", () => {
    const existing = [
      makeModel({ id: "gpt-5.5" }),
      makeModel({ id: "gpt-4.1", name: "GPT-4.1", api: "openai-completions" as any, reasoning: false, contextWindow: 128000, maxTokens: 16384 }),
      makeModel({ id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", api: "openai-completions" as any }),
      makeModel({
        id: "claude-fable-5",
        name: "Claude Fable 5",
        api: "anthropic-messages" as any,
        reasoning: true,
        thinkingLevelMap: { xhigh: "xhigh" } as any,
        compat: { forceAdaptiveThinking: true } as any,
        contextWindow: 200000,
        maxTokens: 4096,
      }),
      makeModel({ provider: "openai", id: "gpt-5.5" }),
    ];

    const merged = mergeGitHubCopilotDynamicModels(existing, [
      makeLiveModel("claude-opus-4.7-high", {
        supported_endpoints: ["/v1/messages", "/chat/completions"],
        capabilities: { limits: { max_context_window_tokens: 200000, max_output_tokens: 64000, vision: {} }, supports: {} },
      }),
      makeLiveModel("claude-fable-5-xhigh", {
        supported_endpoints: ["/v1/messages"],
        capabilities: { limits: { max_context_window_tokens: 200000, max_output_tokens: 4096, vision: {} }, supports: {} },
      }),
      makeLiveModel("mai-code-1-flash-internal"),
      makeLiveModel("gemini-3.5-flash"),
      makeLiveModel("grok-code-fast-1"),
      makeLiveModel("trajectory-compaction"),
    ]);

    const ids = merged.map((model) => model.id);
    expect(ids).toContain("gpt-5.5");
    expect(ids).toContain("gpt-4.1");
    expect(ids).toContain("gemini-3.5-flash");
    expect(ids).toContain("claude-opus-4.7-high");
    expect(ids).toContain("claude-fable-5-xhigh");
    expect(ids).toContain("mai-code-1-flash-internal");
    expect(ids).toContain("grok-code-fast-1");
    expect(ids).not.toContain("trajectory-compaction");

    const claude = merged.find((model) => model.id === "claude-opus-4.7-high")!;
    expect(claude.api).toBe("anthropic-messages");
    expect(claude.reasoning).toBe(true);
    expect(claude.contextWindow).toBe(200000);
    expect(claude.maxTokens).toBe(64000);

    const fable = merged.find((model) => model.id === "claude-fable-5-xhigh")!;
    expect(fable.api).toBe("anthropic-messages");
    expect(fable.reasoning).toBe(true);
    expect(fable.compat).toEqual({ forceAdaptiveThinking: true });
    expect(fable.thinkingLevelMap).toEqual({ xhigh: "xhigh" });
    expect(fable.contextWindow).toBe(200000);
    expect(fable.maxTokens).toBe(4096);

    const mai = merged.find((model) => model.id === "mai-code-1-flash-internal")!;
    expect(mai.api).toBe("openai-responses");
    expect(mai.contextWindow).toBe(1050000);
    expect(mai.input).toEqual(["text", "image"]);
  });

  test("fetchGitHubCopilotLiveModels calls only the github-copilot /models endpoint", async () => {
    const calls: string[] = [];
    const fakeFetch = (async (url: string | URL | Request) => {
      calls.push(String(url));
      return new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.5"), makeLiveModel("text-embedding-3-small")] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const models = await fetchGitHubCopilotLiveModels({
      baseUrl: "https://api.individual.githubcopilot.com/",
      apiKey: "token",
      fetchImpl: fakeFetch,
      timeoutMs: 1000,
    });

    expect(calls).toEqual(["https://api.individual.githubcopilot.com/models"]);
    expect(models.map((model) => model.id)).toEqual(["gpt-5.5", "text-embedding-3-small"]);
  });

  test("session_start registers only the github-copilot provider with merged live models", async () => {
    const handlers: Array<{ event: string; handler: (...args: any[]) => any }> = [];
    const registrations: Array<{ name: string; config: any }> = [];
    const api = {
      on(event: string, handler: (...args: any[]) => any) { handlers.push({ event, handler }); },
      registerProvider(name: string, config: any) { registrations.push({ name, config }); },
      registerTool() {},
      registerCommand() {},
      registerShortcut() {},
      registerFlag() {},
      getFlag() { return undefined; },
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
      unregisterProvider() {},
    } as unknown as ExtensionAPI;

    setGitHubCopilotDynamicModelsFetchForTests((async () => new Response(JSON.stringify({
      data: [
        makeLiveModel("claude-opus-4.6-1m", { supported_endpoints: ["/v1/messages"] }),
        makeLiveModel("mai-code-1-flash-internal"),
        makeLiveModel("gemini-3.5-flash"),
        makeLiveModel("text-embedding-3-small"),
      ],
    }), { status: 200 })) as typeof fetch);

    githubCopilotDynamicModels(api);
    const sessionStart = handlers.find((entry) => entry.event === "session_start")?.handler;
    expect(typeof sessionStart).toBe("function");

    const ctx = {
      modelRegistry: {
        getAll: () => [makeModel({ id: "gpt-5.5" }), makeModel({ provider: "openai", id: "gpt-5.5" })],
        getApiKeyAndHeaders: async () => ({ ok: true, apiKey: "copilot-token", headers: { "X-Test": "1" } }),
      },
    } as unknown as ExtensionContext;

    await sessionStart?.({}, ctx);

    expect(registrations).toHaveLength(1);
    expect(registrations[0].name).toBe("github-copilot");
    expect(registrations[0].config.models.map((model: any) => model.id)).toEqual([
      "claude-opus-4.6-1m",
      "gemini-3.5-flash",
      "gpt-5.5",
      "mai-code-1-flash-internal",
    ]);
    expect(registrations[0].config.models.some((model: any) => model.id === "text-embedding-3-small")).toBe(false);
    expect(registrations[0].config.oauth).toBeTruthy();
    expect(registrations[0].config.oauth.id).toBe("github-copilot");
    expect(typeof registrations[0].config.oauth.getApiKey).toBe("function");
  });

  test("boot refresh registers GitHub Copilot with the real upstream OAuth provider", async () => {
    const registrations: Array<{ name: string; config: any }> = [];
    setGitHubCopilotDynamicModelsFetchForTests((async () => new Response(JSON.stringify({
      data: [makeLiveModel("gpt-5.5"), makeLiveModel("claude-opus-4.6-1m", { supported_endpoints: ["/v1/messages"] })],
    }), { status: 200 })) as typeof fetch);

    const registry = {
      getAll: () => [makeModel({ id: "gpt-5.5" })],
      getApiKeyAndHeaders: async () => ({ ok: true, apiKey: "copilot-token", headers: { "X-Test": "1" } }),
    };
    const agentPool = {
      hasProviderModels: () => true,
      registerModelProvider(name: string, config: any) { registrations.push({ name, config }); },
      getModelRegistry: () => registry,
    };

    await refreshGitHubCopilotDynamicModelsAtBoot(agentPool);

    expect(registrations).toHaveLength(1);
    expect(registrations[0].name).toBe("github-copilot");
    expect(registrations[0].config.oauth).toBeTruthy();
    expect(registrations[0].config.oauth.id).toBe("github-copilot");
    expect(typeof registrations[0].config.oauth.getApiKey).toBe("function");
    expect(registrations[0].config.oauth).not.toEqual({ id: "github-copilot" });
  });
});

import { afterEach, describe, expect, test } from "bun:test";
import { InMemoryModelsStore, type Credential, type CredentialInfo, type Model, type ModelsStoreEntry } from "@earendil-works/pi-ai";
import { ModelRuntime } from "@earendil-works/pi-coding-agent";

import {
  createGitHubCopilotDynamicModelsOverlay,
  fetchGitHubCopilotLiveModels,
  mergeGitHubCopilotDynamicModels,
  registerGitHubCopilotDynamicModels,
  setGitHubCopilotDynamicModelsFetchForTests,
  shouldImportGitHubCopilotLiveModelId,
} from "../../src/extensions/github-copilot-dynamic-models.js";

function makeModel(overrides: Partial<Model<any>> = {}): Model<any> {
  return {
    id: "gpt-5.5", name: "GPT-5.5", provider: "github-copilot", api: "openai-responses" as any,
    baseUrl: "https://api.individual.githubcopilot.com", reasoning: true,
    thinkingLevelMap: { off: null, minimal: "low", xhigh: "xhigh" } as any,
    input: ["text", "image"], cost: { input: 5, output: 30, cacheRead: 0.5, cacheWrite: 0 },
    contextWindow: 400000, maxTokens: 128000,
    headers: { "Copilot-Integration-Id": "vscode-chat" }, ...overrides,
  };
}

function makeLiveModel(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id, name: id, model_picker_enabled: true, policy: { state: "enabled" }, supported_endpoints: ["/responses"],
    capabilities: {
      family: id,
      limits: { max_context_window_tokens: 1050000, max_output_tokens: 128000, vision: { max_prompt_images: 1 } },
      supports: { reasoning_effort: ["none", "low", "medium", "high", "xhigh"], tool_calls: true },
    },
    ...overrides,
  };
}

function createStore(initial?: ModelsStoreEntry) {
  let value = initial;
  return {
    read: async () => value,
    write: async (next: ModelsStoreEntry) => { value = next; },
    delete: async () => { value = undefined; },
  };
}

function oauth(access: string, extras: Record<string, unknown> = {}) {
  return { type: "oauth", access, refresh: "github-token", expires: Date.now() + 60_000, ...extras } as any;
}

describe("github-copilot dynamic models overlay", () => {
  afterEach(() => setGitHubCopilotDynamicModelsFetchForTests(null));

  test("filters live model IDs to chat-capable non-embedding model IDs", () => {
    expect(shouldImportGitHubCopilotLiveModelId("gpt-5.6")).toBe(true);
    expect(shouldImportGitHubCopilotLiveModelId("claude-opus-4.7-high")).toBe(true);
    expect(shouldImportGitHubCopilotLiveModelId("text-embedding-3-small")).toBe(false);
    expect(shouldImportGitHubCopilotLiveModelId("trajectory-compaction")).toBe(false);
  });

  test("merges unknown live chat models while preserving known static metadata", () => {
    const existing = [
      makeModel({ id: "gpt-5.5" }),
      makeModel({ id: "gpt-4.1", name: "GPT-4.1", api: "openai-completions" as any, reasoning: false, contextWindow: 128000, maxTokens: 16384 }),
      makeModel({ provider: "openai", id: "gpt-5.5" }),
    ];
    const merged = mergeGitHubCopilotDynamicModels(existing, [
      makeLiveModel("gpt-5.6", { capabilities: { limits: { max_context_window_tokens: 1050000, max_output_tokens: 128000, vision: {} }, supports: { reasoning_effort: ["max"], tool_calls: true } } }),
      makeLiveModel("claude-opus-4.7-high", { supported_endpoints: ["/v1/messages"] }),
      makeLiveModel("text-embedding-3-small"),
      makeLiveModel("gpt-disabled", { policy: { state: "disabled" } }),
      makeLiveModel("gpt-hidden", { model_picker_enabled: false }),
      makeLiveModel("gpt-no-tools", { capabilities: { limits: { max_context_window_tokens: 128000 }, supports: { tool_calls: false } } }),
    ]);
    expect(merged.map((model) => model.id)).toEqual(["claude-opus-4.7-high", "gpt-4.1", "gpt-5.5", "gpt-5.6"]);
    expect(merged.find((model) => model.id === "gpt-5.5")?.contextWindow).toBe(400000);
    expect(merged.find((model) => model.id === "gpt-5.6")?.thinkingLevelMap).toMatchObject({ max: "max" });
    expect(merged.find((model) => model.id === "gpt-5.6")?.headers?.["Editor-Version"]).toBe("vscode/1.107.0");
    expect(merged.find((model) => model.id === "gpt-5.5")?.headers?.["Editor-Version"]).toBe("vscode/1.107.0");
    expect(merged.find((model) => model.id === "claude-opus-4.7-high")?.api).toBe("anthropic-messages");
  });

  test("fetch uses the shared abort signal and bounded endpoint", async () => {
    const calls: string[] = [];
    const controller = new AbortController();
    const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
      calls.push(String(url));
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 });
    }) as typeof fetch;
    const models = await fetchGitHubCopilotLiveModels({ baseUrl: "https://api.individual.githubcopilot.com/", apiKey: "token", signal: controller.signal, fetchImpl });
    expect(calls).toEqual(["https://api.individual.githubcopilot.com/models"]);
    expect(models[0]?.id).toBe("gpt-5.6");
  });

  test("offline refresh restores cached extension catalog without network", async () => {
    const baseline = [makeModel({ id: "gpt-5.5" })];
    const runtime = { getModels: () => baseline, registerProvider: () => {} } as any;
    const overlay = createGitHubCopilotDynamicModelsOverlay(runtime);
    const store = createStore({ models: [makeModel({ id: "cached-unknown", name: "Cached Unknown" })], checkedAt: Date.now() });
    let fetchCalls = 0;
    setGitHubCopilotDynamicModelsFetchForTests((async () => { fetchCalls += 1; throw new Error("network forbidden"); }) as any);
    const models = await overlay.refreshModels!({ credential: oauth("token"), store, allowNetwork: false } as any);
    expect(fetchCalls).toBe(0);
    expect(models.map((model) => model.id)).toEqual(["cached-unknown", "gpt-5.5"]);
  });

  test("network refresh inherits OAuth credential, persists the complete catalog, and derives token-specific endpoint", async () => {
    const baseline = [makeModel({ id: "gpt-5.5" })];
    const runtime = { getModels: () => baseline, registerProvider: () => {} } as any;
    const overlay = createGitHubCopilotDynamicModelsOverlay(runtime);
    const calls: Array<{ url: string; auth: string | null }> = [];
    setGitHubCopilotDynamicModelsFetchForTests((async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), auth: new Headers(init?.headers).get("Authorization") });
      return new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 });
    }) as any);
    const store = createStore();
    const models = await overlay.refreshModels!({
      credential: oauth("tid=x;proxy-ep=proxy.business.githubcopilot.com;exp=1"),
      store, allowNetwork: true,
    } as any);
    expect(calls).toEqual([{ url: "https://api.business.githubcopilot.com/models", auth: "Bearer tid=x;proxy-ep=proxy.business.githubcopilot.com;exp=1" }]);
    expect(models.some((model) => model.id === "gpt-5.6")).toBe(true);
    expect((await store.read())?.models.map((model) => model.id)).toEqual(["gpt-5.5", "gpt-5.6"]);
  });

  test("concurrent network refreshes coalesce", async () => {
    const runtime = { getModels: () => [makeModel()], registerProvider: () => {} } as any;
    const overlay = createGitHubCopilotDynamicModelsOverlay(runtime);
    let calls = 0;
    let release!: () => void;
    const blocker = new Promise<void>((resolve) => { release = resolve; });
    setGitHubCopilotDynamicModelsFetchForTests((async () => {
      calls += 1;
      await blocker;
      return new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 });
    }) as any);
    const context = { credential: oauth("token"), store: createStore(), allowNetwork: true } as any;
    const first = overlay.refreshModels!(context);
    const second = overlay.refreshModels!(context);
    for (let attempt = 0; attempt < 20 && calls === 0; attempt += 1) await Bun.sleep(1);
    expect(calls).toBe(1);
    release();
    expect(await first).toEqual(await second);
  });

  test("enterprise metadata derives the credential-specific endpoint", async () => {
    const runtime = { getModels: () => [makeModel()], registerProvider: () => {} } as any;
    const overlay = createGitHubCopilotDynamicModelsOverlay(runtime);
    let url = "";
    setGitHubCopilotDynamicModelsFetchForTests((async (input: string | URL | Request) => {
      url = String(input);
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }) as any);
    await overlay.refreshModels!({ credential: oauth("opaque", { enterpriseUrl: "ghe.example.com" }), store: createStore(), allowNetwork: true } as any);
    expect(url).toBe("https://copilot-api.ghe.example.com/models");
  });

  test("network failure and abort preserve the last-good catalog", async () => {
    const runtime = { getModels: () => [makeModel()], registerProvider: () => {} } as any;
    const overlay = createGitHubCopilotDynamicModelsOverlay(runtime);
    setGitHubCopilotDynamicModelsFetchForTests((async () => { throw new Error("catalog unavailable"); }) as any);
    const failed = await overlay.refreshModels!({ credential: oauth("token"), store: createStore(), allowNetwork: true } as any);
    expect(failed.map((model) => model.id)).toEqual(["gpt-5.5"]);
    const controller = new AbortController();
    controller.abort();
    const aborted = await overlay.refreshModels!({ credential: oauth("token"), store: createStore(), allowNetwork: true, signal: controller.signal } as any);
    expect(aborted.map((model) => model.id)).toEqual(["gpt-5.5"]);
  });

  test("real ModelRuntime composition preserves built-in OAuth and streams while importing unknown models", async () => {
    const credentials = new Map<string, Credential>();
    const credentialStore = {
      read: async (providerId: string) => credentials.get(providerId),
      list: async (): Promise<readonly CredentialInfo[]> => [...credentials.entries()].map(([providerId, credential]) => ({ providerId, type: credential.type })),
      modify: async (providerId: string, fn: any) => {
        const next = await fn(credentials.get(providerId));
        if (next !== undefined) credentials.set(providerId, next);
        return next ?? credentials.get(providerId);
      },
      delete: async (providerId: string) => { credentials.delete(providerId); },
    };
    credentials.set("github-copilot", oauth("tid=x;proxy-ep=proxy.individual.githubcopilot.com;exp=1"));
    const runtime = await ModelRuntime.create({ credentials: credentialStore, modelsPath: null, modelsStore: new InMemoryModelsStore(), allowModelNetwork: false });
    const before = runtime.getProvider("github-copilot")!;
    registerGitHubCopilotDynamicModels(runtime);
    setGitHubCopilotDynamicModelsFetchForTests((async () => new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 })) as any);
    const result = await runtime.refresh({ allowNetwork: true });
    const after = runtime.getProvider("github-copilot")!;
    expect(result.errors.size).toBe(0);
    expect(after.auth.oauth?.name).toBe(before.auth.oauth?.name);
    expect(typeof after.auth.oauth?.login).toBe("function");
    expect(typeof after.auth.oauth?.refresh).toBe("function");
    expect(typeof after.auth.oauth?.toAuth).toBe("function");
    expect(typeof after.streamSimple).toBe("function");
    const imported = runtime.getModel("github-copilot", "gpt-5.6");
    expect(imported).toBeDefined();
    const prepared = await runtime.prepareRequest(imported!);
    expect(prepared.options.headers?.["Editor-Version"]).toBe("vscode/1.107.0");
    expect(prepared.options.headers?.["Editor-Plugin-Version"]).toBe("copilot-chat/0.35.0");
  });

  test("registers one auth-free process overlay and leaves OAuth/streams inherited", () => {
    const registrations: Array<{ id: string; config: any }> = [];
    const runtime = {
      getModels: () => [makeModel()],
      registerProvider: (id: string, config: any) => registrations.push({ id, config }),
    } as any;
    registerGitHubCopilotDynamicModels(runtime);
    expect(registrations).toHaveLength(1);
    expect(registrations[0].id).toBe("github-copilot");
    expect(registrations[0].config.oauth).toBeUndefined();
    expect(registrations[0].config.streamSimple).toBeUndefined();
    expect(registrations[0].config.headers?.["Editor-Version"]).toBe("vscode/1.107.0");
    expect(typeof registrations[0].config.refreshModels).toBe("function");
  });
});

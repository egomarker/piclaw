import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { createModels, InMemoryCredentialStore, InMemoryModelsStore, type AnyModel, type Credential, type CredentialInfo, type Model, type ModelsStoreEntry, type Provider, type RefreshModelsContext } from "@earendil-works/pi-ai";
import { ModelRuntime } from "@earendil-works/pi-coding-agent";

import {
  createGitHubCopilotDynamicModelsProvider,
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

function baseProvider(overrides: Partial<Provider> = {}): Provider {
  return {
    id: "github-copilot", name: "GitHub Copilot", auth: {},
    getModels: () => [makeModel()],
    filterModels: (models) => models.filter((model) => model.id === "gpt-5.5"),
    stream: () => { throw new Error("unused"); },
    streamSimple: () => { throw new Error("unused"); },
    ...overrides,
  };
}

function createOverlay(overrides: Partial<Provider> = {}): Provider {
  return createGitHubCopilotDynamicModelsProvider({ getProvider: () => baseProvider(overrides) } as unknown as ModelRuntime)!;
}

function gate() {
  let resolve!: () => void;
  const promise = new Promise<void>((release) => { resolve = release; });
  return { promise, resolve };
}

async function createNativeRuntime(credential: Credential, modelsStore = new InMemoryModelsStore()) {
  const credentials = new InMemoryCredentialStore();
  await credentials.modify("github-copilot", () => credential);
  const runtime = await ModelRuntime.create({ credentials, modelsPath: null, modelsStore, allowModelNetwork: false });
  return { runtime, credentials };
}

// Exercise the new immutable snapshot/publication contract, never mutable store access.
async function refresh(provider: Provider, options: Omit<RefreshModelsContext, "stored" | "publish" | "signal"> & {
  store: ReturnType<typeof createStore>;
  signal?: AbortSignal;
  isCurrent?: () => boolean;
}): Promise<void> {
  const signal = options.signal ?? new AbortController().signal;
  const current = () => !signal.aborted && (options.isCurrent?.() ?? true);
  const entry = await options.store.read();
  return provider.refreshModels!({
    credential: options.credential, allowNetwork: options.allowNetwork, force: options.force,
    signal, stored: entry ? structuredClone(entry) : undefined,
    publish: async (publication) => {
      if (!current()) return false;
      if (publication.persist === null) await options.store.delete();
      else if (publication.persist !== undefined) await options.store.write(publication.persist);
      if (!current()) return false;
      publication.update?.();
      return true;
    },
  });
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

    const authoritative = mergeGitHubCopilotDynamicModels(existing, [
      makeLiveModel("gpt-5.6"),
      makeLiveModel("gpt-hidden", { model_picker_enabled: false }),
    ], { includeExisting: false });
    expect(authoritative.map((model) => model.id)).toEqual(["gpt-5.6"]);
  });

  test("deduplicates built-in Copilot Opus 5 while preserving 1M adaptive-thinking metadata", () => {
    const existing = [makeModel({
      id: "claude-opus-5",
      api: "anthropic-messages" as any,
      reasoning: true,
      contextWindow: 1_000_000,
      maxTokens: 128_000,
      thinkingLevelMap: { off: null, low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max" } as any,
    })];

    const merged = mergeGitHubCopilotDynamicModels(existing, [
      makeLiveModel("claude-opus-5", {
        supported_endpoints: ["/v1/messages"],
        capabilities: {
          limits: { max_context_window_tokens: 1_000_000, max_output_tokens: 128_000 },
          supports: { reasoning_effort: ["low", "medium", "high", "xhigh", "max"], tool_calls: true },
        },
      }),
    ]);

    expect(merged.filter((model) => model.id === "claude-opus-5")).toHaveLength(1);
    expect(merged[0]).toMatchObject({
      id: "claude-opus-5",
      api: "anthropic-messages",
      reasoning: true,
      contextWindow: 1_000_000,
      maxTokens: 128_000,
      thinkingLevelMap: { xhigh: "xhigh", max: "max" },
    });
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
    const runtime = { getModels: () => baseline, getProvider: () => ({ id: "github-copilot", name: "GitHub Copilot", auth: { oauth: {} }, getModels: () => baseline, stream: () => { throw new Error("unused"); }, streamSimple: () => { throw new Error("unused"); } }) } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    const store = createStore({ models: [makeModel({ id: "cached-unknown", name: "Cached Unknown" })], checkedAt: Date.now() });
    let fetchCalls = 0;
    setGitHubCopilotDynamicModelsFetchForTests((async () => { fetchCalls += 1; throw new Error("network forbidden"); }) as any);
    await refresh(overlay, { credential: oauth("token"), store, allowNetwork: false } as any);
    expect(fetchCalls).toBe(0);
    expect(overlay.getModels().map((model) => model.id)).toEqual(["cached-unknown"]);
  });

  test("network refresh avoids the wrapped remote catalog and uses live model templates", async () => {
    let baseModels = [makeModel({ id: "gpt-5.5" })];
    let baseRefreshCalls = 0;
    const baseProvider = {
      id: "github-copilot",
      name: "GitHub Copilot",
      auth: { oauth: {} },
      getModels: () => baseModels,
      refreshModels: async () => {
        baseRefreshCalls += 1;
        baseModels = [...baseModels, makeModel({ id: "gpt-5.4", name: "GPT-5.4" })];
      },
      stream: () => { throw new Error("unused"); },
      streamSimple: () => { throw new Error("unused"); },
    };
    const runtime = { getProvider: () => baseProvider } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    setGitHubCopilotDynamicModelsFetchForTests((async () => new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 })) as any);

    await refresh(overlay, { credential: oauth("token"), store: createStore(), allowNetwork: true } as any);

    expect(baseRefreshCalls).toBe(0);
    expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.6"]);
  });

  test("network refresh inherits OAuth credential, persists the complete catalog, and derives token-specific endpoint", async () => {
    const baseline = [makeModel({ id: "gpt-5.5" })];
    const runtime = { getModels: () => baseline, getProvider: () => ({ id: "github-copilot", name: "GitHub Copilot", auth: { oauth: {} }, getModels: () => baseline, stream: () => { throw new Error("unused"); }, streamSimple: () => { throw new Error("unused"); } }) } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    const calls: Array<{ url: string; auth: string | null }> = [];
    setGitHubCopilotDynamicModelsFetchForTests((async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), auth: new Headers(init?.headers).get("Authorization") });
      return new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 });
    }) as any);
    const store = createStore({ models: baseline, checkedAt: 123, lastModified: 456, etag: '"catalog"' });
    await refresh(overlay, {
      credential: oauth("tid=x;proxy-ep=proxy.business.githubcopilot.com;exp=1"),
      store, allowNetwork: true,
    } as any);
    expect(calls).toEqual([{ url: "https://api.business.githubcopilot.com/models", auth: "Bearer tid=x;proxy-ep=proxy.business.githubcopilot.com;exp=1" }]);
    expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.6"]);
    expect(await store.read()).toMatchObject({
      lastModified: 456,
      etag: '"catalog"',
      models: [{ id: "gpt-5.6" }],
    });
    // checkedAt must advance on a successful live refresh, otherwise the cached
    // catalog is permanently treated as freshly validated.
    expect((await store.read())!.checkedAt).toBeGreaterThan(123);
  });

  test("concurrent network refreshes coalesce", async () => {
    const runtime = { getModels: () => [makeModel()], getProvider: () => ({ id: "github-copilot", name: "GitHub Copilot", auth: { oauth: {} }, getModels: () => [makeModel()], stream: () => { throw new Error("unused"); }, streamSimple: () => { throw new Error("unused"); } }) } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    let calls = 0;
    let release!: () => void;
    const blocker = new Promise<void>((resolve) => { release = resolve; });
    setGitHubCopilotDynamicModelsFetchForTests((async () => {
      calls += 1;
      await blocker;
      return new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 });
    }) as any);
    const context = { credential: oauth("token"), store: createStore(), allowNetwork: true, signal: new AbortController().signal } as any;
    const first = refresh(overlay, context);
    const second = refresh(overlay, context);
    for (let attempt = 0; attempt < 20 && calls === 0; attempt += 1) await Bun.sleep(1);
    expect(calls).toBe(1);
    release();
    expect(await first).toEqual(await second);
  });

  test("sequential refreshes use the fresh live catalog unless forced", async () => {
    const runtime = { getModels: () => [makeModel()], getProvider: () => ({ id: "github-copilot", name: "GitHub Copilot", auth: { oauth: {} }, getModels: () => [makeModel()], stream: () => { throw new Error("unused"); }, streamSimple: () => { throw new Error("unused"); } }) } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    let calls = 0;
    setGitHubCopilotDynamicModelsFetchForTests((async () => {
      calls += 1;
      return new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 });
    }) as any);
    const store = createStore();
    const context = { credential: oauth("token"), store, allowNetwork: true } as any;

    await refresh(overlay, context);
    await refresh(overlay, context);
    expect(calls).toBe(1);

    await refresh(overlay, { ...context, force: true });
    expect(calls).toBe(2);
  });

  test("enterprise metadata derives the credential-specific endpoint", async () => {
    const runtime = { getModels: () => [makeModel()], getProvider: () => ({ id: "github-copilot", name: "GitHub Copilot", auth: { oauth: {} }, getModels: () => [makeModel()], stream: () => { throw new Error("unused"); }, streamSimple: () => { throw new Error("unused"); } }) } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    let url = "";
    setGitHubCopilotDynamicModelsFetchForTests((async (input: string | URL | Request) => {
      url = String(input);
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }) as any);
    await refresh(overlay, { credential: oauth("opaque", { enterpriseUrl: "ghe.example.com" }), store: createStore(), allowNetwork: true } as any);
    expect(url).toBe("https://copilot-api.ghe.example.com/models");
  });

  test("network failure and abort preserve the last-good catalog", async () => {
    const runtime = { getModels: () => [makeModel()], getProvider: () => ({ id: "github-copilot", name: "GitHub Copilot", auth: { oauth: {} }, getModels: () => [makeModel()], stream: () => { throw new Error("unused"); }, streamSimple: () => { throw new Error("unused"); } }) } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    setGitHubCopilotDynamicModelsFetchForTests((async () => { throw new Error("catalog unavailable"); }) as any);
    await expect(refresh(overlay, { credential: oauth("token"), store: createStore(), allowNetwork: true })).rejects.toThrow("catalog unavailable");
    expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.5"]);
    const controller = new AbortController();
    controller.abort();
    await refresh(overlay, { credential: oauth("token"), store: createStore(), allowNetwork: true, signal: controller.signal } as any);
    expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.5"]);
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
    credentials.set("github-copilot", oauth("tid=x;proxy-ep=proxy.business.githubcopilot.com;exp=1", { expires: Date.now() + 60 * 60_000 }));
    const runtime = await ModelRuntime.create({ credentials: credentialStore, modelsPath: null, modelsStore: new InMemoryModelsStore(), allowModelNetwork: false });
    const before = runtime.getProvider("github-copilot")!;
    registerGitHubCopilotDynamicModels(runtime);
    setGitHubCopilotDynamicModelsFetchForTests((async () => new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }), { status: 200 })) as any);
    const result = await runtime.refresh({ providers: ["github-copilot"], allowNetwork: true });
    const after = runtime.getProvider("github-copilot")!;
    expect(result.errors.size).toBe(0);
    expect(after.auth.oauth?.name).toBe(before.auth.oauth?.name);
    expect(typeof after.auth.oauth?.login).toBe("function");
    expect(typeof after.auth.oauth?.refresh).toBe("function");
    expect(typeof after.auth.oauth?.toAuth).toBe("function");
    expect(typeof after.streamSimple).toBe("function");
    const imported = runtime.getModel("github-copilot", "gpt-5.6");
    expect(imported).toBeDefined();
    expect((await runtime.getAvailable("github-copilot")).map((model) => model.id)).toContain("gpt-5.6");
    expect(imported?.baseUrl).toBe("https://api.individual.githubcopilot.com");
    expect(() => imported!.baseUrl.includes("githubcopilot.com")).not.toThrow();
    const prepared = await runtime.prepareRequest(imported!);
    expect(prepared.model.baseUrl).toBe("https://api.business.githubcopilot.com");
    expect(prepared.options.headers?.["Editor-Version"]).toBe("vscode/1.107.0");
    expect(prepared.options.headers?.["Editor-Plugin-Version"]).toBe("copilot-chat/0.35.0");
  });

  test("cached dynamic models retain a valid fallback while request auth remains dynamic", async () => {
    const baseline = [makeModel({ id: "gpt-5.5" })];
    const runtime = { getModels: () => baseline, getProvider: () => ({ id: "github-copilot", name: "GitHub Copilot", auth: { oauth: {} }, getModels: () => baseline, stream: () => { throw new Error("unused"); }, streamSimple: () => { throw new Error("unused"); } }) } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    const store = createStore();
    setGitHubCopilotDynamicModelsFetchForTests((async () => new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6-sol")] }), { status: 200 })) as any);

    await refresh(overlay, { credential: oauth("tid=x;proxy-ep=proxy.enterprise.githubcopilot.com;exp=1"), store, allowNetwork: true } as any);

    const imported = overlay.getModels().find((model) => model.id === "gpt-5.6-sol");
    const cached = (await store.read())?.models.find((model) => model.id === "gpt-5.6-sol");
    expect(imported?.baseUrl).toBe("https://api.individual.githubcopilot.com");
    expect(cached?.baseUrl).toBe("https://api.individual.githubcopilot.com");
  });

  test("registers one native provider overlay and leaves OAuth/streams inherited", () => {
    const stream = () => { throw new Error("unused"); };
    const streamSimple = () => { throw new Error("unused"); };
    const baseProvider = { id: "github-copilot", name: "GitHub Copilot", auth: { oauth: { name: "GitHub Copilot" } }, getModels: () => [makeModel()], stream, streamSimple };
    const registrations: any[] = [];
    const runtime = {
      getModels: () => [makeModel()],
      getProvider: () => baseProvider,
      registerNativeProvider: (provider: any) => registrations.push(provider),
    } as any;
    registerGitHubCopilotDynamicModels(runtime);
    expect(registrations).toHaveLength(1);
    expect(registrations[0].id).toBe("github-copilot");
    expect(registrations[0].auth).toBe(baseProvider.auth);
    expect(registrations[0].stream).toBe(stream);
    expect(registrations[0].streamSimple).toBe(streamSimple);
    expect(registrations[0].headers?.["Editor-Version"]).toBe("vscode/1.107.0");
    expect(typeof registrations[0].refreshModels).toBe("function");
  });

  test("keeps live-confirmed Copilot models visible when OAuth availableModelIds is stale, but drops cache-only models", async () => {
    const fable = makeModel({
      id: "claude-fable-5",
      name: "Claude Fable 5",
      api: "openai-completions" as any,
      contextWindow: 1000000,
      maxTokens: 128000,
    });
    const opus = makeModel({
      id: "claude-opus-4.8",
      name: "Claude Opus 4.8",
      api: "anthropic-messages" as any,
      contextWindow: 1000000,
      maxTokens: 64000,
    });
    const baseProvider = {
      id: "github-copilot",
      name: "GitHub Copilot",
      auth: { oauth: { name: "GitHub Copilot" } },
      getModels: () => [fable, opus],
      filterModels: (models: Model<any>[], credential: any) => {
        const ids = new Set(credential?.availableModelIds ?? []);
        return ids.size ? models.filter((model) => ids.has(model.id)) : models;
      },
      stream: () => { throw new Error("unused"); },
      streamSimple: () => { throw new Error("unused"); },
    };
    const runtime = { getProvider: () => baseProvider } as any;
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;

    // Offline: only the cached catalog is known, so upstream availability wins and
    // the unavailable cache-only model must not be selectable.
    await refresh(overlay, {
      credential: oauth("token", { availableModelIds: ["claude-opus-4.8"] }),
      store: createStore({ models: [fable, opus], checkedAt: Date.now() }),
      allowNetwork: false,
    } as any);

    expect(overlay.filterModels?.(overlay.getModels(), oauth("token", { availableModelIds: ["claude-opus-4.8"] })).map((model) => model.id))
      .toEqual(["claude-opus-4.8"]);

    // Live refresh confirms a model that the login-time availableModelIds snapshot
    // does not list yet; that model stays visible, cache-only ones still do not.
    setGitHubCopilotDynamicModelsFetchForTests((async () => new Response(
      JSON.stringify({ data: [makeLiveModel("claude-opus-4.8"), makeLiveModel("claude-opus-5")] }),
      { status: 200 },
    )) as any);
    await refresh(overlay, {
      credential: oauth("token", { availableModelIds: ["claude-opus-4.8"] }),
      store: createStore({ models: [fable, opus], checkedAt: Date.now() }),
      allowNetwork: true,
      force: true,
    } as any);

    const visible = overlay.filterModels?.(overlay.getModels(), oauth("token", { availableModelIds: ["claude-opus-4.8"] }))
      .map((model) => model.id).sort();
    expect(visible).toEqual(["claude-opus-4.8", "claude-opus-5"]);
    expect(visible).not.toContain("claude-fable-5");
  });

  test("a successful empty account catalog remains empty across offline and TTL refreshes", async () => {
    const overlay = createOverlay();
    const store = createStore({ models: [makeModel()], checkedAt: 123 });
    const credential = oauth("account");
    let calls = 0;
    setGitHubCopilotDynamicModelsFetchForTests((async () => {
      calls += 1;
      return new Response(JSON.stringify({ data: [] }));
    }) as typeof fetch);
    await refresh(overlay, { credential, store, allowNetwork: true });
    await refresh(overlay, { credential, store, allowNetwork: false });
    await refresh(overlay, { credential, store, allowNetwork: true });
    expect(calls).toBe(1);
    expect(overlay.getModels()).toEqual([]);
    expect(overlay.getAllModels?.()).toEqual([]);
    expect((await store.read())?.models).toEqual([]);
    expect((await store.read())?.checkedAt).toBeGreaterThan(123);
  });

  test("missing credentials restore cache without fetching or confirming cached IDs", async () => {
    const overlay = createOverlay();
    let calls = 0;
    setGitHubCopilotDynamicModelsFetchForTests((async () => { calls += 1; throw new Error("network forbidden"); }) as typeof fetch);
    await refresh(overlay, {
      store: createStore({ models: [makeModel({ id: "cache-only" })] }), allowNetwork: true,
    });
    expect(calls).toBe(0);
    expect(overlay.getModels().map((model) => model.id)).toEqual(["cache-only"]);
    expect(overlay.filterModels?.(overlay.getModels(), undefined)).toEqual([]);
  });

  test("storage failure preserves last-good state, validators and TTL without concealing failure", async () => {
    const clock = spyOn(Date, "now").mockReturnValue(1_000_000);
    try {
      const overlay = createOverlay();
      const store = createStore({ models: [makeModel()], checkedAt: 123, etag: '"validator"', lastModified: 456 });
      const credential = oauth("account");
      let calls = 0;
      setGitHubCopilotDynamicModelsFetchForTests((async () => {
        calls += 1;
        return new Response(JSON.stringify({ data: [makeLiveModel(`gpt-5.${calls + 5}`)] }));
      }) as typeof fetch);
      await refresh(overlay, { credential, store, allowNetwork: true });
      const lastGood = structuredClone(await store.read());
      const write = store.write;
      store.write = async () => { throw new Error("persistence unavailable"); };
      clock.mockReturnValue(1_450_000);
      await expect(refresh(overlay, { credential, store, allowNetwork: true, force: true })).rejects.toThrow("persistence unavailable");
      expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.6"]);
      expect(await store.read()).toEqual(lastGood);
      expect(overlay.filterModels?.([makeModel({ id: "gpt-5.7" })], credential)).toEqual([]);
      store.write = write;
      // Expire the last successful TTL, not a timestamp from the failed write.
      clock.mockReturnValue(1_900_001);
      await refresh(overlay, { credential, store, allowNetwork: true });
      expect(calls).toBe(3);
      expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.8"]);
      expect(await store.read()).toMatchObject({ etag: '"validator"', lastModified: 456, checkedAt: 1_900_001 });
    } finally {
      clock.mockRestore();
    }
  });

  test("a stale publication cannot replace a newer catalog or confirm old IDs", async () => {
    const overlay = createOverlay();
    const store = createStore({ models: [makeModel()] });
    const credential = oauth("account");
    const started = gate();
    const release = gate();
    let generation = 1;
    let calls = 0;
    setGitHubCopilotDynamicModelsFetchForTests((async () => {
      const call = ++calls;
      if (call === 1) { started.resolve(); await release.promise; }
      return new Response(JSON.stringify({ data: [makeLiveModel(call === 1 ? "gpt-5.6" : "gpt-5.7")] }));
    }) as typeof fetch);
    const first = refresh(overlay, { credential, store, allowNetwork: true, isCurrent: () => generation === 1 });
    try {
      await started.promise;
      generation = 2;
      await refresh(overlay, { credential, store, allowNetwork: true, isCurrent: () => generation === 2 });
      release.resolve();
      await first;
      expect(calls).toBe(2);
      expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.7"]);
      expect((await store.read())?.models.map((model) => model.id)).toEqual(["gpt-5.7"]);
      expect(overlay.filterModels?.([makeModel({ id: "gpt-5.6" })], credential)).toEqual([]);
    } finally {
      release.resolve();
      await first;
    }
  });

  test("a cancelled in-flight request does not block a fresh refresh even if fetch ignores abort", async () => {
    const overlay = createOverlay();
    const store = createStore({ models: [makeModel()], checkedAt: 123 });
    const credential = oauth("account");
    const controller = new AbortController();
    const started = gate();
    const release = gate();
    let calls = 0;
    setGitHubCopilotDynamicModelsFetchForTests((async () => {
      const call = ++calls;
      if (call === 1) { started.resolve(); await release.promise; }
      return new Response(JSON.stringify({ data: [makeLiveModel(call === 1 ? "gpt-5.6" : "gpt-5.7")] }));
    }) as typeof fetch);
    const first = refresh(overlay, { credential, store, allowNetwork: true, signal: controller.signal });
    try {
      await started.promise;
      controller.abort();
      await refresh(overlay, { credential, store, allowNetwork: true });
      release.resolve();
      await first;
      expect(calls).toBe(2);
      expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.7"]);
      expect((await store.read())?.models.map((model) => model.id)).toEqual(["gpt-5.7"]);
    } finally {
      release.resolve();
      await first;
    }
  });

  for (const account of [{ access: "account-b" }, { access: "account-a", enterpriseUrl: "ghe.example.test" }]) {
    test(`credential/endpoint changes do not inherit confirmation or TTL (${account.access}/${account.enterpriseUrl ?? "individual"})`, async () => {
      const overlay = createOverlay();
      const store = createStore();
      const firstCredential = oauth("account-a");
      const nextCredential = oauth(account.access, account);
      let calls = 0;
      setGitHubCopilotDynamicModelsFetchForTests((async () => {
        calls += 1;
        return new Response(JSON.stringify({ data: [makeLiveModel(calls === 1 ? "gpt-5.6" : "gpt-5.7")] }));
      }) as typeof fetch);
      await refresh(overlay, { credential: firstCredential, store, allowNetwork: true });
      await refresh(overlay, { credential: nextCredential, store, allowNetwork: false });
      expect(overlay.filterModels?.(overlay.getModels(), nextCredential)).toEqual([]);
      await refresh(overlay, { credential: nextCredential, store, allowNetwork: true });
      expect(calls).toBe(2);
      expect(overlay.filterModels?.(overlay.getModels(), nextCredential).map((model) => model.id)).toEqual(["gpt-5.7"]);
      expect(overlay.filterModels?.(overlay.getModels(), firstCredential)).toEqual([]);
    });
  }

  test("all-model composition preserves non-chat models without exposing another account's chat IDs", async () => {
    const image = { ...makeModel({ id: "image-fixture" }), type: "image", api: "fixture-images" } as AnyModel;
    const overlay = createOverlay({
      getAllModels: () => [makeModel(), image],
      filterAllModels: (models) => models.filter((model) => model.type === "image"),
    });
    const store = createStore({ models: [makeModel(), image], etag: '"validator"' });
    const credential = oauth("account-a");
    setGitHubCopilotDynamicModelsFetchForTests((async () => new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }))) as typeof fetch);
    await refresh(overlay, { credential, store, allowNetwork: true });
    expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.6"]);
    expect(overlay.getAllModels?.().map((model) => model.id)).toEqual(["gpt-5.6", "image-fixture"]);
    expect(overlay.filterAllModels?.(overlay.getAllModels!(), credential).map((model) => model.id)).toEqual(["gpt-5.6", "image-fixture"]);
    expect(overlay.filterAllModels?.(overlay.getAllModels!(), oauth("account-b")).map((model) => model.id)).toEqual(["image-fixture"]);
    expect((await store.read())?.models.map((model) => model.id)).toEqual(["gpt-5.6", "image-fixture"]);
  });

  test("real ModelRuntime reports provider failures while retaining its cached catalog", async () => {
    const modelsStore = new InMemoryModelsStore();
    await modelsStore.write("github-copilot", { models: [makeModel()], checkedAt: 123 });
    const { runtime } = await createNativeRuntime(oauth("account"), modelsStore);
    registerGitHubCopilotDynamicModels(runtime);
    setGitHubCopilotDynamicModelsFetchForTests((async () => { throw new Error("native catalog unavailable"); }) as typeof fetch);
    const result = await runtime.refresh({ providers: ["github-copilot"], allowNetwork: true, force: true });
    expect(result.aborted).toBe(false);
    expect(result.errors.get("github-copilot")?.message).toBe("native catalog unavailable");
    expect(runtime.getModel("github-copilot", "gpt-5.5")).toBeDefined();
    expect((await modelsStore.read("github-copilot"))?.checkedAt).toBe(123);
  });

  test("real SDK generation guards stop a replaced provider from publishing after abort", async () => {
    const modelsStore = new InMemoryModelsStore();
    await modelsStore.write("github-copilot", { models: [makeModel()], checkedAt: 123 });
    const { runtime, credentials } = await createNativeRuntime(oauth("account"), modelsStore);
    const overlay = createGitHubCopilotDynamicModelsProvider(runtime)!;
    const models = createModels({ credentials, modelsStore });
    const started = gate();
    const release = gate();
    const finished = gate();
    models.setProvider({ ...overlay, refreshModels: async (context) => {
      try { await overlay.refreshModels!(context); }
      finally { if (context.allowNetwork) finished.resolve(); }
    } });
    setGitHubCopilotDynamicModelsFetchForTests((async () => {
      started.resolve();
      await release.promise;
      return new Response(JSON.stringify({ data: [makeLiveModel("gpt-5.6")] }));
    }) as typeof fetch);
    const first = models.refresh({ providers: ["github-copilot"], allowNetwork: true });
    try {
      await started.promise;
      models.setProvider(baseProvider({ getModels: () => [makeModel({ id: "replacement" })] }));
      await first;
      release.resolve();
      await finished.promise;
      expect(models.getModels("github-copilot").map((model) => model.id)).toEqual(["replacement"]);
      expect(overlay.getModels().map((model) => model.id)).toEqual(["gpt-5.5"]);
      expect((await modelsStore.read("github-copilot"))?.models.map((model) => model.id)).toEqual(["gpt-5.5"]);
      expect((await modelsStore.read("github-copilot"))?.checkedAt).toBe(123);
    } finally {
      release.resolve();
      await first;
      await finished.promise;
    }
  });
});

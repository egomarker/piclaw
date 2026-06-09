/**
 * github-copilot-dynamic-models – Piclaw-private patch for GitHub Copilot model discovery.
 *
 * Rationale: see web timeline message 36334. Pi's bundled GitHub Copilot provider uses
 * a static generated model catalog, while private Copilot accounts can expose additional
 * models from https://api.individual.githubcopilot.com/models. This extension is intentionally
 * scoped to github-copilot only and imports chat-capable live model IDs while filtering known
 * non-chat model IDs such as embeddings and trajectory compaction helpers.
 */
import type { Api, Model } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

import { createLogger, debugSuppressedError } from "../utils/logger.js";

const PROVIDER = "github-copilot";
const DEFAULT_BASE_URL = "https://api.individual.githubcopilot.com";
const FETCH_TIMEOUT_MS = Math.max(500, Number(process.env.PICLAW_GITHUB_COPILOT_MODELS_TIMEOUT_MS || "3500"));
const DISABLED = /^(0|false|no)$/i.test(process.env.PICLAW_GITHUB_COPILOT_DYNAMIC_MODELS || "1");

const COPILOT_HEADERS: Record<string, string> = {
  "User-Agent": "GitHubCopilotChat/0.35.0",
  "Editor-Version": "vscode/1.107.0",
  "Editor-Plugin-Version": "copilot-chat/0.35.0",
  "Copilot-Integration-Id": "vscode-chat",
};

const DEFAULT_COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

const log = createLogger("extensions.github-copilot-dynamic-models");

type ProviderConfig = Parameters<ExtensionAPI["registerProvider"]>[1];
type ProviderModelConfig = NonNullable<ProviderConfig["models"]>[number];
type FetchLike = typeof fetch;

type CopilotLiveModel = {
  id?: unknown;
  name?: unknown;
  display_name?: unknown;
  vendor?: unknown;
  supported_endpoints?: unknown;
  capabilities?: {
    family?: unknown;
    limits?: {
      max_context_window_tokens?: unknown;
      max_prompt_tokens?: unknown;
      max_output_tokens?: unknown;
      max_non_streaming_output_tokens?: unknown;
      vision?: unknown;
    };
    supports?: {
      reasoning_effort?: unknown;
      parallel_tool_calls?: unknown;
    };
  };
  preview?: unknown;
};

type GitHubCopilotDynamicModelsContext = ExtensionContext & {
  modelRegistry: ExtensionContext["modelRegistry"] & {
    getAll(): Model<Api>[];
    getApiKeyAndHeaders(model: Model<Api>): Promise<{ ok: boolean; apiKey?: string; headers?: Record<string, string>; error?: string }>;
  };
};

let fetchForTests: FetchLike | null = null;

export function setGitHubCopilotDynamicModelsFetchForTests(fetchImpl: FetchLike | null): void {
  fetchForTests = fetchImpl;
}

function getFetch(): FetchLike {
  return fetchForTests ?? fetch;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(stringValue).filter((entry): entry is string => Boolean(entry)) : [];
}

const NON_CHAT_MODEL_ID = /(?:^|[-_])(embedding|embeddings)(?:[-_]|$)|^text-embedding-|^trajectory-compaction$/i;
const KNOWN_CHAT_MODEL_ID = /^(gpt|claude|mai|gemini|raptor|grok|xai|o\d|o-)/i;

export function shouldImportGitHubCopilotLiveModelId(id: string): boolean {
  const normalized = id.trim();
  return Boolean(normalized) && !NON_CHAT_MODEL_ID.test(normalized);
}

function getLiveModelId(model: CopilotLiveModel): string | null {
  return stringValue(model.id);
}

function getLiveModelName(model: CopilotLiveModel, id: string): string {
  return stringValue(model.name) ?? stringValue(model.display_name) ?? id;
}

function liveModelEndpoints(model: CopilotLiveModel): string[] {
  return stringArray(model.supported_endpoints).map((entry) => entry.toLowerCase());
}

function liveModelReasoningEfforts(model: CopilotLiveModel): string[] {
  return stringArray(model.capabilities?.supports?.reasoning_effort).map((entry) => entry.toLowerCase());
}

function liveModelSupportsVision(model: CopilotLiveModel): boolean {
  return isObject(model.capabilities?.limits?.vision);
}

function liveModelContextWindow(model: CopilotLiveModel, fallback?: number): number {
  const limits = model.capabilities?.limits;
  return numberValue(limits?.max_context_window_tokens)
    ?? numberValue(limits?.max_prompt_tokens)
    ?? fallback
    ?? 128000;
}

function liveModelMaxTokens(model: CopilotLiveModel, fallback?: number): number {
  const limits = model.capabilities?.limits;
  return numberValue(limits?.max_output_tokens)
    ?? numberValue(limits?.max_non_streaming_output_tokens)
    ?? fallback
    ?? 16384;
}

function hasLiveChatEndpoint(model: CopilotLiveModel): boolean {
  const endpoints = liveModelEndpoints(model);
  return endpoints.some((endpoint) => (
    endpoint.includes("responses")
    || endpoint.includes("chat/completions")
    || endpoint.includes("messages")
  ));
}

function shouldImportGitHubCopilotLiveModel(model: CopilotLiveModel, id: string): boolean {
  return shouldImportGitHubCopilotLiveModelId(id)
    && (KNOWN_CHAT_MODEL_ID.test(id) || hasLiveChatEndpoint(model));
}

function findTemplate(existing: Model<Api>[], id: string): Model<Api> | undefined {
  const exact = existing.find((model) => model.id === id);
  if (exact) return exact;

  const candidates: string[] = [];
  if (id.startsWith("claude-opus-4.6")) candidates.push("claude-opus-4.6");
  if (id.startsWith("claude-opus-4.7")) candidates.push("claude-opus-4.7");
  if (id.startsWith("claude-opus-4.8")) candidates.push("claude-opus-4.8");
  if (id.startsWith("claude-sonnet-4.6")) candidates.push("claude-sonnet-4.6");
  if (id.startsWith("gpt-5.5")) candidates.push("gpt-5.5");
  if (id.startsWith("gpt-5.4")) candidates.push("gpt-5.4");
  if (id.startsWith("gpt-5.3")) candidates.push("gpt-5.3-codex");
  if (id.startsWith("gpt-5")) candidates.push("gpt-5.4", "gpt-5-mini");
  if (id.startsWith("gpt-4.1")) candidates.push("gpt-4.1");
  if (id.startsWith("gpt-4")) candidates.push("gpt-4.1");
  if (id.startsWith("gpt-3.5")) candidates.push("gpt-4.1");
  if (id.startsWith("mai")) candidates.push("gpt-5.5", "gpt-5.4");
  if (id.startsWith("gemini")) candidates.push("gemini-3.5-flash", "gemini-3-flash-preview", "gemini-2.5-pro", "gpt-5.5");
  if (id.startsWith("raptor")) candidates.push("raptor-mini", "gpt-5.5");
  if (id.startsWith("grok") || id.startsWith("xai")) candidates.push("gpt-5.5", "gpt-5.4");
  if (/^o\d|^o-/.test(id)) candidates.push("gpt-5.5", "gpt-5.4");

  for (const candidate of candidates) {
    const match = existing.find((model) => model.id === candidate);
    if (match) return match;
  }
  return existing[0];
}

function inferApi(id: string, model: CopilotLiveModel, template?: Model<Api>): Api {
  const endpoints = liveModelEndpoints(model);
  if (id.startsWith("claude")) return "anthropic-messages" as Api;
  if (endpoints.some((endpoint) => endpoint.includes("responses"))) {
    return "openai-responses" as Api;
  }
  if (id.startsWith("gpt-5") || id.startsWith("mai")) return "openai-responses" as Api;
  return template?.api ?? ("openai-completions" as Api);
}

function inferCompat(id: string, api: Api, template?: Model<Api>): Model<Api>["compat"] {
  if (template?.compat) return template.compat;
  if (api === "anthropic-messages") {
    return {
      forceAdaptiveThinking: true,
      ...(id.includes("4.7") || id.includes("4.8") ? { supportsTemperature: false } : {}),
    } as Model<Api>["compat"];
  }
  if (api === "openai-completions") {
    return {
      supportsStore: false,
      supportsDeveloperRole: false,
      supportsReasoningEffort: false,
    } as Model<Api>["compat"];
  }
  return undefined;
}

function inferThinkingLevelMap(id: string, model: CopilotLiveModel, template?: Model<Api>): Model<Api>["thinkingLevelMap"] {
  if (template?.thinkingLevelMap) return template.thinkingLevelMap;
  const efforts = new Set(liveModelReasoningEfforts(model));
  if (id.startsWith("claude")) {
    if (id.includes("-xhigh")) return { off: null, minimal: null, low: null, medium: null, high: null, xhigh: "xhigh" } as Model<Api>["thinkingLevelMap"];
    if (id.includes("-high")) return { off: null, minimal: null, low: null, medium: null, high: "high", xhigh: null } as Model<Api>["thinkingLevelMap"];
    if (id.includes("4.6")) return { xhigh: "max" } as Model<Api>["thinkingLevelMap"];
    return { xhigh: "xhigh" } as Model<Api>["thinkingLevelMap"];
  }
  if (efforts.size === 0) return undefined;
  return {
    off: efforts.has("none") ? "none" : null,
    minimal: efforts.has("minimal") ? "minimal" : efforts.has("low") ? "low" : null,
    low: efforts.has("low") ? "low" : undefined,
    medium: efforts.has("medium") ? "medium" : undefined,
    high: efforts.has("high") ? "high" : undefined,
    xhigh: efforts.has("xhigh") ? "xhigh" : efforts.has("max") ? "max" : undefined,
  } as Model<Api>["thinkingLevelMap"];
}

function inferReasoning(id: string, model: CopilotLiveModel, template?: Model<Api>): boolean {
  if (template?.reasoning !== undefined && template.id === id) return Boolean(template.reasoning);
  if (liveModelReasoningEfforts(model).length > 0) return true;
  if (id.startsWith("claude")) return true;
  if (id.startsWith("gpt-5") || id.startsWith("mai")) return true;
  return Boolean(template?.reasoning);
}

function toProviderModelConfig(model: Model<Api>): ProviderModelConfig {
  return {
    id: model.id,
    name: model.name ?? model.id,
    api: model.api,
    baseUrl: undefined,
    reasoning: Boolean(model.reasoning),
    thinkingLevelMap: model.thinkingLevelMap,
    input: model.input ?? ["text"],
    cost: model.cost ?? DEFAULT_COST,
    contextWindow: model.contextWindow ?? 128000,
    maxTokens: model.maxTokens ?? 16384,
    headers: undefined,
    compat: model.compat,
  } satisfies ProviderModelConfig;
}

function liveToProviderModelConfig(
  live: CopilotLiveModel,
  existing: Model<Api>[],
): ProviderModelConfig | null {
  const id = getLiveModelId(live);
  if (!id || !shouldImportGitHubCopilotLiveModel(live, id)) return null;

  const template = findTemplate(existing, id);
  const api = inferApi(id, live, template);
  const input: Array<"text" | "image"> = liveModelSupportsVision(live) || template?.input?.includes("image") ? ["text", "image"] : ["text"];
  return {
    id,
    name: getLiveModelName(live, id),
    api,
    baseUrl: undefined,
    reasoning: inferReasoning(id, live, template),
    thinkingLevelMap: inferThinkingLevelMap(id, live, template),
    input,
    cost: template?.cost ?? DEFAULT_COST,
    contextWindow: liveModelContextWindow(live, template?.contextWindow),
    maxTokens: liveModelMaxTokens(live, template?.maxTokens),
    headers: undefined,
    compat: inferCompat(id, api, template),
  } satisfies ProviderModelConfig;
}

export function mergeGitHubCopilotDynamicModels(
  existingModels: Model<Api>[],
  liveModels: CopilotLiveModel[],
): ProviderModelConfig[] {
  const existingGithubModels = existingModels.filter((model) => model.provider === PROVIDER && model.id);
  const merged = new Map<string, ProviderModelConfig>();

  for (const model of existingGithubModels) {
    merged.set(model.id, toProviderModelConfig(model));
  }

  for (const live of liveModels) {
    const model = liveToProviderModelConfig(live, existingGithubModels);
    if (!model) continue;
    merged.set(model.id, model);
  }

  return [...merged.values()].sort((left, right) => left.id.localeCompare(right.id));
}

function parseLiveModelsPayload(payload: unknown): CopilotLiveModel[] {
  if (Array.isArray(payload)) return payload.filter(isObject) as CopilotLiveModel[];
  if (!isObject(payload)) return [];
  const data = payload.data;
  if (Array.isArray(data)) return data.filter(isObject) as CopilotLiveModel[];
  const models = payload.models;
  if (Array.isArray(models)) return models.filter(isObject) as CopilotLiveModel[];
  return [];
}

export async function fetchGitHubCopilotLiveModels(options: {
  baseUrl: string;
  apiKey: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
  fetchImpl?: FetchLike;
}): Promise<CopilotLiveModel[]> {
  const baseUrl = options.baseUrl.replace(/\/+$/, "") || DEFAULT_BASE_URL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? FETCH_TIMEOUT_MS);
  try {
    const response = await (options.fetchImpl ?? getFetch())(`${baseUrl}/models`, {
      headers: {
        ...COPILOT_HEADERS,
        ...(options.headers ?? {}),
        Accept: "application/json",
        Authorization: `Bearer ${options.apiKey}`,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`GitHub Copilot /models failed: ${response.status} ${response.statusText}${text ? `: ${text.slice(0, 200)}` : ""}`);
    }
    return parseLiveModelsPayload(await response.json());
  } finally {
    clearTimeout(timer);
  }
}

function getGithubCopilotModels(ctx: GitHubCopilotDynamicModelsContext): Model<Api>[] {
  return ctx.modelRegistry.getAll().filter((model) => model.provider === PROVIDER && model.id);
}

async function refreshGitHubCopilotDynamicModels(ctx: GitHubCopilotDynamicModelsContext, pi: ExtensionAPI): Promise<void> {
  const existingModels = getGithubCopilotModels(ctx);
  if (existingModels.length === 0) return;

  const seedModel = existingModels.find((model) => model.id === "gpt-5.5")
    ?? existingModels.find((model) => model.id.startsWith("gpt"))
    ?? existingModels[0];
  const auth = await ctx.modelRegistry.getApiKeyAndHeaders(seedModel);
  if (!auth.ok || !auth.apiKey) {
    log.debug("Skipping GitHub Copilot dynamic model refresh because provider auth is unavailable.", {
      operation: "github_copilot_dynamic_models.auth_unavailable",
    });
    return;
  }

  const providerBaseUrl = seedModel.baseUrl || DEFAULT_BASE_URL;
  const liveModels = await fetchGitHubCopilotLiveModels({
    baseUrl: providerBaseUrl,
    apiKey: auth.apiKey,
    headers: auth.headers,
  });
  const providerModels = mergeGitHubCopilotDynamicModels(existingModels, liveModels);
  const addedCount = providerModels.filter((model) => !existingModels.some((existing) => existing.id === model.id)).length;

  if (providerModels.length === 0) return;
  pi.registerProvider(PROVIDER, {
    name: "GitHub Copilot",
    baseUrl: providerBaseUrl,
    headers: COPILOT_HEADERS,
    models: providerModels,
  });

  log.info("Registered GitHub Copilot dynamic models from live /models catalog.", {
    operation: "github_copilot_dynamic_models.register",
    liveCount: liveModels.length,
    registeredCount: providerModels.length,
    addedCount,
  });
}

/**
 * Boot-time eager refresh: register dynamic Copilot models immediately at startup
 * so they appear in the model picker without waiting for the first prompt.
 *
 * This uses the global model registry directly (no session context needed).
 */
export async function refreshGitHubCopilotDynamicModelsAtBoot(agentPool: {
  hasProviderModels(provider: string): boolean;
  registerModelProvider(providerName: string, config: ProviderConfig): void;
  getModelRegistry(): unknown;
}): Promise<void> {
  if (DISABLED) return;

  const registry = agentPool.getModelRegistry() as GitHubCopilotDynamicModelsContext["modelRegistry"];
  const existingModels = registry.getAll().filter((model) => model.provider === PROVIDER && model.id);
  if (existingModels.length === 0) return;

  const seedModel = existingModels.find((model) => model.id === "gpt-5.5")
    ?? existingModels.find((model) => model.id.startsWith("gpt"))
    ?? existingModels[0];
  const auth = await registry.getApiKeyAndHeaders(seedModel);
  if (!auth.ok || !auth.apiKey) {
    log.debug("Skipping boot-time GitHub Copilot dynamic model refresh because provider auth is unavailable.", {
      operation: "github_copilot_dynamic_models.boot_auth_unavailable",
    });
    return;
  }

  const providerBaseUrl = seedModel.baseUrl || DEFAULT_BASE_URL;
  const liveModels = await fetchGitHubCopilotLiveModels({
    baseUrl: providerBaseUrl,
    apiKey: auth.apiKey,
    headers: auth.headers,
  });
  const providerModels = mergeGitHubCopilotDynamicModels(existingModels as Model<Api>[], liveModels);
  const addedCount = providerModels.filter((model) => !existingModels.some((existing) => existing.id === model.id)).length;

  if (providerModels.length === 0) return;
  agentPool.registerModelProvider(PROVIDER, {
    name: "GitHub Copilot",
    baseUrl: providerBaseUrl,
    headers: COPILOT_HEADERS,
    models: providerModels,
  });

  log.info("Registered GitHub Copilot dynamic models at boot from live /models catalog.", {
    operation: "github_copilot_dynamic_models.boot_register",
    liveCount: liveModels.length,
    registeredCount: providerModels.length,
    addedCount,
  });
}

export const githubCopilotDynamicModels = (pi: ExtensionAPI): void => {
  if (DISABLED) return;

  pi.on("session_start", async (_event, ctx) => {
    try {
      await refreshGitHubCopilotDynamicModels(ctx as GitHubCopilotDynamicModelsContext, pi);
    } catch (error) {
      debugSuppressedError(log, "Failed to refresh GitHub Copilot dynamic models; keeping static catalog.", error, {
        operation: "github_copilot_dynamic_models.refresh_failed",
      });
    }
  });
};

export default githubCopilotDynamicModels;

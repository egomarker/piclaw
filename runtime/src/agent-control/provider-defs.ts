export interface ProviderCustomField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
}

export interface ProviderDef {
  id: string;
  name: string;
  hasOAuth: boolean;
  hasApiKey: boolean;
  apiKeyHint?: string;
  isCustom?: boolean;
  customApi?: string;
  customFields?: ProviderCustomField[];
  hasExternalAuth?: boolean;
  authNote?: string;
}

type ModelRegistryLike = {
  getAll?: () => Array<{ provider: string }>;
  getProviderDisplayName?: (provider: string) => string;
};

type AuthStorageLike = {
  getOAuthProviders?: () => Array<{ id: string; name?: string }>;
};

const REMOVED_PROVIDER_IDS = new Set([
  "antigravity",
  "google-antigravity",
  "google-gemini-cli",
]);

const API_KEY_HINTS: Record<string, string> = {
  anthropic: "sk-ant-...",
  "azure-openai-responses": "...",
  cerebras: "csk-...",
  "cloudflare-ai-gateway": "...",
  "cloudflare-workers-ai": "...",
  deepseek: "sk-...",
  fireworks: "fw_...",
  google: "AIza...",
  groq: "gsk_...",
  huggingface: "hf_...",
  "kimi-coding": "...",
  minimax: "...",
  "minimax-cn": "...",
  mistral: "...",
  moonshotai: "sk-...",
  "moonshotai-cn": "sk-...",
  openai: "sk-proj-...",
  opencode: "oc-...",
  "opencode-go": "oc-...",
  openrouter: "sk-or-...",
  "vercel-ai-gateway": "...",
  xai: "xai-...",
  xiaomi: "XIAOMI_API_KEY",
  "xiaomi-token-plan-cn": "XIAOMI_TOKEN_PLAN_CN_API_KEY",
  "xiaomi-token-plan-ams": "XIAOMI_TOKEN_PLAN_AMS_API_KEY",
  "xiaomi-token-plan-sgp": "XIAOMI_TOKEN_PLAN_SGP_API_KEY",
  zai: "ZAI_API_KEY",
};

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  "amazon-bedrock": "Amazon Bedrock",
  anthropic: "Anthropic",
  "azure-openai-responses": "Azure OpenAI Responses",
  cerebras: "Cerebras",
  "cloudflare-ai-gateway": "Cloudflare AI Gateway",
  "cloudflare-workers-ai": "Cloudflare Workers AI",
  deepseek: "DeepSeek",
  fireworks: "Fireworks",
  "github-copilot": "GitHub Copilot",
  google: "Google Gemini",
  "google-vertex": "Google Vertex AI",
  groq: "Groq",
  huggingface: "Hugging Face",
  "kimi-coding": "Kimi For Coding",
  mistral: "Mistral",
  minimax: "MiniMax",
  "minimax-cn": "MiniMax (China)",
  moonshotai: "Moonshot AI",
  "moonshotai-cn": "Moonshot AI (China)",
  opencode: "OpenCode Zen",
  "opencode-go": "OpenCode Go",
  "openai-codex": "OpenAI Codex",
  openai: "OpenAI",
  openrouter: "OpenRouter",
  "vercel-ai-gateway": "Vercel AI Gateway",
  xai: "xAI",
  xiaomi: "Xiaomi MiMo (API billing)",
  "xiaomi-token-plan-cn": "Xiaomi MiMo Token Plan (CN)",
  "xiaomi-token-plan-ams": "Xiaomi MiMo Token Plan (AMS)",
  "xiaomi-token-plan-sgp": "Xiaomi MiMo Token Plan (SGP)",
  zai: "ZAI",
};

const EXTERNAL_AUTH_NOTES: Record<string, string> = {
  "amazon-bedrock": "Configure AWS credentials (AWS_PROFILE, IAM environment variables, bearer token, or instance/task role) and region outside this login flow.",
  "google-vertex": "Configure Google Application Default Credentials plus GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION outside this login flow.",
  xiaomi: "Uses API billing credentials. Set XIAOMI_API_KEY or save an API key here; token-plan credentials use the regional xiaomi-token-plan-* providers.",
  "xiaomi-token-plan-cn": "Regional token-plan provider. Use XIAOMI_TOKEN_PLAN_CN_API_KEY or save the regional token-plan key here.",
  "xiaomi-token-plan-ams": "Regional token-plan provider. Use XIAOMI_TOKEN_PLAN_AMS_API_KEY or save the regional token-plan key here.",
  "xiaomi-token-plan-sgp": "Regional token-plan provider. Use XIAOMI_TOKEN_PLAN_SGP_API_KEY or save the regional token-plan key here.",
};

function customProvider(
  id: string,
  name: string,
  customApi: string,
  customFields: ProviderCustomField[],
): ProviderDef {
  return { id, name, hasOAuth: false, hasApiKey: false, isCustom: true, customApi, customFields };
}

export const PROVIDER_DEFS: ProviderDef[] = [
  { id: "anthropic", name: "Anthropic", hasOAuth: true, hasApiKey: true, apiKeyHint: API_KEY_HINTS.anthropic },
  { id: "github-copilot", name: "GitHub Copilot", hasOAuth: true, hasApiKey: false },
  { id: "openai-codex", name: "OpenAI Codex", hasOAuth: true, hasApiKey: false },
  { id: "openai", name: "OpenAI", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.openai },
  { id: "azure-openai-responses", name: "Azure OpenAI Responses", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["azure-openai-responses"] },
  { id: "google", name: "Google Gemini", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.google },
  { id: "deepseek", name: "DeepSeek", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.deepseek },
  { id: "mistral", name: "Mistral", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.mistral },
  { id: "groq", name: "Groq", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.groq },
  { id: "cerebras", name: "Cerebras", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.cerebras },
  {
    id: "cloudflare-ai-gateway",
    name: "Cloudflare AI Gateway",
    hasOAuth: false,
    hasApiKey: true,
    apiKeyHint: API_KEY_HINTS["cloudflare-ai-gateway"],
    authNote: "Also set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_GATEWAY_ID in the environment.",
  },
  {
    id: "cloudflare-workers-ai",
    name: "Cloudflare Workers AI",
    hasOAuth: false,
    hasApiKey: true,
    apiKeyHint: API_KEY_HINTS["cloudflare-workers-ai"],
    authNote: "Also set CLOUDFLARE_ACCOUNT_ID in the environment.",
  },
  { id: "xai", name: "xAI", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.xai },
  { id: "xiaomi", name: "Xiaomi MiMo (API billing)", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.xiaomi, authNote: EXTERNAL_AUTH_NOTES.xiaomi },
  { id: "xiaomi-token-plan-cn", name: "Xiaomi MiMo Token Plan (CN)", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["xiaomi-token-plan-cn"], authNote: EXTERNAL_AUTH_NOTES["xiaomi-token-plan-cn"] },
  { id: "xiaomi-token-plan-ams", name: "Xiaomi MiMo Token Plan (AMS)", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["xiaomi-token-plan-ams"], authNote: EXTERNAL_AUTH_NOTES["xiaomi-token-plan-ams"] },
  { id: "xiaomi-token-plan-sgp", name: "Xiaomi MiMo Token Plan (SGP)", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["xiaomi-token-plan-sgp"], authNote: EXTERNAL_AUTH_NOTES["xiaomi-token-plan-sgp"] },
  { id: "openrouter", name: "OpenRouter", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.openrouter },
  { id: "vercel-ai-gateway", name: "Vercel AI Gateway", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["vercel-ai-gateway"] },
  { id: "zai", name: "ZAI", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.zai },
  { id: "opencode", name: "OpenCode Zen", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.opencode },
  { id: "opencode-go", name: "OpenCode Go", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["opencode-go"] },
  { id: "kimi-coding", name: "Kimi For Coding", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["kimi-coding"] },
  { id: "minimax", name: "MiniMax", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.minimax },
  { id: "minimax-cn", name: "MiniMax (China)", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["minimax-cn"] },
  { id: "moonshotai", name: "Moonshot AI", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.moonshotai },
  { id: "moonshotai-cn", name: "Moonshot AI (China)", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS["moonshotai-cn"] },
  { id: "huggingface", name: "Hugging Face", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.huggingface },
  { id: "fireworks", name: "Fireworks", hasOAuth: false, hasApiKey: true, apiKeyHint: API_KEY_HINTS.fireworks },
  {
    id: "amazon-bedrock",
    name: "Amazon Bedrock",
    hasOAuth: false,
    hasApiKey: false,
    hasExternalAuth: true,
    authNote: EXTERNAL_AUTH_NOTES["amazon-bedrock"],
  },
  {
    id: "google-vertex",
    name: "Google Vertex AI",
    hasOAuth: false,
    hasApiKey: false,
    hasExternalAuth: true,
    authNote: EXTERNAL_AUTH_NOTES["google-vertex"],
  },
  customProvider("opencode-zen", "OpenCode ZEN", "openai-completions", [
    { key: "baseUrl", label: "Base URL", placeholder: "https://opencode.ai/zen/v1", required: true },
    { key: "apiKey", label: "ZEN API Key", placeholder: "optional for free-tier models", required: false },
    { key: "modelId", label: "Model ID", placeholder: "big-pickle", required: true },
    { key: "modelIds", label: "Additional models (comma-separated)", placeholder: "gpt-5.4,glm-5,kimi-k2", required: false },
  ]),
  customProvider("azure-openai", "Azure OpenAI", "openai-responses", [
    { key: "baseUrl", label: "Base URL", placeholder: "https://myresource.openai.azure.com/openai/v1", required: true },
    { key: "apiKey", label: "API Key (or empty for managed identity)", placeholder: "Bearer ...", required: false },
    { key: "modelId", label: "Model ID", placeholder: "gpt-4o", required: true },
    { key: "modelIds", label: "Additional model IDs (comma-separated)", placeholder: "gpt-4o,o3-mini", required: false },
  ]),
  customProvider("ollama", "Ollama", "openai-completions", [
    { key: "baseUrl", label: "Base URL", placeholder: "http://192.168.1.100:11434/v1", required: true },
    { key: "modelId", label: "Model ID", placeholder: "llama3:latest", required: true },
    { key: "modelIds", label: "Additional model IDs (comma-separated)", placeholder: "qwen3:latest", required: false },
    { key: "contextWindow", label: "Context window", placeholder: "128000", required: false },
  ]),
  customProvider("openai-compatible", "OpenAI-compatible", "openai-completions", [
    { key: "baseUrl", label: "Base URL", placeholder: "https://api.example.com/v1", required: true },
    { key: "apiKey", label: "API Key", placeholder: "sk-...", required: true },
    { key: "modelId", label: "Model ID", placeholder: "gpt-4o", required: true },
    { key: "modelIds", label: "Additional model IDs (comma-separated)", placeholder: "model-a,model-b", required: false },
    { key: "contextWindow", label: "Context window", placeholder: "128000", required: false },
  ]),
];

function titleCaseProvider(providerId: string): string {
  return providerId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getOAuthProviderIds(authStorage?: AuthStorageLike | null): Set<string> {
  try {
    return new Set(authStorage?.getOAuthProviders?.().map((provider) => provider.id) ?? []);
  } catch {
    return new Set();
  }
}

function providerHasApiKey(providerId: string): boolean {
  return Boolean(API_KEY_HINTS[providerId]);
}

export function getProviderDisplayName(providerId: string, registry?: ModelRegistryLike | null): string {
  const id = providerId.trim();
  if (!id) return "Provider";
  try {
    const registryName = registry?.getProviderDisplayName?.(id);
    if (registryName) return registryName;
  } catch (e) {
    // Fall back to local names when running against older pi versions.
    void e;
  }
  return PROVIDER_DISPLAY_NAMES[id] || PROVIDER_DEFS.find((entry) => entry.id === id)?.name || titleCaseProvider(id);
}

export function getProviderDefs(
  registry?: ModelRegistryLike | null,
  authStorage?: AuthStorageLike | null,
): ProviderDef[] {
  const oauthProviderIds = getOAuthProviderIds(authStorage);
  const defs = PROVIDER_DEFS
    .filter((provider) => !REMOVED_PROVIDER_IDS.has(provider.id))
    .map((provider) => ({
      ...provider,
      name: getProviderDisplayName(provider.id, registry),
      hasOAuth: provider.hasOAuth || oauthProviderIds.has(provider.id),
      hasApiKey: provider.hasApiKey || (!provider.isCustom && providerHasApiKey(provider.id)),
    }));

  const byId = new Map(defs.map((provider) => [provider.id, provider]));
  const dynamicProviderIds = new Set<string>();
  try {
    for (const model of registry?.getAll?.() ?? []) {
      if (model.provider && !REMOVED_PROVIDER_IDS.has(model.provider)) dynamicProviderIds.add(model.provider);
    }
  } catch (e) {
    // Keep the static list if the registry is unavailable or mid-refresh.
    void e;
  }

  for (const providerId of dynamicProviderIds) {
    const existing = byId.get(providerId);
    if (existing) {
      existing.name = getProviderDisplayName(providerId, registry);
      existing.hasOAuth ||= oauthProviderIds.has(providerId);
      existing.hasApiKey ||= providerHasApiKey(providerId);
      continue;
    }

    const hasOAuth = oauthProviderIds.has(providerId);
    const hasApiKey = providerHasApiKey(providerId);
    byId.set(providerId, {
      id: providerId,
      name: getProviderDisplayName(providerId, registry),
      hasOAuth,
      hasApiKey,
      apiKeyHint: API_KEY_HINTS[providerId],
      hasExternalAuth: !hasOAuth && !hasApiKey,
      authNote: EXTERNAL_AUTH_NOTES[providerId] || "This provider is available in the model registry but does not expose a Piclaw-managed login method. Configure its credentials externally.",
    });
  }

  const extras = [...byId.values()]
    .filter((provider) => !defs.some((entry) => entry.id === provider.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...defs, ...extras];
}

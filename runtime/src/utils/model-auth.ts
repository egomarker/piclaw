import type { ModelRegistry } from "@earendil-works/pi-coding-agent";
import type { Api, Model } from "@earendil-works/pi-ai";

/** Resolved auth payload for provider requests in Piclaw runtime helpers. */
export type ModelRequestAuth =
  | { ok: true; apiKey?: string }
  | { ok: false; error: string };

/**
 * Resolve per-request auth from the Pi model registry.
 *
 * Upstream 0.67.6 replaced `getApiKeyAndHeaders()` with a simpler `getApiKey()`.
 * Provider-specific headers (e.g. Azure API-Management keys) now live on the
 * model object itself (`model.headers`) and are merged by the provider layer,
 * so we no longer need to thread them through here.
 *
 * We keep a fallback check for `getApiKeyAndHeaders` so older test doubles that
 * still implement the pre-0.67.6 surface don't break.
 */
export async function resolveModelRequestAuth(
  registry: ModelRegistry,
  model: Model<Api>,
): Promise<ModelRequestAuth> {
  const reg = registry as ModelRegistry & {
    getApiKeyAndHeaders?: (model: Model<Api>) => Promise<{ ok: boolean; apiKey?: string; error?: string }>;
    getApiKey?: (model: Model<Api>) => Promise<string | undefined>;
  };

  // Pre-0.67.6 compat path (test doubles may still use this)
  if (typeof reg.getApiKeyAndHeaders === "function") {
    const auth = await reg.getApiKeyAndHeaders(model);
    if (auth.ok) return { ok: true, apiKey: auth.apiKey };
    return { ok: false, error: auth.error || `No credentials available for ${model.provider}/${model.id}.` };
  }

  // Current upstream surface (0.67.6+)
  if (typeof reg.getApiKey === "function") {
    const apiKey = await reg.getApiKey(model);
    if (apiKey) return { ok: true, apiKey };
  }

  return { ok: false, error: `No credentials available for ${model.provider}/${model.id}.` };
}

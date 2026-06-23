import type { ModelRegistry } from "@earendil-works/pi-coding-agent";
import type { Api, Model } from "@earendil-works/pi-ai";

/** Resolved auth payload for provider requests in Piclaw runtime helpers. */
export type ModelRequestAuth =
  | { ok: true; apiKey?: string; headers?: Record<string, string>; env?: Record<string, string> }
  | { ok: false; error: string };

/**
 * Resolve per-request auth from the Pi model registry.
 *
 * Current Earendil exposes request auth through `getApiKeyAndHeaders()`, which
 * can include model/provider headers and provider-scoped env values. Forward all
 * fields to the provider call so custom models and stored credentials keep their
 * request-specific configuration.
 *
 * The `getApiKey()` fallback is only for older test doubles or older embedded
 * registries that predate the request-auth surface.
 */
export async function resolveModelRequestAuth(
  registry: ModelRegistry,
  model: Model<Api>,
): Promise<ModelRequestAuth> {
  const reg = registry as ModelRegistry & {
    getApiKeyAndHeaders?: (model: Model<Api>) => Promise<{ ok: boolean; apiKey?: string; headers?: Record<string, string>; env?: Record<string, string>; error?: string }>;
    getApiKey?: (model: Model<Api>) => Promise<string | undefined>;
  };

  if (typeof reg.getApiKeyAndHeaders === "function") {
    const auth = await reg.getApiKeyAndHeaders(model);
    if (auth.ok) return { ok: true, apiKey: auth.apiKey, headers: auth.headers, env: auth.env };
    return { ok: false, error: auth.error || `No credentials available for ${model.provider}/${model.id}.` };
  }

  // Legacy fallback.
  if (typeof reg.getApiKey === "function") {
    const apiKey = await reg.getApiKey(model);
    if (apiKey) return { ok: true, apiKey };
  }

  return { ok: false, error: `No credentials available for ${model.provider}/${model.id}.` };
}

/** Resolve one model/auth tuple shared by selective and progressive execution. */
import type { ModelRequestAuth } from "../../utils/model-auth.js";
import { resolveModelRequestAuth } from "../../utils/model-auth.js";

export type SmartCompactionModelRequest =
  | { ok: true; model: any; auth: Extract<ModelRequestAuth, { ok: true }> }
  | { ok: false; error: string };

export async function resolveSmartCompactionModelRequest(ctx: {
  model?: unknown;
}, modelRuntime: unknown, options: { resolveDirectRequestAuth?: boolean } = {}): Promise<SmartCompactionModelRequest> {
  // Dedicated compaction-model selection belongs at this seam. Keeping model
  // and auth together prevents budgets from being calculated for one model
  // while the request is sent through another provider.
  const model = ctx.model as any;
  if (!model) return { ok: false, error: "No model is available for smart compaction" };

  if (!modelRuntime) return { ok: false, error: "No model runtime is available for smart compaction" };
  if (!options.resolveDirectRequestAuth) return { ok: true, model, auth: { ok: true } };

  const auth = await resolveModelRequestAuth(modelRuntime as any, model);
  if (!auth.ok) return { ok: false, error: auth.error };
  const resolvedModel = auth.baseUrl ? { ...model, baseUrl: auth.baseUrl } : model;
  return { ok: true, model: resolvedModel, auth };
}

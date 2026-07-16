/** Resolve one model/auth tuple shared by selective and progressive execution. */
import type { ModelRequestAuth } from "../../utils/model-auth.js";
import { resolveModelRequestAuth } from "../../utils/model-auth.js";

export type SmartCompactionModelRequest =
  | { ok: true; model: any; auth: Extract<ModelRequestAuth, { ok: true }> }
  | { ok: false; error: string };

export async function resolveSmartCompactionModelRequest(ctx: {
  model?: unknown;
  modelRegistry?: unknown;
}): Promise<SmartCompactionModelRequest> {
  // Dedicated compaction-model selection belongs at this seam. Keeping model
  // and auth together prevents budgets from being calculated for one model
  // while the request is sent through another provider.
  const model = ctx.model as any;
  if (!model) return { ok: false, error: "No model is available for smart compaction" };

  const auth = await resolveModelRequestAuth(ctx.modelRegistry as any, model);
  if (!auth.ok) return { ok: false, error: auth.error };
  return { ok: true, model, auth };
}

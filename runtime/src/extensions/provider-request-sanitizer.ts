/**
 * Provider request sanitization.
 *
 * Responses item IDs are provider-owned replay handles, not client-generated
 * identifiers. Two failure modes matter here:
 *
 * 1. Duplicate IDs in one request are rejected. Optional duplicate IDs can be
 *    omitted; duplicate reasoning items must be dropped because their ID is
 *    required and inventing a replacement creates an invalid provider handle.
 * 2. GitHub Copilot Responses IDs are scoped to a connection. Persisting them
 *    in a Piclaw session and replaying them after resume/restart produces
 *    `input item ID does not belong to this connection`. Copilot replay is made
 *    stateless by dropping opaque reasoning items and optional input-item IDs;
 *    textual assistant history and function-call `call_id` pairing remain.
 */
import type { ExtensionFactory } from "@earendil-works/pi-coding-agent";

type PayloadRecord = Record<string, unknown>;

export interface ProviderPayloadSanitizerOptions {
  stripConnectionBoundIds?: boolean;
}

function isPayloadRecord(value: unknown): value is PayloadRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function cloneWithoutId(item: PayloadRecord): PayloadRecord {
  const { id: _id, ...rest } = item;
  return rest;
}

/**
 * Return the original payload when no change is needed; otherwise return a
 * shallow-cloned payload/input array without mutating provider-library data.
 */
export function sanitizeProviderPayloadItemIds(
  payload: unknown,
  options: ProviderPayloadSanitizerOptions = {},
): unknown {
  if (!isPayloadRecord(payload) || !Array.isArray(payload.input)) return payload;

  const seen = new Set<string>();
  let changed = false;
  const input: unknown[] = [];

  for (const rawItem of payload.input) {
    if (!isPayloadRecord(rawItem)) {
      input.push(rawItem);
      continue;
    }

    const itemType = typeof rawItem.type === "string" ? rawItem.type : "";
    const itemId = typeof rawItem.id === "string" && rawItem.id ? rawItem.id : null;

    if (options.stripConnectionBoundIds) {
      if (itemType === "reasoning") {
        changed = true;
        continue;
      }
      if (itemId) {
        changed = true;
        input.push(cloneWithoutId(rawItem));
        continue;
      }
      input.push(rawItem);
      continue;
    }

    if (!itemId || !seen.has(itemId)) {
      if (itemId) seen.add(itemId);
      input.push(rawItem);
      continue;
    }

    changed = true;
    if (itemType === "reasoning") continue;
    input.push(cloneWithoutId(rawItem));
  }

  if (!changed) return payload;
  return { ...payload, input };
}

function needsStatelessCopilotReplay(ctx: unknown): boolean {
  const model = (ctx as { model?: { provider?: unknown; api?: unknown } } | null | undefined)?.model;
  return model?.provider === "github-copilot" && model?.api === "openai-responses";
}

export const providerRequestSanitizer: ExtensionFactory = (pi) => {
  pi.on("before_provider_request", async (event, ctx) => sanitizeProviderPayloadItemIds(
    event.payload,
    { stripConnectionBoundIds: needsStatelessCopilotReplay(ctx) },
  ));
};

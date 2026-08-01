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

import { createLogger } from "../utils/logger.js";

const log = createLogger("extensions.provider-request-sanitizer");

type PayloadRecord = Record<string, unknown>;

export interface ProviderPayloadSanitizerOptions {
  stripConnectionBoundIds?: boolean;
  onOrphanFunctionCallOutputs?: (diagnostic: OrphanFunctionCallOutputDiagnostic) => void;
}

export interface OrphanFunctionCallOutputDiagnostic {
  removedCount: number;
  callIds: string[];
}

function isPayloadRecord(value: unknown): value is PayloadRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function cloneWithoutId(item: PayloadRecord): PayloadRecord {
  const { id: _id, ...rest } = item;
  return rest;
}

function readNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
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

  const precedingFunctionCallIds = new Set<string>();
  const orphanCallIds: string[] = [];
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

    if (itemType === "function_call") {
      const callId = readNonEmptyString(rawItem.call_id);
      if (callId) precedingFunctionCallIds.add(callId);
    }
    if (itemType === "function_call_output") {
      const callId = readNonEmptyString(rawItem.call_id);
      if (callId && !precedingFunctionCallIds.has(callId)) {
        changed = true;
        orphanCallIds.push(callId);
        continue;
      }
    }

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

  if (orphanCallIds.length > 0) {
    options.onOrphanFunctionCallOutputs?.({
      removedCount: orphanCallIds.length,
      callIds: [...new Set(orphanCallIds)].slice(0, 32).map((callId) => callId.slice(0, 128)),
    });
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
    {
      stripConnectionBoundIds: needsStatelessCopilotReplay(ctx),
      onOrphanFunctionCallOutputs: (diagnostic) => {
        log.warn("Removed orphan OpenAI Responses function-call outputs before provider dispatch", {
          operation: "provider_request_sanitizer.orphan_function_call_outputs",
          removedCount: diagnostic.removedCount,
          callIds: diagnostic.callIds,
          provider: ctx.model?.provider,
          modelId: ctx.model?.id,
          api: ctx.model?.api,
        });
      },
    },
  ));
};

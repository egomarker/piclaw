/**
 * extensions/provider-request-sanitizer.ts — Defensive provider payload cleanup.
 *
 * The OpenAI Responses API rejects a request when any input item repeats an
 * `id`, even if the duplicated IDs came from replaying cross-model assistant
 * history.  This extension runs after pi-ai has built the provider payload and
 * before the HTTP request is sent, ensuring duplicate Responses item IDs are
 * made unique without changing the original first occurrence.
 */

import { createHash } from "node:crypto";

import type { ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";

import { createLogger } from "../utils/logger.js";

const log = createLogger("extensions.provider-request-sanitizer");
const MAX_RESPONSE_ITEM_ID_LENGTH = 64;

type MutableRecord = Record<string, unknown>;

function isRecord(value: unknown): value is MutableRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sanitizeIdPart(value: string): string {
  const sanitized = value.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+$/g, "");
  return sanitized || "item";
}

function shortHash(value: string): string {
  return createHash("sha256").update(value).digest("base64url").slice(0, 10);
}

function buildUniqueDuplicateId(originalId: string, itemIndex: number, usedIds: Set<string>): string {
  const suffixBase = `${itemIndex.toString(36)}_${shortHash(`${originalId}:${itemIndex}`)}`;
  let suffix = `_${suffixBase}`;
  let base = sanitizeIdPart(originalId);
  if (base.length + suffix.length > MAX_RESPONSE_ITEM_ID_LENGTH) {
    base = base.slice(0, MAX_RESPONSE_ITEM_ID_LENGTH - suffix.length).replace(/_+$/g, "") || "item";
  }

  let candidate = `${base}${suffix}`;
  let attempt = 1;
  while (usedIds.has(candidate)) {
    suffix = `_${suffixBase}_${attempt.toString(36)}`;
    base = sanitizeIdPart(originalId);
    if (base.length + suffix.length > MAX_RESPONSE_ITEM_ID_LENGTH) {
      base = base.slice(0, MAX_RESPONSE_ITEM_ID_LENGTH - suffix.length).replace(/_+$/g, "") || "item";
    }
    candidate = `${base}${suffix}`;
    attempt++;
  }
  return candidate;
}

/**
 * Return a provider payload with duplicate `input[].id` values fixed.
 *
 * The function is intentionally narrow: it only touches Responses-style payloads
 * with an array `input`, and only clones the payload/input/items when a duplicate
 * item ID is present.
 */
export function sanitizeProviderPayloadItemIds(payload: unknown): unknown {
  if (!isRecord(payload) || !Array.isArray(payload.input)) return payload;

  const usedIds = new Set<string>();
  let sanitizedInput: unknown[] | null = null;
  let duplicateCount = 0;

  for (let index = 0; index < payload.input.length; index++) {
    const item = payload.input[index];
    if (!isRecord(item) || typeof item.id !== "string" || item.id.length === 0) continue;

    if (!usedIds.has(item.id)) {
      usedIds.add(item.id);
      continue;
    }

    if (!sanitizedInput) sanitizedInput = payload.input.slice();
    const replacementId = buildUniqueDuplicateId(item.id, index, usedIds);
    usedIds.add(replacementId);
    sanitizedInput[index] = { ...item, id: replacementId };
    duplicateCount++;
  }

  if (!sanitizedInput) return payload;

  log.warn("Deduplicated duplicate provider input item IDs", { duplicateCount });
  return { ...payload, input: sanitizedInput };
}

export const providerRequestSanitizer: ExtensionFactory = (pi: ExtensionAPI): void => {
  pi.on("before_provider_request", async (event) => sanitizeProviderPayloadItemIds(event.payload));
};

/**
 * extensions/provider-response-diagnostics.ts — Provider response diagnostics.
 *
 * Hooks into `after_provider_response` (available since pi-coding-agent 0.69.0)
 * to log provider response metadata for diagnostics:
 *
 * - HTTP status codes
 * - Rate-limit headers (x-ratelimit-*, retry-after)
 * - Request ID headers for support/debugging
 *
 * This extension is observational — it never modifies the response or session.
 */

import type { ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";

import { createLogger } from "../utils/logger.js";

const log = createLogger("extensions.provider-response-diagnostics");

/** Headers worth capturing for diagnostics (lowercase). */
const DIAGNOSTIC_HEADER_PREFIXES = [
  "x-ratelimit",
  "retry-after",
  "x-request-id",
  "x-ms-request-id",
  "cf-ray",
  "x-served-by",
  "anthropic-ratelimit",
  "x-stainless-",
];

export function extractDiagnosticHeaders(headers: Record<string, string>): Record<string, string> | null {
  const result: Record<string, string> = {};
  let count = 0;
  for (const [key, value] of Object.entries(headers)) {
    const lower = key.toLowerCase();
    if (DIAGNOSTIC_HEADER_PREFIXES.some((prefix) => lower.startsWith(prefix))) {
      result[lower] = value;
      count++;
    }
  }
  return count > 0 ? result : null;
}

export const providerResponseDiagnostics: ExtensionFactory = (pi: ExtensionAPI) => {
  pi.on("after_provider_response", async (event) => {
    const { status, headers } = event;

    // Log non-200 responses at warn level
    if (status >= 400) {
      const diagnostic = extractDiagnosticHeaders(headers);
      log.warn("Provider returned error status", {
        status,
        ...(diagnostic ? { headers: diagnostic } : {}),
      });
      return;
    }

    // Log rate-limit headers at debug level for healthy responses
    const diagnostic = extractDiagnosticHeaders(headers);
    if (diagnostic) {
      log.debug("Provider response diagnostics", {
        status,
        headers: diagnostic,
      });
    }
  });
};

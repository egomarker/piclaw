/**
 * types/pi-ai-deep-imports.d.ts – Local declaration shim for deep pi-ai provider helpers.
 *
 * These helpers are available at runtime but not part of the package export map,
 * so we provide a narrow declaration seam to keep TypeScript builds strict.
 */
declare module "@earendil-works/pi-ai/dist/providers/openai-responses-shared.js" {
  export const convertResponsesMessages: (...args: unknown[]) => unknown;
  export const convertResponsesTools: (...args: unknown[]) => unknown;
  export const processResponsesStream: (...args: unknown[]) => Promise<void>;
}

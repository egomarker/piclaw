/** Provider payload-integrity error classifiers shared by recovery and web guidance. */

/**
 * Match OpenAI Responses rejecting a function-call output whose call is absent.
 *
 * Keep this narrow: generic HTTP 400/invalid_request_body errors can describe
 * user-correctable model parameters and should retain their existing handling.
 */
export function isOrphanFunctionCallOutputError(errorText: string | null | undefined): boolean {
  if (!errorText) return false;
  return /no tool call found for function call output with call_id\b/i.test(errorText);
}

/**
 * web/handlers/provider-error-format.ts — Parse provider error envelopes for user-visible display.
 */

export type ProviderErrorCategory =
  | "rate_limit"
  | "auth"
  | "quota"
  | "server"
  | "network"
  | "model_config"
  | "provider";

export type ProviderErrorSeverity = "warning" | "error" | "critical" | "info";

export interface ParsedProviderError {
  provider: string | null;
  message: string;
  type: string | null;
  code: string | null;
  status: number | null;
  requestId: string | null;
  sequenceNumber: number | null;
}

export interface ProviderErrorPresentation {
  category: ProviderErrorCategory;
  label: string;
  title: string;
  detail: string;
  severity: ProviderErrorSeverity;
  requestId: string | null;
  code: string | null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function readNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function titleCaseProvider(value: string | null): string | null {
  if (!value) return null;
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return asRecord(JSON.parse(text.slice(start, end + 1)));
  } catch {
    return null;
  }
}

function extractRequestId(text: string, parsed: Record<string, unknown>, nested: Record<string, unknown> | null): string | null {
  const explicit = readString(
    parsed.request_id,
    parsed.requestId,
    parsed["x-request-id"],
    nested?.request_id,
    nested?.requestId,
    nested?.["x-request-id"],
  );
  if (explicit) return explicit;

  const match = text.match(/\b(?:request[_ -]?id|req[_ -]?id)\s*(?:[:=]|is|ID)?\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[A-Za-z0-9._:-]{8,})/i);
  return match?.[1] || null;
}

function inferCategory(text: string): ProviderErrorCategory {
  if (/\b429\b|rate[ -]?limit|too many requests|retry-after/i.test(text)) return "rate_limit";
  if (/authentication failed|credentials may have expired|no api key(?: found| for provider)?|token refresh failed\s*:\s*401|re-authenticate|unauthorized|\b401\b|\b403\b|invalid.*api.*key|api.*key.*invalid|token.*expired|oauth.*expired|refresh.*token/i.test(text)) return "auth";
  if (/quota|usage.*limit|out of.*usage|billing|insufficient.*funds|exceeded.*limit|credit/i.test(text)) return "quota";
  if (/\b5\d\d\b|server[_ -]?error|internal[_ -]?error|bad gateway|service unavailable|gateway timeout|overloaded/i.test(text)) return "server";
  if (/\bENOTFOUND\b|\bECONNREFUSED\b|\bETIMEDOUT\b|\bECONNRESET\b|getaddrinfo|dns.*failed|network.*error|connection.*(?:error|refused|lost|ended|closed)|websocket.*(?:closed|ended|1006)|fetch failed|socket hang up/i.test(text)) return "network";
  if (/no model selected|select a model|use \/model|use \/login|model not found|deployment.*not found/i.test(text)) return "model_config";
  return "provider";
}

function titleForCategory(category: ProviderErrorCategory, provider: string | null): string {
  const prefix = provider ? `${provider} ` : "Provider ";
  switch (category) {
    case "rate_limit":
      return `${prefix}rate limit`;
    case "auth":
      return `${prefix}authentication failed`;
    case "quota":
      return `${prefix}quota exceeded`;
    case "server":
      return `${prefix}server error`;
    case "network":
      return `${prefix}network error`;
    case "model_config":
      return "Model configuration error";
    default:
      return `${prefix}error`;
  }
}

function labelForCategory(category: ProviderErrorCategory): string {
  switch (category) {
    case "rate_limit":
      return "rate limit";
    case "auth":
      return "provider auth";
    case "quota":
      return "quota";
    case "server":
      return "provider";
    case "network":
      return "network";
    case "model_config":
      return "model";
    default:
      return "provider";
  }
}

function severityForCategory(category: ProviderErrorCategory): ProviderErrorSeverity {
  return category === "rate_limit" || category === "server" ? "warning" : "error";
}

function buildDetail(parsed: ParsedProviderError): string {
  const details: string[] = [];
  if (parsed.message) details.push(parsed.message);

  const metadata: string[] = [];
  if (parsed.code) metadata.push(`code: ${parsed.code}`);
  if (parsed.type && parsed.type !== parsed.code) metadata.push(`type: ${parsed.type}`);
  if (parsed.status) metadata.push(`status: ${parsed.status}`);
  if (parsed.requestId) metadata.push(`request id: ${parsed.requestId}`);
  if (parsed.sequenceNumber !== null) metadata.push(`sequence: ${parsed.sequenceNumber}`);
  if (metadata.length > 0) details.push(metadata.join("; "));

  return details.join(" — ").slice(0, 900);
}

export function parseProviderError(errorText: string | null | undefined): ParsedProviderError | null {
  const raw = String(errorText || "").trim();
  if (!raw) return null;

  const prefixMatch = raw.match(/^([A-Za-z][A-Za-z0-9 ._-]{1,40})\s+error\s*:/i);
  const parsed = extractJsonObject(raw);
  if (!parsed && !prefixMatch) return null;

  const nested = asRecord(parsed?.error) || asRecord(parsed?.errors) || null;
  const message = readString(nested?.message, parsed?.message, nested?.error, parsed?.error_description, parsed?.detail)
    || (prefixMatch && !parsed ? raw.slice(prefixMatch[0].length).trim() : null)
    || raw;
  const provider = titleCaseProvider(prefixMatch?.[1] || readString(parsed?.provider, parsed?.provider_id, nested?.provider));
  const code = readString(nested?.code, parsed?.code, nested?.error_code, parsed?.error_code);
  const type = readString(nested?.type, parsed?.type, nested?.error, parsed?.error);
  const status = readNumber(nested?.status, nested?.status_code, parsed?.status, parsed?.status_code);
  const requestId = parsed ? extractRequestId(raw, parsed, nested) : extractRequestId(raw, {}, null);
  const sequenceNumber = readNumber(parsed?.sequence_number, parsed?.sequenceNumber, nested?.sequence_number, nested?.sequenceNumber);

  return {
    provider,
    message,
    type,
    code,
    status,
    requestId,
    sequenceNumber,
  };
}

export function formatProviderError(errorText: string | null | undefined): ProviderErrorPresentation | null {
  const parsed = parseProviderError(errorText);
  if (!parsed) return null;

  const category = inferCategory([
    parsed.message,
    parsed.type,
    parsed.code,
    parsed.status ? String(parsed.status) : "",
  ].filter(Boolean).join(" "));

  return {
    category,
    label: labelForCategory(category),
    title: titleForCategory(category, parsed.provider),
    detail: buildDetail(parsed),
    severity: severityForCategory(category),
    requestId: parsed.requestId,
    code: parsed.code,
  };
}

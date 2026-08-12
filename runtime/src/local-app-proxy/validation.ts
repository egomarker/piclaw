import {
  MAX_LOCAL_APPS,
  type LocalAppInput,
  type PersistentLocalApp,
  LocalAppProxyError,
} from "./types.js";

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function validateLocalAppName(value: unknown): string {
  const name = String(value || "").trim();
  if (!name) throw new LocalAppProxyError("invalid_name", "Name is required.");
  if (name.length > 80) throw new LocalAppProxyError("invalid_name", "Name must be 80 characters or fewer.");
  return name;
}

export function validateLocalAppSlug(value: unknown): string {
  const slug = String(value || "").trim().toLowerCase();
  if (!SLUG_RE.test(slug)) {
    throw new LocalAppProxyError(
      "invalid_slug",
      "Slug must contain lowercase letters, numbers, and hyphens (1-63 characters).",
    );
  }
  return slug;
}

export function slugifyLocalAppName(value: unknown): string {
  const candidate = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63)
    .replace(/-+$/g, "");
  return SLUG_RE.test(candidate) ? candidate : "local-app";
}

export function validateLocalAppPort(value: unknown, piclawPort?: number): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new LocalAppProxyError("invalid_port", "Port must be an integer between 1024 and 65535.");
  }
  if (piclawPort !== undefined && port === piclawPort) {
    throw new LocalAppProxyError("recursive_port", "Cannot proxy Piclaw's own listening port.", 409);
  }
  return port;
}

function validatePathSegments(path: string): void {
  let decoded: string;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    throw new LocalAppProxyError("invalid_path", "Path contains malformed URL encoding.");
  }
  if (decoded.includes("\\") || decoded.split("/").some((segment) => segment === "." || segment === "..")) {
    throw new LocalAppProxyError("invalid_path", "Path cannot contain backslashes or dot segments.");
  }
}

export function normalizeLocalAppPath(
  value: unknown,
  options: { trailingSlash: boolean; fallback: string },
): string {
  let path = typeof value === "string" ? value.trim() : "";
  if (!path) path = options.fallback;
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\0") || path.includes("?") || path.includes("#") || path.includes("://")) {
    throw new LocalAppProxyError("invalid_path", "Path must be an absolute URL path without a host, query, or fragment.");
  }
  validatePathSegments(path);
  path = path.replace(/\/{2,}/g, "/");
  if (options.trailingSlash) return path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
  return path.length > 1 ? path.replace(/\/+$/, "") || "/" : "/";
}

export function normalizeLocalAppInput(
  value: LocalAppInput,
  options: { piclawPort?: number; fallbackSlug?: string } = {},
): Required<LocalAppInput> {
  const name = validateLocalAppName(value?.name);
  return {
    name,
    slug: validateLocalAppSlug(value?.slug || options.fallbackSlug || slugifyLocalAppName(name)),
    port: validateLocalAppPort(value?.port, options.piclawPort),
    upstreamBasePath: normalizeLocalAppPath(value?.upstreamBasePath, { trailingSlash: true, fallback: "/" }),
    healthPath: normalizeLocalAppPath(value?.healthPath, { trailingSlash: false, fallback: "/" }),
    enabled: value?.enabled !== false,
  };
}

function validateIsoDate(value: unknown, field: string): string {
  const input = String(value || "").trim();
  if (!input || Number.isNaN(Date.parse(input))) {
    throw new LocalAppProxyError("invalid_config", `Invalid ${field} timestamp in local app proxy config.`);
  }
  return new Date(input).toISOString();
}

export function validatePersistentLocalApps(value: unknown, piclawPort?: number): PersistentLocalApp[] {
  if (!Array.isArray(value)) throw new LocalAppProxyError("invalid_config", "Local app proxy apps must be an array.");
  if (value.length > MAX_LOCAL_APPS) {
    throw new LocalAppProxyError("too_many_apps", `At most ${MAX_LOCAL_APPS} local apps can be configured.`);
  }

  const ids = new Set<string>();
  const slugs = new Set<string>();
  return value.map((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new LocalAppProxyError("invalid_config", `Local app proxy entry ${index + 1} must be an object.`);
    }
    const record = raw as Record<string, unknown>;
    const id = String(record.id || "").trim();
    if (!id || id.length > 100) throw new LocalAppProxyError("invalid_config", `Local app proxy entry ${index + 1} has an invalid id.`);
    if (ids.has(id)) throw new LocalAppProxyError("duplicate_id", `Duplicate local app id: ${id}`, 409);
    ids.add(id);

    const normalized = normalizeLocalAppInput({
      name: String(record.name || ""),
      slug: String(record.slug || ""),
      port: Number(record.port),
      upstreamBasePath: typeof record.upstreamBasePath === "string" ? record.upstreamBasePath : "/",
      healthPath: typeof record.healthPath === "string" ? record.healthPath : "/",
      enabled: record.enabled !== false,
    }, { piclawPort });
    if (slugs.has(normalized.slug)) {
      throw new LocalAppProxyError("duplicate_slug", `Duplicate local app slug: ${normalized.slug}`, 409);
    }
    slugs.add(normalized.slug);

    return {
      id,
      ...normalized,
      createdAt: validateIsoDate(record.createdAt, "createdAt"),
      updatedAt: validateIsoDate(record.updatedAt, "updatedAt"),
    };
  });
}

export function validateProxySuffix(path: string): string {
  if (!path.startsWith("/")) throw new LocalAppProxyError("invalid_path", "Invalid proxied request path.");
  validatePathSegments(path);
  return path;
}

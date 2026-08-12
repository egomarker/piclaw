/** Shared types and limits for authenticated path-based local app proxying. */

export const LOCAL_APP_PUBLIC_ROOT = "/apps";
export const DEFAULT_LEASE_MINUTES = 120;
export const MIN_LEASE_MINUTES = 5;
export const MAX_LEASE_MINUTES = 24 * 60;
export const MAX_LOCAL_APPS = 64;
export const MAX_AGENT_APPS_PER_CHAT = 8;
export const MAX_PROXY_REQUEST_BODY_BYTES = 32 * 1024 * 1024;

export interface PersistentLocalApp {
  id: string;
  name: string;
  slug: string;
  port: number;
  upstreamBasePath: string;
  healthPath: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocalAppLease extends PersistentLocalApp {
  ownerChatJid: string;
  expiresAt: string;
}

export interface ResolvedLocalApp extends PersistentLocalApp {
  kind: "persistent" | "lease";
  ownerChatJid?: string;
  expiresAt?: string;
  publicPath: string;
  upstreamOrigin: string;
}

export interface LocalAppHealth {
  state: "unknown" | "reachable" | "unreachable";
  checkedAt?: string;
  statusCode?: number;
  latencyMs?: number;
  error?: string;
}

export interface LocalAppInput {
  name: string;
  slug?: string;
  port: number;
  upstreamBasePath?: string;
  healthPath?: string;
  enabled?: boolean;
}

export type LocalAppPatch = Partial<Omit<LocalAppInput, "slug">> & {
  slug?: string;
};

export class LocalAppProxyError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = "LocalAppProxyError";
  }
}

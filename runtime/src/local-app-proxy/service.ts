import { getWebServerConfig } from "../core/config-web.js";
import { createUuid } from "../utils/ids.js";
import { createLogger } from "../utils/logger.js";
import { readPersistentLocalApps, writePersistentLocalApps } from "./config.js";
import { proxyLocalAppHttpRequest, type LocalAppProxyFetch } from "./http-proxy.js";
import {
  DEFAULT_LEASE_MINUTES,
  LOCAL_APP_PUBLIC_ROOT,
  MAX_AGENT_APPS_PER_CHAT,
  MAX_LEASE_MINUTES,
  MAX_LOCAL_APPS,
  MIN_LEASE_MINUTES,
  LocalAppProxyError,
  type LocalAppHealth,
  type LocalAppInput,
  type LocalAppLease,
  type LocalAppPatch,
  type PersistentLocalApp,
  type ResolvedLocalApp,
} from "./types.js";
import { buildLocalAppPublicPath, buildLocalAppUpstreamUrl, parseLocalAppPublicPath } from "./urls.js";
import { normalizeLocalAppInput, validateLocalAppSlug } from "./validation.js";

const log = createLogger("local-app-proxy.service");
const HEALTH_TIMEOUT_MS = 2_000;

export interface LocalAppProxyServiceOptions {
  readPersistent?: () => PersistentLocalApp[];
  writePersistent?: (apps: PersistentLocalApp[]) => PersistentLocalApp[];
  getPiclawPort?: () => number;
  now?: () => number;
  fetchImpl?: LocalAppProxyFetch;
}

export interface LocalAppProxyListEntry extends ResolvedLocalApp {
  health: LocalAppHealth;
}

function compareApps(left: ResolvedLocalApp, right: ResolvedLocalApp): number {
  return left.name.localeCompare(right.name, undefined, { sensitivity: "base" }) || left.slug.localeCompare(right.slug);
}

export class LocalAppProxyService {
  private persistent = new Map<string, PersistentLocalApp>();
  private leases = new Map<string, LocalAppLease>();
  private health = new Map<string, LocalAppHealth>();
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;
  private started = false;
  private configError: string | null = null;

  constructor(private readonly options: LocalAppProxyServiceOptions = {}) {}

  start(): void {
    if (this.started) return;
    this.started = true;
    this.reloadPersistent();
    this.scheduleExpiry();
  }

  stop(): void {
    this.started = false;
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    this.leases.clear();
    for (const [id] of this.health) {
      if (!this.persistent.has(id)) this.health.delete(id);
    }
  }

  reloadPersistent(): void {
    try {
      const apps = this.readPersistent();
      this.persistent = new Map(apps.map((app) => [app.id, app]));
      this.configError = null;
    } catch (error) {
      this.persistent.clear();
      this.configError = error instanceof Error ? error.message : String(error);
      log.error("Invalid local app proxy configuration; persistent mappings are disabled", {
        operation: "local_app_proxy.config_invalid",
        err: error,
      });
    }
  }

  getConfigurationError(): string | null {
    return this.configError;
  }

  list(): LocalAppProxyListEntry[] {
    this.pruneExpired();
    const result = [
      ...Array.from(this.persistent.values(), (app) => this.resolve(app, "persistent")),
      ...Array.from(this.leases.values(), (app) => this.resolve(app, "lease")),
    ].sort(compareApps);
    return result.map((app) => ({
      ...app,
      health: this.health.get(app.id) ?? { state: "unknown" },
    }));
  }

  get(id: string): LocalAppProxyListEntry {
    const app = this.findById(id);
    return {
      ...app,
      health: this.health.get(id) ?? { state: "unknown" },
    };
  }

  createPersistent(input: LocalAppInput): ResolvedLocalApp {
    this.ensureConfigUsable();
    const normalized = normalizeLocalAppInput(input, { piclawPort: this.piclawPort });
    this.assertCapacity();
    this.assertSlugAvailable(normalized.slug);
    const now = this.nowIso();
    const app: PersistentLocalApp = {
      id: createUuid("app"),
      ...normalized,
      createdAt: now,
      updatedAt: now,
    };
    this.commitPersistent([...this.persistent.values(), app]);
    log.info("Created persistent local app mapping", {
      operation: "local_app_proxy.create_persistent",
      id: app.id,
      slug: app.slug,
      port: app.port,
    });
    return this.resolve(app, "persistent");
  }

  updatePersistent(id: string, patch: LocalAppPatch): ResolvedLocalApp {
    this.ensureConfigUsable();
    const existing = this.persistent.get(this.requireId(id));
    if (!existing) throw new LocalAppProxyError("not_found", "Local app mapping not found.", 404);
    const normalized = normalizeLocalAppInput({
      name: patch.name ?? existing.name,
      slug: patch.slug ?? existing.slug,
      port: patch.port ?? existing.port,
      upstreamBasePath: patch.upstreamBasePath ?? existing.upstreamBasePath,
      healthPath: patch.healthPath ?? existing.healthPath,
      enabled: patch.enabled ?? existing.enabled,
    }, { piclawPort: this.piclawPort });
    this.assertSlugAvailable(normalized.slug, existing.id);
    const updated: PersistentLocalApp = {
      ...existing,
      ...normalized,
      updatedAt: this.nowIso(),
    };
    this.commitPersistent(Array.from(this.persistent.values(), (app) => app.id === id ? updated : app));
    this.health.delete(id);
    log.info("Updated persistent local app mapping", {
      operation: "local_app_proxy.update_persistent",
      id,
      slug: updated.slug,
      port: updated.port,
      enabled: updated.enabled,
    });
    return this.resolve(updated, "persistent");
  }

  removePersistent(id: string): void {
    this.ensureConfigUsable();
    const normalizedId = this.requireId(id);
    const existing = this.persistent.get(normalizedId);
    if (!existing) throw new LocalAppProxyError("not_found", "Local app mapping not found.", 404);
    this.commitPersistent(Array.from(this.persistent.values()).filter((app) => app.id !== normalizedId));
    this.health.delete(normalizedId);
    log.info("Removed persistent local app mapping", {
      operation: "local_app_proxy.remove_persistent",
      id: normalizedId,
      slug: existing.slug,
      port: existing.port,
    });
  }

  createLease(
    input: LocalAppInput & { ttlMinutes?: number },
    ownerChatJid: string,
  ): ResolvedLocalApp {
    this.pruneExpired();
    const owner = String(ownerChatJid || "").trim();
    if (!owner) throw new LocalAppProxyError("invalid_owner", "A chat owner is required.");
    const normalized = normalizeLocalAppInput(input, { piclawPort: this.piclawPort });
    const ownerLeaseCount = Array.from(this.leases.values()).filter((app) => app.ownerChatJid === owner).length;
    if (ownerLeaseCount >= MAX_AGENT_APPS_PER_CHAT) {
      throw new LocalAppProxyError("lease_limit", `A chat may own at most ${MAX_AGENT_APPS_PER_CHAT} temporary local apps.`, 409);
    }
    this.assertCapacity();
    this.assertSlugAvailable(normalized.slug);
    const now = this.nowMs;
    const app: LocalAppLease = {
      id: createUuid("app"),
      ...normalized,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
      ownerChatJid: owner,
      expiresAt: new Date(now + this.validateTtl(input.ttlMinutes) * 60_000).toISOString(),
    };
    this.leases.set(app.id, app);
    this.scheduleExpiry();
    log.info("Created temporary local app mapping", {
      operation: "local_app_proxy.create_lease",
      id: app.id,
      slug: app.slug,
      port: app.port,
      ownerChatJid: owner,
      expiresAt: app.expiresAt,
    });
    return this.resolve(app, "lease");
  }

  renewLease(id: string, ownerChatJid: string, ttlMinutes?: number): ResolvedLocalApp {
    this.pruneExpired();
    const lease = this.getOwnedLease(id, ownerChatJid);
    const now = this.nowMs;
    const renewed: LocalAppLease = {
      ...lease,
      updatedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + this.validateTtl(ttlMinutes) * 60_000).toISOString(),
    };
    this.leases.set(renewed.id, renewed);
    this.scheduleExpiry();
    log.info("Renewed temporary local app mapping", {
      operation: "local_app_proxy.renew_lease",
      id: renewed.id,
      slug: renewed.slug,
      ownerChatJid: renewed.ownerChatJid,
      expiresAt: renewed.expiresAt,
    });
    return this.resolve(renewed, "lease");
  }

  removeLease(id: string, ownerChatJid: string): void {
    const lease = this.getOwnedLease(id, ownerChatJid);
    this.removeLeaseRecord(lease, "local_app_proxy.remove_lease");
  }

  removeAny(id: string): void {
    const normalizedId = this.requireId(id);
    if (this.persistent.has(normalizedId)) {
      this.removePersistent(normalizedId);
      return;
    }
    const lease = this.leases.get(normalizedId);
    if (!lease) throw new LocalAppProxyError("not_found", "Local app mapping not found.", 404);
    this.removeLeaseRecord(lease, "local_app_proxy.remove_lease");
  }

  removeFromSettings(id: string, ownerChatJid: string): void {
    const normalizedId = this.requireId(id);
    if (this.persistent.has(normalizedId)) {
      this.removePersistent(normalizedId);
      return;
    }
    this.removeLease(normalizedId, ownerChatJid);
  }

  promoteLease(id: string, ownerChatJid?: string): ResolvedLocalApp {
    this.ensureConfigUsable();
    this.pruneExpired();
    const normalizedId = this.requireId(id);
    const lease = this.leases.get(normalizedId);
    if (!lease) throw new LocalAppProxyError("not_found", "Temporary local app mapping not found.", 404);
    if (ownerChatJid !== undefined && lease.ownerChatJid !== String(ownerChatJid || "").trim()) {
      throw new LocalAppProxyError("not_owner", "This temporary local app belongs to another chat.", 403);
    }
    const persistent: PersistentLocalApp = {
      id: lease.id,
      name: lease.name,
      slug: lease.slug,
      port: lease.port,
      upstreamBasePath: lease.upstreamBasePath,
      healthPath: lease.healthPath,
      enabled: lease.enabled,
      createdAt: lease.createdAt,
      updatedAt: this.nowIso(),
    };
    // Persist first so a failed config write leaves the working lease intact.
    this.commitPersistent([...this.persistent.values(), persistent]);
    this.leases.delete(normalizedId);
    this.scheduleExpiry();
    log.info("Promoted temporary local app mapping", {
      operation: "local_app_proxy.promote_lease",
      id: persistent.id,
      slug: persistent.slug,
      port: persistent.port,
      ownerChatJid: lease.ownerChatJid,
    });
    return this.resolve(persistent, "persistent");
  }

  resolvePath(pathname: string): { app: ResolvedLocalApp; suffix: string; needsTrailingSlashRedirect: boolean } | null {
    this.pruneExpired();
    const parsed = parseLocalAppPublicPath(pathname);
    if (!parsed) return null;
    let normalizedSlug: string;
    try {
      normalizedSlug = validateLocalAppSlug(parsed.slug);
    } catch {
      return null;
    }
    const persistent = Array.from(this.persistent.values()).find((app) => app.slug === normalizedSlug);
    if (persistent) {
      if (!persistent.enabled) return null;
      return { app: this.resolve(persistent, "persistent"), suffix: parsed.suffix, needsTrailingSlashRedirect: parsed.needsTrailingSlashRedirect };
    }
    const lease = Array.from(this.leases.values()).find((app) => app.slug === normalizedSlug);
    if (!lease || !lease.enabled) return null;
    return { app: this.resolve(lease, "lease"), suffix: parsed.suffix, needsTrailingSlashRedirect: parsed.needsTrailingSlashRedirect };
  }

  async handleHttpRequest(request: Request, pathname: string): Promise<Response> {
    if (pathname === LOCAL_APP_PUBLIC_ROOT || pathname === `${LOCAL_APP_PUBLIC_ROOT}/`) {
      return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    const resolved = this.resolvePath(pathname);
    if (!resolved) return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
    if (resolved.needsTrailingSlashRedirect) {
      const url = new URL(request.url);
      url.pathname = resolved.app.publicPath;
      return new Response(null, {
        status: 308,
        headers: { location: `${url.pathname}${url.search}` },
      });
    }
    return proxyLocalAppHttpRequest(request, resolved.app, resolved.suffix, {
      fetchImpl: this.options.fetchImpl,
    });
  }

  async probe(id: string): Promise<LocalAppHealth> {
    const app = this.findById(id);
    const checkedAtMs = this.nowMs;
    const checkedAt = new Date(checkedAtMs).toISOString();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort("health probe timeout"), HEALTH_TIMEOUT_MS);
    try {
      const target = buildLocalAppUpstreamUrl(app, app.healthPath);
      const response = await (this.options.fetchImpl ?? globalThis.fetch)(target, {
        method: "GET",
        headers: { accept: "*/*" },
        redirect: "manual",
        signal: controller.signal,
      });
      await response.body?.cancel().catch(() => undefined);
      const health: LocalAppHealth = {
        state: "reachable",
        checkedAt,
        statusCode: response.status,
        latencyMs: Math.max(0, this.nowMs - checkedAtMs),
        ...(response.status >= 400 ? { error: `HTTP ${response.status}` } : {}),
      };
      this.health.set(app.id, health);
      return health;
    } catch {
      const health: LocalAppHealth = {
        state: "unreachable",
        checkedAt,
        latencyMs: Math.max(0, this.nowMs - checkedAtMs),
        error: controller.signal.aborted ? "Health probe timed out." : "Unable to reach the local app.",
      };
      this.health.set(app.id, health);
      return health;
    } finally {
      clearTimeout(timer);
    }
  }

  private resolve(app: PersistentLocalApp | LocalAppLease, kind: "persistent" | "lease"): ResolvedLocalApp {
    return {
      ...app,
      kind,
      publicPath: buildLocalAppPublicPath(app.slug),
      upstreamOrigin: `http://127.0.0.1:${app.port}`,
      ...(kind === "lease" ? {
        ownerChatJid: (app as LocalAppLease).ownerChatJid,
        expiresAt: (app as LocalAppLease).expiresAt,
      } : {}),
    };
  }

  private findById(id: string): ResolvedLocalApp {
    this.pruneExpired();
    const normalizedId = this.requireId(id);
    const persistent = this.persistent.get(normalizedId);
    if (persistent) return this.resolve(persistent, "persistent");
    const lease = this.leases.get(normalizedId);
    if (lease) return this.resolve(lease, "lease");
    throw new LocalAppProxyError("not_found", "Local app mapping not found.", 404);
  }

  private getOwnedLease(id: string, ownerChatJid: string): LocalAppLease {
    this.pruneExpired();
    const normalizedId = this.requireId(id);
    if (this.persistent.has(normalizedId)) {
      throw new LocalAppProxyError("persistent_forbidden", "The agent tool cannot modify persistent local app mappings.", 403);
    }
    const lease = this.leases.get(normalizedId);
    if (!lease) throw new LocalAppProxyError("not_found", "Temporary local app mapping not found.", 404);
    if (lease.ownerChatJid !== String(ownerChatJid || "").trim()) {
      throw new LocalAppProxyError("not_owner", "This temporary local app belongs to another chat.", 403);
    }
    return lease;
  }

  private removeLeaseRecord(lease: LocalAppLease, operation: string): void {
    this.leases.delete(lease.id);
    this.health.delete(lease.id);
    this.scheduleExpiry();
    log.info("Removed temporary local app mapping", {
      operation,
      id: lease.id,
      slug: lease.slug,
      port: lease.port,
      ownerChatJid: lease.ownerChatJid,
    });
  }

  private commitPersistent(apps: PersistentLocalApp[]): void {
    const saved = this.writePersistent(apps);
    this.persistent = new Map(saved.map((app) => [app.id, app]));
    this.configError = null;
  }

  private assertSlugAvailable(slug: string, exceptId?: string): void {
    const conflict = [
      ...this.persistent.values(),
      ...this.leases.values(),
    ].find((app) => app.slug === slug && app.id !== exceptId);
    if (conflict) throw new LocalAppProxyError("duplicate_slug", `Local app slug is already in use: ${slug}`, 409);
  }

  private assertCapacity(): void {
    if (this.persistent.size + this.leases.size >= MAX_LOCAL_APPS) {
      throw new LocalAppProxyError("too_many_apps", `At most ${MAX_LOCAL_APPS} local apps can be registered.`, 409);
    }
  }

  private validateTtl(value: unknown): number {
    const ttl = value === undefined ? DEFAULT_LEASE_MINUTES : Number(value);
    if (!Number.isInteger(ttl) || ttl < MIN_LEASE_MINUTES || ttl > MAX_LEASE_MINUTES) {
      throw new LocalAppProxyError("invalid_ttl", `Lease duration must be between ${MIN_LEASE_MINUTES} and ${MAX_LEASE_MINUTES} minutes.`);
    }
    return ttl;
  }

  private pruneExpired(): void {
    const now = this.nowMs;
    let changed = false;
    for (const lease of this.leases.values()) {
      if (Date.parse(lease.expiresAt) > now) continue;
      this.leases.delete(lease.id);
      this.health.delete(lease.id);
      changed = true;
      log.info("Expired temporary local app mapping", {
        operation: "local_app_proxy.expire_lease",
        id: lease.id,
        slug: lease.slug,
        port: lease.port,
        ownerChatJid: lease.ownerChatJid,
      });
    }
    if (changed) this.scheduleExpiry();
  }

  private scheduleExpiry(): void {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    if (!this.started || this.leases.size === 0) return;
    const nearest = Math.min(...Array.from(this.leases.values(), (lease) => Date.parse(lease.expiresAt)));
    const delay = Math.max(0, nearest - this.nowMs);
    this.expiryTimer = setTimeout(() => {
      this.expiryTimer = null;
      this.pruneExpired();
      this.scheduleExpiry();
    }, Math.min(delay, 2_147_483_647));
    this.expiryTimer.unref?.();
  }

  private ensureConfigUsable(): void {
    if (this.configError) {
      throw new LocalAppProxyError("invalid_config", `Local app proxy configuration is invalid: ${this.configError}`, 409);
    }
  }

  private requireId(value: unknown): string {
    const id = String(value || "").trim();
    if (!id) throw new LocalAppProxyError("invalid_id", "Local app id is required.");
    return id;
  }

  private get piclawPort(): number {
    return this.options.getPiclawPort?.() ?? getWebServerConfig().port;
  }

  private get nowMs(): number {
    return this.options.now?.() ?? Date.now();
  }

  private nowIso(): string {
    return new Date(this.nowMs).toISOString();
  }

  private readPersistent(): PersistentLocalApp[] {
    return this.options.readPersistent?.() ?? readPersistentLocalApps();
  }

  private writePersistent(apps: PersistentLocalApp[]): PersistentLocalApp[] {
    return this.options.writePersistent?.(apps) ?? writePersistentLocalApps(apps);
  }
}

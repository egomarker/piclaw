import type { WebChannelLike } from "../core/web-channel-contracts.js";
import { localAppProxyService } from "../../../local-app-proxy/index.js";
import { LocalAppProxyError, type LocalAppInput, type LocalAppPatch } from "../../../local-app-proxy/types.js";

function errorResponse(channel: WebChannelLike, error: unknown): Response {
  if (error instanceof LocalAppProxyError) {
    return channel.json({ error: error.message, code: error.code }, error.status);
  }
  const message = error instanceof Error ? error.message : String(error);
  return channel.json({ error: message || "Local app proxy action failed." }, 400);
}

export function handleLocalAppProxySettingsList(channel: WebChannelLike): Response {
  return channel.json({
    ok: true,
    servingEnabled: true,
    configError: localAppProxyService.getConfigurationError(),
    apps: localAppProxyService.list(),
  }, 200);
}

export async function handleLocalAppProxySettingsAction(
  channel: WebChannelLike,
  request: Request,
): Promise<Response> {
  const chatJid = new URL(request.url).searchParams.get("chat_jid")?.trim() || "web:default";
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return channel.json({ error: "Expected a JSON request body." }, 400);
  const action = String(body.action || "").trim().toLowerCase();
  const id = String(body.id || "").trim();

  try {
    if (action === "create") {
      const raw = body.app && typeof body.app === "object" ? body.app as Record<string, unknown> : {};
      const app = localAppProxyService.createPersistent({
        name: String(raw.name || ""),
        slug: typeof raw.slug === "string" ? raw.slug : undefined,
        port: Number(raw.port),
        upstreamBasePath: typeof raw.upstreamBasePath === "string"
          ? raw.upstreamBasePath
          : typeof raw.upstream_path === "string" ? raw.upstream_path : undefined,
        healthPath: typeof raw.healthPath === "string"
          ? raw.healthPath
          : typeof raw.health_path === "string" ? raw.health_path : undefined,
        enabled: raw.enabled !== false,
      } satisfies LocalAppInput);
      return channel.json({ ok: true, app }, 201);
    }

    if (action === "update") {
      const raw = body.patch && typeof body.patch === "object" ? body.patch as Record<string, unknown> : {};
      const patch: LocalAppPatch = {};
      if (Object.prototype.hasOwnProperty.call(raw, "name")) patch.name = String(raw.name || "");
      if (Object.prototype.hasOwnProperty.call(raw, "slug")) patch.slug = String(raw.slug || "");
      if (Object.prototype.hasOwnProperty.call(raw, "port")) patch.port = Number(raw.port);
      if (Object.prototype.hasOwnProperty.call(raw, "upstreamBasePath")) patch.upstreamBasePath = String(raw.upstreamBasePath || "");
      if (Object.prototype.hasOwnProperty.call(raw, "upstream_path")) patch.upstreamBasePath = String(raw.upstream_path || "");
      if (Object.prototype.hasOwnProperty.call(raw, "healthPath")) patch.healthPath = String(raw.healthPath || "");
      if (Object.prototype.hasOwnProperty.call(raw, "health_path")) patch.healthPath = String(raw.health_path || "");
      if (Object.prototype.hasOwnProperty.call(raw, "enabled")) patch.enabled = raw.enabled !== false;
      const app = localAppProxyService.updatePersistent(id, patch);
      return channel.json({ ok: true, app }, 200);
    }

    if (action === "remove") {
      localAppProxyService.removeFromSettings(id, chatJid);
      return channel.json({ ok: true, removed: true, id }, 200);
    }

    if (action === "promote") {
      const app = localAppProxyService.promoteLease(id, chatJid);
      return channel.json({ ok: true, app }, 200);
    }

    if (action === "probe") {
      const health = await localAppProxyService.probe(id);
      const app = localAppProxyService.get(id);
      return channel.json({ ok: true, app: { ...app, health }, health }, 200);
    }

    return channel.json({ error: "Unknown local app proxy action." }, 400);
  } catch (error) {
    return errorResponse(channel, error);
  }
}

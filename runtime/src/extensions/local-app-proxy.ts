import { Type } from "typebox";
import type { AgentToolResult, ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";
import { getChatChannel, getChatJid } from "../core/chat-context.js";
import { getWebOrigin } from "../channels/web/auth/request-origin.js";
import { localAppProxyService } from "../local-app-proxy/index.js";
import {
  MAX_LEASE_MINUTES,
  MIN_LEASE_MINUTES,
  LocalAppProxyError,
  type LocalAppProxyError as LocalAppProxyErrorType,
} from "../local-app-proxy/types.js";

const LocalAppProxySchema = Type.Object({
  action: Type.Union([
    Type.Literal("create"),
    Type.Literal("list"),
    Type.Literal("status"),
    Type.Literal("renew"),
    Type.Literal("remove"),
  ], { description: "Local app proxy action." }),
  id: Type.Optional(Type.String({ description: "Temporary mapping id for status, renew, or remove." })),
  name: Type.Optional(Type.String({ description: "Display name for action=create." })),
  slug: Type.Optional(Type.String({ description: "Optional /apps/<slug>/ path segment." })),
  port: Type.Optional(Type.Integer({ description: "Loopback HTTP port for action=create.", minimum: 1024, maximum: 65535 })),
  upstream_path: Type.Optional(Type.String({ description: "Optional upstream base path. Defaults to /." })),
  health_path: Type.Optional(Type.String({ description: "Optional health-check path. Defaults to /." })),
  ttl_minutes: Type.Optional(Type.Integer({
    description: "Temporary lease duration in minutes.",
    minimum: MIN_LEASE_MINUTES,
    maximum: MAX_LEASE_MINUTES,
  })),
});

type LocalAppProxyParams = {
  action: "create" | "list" | "status" | "renew" | "remove";
  id?: string;
  name?: string;
  slug?: string;
  port?: number;
  upstream_path?: string;
  health_path?: string;
  ttl_minutes?: number;
};

function result(text: string, details: Record<string, unknown>): AgentToolResult<Record<string, unknown>> {
  return { content: [{ type: "text", text }], details };
}

function withPublicUrl<T extends { publicPath: string }>(app: T, chatJid: string): T & { publicUrl: string | null } {
  const origin = getWebOrigin(chatJid);
  return {
    ...app,
    publicUrl: origin ? new URL(app.publicPath, `${origin}/`).toString() : null,
  };
}

function errorResult(action: string, error: unknown): AgentToolResult<Record<string, unknown>> {
  const message = error instanceof Error ? error.message : String(error);
  const typed = error instanceof LocalAppProxyError ? error as LocalAppProxyErrorType : null;
  return result(message || "Local app proxy action failed.", {
    ok: false,
    action,
    code: typed?.code ?? "local_app_proxy_error",
    status: typed?.status ?? 400,
  });
}

const HINT = [
  "## Local App Proxy",
  "Use local_app_proxy to publish a trusted HTTP app already listening on 127.0.0.1 through /apps/<slug>/.",
  "Create a temporary lease, verify it with action=status, then include the returned Open App URL in the final response.",
  "The tool does not start, stop, or supervise the app process. V1 does not forward WebSockets.",
].join("\n");

/** Built-in agent tool for temporary, chat-owned local app proxy leases. */
export const localAppProxyTool: ExtensionFactory = (pi: ExtensionAPI) => {
  pi.on("before_agent_start", async (event) => ({
    systemPrompt: `${event.systemPrompt}\n\n${HINT}`,
  }));

  pi.registerTool({
    name: "local_app_proxy",
    label: "local_app_proxy",
    description: "Publish and inspect a trusted HTTP app bound to a loopback port through a Piclaw /apps/<slug>/ path.",
    promptSnippet: "local_app_proxy: create, list, verify, renew, or remove temporary loopback web-app proxy leases.",
    parameters: LocalAppProxySchema,
    async execute(_toolCallId, params: LocalAppProxyParams) {
      const action = params.action || "list";
      const chatJid = getChatJid();
      const channel = getChatChannel();
      try {
        if (channel !== "web" || !chatJid.startsWith("web:")) {
          throw new LocalAppProxyError("unsupported_channel", "Local App Proxy is available only for Piclaw web chats.", 403);
        }
        if (action === "create") {
          if (!params.name?.trim()) throw new LocalAppProxyError("invalid_name", "Provide name for action=create.");
          if (!Number.isInteger(params.port)) throw new LocalAppProxyError("invalid_port", "Provide port for action=create.");
          const app = localAppProxyService.createLease({
            name: params.name,
            slug: params.slug,
            port: params.port!,
            upstreamBasePath: params.upstream_path || "/",
            healthPath: params.health_path || "/",
            ttlMinutes: params.ttl_minutes,
          }, chatJid);
          const health = await localAppProxyService.probe(app.id);
          const published = withPublicUrl(app, chatJid);
          const openTarget = published.publicUrl || published.publicPath;
          return result(
            health.state === "reachable"
              ? `Published ${app.name}. Open app: ${openTarget}`
              : `Registered ${app.name}, but its upstream is not reachable yet. Run action=status before claiming it works.`,
            { ok: true, action, app: published, health, public_path: app.publicPath, public_url: published.publicUrl },
          );
        }

        if (action === "list") {
          const apps = localAppProxyService.list()
            .filter((app) => app.kind === "lease" && app.ownerChatJid === chatJid)
            .map((app) => withPublicUrl(app, chatJid));
          return result(
            apps.length ? `Temporary local apps for this chat: ${apps.map((app) => `${app.name} (${app.publicPath})`).join(", ")}` : "No temporary local apps are registered for this chat.",
            { ok: true, action, apps },
          );
        }

        const id = String(params.id || "").trim();
        if (!id) throw new LocalAppProxyError("invalid_id", `Provide id for action=${action}.`);

        if (action === "status") {
          const existing = localAppProxyService.get(id);
          if (existing.kind !== "lease") {
            throw new LocalAppProxyError("persistent_forbidden", "The agent tool cannot inspect persistent local app mappings.", 403);
          }
          if (existing.ownerChatJid !== chatJid) {
            throw new LocalAppProxyError("not_owner", "This temporary local app belongs to another chat.", 403);
          }
          const health = await localAppProxyService.probe(id);
          const app = withPublicUrl({ ...localAppProxyService.get(id), health }, chatJid);
          return result(
            health.state === "reachable" ? `${app.name} is reachable. Open app: ${app.publicUrl || app.publicPath}` : `${app.name} is not reachable.`,
            { ok: true, action, app, health, public_path: app.publicPath, public_url: app.publicUrl },
          );
        }

        if (action === "renew") {
          const app = withPublicUrl(localAppProxyService.renewLease(id, chatJid, params.ttl_minutes), chatJid);
          return result(`Renewed ${app.name} until ${app.expiresAt}.`, { ok: true, action, app });
        }

        if (action === "remove") {
          localAppProxyService.removeLease(id, chatJid);
          return result("Removed the temporary local app mapping. The upstream process was not stopped.", { ok: true, action, id, removed: true });
        }

        throw new LocalAppProxyError("invalid_action", "Unknown local app proxy action.");
      } catch (error) {
        return errorResult(action, error);
      }
    },
  });
};

import { afterEach, describe, expect, test } from "bun:test";

import {
  handleLocalAppProxySettingsAction,
} from "../../src/channels/web/handlers/local-app-proxy-settings.js";
import type { WebChannelLike } from "../../src/channels/web/core/web-channel-contracts.js";
import { localAppProxyService } from "../../src/local-app-proxy/index.js";
import type { LocalAppInput, LocalAppPatch } from "../../src/local-app-proxy/types.js";

const originalCreatePersistent = localAppProxyService.createPersistent;
const originalUpdatePersistent = localAppProxyService.updatePersistent;

const channel = {
  json(payload: unknown, status = 200) {
    return Response.json(payload, { status });
  },
} as WebChannelLike;

afterEach(() => {
  localAppProxyService.createPersistent = originalCreatePersistent;
  localAppProxyService.updatePersistent = originalUpdatePersistent;
});

describe("local app proxy settings handler", () => {
  test("passes WebSocket and cookie controls through create and update API aliases", async () => {
    let createdInput: LocalAppInput | null = null;
    let updatedPatch: LocalAppPatch | null = null;

    localAppProxyService.createPersistent = ((input: LocalAppInput) => {
      createdInput = input;
      return { id: "app-remotex", ...input } as any;
    }) as typeof localAppProxyService.createPersistent;
    localAppProxyService.updatePersistent = ((id: string, patch: LocalAppPatch) => {
      expect(id).toBe("app-remotex");
      updatedPatch = patch;
      return { id, ...patch } as any;
    }) as typeof localAppProxyService.updatePersistent;

    const createResponse = await handleLocalAppProxySettingsAction(channel, new Request(
      "https://piclaw.test/agent/local-apps/action?chat_jid=web%3Adefault",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "create",
          app: {
            name: "Remotex",
            slug: "remotex",
            port: 4173,
            websocket_enabled: false,
            cookie_allowlist: ["remotex_session"],
          },
        }),
      },
    ));
    expect(createResponse.status).toBe(201);
    expect(createdInput?.webSocketEnabled).toBe(false);
    expect(createdInput?.cookieAllowlist).toEqual(["remotex_session"]);

    const updateResponse = await handleLocalAppProxySettingsAction(channel, new Request(
      "https://piclaw.test/agent/local-apps/action?chat_jid=web%3Adefault",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: "app-remotex",
          patch: { webSocketEnabled: true, cookieAllowlist: [] },
        }),
      },
    ));
    expect(updateResponse.status).toBe(200);
    expect(updatedPatch?.webSocketEnabled).toBe(true);
    expect(updatedPatch?.cookieAllowlist).toEqual([]);
  });
});

import { describe, expect, test } from "bun:test";

import { localAppProxyTool } from "../../src/extensions/local-app-proxy.js";
import { createFakeExtensionApi } from "./fake-extension-api.js";

describe("local_app_proxy tool", () => {
  test("exposes WebSocket and cookie controls on create", () => {
    const fake = createFakeExtensionApi();
    localAppProxyTool(fake.api);

    const tool = fake.tools.get("local_app_proxy");
    expect(tool).toBeDefined();
    expect(tool.parameters.properties.websocket_enabled).toMatchObject({
      type: "boolean",
    });
    expect(tool.parameters.properties.websocket_enabled.description).toContain("Defaults to true");
    expect(tool.parameters.properties.cookie_allowlist).toMatchObject({
      type: "array",
      maxItems: 32,
      uniqueItems: true,
    });
    expect(tool.parameters.properties.cookie_allowlist.description).toContain("piclaw_session is always blocked");
  });
});

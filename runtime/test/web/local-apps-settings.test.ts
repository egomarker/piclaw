import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { __localAppsSettingsTest } from "../../web/src/components/settings/local-apps.js";

const runtimeRoot = join(import.meta.dir, "../..");

test("Local Apps settings parse and format cookie allowlists", () => {
  expect(__localAppsSettingsTest.parseCookieAllowlist(" remotex_session, second-cookie\nthird_cookie ")).toEqual([
    "remotex_session",
    "second-cookie",
    "third_cookie",
  ]);
  expect(__localAppsSettingsTest.parseCookieAllowlist("  \n, ")).toEqual([]);
  expect(__localAppsSettingsTest.formatCookieAllowlist(["remotex_session", "second-cookie"])).toBe(
    "remotex_session\nsecond-cookie",
  );
  expect(__localAppsSettingsTest.formatCookieAllowlist(undefined)).toBe("");
});

test("Local Apps settings expose and persist WebSocket and cookie controls", () => {
  const component = readFileSync(join(runtimeRoot, "web/src/components/settings/local-apps.ts"), "utf8");
  const styles = readFileSync(join(runtimeRoot, "web/src/styles/shared/settings.css"), "utf8");
  const i18n = readFileSync(join(runtimeRoot, "web/src/utils/i18n.ts"), "utf8");
  const bundle = readFileSync(join(runtimeRoot, "web/static/mobile/dist/app.bundle.js"), "utf8");

  expect(component).toContain("webSocketEnabled: form.webSocketEnabled !== false");
  expect(component).toContain("cookieAllowlist: parseCookieAllowlist(form.cookieAllowlist)");
  expect(component).toContain("checked=${form.webSocketEnabled}");
  expect(component).toContain("settings.localApps.cookieAllowlistHint");
  expect(component).toContain("settings.localApps.forwardedCookies");
  expect(styles).toContain(".settings-local-app-form-grid textarea");
  expect(i18n).toContain("'settings.localApps.webSocketEnabled': 'Forward WebSockets'");
  expect(i18n).toContain("'settings.localApps.cookieAllowlist': 'Cookie allowlist'");
  expect(i18n).toContain("piclaw_session is always blocked");
  expect(bundle).toContain("webSocketEnabled");
  expect(bundle).toContain("Forward WebSockets");
  expect(bundle).toContain("Cookie allowlist");
});

import { describe, expect, test } from "bun:test";
import {
  normalizeLocalAppCookieAllowlist,
  normalizeLocalAppInput,
  normalizeLocalAppPath,
  validateLocalAppPort,
  validatePersistentLocalApps,
} from "../../src/local-app-proxy/validation.js";

const NOW = "2026-08-12T12:00:00.000Z";

function app(overrides: Record<string, unknown> = {}) {
  return {
    id: "app-one",
    name: "Demo App",
    slug: "demo-app",
    port: 4173,
    upstreamBasePath: "/workbench",
    healthPath: "/health/",
    enabled: true,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

describe("local app proxy validation", () => {
  test("normalizes a valid app input", () => {
    expect(normalizeLocalAppInput({
      name: " Demo App ",
      port: 4173,
      upstreamBasePath: "/workbench",
      healthPath: "/health/",
      cookieAllowlist: ["remotex_session", "remotex_session"],
    }, { piclawPort: 8080 })).toEqual({
      name: "Demo App",
      slug: "demo-app",
      port: 4173,
      upstreamBasePath: "/workbench/",
      healthPath: "/health",
      webSocketEnabled: true,
      cookieAllowlist: ["remotex_session"],
      enabled: true,
    });
  });

  test("rejects unsafe slugs, ports, and paths", () => {
    expect(() => normalizeLocalAppInput({ name: "Demo", slug: "../demo", port: 4173 })).toThrow();
    expect(() => validateLocalAppPort(80, 8080)).toThrow();
    expect(() => validateLocalAppPort(8080, 8080)).toThrow();
    expect(() => normalizeLocalAppPath("/%2e%2e/secrets", { trailingSlash: true, fallback: "/" })).toThrow();
    expect(() => normalizeLocalAppPath("//remote/path", { trailingSlash: true, fallback: "/" })).toThrow();
  });

  test("defaults cookie forwarding to none and rejects unsafe allowlists", () => {
    expect(normalizeLocalAppCookieAllowlist(undefined)).toEqual([]);
    expect(() => normalizeLocalAppCookieAllowlist("remotex_session")).toThrow(/array/);
    expect(() => normalizeLocalAppCookieAllowlist(["bad cookie"])).toThrow(/Invalid cookie name/);
    expect(() => normalizeLocalAppCookieAllowlist(["PICLAW_SESSION"])).toThrow(/cannot be forwarded/);
    expect(() => normalizeLocalAppCookieAllowlist(Array.from({ length: 33 }, (_, index) => `cookie_${index}`))).toThrow(/at most 32/);
  });

  test("migrates persisted apps without proxy controls to safe compatible defaults", () => {
    const migrated = validatePersistentLocalApps([app()], 8080)[0];
    expect(migrated?.webSocketEnabled).toBe(true);
    expect(migrated?.cookieAllowlist).toEqual([]);
  });

  test("rejects duplicate ids and slugs in persisted config", () => {
    expect(() => validatePersistentLocalApps([app(), app({ updatedAt: NOW })], 8080)).toThrow(/Duplicate local app id/);
    expect(() => validatePersistentLocalApps([app(), app({ id: "app-two" })], 8080)).toThrow(/Duplicate local app slug/);
  });
});

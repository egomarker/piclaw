import { describe, expect, test } from "bun:test";
import {
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
    }, { piclawPort: 8080 })).toEqual({
      name: "Demo App",
      slug: "demo-app",
      port: 4173,
      upstreamBasePath: "/workbench/",
      healthPath: "/health",
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

  test("rejects duplicate ids and slugs in persisted config", () => {
    expect(() => validatePersistentLocalApps([app(), app({ updatedAt: NOW })], 8080)).toThrow(/Duplicate local app id/);
    expect(() => validatePersistentLocalApps([app(), app({ id: "app-two" })], 8080)).toThrow(/Duplicate local app slug/);
  });
});

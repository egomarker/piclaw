import { describe, expect, test } from "bun:test";
import { LocalAppProxyService } from "../../src/local-app-proxy/service.js";
import type { PersistentLocalApp } from "../../src/local-app-proxy/types.js";

function serviceHarness(initial: PersistentLocalApp[] = []) {
  let now = Date.parse("2026-08-12T12:00:00.000Z");
  let saved = structuredClone(initial);
  const service = new LocalAppProxyService({
    now: () => now,
    getPiclawPort: () => 8080,
    readPersistent: () => structuredClone(saved),
    writePersistent: (apps) => {
      saved = structuredClone(apps);
      return structuredClone(saved);
    },
    fetchImpl: async () => new Response("ok", { status: 200 }),
  });
  service.start();
  return {
    service,
    advance(ms: number) { now += ms; },
    saved() { return structuredClone(saved); },
  };
}

describe("LocalAppProxyService", () => {
  test("keeps temporary leases out of persistent config and enforces ownership", () => {
    const harness = serviceHarness();
    const lease = harness.service.createLease({ name: "Demo", slug: "demo", port: 4173 }, "web:one");
    expect(lease.kind).toBe("lease");
    expect(harness.saved()).toEqual([]);
    expect(() => harness.service.renewLease(lease.id, "web:other", 60)).toThrow(/another chat/);
    expect(() => harness.service.removeLease(lease.id, "web:other")).toThrow(/another chat/);
    expect(() => harness.service.removeFromSettings(lease.id, "web:other")).toThrow(/another chat/);
    expect(() => harness.service.promoteLease(lease.id, "web:other")).toThrow(/another chat/);
    harness.service.stop();
  });

  test("expires leases and reserves disabled persistent slugs", () => {
    const harness = serviceHarness();
    const lease = harness.service.createLease({ name: "Preview", slug: "preview", port: 4173, ttlMinutes: 5 }, "web:one");
    expect(harness.service.resolvePath("/apps/preview/")?.app.id).toBe(lease.id);
    harness.advance(5 * 60_000 + 1);
    expect(harness.service.resolvePath("/apps/preview/")).toBeNull();

    const persistent = harness.service.createPersistent({ name: "Saved", slug: "saved", port: 4174, enabled: false });
    expect(harness.service.resolvePath("/apps/saved/")).toBeNull();
    expect(() => harness.service.createLease({ name: "Conflict", slug: "saved", port: 4175 }, "web:one")).toThrow(/already in use/);
    expect(harness.saved().map((app) => app.id)).toContain(persistent.id);
    harness.service.stop();
  });

  test("promotes a lease transactionally to persistent config", () => {
    const harness = serviceHarness();
    const lease = harness.service.createLease({ name: "Demo", slug: "demo", port: 4173 }, "web:one");
    const promoted = harness.service.promoteLease(lease.id, "web:one");
    expect(promoted.kind).toBe("persistent");
    expect(promoted.id).toBe(lease.id);
    expect(harness.saved()).toHaveLength(1);
    expect(harness.service.list().filter((app) => app.id === lease.id)).toHaveLength(1);
    harness.service.stop();
  });

  test("serves an index of enabled apps at /apps/", async () => {
    const harness = serviceHarness();
    harness.service.createPersistent({ name: "Demo & Reports", slug: "demo", port: 4173 });
    harness.service.createPersistent({ name: "Hidden", slug: "hidden", port: 4174, enabled: false });

    const response = await harness.service.handleHttpRequest(
      new Request("https://piclaw.test/apps/"),
      "/apps/",
    );
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("Demo &amp; Reports");
    expect(body).toContain("https://piclaw.test/apps/demo/");
    expect(body).toContain("Copy URL");
    expect(body).toContain("Go to");
    expect(body).not.toContain("Hidden");

    const redirect = await harness.service.handleHttpRequest(
      new Request("https://piclaw.test/apps"),
      "/apps",
    );
    expect(redirect.status).toBe(308);
    expect(redirect.headers.get("location")).toBe("/apps/");
    harness.service.stop();
  });
});

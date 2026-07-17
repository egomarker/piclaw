import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Credential } from "@earendil-works/pi-ai";
import { FileCredentialStore } from "../../src/agent-pool/credential-store.js";

const roots: string[] = [];
async function createStore(initial: Record<string, Credential> = {}) {
  const root = mkdtempSync(join(tmpdir(), "piclaw-credential-store-"));
  roots.push(root);
  const authPath = join(root, "agent", "auth.json");
  const store = new FileCredentialStore(authPath);
  for (const [provider, credential] of Object.entries(initial)) await store.modify(provider, async () => credential);
  return { authPath, store };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("FileCredentialStore", () => {
  test("creates auth.json with private permissions and resolves stored API-key expressions", async () => {
    const { authPath, store } = await createStore({
      openai: { type: "api_key", key: "$OPENAI_API_KEY", env: { OPENAI_API_KEY: "secret" } },
      "openai-codex": { type: "oauth", access: "access", refresh: "refresh", expires: 123, accountId: "acct" },
    });
    expect(statSync(authPath).mode & 0o777).toBe(0o600);
    expect(await store.read("openai")).toEqual({ type: "api_key", key: "secret", env: { OPENAI_API_KEY: "secret" } });
    expect(await store.read("openai-codex")).toMatchObject({ type: "oauth", accountId: "acct" });
    expect(await store.list()).toEqual([{ providerId: "openai", type: "api_key" }, { providerId: "openai-codex", type: "oauth" }]);
  });

  test("supports literal escapes and environment templates without changing persisted config", async () => {
    const { authPath, store } = await createStore({ escaped: { type: "api_key", key: "$$literal-$!bang-${TOKEN}", env: { TOKEN: "value" } } });
    expect(await store.read("escaped")).toEqual({ type: "api_key", key: "$literal-!bang-value", env: { TOKEN: "value" } });
    expect(JSON.parse(readFileSync(authPath, "utf8")).escaped.key).toBe("$$literal-$!bang-${TOKEN}");
  });

  test("matches upstream empty environment fallback semantics", async () => {
    const previous = process.env.PICLAW_CREDENTIAL_STORE_TEST_KEY;
    process.env.PICLAW_CREDENTIAL_STORE_TEST_KEY = "process-value";
    try {
      const { store } = await createStore({ test: { type: "api_key", key: "$PICLAW_CREDENTIAL_STORE_TEST_KEY", env: { PICLAW_CREDENTIAL_STORE_TEST_KEY: "" } } });
      expect(await store.read("test")).toMatchObject({ key: "process-value" });
    } finally {
      if (previous === undefined) delete process.env.PICLAW_CREDENTIAL_STORE_TEST_KEY;
      else process.env.PICLAW_CREDENTIAL_STORE_TEST_KEY = previous;
    }
  });

  test("serializes concurrent mutation and returns the authoritative stored credential", async () => {
    const { store } = await createStore({ test: { type: "api_key", key: "zero", env: { n: "0" } } });
    await Promise.all(Array.from({ length: 12 }, async () => store.modify("test", async (current) => {
      const n = Number(current?.type === "api_key" ? current.env?.n : 0) + 1;
      await Bun.sleep(2);
      return { type: "api_key", key: String(n), env: { n: String(n) } };
    })));
    expect(await store.read("test")).toEqual({ type: "api_key", key: "12", env: { n: "12" } });
  });

  test("cross-instance reads and writes refresh from the locked file", async () => {
    const { authPath, store } = await createStore({ first: { type: "api_key", key: "one" } });
    const other = new FileCredentialStore(authPath);
    await other.modify("second", async () => ({ type: "api_key", key: "two" }));
    expect(await store.read("second")).toEqual({ type: "api_key", key: "two" });
    await store.modify("first", async () => ({ type: "api_key", key: "updated" }));
    expect(await other.read("first")).toEqual({ type: "api_key", key: "updated" });
  });

  test("undefined modify result preserves a concurrently refreshed credential", async () => {
    const { authPath, store } = await createStore({ oauth: { type: "oauth", access: "old", refresh: "r", expires: 1 } });
    const other = new FileCredentialStore(authPath);
    await other.modify("oauth", async () => ({ type: "oauth", access: "new", refresh: "r2", expires: Date.now() + 60_000 }));
    const post = await store.modify("oauth", async (current) => {
      expect(current).toMatchObject({ type: "oauth", access: "new" });
      return undefined;
    });
    expect(post).toMatchObject({ type: "oauth", access: "new" });
  });

  test("delete does not overwrite unrelated providers", async () => {
    const { authPath, store } = await createStore({ a: { type: "api_key", key: "a" } });
    const other = new FileCredentialStore(authPath);
    await other.modify("b", async () => ({ type: "api_key", key: "b" }));
    await store.delete("a");
    expect(JSON.parse(readFileSync(authPath, "utf8"))).toEqual({ b: { type: "api_key", key: "b" } });
  });

  test("invalid auth.json is never overwritten by modify", async () => {
    const { authPath, store } = await createStore();
    await store.list();
    writeFileSync(authPath, "not-json", "utf8");
    await expect(store.modify("test", async () => ({ type: "api_key", key: "secret" }))).rejects.toThrow();
    expect(readFileSync(authPath, "utf8")).toBe("not-json");
  });
});

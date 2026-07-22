import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  clearHydratedMcpCredentials,
  hydrateMcpKeychainCredentials,
} from "../../src/secure/mcp-keychain.js";

const touched = new Set<string>();
afterEach(() => {
  for (const name of touched) delete process.env[name];
  touched.clear();
});

function workspace(config: object): string {
  const root = mkdtempSync(join(tmpdir(), "piclaw-mcp-keychain-"));
  mkdirSync(join(root, ".pi"), { recursive: true });
  writeFileSync(join(root, ".pi", "mcp.json"), JSON.stringify(config));
  return root;
}

const resolveEntry = async (name: string) => ({
  name,
  type: "token" as const,
  secret: "secret-value",
  username: null,
});

describe("MCP keychain credential hydration", () => {
  test("hydrates a named environment variable without changing config", async () => {
    const root = workspace({
      mcpServers: {
        memento: {
          url: "http://example.test/mcp",
          bearerTokenKeychain: "memento/example",
          bearerTokenEnv: "PICLAW_MCP_MEMENTO_TOKEN",
        },
      },
    });
    touched.add("PICLAW_MCP_MEMENTO_TOKEN");
    const entries = await hydrateMcpKeychainCredentials(root, resolveEntry);
    expect(process.env.PICLAW_MCP_MEMENTO_TOKEN).toBe("secret-value");
    expect(entries).toEqual([
      {
        serverName: "memento",
        envName: "PICLAW_MCP_MEMENTO_TOKEN",
        keychainName: "memento/example",
      },
    ]);
    clearHydratedMcpCredentials(entries);
    expect(process.env.PICLAW_MCP_MEMENTO_TOKEN).toBeUndefined();
  });

  test("rejects ambiguous or unsafe credential configuration", async () => {
    await expect(
      hydrateMcpKeychainCredentials(
        workspace({
          mcpServers: {
            memento: {
              bearerToken: "literal",
              bearerTokenKeychain: "memento/example",
              bearerTokenEnv: "PICLAW_MCP_TOKEN",
            },
          },
        }),
        resolveEntry,
      ),
    ).rejects.toThrow("cannot combine");
    await expect(
      hydrateMcpKeychainCredentials(
        workspace({
          mcpServers: { memento: { bearerTokenKeychain: "memento/example" } },
        }),
        resolveEntry,
      ),
    ).rejects.toThrow("must set a valid bearerTokenEnv");
  });

  test("does not overwrite an existing environment variable", async () => {
    process.env.PICLAW_MCP_TOKEN = "existing";
    touched.add("PICLAW_MCP_TOKEN");
    await expect(
      hydrateMcpKeychainCredentials(
        workspace({
          mcpServers: {
            memento: {
              bearerTokenKeychain: "memento/example",
              bearerTokenEnv: "PICLAW_MCP_TOKEN",
            },
          },
        }),
        resolveEntry,
      ),
    ).rejects.toThrow("already set");
    expect(process.env.PICLAW_MCP_TOKEN).toBe("existing");
  });
});

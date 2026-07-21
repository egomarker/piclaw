import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getKeychainEntry } from "./keychain.js";

interface McpServerCredentialConfig {
  bearerToken?: unknown;
  bearerTokenEnv?: unknown;
  bearerTokenKeychain?: unknown;
}

interface McpConfigFile {
  mcpServers?: Record<string, McpServerCredentialConfig>;
}

export interface HydratedMcpCredential {
  serverName: string;
  envName: string;
  keychainName: string;
}

const ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

export async function hydrateMcpKeychainCredentials(
  workspaceDir: string,
  resolveEntry: typeof getKeychainEntry = getKeychainEntry,
): Promise<HydratedMcpCredential[]> {
  const configPath = join(workspaceDir, ".pi", "mcp.json");
  let config: McpConfigFile;
  try {
    config = JSON.parse(readFileSync(configPath, "utf8")) as McpConfigFile;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw new Error(`Unable to read MCP credential configuration at ${configPath}`, {
      cause: error,
    });
  }

  const hydrated: HydratedMcpCredential[] = [];
  for (const [serverName, definition] of Object.entries(config.mcpServers ?? {})) {
    const keychainName = definition.bearerTokenKeychain;
    if (keychainName === undefined) continue;
    if (typeof keychainName !== "string" || !keychainName.trim()) {
      throw new Error(`MCP server ${serverName} bearerTokenKeychain must be a non-empty string.`);
    }
    if (definition.bearerToken !== undefined) {
      throw new Error(`MCP server ${serverName} cannot combine bearerToken and bearerTokenKeychain.`);
    }
    const envName = definition.bearerTokenEnv;
    if (typeof envName !== "string" || !ENV_NAME.test(envName)) {
      throw new Error(
        `MCP server ${serverName} must set a valid bearerTokenEnv with bearerTokenKeychain.`,
      );
    }
    if (process.env[envName] !== undefined) {
      throw new Error(`MCP server ${serverName} bearerTokenEnv ${envName} is already set.`);
    }
    const entry = await resolveEntry(keychainName.trim());
    if (!entry.secret) {
      throw new Error(`MCP server ${serverName} keychain entry has no secret.`);
    }
    process.env[envName] = entry.secret;
    hydrated.push({ serverName, envName, keychainName: keychainName.trim() });
  }
  return hydrated;
}

export function clearHydratedMcpCredentials(entries: HydratedMcpCredential[]): void {
  for (const entry of entries) delete process.env[entry.envName];
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getKeychainEntry } from "./keychain.js";

interface McpServerCredentialConfig {
  bearerToken?: unknown;
  bearerTokenEnv?: unknown;
  bearerTokenKeychain?: unknown;
  url?: unknown;
  cwd?: unknown;
  socket?: unknown;
  env?: unknown;
  headers?: unknown;
  oauth?: { clientSecret?: unknown } | unknown;
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
const ENV_REFERENCE = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$env:([A-Za-z_][A-Za-z0-9_]*)|\{env:([A-Za-z_][A-Za-z0-9_]*)\}/g;

function missingEnvironmentReferences(value: string): string[] {
  const escapedCommandMarker = value.startsWith("!!");
  const candidate = escapedCommandMarker ? value.slice(1) : value;
  // A leading single ! is an adapter command-secret expression. Its shell owns
  // any variable expansion, so Piclaw must not reject those references here.
  if (!escapedCommandMarker && candidate.startsWith("!")) return [];
  const missing = new Set<string>();
  for (const match of candidate.matchAll(ENV_REFERENCE)) {
    const name = match[1] ?? match[2] ?? match[3];
    if (name && process.env[name] === undefined) missing.add(name);
  }
  return [...missing];
}

function stringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

export function validateMcpEnvironmentReferences(config: McpConfigFile): void {
  for (const [serverName, definition] of Object.entries(config.mcpServers ?? {})) {
    const values: Array<[string, string]> = [];
    for (const key of ["url", "cwd", "socket", "bearerToken"] as const) {
      const value = definition[key];
      if (typeof value === "string") values.push([key, value]);
    }
    for (const [key, value] of Object.entries(stringRecord(definition.env))) values.push([`env.${key}`, value]);
    for (const [key, value] of Object.entries(stringRecord(definition.headers))) values.push([`headers.${key}`, value]);
    if (definition.oauth && typeof definition.oauth === "object" && !Array.isArray(definition.oauth)) {
      const secret = (definition.oauth as { clientSecret?: unknown }).clientSecret;
      if (typeof secret === "string") values.push(["oauth.clientSecret", secret]);
    }
    for (const [field, value] of values) {
      const missing = missingEnvironmentReferences(value);
      if (missing.length > 0) {
        throw new Error(`MCP server ${serverName} ${field} references missing environment variable${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}.`);
      }
    }
  }
}

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
  try {
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
    validateMcpEnvironmentReferences(config);
    return hydrated;
  } catch (error) {
    clearHydratedMcpCredentials(hydrated);
    throw error;
  }
}

export function clearHydratedMcpCredentials(entries: HydratedMcpCredential[]): void {
  for (const entry of entries) delete process.env[entry.envName];
}

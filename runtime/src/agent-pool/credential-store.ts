import { execSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import type { Credential, CredentialInfo, CredentialStore } from "@earendil-works/pi-ai";
import lockfile from "proper-lockfile";

import { getPiclawAgentDir } from "../core/agent-dir.js";

const AUTH_FILE_MODE = 0o600;
const AUTH_DIRECTORY_MODE = 0o700;
const LOCK_OPTIONS = {
  retries: { retries: 10, factor: 2, minTimeout: 100, maxTimeout: 10_000, randomize: true },
  stale: 30_000,
} as const;

type CredentialData = Record<string, Credential>;

export interface PiclawCredentialStore extends CredentialStore {
  readonly authPath: string;
  drainErrors(): Error[];
}

const commandValueCache = new Map<string, string | undefined>();

function resolveConfigValue(config: string, env?: Record<string, string>): string | undefined {
  if (config.startsWith("!")) {
    if (commandValueCache.has(config)) return commandValueCache.get(config);
    let value: string | undefined;
    try {
      value = execSync(config.slice(1), { encoding: "utf8", timeout: 10_000, stdio: ["ignore", "pipe", "ignore"] }).trim() || undefined;
    } catch {
      value = undefined;
    }
    commandValueCache.set(config, value);
    return value;
  }

  let resolved = "";
  for (let index = 0; index < config.length;) {
    if (config[index] !== "$") {
      resolved += config[index++];
      continue;
    }
    const next = config[index + 1];
    if (next === "$" || next === "!") {
      resolved += next;
      index += 2;
      continue;
    }
    if (next === "{") {
      const end = config.indexOf("}", index + 2);
      if (end < 0) {
        resolved += "$";
        index += 1;
        continue;
      }
      const name = config.slice(index + 2, end);
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) resolved += config.slice(index, end + 1);
      else {
        const value = env?.[name] || process.env[name] || undefined;
        if (value === undefined) return undefined;
        resolved += value;
      }
      index = end + 1;
      continue;
    }
    const match = config.slice(index + 1).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (!match) {
      resolved += "$";
      index += 1;
      continue;
    }
    const value = env?.[match[0]] || process.env[match[0]] || undefined;
    if (value === undefined) return undefined;
    resolved += value;
    index += match[0].length + 1;
  }
  return resolved;
}

function cloneCredential<T extends Credential | undefined>(credential: T): T {
  return credential === undefined ? credential : structuredClone(credential);
}

function resolveCredential(credential: Credential | undefined): Credential | undefined {
  if (credential?.type !== "api_key" || credential.key === undefined) return cloneCredential(credential);
  return { ...cloneCredential(credential), key: resolveConfigValue(credential.key, credential.env) };
}

function parseCredentialData(content: string | undefined): CredentialData {
  if (!content?.trim()) return {};
  const parsed = JSON.parse(content) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("auth.json must contain a JSON object");
  return parsed as CredentialData;
}

/** App-owned, cross-process serialized CredentialStore for ModelRuntime. */
export class FileCredentialStore implements PiclawCredentialStore {
  private data: CredentialData = {};
  private errors: Error[] = [];

  constructor(readonly authPath: string = join(getPiclawAgentDir(), "auth.json")) {}

  private recordError(error: unknown): Error {
    const normalized = error instanceof Error ? error : new Error(String(error));
    this.errors.push(normalized);
    return normalized;
  }

  private ensureFile(): void {
    const parent = dirname(this.authPath);
    if (!existsSync(parent)) mkdirSync(parent, { recursive: true, mode: AUTH_DIRECTORY_MODE });
    if (!existsSync(this.authPath)) writeFileSync(this.authPath, "{}", { encoding: "utf8", mode: AUTH_FILE_MODE });
    chmodSync(this.authPath, AUTH_FILE_MODE);
  }

  private readFileData(): CredentialData {
    this.ensureFile();
    return parseCredentialData(readFileSync(this.authPath, "utf8"));
  }

  private writeFileData(data: CredentialData): void {
    writeFileSync(this.authPath, `${JSON.stringify(data, null, 2)}\n`, { encoding: "utf8", mode: AUTH_FILE_MODE });
    chmodSync(this.authPath, AUTH_FILE_MODE);
  }

  private async withLock<T>(fn: (current: CredentialData, assertLock: () => void) => Promise<T>): Promise<T> {
    this.ensureFile();
    let compromised: Error | null = null;
    const assertLock = () => { if (compromised) throw compromised; };
    const release = await lockfile.lock(this.authPath, { ...LOCK_OPTIONS, onCompromised: (error) => { compromised = error; } });
    try {
      assertLock();
      const result = await fn(this.readFileData(), assertLock);
      assertLock();
      return result;
    } finally {
      try { await release(); }
      catch (error) { this.recordError(new Error("Failed to release credential storage lock", { cause: error })); }
    }
  }

  drainErrors(): Error[] {
    const drained = [...this.errors];
    this.errors = [];
    return drained;
  }

  async read(providerId: string): Promise<Credential | undefined> {
    const current = await this.withLock(async (data) => data);
    this.data = current;
    return resolveCredential(current[providerId]);
  }

  async list(): Promise<readonly CredentialInfo[]> {
    const current = await this.withLock(async (data) => data);
    this.data = current;
    return Object.entries(current).map(([providerId, credential]) => ({ providerId, type: credential.type }));
  }

  async modify(providerId: string, fn: (current: Credential | undefined) => Promise<Credential | undefined>): Promise<Credential | undefined> {
    return this.withLock(async (current, assertLock) => {
      const nextCredential = await fn(cloneCredential(current[providerId]));
      assertLock();
      if (nextCredential === undefined) {
        this.data = current;
        return cloneCredential(current[providerId]);
      }
      const next = { ...current, [providerId]: cloneCredential(nextCredential) };
      this.writeFileData(next);
      this.data = next;
      return cloneCredential(nextCredential);
    });
  }

  async delete(providerId: string): Promise<void> {
    await this.withLock(async (current, assertLock) => {
      const next = { ...current };
      delete next[providerId];
      assertLock();
      this.writeFileData(next);
      this.data = next;
    });
  }
}

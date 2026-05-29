import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { WORKSPACE_DIR } from "../core/config.js";

export type AddonPackageManifest = {
  name?: string;
  pi?: {
    runtime?: {
      entries?: string[];
      recovery?: {
        excludeChatJidPrefixes?: string[];
      };
    };
  };
};

type InstalledAddonManifest = {
  packageDir: string;
  manifest: AddonPackageManifest;
};

function getWorkspaceDir(): string {
  return process.env.PICLAW_WORKSPACE || WORKSPACE_DIR;
}

function listAddonPackageDirs(addonsNodeModulesDir: string): string[] {
  if (!existsSync(addonsNodeModulesDir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(addonsNodeModulesDir, { withFileTypes: true })) {
    if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
    const entryPath = join(addonsNodeModulesDir, entry.name);
    if (entry.name.startsWith("@")) {
      for (const scoped of readdirSync(entryPath, { withFileTypes: true })) {
        if (scoped.isDirectory() || scoped.isSymbolicLink()) results.push(join(entryPath, scoped.name));
      }
      continue;
    }
    results.push(entryPath);
  }
  return results;
}

function toTrimmedStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter(Boolean)
    : [];
}

function getInstalledAddonPackageManifests(workspaceDir = getWorkspaceDir()): InstalledAddonManifest[] {
  const addonsNodeModulesDir = join(workspaceDir, ".pi", "extensions", "node_modules");
  const manifests: InstalledAddonManifest[] = [];

  for (const packageDir of listAddonPackageDirs(addonsNodeModulesDir)) {
    const packageJsonPath = join(packageDir, "package.json");
    if (!existsSync(packageJsonPath)) continue;

    try {
      const manifest = JSON.parse(readFileSync(packageJsonPath, "utf8")) as AddonPackageManifest;
      manifests.push({ packageDir, manifest });
    } catch {
      continue;
    }
  }

  return manifests;
}

export function getInstalledAddonRuntimeEntryPaths(workspaceDir = getWorkspaceDir()): string[] {
  const runtimeEntries: string[] = [];

  for (const { packageDir, manifest } of getInstalledAddonPackageManifests(workspaceDir)) {
    const declared = toTrimmedStringArray(manifest?.pi?.runtime?.entries);
    for (const relativePath of declared) {
      const fullPath = join(packageDir, relativePath);
      if (existsSync(fullPath) && statSync(fullPath).isFile()) runtimeEntries.push(fullPath);
    }
  }

  return runtimeEntries;
}

export function getAddonRecoveryExcludedChatJidPrefixes(workspaceDir = getWorkspaceDir()): string[] {
  const prefixes: string[] = [];
  const seen = new Set<string>();

  for (const { manifest } of getInstalledAddonPackageManifests(workspaceDir)) {
    const declared = toTrimmedStringArray(manifest?.pi?.runtime?.recovery?.excludeChatJidPrefixes);
    for (const prefix of declared) {
      if (seen.has(prefix)) continue;
      seen.add(prefix);
      prefixes.push(prefix);
    }
  }

  return prefixes;
}

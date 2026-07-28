#!/usr/bin/env bun

import { readFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";

type ParsedConfig = {
  sections: Map<string, Map<string, string[]>>;
};

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function stripInlineComment(line: string): string {
  let quote: 'single' | 'double' | null = null;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === "'" && quote !== "double") {
      quote = quote === "single" ? null : "single";
      continue;
    }
    if (ch === '"' && quote !== "single") {
      quote = quote === "double" ? null : "double";
      continue;
    }
    if (quote === null && (ch === ";" || ch === "#")) {
      if (i === 0 || /\s/.test(line[i - 1] ?? "")) {
        return line.slice(0, i).trimEnd();
      }
    }
  }
  return line.trimEnd();
}

function parseIniFile(path: string): ParsedConfig {
  let source: string;
  try {
    source = readFileSync(path, "utf8");
  } catch (error) {
    fail(`Failed to read ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const sections = new Map<string, Map<string, string[]>>();
  let currentSection: Map<string, string[]> | null = null;
  let lastKey: string | null = null;

  const lines = source.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const trimmedStart = rawLine.trimStart();

    if (trimmedStart === "" || trimmedStart.startsWith(";") || trimmedStart.startsWith("#")) {
      lastKey = null;
      continue;
    }

    const sectionMatch = rawLine.match(/^\s*\[([^\[\]\r\n]+)\]\s*$/);
    if (sectionMatch) {
      const currentSectionName = sectionMatch[1]!.trim();
      if (currentSectionName === "") {
        fail(`Invalid empty section name in ${path}:${index + 1}`);
      }
      currentSection = sections.get(currentSectionName) ?? new Map<string, string[]>();
      sections.set(currentSectionName, currentSection);
      lastKey = null;
      continue;
    }

    if (currentSection && lastKey && /^\s+/.test(rawLine)) {
      currentSection.get(lastKey)!.push(rawLine.trim());
      continue;
    }

    const uncommented = stripInlineComment(rawLine);
    const keyMatch = uncommented.match(/^\s*([^=\s][^=]*)\s*=\s*(.*)$/);
    if (keyMatch) {
      if (!currentSection) {
        fail(`Key/value outside any section in ${path}:${index + 1}`);
      }
      const key = keyMatch[1]!.trim();
      const value = keyMatch[2] ?? "";
      const existing = currentSection.get(key) ?? [];
      existing.push(value);
      currentSection.set(key, existing);
      lastKey = key;
      continue;
    }

    fail(`Invalid INI syntax in ${path}:${index + 1}: ${rawLine}`);
  }

  return { sections };
}

async function expandIncludePattern(baseDir: string, pattern: string): Promise<string[]> {
  const resolvedPattern = isAbsolute(pattern) ? pattern : resolve(baseDir, pattern);
  const matches: string[] = [];
  const glob = new Bun.Glob(resolvedPattern);
  for await (const match of glob.scan({ absolute: true })) {
    matches.push(match);
  }
  matches.sort();
  return matches;
}

async function main(): Promise<void> {
  const conf = process.argv[2];
  if (!conf) {
    fail("Usage: validate-supervisor-config.ts <path-to-supervisord.conf>");
  }

  const parsed = parseIniFile(conf);
  if (!parsed.sections.has("supervisord")) {
    fail(`Missing [supervisord] section in ${conf}`);
  }

  const includeSection = parsed.sections.get("include");
  const includeValues = includeSection?.get("files") ?? [];
  const baseDir = dirname(resolve(conf));
  for (const includeValue of includeValues) {
    for (const pattern of includeValue.split(/\s+/).filter(Boolean)) {
      const matches = await expandIncludePattern(baseDir, pattern);
      for (const includePath of matches) {
        parseIniFile(includePath);
      }
    }
  }
}

await main();

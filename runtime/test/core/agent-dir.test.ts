import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { getAgentDir } from "@earendil-works/pi-coding-agent";

import { getPiclawAgentDir, syncUpstreamAgentDirEnv } from "../../src/core/agent-dir.js";

const originalPiclawDir = process.env.PICLAW_PI_AGENT_DIR;
const originalUpstreamDir = process.env.PI_CODING_AGENT_DIR;
const roots: string[] = [];

afterEach(() => {
  if (originalPiclawDir === undefined) delete process.env.PICLAW_PI_AGENT_DIR;
  else process.env.PICLAW_PI_AGENT_DIR = originalPiclawDir;
  if (originalUpstreamDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
  else process.env.PI_CODING_AGENT_DIR = originalUpstreamDir;
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("canonical Piclaw agent directory", () => {
  test("Piclaw configuration wins over a conflicting upstream directory", () => {
    expect(getPiclawAgentDir({
      PICLAW_PI_AGENT_DIR: "./piclaw-agent",
      PI_CODING_AGENT_DIR: "./upstream-agent",
    } as NodeJS.ProcessEnv)).toBe(resolve("./piclaw-agent"));
  });

  test("falls back to the upstream directory when Piclaw is unset", () => {
    expect(getPiclawAgentDir({
      PI_CODING_AGENT_DIR: "./upstream-agent",
    } as NodeJS.ProcessEnv)).toBe(resolve("./upstream-agent"));
  });

  test("synchronizes Earendil before runtime imports use getAgentDir", () => {
    const root = mkdtempSync(join(tmpdir(), "piclaw-agent-dir-"));
    roots.push(root);
    const piclawDir = join(root, "piclaw");
    const upstreamDir = join(root, "upstream");
    process.env.PICLAW_PI_AGENT_DIR = piclawDir;
    process.env.PI_CODING_AGENT_DIR = upstreamDir;

    expect(syncUpstreamAgentDirEnv()).toBe(piclawDir);
    expect(process.env.PI_CODING_AGENT_DIR).toBe(piclawDir);
    expect(getAgentDir()).toBe(piclawDir);
  });
});

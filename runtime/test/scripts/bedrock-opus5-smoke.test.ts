import { expect, test } from "bun:test";
import { join } from "node:path";

const runtimeDir = join(import.meta.dir, "../..");
const script = join(runtimeDir, "scripts", "bedrock-opus5-smoke.ts");

test("Bedrock Opus 5 smoke defaults to a credential-redacted offline dry run", () => {
  const proc = Bun.spawnSync([process.execPath, script], {
    cwd: runtimeDir,
    env: {
      PATH: process.env.PATH || "",
      HOME: process.env.HOME || "/tmp",
      PI_PROVIDER: "github-copilot",
      PI_MODEL: "gpt-5.6-sol",
      AWS_ACCESS_KEY_ID: "should-not-appear",
      AWS_SECRET_ACCESS_KEY: "should-not-appear",
    },
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = proc.stdout.toString();
  expect(proc.exitCode, proc.stderr.toString() || stdout).toBe(0);
  const payload = JSON.parse(stdout) as Record<string, any>;
  expect(payload).toMatchObject({
    mode: "dry-run",
    network: false,
    model: { label: "amazon-bedrock/us.anthropic.claude-opus-5", nativeXhigh: true },
    authSourcesPresent: { accessKeys: true },
  });
  expect(stdout).not.toContain("should-not-appear");
});

test("Bedrock smoke rejects unknown models before opening the network", () => {
  const proc = Bun.spawnSync([process.execPath, script, "--model=not-a-bedrock-model"], {
    cwd: runtimeDir,
    env: { PATH: process.env.PATH || "", HOME: process.env.HOME || "/tmp" },
    stdout: "pipe",
    stderr: "pipe",
  });
  expect(proc.exitCode).toBe(2);
  expect(proc.stderr.toString()).toContain("Unknown Amazon Bedrock model");
});

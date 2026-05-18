/**
 * test/cli-options.test.ts – CLI argument validation regression tests.
 */

import { afterAll, expect, test } from "bun:test";
import { importFresh } from "./helpers.js";

afterAll(() => {
  process.exitCode = 0;
});

test("unknown CLI option is handled as an error instead of starting the runtime", async () => {
  process.exitCode = 0;
  const errors: string[] = [];
  const originalError = console.error;
  console.error = (...args: any[]) => {
    errors.push(args.map(String).join(" "));
  };

  try {
    const { handleCliOptions } = await importFresh<typeof import("../src/cli.js")>("../src/cli.js");
    const handled = await handleCliOptions(["--list-models"]);
    expect(handled).toBe(true);
    expect(process.exitCode).toBe(1);
  } finally {
    console.error = originalError;
    process.exitCode = 0;
  }

  expect(errors.join("\n")).toContain("Unknown option: --list-models");
});

test("valid runtime flags are not treated as CLI subcommands", async () => {
  process.exitCode = 0;

  try {
    const { handleCliOptions } = await importFresh<typeof import("../src/cli.js")>("../src/cli.js");
    expect(await handleCliOptions(["--port", "8081", "--host=127.0.0.1"])).toBe(false);
  } finally {
    process.exitCode = 0;
  }
});

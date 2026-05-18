#!/usr/bin/env bun
/**
 * index.ts – Application entry point.
 *
 * Checks for CLI sub-commands (keychain, --help, --version) first.
 * If none match, starts the full runtime (database, channels, agent pool,
 * IPC watcher, task scheduler, and web server).
 */

import { handleCliOptions } from "./cli.js";
import { createLogger } from "./utils/logger.js";

const log = createLogger("piclaw");

const handled = await handleCliOptions();
if (handled) {
  process.exit(process.exitCode ?? 0);
}

const { main } = await import("./runtime.js");
main().catch((error) => {
  log.error("Fatal runtime error", {
    operation: "piclaw.main",
    err: error,
  });
  process.exit(1);
});

/**
 * runtime.ts – Application lifecycle: startup, polling loop, and shutdown.
 *
 * This is the top-level orchestrator that wires together all subsystems:
 *   - Initialises the database (db/connection.ts).
 *   - Creates the AgentPool, AgentQueue, and RuntimeState.
 *   - Starts the web channel, optional Pushover, optional opt-in WhatsApp, and IPC.
 *   - Runs the main message-polling loop and task scheduler.
 *   - Handles graceful shutdown (SIGINT/SIGTERM).
 *
 * Consumers:
 *   - index.ts calls startRuntime() as the entry point.
 */

import { DATA_DIR } from "./core/config.js";
import { bootstrapRuntime, createDefaultRuntimeBootstrapDeps } from "./runtime/bootstrap.js";
import { createRuntimeCoreServices } from "./runtime/composition.js";
import { acquireRuntimeLock } from "./runtime/single-instance.js";

/** Boot all subsystems (DB, channels, agent pool, scheduler) and enter the main loop. */
export async function main(): Promise<void> {
  const runtimeLock = acquireRuntimeLock();
  try {
    const core = createRuntimeCoreServices({ dataDir: DATA_DIR });
    await bootstrapRuntime(createDefaultRuntimeBootstrapDeps(core));
  } finally {
    runtimeLock.release();
  }
}

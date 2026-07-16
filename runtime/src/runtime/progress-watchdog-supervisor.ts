import { spawn, type ChildProcess, type SpawnOptions } from "node:child_process";
import { resolve } from "node:path";

import { createLogger, debugSuppressedError } from "../utils/logger.js";
import {
  type ProgressWatchdogSnapshot,
  flushProgressWatchdogState,
  getProgressWatchdogTimeoutMs,
  markProgressWatchdogShuttingDown,
  setProgressWatchdogSnapshotPublisher,
} from "./progress-watchdog.js";
import { registerPreShutdownHook } from "./shutdown-registry.js";

const log = createLogger("runtime.progress-watchdog-supervisor");
const ENTRY_PATH = resolve(import.meta.dir, "./progress-watchdog-monitor.ts");

type ProgressWatchdogSpawn = (command: string, args: string[], options: SpawnOptions) => ChildProcess;

let spawnProgressWatchdogMonitorImpl: ProgressWatchdogSpawn = (command, args, options) => spawn(command, args, options);
let activeProgressWatchdogChild: ChildProcess | null = null;
let releaseProgressWatchdogPublisher: (() => void) | null = null;
let preShutdownHookRegistered = false;
let externalProgressWatchdogDisabledOverride: boolean | null = null;
let externalProgressWatchdogDbInMemoryOverride: boolean | null = null;

function isChildStillActive(child: ChildProcess | null): boolean {
  if (!child) return false;
  return child.exitCode === null && !child.killed;
}

function ensurePreShutdownHookRegistered(): void {
  if (preShutdownHookRegistered) return;
  preShutdownHookRegistered = true;
  registerPreShutdownHook(async () => {
    await stopExternalProgressWatchdogMonitor();
  });
}

function isExternalProgressWatchdogDisabled(): boolean {
  if (externalProgressWatchdogDisabledOverride !== null) return externalProgressWatchdogDisabledOverride;
  return ["0", "false", "off", "disabled", "no"].includes(String(process.env.PICLAW_EXTERNAL_PROGRESS_WATCHDOG || "").trim().toLowerCase());
}

function isDbInMemoryForWatchdog(): boolean {
  if (externalProgressWatchdogDbInMemoryOverride !== null) return externalProgressWatchdogDbInMemoryOverride;
  return process.env.PICLAW_DB_IN_MEMORY === "1";
}

function writeSnapshotToChild(child: ChildProcess, snapshot: ProgressWatchdogSnapshot): void {
  const stdin = child.stdin;
  if (!stdin || stdin.destroyed || stdin.writableEnded) return;
  try {
    stdin.write(`${JSON.stringify(snapshot)}\n`);
  } catch (error) {
    debugSuppressedError(log, "Failed to write progress-watchdog heartbeat snapshot to monitor pipe.", error, {
      operation: "progress_watchdog_supervisor.write_pipe",
      pid: child.pid,
    });
  }
}

function clearActiveWatchdogChild(child: ChildProcess): void {
  if (activeProgressWatchdogChild !== child) return;
  activeProgressWatchdogChild = null;
  releaseProgressWatchdogPublisher?.();
  releaseProgressWatchdogPublisher = null;
}

export function startExternalProgressWatchdogMonitor(): boolean {
  if (isExternalProgressWatchdogDisabled() || isDbInMemoryForWatchdog()) return false;
  const timeoutMs = getProgressWatchdogTimeoutMs();
  if (timeoutMs <= 0) return false;
  if (isChildStillActive(activeProgressWatchdogChild)) {
    flushProgressWatchdogState();
    return true;
  }

  ensurePreShutdownHookRegistered();

  const child = spawnProgressWatchdogMonitorImpl(process.execPath, [
    ENTRY_PATH,
    "--parent-pid",
    String(process.pid),
  ], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["pipe", "ignore", "ignore"],
  });

  activeProgressWatchdogChild = child;
  releaseProgressWatchdogPublisher = setProgressWatchdogSnapshotPublisher((snapshot) => {
    writeSnapshotToChild(child, snapshot);
  });

  child.stdin?.once("error", (error) => {
    debugSuppressedError(log, "External progress-watchdog monitor pipe errored.", error, {
      operation: "progress_watchdog_supervisor.pipe_error",
      pid: child.pid,
    });
    clearActiveWatchdogChild(child);
  });
  child.once("exit", () => {
    clearActiveWatchdogChild(child);
  });
  child.once("error", (error) => {
    log.warn("External progress-watchdog monitor failed to start.", {
      operation: "progress_watchdog_supervisor.spawn",
      err: error,
    });
    clearActiveWatchdogChild(child);
  });
  child.unref();

  flushProgressWatchdogState();

  log.info("Started external progress-watchdog monitor.", {
    operation: "progress_watchdog_supervisor.start",
    pid: child.pid,
    timeoutMs,
    transport: "pipe",
  });
  return true;
}

export async function stopExternalProgressWatchdogMonitor(): Promise<void> {
  const child = activeProgressWatchdogChild;
  if (!child) {
    releaseProgressWatchdogPublisher?.();
    releaseProgressWatchdogPublisher = null;
    return;
  }

  markProgressWatchdogShuttingDown();

  try {
    child.stdin?.end();
  } catch (error) {
    debugSuppressedError(log, "Failed to close external progress-watchdog monitor pipe.", error, {
      operation: "progress_watchdog_supervisor.close_pipe",
      pid: child.pid,
    });
  }

  clearActiveWatchdogChild(child);
  if (!isChildStillActive(child)) return;

  const deadline = Date.now() + 2_000;
  while (Date.now() < deadline) {
    if (!isChildStillActive(child)) return;
    await Bun.sleep(50);
  }

  if (!isChildStillActive(child)) return;
  try {
    child.kill("SIGTERM");
  } catch (error) {
    debugSuppressedError(log, "Failed to stop external progress-watchdog monitor.", error, {
      operation: "progress_watchdog_supervisor.stop",
      pid: child.pid,
    });
    return;
  }

  const forceDeadline = Date.now() + 2_000;
  while (Date.now() < forceDeadline) {
    if (!isChildStillActive(child)) return;
    await Bun.sleep(50);
  }

  if (!isChildStillActive(child)) return;
  try {
    child.kill("SIGKILL");
  } catch (error) {
    debugSuppressedError(log, "Failed to SIGKILL external progress-watchdog monitor after timeout.", error, {
      operation: "progress_watchdog_supervisor.stop_force",
      pid: child.pid,
    });
  }
}

export function setProgressWatchdogMonitorSpawnForTests(factory: ProgressWatchdogSpawn | null): void {
  spawnProgressWatchdogMonitorImpl = factory ?? ((command, args, options) => spawn(command, args, options));
}

export function setProgressWatchdogSupervisorEnvironmentForTests(options: {
  disabled?: boolean | null;
  dbInMemory?: boolean | null;
}): () => void {
  const previousDisabled = externalProgressWatchdogDisabledOverride;
  const previousDbInMemory = externalProgressWatchdogDbInMemoryOverride;
  externalProgressWatchdogDisabledOverride = options.disabled === undefined ? previousDisabled : options.disabled;
  externalProgressWatchdogDbInMemoryOverride = options.dbInMemory === undefined ? previousDbInMemory : options.dbInMemory;
  return () => {
    externalProgressWatchdogDisabledOverride = previousDisabled;
    externalProgressWatchdogDbInMemoryOverride = previousDbInMemory;
  };
}

export function resetProgressWatchdogSupervisorForTests(): void {
  activeProgressWatchdogChild = null;
  releaseProgressWatchdogPublisher = null;
  spawnProgressWatchdogMonitorImpl = (command, args, options) => spawn(command, args, options);
  preShutdownHookRegistered = false;
  externalProgressWatchdogDisabledOverride = null;
  externalProgressWatchdogDbInMemoryOverride = null;
}

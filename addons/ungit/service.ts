import { mkdirSync } from "node:fs";

export const UNGIT_HEALTH_URL = "http://127.0.0.1:8448/ungit/api/ping";
export const UNGIT_LAUNCH_CWD = "/workspace/.piclaw";
export const UNGIT_START_COMMAND = Object.freeze([
  "bunx",
  "--bun",
  "ungit",
  "--ungitBindIp=127.0.0.1",
  "--port=8448",
  "--rootPath=/ungit",
  "--no-launchBrowser",
]);

const HEALTH_TIMEOUT_MS = 1_500;
const UNGIT_PROCESS_PATTERN = "ungit.*--ungitBindIp=127[.]0[.]0[.]1.*--port=8448.*--rootPath=/ungit";

type FetchImplementation = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
type SpawnedProcess = { pid?: number; unref?: () => void };
type SpawnImplementation = (
  command: string[],
  options: { cwd: string; stdin: "ignore"; stdout: "inherit"; stderr: "inherit" },
) => SpawnedProcess;

export async function isUngitLive(
  fetchImpl: FetchImplementation = globalThis.fetch,
  timeoutMs = HEALTH_TIMEOUT_MS,
): Promise<boolean> {
  if (typeof fetchImpl !== "function") return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(UNGIT_HEALTH_URL, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const payload = await response.json().catch(() => null);
    return Boolean(payload) && typeof payload === "object" && !Array.isArray(payload);
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export function findUngitPids(): number[] {
  try {
    const result = Bun.spawnSync(["pgrep", "-f", UNGIT_PROCESS_PATTERN], {
      stdout: "pipe",
      stderr: "ignore",
    });
    const output = new TextDecoder().decode(result.stdout).trim();
    if (!output) return [];
    return [...new Set(output.split(/\s+/).map(Number).filter((pid) => Number.isInteger(pid) && pid > 1))];
  } catch {
    return [];
  }
}

export function stopUngit(options: {
  findPids?: () => number[];
  killImpl?: (pid: number, signal: "SIGTERM") => void;
} = {}): number {
  const pids = (options.findPids ?? findUngitPids)();
  const killImpl = options.killImpl ?? ((pid, signal) => { process.kill(pid, signal); });
  let killed = 0;
  for (const pid of pids) {
    try {
      killImpl(pid, "SIGTERM");
      killed += 1;
    } catch {
      // A parent may already have stopped its child.
    }
  }
  if (killed > 0) console.info(`[ungit] stopped process${killed === 1 ? "" : "es"}: ${pids.join(", ")}`);
  return killed;
}

export async function startUngitIfNeeded(options: {
  fetchImpl?: FetchImplementation;
  spawnImpl?: SpawnImplementation;
  ensureLaunchCwd?: (cwd: string) => void;
  launchCwd?: string;
} = {}): Promise<void> {
  if (await isUngitLive(options.fetchImpl)) {
    console.info("[ungit] service is already live");
    return;
  }

  const launchCwd = options.launchCwd || UNGIT_LAUNCH_CWD;
  try {
    (options.ensureLaunchCwd ?? ((cwd) => mkdirSync(cwd, { recursive: true })))(launchCwd);
    const spawnImpl: SpawnImplementation = options.spawnImpl ?? ((command, spawnOptions) => Bun.spawn(command, spawnOptions));
    const child = spawnImpl([...UNGIT_START_COMMAND], {
      cwd: launchCwd,
      stdin: "ignore",
      stdout: "inherit",
      stderr: "inherit",
    });
    child.unref?.();
    console.info(`[ungit] startup command launched${child.pid ? ` (pid ${child.pid})` : ""}`);
  } catch (error) {
    console.warn("[ungit] unable to launch startup command", error);
  }
}

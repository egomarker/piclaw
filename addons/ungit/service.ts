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

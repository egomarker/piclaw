import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

export const UNGIT_HEALTH_URL = "http://127.0.0.1:8448/ungit/api/ping";
export const UNGIT_IDENTITY_URL = "http://127.0.0.1:8448/ungit/";
export const UNGIT_LAUNCH_CWD = "/workspace/.piclaw";
export const UNGIT_REPOSITORY_URL = "https://github.com/egomarker/ungit-go.git";
export const UNGIT_REPOSITORY_REF = "refs/heads/main";
export const UNGIT_GO_PACKAGE = "github.com/egomarker/ungit-go/cmd/ungit-go";
export const UNGIT_SHA_OVERRIDE_ENV = "PICLAW_UNGIT_GO_SHA";
export const LEGACY_UNGIT_SHA_OVERRIDE_ENV = "PICLAW_UNGIT_SHA";
export const UNGIT_STATE_PATH = join(
  process.env.PICLAW_DATA?.trim() || "/workspace/.piclaw/data",
  "ungit-go-launch-state.json",
);
export const UNGIT_REQUIRED_ASSET_URLS = Object.freeze([
  "http://127.0.0.1:8448/ungit/css/styles.css",
  "http://127.0.0.1:8448/ungit/css/styles-light.css",
  "http://127.0.0.1:8448/ungit/js/ungit.js",
  "http://127.0.0.1:8448/ungit/plugins/app/app.bundle.js",
  "http://127.0.0.1:8448/ungit/plugins/app/app.css",
  "http://127.0.0.1:8448/ungit/plugins/app/app-light.css",
]);

const UNGIT_GO_IDENTITY_MARKER = "<title>Ungit-Go</title>";
const UNGIT_GO_BINARY_NAME = process.platform === "win32" ? "ungit-go.exe" : "ungit-go";
const UNGIT_LAUNCH_STATE_VERSION = 2;
const UNGIT_LAUNCH_IMPLEMENTATION = "ungit-go";
const UNGIT_SERVER_ARGUMENTS = Object.freeze([
  "--ungitBindIp=127.0.0.1",
  "--port=8448",
  "--rootPath=/ungit",
  "--no-launchBrowser",
]);
const FULL_GIT_SHA = /^[0-9a-f]{40}$/;
const HEALTH_TIMEOUT_MS = 1_500;
const REMOTE_REF_TIMEOUT_MS = 10_000;
const STARTUP_TIMEOUT_MS = 360_000;
const STARTUP_POLL_INTERVAL_MS = 500;
const FAILED_LAUNCH_STOP_TIMEOUT_MS = 5_000;
const FAILED_LAUNCH_STOP_POLL_INTERVAL_MS = 100;
const UNGIT_PROCESS_PATTERN =
  "ungit.*--ungitBindIp=127[.]0[.]0[.]1.*--port=8448.*--rootPath=/ungit";

export type UngitRevisionSource = "override" | "remote-main" | "last-known-good";

export interface ResolvedUngitRevision {
  sha: string;
  source: UngitRevisionSource;
}

interface UngitLaunchState extends ResolvedUngitRevision {
  version: 2;
  implementation: "ungit-go";
  repositoryUrl: string;
  verifiedAt: string;
}

interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

type Environment = Record<string, string | undefined>;
type FetchImplementation = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
type RunGitImplementation = (command: string[], timeoutMs: number) => Promise<CommandResult>;
type RunGoInstallImplementation = (
  command: string[],
  options: { cwd: string; env: Environment; timeoutMs: number },
) => Promise<CommandResult>;
export type SpawnedUngitProcess = {
  pid?: number;
  exited?: Promise<number>;
  unref?: () => void;
  kill?: (signal?: "SIGTERM") => void;
};
type SpawnImplementation = (
  command: string[],
  options: { cwd: string; stdin: "ignore"; stdout: "inherit"; stderr: "inherit" },
) => SpawnedUngitProcess;
type SleepImplementation = (milliseconds: number) => Promise<unknown>;

export interface ResolveUngitRevisionOptions {
  env?: Environment;
  resolveRemoteSha?: () => Promise<string>;
  loadLastKnownGood?: () => string | null;
}

export interface StartUngitOptions {
  fetchImpl?: FetchImplementation;
  spawnImpl?: SpawnImplementation;
  ensureLaunchCwd?: (cwd: string) => void;
  launchCwd?: string;
  resolveRevision?: () => Promise<ResolvedUngitRevision>;
  ensureBinary?: (revision: ResolvedUngitRevision, launchCwd: string) => Promise<string>;
  waitForRuntime?: () => Promise<void>;
  loadLastKnownGood?: () => string | null;
  cleanupFailedLaunch?: (child?: SpawnedUngitProcess) => Promise<void> | void;
  saveLastKnownGood?: (revision: ResolvedUngitRevision) => void;
}

function isUngitRevisionSource(value: unknown): value is UngitRevisionSource {
  return value === "override" || value === "remote-main" || value === "last-known-good";
}

export function normalizeUngitSha(value: unknown): string | null {
  const sha = typeof value === "string" ? value.trim().toLowerCase() : "";
  return FULL_GIT_SHA.test(sha) ? sha : null;
}

export function parseUngitLsRemote(output: string): string {
  for (const line of output.trim().split(/\r?\n/)) {
    const [candidate, ref] = line.trim().split(/\s+/, 2);
    const sha = normalizeUngitSha(candidate);
    if (sha && ref === UNGIT_REPOSITORY_REF) return sha;
  }
  throw new Error(`Unable to resolve ${UNGIT_REPOSITORY_REF} from ${UNGIT_REPOSITORY_URL}.`);
}

export async function runGitCommand(command: string[], timeoutMs: number): Promise<CommandResult> {
  const child = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });
  const stdoutPromise = new Response(child.stdout).text();
  const stderrPromise = new Response(child.stderr).text();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    try {
      child.kill("SIGKILL");
    } catch {
      // The process may have exited between the timeout firing and kill().
    }
  }, timeoutMs);

  try {
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      stdoutPromise,
      stderrPromise,
    ]);
    if (timedOut) throw new Error(`Timed out after ${timeoutMs}ms running git ls-remote.`);
    return { exitCode, stdout, stderr };
  } finally {
    clearTimeout(timeout);
  }
}

export async function resolveRemoteUngitSha(options: {
  runGitImpl?: RunGitImplementation;
  timeoutMs?: number;
} = {}): Promise<string> {
  const command = [
    "git",
    "ls-remote",
    "--exit-code",
    UNGIT_REPOSITORY_URL,
    UNGIT_REPOSITORY_REF,
  ];
  const result = await (options.runGitImpl ?? runGitCommand)(
    command,
    options.timeoutMs ?? REMOTE_REF_TIMEOUT_MS,
  );
  if (result.exitCode !== 0) {
    const detail = result.stderr.trim() || "no error output";
    throw new Error(`git ls-remote failed with exit code ${result.exitCode}: ${detail}`);
  }
  return parseUngitLsRemote(result.stdout);
}

export function loadLastKnownGoodUngitSha(statePath = UNGIT_STATE_PATH): string | null {
  try {
    const state = JSON.parse(readFileSync(statePath, "utf8")) as Partial<UngitLaunchState>;
    if (
      state.version !== UNGIT_LAUNCH_STATE_VERSION ||
      state.implementation !== UNGIT_LAUNCH_IMPLEMENTATION ||
      state.repositoryUrl !== UNGIT_REPOSITORY_URL ||
      !isUngitRevisionSource(state.source)
    ) return null;
    return normalizeUngitSha(state.sha);
  } catch {
    return null;
  }
}

export function saveLastKnownGoodUngitRevision(
  revision: ResolvedUngitRevision,
  statePath = UNGIT_STATE_PATH,
): void {
  const sha = normalizeUngitSha(revision.sha);
  if (!sha || !isUngitRevisionSource(revision.source)) {
    throw new Error("Cannot persist an invalid Ungit-Go revision.");
  }

  mkdirSync(dirname(statePath), { recursive: true });
  const temporaryPath = `${statePath}.${process.pid}.${Date.now()}.tmp`;
  const state: UngitLaunchState = {
    version: UNGIT_LAUNCH_STATE_VERSION,
    implementation: UNGIT_LAUNCH_IMPLEMENTATION,
    repositoryUrl: UNGIT_REPOSITORY_URL,
    sha,
    source: revision.source,
    verifiedAt: new Date().toISOString(),
  };

  try {
    writeFileSync(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    });
    renameSync(temporaryPath, statePath);
  } finally {
    try {
      unlinkSync(temporaryPath);
    } catch {
      // renameSync() removes the temporary path after a successful write.
    }
  }
}

export async function resolveUngitRevision(
  options: ResolveUngitRevisionOptions = {},
): Promise<ResolvedUngitRevision> {
  const env = options.env ?? process.env;
  const overrideValue = env[UNGIT_SHA_OVERRIDE_ENV];
  if (overrideValue?.trim()) {
    const sha = normalizeUngitSha(overrideValue);
    if (!sha) {
      throw new Error(`${UNGIT_SHA_OVERRIDE_ENV} must be a full 40-character Git SHA.`);
    }
    return { sha, source: "override" };
  }
  if (env[LEGACY_UNGIT_SHA_OVERRIDE_ENV]?.trim()) {
    throw new Error(
      `${LEGACY_UNGIT_SHA_OVERRIDE_ENV} targets the legacy Node service; use ${UNGIT_SHA_OVERRIDE_ENV} for Ungit-Go.`,
    );
  }

  try {
    const remoteValue = await (options.resolveRemoteSha ?? resolveRemoteUngitSha)();
    const sha = normalizeUngitSha(remoteValue);
    if (!sha) throw new Error("Remote Ungit-Go resolver returned an invalid Git SHA.");
    return { sha, source: "remote-main" };
  } catch (error) {
    const fallbackSha = normalizeUngitSha(
      (options.loadLastKnownGood ?? loadLastKnownGoodUngitSha)(),
    );
    if (!fallbackSha) throw error;
    console.warn(
      `[ungit-go] remote main resolution failed; using last-known-good ${fallbackSha}`,
      error,
    );
    return { sha: fallbackSha, source: "last-known-good" };
  }
}

export function buildUngitInstallCommand(shaValue: string): string[] {
  const sha = normalizeUngitSha(shaValue);
  if (!sha) throw new Error("Cannot build the Ungit-Go install command from an invalid Git SHA.");
  return ["go", "install", `${UNGIT_GO_PACKAGE}@${sha}`];
}

export function resolveUngitBinaryPath(
  shaValue: string,
  launchCwd = UNGIT_LAUNCH_CWD,
): string {
  const sha = normalizeUngitSha(shaValue);
  if (!sha) throw new Error("Cannot resolve an Ungit-Go binary path from an invalid Git SHA.");
  return join(launchCwd, "bin", "ungit-go", sha, UNGIT_GO_BINARY_NAME);
}

export function buildUngitStartCommand(
  shaValue: string,
  launchCwd = UNGIT_LAUNCH_CWD,
): string[] {
  return [resolveUngitBinaryPath(shaValue, launchCwd), ...UNGIT_SERVER_ARGUMENTS];
}

export async function runGoInstallCommand(
  command: string[],
  options: { cwd: string; env: Environment; timeoutMs: number },
): Promise<CommandResult> {
  const child = Bun.spawn(command, {
    cwd: options.cwd,
    env: options.env,
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdoutPromise = new Response(child.stdout).text();
  const stderrPromise = new Response(child.stderr).text();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    try {
      child.kill("SIGKILL");
    } catch {
      // The installer may have exited between the timeout firing and kill().
    }
  }, options.timeoutMs);

  try {
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      stdoutPromise,
      stderrPromise,
    ]);
    if (timedOut) throw new Error(`Timed out after ${options.timeoutMs}ms installing Ungit-Go.`);
    return { exitCode, stdout, stderr };
  } finally {
    clearTimeout(timeout);
  }
}

export async function ensureUngitBinary(
  shaValue: string,
  launchCwd = UNGIT_LAUNCH_CWD,
  options: { runInstallImpl?: RunGoInstallImplementation; timeoutMs?: number } = {},
): Promise<string> {
  const sha = normalizeUngitSha(shaValue);
  if (!sha) throw new Error("Cannot install Ungit-Go from an invalid Git SHA.");
  const binaryPath = resolveUngitBinaryPath(sha, launchCwd);
  if (existsSync(binaryPath)) return binaryPath;

  const binaryDirectory = dirname(binaryPath);
  mkdirSync(dirname(binaryDirectory), { recursive: true });
  const temporaryDirectory = mkdtempSync(
    join(dirname(binaryDirectory), `.${sha}.${process.pid}.`),
  );
  const temporaryBinaryPath = join(temporaryDirectory, UNGIT_GO_BINARY_NAME);
  try {
    const cacheRoot = join(launchCwd, "cache", "ungit-go");
    const result = await (options.runInstallImpl ?? runGoInstallCommand)(
      buildUngitInstallCommand(sha),
      {
        cwd: launchCwd,
        env: {
          ...process.env,
          CGO_ENABLED: "0",
          GOBIN: temporaryDirectory,
          GOCACHE: join(cacheRoot, "build"),
          GOMODCACHE: join(cacheRoot, "modules"),
        },
        timeoutMs: options.timeoutMs ?? STARTUP_TIMEOUT_MS,
      },
    );
    if (result.exitCode !== 0) {
      const detail = result.stderr.trim() || result.stdout.trim() || "no error output";
      throw new Error(`go install failed with exit code ${result.exitCode}: ${detail}`);
    }
    if (!existsSync(temporaryBinaryPath)) {
      throw new Error("go install completed without producing the Ungit-Go executable.");
    }
    if (process.platform !== "win32") chmodSync(temporaryBinaryPath, 0o755);
    mkdirSync(binaryDirectory, { recursive: true });
    if (!existsSync(binaryPath)) renameSync(temporaryBinaryPath, binaryPath);
    return binaryPath;
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

async function hasUngitPing(
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

async function hasUngitGoIdentity(
  fetchImpl: FetchImplementation = globalThis.fetch,
  timeoutMs = HEALTH_TIMEOUT_MS,
): Promise<boolean> {
  if (typeof fetchImpl !== "function") return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(UNGIT_IDENTITY_URL, {
      headers: { Accept: "text/html" },
      signal: controller.signal,
    });
    return response.ok && (await response.text()).includes(UNGIT_GO_IDENTITY_MARKER);
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function isUngitLive(
  fetchImpl: FetchImplementation = globalThis.fetch,
  timeoutMs = HEALTH_TIMEOUT_MS,
): Promise<boolean> {
  return await hasUngitPing(fetchImpl, timeoutMs) &&
    await hasUngitGoIdentity(fetchImpl, timeoutMs);
}

export async function verifyUngitRuntime(
  fetchImpl: FetchImplementation = globalThis.fetch,
  timeoutMs = HEALTH_TIMEOUT_MS,
): Promise<boolean> {
  if (!(await isUngitLive(fetchImpl, timeoutMs))) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const responses = await Promise.all(
      UNGIT_REQUIRED_ASSET_URLS.map((url) =>
        fetchImpl(url, { headers: { Accept: "*/*" }, signal: controller.signal }),
      ),
    );
    return responses.every((response) => response.ok);
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function waitForUngitRuntime(options: {
  fetchImpl?: FetchImplementation;
  timeoutMs?: number;
  pollIntervalMs?: number;
  sleepImpl?: SleepImplementation;
} = {}): Promise<void> {
  const timeoutMs = options.timeoutMs ?? STARTUP_TIMEOUT_MS;
  const pollIntervalMs = options.pollIntervalMs ?? STARTUP_POLL_INTERVAL_MS;
  const deadline = Date.now() + timeoutMs;
  do {
    if (await verifyUngitRuntime(options.fetchImpl)) return;
    if (Date.now() >= deadline) break;
    await (options.sleepImpl ?? ((milliseconds) => Bun.sleep(milliseconds)))(pollIntervalMs);
  } while (Date.now() <= deadline);
  throw new Error(`Ungit-Go did not become ready within ${timeoutMs}ms.`);
}

export function findUngitPids(): number[] {
  try {
    const result = Bun.spawnSync(["pgrep", "-f", UNGIT_PROCESS_PATTERN], {
      stdout: "pipe",
      stderr: "ignore",
    });
    const output = new TextDecoder().decode(result.stdout).trim();
    if (!output) return [];
    return [
      ...new Set(
        output
          .split(/\s+/)
          .map(Number)
          .filter((pid) => Number.isInteger(pid) && pid > 1),
      ),
    ];
  } catch {
    return [];
  }
}

export function stopUngit(options: {
  findPids?: () => number[];
  killImpl?: (pid: number, signal: "SIGTERM") => void;
} = {}): number {
  const pids = (options.findPids ?? findUngitPids)();
  const killImpl =
    options.killImpl ??
    ((pid, signal) => {
      process.kill(pid, signal);
    });
  let killed = 0;
  for (const pid of pids) {
    try {
      killImpl(pid, "SIGTERM");
      killed += 1;
    } catch {
      // A parent may already have stopped its child.
    }
  }
  if (killed > 0) {
    console.info(`[ungit-go] stopped process${killed === 1 ? "" : "es"}: ${pids.join(", ")}`);
  }
  return killed;
}

let ungitStartInFlight: Promise<void> | null = null;

async function cleanupFailedUngitLaunch(
  child: SpawnedUngitProcess | undefined,
  fetchImpl: FetchImplementation | undefined,
): Promise<void> {
  try {
    child?.kill?.("SIGTERM");
  } catch {
    // The process may already have exited after failing readiness.
  }
  stopUngit();

  const deadline = Date.now() + FAILED_LAUNCH_STOP_TIMEOUT_MS;
  while (await isUngitLive(fetchImpl, HEALTH_TIMEOUT_MS)) {
    if (Date.now() >= deadline) {
      throw new Error("Failed Ungit-Go revision remained live after SIGTERM.");
    }
    await Bun.sleep(FAILED_LAUNCH_STOP_POLL_INTERVAL_MS);
  }
}

function spawnUngitRevision(
  revision: ResolvedUngitRevision,
  binaryPath: string,
  launchCwd: string,
  options: StartUngitOptions,
): SpawnedUngitProcess {
  const command = [binaryPath, ...UNGIT_SERVER_ARGUMENTS];
  const spawnImpl: SpawnImplementation =
    options.spawnImpl ?? ((spawnCommand, spawnOptions) => Bun.spawn(spawnCommand, spawnOptions));
  const child = spawnImpl(command, {
    cwd: launchCwd,
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });
  child.unref?.();
  console.info(
    `[ungit-go] launching ${revision.sha} from ${revision.source}${child.pid ? ` (pid ${child.pid})` : ""}`,
  );
  return child;
}

async function waitForResolvedUngitRuntime(
  revision: ResolvedUngitRevision,
  child: SpawnedUngitProcess,
  options: StartUngitOptions,
): Promise<void> {
  const readiness = (
    options.waitForRuntime ?? (() => waitForUngitRuntime({ fetchImpl: options.fetchImpl }))
  )();
  if (!child.exited) {
    await readiness;
    return;
  }

  const outcome = await Promise.race([
    readiness.then(
      () => ({ kind: "ready" as const }),
      (error: unknown) => ({ kind: "readiness-error" as const, error }),
    ),
    child.exited.then(
      (exitCode) => ({ kind: "exit" as const, exitCode }),
      (error: unknown) => ({ kind: "exit-error" as const, error }),
    ),
  ]);
  if (outcome.kind === "ready") return;
  if (outcome.kind === "readiness-error" || outcome.kind === "exit-error") throw outcome.error;
  throw new Error(`Ungit-Go revision ${revision.sha} exited with code ${outcome.exitCode} before readiness.`);
}

function rememberVerifiedUngitRevision(
  revision: ResolvedUngitRevision,
  options: StartUngitOptions,
): void {
  try {
    (options.saveLastKnownGood ?? saveLastKnownGoodUngitRevision)(revision);
  } catch (error) {
    console.warn(`[ungit-go] unable to persist verified revision ${revision.sha}`, error);
  }
  console.info(`[ungit-go] verified revision ${revision.sha}`);
}

async function cleanUpFailedRevision(
  revision: ResolvedUngitRevision,
  child: SpawnedUngitProcess | undefined,
  launchError: unknown,
  options: StartUngitOptions,
): Promise<void> {
  try {
    await (
      options.cleanupFailedLaunch ??
      ((failedChild) => cleanupFailedUngitLaunch(failedChild, options.fetchImpl))
    )(child);
  } catch (cleanupError) {
    throw new AggregateError(
      [launchError, cleanupError],
      `Ungit-Go revision ${revision.sha} failed and could not be stopped cleanly.`,
    );
  }
}

async function startUngitInternal(options: StartUngitOptions): Promise<void> {
  if (await isUngitLive(options.fetchImpl)) {
    console.info("[ungit-go] service is already live");
    return;
  }
  if (await hasUngitPing(options.fetchImpl)) {
    throw new Error(
      "A legacy or unidentified Ungit service is already using 127.0.0.1:8448. Stop it before starting Ungit-Go.",
    );
  }

  const launchCwd = options.launchCwd || UNGIT_LAUNCH_CWD;
  (options.ensureLaunchCwd ?? ((cwd) => mkdirSync(cwd, { recursive: true })))(launchCwd);
  const revision = await (
    options.resolveRevision ??
    (() => resolveUngitRevision({ loadLastKnownGood: options.loadLastKnownGood }))
  )();

  let child: SpawnedUngitProcess | undefined;
  try {
    const binaryPath = await (
      options.ensureBinary ?? ((resolved) => ensureUngitBinary(resolved.sha, launchCwd))
    )(revision, launchCwd);
    child = spawnUngitRevision(revision, binaryPath, launchCwd, options);
    await waitForResolvedUngitRuntime(revision, child, options);
    rememberVerifiedUngitRevision(revision, options);
    return;
  } catch (launchError) {
    await cleanUpFailedRevision(revision, child, launchError, options);
    const fallbackSha = normalizeUngitSha(
      revision.source === "remote-main"
        ? (options.loadLastKnownGood ?? loadLastKnownGoodUngitSha)()
        : null,
    );
    if (!fallbackSha || fallbackSha === revision.sha) throw launchError;

    const fallbackRevision: ResolvedUngitRevision = {
      sha: fallbackSha,
      source: "last-known-good",
    };
    console.warn(
      `[ungit-go] revision ${revision.sha} failed readiness; retrying last-known-good ${fallbackSha}`,
      launchError,
    );

    let fallbackChild: SpawnedUngitProcess | undefined;
    try {
      const fallbackBinaryPath = await (
        options.ensureBinary ?? ((resolved) => ensureUngitBinary(resolved.sha, launchCwd))
      )(fallbackRevision, launchCwd);
      fallbackChild = spawnUngitRevision(
        fallbackRevision,
        fallbackBinaryPath,
        launchCwd,
        options,
      );
      await waitForResolvedUngitRuntime(fallbackRevision, fallbackChild, options);
      rememberVerifiedUngitRevision(fallbackRevision, options);
    } catch (fallbackError) {
      await cleanUpFailedRevision(fallbackRevision, fallbackChild, fallbackError, options);
      throw new AggregateError(
        [launchError, fallbackError],
        `Ungit-Go revision ${revision.sha} and fallback ${fallbackSha} both failed readiness.`,
      );
    }
  }
}

export function startUngitIfNeeded(options: StartUngitOptions = {}): Promise<void> {
  if (ungitStartInFlight) return ungitStartInFlight;
  const operation = startUngitInternal(options);
  const trackedOperation = operation.finally(() => {
    if (ungitStartInFlight === trackedOperation) ungitStartInFlight = null;
  });
  ungitStartInFlight = trackedOperation;
  return trackedOperation;
}

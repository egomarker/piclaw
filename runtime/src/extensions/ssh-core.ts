import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI, ExtensionFactory } from "@earendil-works/pi-coding-agent";
import {
  createBashTool,
  createEditTool,
  createReadTool,
  createWriteTool,
  type BashOperations,
  type EditOperations,
  type ReadOperations,
  type WriteOperations,
} from "@earendil-works/pi-coding-agent";

import { buildInjectedShellEnv, getKeychainEntry, resolveKeychainPlaceholders } from "../secure/keychain.js";
import type { SshConfig } from "../types.js";

interface SshBootstrapConnection {
  sshTarget: string;
  port: number;
  remotePath?: string;
  privateKeyPath: string;
  knownHostsPath?: string;
  controlPath: string;
  strictHostKeyChecking: SshStrictHostKeyCheckingMode;
  localCwd: string;
  localHome: string;
  tempDir: string;
}

interface SshConnection extends SshBootstrapConnection {
  remoteCwd: string;
  remoteHome: string;
}

interface SshCaptureOptions {
  stdin?: string | Buffer;
  timeoutSeconds?: number;
  signal?: AbortSignal;
}

interface RunningCommand {
  startMarker: string;
  endMarker: string;
  timeout?: number;
  onData: (chunk: Buffer) => void;
  signal?: AbortSignal;
  aborted: boolean;
  timedOut: boolean;
  timeoutHandle?: NodeJS.Timeout;
  hardStopHandle?: NodeJS.Timeout;
  abortHandler?: () => void;
  stdoutChunks: Buffer[];
  stderrChunks: Buffer[];
  resolve: (value: { exitCode: number | null }) => void;
  reject: (error: Error) => void;
}

export type SshStrictHostKeyCheckingMode = "yes" | "accept-new" | "no";

const DEFAULT_EXEC_TIMEOUT_SECONDS = 300;
const DEFAULT_SSH_CONNECT_TIMEOUT_SECONDS = 10;
const DEFAULT_SSH_SERVER_ALIVE_INTERVAL_SECONDS = 15;
const DEFAULT_SSH_SERVER_ALIVE_COUNT_MAX = 2;
const SSH_CAPTURE_KILL_GRACE_MS = 3000;
const PERSISTENT_WRITE_MAX_BYTES = 256 * 1024;
const DEFAULT_PERSISTENT_INTERRUPT_GRACE_MS = 3000;
const SSH_WORKING_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

let persistentSshSpawn = (
  args: string[],
  options: any,
): ChildProcessWithoutNullStreams => spawn("ssh", args, options);
let persistentInterruptGraceMs = DEFAULT_PERSISTENT_INTERRUPT_GRACE_MS;

export function setPersistentSshSpawnForTests(
  factory: ((args: string[], options: any) => ChildProcessWithoutNullStreams) | null,
): void {
  persistentSshSpawn = factory ?? ((args, options) => spawn("ssh", args, options));
}

export function setPersistentSshInterruptGraceMsForTests(value: number | null): void {
  persistentInterruptGraceMs = value == null ? DEFAULT_PERSISTENT_INTERRUPT_GRACE_MS : Math.max(0, value);
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildScopedBashCommand(command: string, env?: NodeJS.ProcessEnv): string {
  const envEntries = Object.entries(env ?? {}).filter(([, value]) => value !== undefined);
  const envPrefix = envEntries.length > 0
    ? `env ${envEntries.map(([key, value]) => `${key}=${shellQuote(String(value))}`).join(" ")} `
    : "";
  return `${envPrefix}bash --noprofile --norc -lc ${shellQuote(command)}`;
}

function parseDelimitedShellOutput(
  stdoutText: string,
  startMarker: string,
  endMarker: string,
): { output: string; exitCode: number | null } | null {
  const text = stdoutText.replace(/\r\n/g, "\n");

  const endRegex = new RegExp(`(^|\\n)${escapeRegex(endMarker)}:(-?\\d+)(?=\\n|$)`);
  const endMatch = endRegex.exec(text);
  if (!endMatch) return null;

  const endLineStart = endMatch.index + endMatch[1].length;
  const startRegex = new RegExp(`(^|\\n)${escapeRegex(startMarker)}(?=\\n|$)`, "g");
  let startLineEnd = 0;
  let foundStart = false;
  while (true) {
    const startMatch = startRegex.exec(text);
    if (!startMatch) break;
    const startLineStart = startMatch.index + startMatch[1].length;
    if (startLineStart >= endLineStart) break;
    foundStart = true;
    startLineEnd = startLineStart + startMarker.length;
    if (text[startLineEnd] === "\n") startLineEnd += 1;
  }

  if (!foundStart) return null;

  const output = text.slice(startLineEnd, endLineStart);
  const parsedExitCode = Number(endMatch[2]);
  return { output, exitCode: Number.isNaN(parsedExitCode) ? null : parsedExitCode };
}

class CommandQueue {
  private tail: Promise<void> = Promise.resolve();

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = this.tail.then(task, task);
    this.tail = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }
}

export function parseSshFlag(raw: string): { remote: string; remotePath?: string } {
  const value = raw.trim();
  if (!value) {
    throw new Error("SSH target is required: expected user@host or user@host:/remote/path");
  }

  const colonIndex = value.lastIndexOf(":");
  if (colonIndex === -1) return { remote: value };

  const maybePath = value.slice(colonIndex + 1).trim();
  const looksLikePath = maybePath.startsWith("/") || maybePath === "~" || maybePath.startsWith("~/");
  const hasOnlyOneColon = value.indexOf(":") === colonIndex;
  if (!looksLikePath && !hasOnlyOneColon) return { remote: value };
  if (!looksLikePath && hasOnlyOneColon) return { remote: value };

  const remote = value.slice(0, colonIndex).trim();
  if (!remote) throw new Error("Invalid SSH target: missing host");
  if (!maybePath) throw new Error("Invalid SSH target: empty remote path");
  return { remote, remotePath: maybePath };
}

export function parseSshPort(raw: string | undefined): number {
  const value = (raw ?? "22").trim();
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid SSH port: ${value}`);
  }
  return parsed;
}

export function parseStrictHostKeyCheckingMode(raw: string | undefined): SshStrictHostKeyCheckingMode {
  const value = (raw ?? "yes").trim().toLowerCase();
  if (value === "yes" || value === "accept-new" || value === "no") {
    return value;
  }
  throw new Error(`Invalid SSH host key checking mode: ${raw}`);
}

export function resolveRemoteTarget(rawTarget: string, usernameFallback?: string | null): { sshTarget: string; remotePath?: string } {
  const parsed = parseSshFlag(rawTarget);
  if (parsed.remote.includes("@")) {
    return { sshTarget: parsed.remote, remotePath: parsed.remotePath };
  }
  const username = (usernameFallback || "").trim();
  if (!username) {
    throw new Error("SSH target is missing a username, and the keychain entry has no username fallback.");
  }
  return { sshTarget: `${username}@${parsed.remote}`, remotePath: parsed.remotePath };
}

function buildSshBaseArgs(connection: Pick<SshBootstrapConnection, "port" | "privateKeyPath" | "knownHostsPath" | "controlPath" | "strictHostKeyChecking">): string[] {
  return [
    "-p",
    String(connection.port),
    "-o",
    "BatchMode=yes",
    "-o",
    "IdentitiesOnly=yes",
    "-o",
    `ConnectTimeout=${DEFAULT_SSH_CONNECT_TIMEOUT_SECONDS}`,
    "-o",
    "ConnectionAttempts=1",
    "-o",
    `ServerAliveInterval=${DEFAULT_SSH_SERVER_ALIVE_INTERVAL_SECONDS}`,
    "-o",
    `ServerAliveCountMax=${DEFAULT_SSH_SERVER_ALIVE_COUNT_MAX}`,
    "-o",
    "ControlMaster=auto",
    "-o",
    "ControlPersist=600",
    "-o",
    `ControlPath=${connection.controlPath}`,
    "-o",
    `StrictHostKeyChecking=${connection.strictHostKeyChecking}`,
    ...(connection.knownHostsPath ? ["-o", `UserKnownHostsFile=${connection.knownHostsPath}`] : []),
    "-i",
    connection.privateKeyPath,
  ];
}

function buildResolveRemotePathCommand(remotePath: string): string {
  if (remotePath === "~") return 'cd -- "$HOME" && pwd';
  if (remotePath.startsWith("~/")) return `cd -- "$HOME"/${shellQuote(remotePath.slice(2))} && pwd`;
  return `cd -- ${shellQuote(remotePath)} && pwd`;
}

async function sshCapture(
  connection: SshBootstrapConnection,
  remoteCommand: string,
  options: SshCaptureOptions = {},
): Promise<{ stdout: Buffer; stderr: Buffer; exitCode: number | null; timedOut: boolean }> {
  return await new Promise((resolve, reject) => {
    const child = spawn("ssh", [...buildSshBaseArgs(connection), connection.sshTarget, remoteCommand], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let timedOut = false;
    let hardStopHandle: NodeJS.Timeout | undefined;

    const stopChild = (reason: "timeout" | "abort") => {
      if (reason === "timeout") timedOut = true;
      if (!child.killed) child.kill("SIGTERM");
      if (!hardStopHandle) {
        hardStopHandle = setTimeout(() => {
          if (!child.killed) child.kill("SIGKILL");
        }, SSH_CAPTURE_KILL_GRACE_MS);
      }
    };

    const timeoutHandle =
      options.timeoutSeconds && options.timeoutSeconds > 0
        ? setTimeout(() => stopChild("timeout"), options.timeoutSeconds * 1000)
        : undefined;

    const onAbort = () => stopChild("abort");
    if (options.signal) {
      if (options.signal.aborted) stopChild("abort");
      else options.signal.addEventListener("abort", onAbort, { once: true });
    }

    child.on("error", (error) => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (hardStopHandle) clearTimeout(hardStopHandle);
      if (options.signal) options.signal.removeEventListener("abort", onAbort);
      reject(error);
    });

    child.stdout.on("data", (chunk) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk) => stderrChunks.push(chunk));

    child.on("close", (exitCode) => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (hardStopHandle) clearTimeout(hardStopHandle);
      if (options.signal) options.signal.removeEventListener("abort", onAbort);
      resolve({
        stdout: Buffer.concat(stdoutChunks),
        stderr: Buffer.concat(stderrChunks),
        exitCode,
        timedOut,
      });
    });

    if (options.stdin !== undefined) child.stdin.write(options.stdin);
    child.stdin.end();
  });
}

async function sshExec(connection: SshBootstrapConnection, remoteCommand: string, options: SshCaptureOptions = {}): Promise<Buffer> {
  const result = await sshCapture(connection, remoteCommand, options);
  if (result.timedOut) throw new Error(`SSH command timed out after ${options.timeoutSeconds ?? 0}s`);
  if (result.exitCode !== 0) {
    const stderr = result.stderr.toString("utf-8").trim();
    throw new Error(stderr || `SSH command failed with exit code ${result.exitCode}`);
  }
  return result.stdout;
}

export class PersistentRemoteShell {
  private child: ChildProcessWithoutNullStreams | null = null;
  private running: RunningCommand | null = null;
  private disposed = false;
  private streamedBytes = 0;
  private seenStartMarker = false;
  private startMarkerEnd = 0;

  constructor(private readonly connection: SshConnection) {}

  async dispose(): Promise<void> {
    this.disposed = true;
    if (this.running) {
      this.running.reject(new Error("Remote shell disposed"));
      this.running = null;
    }
    if (this.child && !this.child.killed) this.child.kill();
    this.child = null;
  }

  exec(command: string, cwd: string, options: { onData: (data: Buffer) => void; signal?: AbortSignal; timeout?: number; env?: NodeJS.ProcessEnv }): Promise<{ exitCode: number | null }> {
    return this.execOne(command, cwd, options);
  }

  private async ensureStarted(): Promise<void> {
    if (this.disposed) throw new Error("Remote shell is disposed");
    if (this.child && !this.child.killed) return;

    const child = persistentSshSpawn([...buildSshBaseArgs(this.connection), "-tt", this.connection.sshTarget], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    child.on("error", (error) => {
      if (this.running) {
        const running = this.running;
        this.cleanupRunning();
        if (running.timedOut) {
          running.reject(new Error(`timeout:${running.timeout}`));
        } else if (running.aborted) {
          running.reject(new Error("aborted"));
        } else {
          running.reject(error instanceof Error ? error : new Error(String(error)));
        }
      }
    });

    child.on("close", () => {
      if (this.running) {
        const running = this.running;
        this.cleanupRunning();
        if (running.timedOut) {
          running.reject(new Error(`timeout:${running.timeout}`));
        } else if (running.aborted) {
          running.reject(new Error("aborted"));
        } else {
          running.reject(new Error("SSH shell closed unexpectedly"));
        }
      }
      this.child = null;
    });

    child.stdout.on("data", (chunk: Buffer) => this.handleStdout(chunk));
    child.stderr.on("data", (chunk: Buffer) => this.handleStderr(chunk));
    this.child = child;
    this.child.stdin.write(
      "stty -echo 2>/dev/null || true; unset PROMPT_COMMAND 2>/dev/null || true; PS1=''; PS2=''; PROMPT=''; RPROMPT=''; " +
        "unset HISTFILE 2>/dev/null || true; export HISTFILE=/dev/null; set +o history 2>/dev/null || true; " +
        "export PAGER=cat; export GIT_PAGER=cat; export GIT_TERMINAL_PROMPT=0; " +
        "if [ -n \"${ZSH_VERSION-}\" ]; then precmd_functions=(); preexec_functions=(); chpwd_functions=(); unset zle_bracketed_paste 2>/dev/null || true; fi; " +
        "if [ -n \"${BASH_VERSION-}\" ]; then bind 'set enable-bracketed-paste off' 2>/dev/null || true; fi\n",
    );
    this.child.stdin.write(`cd -- ${shellQuote(this.connection.remoteCwd)}\n`);
  }

  private handleStdout(chunk: Buffer): void {
    const running = this.running;
    if (!running) return;
    running.stdoutChunks.push(chunk);
    this.tryCompleteRunning();
  }

  private handleStderr(chunk: Buffer): void {
    const running = this.running;
    if (!running) return;
    running.stderrChunks.push(chunk);
  }

  private normalize(text: string): string {
    return text.replace(/\r\n/g, "\n");
  }

  private streamIncremental(): void {
    const running = this.running;
    if (!running) return;

    const rawText = Buffer.concat(running.stdoutChunks).toString("utf-8");
    const text = this.normalize(rawText);

    if (!this.seenStartMarker) {
      const startRegex = new RegExp(`(^|\\n)${escapeRegex(running.startMarker)}\\n`);
      const startMatch = startRegex.exec(text);
      if (!startMatch) return;
      this.seenStartMarker = true;
      this.startMarkerEnd = startMatch.index + startMatch[0].length;
      this.streamedBytes = 0;
    }

    const outputSoFar = text.slice(this.startMarkerEnd);
    const endMarkerPrefix = "__PICLAW_SSH_DONE_";
    let safeLen = outputSoFar.length;
    const lastNl = outputSoFar.lastIndexOf("\n");
    if (lastNl >= 0) {
      const tailLine = outputSoFar.slice(lastNl + 1);
      if (tailLine.length === 0 || tailLine.includes(endMarkerPrefix) || endMarkerPrefix.startsWith(tailLine.trimEnd())) {
        safeLen = lastNl + 1;
      }
      if (safeLen === lastNl + 1) {
        const prevNl = outputSoFar.lastIndexOf("\n", lastNl - 1);
        const lastCompleteLine = outputSoFar.slice(prevNl + 1, lastNl);
        if (lastCompleteLine.includes(endMarkerPrefix)) {
          safeLen = Math.max(0, prevNl + 1);
        }
      }
    } else if (outputSoFar.includes(endMarkerPrefix) || endMarkerPrefix.startsWith(outputSoFar.trimEnd())) {
      safeLen = 0;
    }

    if (safeLen > this.streamedBytes) {
      const newData = outputSoFar.slice(this.streamedBytes, safeLen);
      if (newData.length > 0) {
        running.onData(Buffer.from(newData, "utf-8"));
        this.streamedBytes = safeLen;
      }
    }
  }

  private tryCompleteRunning(): void {
    const running = this.running;
    if (!running) return;

    const rawText = Buffer.concat(running.stdoutChunks).toString("utf-8");
    const parsed = parseDelimitedShellOutput(rawText, running.startMarker, running.endMarker);
    if (!parsed) return;

    if (this.streamedBytes < parsed.output.length) {
      const remaining = parsed.output.slice(this.streamedBytes);
      running.onData(Buffer.from(remaining, "utf-8"));
    }

    const stderrText = Buffer.concat(running.stderrChunks).toString("utf-8");
    if (stderrText.length > 0) {
      running.onData(Buffer.from(stderrText, "utf-8"));
    }

    const exitCode = parsed.exitCode;
    const timedOut = running.timedOut;
    const aborted = running.aborted;
    const timeout = running.timeout;
    this.cleanupRunning();

    if (timedOut) {
      running.reject(new Error(`timeout:${timeout}`));
      return;
    }
    if (aborted) {
      running.reject(new Error("aborted"));
      return;
    }

    running.resolve({ exitCode });
  }

  private cleanupRunning(): void {
    if (!this.running) return;
    if (this.running.timeoutHandle) clearTimeout(this.running.timeoutHandle);
    if (this.running.hardStopHandle) clearTimeout(this.running.hardStopHandle);
    if (this.running.signal && this.running.abortHandler) {
      this.running.signal.removeEventListener("abort", this.running.abortHandler);
    }
    this.running = null;
  }

  private interruptCurrentCommand(): void {
    if (!this.child || this.child.killed) return;
    try {
      this.child.stdin.write("\x03");
    } catch {
      // ignore broken stdin while the hard-stop fallback tears down the shell
    }
  }

  private scheduleHardStop(): void {
    const running = this.running;
    if (!running || running.hardStopHandle || persistentInterruptGraceMs <= 0) return;
    running.hardStopHandle = setTimeout(() => {
      if (this.running !== running) return;
      if (this.child && !this.child.killed) this.child.kill();
    }, persistentInterruptGraceMs);
  }

  private async execOne(
    command: string,
    cwd: string,
    options: { onData: (data: Buffer) => void; signal?: AbortSignal; timeout?: number; env?: NodeJS.ProcessEnv },
  ): Promise<{ exitCode: number | null }> {
    await this.ensureStarted();
    if (!this.child || this.child.killed) throw new Error("Failed to start persistent SSH shell");

    const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const startMarker = `__PICLAW_SSH_BEGIN_${unique}__`;
    const endMarker = `__PICLAW_SSH_DONE_${unique}__`;
    const remoteCwd = mapLocalPathToRemote(cwd, this.connection);
    const needsEncoding = command.includes("\n");
    const innerCommand = needsEncoding
      ? `eval \"$(printf '%s' '${Buffer.from(command).toString("base64")}' | base64 -d)\"`
      : command;
    const execPart = buildScopedBashCommand(innerCommand, options.env);

    const wrappedCommand = [
      `printf '${startMarker}\\n'`,
      `if cd -- ${shellQuote(remoteCwd)}; then ${execPart} </dev/null; __piclaw_ssh_ec=$?; else __piclaw_ssh_ec=$?; fi`,
      `printf '\\n${endMarker}:%s\\n' \"$__piclaw_ssh_ec\"`,
    ].join("; ");

    this.streamedBytes = 0;
    this.seenStartMarker = false;
    this.startMarkerEnd = 0;
    const effectiveTimeout = options.timeout ?? DEFAULT_EXEC_TIMEOUT_SECONDS;

    return await new Promise((resolve, reject) => {
      const running: RunningCommand = {
        startMarker,
        endMarker,
        timeout: effectiveTimeout,
        onData: options.onData,
        signal: options.signal,
        aborted: false,
        timedOut: false,
        stdoutChunks: [],
        stderrChunks: [],
        resolve,
        reject,
      };

      this.running = running;

      if (effectiveTimeout > 0) {
        running.timeoutHandle = setTimeout(() => {
          running.timedOut = true;
          this.interruptCurrentCommand();
          this.scheduleHardStop();
        }, effectiveTimeout * 1000);
      }

      if (options.signal) {
        running.abortHandler = () => {
          running.aborted = true;
          this.interruptCurrentCommand();
          this.scheduleHardStop();
        };
        if (options.signal.aborted) running.abortHandler();
        else options.signal.addEventListener("abort", running.abortHandler, { once: true });
      }

      if (!running.aborted) this.child?.stdin.write(`${wrappedCommand}\n`);
    });
  }
}

interface RemoteTransport {
  dispose(): Promise<void>;
  exec(
    command: string,
    cwd: string,
    options: { onData: (data: Buffer) => void; signal?: AbortSignal; timeout?: number; env?: NodeJS.ProcessEnv },
  ): Promise<{ exitCode: number | null }>;
  readFile(remotePath: string): Promise<Buffer>;
  ensureReadable(remotePath: string): Promise<void>;
  ensureReadableWritable(remotePath: string): Promise<void>;
  detectImageMimeType(remotePath: string): Promise<string | null>;
  mkdir(remoteDir: string): Promise<void>;
  writeFile(remotePath: string, content: Buffer): Promise<void>;
}

function mapLocalPathToRemote(path: string, conn: SshConnection): string {
  if (path === conn.localCwd) return conn.remoteCwd;
  if (path.startsWith(`${conn.localCwd}/`)) return `${conn.remoteCwd}${path.slice(conn.localCwd.length)}`;
  if (path === conn.localHome) return conn.remoteHome;
  if (path.startsWith(`${conn.localHome}/`)) return `${conn.remoteHome}${path.slice(conn.localHome.length)}`;
  return path;
}

function remoteDirname(path: string): string {
  const slashIndex = path.lastIndexOf("/");
  if (slashIndex <= 0) return "/";
  return path.slice(0, slashIndex);
}

class SshTransport implements RemoteTransport {
  private shell: PersistentRemoteShell;
  private queue = new CommandQueue();

  constructor(private readonly connection: SshConnection) {
    this.shell = new PersistentRemoteShell(connection);
  }

  async dispose(): Promise<void> {
    await this.shell.dispose();
    rmSync(this.connection.tempDir, { recursive: true, force: true });
  }

  exec(
    command: string,
    cwd: string,
    options: { onData: (data: Buffer) => void; signal?: AbortSignal; timeout?: number; env?: NodeJS.ProcessEnv },
  ): Promise<{ exitCode: number | null }> {
    return this.queue.enqueue(() => this.shell.exec(command, cwd, options));
  }

  async readFile(remotePath: string): Promise<Buffer> {
    return await this.queue.enqueue(() =>
      sshExec(this.connection, `cat -- ${shellQuote(remotePath)}`, {
        timeoutSeconds: DEFAULT_EXEC_TIMEOUT_SECONDS,
      }),
    );
  }

  async ensureReadable(remotePath: string): Promise<void> {
    await this.runChecked(`test -r ${shellQuote(remotePath)}`);
  }

  async ensureReadableWritable(remotePath: string): Promise<void> {
    await this.runChecked(`test -r ${shellQuote(remotePath)} && test -w ${shellQuote(remotePath)}`);
  }

  async detectImageMimeType(remotePath: string): Promise<string | null> {
    const result = await this.capture(`file --mime-type -b -- ${shellQuote(remotePath)} 2>/dev/null || true`);
    const mime = result.output.toString("utf-8").trim();
    return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mime) ? mime : null;
  }

  async mkdir(remoteDir: string): Promise<void> {
    await this.runChecked(`mkdir -p -- ${shellQuote(remoteDir)}`);
  }

  async writeFile(remotePath: string, content: Buffer): Promise<void> {
    if (content.length <= PERSISTENT_WRITE_MAX_BYTES) {
      const remoteDir = remoteDirname(remotePath);
      const encodedContent = content.toString("base64");
      const command = [
        `mkdir -p -- ${shellQuote(remoteDir)}`,
        `printf '%s' ${shellQuote(encodedContent)} | base64 -d > ${shellQuote(remotePath)}`,
      ].join(" && ");
      try {
        await this.runChecked(command);
        return;
      } catch {
        // fall through to streaming fallback
      }
    }

    await this.queue.enqueue(async () => {
      const remoteDir = remoteDirname(remotePath);
      const command = [`mkdir -p -- ${shellQuote(remoteDir)}`, `cat > ${shellQuote(remotePath)}`].join(" && ");
      await sshExec(this.connection, command, { stdin: content, timeoutSeconds: DEFAULT_EXEC_TIMEOUT_SECONDS });
    });
  }

  private async capture(
    command: string,
    options: { timeout?: number; signal?: AbortSignal } = {},
  ): Promise<{ exitCode: number | null; output: Buffer }> {
    return await this.queue.enqueue(async () => {
      const outputChunks: Buffer[] = [];
      const result = await this.shell.exec(command, this.connection.localCwd, {
        timeout: options.timeout,
        signal: options.signal,
        onData: (data) => outputChunks.push(data),
      });
      return { exitCode: result.exitCode, output: Buffer.concat(outputChunks) };
    });
  }

  private async runChecked(command: string, timeout?: number): Promise<Buffer> {
    const result = await this.capture(command, { timeout });
    if (result.exitCode !== 0) {
      const stderr = result.output.toString("utf-8").trim();
      throw new Error(stderr || `SSH command failed with exit code ${result.exitCode}`);
    }
    return result.output;
  }
}

function createRemoteReadOps(conn: SshConnection, transport: RemoteTransport): ReadOperations {
  return {
    readFile: async (absolutePath) => transport.readFile(mapLocalPathToRemote(absolutePath, conn)),
    access: async (absolutePath) => transport.ensureReadable(mapLocalPathToRemote(absolutePath, conn)),
    detectImageMimeType: async (absolutePath) => {
      try {
        return await transport.detectImageMimeType(mapLocalPathToRemote(absolutePath, conn));
      } catch {
        return null;
      }
    },
  };
}

function createRemoteWriteOps(conn: SshConnection, transport: RemoteTransport): WriteOperations {
  return {
    mkdir: async (absoluteDir) => transport.mkdir(mapLocalPathToRemote(absoluteDir, conn)),
    writeFile: async (absolutePath, content) => {
      await transport.writeFile(mapLocalPathToRemote(absolutePath, conn), Buffer.from(content, "utf-8"));
    },
  };
}

function createRemoteEditOps(conn: SshConnection, transport: RemoteTransport): EditOperations {
  const readOps = createRemoteReadOps(conn, transport);
  const writeOps = createRemoteWriteOps(conn, transport);
  return {
    readFile: readOps.readFile,
    writeFile: writeOps.writeFile,
    access: async (absolutePath) => transport.ensureReadableWritable(mapLocalPathToRemote(absolutePath, conn)),
  };
}

function createRemoteBashOps(transport: RemoteTransport): BashOperations {
  return {
    exec: async (command, cwd, { onData, signal, timeout, env }) => {
      const resolvedCommand = await resolveKeychainPlaceholders(command);
      const resolvedEnv = await buildInjectedShellEnv({
        explicitEnv: env,
        includeProcessEnv: false,
        referencedTexts: [command],
      });
      return transport.exec(resolvedCommand, cwd, { onData, signal, timeout, env: resolvedEnv });
    },
  };
}

function writeSecretFile(path: string, content: string): void {
  const normalized = content.endsWith("\n") ? content : `${content}\n`;
  writeFileSync(path, normalized, { mode: 0o600 });
  try { chmodSync(path, 0o600); } catch { /* ignore chmod errors */ }
}

async function resolveConfiguredConnection(
  rawTarget: string,
  localCwd: string,
  localHome: string,
  port: number,
  privateKeyKeychain: string,
  knownHostsKeychain: string | undefined,
  strictHostKeyChecking: SshStrictHostKeyCheckingMode,
): Promise<SshConnection> {
  const privateKeyEntry = await getKeychainEntry(privateKeyKeychain);
  const { sshTarget, remotePath } = resolveRemoteTarget(rawTarget, privateKeyEntry.username);
  const tempDir = mkdtempSync(join(tmpdir(), "piclaw-ssh-core-"));
  const privateKeyPath = join(tempDir, "id.key");
  const controlPath = join(tempDir, "control.sock");
  writeSecretFile(privateKeyPath, privateKeyEntry.secret);

  let knownHostsPath: string | undefined;
  if (knownHostsKeychain) {
    const knownHostsEntry = await getKeychainEntry(knownHostsKeychain);
    knownHostsPath = join(tempDir, "known_hosts");
    writeSecretFile(knownHostsPath, knownHostsEntry.secret);
  } else if (strictHostKeyChecking === "yes") {
    rmSync(tempDir, { recursive: true, force: true });
    throw new Error("Strict SSH host key checking is enabled, but no known_hosts keychain entry was configured.");
  }

  const bootstrap: SshBootstrapConnection = {
    sshTarget,
    port,
    remotePath,
    privateKeyPath,
    knownHostsPath,
    controlPath,
    strictHostKeyChecking,
    localCwd,
    localHome,
    tempDir,
  };

  try {
    const remoteHome = (await sshExec(bootstrap, 'printf "%s" "$HOME"', { timeoutSeconds: 15 })).toString("utf-8").trim();
    if (!remoteHome) throw new Error("Failed to detect remote HOME");

    const remoteCwd = remotePath
      ? (await sshExec(bootstrap, buildResolveRemotePathCommand(remotePath), { timeoutSeconds: 15 })).toString("utf-8").trim()
      : (await sshExec(bootstrap, "pwd", { timeoutSeconds: 15 })).toString("utf-8").trim();

    return { ...bootstrap, remoteHome, remoteCwd };
  } catch (error) {
    rmSync(tempDir, { recursive: true, force: true });
    throw error;
  }
}

export interface SshCoreResolvedConfig {
  target: string;
  port: number;
  privateKeyKeychain: string;
  knownHostsKeychain?: string;
  strictHostKeyChecking: SshStrictHostKeyCheckingMode;
}

function getConfigValue(pi: ExtensionAPI, flag: string, envName: string): string | undefined {
  const flagValue = pi.getFlag(flag) as string | undefined;
  if (typeof flagValue === "string" && flagValue.trim()) return flagValue.trim();
  const envValue = process.env[envName];
  return typeof envValue === "string" && envValue.trim() ? envValue.trim() : undefined;
}

function resolveConfigFromEnvOrFlags(pi: ExtensionAPI): SshCoreResolvedConfig | null {
  const rawTarget = getConfigValue(pi, "ssh", "PICLAW_SSH_TARGET");
  if (!rawTarget) return null;
  const rawPort = getConfigValue(pi, "p", "PICLAW_SSH_PORT") ?? getConfigValue(pi, "ssh-port", "PICLAW_SSH_PORT");
  const privateKeyKeychain = getConfigValue(pi, "ssh-keychain", "PICLAW_SSH_PRIVATE_KEY_KEYCHAIN");
  if (!privateKeyKeychain) {
    throw new Error("SSH core requires a private key keychain entry (PICLAW_SSH_PRIVATE_KEY_KEYCHAIN or --ssh-keychain).");
  }
  const knownHostsKeychain = getConfigValue(pi, "ssh-known-hosts-keychain", "PICLAW_SSH_KNOWN_HOSTS_KEYCHAIN");
  return {
    target: rawTarget,
    port: parseSshPort(rawPort),
    privateKeyKeychain,
    ...(knownHostsKeychain ? { knownHostsKeychain } : {}),
    strictHostKeyChecking: parseStrictHostKeyCheckingMode(
      getConfigValue(pi, "ssh-strict-host-key-checking", "PICLAW_SSH_STRICT_HOST_KEY_CHECKING"),
    ),
  };
}

export function resolveSshCoreConfigFromChatConfig(config: Pick<SshConfig, "ssh_target" | "ssh_port" | "private_key_keychain" | "known_hosts_keychain" | "strict_host_key_checking">): SshCoreResolvedConfig {
  return {
    target: config.ssh_target,
    port: parseSshPort(String(config.ssh_port)),
    privateKeyKeychain: config.private_key_keychain,
    ...(config.known_hosts_keychain ? { knownHostsKeychain: config.known_hosts_keychain } : {}),
    strictHostKeyChecking: parseStrictHostKeyCheckingMode(config.strict_host_key_checking),
  };
}

interface LiveChatSshState {
  chatJid: string;
  localCwd: string;
  localHome: string;
  refCount: number;
  connection: SshConnection | null;
  transport: SshTransport | null;
  config: SshCoreResolvedConfig | null;
  mutations: CommandQueue;
}

const liveChatSshStates = new Map<string, LiveChatSshState>();
let resolveConfiguredConnectionImpl = resolveConfiguredConnection;

function sameResolvedConfig(a: SshCoreResolvedConfig | null, b: SshCoreResolvedConfig | null): boolean {
  if (!a || !b) return false;
  return a.target === b.target
    && a.port === b.port
    && a.privateKeyKeychain === b.privateKeyKeychain
    && (a.knownHostsKeychain ?? "") === (b.knownHostsKeychain ?? "")
    && a.strictHostKeyChecking === b.strictHostKeyChecking;
}

function getOrCreateLiveChatSshState(chatJid: string, localCwd: string, localHome: string): LiveChatSshState {
  const existing = liveChatSshStates.get(chatJid);
  if (existing) {
    existing.localCwd = localCwd;
    existing.localHome = localHome;
    return existing;
  }
  const state: LiveChatSshState = {
    chatJid,
    localCwd,
    localHome,
    refCount: 0,
    connection: null,
    transport: null,
    config: null,
    mutations: new CommandQueue(),
  };
  liveChatSshStates.set(chatJid, state);
  return state;
}

function getLiveChatSshState(chatJid: string): LiveChatSshState | null {
  return liveChatSshStates.get(chatJid) ?? null;
}

async function disposeLiveChatSshTransport(state: LiveChatSshState): Promise<void> {
  const transport = state.transport;
  state.transport = null;
  state.connection = null;
  if (transport) await transport.dispose();
}

export function hasLiveChatSshSession(chatJid: string): boolean {
  return (liveChatSshStates.get(chatJid)?.refCount ?? 0) > 0;
}

export function hasLiveChatSshConnection(chatJid: string): boolean {
  const state = liveChatSshStates.get(chatJid);
  return Boolean(state?.connection && state.transport);
}

export async function applyLiveSshConfig(
  chatJid: string,
  config: SshCoreResolvedConfig,
  options: { localCwd?: string; localHome?: string } = {},
): Promise<SshConnection> {
  const state = getOrCreateLiveChatSshState(chatJid, options.localCwd ?? process.cwd(), options.localHome ?? homedir());
  return await state.mutations.enqueue(async () => {
    if (state.connection && state.transport && sameResolvedConfig(state.config, config)) {
      return state.connection;
    }

    const nextConnection = await resolveConfiguredConnectionImpl(
      config.target,
      state.localCwd,
      state.localHome,
      config.port,
      config.privateKeyKeychain,
      config.knownHostsKeychain,
      config.strictHostKeyChecking,
    );
    const nextTransport = new SshTransport(nextConnection);
    const previousTransport = state.transport;

    state.connection = nextConnection;
    state.transport = nextTransport;
    state.config = { ...config };

    if (previousTransport) await previousTransport.dispose();
    return nextConnection;
  });
}

export async function clearLiveSshConfig(chatJid: string): Promise<void> {
  const state = getLiveChatSshState(chatJid);
  if (!state) return;
  await state.mutations.enqueue(async () => {
    state.config = null;
    await disposeLiveChatSshTransport(state);
    if (state.refCount === 0) liveChatSshStates.delete(chatJid);
  });
}

export async function registerLiveChatSshSession(
  chatJid: string,
  options: { localCwd?: string; localHome?: string; config?: SshCoreResolvedConfig | null } = {},
): Promise<void> {
  const state = getOrCreateLiveChatSshState(chatJid, options.localCwd ?? process.cwd(), options.localHome ?? homedir());
  state.refCount += 1;
  if (options.config) await applyLiveSshConfig(chatJid, options.config, options);
}

export async function unregisterLiveChatSshSession(chatJid: string): Promise<void> {
  const state = getLiveChatSshState(chatJid);
  if (!state) return;
  state.refCount = Math.max(0, state.refCount - 1);
  if (state.refCount > 0) return;
  await state.mutations.enqueue(async () => {
    await disposeLiveChatSshTransport(state);
    if (state.refCount === 0) liveChatSshStates.delete(chatJid);
  });
}

export function setSshConnectionResolverForTests(
  resolver: typeof resolveConfiguredConnection | null,
): void {
  resolveConfiguredConnectionImpl = resolver ?? resolveConfiguredConnection;
}

type SshLifecycleUi = {
  setWorkingIndicator: (options?: { frames?: string[]; intervalMs?: number }) => void;
  setWorkingMessage: (message?: string) => void;
  setStatus: (key: string, value: string | undefined) => void;
  notify: (message: string, level?: "error" | "info" | "warning") => void;
  theme: { fg: (color: any, text: string) => string };
};

function startSshUiProgress(
  ctx: { hasUI?: boolean; ui?: SshLifecycleUi },
  message: string,
): void {
  if (!ctx?.hasUI || !ctx.ui) return;
  ctx.ui.setWorkingIndicator({ frames: SSH_WORKING_FRAMES, intervalMs: 90 });
  ctx.ui.setWorkingMessage(message);
}

function finishSshUiProgress(
  ctx: { hasUI?: boolean; ui?: SshLifecycleUi },
): void {
  if (!ctx?.hasUI || !ctx.ui) return;
  ctx.ui.setWorkingMessage(undefined);
  ctx.ui.setWorkingIndicator({ frames: [] });
}

function formatSshEnabledMessage(connection: Pick<SshConnection, "sshTarget" | "remoteCwd" | "port">): string {
  return `ssh-core enabled: ${connection.sshTarget}:${connection.remoteCwd} (port ${connection.port})`;
}

function formatSshShutdownMessage(event?: { reason?: string; targetSessionFile?: string }): string {
  return `[ssh-core] session shutdown (${event?.reason ?? "unknown"})${event?.targetSessionFile ? ` → ${event.targetSessionFile}` : ""}`;
}

function rewriteSystemPromptForSshContext(
  systemPrompt: string,
  localCwd: string,
  connection: Pick<SshConnection, "remoteCwd" | "sshTarget" | "port">,
  promptOptions?: { cwd?: string } | null,
): string | null {
  const remotePrefix = `Current working directory: ${connection.remoteCwd} (via SSH ${connection.sshTarget}, port ${connection.port})`;
  const candidateLocalCwds = [...new Set([
    typeof promptOptions?.cwd === "string" && promptOptions.cwd.trim() ? promptOptions.cwd.trim() : null,
    localCwd,
  ].filter((value): value is string => Boolean(value)))];

  for (const cwd of candidateLocalCwds) {
    const localPrefix = `Current working directory: ${cwd}`;
    if (!systemPrompt.includes(localPrefix)) continue;
    return systemPrompt.replace(localPrefix, remotePrefix);
  }

  return null;
}

function registerSshCoreExtension(pi: ExtensionAPI, resolveConfig: (pi: ExtensionAPI) => SshCoreResolvedConfig | null): void {
  pi.registerFlag("ssh", {
    description: "SSH target as user@host or user@host:/absolute/remote/path",
    type: "string",
  });
  pi.registerFlag("ssh-port", {
    description: "SSH port (default: 22)",
    type: "string",
    default: "22",
  });
  pi.registerFlag("p", {
    description: "Alias for --ssh-port",
    type: "string",
  });
  pi.registerFlag("ssh-keychain", {
    description: "Keychain entry containing the SSH private key (and optional username fallback)",
    type: "string",
  });
  pi.registerFlag("ssh-known-hosts-keychain", {
    description: "Keychain entry containing known_hosts content for strict host verification",
    type: "string",
  });
  pi.registerFlag("ssh-strict-host-key-checking", {
    description: "SSH StrictHostKeyChecking mode: yes, accept-new, or no",
    type: "string",
    default: "yes",
  });

  const localCwd = process.cwd();
  const localHome = homedir();
  const localRead = createReadTool(localCwd);
  const localWrite = createWriteTool(localCwd);
  const localEdit = createEditTool(localCwd);
  const localBash = createBashTool(localCwd);

  let connection: SshConnection | null = null;
  let transport: SshTransport | null = null;

  pi.registerTool({
    ...localRead,
    async execute(id, params, signal, onUpdate) {
      if (!connection || !transport) return localRead.execute(id, params, signal, onUpdate);
      const tool = createReadTool(localCwd, { operations: createRemoteReadOps(connection, transport) });
      return tool.execute(id, params, signal, onUpdate);
    },
  });

  pi.registerTool({
    ...localWrite,
    async execute(id, params, signal, onUpdate) {
      if (!connection || !transport) return localWrite.execute(id, params, signal, onUpdate);
      const tool = createWriteTool(localCwd, { operations: createRemoteWriteOps(connection, transport) });
      return tool.execute(id, params, signal, onUpdate);
    },
  });

  pi.registerTool({
    ...localEdit,
    async execute(id, params, signal, onUpdate) {
      if (!connection || !transport) return localEdit.execute(id, params, signal, onUpdate);
      const tool = createEditTool(localCwd, { operations: createRemoteEditOps(connection, transport) });
      return tool.execute(id, params, signal, onUpdate);
    },
  });

  pi.registerTool({
    ...localBash,
    async execute(id, params, signal, onUpdate) {
      if (!transport) return localBash.execute(id, params, signal, onUpdate);
      const tool = createBashTool(localCwd, { operations: createRemoteBashOps(transport) });
      return tool.execute(id, params, signal, onUpdate);
    },
  });

  pi.on("session_start", async (_event, ctx) => {
    const resolvedConfig = resolveConfig(pi);
    if (!resolvedConfig) return;

    startSshUiProgress(ctx, `SSH: connecting to ${resolvedConfig.target}…`);
    try {
      connection = await resolveConfiguredConnectionImpl(
        resolvedConfig.target,
        localCwd,
        localHome,
        resolvedConfig.port,
        resolvedConfig.privateKeyKeychain,
        resolvedConfig.knownHostsKeychain,
        resolvedConfig.strictHostKeyChecking,
      );
      transport = new SshTransport(connection);
      const enabledMessage = formatSshEnabledMessage(connection);
      console.log(enabledMessage);
      if (ctx.hasUI) {
        ctx.ui.setStatus(
          "ssh-core",
          ctx.ui.theme.fg("accent", `SSH ${connection.sshTarget}:${connection.remoteCwd} (port ${connection.port})`),
        );
        ctx.ui.notify(enabledMessage, "info");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      connection = null;
      if (transport) {
        await transport.dispose();
        transport = null;
      }
      console.error(`ssh-core failed to connect: ${message}`);
      if (ctx.hasUI) {
        ctx.ui.setStatus("ssh-core", undefined);
        ctx.ui.notify(`ssh-core failed to connect: ${message}`, "error");
      }
      throw error;
    } finally {
      finishSshUiProgress(ctx);
    }
  });

  pi.on("session_shutdown", async (event) => {
    console.log(formatSshShutdownMessage(event));
    if (transport) {
      await transport.dispose();
      transport = null;
    }
    connection = null;
  });

  pi.on("user_bash", () => {
    if (!transport) return;
    return { operations: createRemoteBashOps(transport) };
  });

  pi.on("before_agent_start", async (event) => {
    if (!connection) return;
    const rewritten = rewriteSystemPromptForSshContext(
      event.systemPrompt,
      localCwd,
      connection,
      event.systemPromptOptions,
    );
    if (!rewritten) return;
    return { systemPrompt: rewritten };
  });
}

export function createSshCoreExtension(config: SshCoreResolvedConfig): ExtensionFactory {
  return (pi) => registerSshCoreExtension(pi, () => config);
}

export function createChatSshCoreExtension(
  chatJid: string,
  initialConfig?: SshCoreResolvedConfig | null,
): ExtensionFactory {
  return (pi) => {
    pi.registerFlag("ssh", {
      description: "SSH target as user@host or user@host:/absolute/remote/path",
      type: "string",
    });
    pi.registerFlag("ssh-port", {
      description: "SSH port (default: 22)",
      type: "string",
      default: "22",
    });
    pi.registerFlag("p", {
      description: "Alias for --ssh-port",
      type: "string",
    });
    pi.registerFlag("ssh-keychain", {
      description: "Keychain entry containing the SSH private key (and optional username fallback)",
      type: "string",
    });
    pi.registerFlag("ssh-known-hosts-keychain", {
      description: "Keychain entry containing known_hosts content for strict host verification",
      type: "string",
    });
    pi.registerFlag("ssh-strict-host-key-checking", {
      description: "SSH StrictHostKeyChecking mode: yes, accept-new, or no",
      type: "string",
      default: "yes",
    });

    const localCwd = process.cwd();
    const localHome = homedir();
    const localRead = createReadTool(localCwd);
    const localWrite = createWriteTool(localCwd);
    const localEdit = createEditTool(localCwd);
    const localBash = createBashTool(localCwd);

    pi.registerTool({
      ...localRead,
      async execute(id, params, signal, onUpdate) {
        const state = getLiveChatSshState(chatJid);
        if (!state?.connection || !state.transport) return localRead.execute(id, params, signal, onUpdate);
        const tool = createReadTool(localCwd, { operations: createRemoteReadOps(state.connection, state.transport) });
        return tool.execute(id, params, signal, onUpdate);
      },
    });

    pi.registerTool({
      ...localWrite,
      async execute(id, params, signal, onUpdate) {
        const state = getLiveChatSshState(chatJid);
        if (!state?.connection || !state.transport) return localWrite.execute(id, params, signal, onUpdate);
        const tool = createWriteTool(localCwd, { operations: createRemoteWriteOps(state.connection, state.transport) });
        return tool.execute(id, params, signal, onUpdate);
      },
    });

    pi.registerTool({
      ...localEdit,
      async execute(id, params, signal, onUpdate) {
        const state = getLiveChatSshState(chatJid);
        if (!state?.connection || !state.transport) return localEdit.execute(id, params, signal, onUpdate);
        const tool = createEditTool(localCwd, { operations: createRemoteEditOps(state.connection, state.transport) });
        return tool.execute(id, params, signal, onUpdate);
      },
    });

    pi.registerTool({
      ...localBash,
      async execute(id, params, signal, onUpdate) {
        const state = getLiveChatSshState(chatJid);
        if (!state?.transport) return localBash.execute(id, params, signal, onUpdate);
        const tool = createBashTool(localCwd, { operations: createRemoteBashOps(state.transport) });
        return tool.execute(id, params, signal, onUpdate);
      },
    });

    pi.on("session_start", async (_event, ctx) => {
      if (initialConfig) {
        startSshUiProgress(ctx, `SSH: connecting to ${initialConfig.target}…`);
      }
      try {
        await registerLiveChatSshSession(chatJid, { localCwd, localHome, config: initialConfig ?? null });
        const state = getLiveChatSshState(chatJid);
        if (!state?.connection) return;
        const enabledMessage = formatSshEnabledMessage(state.connection);
        console.log(enabledMessage);
        if (ctx.hasUI) {
          ctx.ui.setStatus(
            "ssh-core",
            ctx.ui.theme.fg("accent", `SSH ${state.connection.sshTarget}:${state.connection.remoteCwd} (port ${state.connection.port})`),
          );
          ctx.ui.notify(enabledMessage, "info");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await unregisterLiveChatSshSession(chatJid);
        console.error(`ssh-core failed to connect: ${message}`);
        if (ctx.hasUI) {
          ctx.ui.setStatus("ssh-core", undefined);
          ctx.ui.notify(`ssh-core failed to connect: ${message}`, "error");
        }
        throw error;
      } finally {
        if (initialConfig) finishSshUiProgress(ctx);
      }
    });

    pi.on("session_shutdown", async (event) => {
      console.log(formatSshShutdownMessage(event));
      await unregisterLiveChatSshSession(chatJid);
    });

    pi.on("user_bash", () => {
      const state = getLiveChatSshState(chatJid);
      if (!state?.transport) return;
      return { operations: createRemoteBashOps(state.transport) };
    });

    pi.on("before_agent_start", async (event) => {
      const state = getLiveChatSshState(chatJid);
      if (!state?.connection) return;
      const rewritten = rewriteSystemPromptForSshContext(
        event.systemPrompt,
        localCwd,
        state.connection,
        event.systemPromptOptions,
      );
      if (!rewritten) return;
      return { systemPrompt: rewritten };
    });
  };
}

export default function sshCoreExtension(pi: ExtensionAPI): void {
  registerSshCoreExtension(pi, resolveConfigFromEnvOrFlags);
}

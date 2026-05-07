/**
 * tools/tracked-bash.ts – Process-tracked shell execution for the agent.
 *
 * Creates a BashOperations implementation that:
 *   1. Resolves the host's preferred shell (POSIX shell on Unix, PowerShell/cmd on Windows).
 *   2. Resolves keychain placeholders in the command string and environment.
 *   3. Spawns the command in a platform-appropriate mode: detached process
 *      groups on Unix for clean tree kills, attached children on Windows so
 *      stdout/stderr stay capturable.
 *   4. Registers/unregisters the child PID with the process tracker so
 *      agent-pool.ts can force-kill lingering processes on abort/shutdown.
 *   5. Handles timeout and abort-signal cancellation.
 *
 * Consumers:
 *   - tools/context-tools.ts passes createTrackedBashOperations() into the
 *     pi-coding-agent's createBashTool() factory.
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import type { BashOperations } from "@earendil-works/pi-coding-agent";
import { buildInjectedShellEnv, resolveKeychainPlaceholders } from "../secure/keychain.js";

import { killProcessTree, registerProcess, unregisterProcess } from "../utils/process-tracker.js";
import { shouldDetachChildProcess } from "../utils/process-spawn.js";

export interface ShellConfig {
  shell: string;
  args: string[];
  family: "posix" | "powershell" | "cmd";
}

interface ResolveShellConfigOptions {
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  pathExists?: (path: string) => boolean;
}

const POWERSHELL_ARGS = ["-NoProfile", "-Command"];
const POSIX_ARGS = ["-c"];
const CMD_ARGS = ["/c"];
export const TRACKED_BASH_OUTPUT_LIMIT_BYTES = 256 * 1024;
export const TRACKED_BASH_OUTPUT_TRUNCATION_NOTICE = "\n[output truncated]\n";

function pushUniqueShell(candidates: ShellConfig[], candidate: ShellConfig): void {
  if (!candidate.shell.trim()) return;
  if (candidates.some((entry) => entry.shell.toLowerCase() === candidate.shell.toLowerCase())) return;
  candidates.push(candidate);
}

/** Determine which shell binaries and arguments to try for command execution. */
export function resolveShellCandidates(options: ResolveShellConfigOptions = {}): ShellConfig[] {
  const platform = options.platform ?? process.platform;
  const env = options.env ?? process.env;
  const pathExists = options.pathExists ?? existsSync;
  const candidates: ShellConfig[] = [];

  if (platform === "win32") {
    if (env.SHELL && pathExists(env.SHELL)) {
      pushUniqueShell(candidates, { shell: env.SHELL, args: POSIX_ARGS, family: "posix" });
    }

    const pwshPaths = [
      "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
      "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    ];
    for (const shellPath of pwshPaths) {
      if (pathExists(shellPath)) {
        pushUniqueShell(candidates, { shell: shellPath, args: POWERSHELL_ARGS, family: "powershell" });
      }
    }

    pushUniqueShell(candidates, { shell: "pwsh.exe", args: POWERSHELL_ARGS, family: "powershell" });
    pushUniqueShell(candidates, { shell: "powershell.exe", args: POWERSHELL_ARGS, family: "powershell" });

    if (env.ComSpec && env.ComSpec.trim()) {
      pushUniqueShell(candidates, { shell: env.ComSpec.trim(), args: CMD_ARGS, family: "cmd" });
    }
    pushUniqueShell(candidates, { shell: "cmd.exe", args: CMD_ARGS, family: "cmd" });
    return candidates;
  }

  if (env.SHELL && pathExists(env.SHELL)) {
    pushUniqueShell(candidates, { shell: env.SHELL, args: POSIX_ARGS, family: "posix" });
  }
  if (pathExists("/bin/bash")) {
    pushUniqueShell(candidates, { shell: "/bin/bash", args: POSIX_ARGS, family: "posix" });
  }
  pushUniqueShell(candidates, { shell: "bash", args: POSIX_ARGS, family: "posix" });
  return candidates;
}

function createTrackedShellOperations(resolveCandidates: () => ShellConfig[]): BashOperations {
  return {
    exec: (command, cwd, { onData, signal, timeout, env }) => {
      return new Promise((resolve, reject) => {
        (async () => {
          const shellCandidates = resolveCandidates();

          if (!existsSync(cwd)) {
            reject(new Error(`Working directory does not exist: ${cwd}\nCannot execute shell commands.`));
            return;
          }

          let resolvedEnv: NodeJS.ProcessEnv;
          let resolvedCommand: string;
          try {
            resolvedEnv = await buildInjectedShellEnv({
              explicitEnv: env,
              includeProcessEnv: true,
              referencedTexts: [command],
            });
            resolvedCommand = await resolveKeychainPlaceholders(command);
          } catch (error) {
            reject(error as Error);
            return;
          }

          let timedOut = false;
          let aborted = false;
          let child: ReturnType<typeof spawn> | null = null;
          let settled = false;
          let attemptedShells: string[] = [];
          let emittedBytes = 0;
          let outputTruncated = false;

          let timeoutHandle: NodeJS.Timeout | undefined;
          const onAbort = () => {
            aborted = true;
            if (child?.pid) {
              killProcessTree(child.pid);
            }
          };
          const cleanup = () => {
            if (timeoutHandle) clearTimeout(timeoutHandle);
            if (signal) signal.removeEventListener("abort", onAbort);
            if (child?.pid) unregisterProcess(child.pid);
          };

          if (timeout !== undefined && timeout > 0) {
            timeoutHandle = setTimeout(() => {
              timedOut = true;
              if (child?.pid) {
                killProcessTree(child.pid);
              }
            }, timeout * 1000);
          }

          if (signal) {
            if (signal.aborted) {
              onAbort();
            } else {
              signal.addEventListener("abort", onAbort, { once: true });
            }
          }

          const settleError = (err: Error) => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(err);
          };

          const settleSuccess = (exitCode: number | null) => {
            if (settled) return;
            settled = true;
            cleanup();
            resolve({ exitCode });
          };

          const emitChunk = (text: string) => {
            if (!text || outputTruncated || settled) return;
            const buffer = Buffer.from(text, "utf8");
            const remaining = TRACKED_BASH_OUTPUT_LIMIT_BYTES - emittedBytes;
            if (remaining <= 0) {
              onData(Buffer.from(TRACKED_BASH_OUTPUT_TRUNCATION_NOTICE, "utf8"));
              outputTruncated = true;
              return;
            }
            if (buffer.length <= remaining) {
              emittedBytes += buffer.length;
              onData(buffer);
              return;
            }

            onData(buffer.subarray(0, remaining));
            emittedBytes += remaining;
            onData(Buffer.from(TRACKED_BASH_OUTPUT_TRUNCATION_NOTICE, "utf8"));
            outputTruncated = true;
          };

          const trySpawn = (candidateIndex: number) => {
            if (settled) return;
            const candidate = shellCandidates[candidateIndex];
            if (!candidate) {
              const attempted = attemptedShells.length > 0 ? attemptedShells.join(", ") : "(none)";
              settleError(new Error(`No supported shell found. Tried: ${attempted}`));
              return;
            }

            attemptedShells.push(candidate.shell);
            const spawned = spawn(candidate.shell, [...candidate.args, resolvedCommand], {
              cwd,
              detached: shouldDetachChildProcess(process.platform),
              env: resolvedEnv,
              stdio: ["ignore", "pipe", "pipe"],
            });
            child = spawned;

            if (spawned.pid) {
              registerProcess(spawned.pid);
            }

            if (spawned.stdout) {
              spawned.stdout.on("data", (chunk) => {
                emitChunk(chunk.toString("utf8"));
              });
            }
            if (spawned.stderr) {
              spawned.stderr.on("data", (chunk) => {
                emitChunk(chunk.toString("utf8"));
              });
            }

            let shellUnavailable = false;
            spawned.on("error", (err) => {
              if (spawned.pid) unregisterProcess(spawned.pid);
              const errWithCode = err as NodeJS.ErrnoException;
              if (!settled && errWithCode.code === "ENOENT") {
                shellUnavailable = true;
                trySpawn(candidateIndex + 1);
                return;
              }
              settleError(err);
            });

            spawned.on("close", (code) => {
              if (spawned.pid) unregisterProcess(spawned.pid);
              if (shellUnavailable) return;

              if (aborted || signal?.aborted) {
                settleError(new Error("aborted"));
                return;
              }

              if (timedOut) {
                settleError(new Error(`timeout:${timeout}`));
                return;
              }

              settleSuccess(code);
            });
          };

          trySpawn(0);
        })();
      });
    },
  };
}

/** Create host-shell tool operations with child process tracking and keychain resolution. */
export function createTrackedBashOperations(): BashOperations {
  return createTrackedShellOperations(() => resolveShellCandidates());
}

/** Create Windows PowerShell-only tool operations. */
export function createTrackedPowerShellOperations(): BashOperations {
  return createTrackedShellOperations(() => resolveShellCandidates().filter((entry) => entry.family === "powershell"));
}

/**
 * PowerShell Extension - Replaces bash with a PowerShell tool
 *
 * Disables the built-in bash tool and provides a "powershell" tool
 * that executes commands via pwsh/powershell.exe and captures output.
 *
 * Placement: ~/.pi/agent/extensions/powershell.ts
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
const DEFAULT_MAX_BYTES = 50 * 1024;
const DEFAULT_MAX_LINES = 2000;
import { Type } from "@sinclair/typebox";
import { spawn, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function formatSize(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	let value = bytes;
	let unit = 0;
	while (value >= 1024 && unit < units.length - 1) {
		value /= 1024;
		unit++;
	}
	return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function truncateTail(text: string, options: { maxLines: number; maxBytes: number }) {
	const totalBytes = Buffer.byteLength(text, "utf-8");
	const lines = text.split(/\r?\n/);
	const totalLines = lines.length;
	let content = text;
	let truncated = false;

	if (totalLines > options.maxLines) {
		content = lines.slice(totalLines - options.maxLines).join("\n");
		truncated = true;
	}

	let outputBytes = Buffer.byteLength(content, "utf-8");
	if (outputBytes > options.maxBytes) {
		const buf = Buffer.from(content, "utf-8");
		content = buf.subarray(buf.length - options.maxBytes).toString("utf-8");
		const nl = content.indexOf("\n");
		if (nl > 0) content = content.slice(nl + 1);
		truncated = true;
		outputBytes = Buffer.byteLength(content, "utf-8");
	}

	const outputLines = content.length === 0 ? 0 : content.split(/\r?\n/).length;
	return { content, truncated, totalLines, totalBytes, outputLines, outputBytes };
}

function isBunOnWindows(): boolean {
	return process.platform === "win32" && typeof (globalThis as any).Bun !== "undefined";
}

function findPowerShell(): string {
	// Prefer pwsh (PowerShell 7+), fall back to powershell.exe (Windows PowerShell 5.1)
	try {
		const res = spawnSync("pwsh", ["-Version"], { stdio: "ignore" });
		if ((res.status ?? 1) === 0) return "pwsh";
	} catch {}
	return "powershell.exe";
}

function wrapCommand(command: string): string {
	return [
		"$ProgressPreference='SilentlyContinue'",
		"$InformationPreference='SilentlyContinue'",
		"$VerbosePreference='SilentlyContinue'",
		"$DebugPreference='SilentlyContinue'",
		"if ($PSVersionTable.PSVersion.Major -ge 7) { $PSStyle.OutputRendering='PlainText' }",
		command,
	].join(";\n");
}

function decodeCliXmlEscapes(text: string): string {
	return text
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/_x([0-9A-Fa-f]{4})_/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function extractCliXmlText(xmlBlock: string): string {
	const parts: string[] = [];
	const seen = new Set<string>();
	const usefulTags = new Set(["S", "ToString", "AV", "SD"]);
	const isNoise = (t: string) => /^Preparing modules for first use\.?$/i.test(t);

	// Use Bun's built-in DOM parser first
	const DOMParserCtor = (globalThis as any).DOMParser;
	if (DOMParserCtor) {
		try {
			const parser = new DOMParserCtor();
			const doc = parser.parseFromString(xmlBlock, "text/xml");
			const nodes = doc.getElementsByTagName("*");

			for (let i = 0; i < nodes.length; i++) {
				const n: any = nodes[i];
				if (!usefulTags.has(n.tagName)) continue;

				// Skip nodes that are under <Obj S="progress"> ... </Obj>
				let p: any = n.parentElement;
				let inProgress = false;
				while (p) {
					if (p.tagName === "Obj" && p.getAttribute && p.getAttribute("S") === "progress") {
						inProgress = true;
						break;
					}
					p = p.parentElement;
				}
				if (inProgress) continue;

				const text = decodeCliXmlEscapes((n.textContent ?? "")).trim();
				if (!text || isNoise(text) || seen.has(text)) continue;
				seen.add(text);
				parts.push(text);
			}

			if (parts.length > 0) return parts.join("\n");
		} catch {
			// fall through to regex fallback
		}
	}

	// Fallback for non-Bun environments
	const re = /<(S|ToString|AV|SD)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(xmlBlock)) !== null) {
		const text = decodeCliXmlEscapes(m[2]).trim();
		if (!text || isNoise(text) || seen.has(text)) continue;
		seen.add(text);
		parts.push(text);
	}

	return parts.join("\n");
}

function stripCliXmlNoise(text: string, trim = true): string {
	let out = text.replace(/^#<\s*CLIXML\s*\r?\n?/gm, "");
	out = out.replace(/<Objs\b[\s\S]*?<\/Objs>/gm, (xml) => {
		const extracted = extractCliXmlText(xml);
		return extracted ? `\n${extracted}\n` : "\n";
	});
	out = decodeCliXmlEscapes(out);
	out = out.replace(/\r\n/g, "\n");
	out = out.replace(/[ \t]+\n/g, "\n");
	out = out.replace(/\n{3,}/g, "\n\n");
	return trim ? out.trim() : out;
}

export default function (pi: ExtensionAPI) {
	// Gate extension: only load when running under Bun on Windows.
	if (!isBunOnWindows()) {
		return;
	}

	const psExe = findPowerShell();

	// Disable built-in bash tool, keep everything else
	pi.on("session_start", async (_event, _ctx) => {
		const active = pi.getActiveTools().filter((t) => t !== "bash");
		// Add our powershell tool (registered below) if not already present
		if (!active.includes("powershell")) active.push("powershell");
		pi.setActiveTools(active);
	});

	pi.registerTool({
		name: "powershell",
		label: "PowerShell",
		description:
			"Execute a PowerShell command in the current working directory. Returns stdout and stderr. " +
			"Output is truncated to last 2000 lines or 50KB (whichever is hit first). " +
			"If truncated, full output is saved to a temp file. Optionally provide a timeout in seconds.",
		promptSnippet: "Execute PowerShell commands and capture output",
		promptGuidelines: [
			"Use the powershell tool instead of bash - this is a Windows environment",
			"Write commands using PowerShell syntax (e.g., Get-ChildItem instead of ls, Select-String instead of grep)",
		],
		parameters: Type.Object({
			command: Type.String({ description: "PowerShell command to execute" }),
			timeout: Type.Optional(Type.Number({ description: "Timeout in seconds (optional, no default timeout)" })),
		}),

		async execute(toolCallId, params, signal, onUpdate, ctx) {
			const { command, timeout } = params;
			const cwd = ctx.cwd;
			const wrappedCommand = wrapCommand(command);

			return new Promise((resolve) => {
				const chunks: Buffer[] = [];
				let timedOut = false;
				let cancelled = false;

				// Encode the command as base64 to avoid quoting issues
				const encodedCommand = Buffer.from(wrappedCommand, "utf16le").toString("base64");

				const child = spawn(psExe, ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encodedCommand], {
					cwd,
					stdio: ["ignore", "pipe", "pipe"],
					env: { ...process.env },
				});

				// Timeout handling
				let timer: ReturnType<typeof setTimeout> | undefined;
				if (timeout) {
					timer = setTimeout(() => {
						timedOut = true;
						child.kill();
					}, timeout * 1000);
				}

				// Abort handling
				const onAbort = () => {
					cancelled = true;
					child.kill();
				};
				signal?.addEventListener("abort", onAbort, { once: true });

				// Collect output (interleaved stdout + stderr, like a real terminal)
				child.stdout.on("data", (data: Buffer) => {
					chunks.push(data);
					// Stream partial output to the UI
					const partial = stripCliXmlNoise(Buffer.concat(chunks).toString("utf-8"));
					onUpdate?.({
						content: [{ type: "text", text: partial }],
						details: { running: true },
					});
				});
				child.stderr.on("data", (data: Buffer) => {
					chunks.push(data);
					const partial = stripCliXmlNoise(Buffer.concat(chunks).toString("utf-8"));
					onUpdate?.({
						content: [{ type: "text", text: partial }],
						details: { running: true },
					});
				});

				child.on("error", (err) => {
					if (timer) clearTimeout(timer);
					signal?.removeEventListener("abort", onAbort);
					resolve({
						content: [{ type: "text", text: `Failed to start PowerShell: ${err.message}` }],
						details: { exitCode: -1, error: true },
						isError: true,
					});
				});

				child.on("close", (code) => {
					if (timer) clearTimeout(timer);
					signal?.removeEventListener("abort", onAbort);

					if (cancelled) {
						resolve({
							content: [{ type: "text", text: "Command was cancelled." }],
							details: { exitCode: code, cancelled: true },
						});
						return;
					}

					if (timedOut) {
						resolve({
							content: [{ type: "text", text: `Command timed out after ${timeout}s.` }],
							details: { exitCode: code, timedOut: true },
						});
						return;
					}

					const rawOutput = stripCliXmlNoise(Buffer.concat(chunks).toString("utf-8"));

					// Apply truncation (keep tail, like bash tool)
					const truncation = truncateTail(rawOutput, {
						maxLines: DEFAULT_MAX_LINES,
						maxBytes: DEFAULT_MAX_BYTES,
					});

					let text = truncation.content;

					if (truncation.truncated) {
						// Save full output to temp file
						const tempFile = join(tmpdir(), `pi-ps-${Date.now()}.txt`);
						try {
							writeFileSync(tempFile, rawOutput);
							text += `\n\n[Output truncated: ${truncation.outputLines} of ${truncation.totalLines} lines`;
							text += ` (${formatSize(truncation.outputBytes)} of ${formatSize(truncation.totalBytes)}).`;
							text += ` Full output saved to: ${tempFile}]`;
						} catch {
							text += `\n\n[Output truncated]`;
						}
					}

					resolve({
						content: [{ type: "text", text }],
						details: {
							exitCode: code ?? 0,
							truncated: truncation.truncated,
						},
					});
				});
			});
		},
	});

	// Also intercept user ! commands to use PowerShell
	pi.on("user_bash", (_event) => {
		return {
			operations: {
				exec: (command: string, cwd: string, options: any) =>
					new Promise((resolve, reject) => {
						const encodedCommand = Buffer.from(wrapCommand(command), "utf16le").toString("base64");
						const child = spawn(psExe, ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encodedCommand], {
							cwd,
							stdio: ["ignore", "pipe", "pipe"],
						});

						let timedOut = false;
						const timer = options.timeout
							? setTimeout(() => {
									timedOut = true;
									child.kill();
								}, options.timeout * 1000)
							: undefined;

						child.stdout.on("data", (data: Buffer) => {
							const cleaned = stripCliXmlNoise(data.toString("utf-8"), false);
							if (cleaned.length > 0) options.onData?.(Buffer.from(cleaned, "utf-8"));
						});
						child.stderr.on("data", (data: Buffer) => {
							const cleaned = stripCliXmlNoise(data.toString("utf-8"), false);
							if (cleaned.length > 0) options.onData?.(Buffer.from(cleaned, "utf-8"));
						});

						const onAbort = () => child.kill();
						options.signal?.addEventListener("abort", onAbort, { once: true });

						child.on("error", (e: Error) => {
							if (timer) clearTimeout(timer);
							reject(e);
						});

						child.on("close", (code: number | null) => {
							if (timer) clearTimeout(timer);
							options.signal?.removeEventListener("abort", onAbort);
							if (options.signal?.aborted) reject(new Error("aborted"));
							else if (timedOut) reject(new Error(`timeout:${options.timeout}`));
							else resolve({ exitCode: code });
						});
					}),
			},
		};
	});

	// Update system prompt to reflect PowerShell environment
	pi.on("before_agent_start", async (event) => {
		let prompt = event.systemPrompt;
		// Replace references to bash with powershell
		prompt = prompt.replace(
			/Use bash for file operations like ls, rg, find/g,
			"Use powershell for file operations like Get-ChildItem, Select-String, Get-ChildItem -Recurse",
		);
		return { systemPrompt: prompt };
	});
}

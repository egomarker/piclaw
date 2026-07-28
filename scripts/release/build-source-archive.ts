#!/usr/bin/env bun
/**
 * Build deterministic Piclaw source archives for GitHub releases.
 *
 * The archive contains tracked repository files at HEAD. It excludes git
 * metadata, working-tree-only files, dependencies, generated release artifacts,
 * and local runtime state.
 */

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = resolve(import.meta.dir, "..", "..");
const defaultOutputDir = join(repoRoot, "artifacts", "release");

type Options = {
  outputDir: string;
  prefix?: string;
  keepWorkdir: boolean;
};

function usage(): string {
  return `Usage: bun run scripts/release/build-source-archive.ts [options]\n\nOptions:\n  --output-dir DIR   Directory for generated archives (default: artifacts/release)\n  --prefix NAME      Archive root directory name (default: piclaw-<package version>-source)\n  --keep-workdir     Keep the temporary build directory\n  -h, --help         Show this help\n`;
}

function parseOptions(argv: string[]): Options {
  const options: Options = { outputDir: defaultOutputDir, keepWorkdir: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    const needValue = () => {
      if (!next || next.startsWith("--")) throw new Error(`${arg} requires a value`);
      i += 1;
      return next;
    };
    switch (arg) {
      case "--output-dir":
        options.outputDir = resolve(repoRoot, needValue());
        break;
      case "--prefix":
        options.prefix = needValue();
        break;
      case "--keep-workdir":
        options.keepWorkdir = true;
        break;
      case "-h":
      case "--help":
        console.log(usage());
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function run(command: string, args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}): string {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    encoding: "utf8",
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed\n${result.stderr || result.stdout}`.trim());
  }
  return result.stdout;
}

function packageVersion(): string {
  const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as { version?: string };
  if (!pkg.version) throw new Error("package.json is missing version");
  return pkg.version;
}

const SOURCE_ARCHIVE_PATHSPEC = [
  ".",
  ":(exclude)artifacts/**",
  ":(exclude)runtime/generated/**",
] as const;

function trackedFiles(): string[] {
  return run("git", ["ls-files", "-z", "--", ...SOURCE_ARCHIVE_PATHSPEC])
    .split("\0")
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function writeFileList(path: string, files: string[]): void {
  writeFileSync(path, `${files.join("\n")}\n`, "utf8");
}

export async function buildSourceArchiveFromCli(argv = process.argv.slice(2)): Promise<void> {
  const options = parseOptions(argv);
  await buildSourceArchive(options);
}

export async function buildSourceArchive(options: Options): Promise<void> {
  const version = packageVersion();
  const prefix = options.prefix ?? `piclaw-${version}-source`;
  if (!/^[A-Za-z0-9._-]+$/.test(prefix)) throw new Error(`Invalid archive prefix: ${prefix}`);
  mkdirSync(options.outputDir, { recursive: true });

  const workdir = mkdtempSync(join(tmpdir(), "piclaw-source-archive-"));
  const fileList = join(workdir, "files.txt");
  const tarPath = join(options.outputDir, `${prefix}.tar.gz`);
  const zipPath = join(options.outputDir, `${prefix}.zip`);
  const sumsPath = join(options.outputDir, `${prefix}.SHA256SUMS`);
  const manifestPath = join(options.outputDir, `${prefix}.manifest.json`);

  try {
    const files = trackedFiles();
    writeFileList(fileList, files);
    rmSync(tarPath, { force: true });
    rmSync(zipPath, { force: true });
    rmSync(sumsPath, { force: true });
    rmSync(manifestPath, { force: true });

    run("tar", [
      "--sort=name",
      "--mtime=@0",
      "--owner=0",
      "--group=0",
      "--numeric-owner",
      "--transform", `s,^,${prefix}/,`,
      "-czf", tarPath,
      "-T", fileList,
    ], { env: { ...process.env, GZIP: "-n" } });

    run("git", ["archive", "--format=zip", `--prefix=${prefix}/`, "-o", zipPath, "HEAD", "--", ...SOURCE_ARCHIVE_PATHSPEC]);

    const artifacts = [tarPath, zipPath];
    const sums = artifacts
      .map((artifact) => `${sha256(artifact)}  ${basename(artifact)}`)
      .join("\n") + "\n";
    writeFileSync(sumsPath, sums, "utf8");

    const manifest = {
      name: "piclaw-source-archive",
      version,
      prefix,
      generated_at: new Date().toISOString(),
      git_commit: run("git", ["rev-parse", "HEAD"]).trim(),
      tracked_file_count: files.length,
      archives: artifacts.map((artifact) => ({
        file: basename(artifact),
        sha256: sha256(artifact),
        size_bytes: statSync(artifact).size,
      })),
      checksum_file: basename(sumsPath),
    };
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

    console.log(JSON.stringify({
      version,
      prefix,
      tracked_file_count: files.length,
      artifacts: [tarPath, zipPath, sumsPath, manifestPath],
    }, null, 2));
  } finally {
    if (options.keepWorkdir) {
      console.error(`[source-archive] kept workdir: ${workdir}`);
    } else {
      rmSync(workdir, { recursive: true, force: true });
    }
  }
}

if (import.meta.main) {
  buildSourceArchiveFromCli().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

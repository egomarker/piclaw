#!/usr/bin/env bun
/**
 * imgcat — display PNG images inline using terminal graphics protocols.
 *
 * Ships with piclaw. Supports Kitty graphics, iTerm2 inline images, and SIXEL.
 * Defaults to auto-detection; unknown terminals keep the historical Kitty output.
 *
 * Usage:
 *   imgcat [OPTIONS] FILE [FILE...]
 *
 * Options:
 *   --protocol MODE      auto, kitty, iterm2, sixel (default: auto)
 *   --kitty              Emit Kitty graphics protocol
 *   --iterm2             Emit iTerm2 inline image protocol (OSC 1337)
 *   --sixel              Emit SIXEL graphics
 *   -w, --width COLS     Display width in terminal columns (default: auto)
 *   -h, --height ROWS    Display height in terminal rows (default: auto)
 *   --max-width COLS     Maximum width in columns (default: 80)
 *   --max-height ROWS    Maximum height in rows (default: 24)
 *   -i, --id ID          Starting image ID (default: 1)
 *   -q, --quiet          Suppress Kitty protocol responses (q=2 instead of q=1)
 *   --help               Show this help
 */

export type ImageProtocol = "auto" | "kitty" | "iterm2" | "sixel";

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CellSize {
  cols: number;
  rows: number;
}

export interface ImgcatOptions {
  files: string[];
  protocol: ImageProtocol;
  width: number | null;
  height: number | null;
  maxWidth: number;
  maxHeight: number;
  startId: number;
  quiet: number;
}

const CHUNK_SIZE = 4096;
const CELL_ASPECT = 2.0; // terminal cells are ~2x taller than wide
const SIXEL_CELL_PIXEL_WIDTH = 8;
const SIXEL_CELL_PIXEL_HEIGHT = 16;
const SIXEL_ALPHA_THRESHOLD = 128;

// ---------------------------------------------------------------------------
// PNG dimension parser (reads IHDR)
// ---------------------------------------------------------------------------

export function parsePngDimensions(buf: Uint8Array): ImageDimensions | null {
  if (buf.length < 24) return null;
  // PNG signature: 137 80 78 71 13 10 26 10
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null;
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const width = view.getUint32(16, false);
  const height = view.getUint32(20, false);
  if (width === 0 || height === 0 || width > 65535 || height > 65535) return null;
  return { width, height };
}

// ---------------------------------------------------------------------------
// Protocol detection and cell-size computation
// ---------------------------------------------------------------------------

export function detectImageProtocol(env: Record<string, string | undefined> = process.env): Exclude<ImageProtocol, "auto"> {
  const configured = String(
    env.PICLAW_TERMINAL_IMAGE_PROTOCOL
    || env.TERM_INLINE_IMAGE_PROTOCOL
    || env.IMG_PROTOCOL
    || "",
  ).trim().toLowerCase();
  if (configured === "kitty" || configured === "iterm2" || configured === "sixel") return configured;
  if (configured === "iterm" || configured === "osc1337") return "iterm2";

  const termProgram = String(env.TERM_PROGRAM || "").trim().toLowerCase();
  const term = String(env.TERM || "").trim().toLowerCase();

  if (env.KITTY_WINDOW_ID || termProgram === "kitty" || term.includes("kitty")) return "kitty";
  if (termProgram === "iterm.app" || termProgram === "iterm2") return "iterm2";
  if (termProgram === "wezterm" || env.WEZTERM_EXECUTABLE) return "kitty";
  if (env.PICLAW_TERMINAL === "1") return "iterm2";
  if (term.includes("sixel") || env.MLTERM || env.XTERM_VERSION) return "sixel";

  // Historical behavior: imgcat emitted Kitty unconditionally.
  return "kitty";
}

export function resolveImageProtocol(protocol: ImageProtocol, env: Record<string, string | undefined> = process.env): Exclude<ImageProtocol, "auto"> {
  return protocol === "auto" ? detectImageProtocol(env) : protocol;
}

export function computeCellSize(
  imgW: number, imgH: number,
  cols: number | null, rows: number | null,
  maxCols: number, maxRows: number,
): CellSize {
  if (cols && rows) return { cols, rows };

  if (cols) {
    const r = Math.max(1, Math.round(cols * imgH / imgW / CELL_ASPECT));
    return { cols, rows: Math.min(r, maxRows) };
  }
  if (rows) {
    const c = Math.max(1, Math.round(rows * imgW / imgH * CELL_ASPECT));
    return { cols: Math.min(c, maxCols), rows };
  }

  // Auto-fit
  const scaleW = maxCols / imgW;
  const scaleH = maxRows / (imgH / CELL_ASPECT);
  const scale = Math.min(scaleW, scaleH);
  return {
    cols: Math.min(maxCols, Math.max(1, Math.round(imgW * scale))),
    rows: Math.min(maxRows, Math.max(1, Math.round(imgH * scale / CELL_ASPECT))),
  };
}

// ---------------------------------------------------------------------------
// Kitty graphics protocol emitter
// ---------------------------------------------------------------------------

export function buildKittyImageOutput(
  data: Uint8Array, imgW: number, imgH: number,
  cols: number, rows: number, imageId: number, quiet: number,
): string {
  const b64 = Buffer.from(data).toString("base64");
  const parts: string[] = [];
  let first = true;

  for (let i = 0; i < b64.length; i += CHUNK_SIZE) {
    const chunk = b64.slice(i, i + CHUNK_SIZE);
    const more = i + CHUNK_SIZE < b64.length ? 1 : 0;

    if (first) {
      parts.push(`\x1b_Ga=T,q=${quiet},f=100,t=d,i=${imageId},s=${imgW},v=${imgH},c=${cols},r=${rows},m=${more};`);
      first = false;
    } else {
      parts.push(`\x1b_Gm=${more};`);
    }
    parts.push(chunk, "\x1b\\");
  }

  parts.push("\n");
  return parts.join("");
}

// ---------------------------------------------------------------------------
// iTerm2 inline image protocol emitter (OSC 1337)
// ---------------------------------------------------------------------------

export function buildIterm2ImageOutput(data: Uint8Array, cols: number, rows: number): string {
  const b64 = Buffer.from(data).toString("base64");
  const args = [
    "inline=1",
    `size=${data.byteLength}`,
    `width=${cols}`,
    `height=${rows}`,
    "preserveAspectRatio=1",
  ];
  return `\x1b]1337;File=${args.join(";")}:${b64}\x07\n`;
}

// ---------------------------------------------------------------------------
// SIXEL emitter
// ---------------------------------------------------------------------------

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value / 255 * 100)));
}

function sixelRun(char: string, count: number): string {
  if (count <= 0) return "";
  if (count === 1) return char;
  if (count === 2) return `${char}${char}`;
  return `!${count}${char}`;
}

function sixelEncodeRuns(chars: string[]): string {
  if (chars.length === 0) return "";
  let result = "";
  let previous = chars[0];
  let count = 1;
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === previous) {
      count++;
      continue;
    }
    result += sixelRun(previous, count);
    previous = chars[i];
    count = 1;
  }
  return result + sixelRun(previous, count);
}

function quantizeRgb(r: number, g: number, b: number): [number, number, number] {
  const q = (value: number) => Math.round(value / 51) * 51;
  return [q(r), q(g), q(b)];
}

function rgbKey(r: number, g: number, b: number): string {
  return `${r},${g},${b}`;
}

async function pngToSixelRaster(data: Uint8Array, cols: number, rows: number): Promise<{ width: number; height: number; rgba: Uint8Array }> {
  const { default: sharp } = await import("sharp");
  const width = Math.max(1, cols * SIXEL_CELL_PIXEL_WIDTH);
  const height = Math.max(1, rows * SIXEL_CELL_PIXEL_HEIGHT);
  const raw = await sharp(Buffer.from(data))
    .resize(width, height, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer();
  return { width, height, rgba: new Uint8Array(raw) };
}

export async function buildSixelImageOutput(data: Uint8Array, cols: number, rows: number): Promise<string> {
  const { width, height, rgba } = await pngToSixelRaster(data, cols, rows);
  const pixels = new Int16Array(width * height);
  pixels.fill(-1);

  const colorIndexes = new Map<string, number>();
  const colors: Array<[number, number, number]> = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const alpha = rgba[offset + 3];
      if (alpha < SIXEL_ALPHA_THRESHOLD) continue;
      const [r, g, b] = quantizeRgb(rgba[offset], rgba[offset + 1], rgba[offset + 2]);
      const key = rgbKey(r, g, b);
      let colorIndex = colorIndexes.get(key);
      if (colorIndex === undefined) {
        colorIndex = colors.length + 1;
        colorIndexes.set(key, colorIndex);
        colors.push([r, g, b]);
      }
      pixels[y * width + x] = colorIndex;
    }
  }

  const parts: string[] = [`\x1bPq"1;1;${width};${height}`];
  for (let i = 0; i < colors.length; i++) {
    const [r, g, b] = colors[i];
    parts.push(`#${i + 1};2;${clampPercent(r)};${clampPercent(g)};${clampPercent(b)}`);
  }

  for (let bandY = 0; bandY < height; bandY += 6) {
    const bandColors = new Set<number>();
    for (let dy = 0; dy < 6 && bandY + dy < height; dy++) {
      for (let x = 0; x < width; x++) {
        const color = pixels[(bandY + dy) * width + x];
        if (color > 0) bandColors.add(color);
      }
    }

    let wroteBandColor = false;
    for (const color of Array.from(bandColors).sort((a, b) => a - b)) {
      const chars: string[] = [];
      for (let x = 0; x < width; x++) {
        let bits = 0;
        for (let dy = 0; dy < 6 && bandY + dy < height; dy++) {
          if (pixels[(bandY + dy) * width + x] === color) bits |= (1 << dy);
        }
        chars.push(String.fromCharCode(63 + bits));
      }
      parts.push(`${wroteBandColor ? "$" : ""}#${color}${sixelEncodeRuns(chars)}`);
      wroteBandColor = true;
    }

    if (bandY + 6 < height) parts.push("-");
  }

  parts.push("\x1b\\\n");
  return parts.join("");
}

// ---------------------------------------------------------------------------
// Display a single file
// ---------------------------------------------------------------------------

async function writeOutput(output: string): Promise<void> {
  const out = Bun.stdout.writer();
  out.write(output);
  out.flush();
}

export async function buildImageOutput(
  data: Uint8Array,
  dims: ImageDimensions,
  cell: CellSize,
  protocol: Exclude<ImageProtocol, "auto">,
  imageId: number,
  quiet: number,
): Promise<string> {
  switch (protocol) {
    case "iterm2":
      return buildIterm2ImageOutput(data, cell.cols, cell.rows);
    case "sixel":
      return await buildSixelImageOutput(data, cell.cols, cell.rows);
    case "kitty":
    default:
      return buildKittyImageOutput(data, dims.width, dims.height, cell.cols, cell.rows, imageId, quiet);
  }
}

export async function displayFile(path: string, opts: ImgcatOptions, imageId: number): Promise<boolean> {
  const file = Bun.file(path);
  if (!await file.exists()) {
    console.error(`imgcat: ${path}: No such file`);
    return false;
  }

  const buf = new Uint8Array(await file.arrayBuffer());
  const dims = parsePngDimensions(buf);
  if (!dims) {
    console.error(`imgcat: ${path}: Not a valid PNG or cannot read dimensions`);
    return false;
  }

  const cell = computeCellSize(dims.width, dims.height, opts.width, opts.height, opts.maxWidth, opts.maxHeight);
  const protocol = resolveImageProtocol(opts.protocol);
  await writeOutput(await buildImageOutput(buf, dims, cell, protocol, imageId, opts.quiet));
  return true;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printHelp(): void {
  console.log(`Usage: imgcat [OPTIONS] FILE [FILE...]

Display PNG images inline using Kitty graphics, iTerm2 inline images, or SIXEL.

Options:
  --protocol MODE      auto, kitty, iterm2, sixel (default: auto)
  --kitty              Emit Kitty graphics protocol
  --iterm2, --iterm    Emit iTerm2 inline image protocol (OSC 1337)
  --sixel              Emit SIXEL graphics
  -w, --width COLS     Display width in terminal columns
  -h, --height ROWS    Display height in terminal rows
  --max-width COLS     Maximum width in columns (default: 80)
  --max-height ROWS    Maximum height in rows (default: 24)
  -i, --id ID          Starting image ID (default: 1)
  -q, --quiet          Suppress Kitty protocol responses (default: suppress OK only)
  --help               Show this help

Auto-detection honours PICLAW_TERMINAL_IMAGE_PROTOCOL, TERM_INLINE_IMAGE_PROTOCOL,
Kitty/iTerm2/WezTerm environment hints, and Piclaw's embedded terminal hint.`);
}

function parseProtocol(value: string): ImageProtocol | null {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "auto" || normalized === "kitty" || normalized === "iterm2" || normalized === "sixel") return normalized;
  if (normalized === "iterm" || normalized === "osc1337") return "iterm2";
  return null;
}

export function parseArgs(args: string[]): ImgcatOptions {
  const result: ImgcatOptions = {
    files: [],
    protocol: "auto",
    width: null,
    height: null,
    maxWidth: 80,
    maxHeight: 24,
    startId: 1,
    quiet: 1,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help") { printHelp(); process.exit(0); }
    else if (arg === "--protocol" && i + 1 < args.length) {
      const protocol = parseProtocol(args[++i]);
      if (!protocol) { console.error(`imgcat: unsupported protocol: ${args[i]}`); process.exit(1); }
      result.protocol = protocol;
    }
    else if (arg.startsWith("--protocol=")) {
      const raw = arg.slice("--protocol=".length);
      const protocol = parseProtocol(raw);
      if (!protocol) { console.error(`imgcat: unsupported protocol: ${raw}`); process.exit(1); }
      result.protocol = protocol;
    }
    else if (arg === "--kitty") result.protocol = "kitty";
    else if (arg === "--iterm2" || arg === "--iterm" || arg === "--osc1337") result.protocol = "iterm2";
    else if (arg === "--sixel") result.protocol = "sixel";
    else if ((arg === "-w" || arg === "--width") && i + 1 < args.length) result.width = parseInt(args[++i], 10);
    else if ((arg === "-h" || arg === "--height") && i + 1 < args.length) result.height = parseInt(args[++i], 10);
    else if (arg === "--max-width" && i + 1 < args.length) result.maxWidth = parseInt(args[++i], 10);
    else if (arg === "--max-height" && i + 1 < args.length) result.maxHeight = parseInt(args[++i], 10);
    else if (arg === "--max-width" || arg === "--max-height" || arg === "--width" || arg === "--height" || arg === "-w" || arg === "-h" || arg === "--protocol") {
      console.error(`imgcat: missing value for ${arg}`);
      process.exit(1);
    }
    else if ((arg === "-i" || arg === "--id") && i + 1 < args.length) result.startId = parseInt(args[++i], 10);
    else if (arg === "-i" || arg === "--id") { console.error(`imgcat: missing value for ${arg}`); process.exit(1); }
    else if (arg === "-q" || arg === "--quiet") result.quiet = 2;
    else if (arg.startsWith("-")) { console.error(`imgcat: unknown option: ${arg}`); process.exit(1); }
    else result.files.push(arg);
  }

  if (result.files.length === 0) {
    console.error("imgcat: no files specified");
    printHelp();
    process.exit(1);
  }

  return result;
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const opts = parseArgs(argv);
  let id = opts.startId;
  let ok = true;

  for (const path of opts.files) {
    if (await displayFile(path, opts, id)) {
      id++;
    } else {
      ok = false;
    }
  }

  process.exit(ok ? 0 : 1);
}

if (import.meta.main) {
  await main();
}

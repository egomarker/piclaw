import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import OpenAI from "openai";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { getAzureAccessToken } from "./azure-openai.ts";

const BASE_URL = process.env.AOAI_BASE_URL || "https://{RESOURCE_NAME}.openai.azure.com/openai/v1";
const AOAI_IMAGE_MODEL_ID = process.env.AOAI_IMAGE_MODEL_ID || "gpt-image-1-5";
const FOUNDRY_BASE_URL =
  process.env.FOUNDRY_BASE_URL || "https://{FOUNDRY_RESOURCE}.cognitiveservices.azure.com/openai/v1";
const FOUNDRY_IMAGE_MODEL_ID = process.env.FOUNDRY_IMAGE_MODEL_ID || "flux-2-pro";
const FOUNDRY_IMAGE_API_VERSION = process.env.FOUNDRY_IMAGE_API_VERSION || "preview";
const FOUNDRY_IMAGE_BASE_URL = process.env.FOUNDRY_IMAGE_BASE_URL || "";
const STATIC_API_KEY = process.env.AOAI_API_KEY || "";

type ImageArgs = {
  prompt: string;
  size?: string;
  count?: number;
  quality?: "low" | "medium" | "high";
  style?: "natural" | "vivid";
  transparent?: boolean;
};

export type SavedImageFile = {
  absPath: string;
  relPath: string;
  rawUrl: string;
  alt: string;
};

type AzureImageMessenger = Pick<ExtensionAPI, "sendMessage">;

/**
 * Parse the lightweight /image and /flux command syntax.
 */
function parseArgs(input: string): ImageArgs | null {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;

  const args: ImageArgs = { prompt: "" };
  const promptParts: string[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token === "--size" && tokens[i + 1]) {
      args.size = tokens[i + 1];
      i += 1;
      continue;
    }
    if (token === "--count" && tokens[i + 1]) {
      const count = Number(tokens[i + 1]);
      if (Number.isFinite(count)) args.count = Math.min(4, Math.max(1, Math.floor(count)));
      i += 1;
      continue;
    }
    if (token === "--quality" && tokens[i + 1]) {
      const quality = tokens[i + 1] as ImageArgs["quality"];
      if (["low", "medium", "high"].includes(quality)) args.quality = quality;
      i += 1;
      continue;
    }
    if (token === "--style" && tokens[i + 1]) {
      const style = tokens[i + 1] as ImageArgs["style"];
      if (["natural", "vivid"].includes(style)) args.style = style;
      i += 1;
      continue;
    }
    if (token === "--transparent") {
      args.transparent = true;
      continue;
    }
    promptParts.push(token);
  }

  let prompt = promptParts.join(" ").trim();
  if (!prompt) return null;

  if (!args.size) {
    const trailing = prompt.match(/\s+(\d{2,5}\s*x\s*\d{2,5})$/i) || prompt.match(/^(\d{2,5}\s*x\s*\d{2,5})$/i);
    if (trailing && trailing[1]) {
      const normalized = trailing[1].replace(/\s+/g, "").toLowerCase();
      const stripped = prompt.slice(0, prompt.length - trailing[0].length).trim();
      if (stripped) {
        args.size = normalized;
        prompt = stripped;
      }
    }
  }

  args.prompt = prompt;
  return args;
}

const AOAI_IMAGE_SIZES = ["1024x1024", "1024x1536", "1536x1024"] as const;

function snapToSupportedSize(size: string | undefined): string {
  if (!size || size === "auto") return "auto";
  const m = size.toLowerCase().match(/(\d+)\s*x\s*(\d+)/);
  if (!m) return "1024x1024";
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return "1024x1024";
  const ratio = w / h;
  let best = AOAI_IMAGE_SIZES[0];
  let bestDiff = Infinity;
  for (const candidate of AOAI_IMAGE_SIZES) {
    const [cw, ch] = candidate.split("x").map(Number);
    const diff = Math.abs(ratio - cw / ch);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = candidate;
    }
  }
  return best;
}

export function buildAzureImageGeneratePayload(model: string, args: ImageArgs, includeStyle: boolean): Record<string, any> {
  const payload: Record<string, any> = {
    model,
    prompt: args.prompt,
    size: snapToSupportedSize(args.size),
    quality: args.quality || "medium",
    n: args.count || 1,
  };
  if (includeStyle && args.style) payload.style = args.style;
  if (args.transparent) {
    payload.background = "transparent";
    payload.output_format = "png";
  }
  return payload;
}

function createAzureClient(baseUrl: string, headers: Record<string, string>) {
  return new OpenAI({
    apiKey: async () => await getAzureAccessToken(),
    baseURL: baseUrl,
    defaultHeaders: headers,
    dangerouslyAllowBrowser: true,
  });
}

async function generateImage(baseUrl: string, model: string, args: ImageArgs, includeStyle: boolean) {
  await getAzureAccessToken();
  const client = createAzureClient(baseUrl, {});

  const payload = buildAzureImageGeneratePayload(model, args, includeStyle);
  const response = await client.images.generate(payload as any);
  const images = response.data || [];
  if (images.length === 0) {
    throw new Error("Image API returned no images.");
  }
  return images;
}

function getAzureEndpoint(baseUrl: string): string {
  return baseUrl.replace(/\/openai\/v1\/?$/, "").replace(/\/openai\/?$/, "");
}

function getFoundryImageEndpoint(): string {
  if (FOUNDRY_IMAGE_BASE_URL) return FOUNDRY_IMAGE_BASE_URL.replace(/\/+$/, "");

  if (STATIC_API_KEY) {
    try {
      const u = new URL(FOUNDRY_BASE_URL);
      u.pathname = u.pathname.replace(/\/foundry(\/v\d+)?\/?$/, "/bfl");
      if (!u.pathname.endsWith("/bfl")) {
        u.pathname = "/bfl";
      }
      return u.toString().replace(/\/+$/, "");
    } catch (error) {
      console.error("[azure-openai-images] Failed to rewrite proxy Foundry base URL to /bfl:", error);
    }
  }

  const base = getAzureEndpoint(FOUNDRY_BASE_URL);
  try {
    const url = new URL(base);
    url.pathname = url.pathname.replace(/\/openai(\/v\d+)?\/?$/, "");
    if (url.hostname.endsWith(".cognitiveservices.azure.com")) {
      url.hostname = url.hostname.replace(".cognitiveservices.azure.com", ".services.ai.azure.com");
      return url.toString().replace(/\/+$/, "");
    }
    if (url.hostname.endsWith(".openai.azure.com")) {
      url.hostname = url.hostname.replace(".openai.azure.com", ".services.ai.azure.com");
      return url.toString().replace(/\/+$/, "");
    }
    return url.toString().replace(/\/+$/, "");
  } catch (error) {
    console.error("[azure-openai-images] Failed to derive Foundry services endpoint:", error);
    return base;
  }
}

function parseSize(size?: string): { width: number; height: number } {
  if (!size) return { width: 1024, height: 1024 };
  const match = size.toLowerCase().match(/(\d+)\s*x\s*(\d+)/);
  if (!match) return { width: 1024, height: 1024 };
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return { width: 1024, height: 1024 };
  return { width, height };
}

async function generateFoundryImage(model: string, args: ImageArgs) {
  const accessToken = await getAzureAccessToken();
  const endpoint = getFoundryImageEndpoint();
  const url = `${endpoint}/providers/blackforestlabs/v1/${encodeURIComponent(model)}?api-version=${encodeURIComponent(FOUNDRY_IMAGE_API_VERSION)}`;
  const size = parseSize(args.size);
  const payload: Record<string, any> = {
    prompt: args.prompt,
    width: size.width,
    height: size.height,
    n: args.count || 1,
    model,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "identity",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${body}`.trim());
  }
  const data = (await res.json()) as { data?: Array<{ b64_json?: string }> };
  const images = data.data || [];
  if (images.length === 0) {
    throw new Error("Image API returned no images.");
  }
  return images;
}

function saveImages(prefix: string, prompt: string, images: Array<{ b64_json?: string }>): SavedImageFile[] {
  const outDir = join("/workspace", "exports", "images");
  mkdirSync(outDir, { recursive: true });

  const files: SavedImageFile[] = [];
  images.forEach((image, idx) => {
    const b64 = image.b64_json;
    if (!b64) return;
    const buffer = Buffer.from(b64, "base64");
    const filename = `${prefix}-${Date.now()}-${idx + 1}.png`;
    const relPath = join("exports", "images", filename).replace(/\\/g, "/");
    const absPath = join("/workspace", relPath);
    writeFileSync(absPath, buffer);
    files.push({
      absPath,
      relPath,
      rawUrl: `/workspace/raw?path=${encodeURIComponent(relPath)}`,
      alt: prompt,
    });
  });
  return files;
}

export function formatGeneratedImageMessage(caption: string, files: SavedImageFile[]): string {
  const lines: string[] = [caption];
  if (files.length > 0) lines.push("");
  for (const file of files) {
    lines.push(`![${file.alt}](${file.rawUrl})`);
  }
  if (files.length > 0) {
    lines.push("", "Files:");
    for (const file of files) {
      lines.push(`- ${file.absPath}`);
    }
  }
  return lines.join("\n").trim();
}

export function formatImageGenerationError(providerLabel: string, error: unknown): string {
  const prefix = `❌ Image generation failed (${providerLabel})`;
  if (error instanceof Error) {
    const raw = error.message || String(error);
    if (/(^|\b)(connection error|unable to connect|fetch failed|econnrefused|econnreset|enotfound|etimedout|timed out|timeout)(\b|$)/i.test(raw)) {
      return `${prefix}: Unable to connect to the configured proxy or upstream endpoint.`;
    }
    const jsonMatch = raw.match(/\{[\s\S]*"error"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        const err = parsed.error || parsed;
        const code = err.code || err.statusCode || "";
        const msg = err.message || err.error || raw;
        return `${prefix}: ${code ? `[${code}] ` : ""}${msg}`;
      } catch (parseError) {
        console.error("[azure-openai-images] Failed to parse structured image error payload:", parseError);
      }
    }
    // Exclude Bun source-context lines (e.g. "303 |     }") which look like HTTP statuses but aren't.
    const httpMatch = raw.match(/^(\d{3}) (?!\|)(.+)/s);
    if (httpMatch) {
      const [, status, body] = httpMatch;
      try {
        const parsed = JSON.parse(body);
        const err = parsed.error || parsed;
        const code = err.code || status;
        const msg = err.message || body;
        return `${prefix}: [${code}] ${msg}`;
      } catch (parseError) {
        console.error("[azure-openai-images] Failed to parse HTTP image error body as JSON:", parseError);
      }
      return `${prefix}: HTTP ${status} — ${body.slice(0, 300)}`;
    }
    if (raw.includes("ZlibError")) {
      return `${prefix}: Response decompression failed (ZlibError). The upstream response may be too large or corrupt.`;
    }
    return `${prefix}: ${raw.slice(0, 500)}`;
  }
  return `${prefix}: ${String(error).slice(0, 500)}`;
}

let generateAzureImageImpl = generateImage;
let generateFoundryImageImpl = generateFoundryImage;
let saveAzureImagesImpl = saveImages;

export function setAzureImageHandlersForTests(handlers?: {
  generateImage?: typeof generateImage | null;
  generateFoundryImage?: typeof generateFoundryImage | null;
  saveImages?: typeof saveImages | null;
} | null): void {
  generateAzureImageImpl = handlers?.generateImage ?? generateImage;
  generateFoundryImageImpl = handlers?.generateFoundryImage ?? generateFoundryImage;
  saveAzureImagesImpl = handlers?.saveImages ?? saveImages;
}

function deliverAzureImageResult(
  pi: AzureImageMessenger,
  customType: "image" | "flux",
  content: string,
): void {
  // Use pi.sendMessage so the message is always delivered to the correct chat JID
  // (including branch sessions), rather than the HTTP internal endpoint which defaults
  // to the root chat and misses branch users.
  pi.sendMessage({ customType, content, display: true } as any);
}

export async function executeAzureImageCommand(
  pi: AzureImageMessenger,
  input: string,
): Promise<void> {
  const parsed = parseArgs(input || "");
  if (!parsed) {
    await pi.sendMessage({
      customType: "image",
      content:
        "Usage: /image <prompt> [--size 1024x1024] [--count 1] [--quality low|medium|high] [--style natural|vivid] [--transparent]",
      display: true,
    } as any);
    return;
  }

  const snappedSize = snapToSupportedSize(parsed.size);
  const sizeNote = parsed.size && parsed.size !== snappedSize ? ` (${parsed.size} → ${snappedSize})` : "";
  const transparencyNote = parsed.transparent ? ", transparent background" : "";
  const statusText = `⏳ Generating image… (${AOAI_IMAGE_MODEL_ID}, ${snappedSize}${sizeNote}${transparencyNote})`;
  pi.sendMessage({ customType: "image", content: statusText, display: true } as any);

  void (async () => {
    try {
      const images = await generateAzureImageImpl(BASE_URL, AOAI_IMAGE_MODEL_ID, parsed, true);
      const files = saveAzureImagesImpl("azure-image", parsed.prompt, images);
      const caption = `Azure image (${AOAI_IMAGE_MODEL_ID}, ${snappedSize}) — ${parsed.prompt}`;
      deliverAzureImageResult(pi, "image", formatGeneratedImageMessage(caption, files));
    } catch (error) {
      deliverAzureImageResult(pi, "image", formatImageGenerationError("Azure OpenAI", error));
    }
  })();
}

export async function executeAzureFluxCommand(
  pi: AzureImageMessenger,
  input: string,
): Promise<void> {
  const parsed = parseArgs(input || "");
  if (!parsed) {
    await pi.sendMessage({
      customType: "flux",
      content:
        "Usage: /flux <prompt> [--size 1024x1024] [--count 1] [--quality low|medium|high]",
      display: true,
    } as any);
    return;
  }

  if (parsed.transparent) {
    await pi.sendMessage({
      customType: "flux",
      content: "❌ Image generation failed (Azure Foundry): Transparent background is not supported for /flux yet.",
      display: true,
    } as any);
    return;
  }

  const size = parseSize(parsed.size);
  const statusText = `⏳ Generating Foundry image… (${FOUNDRY_IMAGE_MODEL_ID}, ${size.width}×${size.height})`;
  pi.sendMessage({ customType: "flux", content: statusText, display: true } as any);

  void (async () => {
    try {
      const images = await generateFoundryImageImpl(FOUNDRY_IMAGE_MODEL_ID, parsed);
      const files = saveAzureImagesImpl("foundry-image", parsed.prompt, images);
      const caption = `Foundry image (${FOUNDRY_IMAGE_MODEL_ID}, ${size.width}×${size.height}) — ${parsed.prompt}`;
      deliverAzureImageResult(pi, "flux", formatGeneratedImageMessage(caption, files));
    } catch (error) {
      deliverAzureImageResult(pi, "flux", formatImageGenerationError("Azure Foundry", error));
    }
  })();
}

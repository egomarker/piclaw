import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

function parseIpv4(host: string): number[] | null {
  const parts = host.split(".").map(part => Number.parseInt(part, 10));
  return parts.length === 4 && parts.every(part => Number.isInteger(part) && part >= 0 && part <= 255) ? parts : null;
}

function blockedIpv4(host: string): boolean {
  const value = parseIpv4(host);
  if (!value) return false;
  const [a, b] = value;
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
    || (a === 100 && b >= 64 && b <= 127) || (a === 198 && (b === 18 || b === 19));
}

function blockedAddress(host: string): boolean {
  const family = isIP(host);
  if (family === 4) return blockedIpv4(host);
  if (family !== 6) return false;
  const lower = host.toLowerCase();
  if (lower === "::" || lower === "::1") return true;
  if (lower.startsWith("::ffff:")) return blockedIpv4(lower.slice(7));
  const first = Number.parseInt(lower.split(":")[0] || "0", 16);
  return (first & 0xfe00) === 0xfc00 || (first & 0xffc0) === 0xfe80;
}

export async function validatePublicHttpUrl(raw: string): Promise<URL | null> {
  let url: URL;
  try { url = new URL(raw); }
  catch { return null; }
  if (url.username || url.password || (url.protocol !== "https:" && url.protocol !== "http:")) return null;
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || blockedAddress(host)) return null;
  try {
    const addresses = (await lookup(host, { all: true, verbatim: true })).map(record => record.address);
    if (!addresses.length || addresses.some(blockedAddress)) return null;
  } catch {
    return null;
  }
  return url;
}

/**
 * web-search-summary.ts — Search SearXNG, fetch top result pages,
 * convert to markdown, and produce short summaries.
 */
import TurndownService from "turndown";
import { parseHTML } from "linkedom";

/** Shape of a search result: url, title, snippet, optional markdown. */
type SearchResult = {
  url: string;
  title: string;
  content?: string;
  summary?: string;
};

/** Shape of the SearXNG JSON API response. */
type SearxResponse = {
  query: string;
  results: Array<{
    url: string;
    title: string;
    content?: string;
  }>;
};

/** Default SearXNG instance URL (override with PICLAW_SEARX_URL env var). */
const DEFAULT_SEARX_URL = "http://192.168.1.100:3080/search";
/** DuckDuckGo HTML search URL used when no SearXNG instance is configured. */
const DUCKDUCKGO_HTML_URL = "https://html.duckduckgo.com/html/";
/** Default max number of search results to return. */
const DEFAULT_LIMIT = 5;
/** Default max number of result pages to fetch and convert. */
const DEFAULT_FETCH_LIMIT = 2;
/** Default HTTP fetch timeout in milliseconds. */
const DEFAULT_TIMEOUT = 15000;
/** Default max sentences in a page summary. */
const DEFAULT_MAX_SENTENCES = 3;
/** Default max characters in a page summary. */
const DEFAULT_MAX_CHARS = 600;

function resolveSearxUrl(): string | null {
  const envUrl = process.env.PICLAW_SEARX_URL?.trim();
  if (envUrl) return envUrl;
  return null;
}


// --help support
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: bun web-search-summary.ts [options]");
  console.log("");
  console.log("  Search via SearXNG, fetch top results, and return quick summaries plus markdown.");
  process.exit(0);
}
const args = process.argv.slice(2);

/** Parse CLI flags (--key value) into a key-value object. */
function parseArgs(argv: string[]) {
  const parsed: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const [key, inline] = arg.slice(2).split("=");
    if (!key) continue;
    if (inline !== undefined) {
      parsed[key] = inline;
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      i += 1;
    } else {
      parsed[key] = "true";
    }
  }
  return parsed;
}

/** Parse a string to an integer, returning a fallback on failure. */
function parseNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const options = parseArgs(args);
const query = options.query || options.q;
const searxUrl = options["searx-url"] || options.searxUrl || resolveSearxUrl();
const useDuckDuckGo = !searxUrl;
const limit = parseNumber(options.limit, DEFAULT_LIMIT);
const fetchLimit = parseNumber(options["fetch-limit"], DEFAULT_FETCH_LIMIT);
const timeoutMs = parseNumber(options.timeout, DEFAULT_TIMEOUT);
const maxSentences = parseNumber(options["max-sentences"], DEFAULT_MAX_SENTENCES);
const maxChars = parseNumber(options["max-chars"], DEFAULT_MAX_CHARS);
const shouldFetch = options.fetch === "false" ? false : true;

if (!query) {
  console.error("Usage: bun run scripts/web-search-summary.ts --query \"your query\" [--fetch-limit 2] [--max-sentences 3]");
  process.exit(1);
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

turndown.remove(["script", "style", "noscript", "iframe"]);

turndown.addRule("stripEmptyLinks", {
  filter: (node) => node.nodeName === "A" && !(node as HTMLAnchorElement).textContent?.trim(),
  replacement: () => "",
});

/** Select the main content element from a parsed HTML document. */
function selectMain(document: Document) {
  return (
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.querySelector("[role='main']") ||
    document.body ||
    document.documentElement
  );
}

/** Fetch a URL and parse the JSON response. */
async function fetchJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }
  return response.json();
}

/** Fetch a URL with an AbortController timeout. */
async function fetchWithTimeout(url: string, timeout: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Convert HTML to markdown using Turndown, selecting main content. */
function htmlToMarkdown(html: string) {
  const { document } = parseHTML(html);
  const main = selectMain(document);
  return turndown.turndown(main);
}

/** Extract a short plain-text summary from markdown content. */
function summarizeMarkdown(markdown: string) {
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[[^\]]+\]\([^\)]+\)/g, (match) => match.replace(/\[(.*?)\]\(.*?\)/g, "$1"))
    .replace(/[#>*_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  const sentences = cleaned.split(/(?<=[.!?])\s+/g).filter(Boolean);
  const selected = sentences.slice(0, maxSentences).join(" ");
  if (selected.length <= maxChars) return selected;
  return selected.slice(0, maxChars).trim() + "…";
}

/** Parse DuckDuckGo HTML search results into structured results. */
function parseDuckDuckGoResults(html: string, maxResults: number): SearchResult[] {
  const { document } = parseHTML(html);
  const results: SearchResult[] = [];
  const links = document.querySelectorAll(".result__a, .result__title a");
  for (const link of Array.from(links)) {
    if (results.length >= maxResults) break;
    const anchor = link as unknown as HTMLAnchorElement;
    const href = anchor.getAttribute("href") || "";
    const title = (anchor.textContent || "").trim();
    if (!href || !title || href.startsWith("javascript:")) continue;
    let url = href;
    try {
      const parsed = new URL(href, "https://duckduckgo.com");
      const uddg = parsed.searchParams.get("uddg");
      if (uddg) url = uddg;
    } catch { /* use href as-is */ }
    const snippet = (link as unknown as Element).parentElement?.querySelector(".result__snippet");
    results.push({
      url,
      title,
      content: snippet?.textContent?.trim() || undefined,
    });
  }
  return results;
}

/** Search SearXNG, optionally fetch top pages, and output results as JSON. */
async function run() {
  let results: SearchResult[];
  let engine: string;

  if (useDuckDuckGo) {
    engine = "duckduckgo";
    const params = new URLSearchParams({ q: query });
    const ddgUrl = `${DUCKDUCKGO_HTML_URL}?${params.toString()}`;
    const html = await fetchWithTimeout(ddgUrl, timeoutMs);
    results = parseDuckDuckGoResults(html, limit);
  } else {
    engine = "searxng";
    const params = new URLSearchParams({ q: query, format: "json" });
    const searchUrl = `${searxUrl}?${params.toString()}`;
    const data = (await fetchJson(searchUrl)) as SearxResponse;
    results = (data.results || [])
      .slice(0, limit)
      .map((item) => ({
        url: item.url,
        title: item.title,
        content: item.content,
      }));
  }

  if (shouldFetch) {
    const fetchTargets = results.slice(0, fetchLimit);
    for (const item of fetchTargets) {
      try {
        const html = await fetchWithTimeout(item.url, timeoutMs);
        const markdown = htmlToMarkdown(html);
        item.content = markdown.trim();
        item.summary = summarizeMarkdown(item.content);
      } catch (err) {
        item.summary = `Failed to fetch: ${err instanceof Error ? err.message : String(err)}`;
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        query,
        engine,
        searxUrl: searxUrl || null,
        limit,
        fetch: shouldFetch,
        maxSentences,
        maxChars,
        results,
      },
      null,
      2
    )
  );
}

run().catch((err) => {
  console.error(err.message || String(err));
  process.exit(1);
});

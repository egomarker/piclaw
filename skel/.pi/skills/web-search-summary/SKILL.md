---
name: web-search-summary
description: Search via SearXNG (or DuckDuckGo fallback), fetch top results, and return sentence-level summaries plus optional converted page content.
distribution: public
---

# Web Search Summary

Use this when you want **quick summaries of the top pages**, not full raw page content.

If you need the fetched Markdown itself as the main artifact, use `web-search` instead.

## Search engine selection

- If `PICLAW_SEARX_URL` is set or `--searx-url` is passed, uses SearXNG.
- Otherwise, falls back to **DuckDuckGo HTML search** (no API key required).

## Examples

Run a summarised search:

```bash
bun /workspace/.pi/skills/web-search-summary/web-search-summary.ts --query "your query"
```

Adjust fetch depth or summary length:

```bash
bun /workspace/.pi/skills/web-search-summary/web-search-summary.ts --query "your query" --fetch-limit 3 --max-sentences 4 --max-chars 800
```

## Output shape

The script prints JSON like:

```json
{
  "query": "...",
  "searxUrl": "http://.../search",
  "limit": 5,
  "fetch": true,
  "maxSentences": 3,
  "maxChars": 600,
  "results": [
    {
      "title": "...",
      "url": "https://...",
      "content": "fetched markdown or original snippet",
      "summary": "short sentence-level digest"
    }
  ]
}
```

- `summary` is only added for fetched items.
- `content` contains converted Markdown when fetch succeeds.

## Failure behaviour

- If the search request fails, the script exits non-zero.
- If page fetch fails for an individual result, the search still succeeds and that item gets `summary: "Failed to fetch: ..."` while other results continue.
- Set `--fetch false` to skip page retrieval entirely.

## Options

- `--query` / `--q` — required search query
- `--limit` — number of search results to return (default `5`)
- `--fetch` — set to `false` to skip page fetches (default `true`)
- `--fetch-limit` — how many results to fetch and convert (default `2`)
- `--searx-url` — override the SearXNG endpoint (env: `PICLAW_SEARX_URL`; falls back to DuckDuckGo if unset)
- `--timeout` — fetch timeout in milliseconds (default `15000`)
- `--max-sentences` — summary sentence limit (default `3`)
- `--max-chars` — summary character limit (default `600`)

## Notes

- Summaries are heuristic first-sentence digests and may need human refinement.
- HTML conversion uses `turndown` + `linkedom` and prefers `<article>`, `<main>`, or `[role='main']`.

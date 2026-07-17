---
name: twitter-summary
description: Fetch a user's recent tweets (tweets, replies, retweets) using Playwright + Nitter fallbacks and produce compact JSON/Markdown summaries.
distribution: public
---

# Twitter Summary

Scrape a public Twitter/X profile via Nitter front-ends and return a compact JSON listing of tweets, replies, and retweets within a time window.

Two scrapers are included:
- `playwright-twitter-summary.ts` — uses Playwright for browser rendering
- `quick-twitter-summary.ts` — uses linkedom for HTML parsing without a browser

## Prerequisites

The wrapper auto-installs Playwright if missing (logs to `/tmp/twitter-playwright-install.log`).

For the quick scraper:

```bash
cd /workspace && bun add linkedom
```

## Usage

Using the wrapper script:

```bash
/workspace/.pi/skills/twitter-summary/run <handle> [hours] [output.json]
```

`<handle>` is required. No default user handle is configured in the scripts.

Examples:

```bash
# Fetch last 16 hours for an explicit handle
/workspace/.pi/skills/twitter-summary/run <handle> 16 /tmp/twitter_fetch.json

# Direct Playwright invocation
bun /workspace/.pi/skills/twitter-summary/playwright-twitter-summary.ts --handle=<handle> --hours=24

# Quick (no browser) invocation
bun /workspace/.pi/skills/twitter-summary/quick-twitter-summary.ts --handle=<handle> --hours=12
```

## Output

JSON with `handle`, `instance`, `count`, and `items` array. Each item has:
- `date` — ISO 8601 timestamp
- `type` — `tweet`, `reply`, or `retweet`
- `text` — Tweet content
- `url` — Link to the tweet on the Nitter instance

## Notes

- The scrapers try several public Nitter instances and use the first that responds.
- Coverage varies by instance. Combining outputs from multiple instances can improve coverage.
- Network restrictions or anti-bot protections may affect results.
- Logs are written to stderr; JSON output goes to stdout.
- A log file is written to /tmp/twitter-summary.log when using the wrapper.

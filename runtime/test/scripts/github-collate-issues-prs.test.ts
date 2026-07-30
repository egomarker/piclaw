import { describe, expect, test } from "bun:test";
import * as YAML from "js-yaml";

import { buildSparklineSvg, svgDataUrl } from "../../../scripts/github-collate-issues-prs.ts";

describe("github-collate-issues-prs YAML compatibility", () => {
  test("js-yaml 5 loads and dumps the metrics history shape", () => {
    const source = [
      "generated_at: 2026-07-30T00:00:00.000Z",
      "version: 1",
      "points: 1",
      "repos:",
      "  - full_name: rcarmo/piclaw",
      "    points:",
      "      - at: 2026-07-30T00:00:00.000Z",
      "        issues: 2",
      "        pull_requests: 3",
      "        stars: 4",
    ].join("\n");
    const parsed = YAML.load(source) as Record<string, unknown>;
    expect(parsed).toMatchObject({ version: 1, points: 1 });
    const dumped = YAML.dump(parsed, { lineWidth: 120, noRefs: true });
    expect(YAML.load(dumped)).toEqual(parsed);
  });
});

describe("github-collate-issues-prs sparklines", () => {
  test("buildSparklineSvg embeds theme-aware light/dark styles", () => {
    const svg = buildSparklineSvg([
      { at: "2026-04-26T00:00:00.000Z", stars: 10, issues: 0, pull_requests: 0, deltas: { issues: 0, pull_requests: 0, stars: 0 } },
      { at: "2026-04-27T00:00:00.000Z", stars: 13, issues: 0, pull_requests: 0, deltas: { issues: 0, pull_requests: 0, stars: 3 } },
    ], "demo/repo star trend");

    expect(svg).toContain("color-scheme: light dark");
    expect(svg).toContain("@media (prefers-color-scheme: dark)");
    expect(svg).toContain("--chart-bg: #ffffff");
    expect(svg).toContain("--chart-bg: #0b1020");
    expect(svg).toContain('class="chart-bg"');
    expect(svg).toContain('class="chart-panel"');
    expect(svg).toContain('class="chart-delta positive"');
  });

  test("buildSparklineSvg marks negative deltas with the negative class", () => {
    const svg = buildSparklineSvg([
      { at: "2026-04-26T00:00:00.000Z", stars: 20, issues: 0, pull_requests: 0, deltas: { issues: 0, pull_requests: 0, stars: 0 } },
      { at: "2026-04-27T00:00:00.000Z", stars: 17, issues: 0, pull_requests: 0, deltas: { issues: 0, pull_requests: 0, stars: -3 } },
    ], "demo/repo star trend");

    expect(svg).toContain('class="chart-delta negative"');
    expect(svg).toContain("-3★");
  });

  test("svgDataUrl returns an inline SVG data URL", () => {
    const dataUrl = svgDataUrl(buildSparklineSvg([], "empty trend"));
    expect(dataUrl.startsWith("data:image/svg+xml;base64,")).toBe(true);
  });
});

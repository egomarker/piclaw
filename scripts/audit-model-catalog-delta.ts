#!/usr/bin/env bun
/**
 * Compare two @earendil-works/pi-ai provider catalog snapshots.
 *
 * Usage:
 *   bun run scripts/audit-model-catalog-delta.ts --base /tmp/pi-ai-old/dist/providers/data --head node_modules/@earendil-works/pi-ai/dist/providers/data
 *   bun run scripts/audit-model-catalog-delta.ts --base old --head new --json /tmp/catalog-delta.json --markdown /tmp/catalog-delta.md
 */

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const DEFAULT_CATALOG = "node_modules/@earendil-works/pi-ai/dist/providers/data";
const STRUCTURAL_MODEL_FIELDS = [
  "api",
  "baseUrl",
  "reasoning",
  "thinkingLevelMap",
  "input",
  "contextWindow",
  "maxTokens",
  "compat",
] as const;
const COST_MODEL_FIELDS = ["cost"] as const;
const DISPLAY_MODEL_FIELDS = ["name"] as const;
const DEFAULT_MODEL_FIELDS = [...STRUCTURAL_MODEL_FIELDS, ...COST_MODEL_FIELDS, ...DISPLAY_MODEL_FIELDS] as const;

type FailOn = "none" | "providers" | "models" | "fields" | "any";

type Args = {
  base: string;
  head: string;
  json?: string;
  markdown?: string;
  providers?: Set<string>;
  fields: Set<string>;
  failOn: FailOn;
  includeUnchanged: boolean;
  help: boolean;
};

type CatalogModel = Record<string, unknown> & { id?: string; provider?: string };
type CatalogProvider = Record<string, CatalogModel>;
type Catalog = Record<string, CatalogProvider>;

type FieldChange = {
  field: string;
  before: unknown;
  after: unknown;
};

type ModelDelta = {
  provider: string;
  model: string;
  status: "added" | "removed" | "changed" | "unchanged";
  changes: FieldChange[];
};

type ProviderDelta = {
  provider: string;
  status: "added" | "removed" | "changed" | "unchanged";
  base_model_count: number;
  head_model_count: number;
  added_models: string[];
  removed_models: string[];
  changed_models: string[];
};

type CatalogDeltaReport = {
  generated_at: string;
  base: string;
  head: string;
  compared_fields: string[];
  provider_filter: string[] | null;
  summary: {
    providers_added: number;
    providers_removed: number;
    providers_changed: number;
    models_added: number;
    models_removed: number;
    models_changed: number;
    field_changes: number;
  };
  provider_deltas: ProviderDelta[];
  model_deltas: ModelDelta[];
};

function usage(): string {
  return [
    "Compare two @earendil-works/pi-ai provider catalog snapshots.",
    "",
    "Options:",
    `  --base <dir>        Baseline provider data dir (default: ${DEFAULT_CATALOG})`,
    `  --head <dir>        Candidate provider data dir (default: ${DEFAULT_CATALOG})`,
    "  --providers <csv>   Limit comparison to provider ids",
    `  --fields <csv>      Model fields to compare (default: ${DEFAULT_MODEL_FIELDS.join(",")})`,
    "  --json <path>       Write full JSON report",
    "  --markdown <path>   Write Markdown summary",
    "  --include-unchanged Include unchanged model rows in JSON report",
    "  --fail-on <mode>    none|providers|models|fields|any (default: none)",
    "  --help             Show this help",
    "",
    "Notes:",
    "  The script reads local catalog JSON only; it does not fetch packages or use credentials.",
    "  Point --base/--head at pi-ai/dist/providers/data directories from two dependency versions.",
  ].join("\n");
}

function parseCsv(value: string): string[] {
  return value.split(",").map((part) => part.trim()).filter(Boolean);
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    base: DEFAULT_CATALOG,
    head: DEFAULT_CATALOG,
    fields: new Set(DEFAULT_MODEL_FIELDS),
    failOn: "none",
    includeUnchanged: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    const needValue = () => {
      if (!next || next.startsWith("--")) throw new Error(`${arg} requires a value`);
      i += 1;
      return next;
    };

    switch (arg) {
      case "--base":
        args.base = needValue();
        break;
      case "--head":
        args.head = needValue();
        break;
      case "--json":
        args.json = needValue();
        break;
      case "--markdown":
      case "--md":
        args.markdown = needValue();
        break;
      case "--providers":
      case "--provider":
        args.providers = new Set(parseCsv(needValue()));
        break;
      case "--fields":
        args.fields = new Set(parseCsv(needValue()));
        break;
      case "--fail-on": {
        const mode = needValue() as FailOn;
        if (!["none", "providers", "models", "fields", "any"].includes(mode)) {
          throw new Error(`Invalid --fail-on mode: ${mode}`);
        }
        args.failOn = mode;
        break;
      }
      case "--include-unchanged":
        args.includeUnchanged = true;
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (args.fields.size === 0) throw new Error("--fields must include at least one field");
  return args;
}

async function readJsonFile(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8")) as unknown;
}

function resolveCatalogDir(input: string): string {
  return resolve(process.cwd(), input);
}

function isProviderFile(name: string): boolean {
  return name.endsWith(".json") && !name.startsWith(".");
}

async function readCatalog(inputDir: string, providerFilter?: Set<string>): Promise<Catalog> {
  const dir = resolveCatalogDir(inputDir);
  if (!existsSync(dir)) throw new Error(`Catalog directory does not exist: ${dir}`);

  const catalog: Catalog = {};
  const entries = (await readdir(dir)).filter(isProviderFile).sort((a, b) => a.localeCompare(b));
  for (const entry of entries) {
    const provider = entry.replace(/\.json$/, "");
    if (providerFilter && !providerFilter.has(provider)) continue;
    const payload = await readJsonFile(join(dir, entry));
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error(`Provider catalog is not an object: ${join(dir, entry)}`);
    }
    catalog[provider] = payload as CatalogProvider;
  }
  return catalog;
}

function stable(value: unknown): string {
  if (value === undefined) return "__undefined__";
  return JSON.stringify(value, (_key, nested) => {
    if (!nested || typeof nested !== "object" || Array.isArray(nested)) return nested;
    return Object.fromEntries(Object.entries(nested as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)));
  });
}

function compareField(before: CatalogModel | undefined, after: CatalogModel | undefined, field: string): FieldChange | null {
  const beforeValue = before?.[field];
  const afterValue = after?.[field];
  if (stable(beforeValue) === stable(afterValue)) return null;
  return { field, before: beforeValue, after: afterValue };
}

function sortedKeys(record: Record<string, unknown> | undefined): string[] {
  return Object.keys(record ?? {}).sort((a, b) => a.localeCompare(b));
}

function buildReport(args: Args, baseCatalog: Catalog, headCatalog: Catalog): CatalogDeltaReport {
  const fields = [...args.fields].sort((a, b) => a.localeCompare(b));
  const providers = [...new Set([...sortedKeys(baseCatalog), ...sortedKeys(headCatalog)])]
    .sort((a, b) => a.localeCompare(b));
  const providerDeltas: ProviderDelta[] = [];
  const modelDeltas: ModelDelta[] = [];

  for (const provider of providers) {
    const baseProvider = baseCatalog[provider];
    const headProvider = headCatalog[provider];
    const baseModels = sortedKeys(baseProvider);
    const headModels = sortedKeys(headProvider);
    const addedModels = headModels.filter((model) => !baseProvider?.[model]);
    const removedModels = baseModels.filter((model) => !headProvider?.[model]);
    const changedModels: string[] = [];

    for (const model of [...new Set([...baseModels, ...headModels])].sort((a, b) => a.localeCompare(b))) {
      const before = baseProvider?.[model];
      const after = headProvider?.[model];
      if (!before && after) {
        modelDeltas.push({ provider, model, status: "added", changes: [] });
        continue;
      }
      if (before && !after) {
        modelDeltas.push({ provider, model, status: "removed", changes: [] });
        continue;
      }
      const changes = fields.map((field) => compareField(before, after, field)).filter((change): change is FieldChange => Boolean(change));
      if (changes.length > 0) {
        changedModels.push(model);
        modelDeltas.push({ provider, model, status: "changed", changes });
      } else if (args.includeUnchanged) {
        modelDeltas.push({ provider, model, status: "unchanged", changes: [] });
      }
    }

    const status: ProviderDelta["status"] = !baseProvider
      ? "added"
      : !headProvider
        ? "removed"
        : (addedModels.length || removedModels.length || changedModels.length ? "changed" : "unchanged");
    providerDeltas.push({
      provider,
      status,
      base_model_count: baseModels.length,
      head_model_count: headModels.length,
      added_models: addedModels,
      removed_models: removedModels,
      changed_models: changedModels,
    });
  }

  const changedProviderDeltas = providerDeltas.filter((provider) => provider.status !== "unchanged");
  return {
    generated_at: new Date().toISOString(),
    base: resolveCatalogDir(args.base),
    head: resolveCatalogDir(args.head),
    compared_fields: fields,
    provider_filter: args.providers ? [...args.providers].sort((a, b) => a.localeCompare(b)) : null,
    summary: {
      providers_added: providerDeltas.filter((provider) => provider.status === "added").length,
      providers_removed: providerDeltas.filter((provider) => provider.status === "removed").length,
      providers_changed: changedProviderDeltas.filter((provider) => provider.status === "changed").length,
      models_added: modelDeltas.filter((model) => model.status === "added").length,
      models_removed: modelDeltas.filter((model) => model.status === "removed").length,
      models_changed: modelDeltas.filter((model) => model.status === "changed").length,
      field_changes: modelDeltas.reduce((sum, model) => sum + model.changes.length, 0),
    },
    provider_deltas: providerDeltas.filter((provider) => provider.status !== "unchanged" || args.includeUnchanged),
    model_deltas: modelDeltas,
  };
}

function formatValue(value: unknown): string {
  if (value === undefined) return "`<unset>`";
  const text = typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null
    ? String(value)
    : JSON.stringify(value);
  return `\`${text.replace(/`/g, "\\`")}\``;
}

function renderMarkdown(report: CatalogDeltaReport): string {
  const s = report.summary;
  const lines = [
    "# Model catalog delta audit",
    "",
    `Generated: ${report.generated_at}`,
    `Base: \`${report.base}\``,
    `Head: \`${report.head}\``,
    `Fields: ${report.compared_fields.map((field) => `\`${field}\``).join(", ")}`,
    report.provider_filter ? `Provider filter: ${report.provider_filter.map((field) => `\`${field}\``).join(", ")}` : null,
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "|---|---:|",
    `| Providers added | ${s.providers_added} |`,
    `| Providers removed | ${s.providers_removed} |`,
    `| Providers changed | ${s.providers_changed} |`,
    `| Models added | ${s.models_added} |`,
    `| Models removed | ${s.models_removed} |`,
    `| Models changed | ${s.models_changed} |`,
    `| Field changes | ${s.field_changes} |`,
    "",
    "## Provider deltas",
    "",
  ].filter((line): line is string => line !== null);

  if (report.provider_deltas.length === 0) {
    lines.push("No provider-level deltas.", "");
  } else {
    lines.push("| Provider | Status | Base models | Head models | Added | Removed | Changed |", "|---|---|---:|---:|---:|---:|---:|");
    for (const provider of report.provider_deltas) {
      lines.push(`| ${provider.provider} | ${provider.status} | ${provider.base_model_count} | ${provider.head_model_count} | ${provider.added_models.length} | ${provider.removed_models.length} | ${provider.changed_models.length} |`);
    }
    lines.push("");
  }

  const changedModels = report.model_deltas.filter((model) => model.status !== "unchanged");
  lines.push("## Model deltas", "");
  if (changedModels.length === 0) {
    lines.push("No model-level deltas.", "");
    return lines.join("\n");
  }

  for (const model of changedModels) {
    lines.push(`### ${model.provider}/${model.model} — ${model.status}`);
    if (model.changes.length === 0) {
      lines.push("", model.status === "added" ? "Model added." : "Model removed.", "");
      continue;
    }
    lines.push("", "| Field | Before | After |", "|---|---|---|");
    for (const change of model.changes) {
      lines.push(`| ${change.field} | ${formatValue(change.before)} | ${formatValue(change.after)} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function shouldFail(report: CatalogDeltaReport, mode: FailOn): boolean {
  if (mode === "none") return false;
  const s = report.summary;
  if (mode === "any") return s.providers_added + s.providers_removed + s.providers_changed + s.models_added + s.models_removed + s.models_changed + s.field_changes > 0;
  if (mode === "providers") return s.providers_added + s.providers_removed + s.providers_changed > 0;
  if (mode === "models") return s.models_added + s.models_removed + s.models_changed > 0;
  if (mode === "fields") return s.field_changes > 0;
  return false;
}

async function writeOutput(path: string, content: string): Promise<void> {
  await mkdir(dirname(resolve(process.cwd(), path)), { recursive: true });
  await writeFile(path, content);
}

async function main(): Promise<void> {
  const args = parseArgs(Bun.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const [baseCatalog, headCatalog] = await Promise.all([
    readCatalog(args.base, args.providers),
    readCatalog(args.head, args.providers),
  ]);
  const report = buildReport(args, baseCatalog, headCatalog);
  const markdown = renderMarkdown(report);

  if (args.json) await writeOutput(args.json, JSON.stringify(report, null, 2) + "\n");
  if (args.markdown) await writeOutput(args.markdown, markdown + "\n");

  if (!args.json && !args.markdown) {
    console.log(markdown);
  } else {
    const s = report.summary;
    console.log(`Catalog delta: providers +${s.providers_added}/-${s.providers_removed}/${s.providers_changed} changed, models +${s.models_added}/-${s.models_removed}/${s.models_changed} changed, fields ${s.field_changes}`);
  }

  if (shouldFail(report, args.failOn)) {
    console.error(`Catalog delta exceeded --fail-on=${args.failOn}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

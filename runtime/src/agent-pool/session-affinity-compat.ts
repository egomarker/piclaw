import type { Api, Model } from "@earendil-works/pi-ai";
import type { ModelRegistry } from "@earendil-works/pi-coding-agent";

type CompatRecord = Record<string, unknown>;
type RegistryWithMutableRefresh = Pick<ModelRegistry, "getAll"> & {
  refresh?: ModelRegistry["refresh"];
  [legacySessionAffinityCompatInstalled]?: true;
};

const legacySessionAffinityCompatInstalled = Symbol("piclaw.legacySessionAffinityCompatInstalled");

export interface LegacySessionAffinityMigration {
  provider: string;
  modelId: string;
  previous: boolean;
  sessionAffinityFormat: "openai" | "openai-nosession";
}

/**
 * Preserve the pre-0.80.7 `sendSessionIdHeader` models.json behavior in memory.
 *
 * Pi 0.80.7 deliberately stopped reading that field. Piclaw keeps old user
 * configuration effective without rewriting models.json (and therefore without
 * destroying JSONC comments); the warning tells operators how to migrate the
 * persisted configuration explicitly.
 */
export function applyLegacySessionAffinityCompatibility(
  models: Model<Api>[],
): LegacySessionAffinityMigration[] {
  const migrations: LegacySessionAffinityMigration[] = [];
  for (const model of models) {
    const compat = model.compat as CompatRecord | undefined;
    if (!compat || typeof compat.sendSessionIdHeader !== "boolean") continue;
    if (typeof compat.sessionAffinityFormat === "string") continue;

    const previous = compat.sendSessionIdHeader;
    const sessionAffinityFormat = previous ? "openai" : "openai-nosession";
    compat.sessionAffinityFormat = sessionAffinityFormat;
    migrations.push({ provider: model.provider, modelId: model.id, previous, sessionAffinityFormat });
  }
  return migrations;
}

/** Apply the compatibility migration initially and after every registry refresh. */
export function installLegacySessionAffinityCompatibility(
  registry: ModelRegistry,
  onWarn: (message: string, details: Record<string, unknown>) => void,
): void {
  const mutable = registry as RegistryWithMutableRefresh;
  if (mutable[legacySessionAffinityCompatInstalled]) return;

  const warned = new Set<string>();
  const apply = () => {
    for (const migration of applyLegacySessionAffinityCompatibility(mutable.getAll() as Model<Api>[])) {
      const key = `${migration.provider}/${migration.modelId}`;
      if (warned.has(key)) continue;
      warned.add(key);
      onWarn("Migrated legacy model session-affinity compatibility in memory", {
        operation: "model_registry.legacy_session_affinity_compat",
        model: key,
        legacyField: "compat.sendSessionIdHeader",
        legacyValue: migration.previous,
        replacementField: "compat.sessionAffinityFormat",
        replacementValue: migration.sessionAffinityFormat,
      });
    }
  };

  const originalRefresh = typeof mutable.refresh === "function"
    ? mutable.refresh.bind(mutable)
    : null;
  if (originalRefresh) {
    mutable.refresh = ((...args: Parameters<ModelRegistry["refresh"]>) => {
      const result = originalRefresh(...args);
      apply();
      return result;
    }) as ModelRegistry["refresh"];
  }
  mutable[legacySessionAffinityCompatInstalled] = true;
  apply();
}

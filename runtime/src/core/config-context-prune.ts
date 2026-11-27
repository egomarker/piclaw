import { getDomainConfigOptions } from "./config-context.js";
import { readDomainConfig, registerDomainConfig, stringField, writeDomainConfigField } from "./domain-config.js";

const ENV_KEY = "PICLAW_CONTEXT_PRUNE_MODEL";

const contextPruneConfig = registerDomainConfig<{ model: string }>({
  domain: "contextPrune",
  fields: {
    model: stringField({
      key: "model",
      owner: "context-prune",
      defaultValue: "",
      persistence: "json-config",
      precedence: ["persisted", "default"],
      secretClass: "none",
    }),
  },
});

type ContextPruneModelId = { provider: string; id: string };

function parseModelId(value: string): ContextPruneModelId {
  const separator = value.indexOf("/");
  if (separator <= 0 || separator === value.length - 1 || /\s/.test(value)) {
    throw new Error("The context prune model must be in provider/model-id format.");
  }
  // The model ID itself can contain slashes (for example, on OpenRouter).
  return { provider: value.slice(0, separator), id: value.slice(separator + 1) };
}

function readSettings() {
  const options = getDomainConfigOptions();
  const { model } = readDomainConfig(contextPruneConfig, options);
  return { model, environmentModel: options.env?.[ENV_KEY]?.trim() ?? "" };
}

/** Read once per prune invocation. Only an unset override uses the session model. */
export function getContextPruneModelOverride(): ContextPruneModelId | undefined {
  const { model, environmentModel } = readSettings();
  const selected = model || environmentModel;
  return selected ? parseModelId(selected) : undefined;
}

export function getContextPruneModelSettings() {
  const { model, environmentModel } = readSettings();
  return { model, hasEnvironmentModel: Boolean(environmentModel) };
}

export function saveContextPruneModelSetting(value: unknown) {
  if (typeof value !== "string") throw new Error("Provide a context prune model or an empty string to clear it.");
  const model = value.trim();
  if (model) parseModelId(model);
  writeDomainConfigField(contextPruneConfig, getDomainConfigOptions(), "model", model);
  return getContextPruneModelSettings();
}

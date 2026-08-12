import { getDomainConfigOptions } from "../core/config-context.js";
import { getWebServerConfig } from "../core/config-web.js";
import {
  readDomainConfig,
  registerDomainConfig,
  writeDomainConfigField,
  type DomainConfigField,
} from "../core/domain-config.js";
import type { PersistentLocalApp } from "./types.js";
import { validatePersistentLocalApps } from "./validation.js";

interface LocalAppProxyDomainConfig {
  apps: PersistentLocalApp[];
}

const localAppProxySchema = registerDomainConfig<LocalAppProxyDomainConfig>({
  domain: "localAppProxy",
  fields: {
    apps: {
      key: "apps",
      owner: "local-app-proxy",
      type: "json",
      defaultValue: [],
      validate(value: unknown) {
        return validatePersistentLocalApps(value, getWebServerConfig().port);
      },
      persistence: "json-config",
      precedence: ["persisted", "default"],
      secretClass: "none",
    } as DomainConfigField<PersistentLocalApp[]>,
  },
});

export function readPersistentLocalApps(): PersistentLocalApp[] {
  return readDomainConfig(localAppProxySchema, getDomainConfigOptions()).apps;
}

export function writePersistentLocalApps(apps: PersistentLocalApp[]): PersistentLocalApp[] {
  return writeDomainConfigField(localAppProxySchema, getDomainConfigOptions(), "apps", apps).apps;
}

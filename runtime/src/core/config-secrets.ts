/** Secret bootstrap accessors. Values remain process/.env/keychain backed and are never domain-persisted here. */

import { readFileSync } from "node:fs";

import { envConfig } from "./config-context.js";
import { clearEnvValue, readEnvValue, readMergedEnvValue, writeEnvValue } from "./env.js";

export interface WebSecretBootstrapConfig {
  internalSecret: string;
  totpSecret: string;
  widgetToken: string;
}

/** Read web bootstrap secrets with process env before workspace .env aliases. */
export function getWebSecretBootstrapConfig(): Readonly<WebSecretBootstrapConfig> {
  return Object.freeze({
    internalSecret:
      readMergedEnvValue("PICLAW_INTERNAL_SECRET", envConfig)
      || readMergedEnvValue("PICLAW_WEB_INTERNAL_SECRET", envConfig)
      || "",
    totpSecret: readMergedEnvValue("PICLAW_WEB_TOTP_SECRET", envConfig) || "",
    widgetToken: readMergedEnvValue("PICLAW_WEB_WIDGET_TOKEN", envConfig) || "",
  });
}

/** Keep mutable web-secret compatibility aliases live after same-process rotations. */
export function setWebSecretCompatibilityValue(
  name: "PICLAW_WEB_TOTP_SECRET" | "PICLAW_WEB_WIDGET_TOKEN",
  value: string,
): void {
  if (value) writeEnvValue(name, value);
  else clearEnvValue(name);
}

export interface KeychainBootstrapConfig {
  key: string;
  keyFile: string;
}

/** Keychain bootstrap is process-env-only; `.env` and JSON persistence are intentionally excluded. */
export function getKeychainBootstrapConfig(): Readonly<KeychainBootstrapConfig> {
  return Object.freeze({
    key: readEnvValue("PICLAW_KEYCHAIN_KEY") || "",
    keyFile: readEnvValue("PICLAW_KEYCHAIN_KEY_FILE") || "",
  });
}

/** Resolve configured key material, preferring the direct key over the key file. */
export function readKeychainBootstrapKeyMaterial(): string {
  const config = getKeychainBootstrapConfig();
  if (config.key) return config.key;
  if (!config.keyFile) return "";
  return readFileSync(config.keyFile, "utf8").trim();
}

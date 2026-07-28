/** Immutable network bootstrap accessors for public origin and TLS paths. */

import { envConfig } from "./config-context.js";
import { readEnvValue, readMergedEnvValue } from "./env.js";

export interface NetworkBootstrapConfig {
  externalUrl: string;
  tlsCert: string;
  tlsKey: string;
}

/** Read call-time external URL and startup TLS overrides without JSON persistence. */
export function getNetworkBootstrapConfig(): Readonly<NetworkBootstrapConfig> {
  return Object.freeze({
    externalUrl: (readEnvValue("PICLAW_WEB_EXTERNAL_URL") || "").trim(),
    tlsCert: readMergedEnvValue("PICLAW_WEB_TLS_CERT", envConfig) || "",
    tlsKey: readMergedEnvValue("PICLAW_WEB_TLS_KEY", envConfig) || "",
  });
}

export function getWebExternalUrl(): string {
  return getNetworkBootstrapConfig().externalUrl;
}

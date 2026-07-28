import { expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  getKeychainBootstrapConfig,
  getWebSecretBootstrapConfig,
  readKeychainBootstrapKeyMaterial,
  setWebSecretCompatibilityValue,
} from "../../src/core/config-secrets.js";

function restoreEnv(snapshot: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

test("web secret bootstrap keeps process env precedence and live rotation", () => {
  const keys = ["PICLAW_INTERNAL_SECRET", "PICLAW_WEB_INTERNAL_SECRET", "PICLAW_WEB_TOTP_SECRET", "PICLAW_WEB_WIDGET_TOKEN"];
  const before = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    process.env.PICLAW_INTERNAL_SECRET = "internal-primary";
    process.env.PICLAW_WEB_INTERNAL_SECRET = "internal-alias";
    setWebSecretCompatibilityValue("PICLAW_WEB_TOTP_SECRET", "totp-live");
    setWebSecretCompatibilityValue("PICLAW_WEB_WIDGET_TOKEN", "widget-live");
    expect(getWebSecretBootstrapConfig()).toEqual({
      internalSecret: "internal-primary",
      totpSecret: "totp-live",
      widgetToken: "widget-live",
    });
    setWebSecretCompatibilityValue("PICLAW_WEB_TOTP_SECRET", "");
    setWebSecretCompatibilityValue("PICLAW_WEB_WIDGET_TOKEN", "");
    expect(process.env.PICLAW_WEB_TOTP_SECRET).toBeUndefined();
    expect(process.env.PICLAW_WEB_WIDGET_TOKEN).toBeUndefined();
  } finally {
    restoreEnv(before);
  }
});

test("keychain bootstrap is process-env-only and prefers direct key over file", () => {
  const keys = ["PICLAW_KEYCHAIN_KEY", "PICLAW_KEYCHAIN_KEY_FILE"];
  const before = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const dir = join("/tmp", `piclaw-config-secrets-${process.pid}-${Date.now()}`);
  const keyFile = join(dir, "key");
  mkdirSync(dir, { recursive: true });
  writeFileSync(keyFile, "file-key\n", "utf8");
  try {
    process.env.PICLAW_KEYCHAIN_KEY = "direct-key";
    process.env.PICLAW_KEYCHAIN_KEY_FILE = keyFile;
    expect(getKeychainBootstrapConfig()).toEqual({ key: "direct-key", keyFile });
    expect(readKeychainBootstrapKeyMaterial()).toBe("direct-key");
    delete process.env.PICLAW_KEYCHAIN_KEY;
    expect(readKeychainBootstrapKeyMaterial()).toBe("file-key");
    delete process.env.PICLAW_KEYCHAIN_KEY_FILE;
    expect(readKeychainBootstrapKeyMaterial()).toBe("");
  } finally {
    restoreEnv(before);
    rmSync(dir, { recursive: true, force: true });
  }
});

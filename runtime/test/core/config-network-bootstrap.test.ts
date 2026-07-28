import { expect, test } from "bun:test";

import { getNetworkBootstrapConfig, getWebExternalUrl } from "../../src/core/config-network-bootstrap.js";

test("network bootstrap reads external URL at call time and trims it", () => {
  const before = process.env.PICLAW_WEB_EXTERNAL_URL;
  try {
    process.env.PICLAW_WEB_EXTERNAL_URL = " https://public.example.test/ ";
    expect(getWebExternalUrl()).toBe("https://public.example.test/");
    delete process.env.PICLAW_WEB_EXTERNAL_URL;
    expect(getWebExternalUrl()).toBe("");
  } finally {
    if (before === undefined) delete process.env.PICLAW_WEB_EXTERNAL_URL;
    else process.env.PICLAW_WEB_EXTERNAL_URL = before;
  }
});

test("network bootstrap exposes TLS process overrides without persistence", () => {
  const beforeCert = process.env.PICLAW_WEB_TLS_CERT;
  const beforeKey = process.env.PICLAW_WEB_TLS_KEY;
  try {
    process.env.PICLAW_WEB_TLS_CERT = "/tmp/cert.pem";
    process.env.PICLAW_WEB_TLS_KEY = "/tmp/key.pem";
    expect(getNetworkBootstrapConfig()).toMatchObject({
      tlsCert: "/tmp/cert.pem",
      tlsKey: "/tmp/key.pem",
    });
  } finally {
    if (beforeCert === undefined) delete process.env.PICLAW_WEB_TLS_CERT;
    else process.env.PICLAW_WEB_TLS_CERT = beforeCert;
    if (beforeKey === undefined) delete process.env.PICLAW_WEB_TLS_KEY;
    else process.env.PICLAW_WEB_TLS_KEY = beforeKey;
  }
});

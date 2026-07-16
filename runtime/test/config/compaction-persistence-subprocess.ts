import { setCompactionRuntimeConfig } from "../../src/core/config.js";

const next = setCompactionRuntimeConfig({
  smartCompactionMethod: "pipelined",
  remoteCompactionEnabled: true,
  remoteCompactionTimeoutMs: 300_000,
});
console.log(JSON.stringify(next));

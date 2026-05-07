import type { ElectrobunConfig } from "electrobun";

import packageJson from "./package.json" with { type: "json" };

export default {
  app: {
    name: "PiClaw",
    identifier: "com.rcarmo.piclaw",
    version: packageJson.version,
    description: "Desktop shell for the PiClaw self-hosted AI workspace.",
  },
  runtime: {
    exitOnLastWindowClosed: true,
    mode: "piclaw-desktop-shell",
  },
  scripts: {
    postBuild: "runtime/desktop/install-icon.ts",
  },
  build: {
    bun: {
      entrypoint: "runtime/desktop/index.ts",
      sourcemap: "linked",
    },
    copy: {
      "runtime/src": "runtime/src",
      "runtime/extensions/README.md": "runtime/extensions/README.md",
      "runtime/extensions/browser": "runtime/extensions/browser",
      "runtime/extensions/experimental": "runtime/extensions/experimental",
      "runtime/extensions/integrations": "runtime/extensions/integrations",
      "runtime/extensions/platform": "runtime/extensions/platform",
      "runtime/extensions/viewers": "runtime/extensions/viewers",
      "runtime/skills": "runtime/skills",
      "runtime/vendor": "runtime/vendor",
      "runtime/docs": "runtime/docs",
      "runtime/web/static": "runtime/web/static",
      "node_modules/@earendil-works/pi-coding-agent/dist/core/export-html": "dist/core/export-html",
      "node_modules/@earendil-works/pi-coding-agent/dist/modes/interactive/assets": "dist/modes/interactive/assets",
      "node_modules/@earendil-works/pi-coding-agent/dist/modes/interactive/theme": "dist/modes/interactive/theme",
      "docs": "docs",
      "skel": "skel",
      "README.md": "README.md",
      "LICENSE": "LICENSE",
      "VERSION": "VERSION",
      "package.json": "package.json",
    },
    watch: [
      "runtime/desktop",
      "runtime/src",
      "runtime/extensions",
      "runtime/web/static",
      "skel",
    ],
    mac: {
      bundleCEF: false,
      defaultRenderer: "native",
      createDmg: false,
    },
    win: {
      bundleCEF: false,
      defaultRenderer: "native",
      icon: "docs/icon.png",
    },
    linux: {
      bundleCEF: false,
      defaultRenderer: "native",
      icon: "docs/icon.png",
    },
  },
  release: {
    generatePatch: false,
  },
} satisfies ElectrobunConfig;

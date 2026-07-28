/**
 * eslint.config.js – repository-wide ESLint flat config.
 *
 * Covers runtime source/tests plus root and runtime maintenance scripts.
 */

import js from "@eslint/js";
import { createTypeScriptFlatConfig } from "./eslint.shared.js";

export default [
  {
    ignores: [
      "node_modules/**",
      "runtime/generated/**",
      "runtime/web/static/**",
      "runtime/node_modules/**",
    ],
  },
  js.configs.recommended,
  createTypeScriptFlatConfig([
    "runtime/src/**/*.ts",
    "runtime/test/**/*.ts",
    "runtime/scripts/**/*.ts",
    "scripts/**/*.ts",
  ]),
];

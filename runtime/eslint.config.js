/**
 * runtime/eslint.config.js – Runtime-root ESLint flat config.
 *
 * Repository-wide lint uses ../eslint.config.js so root scripts are covered from
 * a valid base path. This config imports the same TypeScript rule block for
 * developers invoking ESLint from runtime/.
 */

import js from "@eslint/js";
import { createTypeScriptFlatConfig } from "../eslint.shared.js";

export default [
  {
    ignores: ["dist/**", "generated/**", "web/static/**", "node_modules/**"],
  },
  js.configs.recommended,
  createTypeScriptFlatConfig(["src/**/*.ts", "test/**/*.ts", "scripts/**/*.ts"]),
];

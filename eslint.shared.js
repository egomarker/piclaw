/** Shared ESLint flat-config helpers for repository and runtime roots. */

import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export const typescriptRules = {
  ...tsPlugin.configs.recommended.rules,
  "@typescript-eslint/ban-ts-comment": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
  "no-undef": "off",
  "no-useless-escape": "off",
  "no-useless-assignment": "error",
  "no-empty": ["error", { "allowEmptyCatch": true }],
};

export function createTypeScriptFlatConfig(files) {
  return {
    files,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: typescriptRules,
  };
}

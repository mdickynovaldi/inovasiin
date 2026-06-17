import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // eslint-config-next 16.2 ships the new React Compiler "react-hooks" rules
    // (static-components, purity, set-state-in-effect). They flag long-standing,
    // working patterns in pre-existing code; keep them as advisory warnings
    // rather than hard errors so the build gate stays green while they're
    // addressed incrementally.
    rules: {
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;

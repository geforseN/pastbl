import {
  coverageConfigDefaults as coverageConfigDefaults_,
  defaultExclude as defaultExclude_,
} from "vitest/config";
import type { CoverageOptions } from "vitest/node";

export const defaultExclude = [
  ...defaultExclude_,
  "packages/ui/**/*",
];

export const coverageConfigDefaults = {
  ...coverageConfigDefaults_,
  extension: [".vue", ".ts", ".js"],
  exclude: coverageConfigDefaults_.exclude.concat(
    "**/*.config.ts",
    "**/.nuxt",
    "stories",
    "storybook-static",
  ),
} satisfies CoverageOptions;

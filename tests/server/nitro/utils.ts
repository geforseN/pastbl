import { defineVitestConfig } from "@nuxt/test-utils/config";
import { coverageConfigDefaults, defaultExclude } from "../../utils.ts";
import type { NuxtTestUtilsConfig } from "../../types.ts";

export const nitroTestGlobs = ["**/server/tests/api/**/*.spec.ts"] as const;

export const defineNitroVitestConfig = (config?: NuxtTestUtilsConfig) =>
  defineVitestConfig({
    ...config,
    test: {
      ...config?.test,
      coverage: {
        ...coverageConfigDefaults,
        ...config?.test?.coverage,
      },
      name: "nitro",
      include: [...nitroTestGlobs],
      exclude: defaultExclude,
      environment: "nuxt",
    },
  });

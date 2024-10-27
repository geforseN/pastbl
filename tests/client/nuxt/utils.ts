import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude } from "vitest/config";
import { nitroTestGlobs } from "../../server/nitro/utils.ts";
import { endToEndTestsGlobs } from "../../e2e/utils.ts";
import { coverageConfigDefaults } from "../../utils.ts";
import { nodejsTestsGlobs } from "../../server/node/utils.ts";
import type { NuxtTestUtilsConfig } from "../../types.ts";

export function defineNuxtVitestConfig(config?: NuxtTestUtilsConfig) {
  return defineVitestConfig({
    ...config,
    test: {
      ...config?.test,
      coverage: {
        ...coverageConfigDefaults,
        ...config?.test?.coverage,
      },
      name: "nuxt",
      environment: "nuxt",
      include: ["**/*.spec.ts"],
      exclude: defaultExclude.concat(
        endToEndTestsGlobs,
        nodejsTestsGlobs,
        nitroTestGlobs,
      ),
    },
  });
};

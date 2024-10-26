import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude, coverageConfigDefaults } from "vitest/config";
import { endToEndTestsGlobs } from "../../e2e/utils.ts";
import { nitroTestGlobs } from "../../server/nitro/utils.ts";
import { nodejsTestsGlobs } from "../../server/node/utils.ts";
import type { NuxtTestUtilsConfig } from "~~/tests/types.ts";

export const defineNuxtVitestConfig = (config?: NuxtTestUtilsConfig) =>
  defineVitestConfig({
    ...config,
    test: {
      coverage: {
        exclude: coverageConfigDefaults.exclude.concat(
          "**/*.config.ts",
          "**/.nuxt",
          "stories",
          "storybook-static"
        ),
      },
      name: "nuxt",
      environment: "nuxt",
      include: ["**/*.spec.ts"],
      exclude: defaultExclude.concat(
        endToEndTestsGlobs,
        nodejsTestsGlobs,
        nitroTestGlobs
      ),
      ...config?.test,
    },
  });

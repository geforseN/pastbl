import { defineVitestConfig } from "@nuxt/test-utils/config";
import type { NuxtTestUtilsConfig } from "~~/tests/types";

export const nitroTestGlobs = ["**/server/tests/api/**/*.spec.ts"] as const;

export const defineNitroVitestConfig = (config?: NuxtTestUtilsConfig) =>
  defineVitestConfig({
    ...config,
    test: {
      name: "nitro",
      include: [...nitroTestGlobs],
      environment: "nuxt",
      ...config?.test,
    },
  });

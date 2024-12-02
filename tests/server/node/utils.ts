import { defineConfig, type ViteUserConfig } from "vitest/config";
import { coverageConfigDefaults, defaultExclude } from "../../utils.ts";

export const nodejsTestsGlobs = [
  "{server,layers,app}/**/*.node.spec.ts",
] as const;

export const defineNodeVitestConfig = (config?: ViteUserConfig) =>
  defineConfig({
    ...config,
    test: {
      ...config?.test,
      coverage: {
        ...coverageConfigDefaults,
        ...config?.test?.coverage,
      },
      name: "node",
      environment: "node",
      include: [...nodejsTestsGlobs],
      exclude: defaultExclude,
    },
  });

import { defineConfig, type ViteUserConfig } from "vitest/config";

export const nodejsTestsGlobs = [
  "{server,layers,app}/**/*.node.spec.ts",
] as const;

export const defineNodeVitestConfig = (config?: ViteUserConfig) =>
  defineConfig({
    ...config,
    test: {
      name: "node",
      environment: "node",
      include: [...nodejsTestsGlobs],
      ...config?.test,
    },
  });

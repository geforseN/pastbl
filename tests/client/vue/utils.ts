import vue from "@vitejs/plugin-vue";
import { defineConfig, type ViteUserConfig } from "vitest/config";
import { coverageConfigDefaults } from "../../utils.ts";

export const vueTestsGlob = "**/*.vue.spec.?(c|m)[jt]s?(x)";

export const defineVueVitestConfig = (config?: ViteUserConfig) =>
  defineConfig({
    ...config,
    test: {
      ...config?.test,
      coverage: {
        ...coverageConfigDefaults,
        ...config?.test?.coverage,
      },
      name: "vue",
      environment: "happy-dom",
      include: [vueTestsGlob],
    },
    plugins: [
      vue(),
    ],
  });

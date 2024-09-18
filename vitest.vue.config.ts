import { defineConfig, defaultExclude } from "vitest/config";
import vue from "@vitejs/plugin-vue";

const endToEndTestsGlobs = ["tests-examples", "tests", "**/*.e2e.spec.ts"];

export default defineConfig({
  plugins: [vue()],
  test: {
    exclude: [...defaultExclude, ...endToEndTestsGlobs],
    environment: "happy-dom",
  },
});

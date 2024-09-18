import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { vueTests } from "./test-common";

export default defineConfig({
  plugins: [vue()],
  test: {
    include: vueTests,
    environment: "happy-dom",
  },
});

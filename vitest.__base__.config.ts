import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths({ root: ".nuxt" }),
  ],
  test: {
    globals: true,
    reporters: ["default"],
  },
});

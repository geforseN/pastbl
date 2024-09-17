import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import AutoImport from "unplugin-auto-import/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths({root: '.nuxt'}),
    AutoImport({
      imports: ["vitest"],
      dts: true,
      ignore: ["assert"],
    }),
  ],
  test: {
    include: [
      "app/**/*.spec.ts",
      "layers/**/*.spec.ts",
      "server/**/*.spec.ts",
    ],
  },
});

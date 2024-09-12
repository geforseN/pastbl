import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import AutoImport from "unplugin-auto-import/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths(),
    AutoImport({
      imports: ["vitest"],
      dts: true,
      ignore: ["assert"],
    }),
  ],
  test: {
    environment: "happy-dom",
  },
});

import { defineVitestConfig } from "@nuxt/test-utils/config";
import tsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from "unplugin-auto-import/vite";

export default defineVitestConfig({
  plugins: [
    tsconfigPaths(),
    AutoImport({
      imports: ["vitest"],
      dts: true,
    }),
  ],
  test: {
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
  },
});

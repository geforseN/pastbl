import { fileURLToPath } from "node:url";
import { defineNuxtVitestConfig } from "./utils.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));

export default defineNuxtVitestConfig({
  root,
  test: {
    environmentOptions: {
      nuxt: {
        rootDir: root,
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
  },
});

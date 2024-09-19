import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude } from "vitest/config";
import {
  endToEndTestsGlobs,
  nitroTestsGlobs,
  nodejsTestsGlobs,
} from "./test-common";
import { fileURLToPath } from "node:url";

export default defineVitestConfig({
  test: {
    include: ["**/*.spec.ts", ...nitroTestsGlobs],
    exclude: [...defaultExclude, ...endToEndTestsGlobs, ...nodejsTestsGlobs],
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL(".", import.meta.url)),
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
  },
});

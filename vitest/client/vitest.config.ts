import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude } from "vitest/config";
import {
  endToEndTestsGlobs,
  nitroTestsGlobs,
  nodejsTestsGlobs,
} from "../test-common";

export default defineVitestConfig({
  test: {
    globals: true,
    environment: "nuxt",
    include: ["**/*.spec.ts", ...nitroTestsGlobs],
    exclude: defaultExclude.concat(endToEndTestsGlobs, nodejsTestsGlobs),
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

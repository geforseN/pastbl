import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude } from "vitest/config";
import {
  endToEndTestsGlobs,
  nitroTestsGlobs,
  nodejsTestsGlobs,
} from "../../utils";

// NOTE:  --exclude server must be added
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

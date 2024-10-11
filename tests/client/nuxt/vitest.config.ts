import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude } from "vitest/config";
import { endToEndTestsGlobs } from "../../e2e/utils";
import { nitroTestGlobs } from "../../server/nitro/utils";
import { nodejsTestsGlobs } from "../../server/node/utils";

export default defineVitestConfig({
  test: {
    globals: true,
    environment: "nuxt",
    include: ["**/*.spec.ts"],
    exclude: defaultExclude.concat(
      endToEndTestsGlobs,
      nodejsTestsGlobs,
      nitroTestGlobs,
    ),
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL("../../..", import.meta.url)),
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
  },
});

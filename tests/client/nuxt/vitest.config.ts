import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude } from "vitest/config";
import { endToEndTestsGlobs } from "../../e2e/utils";
import { nitroTestGlobs } from "../../server/nitro/utils";
import { nodejsTestsGlobs } from "../../server/node/utils";

const root = fileURLToPath(new URL("../../..", import.meta.url));

export default defineVitestConfig({
  root,
  test: {
    globals: true,
    name: "nuxt",
    environment: "nuxt",
    include: ["**/*.spec.ts"],
    exclude: defaultExclude.concat(
      endToEndTestsGlobs,
      nodejsTestsGlobs,
      nitroTestGlobs,
    ),
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

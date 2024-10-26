import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude, coverageConfigDefaults } from "vitest/config";
import { endToEndTestsGlobs } from "../../e2e/utils.ts";
import { nitroTestGlobs } from "../../server/nitro/utils.ts";
import { nodejsTestsGlobs } from "../../server/node/utils.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));

export default defineVitestConfig({
  root,
  test: {
    coverage: {
      exclude: coverageConfigDefaults.exclude.concat(
        "**/*.config.ts",
        "**/.nuxt",
        "stories",
        "storybook-static"
      ),
    },
    globals: true,
    name: "nuxt",
    environment: "nuxt",
    include: ["**/*.spec.ts"],
    exclude: defaultExclude.concat(
      endToEndTestsGlobs,
      nodejsTestsGlobs,
      nitroTestGlobs
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

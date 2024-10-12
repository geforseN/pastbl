import { defaultExclude } from "vitest/config";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { endToEndTestsGlobs } from "./tests/e2e/utils";
import { nodejsTestsGlobs } from "./tests/server/node/utils";
import { nitroTestGlobs } from "./tests/server/nitro/utils";

export default [
  defineVitestConfig({
    test: {
      name: "nuxt",
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
          mock: {
            intersectionObserver: true,
            indexedDb: true,
          },
        },
      },
    },
  }),
  defineVitestConfig({
    test: {
      name: "nitro",
      include: [...nitroTestGlobs],
      environment: "nuxt",
    },
  }),
  {
    test: {
      name: "node",
      environment: "node",
      include: [...nodejsTestsGlobs],
    },
  },
];

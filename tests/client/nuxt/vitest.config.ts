import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude } from "vitest/config";
import { endToEndTestsGlobs, nodejsTestsGlobs } from "../../utils";
import { nitroTestInclude } from "../../server/nitro/utils";

// NOTE:  --exclude server must be added
export default defineVitestConfig({
  test: {
    globals: true,
    environment: "nuxt",
    include: ["**/*.spec.ts"],
    exclude: defaultExclude.concat(
      endToEndTestsGlobs,
      nodejsTestsGlobs,
      nitroTestInclude,
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

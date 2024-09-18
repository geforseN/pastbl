import { defineVitestConfig } from "@nuxt/test-utils/config";
import { defaultExclude } from "vitest/config";
import {
  endToEndTestsGlobs,
  nodejsTestsGlobs,
} from "./test-common";

export default defineVitestConfig({
  test: {
    exclude: [
      ...defaultExclude,
      ...endToEndTestsGlobs,
      ...nodejsTestsGlobs,
    ],
  },
});

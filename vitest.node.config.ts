import { defineConfig } from "vitest/config";
import { nodejsTestsGlobs } from "./test-common";

export default defineConfig({
  test: {
    environment: "node",
    include: nodejsTestsGlobs,
  },
});

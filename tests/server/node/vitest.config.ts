import { defineConfig } from "vitest/config";
import { nodejsTestsGlobs } from "./utils";

export default defineConfig({
  test: {
    environment: "node",
    include: [...nodejsTestsGlobs],
  },
});

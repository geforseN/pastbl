import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { nodejsTestsGlobs } from "./utils";

const root = fileURLToPath(new URL("../../..", import.meta.url));

export default defineConfig({
  test: {
    name: "node",
    environment: "node",
    include: [...nodejsTestsGlobs],
    root,
  },
});

import { fileURLToPath } from "node:url";
import { defineNodeVitestConfig } from "./utils.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));

export default defineNodeVitestConfig({
  root,
  test: {
    root,
    coverage: {
      reportsDirectory: fileURLToPath(new URL("./coverage", import.meta.url)),
    },
  },
});

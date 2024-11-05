import { fileURLToPath } from "node:url";
import { defineVueVitestConfig } from "./utils.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));

export default defineVueVitestConfig({
  root,
  test: {
    root,
    coverage: {
      reportsDirectory: fileURLToPath(new URL("./coverage", import.meta.url)),
    },
  },
});

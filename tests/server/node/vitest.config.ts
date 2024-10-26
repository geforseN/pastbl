import { fileURLToPath } from "node:url";
import { defineNodeVitestConfig } from "./utils.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));

export default defineNodeVitestConfig({
  test: {
    root,
  },
});

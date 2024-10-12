import { fileURLToPath } from "node:url";
import { defineVitestConfig } from "@nuxt/test-utils/config";
import { baseUrl } from "./$apiFetch";
import { nitroTestGlobs } from "./utils";

const root = fileURLToPath(new URL("../../..", import.meta.url));

// NOTE: must manually run `pnpm dev` and wait until server is loaded
// NOTE: in scripts/dev-vitest-nitro.sh there there is such logic
// ? Can it be done without manually run `pnpm dev` ?
// ! If so then baseUrl must be changed to, for example 127.0.0.1:1234
export default defineVitestConfig({
  test: {
    name: "nitro",
    include: [...nitroTestGlobs],
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        url: baseUrl,
        rootDir: root,
      },
    },
    root,
  },
});

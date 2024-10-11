import { defineVitestConfig } from "@nuxt/test-utils/config";
import { baseUrl } from "./$apiFetch";

// NOTE: must manually run `pnpm dev` and wait until server is loaded
// ? Can it be done without manually run `pnpm dev` ?
// ! If so then baseUrl must be changed to, for example 127.0.0.1:1234

// FIXME: snapshots must not depend on baseUrl (localhost:3000 in snap files)
export default defineVitestConfig({
  test: {
    include: ["**/server/tests/api/**/*.spec.ts"],
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        url: baseUrl,
      },
    },
  },
});

import { defineConfig } from "nitro-test-utils/config";

export default defineConfig({
  test: {
    include: ["server/api/v1/-test.e2e.spec.ts"],
  }
});

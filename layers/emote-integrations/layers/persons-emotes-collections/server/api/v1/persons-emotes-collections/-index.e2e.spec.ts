// eslint-disable-next-line unicorn/prevent-abbreviations
import { fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, suite, test, expect } from "vitest";
// TODO: test non existing user (must provide bad nickname)
describe("api", () => {
  suite("/person-emotes-collections", async () => {
    await setup({
      server: true,
      browser: false,
      setupTimeout: 300 * 1000,
    });
    test("forsen has failed SevenTV integration", async () => {
      const collection = await fetch(
        "/api/v1/persons-emotes-collections/forsen",
      );
      console.log({ collection });
      expect(collection.integrations.SevenTV).toBe({ status: failed });
    });
  });
});

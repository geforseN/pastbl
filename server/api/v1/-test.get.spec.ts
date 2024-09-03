import { setup, $fetch } from "@nuxt/test-utils/e2e";

describe("server api", async () => {
  await setup({
    server: true,
    setupTimeout: 300 * 1000,
  });
  test("api is working", async () => {
    const response = await $fetch("/api/v1/test");
    expect(response).toBe("Hello World!");
  });
});

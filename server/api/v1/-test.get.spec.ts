import { fetch, setup, $fetch } from "@nuxt/test-utils/e2e";

describe.todo("server api", async () => {
  await setup({
    server: true,
  });
  test("api is working", async () => {
    const response = await $fetch("/api/v1/test");
    expect(response).toBe("Hello World2!");
  });
});

import { $fetch, setup } from "nitro-test-utils/e2e";

describe("server api", async () => {
  await setup();
  test("api is working", async () => {
    const response = await $fetch("/api/v1/test");
    expect(response.data).toBe("Hello World!");
  });
});

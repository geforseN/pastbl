describe("person emotes collection", () => {
  // TODO: test non existing user (must provide bad nickname)
  test.todo("api calls", async () => {
    const response = await fetch("/api/v1/persons-emotes-collections/forsen");
    expect(response.collection.integrations.SevenTV).toBe({ status: failed });
  });
});

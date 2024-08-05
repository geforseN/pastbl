import { describe, expect, test } from "vitest";

describe("person emotes collection", () => {
  // TODO: test non existing user (must provide bad nickname)
  test.todo("api calls", async () => {
    const res = await fetch("/api/v1/persons-emotes-collections/forsen");
    // expect(/* collection.integrations.SevenTV */).toBe({ status: failed });
  });
});

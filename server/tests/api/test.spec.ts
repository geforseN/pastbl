import { describe, it, expect } from "vitest";
import { $apiFetch } from "~~/tests/server/nitro/$apiFetch";

describe("/test", async () => {
  it("should return 'Hello World!'", async () => {
    const res = await $apiFetch("/test");
    expect(res).toBe("Hello World!");
  });
});

import { useIndexedDBKeyValue } from "~/composables/useIndexedDBKeyValue";
import { describe, expect, it } from "vitest";

describe("useIndexedDBKeyValue", () => {
  it("should be defined", () => {
    expect(useIndexedDBKeyValue).toBeDefined();
  });

  it("should work", async () => {
    const { state } = useIndexedDBKeyValue("badges:count", 4);
    expect(state.value).toBe(4);
    state.value = 2;
    expect(state.value).toBe(2);
  });
});

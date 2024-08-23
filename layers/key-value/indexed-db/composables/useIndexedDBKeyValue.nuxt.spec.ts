import { useIndexedDBKeyValue } from "./useIndexedDBKeyValue";

describe("useIndexedDBKeyValue", () => {
  it("should be defined", () => {
    expect(useIndexedDBKeyValue).toBeDefined();
  });

  it("should work", async () => {
    const kv = useIndexedDBKeyValue("badges:count", 4, {
      debounce: 1000,
    });
    expect(kv.state.value).toBe(4);
    kv.state.value = 2;
    expect(kv.state.value).toBe(2);
    // expect(/* IDB.state.value */).toBe(4);
  });
});

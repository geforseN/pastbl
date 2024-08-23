describe("useActionToasts", () => {
  suite("internal", () => {
    test.skip("getActionToastMakersEntries", ({ expect }) => {
      const makers = {
        success() {
          return {};
        },
        failures: {
          somethingBad() {
            return {};
          },
        },
      };
      const returnValue = getActionToastMakersEntries("123test", makers);
      const entriesKeys = returnValue.map((entry) => entry[0]);
      expect(entriesKeys).toBe([
        "123test::success",
        "123test::failure::somethingBad",
      ]);
    });
  });
});

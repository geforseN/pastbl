describe("useActionToasts", () => {
  suite("Person Emotes Collection", () => {
    const toaster = usePersonEmotesCollectionLoadToasts();

    it('1has failure method with "emptyInput" as first argument', () => {
      expect(() => toaster.failure("emptyInput")).not.toThrow();
    });
  });
});

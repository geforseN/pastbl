describe("getEmotesMapInEmotesIntegrations", () => {
  test.skip("empty object input", () => {
    it("must return empty map on empty object input", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const value = getEmotesMapInEmotesIntegrations({});
      expect(value).toBeInstanceOf(Map);
      expect(value.size).toBe(0);
    });
  });
});

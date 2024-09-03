import { getEmotesMapInEmotesIntegrations } from "./emotes";

describe("getEmotesMapInEmotesIntegrations", () => {
  suite("empty object input", () => {
    it("must return empty map on empty object input", () => {
      const value = getEmotesMapInEmotesIntegrations({});
      expect(value).toBeInstanceOf(Map);
      expect(value.size).toBe(0);
    });
  });
});

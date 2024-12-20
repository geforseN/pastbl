import { describe, suite, it, expect } from "vitest";
import { getEmotesMapInEmotesIntegrations } from "./emotes.ts";

describe("getEmotesMapInEmotesIntegrations", () => {
  suite("empty object input", () => {
    it("must return empty map on empty object input", () => {
      const value = getEmotesMapInEmotesIntegrations(
        // @ts-expect-error Argument of type '{}' is not assignable to parameter of type 'SettledEmoteIntegrationsRecord'.
        {},
      );
      expect(value).toBeInstanceOf(Map);
      expect(value.size).toBe(0);
    });
  });
});

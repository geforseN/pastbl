// @vitest-environment node
import { PersonEmoteIntegrations } from "./-record";
import type { PersonTwitch } from "../../../../../../../twitch/twitch-user/server/utils/twitch-user";

describe("PersonEmoteIntegrations class", () => {
  suite("Symbol.asyncIterator method", () => {
    const geforsenTwitch = {
      login: "geforsen",
      id: "104788839",
    } as unknown as PersonTwitch;
    const personEmoteIntegration = new PersonEmoteIntegrations(geforsenTwitch);
    it("is defined", () => {
      expect(personEmoteIntegration[Symbol.asyncIterator]).toBeDefined();
    });

    it("returns objects with 'status' property", async () => {
      for await (const integration of personEmoteIntegration) {
        expect(integration).toHaveProperty("status");
      }
    });
  });
});

import { PersonEmoteIntegrations } from "./-record";

describe("Person Emote Integrations", () => {
  test.todo("PersonEmoteIntegrations class", () => {
    test("Symbol.asyncIterator", () => {
      const geforsenTwitch = {
        login: "geforsen",
        id: "104788839",
      } as unknown as PersonTwitch;
      const personEmoteIntegration = new PersonEmoteIntegrations(
        geforsenTwitch,
      );
      it("has defined", () => {
        expect(personEmoteIntegration[Symbol.asyncIterator]).toBeDefined();
      });

      it("returns objects with 'status' property", async () => {
        for await (const integration of personEmoteIntegration) {
          expect(integration).toHaveProperty("status");
        }
      });
    });
  });
});

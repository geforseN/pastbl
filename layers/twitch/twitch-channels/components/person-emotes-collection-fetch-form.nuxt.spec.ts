import { createPage, setup } from "@nuxt/test-utils/e2e";

describe("pages/collections", () => {
  test("nuxt is working", async () => {
    await setup({
      host: "http://127.0.0.1:3000",
    });

    suite("<person-emotes-collection-fetch-form />", () => {
      it("has input element inside", async () => {
        const page = await createPage("/collections");
        const inputValue = await page
          .getByTestId("person-emotes-collection-fetch-input")
          .inputValue();
        expect(inputValue).toBe("");
      });

      test("twitch channels list is not visible on empty input", async () => {
        const page = await createPage("/collections");
        const isChannelsListVisible = await page
          .getByTestId("twitch-channels-search")
          .isVisible();
        expect(isChannelsListVisible).toBe(false);
      });

      it("opens twitch channels list on input change", async () => {
        const page = await createPage("/collections");
        await page
          .getByTestId("person-emotes-collection-fetch-input")
          .fill("test");
        const isChannelsListVisible = await page
          .getByTestId("twitch-channels-search")
          .isVisible();
        expect(isChannelsListVisible).toBe(true);
      });
    });
  });
});

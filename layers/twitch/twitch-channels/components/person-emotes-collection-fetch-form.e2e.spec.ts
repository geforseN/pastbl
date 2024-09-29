import { test, expect } from "@nuxt/test-utils/playwright";

test("person emotes collection will show alert on bad input", async ({ page }) => {
  await page.goto("/collections");
  await expect(page.getByTestId("chat-pasta-list-skeleton")).toBeHidden();

  await test.step("small input", async () => {
    await page.getByTestId("person-emotes-collection-fetch-input").fill("hm");
    await page.getByRole("button", { name: "Load collection" }).click();
    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: "Nickname is too short, min 3 characters" }),
    ).toBeVisible();
  });

  await test.step("big input", async () => {
    await page.getByTestId("person-emotes-collection-fetch-input").fill("thisisverylonganditwillnotwork");
    await page.getByRole("button", { name: "Load collection" }).click();
    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: "Nickname is too long, max 25 characters" }),
    ).toBeVisible();
  });
});

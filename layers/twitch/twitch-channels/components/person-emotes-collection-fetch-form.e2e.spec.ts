import { test, expect } from "@nuxt/test-utils/playwright";

test("person emotes collection will show alert on bad input", async ({ page }) => {
  await page.goto("/collections");

  await test.step("small input", async () => {
    await page.getByTestId("person-emotes-collection-fetch-input").fill("hm");
    await page.getByRole("button", { name: "Load collection" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("alert")).toContainText("Nickname is too short, min 3 characters");
  });

  await test.step("big input", async () => {
    await page.getByTestId("person-emotes-collection-fetch-input").fill("thisisverylonganditwillnotwork");
    await page.getByRole("button", { name: "Load collection" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("alert")).toContainText("Nickname is too long, max 25 characters");
  });
});

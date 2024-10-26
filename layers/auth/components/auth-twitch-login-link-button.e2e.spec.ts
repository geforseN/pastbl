import { expect, test } from "~~/tests/e2e/utils.ts";

test("auth-twitch-login-link-button", async ({ page, context }) => {
  await page.goto("/");
  await expect(page).toHaveNoSkeleton();
  const twitchAuthPagePromise = context.waitForEvent("page");
  await page
    .getByRole("navigation")
    .getByTestId("auth-twitch-login-link-button")
    .click();
  const twitchAuthPage = await twitchAuthPagePromise;
  expect(twitchAuthPage.url()).toContain("https://www.twitch.tv/login");
});

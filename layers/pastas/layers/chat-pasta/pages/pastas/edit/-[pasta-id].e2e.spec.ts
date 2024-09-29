import { expect, test } from "@nuxt/test-utils/playwright";

test("edit pasta page", async ({ page }) => {
  await test.step("no pasta found", async () => {
    await page.goto("/pastas/edit/1");
    await expect(page.getByTestId("chat-pasta-list-skeleton")).toBeHidden();
    await expect(page).toHaveTitle(/404 - Local pasta not found/);
  });

  await test.step("add pasta", async () => {
    await page.goto("/");
    await page.getByTestId("pasta-form-collapse").click();
    const textarea = page.getByTestId("pasta-form-textarea");
    await textarea.click();
    await textarea.fill("buh");
    await page.getByRole("button", { name: "Create pasta" }).press("Enter");
    await expect(textarea).toHaveValue("");
  });

  await test.step("got to edit pasta page", async () => {
    await page.locator(".actions123").getByTestId("chat-pasta-more-actions__dropdown").hover();
    await page.getByRole("button", { name: "Edit pasta" }).click();
    await expect(page.getByRole("button", { name: "Accept" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Decline" })).toBeEnabled();
  });
});

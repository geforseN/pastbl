import { expect, test } from "@nuxt/test-utils/playwright";
import type { Page } from "@playwright/test";

async function getVisibleDropdown(page: Page) {
  const dropdownForPhone = page.locator(".chat-pasta__actions-for-mobile").getByTestId("chat-pasta-more-actions__dropdown");
  const dropdownForPC = page.locator(".chat-pasta__actions-for-pc").getByTestId("chat-pasta-more-actions__dropdown");
  if (await dropdownForPhone.isVisible()) {
    return dropdownForPhone;
  }
  if (await dropdownForPC.isVisible()) {
    return dropdownForPC;
  }
  throw new Error("no visible dropdown");
}

test("can go to edit pasta when there is pasta", async ({ page }) => {
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
    const visibleDropdown = await getVisibleDropdown(page);
    visibleDropdown.click();
    await visibleDropdown.getByRole("button", { name: "Edit pasta" }).click();
    await expect(page.getByRole("button", { name: "Accept" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Decline" })).toBeEnabled();
  });
});

test("can not go to pasta edit where is no pastas", async ({ page }) => {
  await page.goto("/pastas/edit/1");
  await expect(page.getByTestId("chat-pasta-list-skeleton")).toBeHidden();
  await expect(page).toHaveTitle(/404 - Local pasta not found/);
});

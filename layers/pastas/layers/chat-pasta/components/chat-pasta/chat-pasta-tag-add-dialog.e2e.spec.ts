import { expect, test } from "@nuxt/test-utils/playwright";
import type { Page } from "@playwright/test";

async function fillPastaForm(page: Page, { tag, text }: { tag: string; text: string }) {
  await page.goto("/");
  await page.getByTestId("pasta-form-collapse").click();
  await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
  const textarea = page.getByTestId("pasta-form-textarea");
  await textarea.fill(text);
  const tagInput = page.getByTestId("add-pasta-tag-input");
  tagInput.fill(tag);
  await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
}

function isNodeOpenDialog(node: Node) {
  return node instanceof HTMLDialogElement && node.open;
}

test("add pasta with tag", async ({ page }) => {
  await test.step("fill <pasta-form />", async () => {
    await fillPastaForm(page, { text: "foo", tag: "bar" });
  });

  await test.step("add pasta with tag", async () => {
    await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
    const textarea = page.getByTestId("pasta-form-textarea");
    textarea.press("Enter");
    await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
    const dialog = page.getByTestId("chat-pasta-tag-add-dialog");
    expect(await dialog.evaluate(isNodeOpenDialog)).toBe(true);
    await expect(dialog).toHaveText(/Tag: bar/);
    await dialog.getByRole("button", { name: "Add to pasta" }).click();
    const tagInput = page.getByTestId("add-pasta-tag-input");
    await expect(tagInput).toHaveValue("");
    await expect(textarea).toHaveValue("");
    expect(await dialog.evaluate(isNodeOpenDialog)).toBe(false);
    expect(await dialog.evaluate(isNodeOpenDialog)).toBe(false);
    await expect(page.getByTestId("chat-pasta")).toHaveCount(1);
    await expect(page.getByTestId("chat-pasta-tag")).toHaveCount(1);
    await expect(page.getByTestId("chat-pasta-tag")).toHaveText("bar");
  });
});

test("add pasta without tag", async ({ page }) => {
  await test.step("fill <pasta-form />", async () => {
    await fillPastaForm(page, { text: "fiz", tag: "baz" });
  });

  await test.step("add pasta without tag", async () => {
    await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
    const textarea = page.getByTestId("pasta-form-textarea");
    textarea.press("Enter");
    await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
    const dialog = page.getByTestId("chat-pasta-tag-add-dialog");
    expect(await dialog.evaluate(isNodeOpenDialog)).toBe(true);
    await expect(dialog).toHaveText(/Tag: baz/);
    await dialog.getByRole("button", { name: "Nothing" }).click();
    const tagInput = page.getByTestId("add-pasta-tag-input");
    await expect(tagInput).toHaveValue("");
    await expect(textarea).toHaveValue("");
    expect(await dialog.evaluate(isNodeOpenDialog)).toBe(false);
    await expect(page.getByTestId("chat-pasta")).toHaveCount(1);
    await expect(page.getByTestId("chat-pasta-tag")).toHaveCount(0);
  });
});

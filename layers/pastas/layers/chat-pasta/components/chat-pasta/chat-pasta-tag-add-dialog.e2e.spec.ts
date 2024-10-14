import { expect, test } from "@nuxt/test-utils/playwright";
import type { Page } from "@playwright/test";

async function fillPastaForm(page: Page, { tag, text }: { tag: string; text: string }) {
  await page.goto("/");
  await page.getByTestId("pasta-form-collapse").click();
  await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
  await page.getByTestId("pasta-form-textarea").fill(text);
  await page.getByTestId("add-pasta-tag-input").fill(tag);
  await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
}

function isNodeOpenDialog(node: Node) {
  return node instanceof HTMLDialogElement && node.open;
}

async function addPasta(page: Page, { dialogButtonName, expectedTextToInclude }: { dialogButtonName: string; expectedTextToInclude: RegExp }) {
  await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
  const textarea = page.getByTestId("pasta-form-textarea");
  await textarea.press("Enter");

  const dialog = page.getByTestId("chat-pasta-tag-add-dialog");
  expect(await dialog.evaluate(isNodeOpenDialog)).toBe(true);
  await expect(dialog).toHaveText(expectedTextToInclude);

  await dialog.getByRole("button", { name: dialogButtonName }).click();

  await expect(page.getByTestId("add-pasta-tag-input")).toHaveValue("");
  await expect(textarea).toHaveValue("");
  expect(await dialog.evaluate(isNodeOpenDialog)).toBe(false);
  await expect(page.getByTestId("chat-pasta")).toHaveCount(1);
}

test("add pasta with tag", async ({ page }) => {
  await test.step("fill <pasta-form />", async () => {
    await fillPastaForm(page, { text: "foo", tag: "bar" });
  });

  await test.step("add pasta with tag", async () => {
    await addPasta(page, {
      dialogButtonName: "Add to pasta",
      expectedTextToInclude: /Tag: bar/,
    });
    await expect(page.getByTestId("chat-pasta-tag")).toHaveCount(1);
    await expect(page.getByTestId("chat-pasta-tag")).toHaveText("bar");
  });
});

test("add pasta without tag", async ({ page }) => {
  await test.step("fill <pasta-form />", async () => {
    await fillPastaForm(page, { text: "fiz", tag: "baz" });
  });

  await test.step("add pasta without tag", async () => {
    await addPasta(page, {
      dialogButtonName: "Nothing",
      expectedTextToInclude: /Tag: baz/,
    });
    await expect(page.getByTestId("chat-pasta-tag")).toHaveCount(0);
  });
});

import { expect, test } from "@nuxt/test-utils/playwright";
import type { Page } from "@playwright/test";

async function fillPastaForm(page: Page, { tag, text }: { tag: string; text: string }) {
  await page.getByTestId("pasta-form-collapse").click();
  await page.getByTestId("pasta-form-textarea").fill(text);
  await page.getByTestId("add-pasta-tag-input").fill(tag);
}

function isNodeOpenDialog(node: Node) {
  return node instanceof HTMLDialogElement && node.open;
}

async function addPasta(page: Page, {
  dialogButtonName,
  expectedTextToInclude,
  finalPastasCount,
}: {
  dialogButtonName: string;
  expectedTextToInclude: RegExp;
  finalPastasCount: number;

}) {
  await expect(page.getByTestId("chat-pasta")).toHaveCount(0);
  await page.getByTestId("pasta-form-textarea").press("Enter");

  const dialog = page.getByTestId("chat-pasta-tag-add-dialog");
  expect(await dialog.evaluate(isNodeOpenDialog)).toBe(true);
  await expect(dialog).toHaveText(expectedTextToInclude);

  await dialog.getByRole("button", { name: dialogButtonName }).click();

  await expect(page.getByTestId("pasta-form-textarea")).toBeEmpty();
  await expect(page.getByTestId("add-pasta-tag-input")).toBeEmpty();

  expect(await dialog.evaluate(isNodeOpenDialog)).toBe(false);
  await expect(page.getByTestId("chat-pasta")).toHaveCount(finalPastasCount);
}

test("add pasta with tag", async ({ page }) => {
  await page.goto("/");

  await test.step("fill <pasta-form />", async () => {
    await page.goto("/");
    await fillPastaForm(page, { text: "foo", tag: "bar" });
  });

  await test.step("add pasta with tag", async () => {
    await addPasta(page, {
      dialogButtonName: "Add to pasta",
      expectedTextToInclude: /Tag: bar/,
      finalPastasCount: 1,
    });
    await expect(page.getByTestId("chat-pasta-tag")).toHaveCount(1);
    await expect(page.getByTestId("chat-pasta-tag")).toHaveText("bar");
  });
});

test("add pasta without tag", async ({ page }) => {
  await page.goto("/");

  await test.step("fill <pasta-form />", async () => {
    await fillPastaForm(page, { text: "fiz", tag: "baz" });
  });

  await test.step("add pasta without tag", async () => {
    await addPasta(page, {
      dialogButtonName: "Nothing",
      expectedTextToInclude: /Tag: baz/,
      finalPastasCount: 1,
    });
    await expect(page.getByTestId("chat-pasta-tag")).toHaveCount(0);
  });
});

test("add many pastas", async ({ page }) => {
  await page.goto("/");

  await fillPastaForm(page, { text: "fiz", tag: "baz" });
  await addPasta(page, {
    dialogButtonName: "Nothing",
    expectedTextToInclude: /Tag: baz/,
    finalPastasCount: 1,
  });

  await fillPastaForm(page, { text: "foo", tag: "bar" });
  await addPasta(page, {
    dialogButtonName: "Add to pasta",
    expectedTextToInclude: /Tag: bar/,
    finalPastasCount: 2,
  });
  await expect(page.getByTestId("chat-pasta-tag")).toHaveText("bar");

  await fillPastaForm(page, { text: "fiz", tag: "baz" });
  await addPasta(page, {
    dialogButtonName: "Nothing",
    expectedTextToInclude: /Tag: baz/,
    finalPastasCount: 3,
  });
  await expect(page.getByTestId("chat-pasta-tag")).toHaveCount(1);
});

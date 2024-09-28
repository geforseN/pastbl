import { expect, test } from "@nuxt/test-utils/playwright";
import { isCI } from "std-env";

if (isCI && !process.env.BASE_URL) {
  throw new Error("BASE_URL is not set on CI");
}

const options = isCI
  ? {
      host: process.env.BASE_URL,
    }
  : {
      host: "http://127.0.0.1",
      port: 3000,
    };

const baseUrl = isCI
  ? process.env.BASE_URL!
  : options.host + ":" + options.port;

test.use({ nuxt: { ...options } });

test("e2e", async ({ page }) => {
  await page.goto(baseUrl);
  await expect(page).toHaveTitle(/pastbl/);
  const textarea = page.getByTestId("pasta-form-textarea");
  await expect(textarea).toBeHidden();
  await page.getByTestId("pasta-form-collapse").click();
  await expect(textarea).toBeVisible();
  await textarea.focus();
  await textarea.fill("buh");
  await textarea.press("Enter");
  await expect(textarea).toHaveValue("");
  await page.getByTestId("pasta-form-collapse").focus();
  await page.getByTestId("pasta-form-collapse").press("Escape");
  await expect(textarea).toBeHidden();
  expect(await page.getByTestId("chat-pasta").count()).toBe(1);
  expect(await page.getByTestId("chat-pasta").getByRole("img").count()).toBe(0);
  await page.getByRole("link", { name: "Emotes and emojis Alt + E" }).click();
  await page
    .getByTestId("person-emotes-collection-fetch-input")
    .fill("geforsen");
  await expect(page.getByText("Add Person emotes")).toBeVisible();
  const collectionResponsePromise = page.waitForResponse(
    `${baseUrl}/api/v1/persons-emotes-collections/geforsen`,
  );
  await page.getByTestId("person-emotes-collection-fetch-input").press("Enter");
  await expect(
    page.getByTestId("person-emotes-collection-fetch-input"),
  ).toHaveValue("");
  await collectionResponsePromise;
  await expect(
    page.getByRole("button", { name: "Load collection" }),
  ).toBeVisible();
  await expect(page.getByText("Add Person emotes")).toBeHidden();
  expect(await page.getByTestId("chat-pasta").getByRole("img").count()).toBe(1);
  await page.getByTestId("chat-pasta").getByRole("img").hover();
  await expect(page.getByTestId("emote-on-hover-card")).toBeVisible();
  const hoverCard = page.getByTestId("emote-on-hover-card");
  await page.waitForFunction(() => {
    const hoverCard = document.querySelector(
      "[data-testid=emote-on-hover-card]",
    );
    if (!hoverCard) {
      throw new Error("Hover card not found");
    }
    const images = Array.from(hoverCard.querySelectorAll("img"));
    return images.every((img) => img.complete);
  });
  for (const imageOfDifferentSize of await hoverCard.getByRole("img").all()) {
    await imageOfDifferentSize.isVisible();
  }
});

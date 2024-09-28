import { expect, test } from "@nuxt/test-utils/playwright";
import { isCI } from "std-env";

const options = isCI
  ? {
      host: process.env.BASE_URL || "https://pastbl.vercel.app",
    }
  : {
      host: "http://127.0.0.1",
      port: 3000,
    };

const baseUrl = isCI
  ? process.env.BASE_URL! || "https://pastbl.vercel.app"
  : options.host + ":" + options.port;

test.use({ nuxt: { ...options } });

test("e2e", async ({ page }) => {
  await test.step("add pasta", async () => {
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
    await expect(page.getByTestId("chat-pasta")).toHaveCount(1);
    await expect(page.getByTestId("chat-pasta").getByRole("img")).toHaveCount(
      0,
    );
  });

  await test.step("load emotes", async () => {
    await page.getByRole("link", { name: "Emotes and emojis Alt + E" }).click();
    await page
      .getByTestId("person-emotes-collection-fetch-input")
      .fill("geforsen");
    await expect(page.getByText("Add Person emotes")).toBeVisible();
    const collectionResponsePromise = page.waitForResponse(
      `${baseUrl}/api/v1/persons-emotes-collections/geforsen`,
    );
    await page
      .getByTestId("person-emotes-collection-fetch-input")
      .press("Enter");
    await expect(
      page.getByTestId("person-emotes-collection-fetch-input"),
    ).toHaveValue("");
    await collectionResponsePromise;
    await expect(
      page.getByRole("button", { name: "Load collection" }),
    ).toBeVisible();
  });

  await test.step("pasta populated with emote", async () => {
    await expect(page.getByText("Add Person emotes")).toBeHidden();
    await expect(page.getByTestId("chat-pasta").getByRole("img")).toHaveCount(
      1,
    );
    await page.getByTestId("chat-pasta").getByRole("img").hover();
    await expect(page.getByTestId("emote-on-hover-card")).toBeVisible();
  });

  // because must scrollbar is in middle and other images are big enough to add overflow
  await test.step("first emote image is not in viewport", async () => {
    const hoverCard = page.getByTestId("emote-on-hover-card");
    await page.waitForFunction(() => {
      const hoverCard = document.querySelector(
        "[data-testid=emote-on-hover-card]",
      );
      if (!hoverCard) {
        throw new Error("Hover card not found");
      }
      const images = Array.from(
        hoverCard.querySelectorAll("[data-testid=hovered-emote-image]"),
      );
      return images.every(
        (img) => img instanceof HTMLImageElement && img.complete,
      );
    });
    const firstImage = hoverCard.getByTestId("hovered-emote-image").first();
    // TODO: with node@22 use Iterator#drop
    const notFirstImages = (
      await hoverCard.getByTestId("hovered-emote-image").all()
    ).filter((_, index) => index > 0);
    await expect(firstImage).toHaveCount(1);
    expect(notFirstImages.length).toBe(3);
    await expect(firstImage).not.toBeInViewport();
    await Promise.all(
      notFirstImages.map((image) => expect(image).toBeInViewport()),
    );
    expect(
      await hoverCard
        .getByTestId("hovered-emote-images-container")
        .evaluate(
          (container) =>
            container instanceof HTMLElement
            && container.scrollWidth > container.offsetWidth,
        ),
    ).toBe(true);
  });
});

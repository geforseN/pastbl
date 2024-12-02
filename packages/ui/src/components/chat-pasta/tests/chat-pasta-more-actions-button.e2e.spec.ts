import { test, expect } from "@playwright/experimental-ct-vue";
import ChatPastaMoreActionsButton from "../components/more-actions/chat-pasta-more-actions-button.vue";

test.describe("chat-pasta-more-actions-button", () => {
  test.describe("sizes", () => {
    for (const size of ["small", "medium", "large"] as const) {
      test(`size=${size}`, async ({ mount }) => {
        const button = await mount(ChatPastaMoreActionsButton, { props: { size } });
        await expect(button).toHaveScreenshot();
      });
      test(`size=${size} and shape=square`, async ({ mount }) => {
        const button = await mount(ChatPastaMoreActionsButton, { props: { size, shape: "square" } });
        await expect(button).toHaveScreenshot();
      });
    }
  });
});

import { test, expect } from "@playwright/experimental-ct-vue";
import ChatPastaCopyButton from "../components/buttons/chat-pasta-copy-button.vue";

test.describe("chat-pasta-copy-button", () => {
  test("no props", async ({ mount }) => {
    const button = await mount(ChatPastaCopyButton);
    await expect(button).toHaveScreenshot();
  });

  test("shape=square", async ({ mount }) => {
    const squareButton = await mount(ChatPastaCopyButton, { props: { shape: "square" } });
    await expect(squareButton).toHaveScreenshot();
  });
});

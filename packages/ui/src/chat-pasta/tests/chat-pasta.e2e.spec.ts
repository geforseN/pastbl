import { test, expect } from "@playwright/experimental-ct-vue";
import ChatPastaPlayground from "./chat-pasta.playground.vue";

test.describe("chat-pasta", () => {
  test("playground", async ({ mount }) => {
    const playground = await mount(ChatPastaPlayground);
    await expect(playground).toHaveScreenshot();
  });
});

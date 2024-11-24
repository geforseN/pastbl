import { test, expect } from "@playwright/experimental-ct-vue";
import ChatPasta from "../chat-pasta.vue";
import {
  creationTime,
  propsToTest,
  someChatter,
} from "./utils/chat-pasta";

// TODO: change browser theme, all screenshots use light theme, add dark theme
test.describe("chat-pasta", () => {
  for (const props of propsToTest) {
    const { compact, text, tags } = props;

    const testTitle = `${
      compact ? "compact + " : ""
    }#text=${
      text.length
    } + ${
      Array.isArray(tags) ? `#tags=${tags.length}` : `tags=${tags}`
    }`;

    test(testTitle, async ({ mount }) => {
      const chatPasta = await mount(ChatPasta, {
        props: {
          compact,
          text,
          tags,
          chatter: someChatter,
          time: creationTime,
        },
      });
      await expect(chatPasta).toHaveScreenshot();
      chatPasta.getByTestId("chat-pasta-time").hover();
      // NOTE: need to hover some other element
      // otherwise more-actions-button can be hidden
      // if pasta is small and that button is blocked by chat-pasta-time
      chatPasta.getByTestId("chat-pasta-message").hover();
      await expect(chatPasta).toHaveScreenshot();
      chatPasta.getByTestId("chat-pasta-more-actions-button").click();
      await expect(chatPasta).toHaveScreenshot();
    });
  }
});

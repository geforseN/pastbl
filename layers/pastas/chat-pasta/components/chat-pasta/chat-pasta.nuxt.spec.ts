import { ChatPastaCreatorData, ChatPasta } from "#components";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import "jest-image-snapshot";

describe("<chat-pasta />", () => {
  it("matches snapshot", async () => {
    const html = await renderSuspended(ChatPasta, {
      slots: {
        creatorData: h(ChatPastaCreatorData, {
          badgesCount: 0,
          nickname: "geforsen",
          nicknameColor: "#000000",
        }),
      },
    });
    expect(html).toMatchImageSnapshot();
  });
});

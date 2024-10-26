import { test } from "vitest";
import {
  mountSuspended,
  // renderSuspended
} from "@nuxt/test-utils/runtime";
import { HoveredEmoteImages } from "#components";
// import { screen } from "@testing-library/vue";

test.todo("<hovered-emote-images />", async () => {
  const wrapper = await mountSuspended(HoveredEmoteImages, {
    props: {
      emote: EmoteOnHover.create({
        // actorId: "651fb8b2e818c1aa4e9f326c",
        height: 32,
        id: "63cec0c12ba67946677a463e",
        isAnimated: true,
        isListed: true,
        isModifier: false,
        source: "SevenTV",
        // tags: ["buh", "guh"],
        token: "buh",
        type: "channel",
        url: "https://cdn.7tv.app/emote/63cec0c12ba67946677a463e/1x.webp",
        width: 45,
      }),
    },
    route: "/",
  });
  expect(wrapper.element?.scrollWidth).toBe(4);
});

import "~/assets/index.css";
import App from "~/components/app.vue";
import { consola } from "~/utils/consola";
import { pollFor } from "~/utils/poll-for";
import type { ContentScriptContext } from "wxt/client";

async function createUI(context: ContentScriptContext) {
  const { maxAttemptCount, pollInterval } = config.pastbl.contentScript;
  const container = await pollFor({
    maxAttemptCount,
    interval: pollInterval,
    queryFn: () => document.querySelector(".chat-room__content > .chat-input"),
  });
  if (!container) {
    throw new Error("Failed to find chat input");
  }
  return await createShadowRootUi(context, {
    name: "pastbl-ui",
    position: "inline",
    anchor: container,
    onMount(chatInput) {
      consola.log("mounting ui", chatInput);
      const div = document.createElement("div");
      chatInput.append(div);
      div.classList.add(
        "absolute", "pointer-events-none", "-left-[calc(320px+0.75rem)]", "bottom-1.5", "z-40",
      );
      const app = createApp(App);
      app.mount(div);
      return app;
    },
    onRemove(mounted) {
      mounted?.unmount();
    },
  });
}

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  cssInjectionMode: "ui",
  async main(context) {
    consola.success("content script loaded");
    const ui = await createUI(context);
    ui.mount();
  },
});

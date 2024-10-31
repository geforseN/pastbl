import "~/assets/index.css";
import { consola } from "~/utils/consola";
import PastblApp from "~/components/pastbl-app.vue";
import type { ContentScriptContext } from "wxt/client";

async function createUI(context: ContentScriptContext) {
  return await createShadowRootUi(context, {
    name: "pastbl-ui",
    position: "inline",
    anchor: "body",
    onMount(documentBody) {
      const div = document.createElement("div");
      documentBody.append(div);
      const app = createApp(PastblApp);
      app.mount(div);
      return app;
    },
    onRemove(app) {
      app?.unmount();
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

import { consola } from "@/utils/consola";
import "@/assets/index.css";
import PastblApp from "@/components/pastbl-app.vue";

export default defineContentScript({
  matches: ["*://twitch.tv/*"],
  main(_context) {
    consola.success("content script loaded");
    const div = document.createElement("div");
    div.id = "pastbl";
    document.body.append(div);
    createApp(PastblApp).mount("#" + div.id);
  },
});

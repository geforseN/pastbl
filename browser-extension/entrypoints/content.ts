import { consola } from "@/utils/consola";
import { config } from "@/utils/config";

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main() {
    consola.success("content script loaded");
    const observer = createMutationObserver(consola);
    const buttonsInterval = setInterval(() => {
      const container = findButtonContainer();
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
        clearInterval(buttonsInterval);
      }
    }, config.pastbl.contentScript.pollInterval);
  },
});

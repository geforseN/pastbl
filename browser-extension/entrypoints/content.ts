import { consola } from "@/utils/consola";

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main() {
    consola.log("hello from content script");
    const observer = createMutationObserver(consola);
    const buttonsInterval = setInterval(() => {
      const container = findButtonContainer();
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
        clearInterval(buttonsInterval);
      }
    }, 1000);
  },
});

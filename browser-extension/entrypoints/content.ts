import { consola } from "consola";

const _consola = consola.withTag("pastbl").withTag("browser-extension");

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main() {
    _consola.log("hello from content script");
    const observer = createMutationObserver(_consola);
    const buttonsInterval = setInterval(() => {
      const container = document.querySelector(".chat-input__buttons-container");
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
        clearInterval(buttonsInterval);
      }
    }, 1000);
  },
});

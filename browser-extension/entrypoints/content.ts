import { consola } from "consola";

const _consola = consola.withTag("pastbl").withTag("browser-extension");

const config = {
  twitch: {
    "chat-input": {
      "buttons-container": {
        selector: ".chat-input__buttons-container",
      },
    },
  },
} as const;

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main() {
    _consola.log("hello from content script");
    const observer = createMutationObserver(_consola);
    const buttonsInterval = setInterval(() => {
      const container = document.querySelector(
        config.twitch["chat-input"]["buttons-container"].selector,
      );
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
        clearInterval(buttonsInterval);
      }
    }, 1000);
  },
});

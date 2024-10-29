import { consola } from "consola";

const consola_ = consola.withTag("pastbl").withTag("browser-extension");

function createMutationObserver() {
  return new MutationObserver(() => {
    consola_.log({ where: "MutationObserver" });
    let buttonsContainer: HTMLElement;
    try {
      buttonsContainer = getButtonContainer();
    } catch (e) {
      consola_.error(e);
      return;
    }
    consola_.log({ buttonsContainer, where: "MutationObserver" });
    if (!buttonsContainer.querySelector(`.asd`)) {
      const button = createButton(() => {
        consola_.log("clicked pastbl button");
      });
      buttonsContainer.prepend(button);
    }
  });
}

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main() {
    consola_.log("hello from content script");
    const observer = createMutationObserver();
    const buttonsInterval = setInterval(() => {
      const container = document.querySelector(".chat-input__buttons-container");
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
        clearInterval(buttonsInterval);
      }
    }, 1000);
  },
});

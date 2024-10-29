import { consola } from "consola";
import styles from "../assets/button.module.css";

function createPastblButton(
  clickListener: (this: HTMLButtonElement, event: MouseEvent) => void,
) {
  const button = document.createElement("button");
  button.textContent = "pastbl";
  button.classList.add(styles.pastbl__button, "asd");
  button.addEventListener("click", clickListener);
  return button;
}

const consola_ = consola.withTag("pastbl").withTag("browser-extension");

function getButtonContainer(): HTMLElement {
  const container = document.querySelector(".chat-input__buttons-container");
  if (!container) {
    throw new Error("container not found");
  }
  if (!(container instanceof HTMLElement)) {
    const error = new Error("container is not an HTMLElement");
    (error as any).context = { container };
    throw error;
  }
  return container;
}

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main() {
    consola_.log("hello from content script");
    const observer = new MutationObserver(() => {
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
        const button = createPastblButton(() => {
          consola_.log("clicked pastbl button");
        });
        buttonsContainer.prepend(button);
      }
    });
    const buttonsInterval = setInterval(() => {
      const container = document.querySelector(".chat-input__buttons-container");
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
        clearInterval(buttonsInterval);
      }
    }, 1000);
  },
});

import styles from "../assets/button.module.css";
import type { ConsolaInstance } from "consola";

export function createButton(
  clickListener: (this: HTMLButtonElement, event: MouseEvent) => void,
) {
  const button = document.createElement("button");
  button.textContent = "pastbl";
  button.classList.add(styles.pastbl__button, "asd");
  button.addEventListener("click", clickListener);
  return button;
}

export function getButtonContainer(): HTMLElement {
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

export function createMutationObserver(consola: ConsolaInstance) {
  return new MutationObserver(() => {
    consola.log({ where: "MutationObserver" });
    let buttonsContainer: HTMLElement;
    try {
      buttonsContainer = getButtonContainer();
    } catch (e) {
      consola.error(e);
      return;
    }
    consola.log({ buttonsContainer, where: "MutationObserver" });
    if (!buttonsContainer.querySelector(`.asd`)) {
      const button = createButton(() => {
        consola.log("clicked pastbl button");
      });
      buttonsContainer.prepend(button);
    }
  });
}

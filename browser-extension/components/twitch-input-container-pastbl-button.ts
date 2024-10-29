import styles from "../assets/button.module.css";
import type { ConsolaInstance } from "consola";
import { config } from "@/entrypoints/utils/config";

function createButton(
  clickListener: (this: HTMLButtonElement, event: MouseEvent) => void,
) {
  const button = document.createElement("button");
  button.textContent = "pastbl";
  button.classList.add(styles.pastbl__button);
  button.addEventListener("click", clickListener);
  return button;
}

export function findButtonContainer(container: ParentNode = document) {
  return container.querySelector(config.twitch["chat-input"]["buttons-container"].selector);
}

function findButton(container: ParentNode) {
  return container.querySelector(`.${styles.pastbl__button}`);
}

function getButtonContainer(): HTMLElement {
  const container = findButtonContainer();
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

function emplaceButton(buttonsContainer: HTMLElement, consola: ConsolaInstance) {
  consola.log({ buttonsContainer, where: "emplaceButton" });
  if (!findButton(buttonsContainer)) {
    const button = createButton(() => {
      consola.log("clicked pastbl button");
    });
    buttonsContainer.append(button);
  }
}

export function createMutationObserver(consola: ConsolaInstance) {
  return new MutationObserver(() => {
    consola.log({ where: "createMutationObserver" });
    let buttonsContainer: HTMLElement;
    try {
      buttonsContainer = getButtonContainer();
    } catch (e) {
      consola.error(e);
      return;
    }
    emplaceButton(buttonsContainer, consola);
  });
}

import styles from "../assets/button.module.css";

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

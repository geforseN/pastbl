import type { ConsolaInstance } from "consola";
import styles from "@/assets/button.module.css";
import { config } from "@/utils/config";
import { fetchPastas } from "@/utils/pastas";
import { pastas } from "@/utils/pastas.store";

// TODO: use vue component
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
    // @ts-expect-error Property 'context' does not exist on type 'Error'.ts(2339)
    error.context = { container };
    throw error;
  }
  return container;
}

// TODO: change append strategy
// should check children for their chider
// must insert button at left side
function emplaceButton(buttonsContainer: HTMLElement, consola: ConsolaInstance) {
  consola = consola.withTag("emplaceButton");
  if (!findButton(buttonsContainer)) {
    const button = createButton(async () => {
      try {
        consola.log("clicked pastbl button");
        const json = await fetchPastas(consola);
        pastas.value.push(...json.pastas);
      } catch (error) {
        consola.error(error);
      }
    });
    buttonsContainer.append(button);
  }
}

export function createMutationObserver(consola: ConsolaInstance) {
  consola = consola.withTag("createMutationObserver");
  return new MutationObserver(() => {
    try {
      const buttonsContainer = getButtonContainer();
      emplaceButton(buttonsContainer, consola);
    } catch (e) {
      consola.error(e);
    }
  });
}

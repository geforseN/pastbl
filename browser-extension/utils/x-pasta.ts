const ID = "pasta-actions";

export function tryRemovePastaActionsElement() {
  const old = document.querySelector("#" + ID);
  if (old) {
    old.remove();
  }
}

export function createButtonsContainer({ left, top, buttons }: {
  left: string;
  top: string;
  buttons: HTMLButtonElement[];
}) {
  const container = document.createElement("div");
  container.id = ID;
  container.style.width = "auto";
  container.style.height = "auto";
  container.style.backgroundColor = "black";
  container.style.position = "absolute";
  container.style.left = left;
  container.style.top = top;
  container.style.zIndex = "99999";
  for (const button of buttons) {
    container.append(button);
  }
  return container;
}

export function createActionButton({ textContent, classes, onClick }: {
  textContent: string;
  classes: string[];
  onClick: (this: HTMLButtonElement, event: Event) => void;
}) {
  const button = document.createElement("button");
  button.classList.add(...classes);
  button.textContent = textContent;
  button.addEventListener("click", onClick);
  return button;
}

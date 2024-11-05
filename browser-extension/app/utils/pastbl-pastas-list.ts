import { ErrorWithContext } from "~/utils/error-with-context";

export function getCoords(event: PointerEvent) {
  const pastasListElement = event.currentTarget;
  if (!(pastasListElement instanceof Element)) {
    throw new TypeError("event.currentTarget is not an Element");
  }
  const listRect = pastasListElement.getBoundingClientRect();
  const coords = {
    x: event.clientX - listRect.left,
    y: event.clientY - listRect.top,
  };
  return coords;
}

export function findPasta(target: HTMLElement) {
  const element = findPastaElement(target);
  const index = findPastaIndex(element);
  const pasta = pastas.value.at(index);
  if (!pasta) {
    throw new Error(`Pasta with index=${index} not found`);
  }
  return pasta;
}

function findPastaIndex(target: HTMLElement) {
  const pastaElement = findPastaElement(target);
  const number = Number(pastaElement.dataset.pastaIndex);
  if (!Number.isInteger(number)) {
    throw new TypeError(`number=${number} is not an integer`);
  }
  return number;
}

function findPastaElement(target: HTMLElement) {
  const pastaElement = target.dataset.pastaIndex
    ? target
    : target.closest("[data-pasta-index]");
  if (!pastaElement || !(pastaElement instanceof HTMLElement)) {
    throw new ErrorWithContext("No element found with selector \"[data-pasta-index]\"", {
      target,
    });
  }
  return pastaElement;
}

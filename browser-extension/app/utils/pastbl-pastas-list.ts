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
  const index = findPastaIndex(target);
  const pasta = $requirePastaAt(index);
  return pasta;
}

function findPastaIndex(target: HTMLElement) {
  const pastaElement = target.dataset.pastaIndex
    ? target
    : target.closest("[data-pasta-index]");
  if (!pastaElement || !(pastaElement instanceof HTMLElement)) {
    throw new ErrorWithContext("No element found with selector \"[data-pasta-index]\"", {
      target,
    });
  }
  const index = Number(pastaElement.dataset.pastaIndex);
  if (!Number.isInteger(index)) {
    throw new TypeError(`index=${index} is not an integer`);
  }
  return index;
}

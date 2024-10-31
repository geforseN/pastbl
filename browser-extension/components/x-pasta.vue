<template>
  <div
    class="px-2 py-1 text-2xl"
    @click="tryRemovePastaActionsElement"
    @contextmenu="onContextMenu"
  >
    {{ text }}
  </div>
</template>
<script setup lang="ts">
import type { XPasta } from "@/utils/pastas.store";

defineProps<XPasta>();

const emit = defineEmits<{
  copy: [];
  send: [];
}>();

const ID = "pasta-actions";

function tryRemovePastaActionsElement() {
  const old = document.querySelector("#" + ID);
  if (old) {
    old.remove();
  }
}

function createButtonsContainer({ left, top, buttons }: {
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

function createActionButton({ textContent, classes, onClick }: {
  textContent: string;
  classes: string[];
  onClick: (this: HTMLButtonElement, event: Event) => void;
}) {
  const button = document.createElement("button");
  button.classList.add("btn", "text-2xl", ...classes);
  button.textContent = textContent;
  button.addEventListener("click", onClick);
  return button;
}

function createPastaActionsElement(event: PointerEvent) {
  tryRemovePastaActionsElement();
  const container = createButtonsContainer({
    left: `${event.pageX}px`,
    top: `${event.pageY}px`,
    buttons: [
      createActionButton({
        textContent: "copy",
        classes: ["btn", "text-2xl", "btn-secondary"],
        onClick() {
          emit("copy");
          container.remove();
          // copyPastaButton.removeEventListener("click", copyPastaButtonListener);
        },
      }),
      createActionButton({
        textContent: "send",
        classes: ["btn", "text-2xl", "btn-primary"],
        onClick() {
          emit("send");
          container.remove();
          // sendPastaButton.removeEventListener("click", sendPastaButtonListener);
        },
      }),
    ],
  });
  return container;
}

function onContextMenu(event: Event) {
  if (!(event instanceof PointerEvent)) {
    throw new TypeError("event must be a PointerEvent");
  }
  event.preventDefault();
  const pastaActionsElement = createPastaActionsElement(event);
  document.body.append(pastaActionsElement);
}
</script>
<style scoped>
div {
  border: 1px solid black;
  border-bottom: none;
}

div:last-child {
  border-bottom: 1px solid black;
}
</style>

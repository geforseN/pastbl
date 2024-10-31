<template>
  <div
    class="border border-b-0 px-2 py-1 text-base last:border-b"
    @click="tryRemovePastaActionsElement"
    @contextmenu="onContextMenu"
  >
    {{ nickname }}: {{ text }}
  </div>
</template>
<script setup lang="ts">
import type { XPasta } from "@/utils/pastas.store";

const nickname = inject("nickname", "geforsen");

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

function createPastaActionsElement(event: PointerEvent) {
  tryRemovePastaActionsElement();
  const container = document.createElement("div");
  container.id = ID;
  container.style.width = "auto";
  container.style.height = "auto";
  container.style.backgroundColor = "black";
  container.style.position = "absolute";
  container.style.left = `${event.pageX}px`;
  container.style.top = `${event.pageY}px`;
  container.style.zIndex = "99999";
  const copyPastaButton = document.createElement("button");
  copyPastaButton.classList.add("btn", "btn-xs", "btn-secondary");
  copyPastaButton.textContent = "copy";
  function copyPastaButtonListener() {
    emit("copy");
    container.remove();
    copyPastaButton.removeEventListener("click", copyPastaButtonListener);
  }
  copyPastaButton.addEventListener("click", copyPastaButtonListener);
  container.append(copyPastaButton);
  const sendPastaButton = document.createElement("button");
  sendPastaButton.classList.add("btn", "btn-xs", "btn-primary");
  sendPastaButton.textContent = "send";
  function sendPastaButtonListener() {
    emit("send");
    container.remove();
    sendPastaButton.removeEventListener("click", sendPastaButtonListener);
  }
  sendPastaButton.addEventListener("click", sendPastaButtonListener);
  container.append(sendPastaButton);
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

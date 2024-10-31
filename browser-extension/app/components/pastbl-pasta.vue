<template>
  <div
    class="px-2 py-1 text-2xl"
    @click="tryRemovePastaActionsElement"
    @contextmenu="onContextMenu"
  >
    {{ text }}
  </div>
</template>
<!-- TODO: move logic to parent, reuse context menu actions -->
<!-- FIXME: close actions on <pastbl-rounded-button /> press -->
<script setup lang="ts">
import type { XPasta } from "~/utils/pastas.store";
import {
  createActionButton,
  createButtonsContainer,
  tryRemovePastaActionsElement,
} from "~/utils/x-pasta";

defineProps<XPasta>();

const emit = defineEmits(["copy", "send"]);

function createPastaActionsElement(event: PointerEvent) {
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
        },
      }),
      createActionButton({
        textContent: "send",
        classes: ["btn", "text-2xl", "btn-primary"],
        onClick() {
          emit("send");
          container.remove();
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
  tryRemovePastaActionsElement();
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

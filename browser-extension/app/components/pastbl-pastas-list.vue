<template>
  <div
    class="flex h-full flex-col overflow-x-auto"
    @contextmenu="onContextMenu"
  >
    <pastbl-pasta
      v-for="(pasta, index) in pastas"
      :key="pasta.id"
      :data-pasta-index="index"
      v-bind="pasta"
    />
  </div>
</template>
<script setup lang="ts">
import type { XPasta } from "~/utils/pastas.store";
import PastblPasta from "~/components/pastbl-pasta.vue";
import { findPasta, getCoords } from "@/utils/pastbl-pastas-list";

defineProps<{
  pastas: XPasta[];
}>();

const emit = defineEmits<{
  showActions: [pasta: XPasta, coords: { x: number; y: number }];
}>();

function onContextMenu(event: Event) {
  if (!(event instanceof PointerEvent)) {
    throw new TypeError("event must be a PointerEvent instance");
  }
  event.preventDefault();
  if (!(event.target instanceof HTMLElement)) {
    throw new TypeError("event.target is not an HTMLElement");
  }
  const pasta = findPasta(event.target);
  const coords = getCoords(event);
  emit("showActions", pasta, coords);
}
</script>

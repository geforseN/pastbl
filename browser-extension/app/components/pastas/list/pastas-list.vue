<template>
  <div
    ref="container"
    :class="remotePastas.isLoading && loadingClass"
    class="flex flex-col divide-y overflow-y-auto border bg-base-100 text-base-content"
    @contextmenu="onContextMenu"
  >
    <list-pasta
      v-for="(pasta, index) in pastas"
      :key="pasta.id"
      class="border-r"
      :data-pasta-index="index"
      v-bind="pasta"
    />
  </div>
</template>
<script setup lang="ts">
import type { XPasta } from "~/utils/pastas.store";
import type { Nullish } from "~/utils/types";
import { findPasta, getCoords } from "~/utils/pastbl-pastas-list";
import { useInfiniteRemotePastas } from "~/composables/useInfiniteRemotePastas";
import ListPasta from "~/components/pastas/list/list-pasta.vue";

const props = defineProps<{
  pastas: XPasta[];
  cursor: Nullish<number>;
  loadMore: (cursor: Nullish<number>) => Promise<{ pastas: XPasta[]; cursor: number | null }>;
  loadingClass?: string;
}>();

const emit = defineEmits<{
  showActions: [pasta: XPasta, coords: { x: number; y: number }];
  response: [response: { pastas: XPasta[]; cursor: number | null }, container: HTMLElement | null];
}>();

const containerRef = useTemplateRef("container");

onMounted(() => {
  if (!containerRef.value) {
    throw new Error("container is null");
  }
  containerRef.value.scrollTop = containerRef.value.scrollHeight;
});
const remotePastas = reactive(
  useInfiniteRemotePastas(
    containerRef,
    () => props.cursor,
    (response) => emit("response", response, toValue(containerRef)),
    async (...args: Parameters<typeof props.loadMore>) => await props.loadMore(...args),
    {
      direction: "top",
    },
  ),
);

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

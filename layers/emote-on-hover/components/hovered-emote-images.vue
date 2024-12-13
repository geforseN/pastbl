<template>
  <div
    ref="container"
    data-testid="hovered-emote-images-container"
    class="flex w-max max-w-xs items-center gap-1 overflow-x-auto p-1 scrollbar"
    @wheel.passive="scrollHorizontalIfNeeded"
  >
    <template
      v-for="image of emote.images.value"
      :key="image.src"
    >
      <img
        data-testid="hovered-emote-image"
        :src="image.src"
        :width="image.width"
        :height="image.height"
        :alt="image.alt"
        class="bg-base-200"
        loading="lazy"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { watchEffect, useTemplateRef } from "vue";
import type { Ref } from "vue";
import type { EmoteOnHover } from "../utils/emote-on-hover";
import { log } from "../../../shared/utils/dev-only";
import { waitImageLoaded } from "../../../app/utils/dom";

async function onContainerUpdate(containerRef: Ref<HTMLElement | null>) {
  if (!(containerRef.value instanceof HTMLElement)) {
    return;
  }
  const images = [...containerRef.value.querySelectorAll("img")];
  await Promise.all(images.map(waitImageLoaded));
  const container = containerRef.value;
  log("debug", "<hovered-emote-images> onContainerUpdate", {
    scrollWidth: container.scrollWidth,
    offsetWidth: container.offsetWidth,
  });
  const shouldScrollToCenter = container.scrollWidth > container.offsetWidth;
  if (shouldScrollToCenter) {
    const left = (container.scrollWidth - container.offsetWidth) / 2;
    container.scrollBy({ left });
  }
}
</script>
<script setup lang="ts">
defineProps<{
  emote: InstanceType<typeof EmoteOnHover>;
}>();

const containerRef = useTemplateRef("container");

watchEffect(() => {
  onContainerUpdate(containerRef);
});

function scrollHorizontalIfNeeded(event: WheelEvent) {
  if (event.shiftKey || !containerRef.value) {
    // images container can have horizontal scroll and should not have vertical scroll
    // when scrolling with shift key (horizontal scroll change) then just use mouse wheel default behavior
    return;
  }
  // overriding default behavior, scrolling horizontally when supposed to be vertical
  containerRef.value.scrollBy({ left: event.deltaY / 6 });
}
</script>

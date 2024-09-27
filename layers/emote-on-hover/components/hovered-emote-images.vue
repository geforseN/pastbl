<template>
  <div
    ref="container"
    class="flex w-max max-w-xs items-center gap-1 overflow-x-auto p-1 scrollbar"
    @wheel.passive="scrollHorizontalIfNeeded"
  >
    <template
      v-for="image of emote.images.value"
      :key="image.src"
    >
      <img
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
<script setup lang="ts">
defineProps<{
  emote: InstanceType<typeof EmoteOnHover>;
}>();

const containerRef = useTemplateRef("container");

watchEffect(() => {
  // FIXME: on first call scrollWidth and offsetWidth always same (even ixf supposed to be different)
  // TODO: add tests for this
  onContainerUpdate(containerRef.value);
});

function onContainerUpdate(container: HTMLElement | null) {
  if (!(container instanceof HTMLElement)) {
    return;
  }
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

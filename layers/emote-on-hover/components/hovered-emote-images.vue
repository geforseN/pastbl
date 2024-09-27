<template>
  <div
    :ref="onContainerUpdate"
    class="flex w-max max-w-xs items-center gap-1 overflow-x-auto p-1 scrollbar"
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
<script setup>
defineProps<{
  emote: InstanceType<typeof EmoteOnHover>;
}>();

async function onContainerUpdate(container: unknown) {
  if (!(container instanceof HTMLElement)) {
    return;
  }
  await nextTick();
  const hasScrollWidth = container.scrollWidth > container.offsetWidth;
  if (hasScrollWidth) {
    const scrollLeft = container.scrollWidth / 2 - container.offsetWidth / 2;
    // scroll to center
    container.scrollLeft += scrollLeft;
  }
}
</script>

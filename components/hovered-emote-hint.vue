<template>
  <div
    ref="hoveredEmoteContainerRef"
    class="pointer-events-none absolute z-50 touch-none"
  >
    <div
      v-if="emote_"
      class="flex flex-col items-center gap-1 rounded-lg border bg-base-100 p-2"
    >
      <div class="flex items-center gap-1 p-1">
        <template v-for="image of images" :key="image">
          <img
            :src="image.src"
            :width="image.width"
            :height="image.height"
            :alt="image.alt"
            loading="lazy"
          />
        </template>
      </div>
      <div class="flex items-baseline text-lg">
        <span class="text-xl font-bold">{{ emote_.token }}</span>
        &nbsp;{{ "-" }}&nbsp;
        <div class="flex items-baseline">
          <emote-integration-logo
            :source="emote_.source"
            width="20"
            class="h-min self-center"
          />&nbsp;{{ emote_.source }}&nbsp;{{ emote_.type }}&nbsp;emote
        </div>
      </div>
      <dev-only>
        <div class="flex gap-1 text-yellow-400">
          <span v-if="emote_.isAnimated">animated</span>
          <span v-if="emote_.isListed">listed</span>
          <span v-if="emote_.isModifier">modifier</span>
          <span v-if="emote_.isWrapper">wrapper</span>
        </div>
      </dev-only>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IEmote } from "~/integrations";

const props = defineProps<{
  emote?: Nullish<IEmote>;
}>();

const hoveredEmoteContainerRef = ref<HTMLDivElement>();

defineExpose({
  hoveredEmoteContainerRef,
});

const emote_ = computed(() => props.emote && new Emote({ ...props.emote }));

const images = computed(() => {
  const emote = emote_.value;
  if (!emote) {
    return [];
  }
  const sizes = [1, 2, 3, 4] as const;
  return sizes
    .filter((size) => emote.canHaveSize(size))
    .map((size) => {
      return {
        size,
        src: emote.url.withSizeOf(size),
        width: emote.width.multiplyBy(size).value,
        height: emote.height.multiplyBy(size).value,
        alt: emote.token,
      };
    });
});
</script>

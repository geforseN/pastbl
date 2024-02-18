<template>
  <div
    ref="hoveredEmoteContainerRef"
    class="pointer-events-none absolute z-50 touch-none bg-slate-600"
  >
    <div v-if="emote_" class="flex flex-col">
      <div class="flex items-center gap-1">
        <img
          :src="emote_.url.withSizeOf(1)"
          :width="emote_.width.value"
          :height="emote_.height.value"
          :alt="emote_.token"
        />
        <img
          :src="emote_.url.withSizeOf(2)"
          :width="emote_.width.multiplyBy(2).value"
          :height="emote_.height.multiplyBy(2).value"
          :alt="emote_.token"
        />
        <img
          v-if="emote_.canHaveSize(3)"
          :src="emote_.url.withSizeOf(3)"
          :width="emote_.width.multiplyBy(3).value"
          :height="emote_.height.multiplyBy(3).value"
          :alt="emote_.token"
        />
        <img
          v-if="emote_.canHaveSize(4)"
          :src="emote_.url.withSizeOf(4)"
          :width="emote_.width.multiplyBy(4).value"
          :height="emote_.height.multiplyBy(4).value"
          :alt="emote_.token"
        />
      </div>
      {{ emote_.token }}
      {{ emote_.source }}
      {{ emote_.type }}
      <span v-if="emote_.isAnimated">animated</span>
      <span v-if="emote_.isListed">listed</span>
      <span v-if="emote_.isModifier">modifier</span>
      <span v-if="emote_.isWrapper">wrapper</span>
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
</script>

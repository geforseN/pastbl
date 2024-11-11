<template>
  <!-- w-8 -->
  <!-- eslint-disable tailwindcss/no-custom-classname -->
  <span
    :class="props.flat ? 'flex-row items-center': 'flex-col'"
    class="main inline-flex gap-1"
  >
    <emote-integration-logo
      v-for="(source, index) of sources_"
      :key="source"
      :class="props.flat ? null : [
        index % 2 && `translate-to-right absolute`,
        index === 3 && 'translate-to-bottom',
      ]"
      :source="source"
      :width="width_"
      :height="height_"
      class="max-h-[16px] text-xs"
    />
  </span>
  <!-- eslint-enable tailwindcss/no-custom-classname -->
</template>
<script setup lang="ts">
const props = defineProps<{
  width?: number;
  height?: number;
  size?: number;
  sources?: EmoteSource[];
  flat?: boolean;
}>();

const sources_ = computed(() => "sources" in props && Array.isArray(props.sources)
  ? props.sources
  : [...allEmoteSources],
);

const hasValidSizeProp = computed(() => "size" in props && typeof props.size === "number");

const width_ = computed(() => hasValidSizeProp.value ? props.size! : props.width ?? 16);
const height_ = computed(() => hasValidSizeProp.value ? props.size! : props.height ?? 16);

const translateY = computed(() => `${height_.value + 4}px`);
const translateX = computed(() => `${width_.value + 4}px`);

const minWidth = computed(() => {
  const multiplier = props.flat
    ? sources_.value.length
    : Math.ceil(sources_.value.length / 2);
  return `${width_.value * multiplier}px`;
});
</script>
<style scoped>
.container {
  min-width: v-bind(minWidth);
}

.translate-to-right {
  --translate-x: v-bind(translateX);
  transform: translate(var(--translate-x, 0), var(--translate-y, 0));
}

.translate-to-bottom {
  --translate-y: v-bind(translateY);
  transform: translate(var(--translate-x, 0), var(--translate-y, 0));
}
</style>

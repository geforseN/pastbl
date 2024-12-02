<template>
  <div
    class="-mb-0.5 mt-0.5 inline-flex flex-wrap gap-0.5 px-1 py-0.5"
  >
    <clamped-pasta-tag
      v-for="tag of tags_"
      :key="tag"
      :tag
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import ClampedPastaTag from "../../clamped-pasta-tag/clamped-pasta-tag.vue";

const { shouldSort = true, tags } = defineProps<{
  tags: string[];
  shouldSort?: boolean;
}>();

const tags_ = computed(() => {
  if (shouldSort) {
    return [...tags].sort((a, b) => a.localeCompare(b));
  }
  return tags;
});
</script>

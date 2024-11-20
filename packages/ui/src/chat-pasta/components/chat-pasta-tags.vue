<template>
  <div
    class="-mb-0.5 mt-0.5 inline-flex flex-wrap gap-0.5"
  >
    <clamped-pasta-tag
      v-for="tag of tags"
      :key="tag"
      :tag
      :data-pasta-tag="tag"
    />
  </div>
</template>
<script setup lang="ts">
import ClampedPastaTag from "../../clamped-pasta-tag.vue";

defineProps<{
  tags: string[];
}>();
</script>

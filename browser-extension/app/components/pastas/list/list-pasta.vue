<template>
  <div class="flex flex-col px-2 py-1 text-2xl">
    <span class="text-[1.3rem]">{{ text }}</span>
    <div
      v-if="tags.length > 0"
      class="-mb-0.5 mt-0.5 inline-flex flex-wrap gap-0.5"
    >
      <pasta-tag
        v-for="tag in tags.map(tag => tag.value)"
        :key="tag"
        :tag
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import PastaTag from "~/components/pastas/pasta-tag.vue";
import type { XPasta } from "~/utils/pastas.store";

defineProps<XPasta>();
</script>

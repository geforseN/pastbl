<template>
  <div class="flex flex-col px-2 py-1 text-2xl">
    <span class="text-[1.3rem]">{{ text }}</span>
    <div
      v-if="tags.length > 0"
      class="-mb-0.5 mt-0.5 inline-flex flex-wrap gap-0.5"
    >
      <div
        v-for="tag in tags.map(tag => tag.value)"
        :key="tag"
        class="line-clamp-2 w-fit break-all rounded-lg bg-info px-1 py-0.5 text-info-content"
        :class="tag.startsWith('@') && 'bg-twitch-accent'"
      >
        {{ tag }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { XPasta } from "~/utils/pastas.store";

defineProps<XPasta>();
</script>

<template>
  <div
    class="rounded-lg bg-info px-1 py-0.5 text-info-content"
    :class="[
      tag.startsWith('@') && 'bg-twitch-accent',
      clamped && 'line-clamp-2 w-fit break-all',
    ]"
    data-testid="pasta-tag"
  >
    {{ tag }}
  </div>
</template>
<script setup lang="ts">
import type { PastaTagProps } from "./pasta-tag";

const {
  clamped = false,
} = defineProps<PastaTagProps & {
  clamped?: boolean;
}>();
</script>

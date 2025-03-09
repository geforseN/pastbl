<template>
  <div
    class="bg-info text-info-content rounded-lg px-1 py-0.5"
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

<template>
  <div
    class="rounded-lg bg-info px-1 py-0.5 text-info-content"
    :class="tag.startsWith('@') && 'bg-twitch-accent'"
    data-testid="pasta-tag"
  >
    {{ tag }}
  </div>
</template>
<script setup lang="ts">
import type { PastaTagProps } from "./pasta-tag";

defineProps<PastaTagProps>();
</script>

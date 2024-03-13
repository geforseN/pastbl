<template>
  <div
    class="rounded-lg bg-info px-1 py-0.5 text-sm text-info-content"
    :class="props.tag.startsWith('@') && 'bg-twitch-accent'"
  >
    {{ props.tag }}
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ tag: string }>();
</script>

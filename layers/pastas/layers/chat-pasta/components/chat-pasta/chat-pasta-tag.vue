<template>
  <div
    class="rounded-lg bg-info px-1 py-0.5 text-sm text-info-content"
    :class="tag.startsWith('@') && 'bg-twitch-accent'"
    data-testid="chat-pasta-tag"
  >
    {{ tag }}
  </div>
</template>
<script setup lang="ts">
defineProps<{
  tag: string;
}>();
</script>

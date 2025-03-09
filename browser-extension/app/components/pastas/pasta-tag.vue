<template>
  <div
    class="bg-info text-info-content line-clamp-2 w-fit break-all rounded-lg px-1 py-0.5"
    :class="tag.startsWith('@') && 'bg-twitch-accent'"
  >
    {{ tag }}
  </div>
</template>
<script setup lang="ts">
defineProps<{
  tag: string;
}>();
</script>

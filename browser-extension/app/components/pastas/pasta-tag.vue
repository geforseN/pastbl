<template>
  <div
    class="line-clamp-2 w-fit break-all rounded-lg bg-info px-1 py-0.5 text-info-content"
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

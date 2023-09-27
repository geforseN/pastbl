<template>
  <textarea
    v-model="input"
    class="w-80 h-96 bg-[#18181b] focus-within:outline-[#a970ff] focus-within:outline-offset-0 focus-within:outline-4 text-[#efeff1] textarea leading-3 rounded"
  />
</template>
<script setup lang="ts">
const { input } = defineProps<{ input: string }>();
</script>

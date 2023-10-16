<template>
  <header class="flex gap-x-2 p-1 text-xl font-medium">
    <slot />
    <div class="ml-auto"></div>
    <span class="loading" v-if="props.isLoading" />
    <span v-if="props.isReady">✅</span>
    <span v-if="props.isError">❌</span>
    <slot name="collection-logo" />
  </header>
</template>

<script lang="ts" setup>
const props = defineProps<{
  isLoading: boolean;
  isReady: boolean;
  isError: boolean;
}>();

defineSlots<{
  default: () => any;
  "collection-logo": () => any;
}>();
</script>

<style></style>

<template>
  <header class="flex gap-x-2 text-xl font-medium">
    <slot />
    <div class="ml-auto"></div>
    <span v-if="props.isLoading" class="loading" />
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
  default: () => unknown;
  "collection-logo": () => unknown;
}>();
</script>

<style></style>

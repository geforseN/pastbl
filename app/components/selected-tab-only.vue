<template>
  <template v-if="selectedTab.key === $props.for">
    <slot />
  </template>
</template>
<script setup lang="ts">
import type { TabItem } from "#ui/types/tabs";

defineProps<{
  selectedTab: TabItem;
  for: string;
}>();
</script>

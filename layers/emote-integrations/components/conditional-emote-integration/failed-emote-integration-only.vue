<template>
  <slot
    v-if="status === 'failed'"
    :integration="$props as TEmoteIntegrations.Failed"
  />
</template>
<script setup lang="ts">
defineProps<TEmoteIntegrations.__Some__>();

defineSlots<{
  default: VueSlot<{
    integration: TEmoteIntegrations.Failed;
  }>;
}>();
</script>

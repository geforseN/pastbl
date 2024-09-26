<template>
  <slot
    v-if="status === 'ready'"
    :integration="$props as TEmoteIntegrations.Ready"
  />
</template>
<script setup lang="ts">
defineProps<TEmoteIntegrations.__Some__>();

defineSlots<{
  default: VueSlot<{
    integration: TEmoteIntegrations.Ready;
  }>;
}>();
</script>

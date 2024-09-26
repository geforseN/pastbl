<template>
  <slot
    v-if="status === 'ready'"
    :integration="$props as TEmoteIntegrations.Ready"
  />
</template>
<script setup>
import type { TEmoteIntegrations } from "$/emote-integrations";

defineProps<TEmoteIntegrations.__Some__>();

defineSlots<{
  default: VueSlot<{
    integration: TEmoteIntegrations.Ready;
  }>;
}>();
</script>

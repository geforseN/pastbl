<template>
  <slot
    v-if="status === 'failed'"
    :integration="$props as TEmoteIntegrations.Failed"
  />
</template>
<script setup lang="ts">
import type { TEmoteIntegrations } from "$/emote-integrations";

defineProps<TEmoteIntegrations.__Some__>();

defineSlots<{
  default: VueSlot<{
    integration: TEmoteIntegrations.Failed;
  }>;
}>();
</script>

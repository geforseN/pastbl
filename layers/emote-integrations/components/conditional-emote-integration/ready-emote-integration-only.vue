<template>
  <slot
    v-if="integration.status === 'ready'"
    :integration
  />
</template>
<script setup lang="ts">
import type { TEmoteIntegrations } from "$/emote-integrations";

const integration = inject("integration") as TEmoteIntegrations.__Some__;

defineSlots<{
  default: VueSlot<{
    integration: TEmoteIntegrations.Ready;
  }>;
}>();
</script>

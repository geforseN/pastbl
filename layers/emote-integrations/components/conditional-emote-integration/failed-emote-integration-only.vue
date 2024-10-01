<template>
  <slot
    v-if="integration.status === 'failed'"
    :integration
  />
</template>
<script setup lang="ts">
import type { TEmoteIntegrations } from "$/emote-integrations";

const integration = injectEmoteIntegration();

defineSlots<{
  default: VueSlot<{
    integration: TEmoteIntegrations.Failed;
  }>;
}>();
</script>

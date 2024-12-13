<template>
  <slot
    v-if="integration.status === 'ready'"
    :integration
  />
</template>
<script setup lang="ts">
import type { Slot as VueSlot } from "vue";
import { injectEmoteIntegration } from "../../utils/provide-inject";
import type { TEmoteIntegrations } from "$/emote-integrations/index.ts";

const integration = injectEmoteIntegration();

defineSlots<{
  default: VueSlot<{
    integration: TEmoteIntegrations.Ready;
  }>;
}>();
</script>

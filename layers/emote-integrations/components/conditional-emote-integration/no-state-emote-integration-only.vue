<template>
  <slot
    v-if="integration.status === 'failed' || integration.status === 'loading'"
    :integration
    :is-loading
  />
</template>
<script setup lang="ts">
import type { TEmoteIntegrations } from "$/emote-integrations/index.ts";

const integration = injectEmoteIntegration();

function isLoading(
  integration:
    | TEmoteIntegrations.Failed
    | Extract<TEmoteIntegrations.__Some__, { status: "loading" }>,
): integration is Extract<TEmoteIntegrations.__Some__, { status: "loading" }> {
  return integration.status === "loading";
}

defineSlots<{
  default: VueSlot<{
    integration:
      | TEmoteIntegrations.Failed
      | Extract<TEmoteIntegrations.__Some__, { status: "loading" }>;
    isLoading: typeof isLoading;
  }>;
}>();
</script>

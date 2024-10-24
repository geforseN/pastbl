<template>
  <slot
    v-if="integration.status === 'ready' || integration.status === 'refreshing'"
    :integration
    :is-refreshing
  />
</template>
<script setup lang="ts">
import type { TEmoteIntegrations } from "$/emote-integrations/index.ts";

const integration = injectEmoteIntegration();

function isRefreshing(
  integration:
    | TEmoteIntegrations.Ready
    | Extract<TEmoteIntegrations.__Some__, { status: "refreshing" }>,
): integration is Extract<
  TEmoteIntegrations.__Some__,
  { status: "refreshing" }
> {
  return integration.status === "refreshing";
}

defineSlots<{
  default: VueSlot<{
    integration:
      | TEmoteIntegrations.Ready
      | Extract<TEmoteIntegrations.__Some__, { status: "refreshing" }>;
    isRefreshing: typeof isRefreshing;
  }>;
}>();
</script>

<template>
  <slot
    v-if="status === 'ready' || status === 'refreshing'"
    :integration="
      $props as
        | TEmoteIntegrations.Ready
        | Extract<TEmoteIntegrations.__Some__, { status: 'refreshing' }>
    "
    :is-refreshing
  />
</template>
<script setup>
import type { TEmoteIntegrations } from "$/emote-integrations";

defineProps<TEmoteIntegrations.__Some__>();

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

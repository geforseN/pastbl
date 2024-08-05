<template>
  <slot
    v-if="status === 'failed' || status === 'loading'"
    :integration="
      $props as
        | TEmoteIntegrations.Failed
        | Extract<TEmoteIntegrations.__Some__, { status: 'loading' }>
    "
    :is-loading
  />
</template>
<script setup lang="ts">
import type { TEmoteIntegrations } from "$/emote-integrations";

defineProps<TEmoteIntegrations.__Some__>();

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

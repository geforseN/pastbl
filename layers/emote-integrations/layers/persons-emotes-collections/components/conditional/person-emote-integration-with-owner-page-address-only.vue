<template>
  <div>
    <slot
      v-if="pageAddress"
      :integration
      :page-address
    />
    <slot
      v-else
      name="else"
    />
  </div>
</template>
<script setup lang="ts">
const integration = injectEmoteIntegration();

const pageAddress = computed(() =>
  // @ts-expect-error this is valid, no need long expression
  integration?.owner?.pageAddress,
);

defineSlots<{
  default: VueSlot<{
    integration: TEmoteIntegrations.__Some__;
    pageAddress: string;
  }>;
  else: VueSlot;
}>();
</script>

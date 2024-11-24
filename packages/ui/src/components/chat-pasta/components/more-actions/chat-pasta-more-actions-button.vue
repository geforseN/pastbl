<template>
  <bl-button
    data-testid="chat-pasta-more-actions-button"
    :class="[
      !$slots.default && 'flex items-center',
      twMerge('border-2 border-primary-content', $attrs.class as string | undefined),
    ]"
    v-bind="{
      ...props,
      tag: props.tag ?? 'div',
      variant: props.variant ?? 'primary',
    }"
  >
    <slot name="default">
      <span class="-translate-y-1 text-lg">...</span>
    </slot>
  </bl-button>
</template>
<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import BlButton, { type BlButtonProps } from "../../../bl-button/bl-button.vue";

const props = defineProps<BlButtonProps>();

defineSlots<{
  default: () => unknown;
}>();
</script>

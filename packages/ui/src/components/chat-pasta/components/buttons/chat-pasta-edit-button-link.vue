<template>
  <bl-button
    v-bind="{ ...props, variant: props.variant ?? 'info', tag: 'link' }"
  >
    <slot>
      Edit
    </slot>
  </bl-button>
</template>
<script setup lang="ts">
import BlButton, { type BlButtonProps } from "../../../button/bl-button.vue";

const props = defineProps<BlButtonProps & { to: string }>();
</script>

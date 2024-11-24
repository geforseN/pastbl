<template>
  <bl-button
    v-bind="{ ...props, variant: props.variant ?? 'error' }"
  >
    <slot>
      Remove
    </slot>
  </bl-button>
</template>
<script setup lang="ts">
import BlButton, { type BlButtonProps } from "../../../bl-button/bl-button.vue";

const props = defineProps<BlButtonProps>();
</script>

<template>
  <bl-button
    :class="[
      twMerge('border-2 border-accent-content', $attrs.class as string | undefined),
    ]"
    v-bind="{ ...props, variant: props.variant ?? 'accent' }"
  >
    Copy
  </bl-button>
</template>
<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import BlButton, { type BlButtonProps } from "../../../bl-button/bl-button.vue";

const props = defineProps<BlButtonProps>();
</script>

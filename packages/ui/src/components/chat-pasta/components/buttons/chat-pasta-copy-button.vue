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
import BlButton from "../../../bl-button/bl-button.vue";
import type { BlButtonProps } from "../../../bl-button/bl-button.ts";

const props = defineProps<BlButtonProps>();
</script>

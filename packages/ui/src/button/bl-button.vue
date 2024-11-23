<template>
  <button
    class="btn"
    :class="[
      sizeClasses[size],
      variant && variantClasses[variant],
      shape && shapeClasses[shape],
    ]"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { inject } from "vue";

const variantClasses = {
  neutral: "btn-neutral",
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  ghost: "btn-ghost",
  link: "btn-link",
  error: "btn-error",
  warning: "btn-warning",
  info: "btn-info",
  success: "btn-success",
};

const sizeClasses = {
  small: "btn-sm",
  medium: "btn-md",
  large: "btn-lg",
};

const shapeClasses = {
  square: "btn-square",
  circle: "btn-circle",
  wide: "btn-wide",
};

export interface BlButtonProps {
  size?: keyof typeof sizeClasses;
  shape?: keyof typeof shapeClasses;
  variant?: keyof typeof variantClasses;
}
</script>
<script setup lang="ts">
const {
  size = inject("size", "medium"),
  shape = inject("shape"),
  variant = inject("type"),
} = defineProps<BlButtonProps>();
</script>

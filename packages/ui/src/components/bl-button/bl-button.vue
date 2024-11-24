<template>
  <component
    :is="tag_"
    class="btn"
    :class="[
      sizeClasses[size],
      variant && variantClasses[variant],
      shape && shapeClasses[shape],
    ]"
    v-bind="{ ...attrs, ...$attrs }"
  >
    <slot />
  </component>
</template>
<script lang="ts">
import { computed, inject } from "vue";

const variantClasses = {
  neutral: "btn-neutral",
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  error: "btn-error",
  warning: "btn-warning",
  info: "btn-info",
  success: "btn-success",
};

const sizeClasses = {
  tiny: "btn-xs",
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
  tag?: "button" | "link" | "a" | "div" | "details";
  to?: string;
};
</script>
<script setup lang="ts">
const {
  size = inject("size", "medium"),
  shape = inject("shape", undefined),
  variant = inject("variant", undefined),
  tag = "button",
  to,
} = defineProps<BlButtonProps>();

const tag_ = computed(() => tag === "link" ? "a" : tag);

const attrs = computed(() => {
  if (tag === "a" || tag === "link") {
    return {
      href: to,
    } as const;
  }
  if (tag === "button" || tag === "details") {
    return {} as const;
  }
  if (tag !== "div" && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn("bl-button: unknown tag prop", { tag });
  }
  return {
    tabindex: "0",
    role: "button",
  } as const;
});
</script>

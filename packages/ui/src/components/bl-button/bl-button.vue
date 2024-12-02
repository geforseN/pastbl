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
<script setup lang="ts">
import { computed, inject } from "vue";
import {
  shapeClasses,
  sizeClasses,
  variantClasses,
  type BlButtonProps,
} from "./bl-button";

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

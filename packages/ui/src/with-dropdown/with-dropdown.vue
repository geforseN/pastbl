<template>
  <div
    class="dropdown"
    :class="[
      side === 'left' && 'dropdown-left',
      side === 'right' && 'dropdown-right',
      placement === 'top' && 'dropdown-top',
      placement === 'bottom' && 'dropdown-bottom',
      align === 'end' && 'dropdown-end',
      showOnHover && 'dropdown-hover',
    ]"
  >
    <slot name="default" />
    <slot name="content" />
  </div>
</template>
<script setup lang="ts">
const {
  side,
  placement,
  align,
  showOnHover = true,
} = defineProps<{
  side?: "left" | "right";
  placement?: "top" | "bottom";
  align?: "end";
  showOnHover?: boolean;
}>();

defineSlots<{
  default: () => unknown;
  content: () => unknown;
}>();
</script>

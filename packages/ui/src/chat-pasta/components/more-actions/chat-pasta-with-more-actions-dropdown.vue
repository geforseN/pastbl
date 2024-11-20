<template>
  <div
    data-testid="chat-pasta-with-more-actions-dropdown"
    class="dropdown"
    :class="[
      side === 'left' && 'dropdown-left',
      side === 'right' && 'dropdown-right',
      placement === 'top' && 'dropdown-top',
      placement === 'bottom' && 'dropdown-bottom',
      showOnHover && 'dropdown-hover',
    ]"
  >
    <slot />
    <slot name="content" />
  </div>
</template>
<script setup lang="ts">
const {
  side = "left",
  placement = "top",
  showOnHover = true,
} = defineProps<{
  side?: "left" | "right";
  placement?: "top" | "bottom";
  showOnHover?: boolean;
}>();
</script>

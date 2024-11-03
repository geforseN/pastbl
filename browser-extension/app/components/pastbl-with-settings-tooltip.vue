<template>
  <div
    class="tooltip tooltip-right absolute bottom-0 left-0 z-40 before:text-xl"
    data-tip="Settings"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import type { Slot } from "vue";

defineSlots<{
  default: Slot;
}>();
</script>

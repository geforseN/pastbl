<template>
  <div
    class="tooltip tooltip-right before:text-xl"
    data-tip="Settings"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  default: VueSlot;
}>();
</script>

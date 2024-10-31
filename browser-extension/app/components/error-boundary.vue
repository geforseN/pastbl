<template>
  <div>
    <slot v-if="!error" />
    <slot
      v-else
      name="error"
      :error
      :clear-error
    />
  </div>
</template>
<script setup lang="ts">
import type { Slot } from "vue";

const error = ref<Error>();

defineSlots<{
  default: Slot;
  error: Slot<{
    error: Error;
    clearError: () => void;
  }>;
}>();

onErrorCaptured((error_) => {
  error.value = error_;
  return false;
});

function clearError() {
  error.value = undefined;
}
</script>

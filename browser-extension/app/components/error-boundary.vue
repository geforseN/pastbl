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
const error = ref<Error>();

defineSlots<{
  default: VueSlot;
  error: VueSlot<{
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

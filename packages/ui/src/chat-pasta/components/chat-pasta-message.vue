<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <span
    class="chat-pasta__message"
    data-testid="chat-pasta-message"
  >
    {{ text }}
  </span>
</template>
<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>
<style scoped>
.chat-pasta-text {

}
</style>

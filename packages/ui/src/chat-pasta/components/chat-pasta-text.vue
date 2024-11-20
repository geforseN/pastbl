<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <span
    class="chat-pasta__text"
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

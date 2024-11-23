<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div
    class="chat-pasta__right-sidebar flex flex-col items-center justify-between gap-y-0.5 px-1 py-2"
    data-testid="chat-pasta-right-sidebar"
  >
    <chat-pasta-copy-button
      @click="$emit('copy')"
    />
    <!-- <chat-pasta-more-actions
      direction="horizontal"
      @remove="$emit('remove')"
      @edit="$emit('edit')"
    /> -->
  </div>
</template>
<script setup lang="ts">
import ChatPastaCopyButton from "./buttons/chat-pasta-copy-button.vue";

defineEmits<{
  copy: [];
  remove: [];
  edit: [];
}>();
</script>

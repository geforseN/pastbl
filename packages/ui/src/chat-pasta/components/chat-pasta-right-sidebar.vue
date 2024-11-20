<template>
  <div
    class="flex-col items-center justify-between gap-y-0.5 px-1 py-2"
    data-testid="chat-pasta__right-sidebar"
  >
    <chat-pasta-copy-button
      @click="$emit('copy')"
    />
    <chat-pasta-more-actions
      direction="horizontal"
      @remove="$emit('remove')"
      @edit="$emit('edit')"
    />
  </div>
</template>
<script setup lang="ts">
import ChatPastaCopyButton from "./buttons/chat-pasta-copy-button.vue";
import ChatPastaMoreActions from "./chat-pasta-more-actions.vue";

defineEmits<{
  copy: [];
  remove: [];
  edit: [];
}>();
</script>

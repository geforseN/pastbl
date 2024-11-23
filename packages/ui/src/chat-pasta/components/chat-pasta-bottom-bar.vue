<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div
    class="chat-pasta__bottom-bar flex"
    data-testid="chat-pasta__bottom-bar"
  >
    <chat-pasta-time v-bind="time" />
    <div
      v-if="compact"
      class="flex items-center gap-0.5"
    >
      <!--
    <chat-pasta-more-actions-button >
      <chat-pasta-more-actions />
    </chat-pasta-more-actions-button >
      -->
      <!-- <chat-pasta-more-actions
        :compact
        direction="horizontal"
        class="h-9 min-h-0"
        @remove="$emit('remove')"
        @edit="$emit('edit')"
      /> -->
      <chat-pasta-copy-button
        :compact
        class="h-9 min-h-0"
        @click="$emit('copy')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import ChatPastaTime from "./chat-pasta-time.vue";
import ChatPastaCopyButton from "./buttons/chat-pasta-copy-button.vue";

defineProps<{
  time: {
    label: string;
    value: string | number | Date;
  };
  compact?: boolean;
}>();

defineEmits<{
  remove: [];
  edit: [];
  copy: [];
}>();
</script>

<template>
  <div class="chat-pasta flex flex-col border border-secondary">
    <chat-pasta-main-data
      :tags
      :text
      @populate-text="(container) => $emit('populate', container)"
      @show-tag-context-menu="handleContextMenu"
    >
      <template #beforeColon>
        <slot name="creatorData" />
      </template>
      <template #bottom>
        <chat-pasta-created
          class="block123 hidden"
          :date="createdAt"
        />
      </template>
    </chat-pasta-main-data>
    <div class="remove123 flex justify-between p-1">
      <chat-pasta-created :date="createdAt" />
      <div class="flex items-center justify-between gap-0.5">
        <chat-pasta-more-actions />
        <chat-pasta-copy-button />
      </div>
    </div>
    <div
      class="actions123 hidden flex-col items-center justify-between gap-y-0.5 px-1 py-2"
    >
      <chat-pasta-copy-button @click="emit('copy')" />
      <chat-pasta-more-actions
        @remove="emit('remove')"
        @edit="emit('edit')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { OmegaPasta } from "~~/layers/pastas/layers/chat-pasta/utils/pasta";

defineProps<OmegaPasta>();

defineSlots<{
  creatorData: VueSlot;
}>();

const emit = defineEmits<{
  populate: [pastaTextContainer: HTMLElement];
  showTagContextMenu: [event: MouseEvent, tag: string];
  remove: [];
  copy: [];
  edit: [];
}>();

function handleContextMenu(event: MouseEvent) {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }
  const { pastaTag } = event.target.dataset;
  if (typeof pastaTag !== "string") {
    return;
  }
  event.preventDefault();
  emit("showTagContextMenu", event, pastaTag);
}
</script>
<style scoped>
:deep(.chat-pasta-emote) {
  display: inline;
  margin: -5px 0;
}
</style>

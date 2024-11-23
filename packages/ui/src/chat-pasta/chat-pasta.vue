<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div
    data-testid="chat-pasta"
    class="chat-pasta"
    :class="[
      compact && 'chat-pasta-compact',
    ]"
  >
    <div>
      <div
        class="chat-pasta__main"
      >
        <chat-pasta-chatter v-bind="chatter" />
        <span aria-hidden="true">{{ ": " }}</span>
        <chat-pasta-message :text />
      </div>
      <chat-pasta-tags
        v-if="tags.length > 0"
        :tags
      />
      <chat-pasta-bottom-bar
        :time
        :compact
      />
    </div>
    <chat-pasta-right-sidebar
      v-if="!compact"
    />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, type Slot } from "vue";
import ChatPastaMessage from "./components/chat-pasta-message.vue";
import ChatPastaTags from "./components/chat-pasta-tags.vue";
import ChatPastaBottomBar from "./components/chat-pasta-bottom-bar.vue";
import ChatPastaChatter, { type ChatPastaChatterProps } from "./components/chat-pasta-chatter.vue";

const ChatPastaRightSidebar = defineAsyncComponent(() => import("./components/chat-pasta-right-sidebar.vue"));

const { tags = [] } = defineProps<{
  text: string;
  time: {
    label: string;
    value: string | number | Date;
  };
  tags?: string[];
  compact?: boolean;
  chatter: ChatPastaChatterProps;
}>();

defineSlots<{
  creatorData: Slot;
}>();

defineEmits<{
  remove: [];
  copy: [];
  edit: [];
}>();
</script>
<style>
.chat-pasta {
  display: flex;
}

.chat-pasta-main {
  @apply w-[342px] border-b border-b-twitch-accent px-5 py-2
}
</style>

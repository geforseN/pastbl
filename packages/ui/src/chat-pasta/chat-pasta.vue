<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div
    data-testid="chat-pasta"
    :class="[
      bem.block,
      compact && 'chat-pasta-compact',
      twMerge('border border-secondary w-fit', attrs.class),
    ]"
  >
    <div
      :class="compact
        ? 'w-[340px]'
        : 'w-[341px] border-r border-r-twitch-accent'"
    >
      <div
        :class="bem.element('main')"
        class="border-b border-b-twitch-accent px-5 py-2"
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
<script lang="ts">
import { twMerge } from "tailwind-merge";
import { useAttrs, type Slot } from "vue";
import { withBem } from "../utils/bem" with { type: "macros" };
import ChatPastaMessage from "./components/chat-pasta-message.vue";
import ChatPastaTags from "./components/chat-pasta-tags.vue";
import ChatPastaBottomBar from "./components/chat-pasta-bottom-bar.vue";
import ChatPastaChatter, { type ChatPastaChatterProps } from "./components/chat-pasta-chatter.vue";
import ChatPastaRightSidebar from "./components/chat-pasta-right-sidebar.vue";

export interface ChatPastaProps {
  text: string;
  time: {
    label: string;
    value: string | number | Date;
  };
  tags?: string[];
  compact?: boolean;
  chatter: ChatPastaChatterProps;
}

export const bem = withBem("chat-pasta");
</script>
<script setup lang="ts">
const {
  tags = [],
} = defineProps<ChatPastaProps>();

const attrs: { class?: string } & Record<string, unknown> = useAttrs();

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
  @apply flex
}

.chat-pasta__main {
  overflow-wrap: anywhere;
}
</style>

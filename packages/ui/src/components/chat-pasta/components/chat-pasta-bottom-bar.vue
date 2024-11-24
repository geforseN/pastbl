<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div
    :class="[
      bem.element('bottom-bar'),
      twMerge('items-center flex justify-between gap-0.5 px-1 py-0.5', attrs.class),
    ]"
    data-testid="chat-pasta-bottom-bar"
  >
    <chat-pasta-time v-bind="time" />
    <div
      v-if="compact"
      class="flex items-center gap-0.5"
    >
      <with-dropdown
        placement="top"
        align="end"
      >
        <template #default>
          <chat-pasta-more-actions-button
            size="small"
          />
        </template>
        <template #content>
          <chat-pasta-more-actions-dropdown-content />
        </template>
      </with-dropdown>
      <chat-pasta-copy-button
        size="small"
        @click="$emit('copy')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { useAttrs } from "vue";
import WithDropdown from "../../with-dropdown/with-dropdown.vue";
import { bem } from "../chat-pasta.vue";
import ChatPastaTime from "./chat-pasta-time.vue";
import ChatPastaCopyButton from "./buttons/chat-pasta-copy-button.vue";
import {
  ChatPastaMoreActionsButton,
  ChatPastaMoreActionsDropdownContent,
} from "./more-actions/components";

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

const attrs: { class?: string } & Record<string, unknown> = useAttrs();
</script>

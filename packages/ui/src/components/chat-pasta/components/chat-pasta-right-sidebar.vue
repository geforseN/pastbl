<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div
    :class="[
      bem.element('right-sidebar'),
      twMerge('flex flex-col items-start justify-between gap-y-0.5 p-1', $attrs.class as string | undefined),
    ]"
    data-testid="chat-pasta-right-sidebar"
  >
    <chat-pasta-copy-button
      shape="square"
      @click="$emit('copy')"
    />
    <with-dropdown
      placement="top"
      align="end"
      side="left"
    >
      <chat-pasta-more-actions-button
        size="small"
        class="w-12"
      />
      <template #content>
        <chat-pasta-more-actions-dropdown-content />
      </template>
    </with-dropdown>
  </div>
</template>
<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { bem } from "../chat-pasta.ts";
import WithDropdown from "../../with-dropdown/with-dropdown.vue";
import ChatPastaCopyButton from "./buttons/chat-pasta-copy-button.vue";
import {
  ChatPastaMoreActionsButton,
  ChatPastaMoreActionsDropdownContent,
} from "./more-actions/components";

defineEmits<{
  copy: [];
  remove: [];
  edit: [];
}>();
</script>

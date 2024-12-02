<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <span
    :class="bem.element('message')"
    data-testid="chat-pasta-message"
  >
    {{ text }}
  </span>
</template>
<script setup lang="ts">
import { bem } from "../chat-pasta.ts";

defineProps<{
  text: string;
}>();
</script>

<template>
  <div>
    <div
      class="w-[342px] border-b border-twitch-accent px-5 py-2"
    >
      <slot name="nickname" />
      <span aria-hidden="true">{{ ": " }}</span>
      <chat-pasta-text :text />
    </div>
    <chat-pasta-tags :tags />
    <slot name="bottom" />
  </div>
</template>
<script setup lang="ts">
import type { Slot } from "vue";

defineProps<{
  text: string;
  tags: string[];
}>();

defineSlots<{
  nickname: Slot;
  bottom: Slot;
}>();
</script>
<style scoped>
.chat-pasta-text {
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin: 0px;
  padding: 0px;
  border: 0px;
  font-size: 13px;
  line-height: 20px;
  font-stretch: 100%;
  font-weight: 400;
  word-wrap: break-word;
  vertical-align: baseline;
  font-feature-settings: normal;
  font-style: normal;
  font-variant-alternates: normal;
  font-variant-caps: normal;
  font-variant-east-asian: normal;
  font-variant-ligatures: normal;
  font-variant-numeric: normal;
  font-variant-position: normal;
  font-variation-settings: normal;
  font-kerning: auto;
  font-optical-sizing: auto;
  tab-size: 8;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
}
</style>

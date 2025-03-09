<template>
  <div class="chat-pasta__main">
    <div
      class="chat-pasta__main-123 border-twitch-accent w-[342px] border-b px-5 py-2"
    >
      <slot name="beforeColon" />
      <span aria-hidden="true">{{ ": " }}</span>
      <span
        :ref="tryEmitPopulate"
        class="twitch-text chat-pasta-text"
      >
        {{ text }}
      </span>
    </div>
    <div
      v-if="tags.length > 0"
      class="-mb-0.5 mt-0.5 inline-flex flex-wrap gap-0.5"
      @contextmenu="$emit('showTagContextMenu', $event)"
    >
      <clamped-pasta-tag
        v-for="tag of tags"
        :key="tag"
        :tag
        :data-pasta-tag="tag"
      />
    </div>
    <slot name="bottom" />
  </div>
</template>
<script setup lang="ts">
import { ClampedPastaTag } from "$ui";

defineProps<{
  text: string;
  tags: string[];
}>();

const emit = defineEmits<{
  populateText: [container: HTMLElement];
  showTagContextMenu: [event: MouseEvent];
}>();

let isCalledOnce = false;
function tryEmitPopulate(element: unknown) {
  if (isCalledOnce) {
    return;
  }
  assert.ok(element instanceof HTMLElement);
  emit("populateText", element);
  isCalledOnce = true;
}

defineSlots<{
  beforeColon: VueSlot;
  bottom: VueSlot;
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

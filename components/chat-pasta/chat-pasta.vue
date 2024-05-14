<template>
  <div class="chat-pasta flex flex-col border border-secondary sm:flex-row">
    <div class="sm:p-2">
      <div class="w-[340px] border-b border-twitch-accent px-5 py-2 sm:border">
        <slot name="creatorData" />
        <span aria-hidden="true">{{ ": " }}</span>
        <span ref="pastaTextContainerRef" class="twitch-text chat-pasta-text">
          {{ text }}
        </span>
      </div>
      <div
        v-if="tags.length"
        class="-mb-0.5 mt-0.5 inline-flex flex-wrap gap-0.5"
        @contextmenu="handleContextMenu"
      >
        <chat-pasta-tag
          v-for="tag of tags"
          :key="tag"
          :tag="tag"
          :data-pasta-tag="tag"
          class="line-clamp-2 w-fit break-all"
        />
      </div>
      <chat-pasta-created-at class="hidden sm:block" :date="createdAt" />
    </div>
    <div class="flex justify-between p-1 sm:hidden">
      <chat-pasta-created-at :date="createdAt" />
      <div class="flex items-center justify-between gap-0.5">
        <chat-pasta-more-actions />
        <chat-pasta-copy-button />
      </div>
    </div>
    <div
      class="hidden flex-col items-center justify-between gap-y-0.5 px-1 py-2 sm:flex sm:px-0"
    >
      <chat-pasta-copy-button />
      <chat-pasta-more-actions />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { IDBMegaPasta } from "~/utils/pasta";

defineProps<IDBMegaPasta>();

defineSlots<{
  creatorData?: () => unknown;
  sidebar: () => unknown;
}>();

const emit = defineEmits<{
  populate: [pastaTextContainer: HTMLElement];
  showTagContextMenu: [event: MouseEvent, tag: string];
}>();

const isPopulateEmitCalledOnce = ref(false);

const pastaTextContainerRef = ref();

useIntersectionObserver(pastaTextContainerRef, ([entry]) => {
  if (!entry.isIntersecting || isPopulateEmitCalledOnce.value) {
    return;
  }
  assert.ok(entry.target instanceof HTMLElement);
  emit("populate", entry.target);
  isPopulateEmitCalledOnce.value = true;
});

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

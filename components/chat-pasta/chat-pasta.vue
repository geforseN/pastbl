<template>
  <!-- FIXME: 
    layout tags are bad
    e.g span which have 'block' class   
    most of this were just copied from twitch layout
    probably this can be refactored and visual regression wont happened
  -->
  <div
    class="chat-pasta flex flex-col gap-x-2 gap-y-1 border border-info p-2 xs:flex-row xs:gap-y-0"
  >
    <div class="flex w-[340px] flex-col">
      <span class="block grow border border-secondary">
        <span class="block w-full px-[10px] py-[5px]">
          <slot name="creatorData" />
          <span aria-hidden="true">{{ ": " }}</span>
          <span
            ref="pastaTextContainerRef"
            class="twitch-text p-0 text-[13px]/[18px]"
          >
            {{ props.pasta.text }}
          </span>
        </span>
      </span>
      <div
        v-if="props.pasta.tags.length !== 0"
        class="relative top-1 flex flex-wrap gap-x-1 gap-y-0.5"
      >
        <chat-pasta-tag
          v-for="tag of props.pasta.tags"
          :key="tag"
          :tag="tag"
          class="line-clamp-2 w-fit break-all"
        />
      </div>
      <div
        class="relative top-[3px] flex justify-between px-0.5"
        :title="new Date(props.pasta.createdAt).toString()"
      >
        <use-time-ago #="{ timeAgo }" :time="props.pasta.createdAt">
          <!-- FIXME: translate timeAgo -->
          <time>{{ $t("pasta.createdAt") }} {{ timeAgo }}</time>
        </use-time-ago>
        <time>{{ new Date(props.pasta.createdAt).toDateString() }}</time>
      </div>
    </div>
    <slot name="sidebar" />
  </div>
</template>
<script lang="ts" setup>
import { UseTimeAgo } from "@vueuse/components";

const props = defineProps<{ pasta: IDBMegaPasta }>();

defineSlots<{
  creatorData?: () => unknown;
  sidebar: () => unknown;
}>();

const emit = defineEmits<{
  populate: [pastaTextContainer: HTMLElement];
}>();

// NOTE: maybe no need isPopulateEmitCalledOnce ref
// maybe can use stop, pause, resume inside callback param
// isPopulateEmitCalledOnce MUST be ref, otherwise will be SSR bugs with pasta populate
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
</script>

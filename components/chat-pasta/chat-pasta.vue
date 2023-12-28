<template>
  <!-- FIXME: 
    layout tags are bad
    e.g span which have 'block' class   
    most of this were just copied from twitch layout
    probably this can be refactored and visual regression wont happened
  -->
  <div
    ref="pastaRef"
    class="flex flex-col gap-x-2 gap-y-1 border border-info p-2 xs:flex-row xs:gap-y-0"
  >
    <div class="flex w-[340px] flex-col">
      <span class="block grow border border-secondary">
        <span class="block w-full px-[10px] py-[5px]">
          <slot name="creatorData" />
          <span aria-hidden="true">{{ ": " }}</span>
          <span
            class="twitch-text p-0 text-[13px]/[18px]"
            :data-pasta-text-container="true"
          >
            {{ props.pasta.text }}
          </span>
        </span>
      </span>
      <div
        v-if="props.pasta.tags.length !== 0"
        class="relative top-1 flex flex-wrap gap-x-1 gap-y-0.5"
      >
        <div
          v-for="tag of props.pasta.tags"
          :key="tag"
          class="line-clamp-2 break-all rounded-lg bg-info px-1 py-0.5 text-sm text-info-content"
        >
          {{ tag }}
        </div>
      </div>
      <div
        class="relative top-[3px] flex justify-between px-0.5"
        :title="new Date(props.pasta.createdAt).toString()"
      >
        <use-time-ago #="{ timeAgo }" :time="props.pasta.createdAt">
          <time>Published {{ timeAgo }}</time>
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
  populate: [pastaTextContainer: HTMLElement, pasta: IDBMegaPasta];
}>();

// NOTE: maybe no need isPopulateEmitCalledOnce ref
// maybe can use stop, pause, resume inside callback param
// isPopulateEmitCalledOnce MUST be ref, otherwise will be SSR bugs with pasta populate
const isPopulateEmitCalledOnce = ref(false);

const pastaRef = ref();
const {
  stop: _,
  pause: __,
  resume: ___,
  isActive: ____,
} = useIntersectionObserver(pastaRef, ([entry]) => {
  if (!entry.isIntersecting || isPopulateEmitCalledOnce.value) {
    return;
  }
  const pastaTextContainer = entry.target.querySelector(
    "[data-pasta-text-container]",
  );
  assert.ok(pastaTextContainer instanceof HTMLElement);
  emit("populate", pastaTextContainer, props.pasta);
  isPopulateEmitCalledOnce.value = true;
});
</script>
<style scoped>
:deep(img) {
  display: inline;
  margin: -5px 0;
}
</style>

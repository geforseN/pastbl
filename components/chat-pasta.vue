<template>
  <!-- FIXME: 
    layout tags are bad
    e.g span which have 'block' class   
    most of this were just copied from twitch layout
    probably this can be refactored and visual regression wont happened
  -->
  <div
    class="flex flex-col gap-x-2 gap-y-1 border border-info p-2 xs:flex-row xs:gap-y-0"
  >
    <div class="flex w-[340px] flex-col">
      <span class="block grow border border-secondary">
        <span class="block w-full px-[10px] py-[5px]">
          <slot name="user-nickname" />
          <span>{{ ": " }}</span>
          <!-- FIXME: XXS vulnerability, use some html sanitizer -->
          <span
            class="twitch-text textarea m-0 box-border p-0 text-[13px] font-normal leading-[19.5px]"
            v-html="props.pasta.populatedText || props.pasta.text"
          >
          </span>
        </span>
      </span>
      <div
        class="relative top-1 flex flex-wrap gap-x-1 gap-y-0.5"
        v-if="props.pasta.tags.length !== 0"
      >
        <div
          class="line-clamp-2 break-all rounded-lg bg-info px-1 py-0.5 text-sm text-info-content"
          v-for="tag of props.pasta.tags"
          :key="tag"
        >
          {{ tag }}
        </div>
      </div>
      <div class="relative top-[3px] flex justify-between px-0.5">
        <use-time-ago #="{ timeAgo }" :time="props.pasta.createdAt">
          <time>Created {{ timeAgo }}</time>
        </use-time-ago>
        <time>{{ new Date(props.pasta.createdAt).toDateString() }}</time>
      </div>
    </div>
    <div
      class="flex flex-row-reverse gap-x-2 xs:flex-col xs:justify-between xs:gap-x-0"
    >
      <slot name="copypasta-btn" />
      <button
        class="btn btn-square btn-warning btn-md rounded-none border-2 border-neutral-content text-xs text-warning-content"
        @click="emit('pastaRemove')"
      >
        Delete pasta
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { UseTimeAgo } from "@vueuse/components";

const props = defineProps<{ pasta: MegaPasta }>();
const emit = defineEmits<{
  pastaRemove: [];
}>();

defineSlots<{
  "copypasta-btn": () => any;
  "user-nickname": () => any;
}>();
</script>

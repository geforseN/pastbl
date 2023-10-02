<template>
  <!-- FIXME: 
    layout tags are bad
    e.g span which have 'block' class   
    most of this were just copied from twitch layout
    probably this can be refactored and visual regression wont happened
  -->
  <div class="flex flex-col gap-y-1 min-[420px]:flex-row min-[420px]:gap-y-0 border border-info p-2 gap-x-2">
    <div class="flex flex-col w-[340px]">
      <span class="grow border border-secondary block">
        <span class="w-full py-[5px] px-[10px] block">
          <slot name="user-nickname" />
          <span>{{ ": " }}</span>
          <span
            class="text layout box-content textarea leading-[19.5px] text-[13px] font-normal"
          >
            {{ props.pasta.text }}
          </span>
        </span>
      </span>
      <div
        class="flex flex-wrap gap-x-1 gap-y-0.5 relative top-1"
        v-if="props.pasta.tags.length !== 0"
      >
        <div
          v-for="tag of props.pasta.tags"
          class="bg-info text-info-content rounded-lg px-1 py-0.5 text-sm line-clamp-2 break-all"
        >
          {{ tag }}
        </div>
      </div>
      <div class="flex justify-between px-0.5 relative top-[3px]">
        <use-time-ago v-slot="{ timeAgo }" :time="props.pasta.createdAt">
          <time>Created {{ timeAgo }}</time>
        </use-time-ago>
        <time>{{ new Date(props.pasta.createdAt).toDateString() }}</time>
      </div>
    </div>
    <div class="flex gap-x-2 flex-row-reverse min-[420px]:flex-col min-[420px]:justify-between min-[420px]:gap-x-0 ">
      <slot name="copypasta-btn" />
      <button
        class="mt-auto btn btn-md btn-square rounded-none border-neutral-content border-2 text-xs btn-secondary text-secondary-content"
        @click="emit('showChangeCopypastaModalWindow')"
      >
        Change pasta
      </button>
      <button
        class="btn btn-md btn-square rounded-none border-neutral-content border-2 text-xs btn-warning text-warning-content"
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
  showChangeCopypastaModalWindow: [];
}>();

defineSlots<{
  "copypasta-btn": () => any;
  "user-nickname": () => any;
}>();
</script>

<style scoped>
.layout {
  box-sizing: border-box;
  display: inline;
  height: auto;
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  width: auto;
}

.text {
  overflow-wrap: anywhere;
  text-size-adjust: 100%;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>

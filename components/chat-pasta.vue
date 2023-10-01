<template>
  <!-- FIXME: 
    layout tags are bad
    e.g span which have 'block' class   
    most of this were just copied from twitch layout
    probably this can be refactored and visual regression wont happened
  -->
  <div class="flex border border-info p-2 pb-1 gap-x-2">
    <div class="flex flex-col w-[340px]">
      <span class="grow border border-secondary block">
        <span class="w-full py-[5px] px-[10px] block">
          <slot name="user-nickname" />
          <span>{{ ": " }}</span>
          <span class="text layout">
            {{ props.pasta.text }}
          </span>
        </span>
      </span>
      <div class="flex justify-between px-1">
        <use-time-ago v-slot="{ timeAgo }" :time="props.pasta.createdAt">
          <time>Created {{ timeAgo }}</time>
        </use-time-ago>
        <time>{{ new Date(props.pasta.createdAt).toDateString() }}</time>
      </div>
      <div
        class="flex flex-wrap gap-x-1 gap-y-0.5"
        v-if="props.pasta.tags.length !== 0"
      >
        <div
          v-for="tag of props.pasta.tags"
          class="bg-info text-info-content rounded-lg px-1 py-0.5 text-sm line-clamp-2 break-all"
        >
          {{ tag }}
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-between">
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
.text {
  overflow-wrap: anywhere;
  text-size-adjust: none;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

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
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-feature-settings: normal;
  font-kerning: auto;
  font-optical-sizing: auto;
  font-size: 13px;
  font-stretch: 100%;
  font-style: normal;
  font-variant-alternates: normal;
  font-variant-caps: normal;
  font-variant-east-asian: normal;
  font-variant-ligatures: normal;
  font-variant-numeric: normal;
  font-variant-position: normal;
  font-variation-settings: normal;
  font-weight: 400;
  line-height: 20px;
  text-size-adjust: none;
  vertical-align: baseline;
}
</style>

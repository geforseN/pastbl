<template>
  <div class="flex border border-info p-3">
    <span class="w-[340px] border border-secondary block">
      <span class="w-full py-[5px] px-[10px] block">
        <slot name="user-nickname" />
        <span>{{ ": " }}</span>
        <span class="text layout">
          {{ props.pasta.text }}
        </span>
      </span>
      <span class="ml-2 mb-1">
        <span v-for="tag of props.pasta.tags" class="badge badge-secondary">
          {{ tag }}
        </span>
      </span>
      <div class="m-2 flex justify-between">
        <use-time-ago v-slot="{ timeAgo }" :time="props.pasta.createdAt">
          <time>Created {{ timeAgo }}</time>
        </use-time-ago>
        <time>{{ new Date(props.pasta.createdAt).toDateString() }}</time>
      </div>
    </span>
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

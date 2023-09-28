<template>
  <div class="flex border border-info p-3">
    <div class="w-[340px] border border-secondary">
      <span class="w-full flex py-[5px] px-[10px]">
        <slot name="user-nickname" />
        {{ ":" }}
        <span class="text leading-[19.5px] text-[13px] font-normal align-baseline">
          {{ props.pasta.text }}
        </span>
      </span>
      <div class="ml-2 mb-1">
        <div v-for="tag of props.pasta.tags" class="badge badge-secondary">{{ tag }}</div>
      </div>
      <div class="m-2 flex justify-between">
        <use-time-ago v-slot="{ timeAgo }" :time="props.pasta.createdAt">
          <time>Created {{ timeAgo }}</time>
        </use-time-ago>
        <time>{{ new Date(props.pasta.createdAt).toDateString() }}</time>
        <button class="btn btn-xs btn-error" @click="emit('pastaRemove')">DELETE</button>
      </div>
    </div>
    <slot name='copypasta-btn' />
  </div>
</template>
<script lang="ts" setup>
import { UseTimeAgo } from '@vueuse/components'
const props = defineProps<{ pasta: MegaPasta }>();
const emit = defineEmits<{ pastaRemove: [] }>();
defineSlots<{ 'copypasta-btn': () => any, 'user-nickname': () => any }>();
</script>

<style scoped>
.text {
  overflow-wrap: anywhere;
  text-size-adjust: 100%;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>
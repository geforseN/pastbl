<template>
  <div class="w-full flex justify-center" v-if="props.tags.length === 0">
    <span class="bg-warning rounded text-warning-content px-2 py-1 border">No tags were added</span>
  </div>
  <div v-else class="grid gap-2 overflow-y-auto max-h-[380px]">
    <div v-for="tag of props.tags" :title="tag" class="bg-secondary flex justify-between px-1 py-0.5 gap-x-1 rounded-lg">
      <span class="line-clamp-4 break-all">{{ tag }}</span>
      <button class="btn block btn-xs h-full text-xs font-normal" :title="`remove tag: ${tag}`"
        @click="emit('removeTag', tag)">
        <span>x</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ tags: string[] }>();
const emit = defineEmits<{ removeTag: [tag: string] }>();
// TODO: can add on tag mouseover logic with hint: 
// if user mouseovered then click on any place of tag will remove it,
// should show transparent large text 'REMOVE' over that tag
</script>

<template>
  <div
    v-if="tags.length !== 0"
    class="flex flex-wrap gap-2 overflow-y-auto max-h-[120px] min-w-full"
  >
    <div
      v-for="tag of props.tags"
      :title="tag"
      class="flex bg-secondary rounded-lg"
    >
      <span class="line-clamp-2 break-all pl-1.5 pr-1 pb-0.5">{{ tag }}</span>
      <button
        class="btn btn-xs h-full border-0 bg-base-content text-base-100"
        :title="`remove tag: ${tag}`"
        @click.prevent="emit('removeTag', tag)"
      >
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

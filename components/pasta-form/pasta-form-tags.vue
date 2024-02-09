<template>
  <div
    v-auto-animate="{ duration: 300 }"
    class="flex max-h-[120px] min-w-full flex-wrap gap-2 overflow-y-auto"
  >
    <div
      v-for="tag of props.tags"
      :key="tag"
      class="flex rounded-lg bg-secondary"
      :title="tag"
    >
      <span class="line-clamp-2 break-all pb-0.5 pl-1.5 pr-1">{{ tag }}</span>
      <button
        class="btn btn-xs h-full border-0 bg-base-content text-base-100"
        :title="$t('pasta.create.tag.remove-button', { tag })"
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

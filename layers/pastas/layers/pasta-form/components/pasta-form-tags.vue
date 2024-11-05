<template>
  <div
    v-auto-animate="{ duration: 300 }"
    class="flex max-h-[120px] min-w-full flex-wrap gap-2 overflow-y-auto"
  >
    <removable-pasta-tag
      v-for="tag of tags"
      :key="tag"
      :close-button-attrs="{ title: $t('tag.delete', { tag }) }"
      :tag
      @remove="$emit('removeTag', tag)"
    />
  </div>
</template>
<script setup lang="ts">
import RemovablePastaTag from "$ui/removable-pasta-tag.vue";

defineProps<{
  tags: string[];
}>();
defineEmits<{
  removeTag: [string];
}>();
// TODO: can add on tag mouseover logic with hint:
// if user mouseovered then click on any place of tag will remove it,
// should show transparent large text 'REMOVE' over that tag
</script>

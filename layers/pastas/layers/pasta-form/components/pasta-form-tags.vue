<template>
  <div
    v-auto-animate="{ duration: 300 }"
    class="flex max-h-[120px] min-w-full flex-wrap gap-2 overflow-y-auto"
  >
    <div
      v-for="tag of tags"
      :key="tag"
      class="join flex rounded-lg"
      :title="tag"
    >
      <span
        class="join-item rounded-lg py-0.5 pl-1.5 pr-1 text-sm"
        :class="
          tag.startsWith('@')
            ? 'bg-twitch-accent text-twitch-base'
            : 'bg-info text-info-content'
        "
      >
        {{ tag }}
      </span>
      <button
        class="btn btn-outline join-item btn-xs h-full border-l-0"
        :title="$t('tag.delete', { tag })"
        @click.prevent="$emit('removeTag', tag)"
      >
        <span>x</span>
      </button>
    </div>
  </div>
</template>
<script setup>
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

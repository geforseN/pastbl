<template>
  <div class="collapse collapse-arrow border-2 bg-base-200 text-2xl">
    <input v-model="isOpen" type="checkbox" />
    <div class="collapse-title font-medium">
      <div class="flex justify-between">
        <span>{{ title }}</span>
        <span>{{ group.emojis[0]?.emoji }}</span>
      </div>
    </div>
    <div v-if="isOpen" class="collapse-content flex justify-center">
      <div class="flex max-h-60 flex-wrap overflow-y-auto p-4">
        <div
          v-for="{ emoji, name, slug } of group.emojis"
          :key="name"
          class="p-0.5"
          :title="name"
          :data-emoji-token="slug"
        >
          {{ emoji }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type EmojisGroup =
  (typeof import("unicode-emoji-json/data-by-group.json"))[number];

defineProps<{
  title: string;
  group: EmojisGroup;
}>();

const isOpen = ref(false);
</script>
<style scoped>
.collapse-title,
:where(.collapse > input[type="checkbox"]),
:where(.collapse > input[type="radio"]) {
  min-height: auto;
  padding: 0.25rem 0.5rem;
  padding-right: 2rem;
}

.collapse-title::after {
  margin: -0.75rem -0.5rem;
}

.collapse-content {
  margin-top: -1rem;
  padding: 0;
}
</style>

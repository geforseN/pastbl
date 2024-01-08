<template>
  <div class="flex flex-col gap-2 rounded-btn border-2 p-2">
    <span class="text-2xl font-bold">{{ props.collection.username }}</span>
    <emote-collection-execution-status
      v-for="{ path, source } of [
        { path: 'bttv', source: 'BetterTTV' },
        { path: 'ffz.fullCollection', source: 'FrankerFaceZ' },
        { path: 'sevenTv.fullCollection', source: 'SevenTV' },
      ] as const"
      :key="source + path"
      :source="source"
      :integration="getByPath(props.collection.integrations, path)"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  collection: {
    username: string;
    integrations: any;
  };
}>();

function getByPath<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  path: K,
): unknown {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    result = result[key];
  }
  return result;
}
</script>

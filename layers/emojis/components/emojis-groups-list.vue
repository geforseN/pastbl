<template>
  <div
    v-on-mouseover="showEmoteCard"
    class="rounded-btn space-y-1.5 border-2 p-2"
  >
    <emojis-group
      v-for="[title, group] of emojisGroupsEntries"
      :key="title"
      :title
      :group
    />
  </div>
</template>
<script setup lang="ts">
import emoteDataByGroup from "unicode-emoji-json/data-by-group.json";

const { t } = useI18n();

const emojisGroupsEntries = computed(() =>
  emoteDataByGroup.map(
    (entry) => [t(`emojis._headings.${entry.name}`), entry] as const,
  ),
);

const emoteOnHover = injectEmoteOnHover();

const showEmoteCard = () =>
  useThrottleFn(emoteOnHover.makeMouseoverHandler(), 100, true);
</script>

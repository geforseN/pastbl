<template>
  <div
    class="space-y-1.5 rounded-btn border-2 p-2"
    @mouseover="throttledMouseover"
  >
    <emoji-group v-for="[title, group] of entries" :key="title" :title :group />
  </div>
</template>
<script lang="ts" setup>
import emoteDataByGroup from "unicode-emoji-json/data-by-group.json";

const englishKeys = objectKeys(emoteDataByGroup);

const entries = shallowRef(Object.entries(emoteDataByGroup));
const { t, locale } = useI18n();

watchImmediate(locale, () => {
  entries.value = entries.value.map(
    (entry, index) =>
      [t(`emojis._headings.${englishKeys[index]}`), entry[1]] as const,
  );
});

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.makeMouseoverHandler(),
  100,
  true,
);
</script>

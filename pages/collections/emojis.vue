<template>
  <div class="w-96 space-y-2">
    <div
      class="space-y-1.5 rounded-btn border-2 p-2"
      @mouseover="throttledMouseover"
    >
      <emoji-group
        v-for="[title, group] of entries"
        :key="title"
        :title
        :group
      />
    </div>
    <app-page-link-emotes />
    <app-page-link-main />
  </div>
</template>
<script lang="ts" setup>
import emoteDataByGroup from "unicode-emoji-json/data-by-group.json";

const englishKeys = objectKeys(emoteDataByGroup);

const entries = shallowRef(Object.entries(emoteDataByGroup));
const { t, locale } = useI18n();

watch(
  locale,
  () => {
    const m = "collections.emojis.headings.";
    entries.value = entries.value.map((entry, index) => [
      t(m + englishKeys[index]),
      entry[1],
    ]);
  },
  { immediate: true },
);

const onHoverHint = inject<OnHoverHint>("onHoverHint") || raise();

const throttledMouseover = useThrottleFn(
  onHoverHint.makeMouseoverHandler(),
  100,
  true,
);
</script>

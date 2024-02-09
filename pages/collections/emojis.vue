<template>
  <div class="flex w-96 flex-col gap-2">
    <div class="flex flex-col gap-1.5 rounded-btn border-2 p-2">
      <div
        v-for="[title, group] of entries"
        :key="title"
        class="collapse collapse-arrow border-2 bg-base-200 text-2xl"
      >
        <input type="checkbox" />
        <div class="collapse-title font-medium">
          <div class="flex justify-between">
            <span>{{ title }}</span>
            <span>{{ group[0].emoji }}</span>
          </div>
        </div>
        <div class="collapse-content flex justify-center">
          <div class="flex max-h-60 flex-wrap overflow-y-auto p-4">
            <div
              v-for="{ name, emoji } of group"
              :key="name"
              class="p-0.5"
              :title="name"
            >
              {{ emoji }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-page-link to="emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <app-page-link to="main" />
  </div>
</template>
<script lang="ts" setup>
import emoteDataByGroup from "unicode-emoji-json/data-by-group.json";

const englishKeys = Object.keys(emoteDataByGroup);

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

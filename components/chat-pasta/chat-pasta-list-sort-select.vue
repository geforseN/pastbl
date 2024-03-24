<template>
  <div class="flex items-baseline justify-between">
    <label for="sort-pastas" class="label font-bold">
      {{ t(s + "label") }}
    </label>
    <client-only>
      <select
        id="sort-pastas"
        v-model="selectedSortStrategy"
        class="select select-secondary select-sm w-1/2"
        name="sort-pastas"
      >
        <option
          v-for="[sortStrategy, translatedText] of Object.entries(sortOptions)"
          :key="sortStrategy"
          :value="sortStrategy"
        >
          {{ translatedText }}
        </option>
      </select>
      <template #fallback>
        <select class="select select-secondary select-sm w-1/2"></select>
      </template>
    </client-only>
  </div>
</template>
<script lang="ts" setup>
import { l } from "~/components/chat-pasta/chat-pasta-list.vue";

const selectedSortStrategy = defineModel<PastaSortStrategy>({ required: true });

const s = l + "sort.";
const so = l + "sort.options.";
const { t, locale } = useI18n();

const sortOptions = computedWithControl(
  locale,
  () =>
    ({
      "newest-first": t(so + "newest-first"),
      "oldest-first": t(so + "oldest-first"),
      "last-updated": t(so + "last-updated"),
      "last-copied": t(so + "last-copied"),
    }) satisfies Record<PastaSortStrategy, string>,
);
</script>

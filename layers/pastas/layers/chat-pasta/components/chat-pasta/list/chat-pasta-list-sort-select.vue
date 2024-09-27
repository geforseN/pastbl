<template>
  <div class="flex items-baseline justify-between">
    <label for="sort-pastas" class="label font-bold">
      {{ t("pastas.sort") }}
    </label>
    <select
      id="sort-pastas"
      v-model="selectedSortStrategy"
      class="select select-secondary select-sm w-1/2"
      name="sort-pastas"
    >
      <option
        v-for="[sortStrategy, translatedText] of sortEntries"
        :key="sortStrategy"
        :value="sortStrategy"
      >
        {{ translatedText }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
const selectedSortStrategy = defineModel<PastaSortStrategy>({ required: true });

const { t } = useI18n();

const sortEntries = computed(
  () =>
    [
      ["newest-first", t("newest-first")],
      ["oldest-first", t("oldest-first")],
      ["last-updated", t("last-updated")],
      ["last-copied", t("last-copied")],
    ] as const satisfies [PastaSortStrategy, string][],
);
</script>

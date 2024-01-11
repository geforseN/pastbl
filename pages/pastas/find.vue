<template>
  <div
    class="mt-2 flex flex-col-reverse items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <!-- NOTE: for below component w-full and max-w-[414px] is necessary for no layout shift -->
    <find-my-pasta-list class="w-full max-w-[414px]" :pastas="showedPastas" />
    <div class="flex w-96 flex-col gap-2">
      <section class="flex w-full flex-col gap-1 rounded-box border-2 p-2">
        <h2
          id="pasta-search-parameters-heading"
          class="p-2 text-2xl font-bold xs:text-3xl"
        >
          Pasta search parameters
        </h2>
        <article class="form-control rounded-box border p-2">
          <label for="text-to-find" class="cursor-pointer">
            <h3 class="p-2 text-xl font-bold">Text to find</h3>
          </label>
          <input
            id="text-to-find"
            ref="textToFindInputRef"
            v-model="text"
            type="search"
            class="input input-secondary m-1 -mt-1 border-2"
            placeholder="Search pasta with text"
          />
        </article>
        <find-my-pasta-length-range
          v-model="length.range.value"
          v-model:max-value="length.max.value"
          v-model:min-value="length.min.value"
          v-model:respect="mustRespectLengthRange"
        />
        <find-my-pasta-tags
          v-model:must-respect-selected-tags="mustRespectSelectedTags"
          v-model:selected-pasta-tags="selectedPastaTags"
          :tags-to-select="tagsToSelect"
        />
        <!-- TODO: date range -->
      </section>
      <app-page-link to="main" />
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: false,
});
const pastasStore = usePastasStore();

const allPastas = computed(() =>
  withLogSync(pastasStore.pastasSortedByNewest, "allPastas"),
);

const showedPastas = computed(() =>
  withLogSync(pastasToShowOnPage.value, "showedPastas"),
);

const { text, textAppropriatePastas } = useFindPastaText(allPastas);
const { mustRespectLengthRange, lengthAppropriatePastas, length } =
  useFindPastasLength(allPastas);
const {
  mustRespectSelectedTags,
  tagsAppropriatePastas,
  selectedPastaTags,
  tagsToSelect,
} = useFindPastasTags(allPastas, showedPastas);

const pastaLists = [
  textAppropriatePastas,
  lengthAppropriatePastas,
  tagsAppropriatePastas,
];

const sortedByLengthPastaLists = computed(() => {
  return pastaLists.sort((a, b) => a.value.length - b.value.length);
});

const pastasToShowOnPage = computed(() => {
  const [smallestPastaList, ...othersPastaLists] =
    sortedByLengthPastaLists.value;
  return smallestPastaList.value.filter((pasta) =>
    othersPastaLists.every((pastaList) =>
      pastaList.value.some((pasta_) => pasta_.id === pasta.id),
    ),
  );
});
</script>

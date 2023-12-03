<template>
  <div
    class="mt-2 flex flex-col-reverse items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <!-- NOTE: for below component w-full and max-w-[414px] is necessary for no layout shift -->
    <find-my-pasta-list
      class="w-full max-w-[414px]"
      :pastas="pastasToShowOnPage"
    />
    <div>
      <section class="flex w-full max-w-lg flex-col gap-1 rounded border-2 p-2">
        <h2
          id="pasta-search-parameters-heading"
          class="p-2 text-2xl font-bold xs:text-3xl"
        >
          Pasta search parameters
        </h2>
        <article class="form-control rounded-2xl border p-2">
          <label for="text-to-find" class="cursor-pointer">
            <h3 class="p-2 text-xl font-bold">Text to find</h3>
          </label>
          <input
            id="text-to-find"
            ref="textToFindInputRef"
            v-model="textToFind"
            type="search"
            class="input input-secondary m-1 -mt-1 border-2"
            placeholder="Search pasta with text"
          />
        </article>
        <find-my-pasta-length-range
          v-model="range"
          v-model:max-value="maxValue"
          v-model:min-value="minValue"
          v-model:respect="mustRespectLengthRange"
        />
        <find-my-pasta-tags
          v-model:selected-pasta-tags="selectedPastaTags"
          v-model:must-be-tags-in-pasta="mustBeTagsInPasta"
          v-model:respect="mustRespectSelectedTags"
          :must-select-be-disabled="!mustRespectSelectedTags"
          :pasta-tags-to-show="pastaTagsToShow"
        />
        <!-- TODO: date range -->
      </section>
      <go-to-main-page />
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: false,
});
const pastasStore = usePastasStore();

const textToFindInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  textToFindInputRef.value?.focus();
});

// TODO: use query params for below refs
const textToFind = useUrlQueryParam("text-to-find");
const mustRespectSelectedTags = ref(true);
const selectedPastaTags = ref([]);
const mustBeTagsInPasta = ref(false);
const {
  range /* NOTE: range also must be in quey params */,
  minValue,
  maxValue,
} = useFindMyPastaRange();
const mustRespectLengthRange = ref(true);

function hasPastaTextToFindOccurrence(pasta: IDBMegaPasta) {
  return pasta.text.toLowerCase().includes(textToFind.value.toLowerCase());
}

const pastaTagsToShow = computed(() => {
  if (selectedPastaTags.value.length === 0) {
    return pastasStore.allTagsSorted;
  }
  const tagsOfShowedPastas = pastasToShowOnPage.value.flatMap(
    (pasta) => pasta.tags,
  );
  return [...new Set(tagsOfShowedPastas)];
});

function hasPastaSelectedTags(pasta: IDBMegaPasta) {
  return selectedPastaTags.value.every((selectedPastaTags) =>
    pasta.tags.includes(selectedPastaTags),
  );
}

const pastasWithTags = computedEager(() => {
  return pastasStore.pastas.state.filter((pasta) => pasta.tags.length !== 0);
});

const pastasWithSelectedTags = computedEager(() =>
  pastasStore.pastas.state.filter(hasPastaSelectedTags),
);

const pastasToIterate = computedEager(() => {
  if (mustBeTagsInPasta.value) {
    return pastasWithTags.value;
  }
  if (mustRespectSelectedTags.value) {
    return pastasWithSelectedTags.value;
  }
  return pastasStore.shallowRawPastas;
});

const lengthAppropriatePastas = computedEager(() =>
  pastasStore.shallowRawNewestPastas.filter(
    (pasta) =>
      pasta.text.length >= range.value[0] &&
      pasta.text.length <= range.value[1],
  ),
);

const lengthAppropriatePastasWithTags = computedEager(() =>
  lengthAppropriatePastas.value.filter((pasta) => pasta.tags.length !== 0),
);

// FIXME: selected length range is not respected WHEN at least one tag is selected
const pastasToShowOnPage = computedEager(() => {
  if (!textToFind.value.length && !selectedPastaTags.value.length) {
    return mustBeTagsInPasta.value
      ? lengthAppropriatePastasWithTags.value
      : lengthAppropriatePastas.value;
  }
  const pastaToIterate2 = mustRespectSelectedTags.value
    ? pastasToIterate.value.filter(hasPastaSelectedTags)
    : pastasToIterate.value;

  return pastaToIterate2.filter(hasPastaTextToFindOccurrence);
});
</script>

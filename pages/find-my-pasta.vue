<template>
  <div
    class="flex w-full flex-col-reverse items-center gap-3 go-brr:flex-row go-brr:items-start"
  >
    <!-- TODO: media query for sizes of texts, inputs, etc. -->
    <!-- NOTE: for below div w-full is necessary for no layout shift -->
    <div class="w-full max-w-[414px]">
      <find-my-pasta-list :pastas="pastasToShowOnPage" />
      <span class="ml-1"> Found {{ pastasToShowOnPage.length }} pastes </span>
    </div>
    <div class="flex h-fit w-full max-w-lg flex-col rounded border-2">
      <div class="form-control">
        <label for="text-to-find" class="cursor-pointer">
          Input text to find in pasta
        </label>
        <input
          id="text-to-find"
          ref="textToFindInputRef"
          v-model="textToFind"
          type="search"
          class="input input-secondary border-2"
          placeholder="Search pasta with text"
        />
      </div>
      <div class="form-control">
        <div class="flex items-center">
          <label class="cursor-pointer" for="must-be-tags-in-pasta">
            Must be at least one tag in pasta
          </label>
          <input
            id="must-be-tags-in-pasta"
            v-model="mustBeTagsInPasta"
            type="checkbox"
            class="toggle toggle-primary"
          />
        </div>
        <find-my-pasta-length-range
          v-model="range"
          v-model:max-value="maxValue"
          v-model:min-value="minValue"
        />
        <div class="flex flex-col rounded border">
          <div class="flex items-center justify-between">
            <label class="cursor-pointer" for="must-respect-selected-tags">
              Take into account selected tags
            </label>
            <input
              id="must-respect-selected-tags"
              v-model="mustRespectSelectedTags"
              type="checkbox"
              class="toggle toggle-primary"
            />
          </div>
          <find-my-pasta-tags
            v-model:selected-pasta-tags="selectedPastaTags"
            :must-select-be-disabled="!mustRespectSelectedTags"
            :pasta-tags-to-show="pastaTagsToShow"
            :all-tags="pastasStore.allTagsSorted"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({ layout: "basic" });

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
  return pastasStore.pastas.filter((pasta) => pasta.tags.length !== 0);
});

const pastasWithSelectedTags = computedEager(() =>
  pastasStore.pastas.filter(hasPastaSelectedTags),
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
  pastasStore.shallowRawPastas.filter(
    (pasta) =>
      pasta.text.length >= range.value[0] &&
      pasta.text.length <= range.value[1],
  ),
);

const lengthAppropriatePastasWithTags = computedEager(() =>
  lengthAppropriatePastas.value.filter((pasta) => pasta.tags.length !== 0),
);

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

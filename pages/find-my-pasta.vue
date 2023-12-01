<template>
  <div class="mx-auto flex gap-3 px-10 py-4">
    <div class="min-w-[414px]">
      <div
        v-if="!pastasToShowOnPage.length"
        class="alert alert-warning flex justify-center"
      >
        No pastas with such criteria founded!
      </div>
      <div
        v-else
        v-auto-animate
        class="flex max-h-[83dvh] flex-col gap-y-2 overflow-y-auto"
      >
        <chat-pasta
          v-for="pasta of pastasToShowOnPage"
          :key="pasta.id"
          :pasta="pasta"
        >
          <template #creatorData>
            <chat-pasta-creator-data
              :badges-count="userStore.user.badges.count"
              :nickname="userStore.user.nickname"
              :nickname-color="userStore.user.preferences.nickname.color"
            />
          </template>
          <template #sidebar>
            <button
              class="btn btn-square btn-md ml-auto rounded-none border-2 border-accent text-xs xs:ml-0"
              :disabled="!clipboard.isSupported.value"
              @click="copyPasta(pasta)"
            >
              copy pasta
            </button>
          </template>
        </chat-pasta>
      </div>
      <span class="ml-1 text-xl">
        Founded {{ pastasToShowOnPage.length }} pastas
      </span>
    </div>
    <div class="flex h-fit max-w-lg flex-col divide-y-2 rounded border-2 p-2">
      <div class="form-control p-2">
        <label for="textToFind" class="label cursor-pointer text-3xl">
          Input text to find in pasta
        </label>
        <input
          id="textToFind"
          ref="textToFindInputRef"
          v-model="textToFind"
          type="search"
          class="input input-info"
          placeholder="Search pasta with text"
        />
      </div>
      <div class="overflow-wrap-anywhere flex h-max flex-col divide-y p-2">
        <div class="flex items-center justify-between">
          <label
            class="label cursor-pointer text-2xl"
            for="mustRespectSelectedTags"
          >
            Take into account selected tags
          </label>
          <input
            id="mustRespectSelectedTags"
            v-model="mustRespectSelectedTags"
            type="checkbox"
            class="toggle"
            @keyup.enter.exact="
              mustRespectSelectedTags = !mustRespectSelectedTags
            "
          />
        </div>
        <div class="flex items-center justify-between">
          <label class="label cursor-pointer text-2xl" for="mustBeTagsInPasta">
            Must be at least one tag in pasta
          </label>
          <!-- FIXME: on checkbox change pastasToShowOnPage are changed very slow, also   -->
          <input
            id="mustBeTagsInPasta"
            v-model="mustBeTagsInPasta"
            type="checkbox"
            class="toggle"
          />
        </div>
        <find-my-pasta-length-range
          v-model:min="range[0]"
          v-model:max="range[1]"
          :min-value="minValue"
          :max-value="maxValue"
        />
        <div class="flex flex-col rounded border px-2 py-0">
          <label for="selectedPastaTags" class="label cursor-pointer text-2xl">
            Select tags
          </label>
          <!-- TODO: also add input search here to find tag quickly -->
          <select
            id="selectedPastaTags"
            v-model="selectedPastaTags"
            :disabled="!mustRespectSelectedTags"
            multiple
            class="select select-info !h-96 p-2"
          >
            <option
              v-for="tag of pastasStore.allTags"
              :key="tag"
              :value="tag"
              class="h-6"
            >
              {{ tag }}
            </option>
          </select>
          <div class="p-2">
            <span class="font-bold text-warning">NOTE:</span>
            for select multiple tags use
            <kbd class="kbd kbd-sm">CTRL</kbd>
            + click
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const pastasStore = usePastasStore();

const clipboard = useClipboard();
const { copyPasta } = usePastaCopy({ userStore, clipboard });

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

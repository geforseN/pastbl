<template>
  <div class="mx-auto flex gap-3 px-10 py-4">
    <div class="min-w-[414px]">
      <div
        v-if="!pastasToShowOnPage.length"
        class="alert alert-warning flex justify-center"
      >
        No pastas with such criteria founded!
      </div>
      <div v-else class="flex max-h-[83dvh] flex-col gap-y-2 overflow-y-auto">
        <chat-pasta
          v-for="pasta of pastasToShowOnPage"
          :key="pasta.createdAt"
          :pasta="pasta"
        >
          <template #userNickname>
            <chat-pasta-nickname :user="userStore.user" />
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
        <span class="ml-1 text-xl">
          Founded {{ pastasToShowOnPage.length }} pastas
        </span>
      </div>
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
        <!-- TODO -->
        <div class="flex items-center justify-between">
          <label class="label cursor-pointer text-2xl" for="ggg">
            Must be no tags in pasta
          </label>
          <input id="ggg" type="checkbox" class="toggle" />
        </div>
        <!-- TODO -->
        <div>
          <label for="gggg">SELECT MIN AND MAX PASTA TEXT LENGTH</label>
          <input
            id="gggg"
            v-model="selectedPastaTextLength"
            type="range"
            :max="maxPastaTextLength"
            :min="minPastaTextLength"
          />
          <div>min : {{ minPastaTextLength }}</div>
          <div>max : {{ maxPastaTextLength }}</div>
          <div>selected: {{ selectedPastaTextLength }}</div>
        </div>
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
const { copyPasta } = usePastaCopy({ userStore, pastasStore, clipboard });

const textToFindInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  textToFindInputRef.value?.focus();
});

// TODO think how it will be represented if user has no pastas
const maxPastaTextLength = computed(() =>
  pastasStore.pastas.reduce(
    (max, pasta) => Math.max(max, pasta.text.length),
    Number.NEGATIVE_INFINITY,
  ),
);
// TODO think how it will be represented if user has no pastas
const minPastaTextLength = computed(() =>
  pastasStore.pastas.reduce(
    (min, pasta) => Math.min(min, pasta.text.length),
    Number.POSITIVE_INFINITY,
  ),
);

// TODO: use query params for three below refs
const textToFind = ref("");
const mustRespectSelectedTags = ref(true);
const selectedPastaTags = ref([]);
// NOTE: initial value is maxPastaTextLength.length, which is gonna be Number.NEGATIVE_INFINITY (because at the start there is no pastas)
const selectedPastaTextLength = ref(maxPastaTextLength.value);

// NOTE: because pastas loaded async from IndexedDB, there is no pastas at the start, so we must use watch and set value
watchOnce(
  maxPastaTextLength,
  () => (selectedPastaTextLength.value = maxPastaTextLength.value),
);

function hasPastaTextToFindOccurrence(pasta: IDBMegaPasta) {
  return pasta.text.toLowerCase().includes(textToFind.value.toLowerCase());
}

const foundedPastas = computed(() =>
  pastasStore.pastas.filter(hasPastaTextToFindOccurrence),
);

const tagRespectedPastas = computed(() =>
  pastasStore.pastas.filter((pasta) =>
    selectedPastaTags.value.every((selectedPastaTags) =>
      pasta.tags.includes(selectedPastaTags),
    ),
  ),
);

const pastasToShowOnPage = computed(() => {
  if (!textToFind.value.length && !selectedPastaTags.value.length) {
    return pastasStore.pastas;
  }
  if (mustRespectSelectedTags.value) {
    return tagRespectedPastas.value.filter(hasPastaTextToFindOccurrence);
  }
  return foundedPastas.value;
});
</script>

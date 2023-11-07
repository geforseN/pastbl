<template>
  <div class="mx-auto flex gap-3 px-10 py-4">
    <div class="flex max-h-[83dvh] flex-col gap-y-2 overflow-y-auto">
      <chat-pasta
        v-for="pasta of pastasToShowOnPage"
        :key="pasta.createdAt"
        :pasta="pasta"
      >
        <template #user-nickname>
          <!-- FIXME: no nickname showed -->
          <slot name="user-nickname" />
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
    <div class="flex h-fit max-w-lg flex-col divide-y-2 rounded border-2 p-2">
      <div class="form-control p-2">
        <label for="textToFind" class="label cursor-pointer text-3xl">
          Input text to find in pasta
        </label>
        <input
          id="textToFind"
          v-model="textToFind"
          autofocus
          type="search"
          class="input input-info"
          placeholder="Search pasta with text"
        />
      </div>
      <div class="overflow-wrap-anywhere flex h-max flex-col divide-y p-2">
        <div class="flex items-center gap-2">
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
          />
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
          <span>Selected tags: {{ selectedPastaTags }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const pastasStore = usePastasStore();

const clipboard = useClipboard();
const { copyPasta } = usePastaCopy({ pastasStore, clipboard });

const textToFind = ref("");
const mustRespectSelectedTags = ref(false);

const selectedPastaTags = ref([]);
const foundedPastas = computed(() => {
  return pastasStore.pastas.filter((pasta) => {
    return pasta.text.toLowerCase().includes(textToFind.value.toLowerCase());
    //  && selectedPastaTags.value.every((tag) => pasta.tags.includes(tag))
  });
});
const pastasToShowOnPage = computed(() =>
  textToFind.value.length ? foundedPastas.value : pastasStore.pastas,
);
</script>

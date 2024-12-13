import { computed } from "vue";
import { useFindPastasTags } from "../../layers/pastas/layers/find-pastas/composables/usePastasFindTags";
import { useFindPastasLength } from "../../layers/pastas/layers/find-pastas/composables/usePastasFindLength";
import { useFindPastaText } from "../../layers/pastas/layers/find-pastas/composables/usePastasFindText";
import { usePastaFindTimeRange } from "../../layers/pastas/layers/find-pastas/composables/usePastasFindTimeRange";
import { isArray } from "../utils/guards";
import { assert } from "../utils/assert";
import { storeToRefs, defineStore } from "../../node_modules//@pinia+nuxt@0@0@4@5@3@5/node_modules/@pinia/nuxt/dist/runtime/composables";
import { usePastasStore } from "./usePastasStore";

export const usePastaFindStore = defineStore("pasta-find", () => {
  const pastasStore = usePastasStore();
  const { sortedPastas } = storeToRefs(pastasStore);

  const pastasToShowOnPage = computed(() => {
    const [smallestPastaList, ...othersPastaLists]
      = sortedByLengthPastaLists.value;
    assert.ok(isArray(smallestPastaList?.value));
    return smallestPastaList.value.filter((pasta) =>
      othersPastaLists.every((pastaList) =>
        pastaList.value.some((pasta_) => pasta_.id === pasta.id),
      ),
    );
  });

  const pastasCreatedAtRange = usePastaFindTimeRange("createdAt", sortedPastas);

  const showedPastas = computed(() => pastasToShowOnPage.value);

  const { text, debouncedText, textAppropriatePastas }
    = useFindPastaText(sortedPastas);

  const { mustRespectLengthRange, lengthAppropriatePastas, length }
    = useFindPastasLength(sortedPastas, {
      getMin: () => pastasStore.pastasTextLength.min,
      getMax: () => pastasStore.pastasTextLength.max,
    });

  const {
    mustRespectSelectedTags,
    tagsAppropriatePastas,
    selectedPastaTags,
    tagsToSelect,
  } = useFindPastasTags(
    sortedPastas,
    showedPastas,
    debouncedText,
    textAppropriatePastas,
  );

  const pastaLists = [
    textAppropriatePastas,
    lengthAppropriatePastas,
    tagsAppropriatePastas,
    pastasCreatedAtRange.appropriatePastas,
  ];

  const sortedByLengthPastaLists = computed(() => {
    return pastaLists.sort((a, b) => a.value.length - b.value.length);
  });

  return {
    text,
    length,
    showedPastas,
    mustRespectLengthRange,
    mustRespectSelectedTags,
    selectedPastaTags,
    tagsToSelect,
    pastasCreatedAtRange,
  };
});

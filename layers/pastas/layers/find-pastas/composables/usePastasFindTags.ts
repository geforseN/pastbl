import { computed, ref } from "vue";
import { refDebounced } from "@vueuse/core";
import type { Ref } from "vue";
import type { OmegaPasta } from "../../chat-pasta/utils/pasta";
import { uniqueValues } from "../../../../../app/utils/array";

function sortTags(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function useFindPastasTags(
  allPastas: Ref<OmegaPasta[]>,
  showedPastas: Ref<OmegaPasta[]>,
  textToFind: Ref<string>,
  pastasWithTextOccurrence: Ref<OmegaPasta[]>,
) {
  const selectedPastaTags = ref<string[]>([]);
  const mustRespectSelectedTags = ref(true);
  const debouncedMustRespect = refDebounced(mustRespectSelectedTags, 700);

  const allPastasTags = computed(() => {
    const unique = uniqueValues(allPastas.value.flatMap((pasta) => pasta.tags));
    return unique.sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));
  });

  const pastasWithSelectedTags = computed(() => {
    return allPastas.value.filter((pasta) =>
      selectedPastaTags.value.every((selectedTag) =>
        pasta.tags.includes(selectedTag),
      ),
    );
  });

  const showedPastasTags = computed(() => {
    const unique = uniqueValues(
      showedPastas.value.flatMap((pasta) => pasta.tags),
    );
    return unique.sort(sortTags);
  });

  const tagsOfPastasWithTextOccurrence = computed(() => {
    const tags = pastasWithTextOccurrence.value.flatMap((pasta) => pasta.tags);
    return uniqueValues(tags).sort(sortTags);
  });

  return {
    selectedPastaTags,
    mustRespectSelectedTags,
    tagsToSelect: computed(() => {
      if (textToFind.value.length > 0) {
        return tagsOfPastasWithTextOccurrence.value;
      }
      if (selectedPastaTags.value.length === 0) {
        return allPastasTags.value;
      }
      return showedPastasTags.value;
    }),
    tagsAppropriatePastas: computed(() => {
      if (debouncedMustRespect.value && selectedPastaTags.value.length > 0) {
        return pastasWithSelectedTags.value;
      }
      return allPastas.value;
    }),
  };
}

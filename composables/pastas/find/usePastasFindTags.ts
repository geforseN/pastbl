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
    return withLogSync(
      unique.sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1)),
      "allPastasTags",
    );
  });

  const pastasWithSelectedTags = computed(() => {
    return withLogSync(
      allPastas.value.filter((pasta) =>
        selectedPastaTags.value.every((selectedTag) =>
          pasta.tags.includes(selectedTag),
        ),
      ),
      "pastasWithSelectedTags",
    );
  });

  const showedPastasTags = computed(() => {
    const unique = uniqueValues(
      showedPastas.value.flatMap((pasta) => pasta.tags),
    );
    return withLogSync(unique.sort(sortTags), "showedPastasTags");
  });

  const tagsOfPastasWithTextOccurrence = computed(() => {
    const tags = pastasWithTextOccurrence.value.flatMap((pasta) => pasta.tags);
    return withLogSync(
      uniqueValues(tags).sort(sortTags),
      "tagsOfPastasWithTextOccurrence",
    );
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

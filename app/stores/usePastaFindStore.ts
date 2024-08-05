export const usePastaFindStore = defineStore("pasta-find", () => {
  const pastasStore = usePastasStore();
  const { sortedPastas } = storeToRefs(pastasStore);

  const pastasToShowOnPage = computed(() => {
    const [smallestPastaList, ...othersPastaLists] =
      sortedByLengthPastaLists.value;
    assert.ok(isArray(smallestPastaList));
    return smallestPastaList.value.filter((pasta) =>
      othersPastaLists.every((pastaList) =>
        pastaList.value.some((pasta_) => pasta_.id === pasta.id),
      ),
    );
  });

  const pastasCreatedAtRange = usePastaFindTimeRange("createdAt", sortedPastas);

  const showedPastas = computed(() =>
    withLogSync(pastasToShowOnPage.value, "showedPastas"),
  );

  const { text, debouncedText, textAppropriatePastas } =
    useFindPastaText(sortedPastas);

  const { mustRespectLengthRange, lengthAppropriatePastas, length } =
    useFindPastasLength(sortedPastas, {
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

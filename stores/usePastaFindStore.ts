export const usePastaFindStore = defineStore("pasta-find", () => {
  const { sortedPastas, pastasTextLength } = storeToRefs(usePastasStore());

  const pastasToShowOnPage = computed(() => {
    const [smallestPastaList, ...othersPastaLists] =
      sortedByLengthPastaLists.value;
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
      minCb: () => pastasTextLength.value.min,
      maxCb: () => pastasTextLength.value.max,
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

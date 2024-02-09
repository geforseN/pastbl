export const usePastaFindStore = defineStore("pasta-find", () => {
  const pastasStore = usePastasStore();

  const sortedPastas = computed(() =>
    withLogSync(pastasStore.sortedPastas, "sortedPastas"),
  );

  const showedPastas = computed(() =>
    withLogSync(pastasToShowOnPage.value, "showedPastas"),
  );

  const { text, debouncedText, textAppropriatePastas } =
    useFindPastaText(sortedPastas);
  const { mustRespectLengthRange, lengthAppropriatePastas, length } =
    useFindPastasLength(sortedPastas);

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
  ];

  const sortedByLengthPastaLists = computed(() => {
    return pastaLists.sort((a, b) => a.value.length - b.value.length);
  });

  const pastasToShowOnPage = computed(() => {
    const [smallestPastaList, ...othersPastaLists] =
      sortedByLengthPastaLists.value;
    return smallestPastaList.value.filter((pasta) =>
      othersPastaLists.every((pastaList) =>
        pastaList.value.some((pasta_) => pasta_.id === pasta.id),
      ),
    );
  });

  return {
    text,
    length,
    showedPastas,
    mustRespectLengthRange,
    mustRespectSelectedTags,
    selectedPastaTags,
    tagsToSelect,
  };
});

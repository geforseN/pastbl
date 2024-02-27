const time = (value: number) => new Date(value).toISOString().slice(0, 16);

function usePastaFindTimeRange<
  PK extends keyof Pick<
    IDBMegaPasta,
    "createdAt" | "lastCopiedAt" | "updatedAt"
  >,
>(
  pastaTimePropertyKey: PK,
  pastas: Ref<IDBMegaPasta[]>,
  ascendingPastas = computed(() =>
    pastas.value
      .filter((pasta) => pasta[pastaTimePropertyKey] !== undefined)
      .toSorted((a, b) => a[pastaTimePropertyKey]! - b[pastaTimePropertyKey]!),
  ),
) {
  const ascendingTimes = computed(() =>
    ascendingPastas.value.map((pasta) => pasta[pastaTimePropertyKey]),
  );
  const from = ref<ReturnType<Date["toISOString"]>>();
  const to = ref<ReturnType<Date["toISOString"]>>();

  const min = computed(() => ascendingTimes.value[0] || 0);
  const max = computed(() => ascendingTimes.value.at(-1) || 0);

  watchOnce([min, max], ([min, max]) => {
    from.value = time(min);
    to.value = time(max);
  });

  const appropriatePastas = computed(() => {
    if (from.value === undefined || to.value === undefined) {
      return ascendingPastas.value;
    }
    const minIndex = ascendingPastas.value.findIndex(
      (pasta) =>
        pasta[pastaTimePropertyKey]! >= new Date(from.value!).valueOf(),
    );
    const maximalIndex = ascendingPastas.value.findLastIndex(
      (pasta) => pasta[pastaTimePropertyKey]! <= new Date(to.value!).valueOf(),
    );
    const maxIndex = Math.max(minIndex, maximalIndex);
    return ascendingPastas.value.slice(minIndex, maxIndex + 1);
  });

  return {
    appropriatePastas,
    from,
    to,
    max: computed(() => time(ascendingTimes.value.at(-1) || 0)),
    min: computed(() => time(ascendingTimes.value[0] || 0)),
  };
}

export const usePastaFindStore = defineStore("pasta-find", () => {
  const pastasStore = usePastasStore();

  const sortedPastas = computed(() =>
    withLogSync(pastasStore.sortedPastas, "sortedPastas"),
  );

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

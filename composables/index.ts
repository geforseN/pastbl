export function useFindPastasTags(
  allPastas: Ref<IDBMegaPasta[]>,
  showedPastas: Ref<IDBMegaPasta[]>,
) {
  const minimalTagsCountToHave = ref(1);
  const mustRespectedMinimalTagsCount = ref(false);

  watch(
    () => mustRespectedMinimalTagsCount.value,
    (newMustRespectedMinimalTagsCount) => {
      console.log(
        "newMustRespectedMinimalTagsCount",
        newMustRespectedMinimalTagsCount,
      );
    },
  );

  const selectedPastaTags = ref<string[]>([]);
  const mustRespectSelectedTags = ref(true);

  const findTagStrategy = ref<"every" | "some">("every");

  const allUniqueTagsSortedByAlphabetCaseInsensitive = computed(() =>
    withLogSync(
      () =>
        [...new Set(allPastas.value.flatMap((pasta) => pasta.tags))].sort(
          (a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1),
        ),
      "allTagsSortedByAlphabet",
    ),
  );

  const showedPastasUniqueTags = computed(() => {
    return withLogSync(
      () => [...new Set(showedPastas.value.flatMap((pasta) => pasta.tags))],
      "showedPastasUniqueTags",
    );
  });

  const showedPastasTagsSortedByAlphabetCaseInsensitive = computed(() => {
    return withLogSync(
      () =>
        [...showedPastasUniqueTags.value].sort((a, b) =>
          a.toLowerCase() > b.toLowerCase() ? 1 : -1,
        ),
      "showedPastasTagsSortedByAlphabet",
    );
  });

  const pastasWithMinimalRequiredTagsCount = computed(() => {
    return withLogSync(
      () =>
        allPastas.value.filter(
          (pasta) => pasta.tags.length >= minimalTagsCountToHave.value,
        ),
      "pastasWithMinimalRequiredTagsCount",
    );
  });

  const pastasWithEverySelectedTag = computed(() =>
    withLogSync(
      () =>
        allPastas.value.filter((pasta) =>
          selectedPastaTags.value.every((selectedTag) =>
            pasta.tags.includes(selectedTag),
          ),
        ),
      "pastasWithEverySelectedTag",
    ),
  );

  const pastasWithSomeSelectedTag = computed(() =>
    withLogSync(
      () =>
        allPastas.value.filter((pasta) => {
          return selectedPastaTags.value.some((selectedTag) =>
            pasta.tags.includes(selectedTag),
          );
        }),
      "pastasWithSomeSelectedTag",
    ),
  );

  return {
    selectedPastaTags,
    mustRespectedMinimalTagsCount,
    mustRespectSelectedTags,
    minimalTagsCountToHave,
    tagsToSelect: computed(() => {
      if (!selectedPastaTags.value.length) {
        return allUniqueTagsSortedByAlphabetCaseInsensitive.value;
      }
      return showedPastasTagsSortedByAlphabetCaseInsensitive.value;
    }),
    pastasWithCurrentTagsStrategy: computed(() => {
      if (mustRespectSelectedTags.value && selectedPastaTags.value.length) {
        return pastasWithMinimalRequiredTagsCount.value;
      }
      return allPastas.value;
    }),
  };
}

export function useFindPastasLength(pastas: Ref<IDBMegaPasta[]>) {
  const { range, minValue: min, maxValue: max } = useFindMyPastaRange();
  const mustRespectLengthRange = ref(true);

  const lengthAppropriatePastas = computed(() =>
    withLogSync(
      () =>
        pastas.value.filter(
          (pasta) =>
            pasta.text.length >= range.value[0] &&
            pasta.text.length <= range.value[1],
        ),
      "lengthAppropriatePastas",
    ),
  );

  const lengthStrategyPastas = computed(() => {
    if (mustRespectLengthRange.value) {
      return lengthAppropriatePastas.value;
    }
    return pastas.value;
  });

  return {
    range,
    min,
    max,
    mustRespectLengthRange,
    lengthStrategyPastas,
  };
}

export function useFindPastaText(pastas: Ref<IDBMegaPasta[]>) {
  const text = ref("");

  function hasPastaTextOccurrence(pasta: IDBMegaPasta) {
    return pasta.text.toLowerCase().includes(text.value.toLowerCase());
  }

  const pastasWithTextOccurrence = computed(() =>
    pastas.value.filter(hasPastaTextOccurrence),
  );

  const textStrategyPastas = computed(() => {
    if (text.value.length) {
      return pastasWithTextOccurrence.value;
    }
    return pastas.value;
  });

  return {
    text,
    textStrategyPastas,
  };
}

export function useFindPastas(pastas: IDBMegaPasta[]) {
  const sortStrategy = ref<
    | "fromNewestToOldest"
    | "fromOldestToNewest"
    | "fromLongestToShortest"
    | "fromShortestToLongest"
  >("fromNewestToOldest");
}

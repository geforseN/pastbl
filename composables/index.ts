export function useFindPastasTags(
  allPastas: Ref<IDBMegaPasta[]>,
  showedPastas: Ref<IDBMegaPasta[]>,
) {
  const selectedPastaTags = ref<string[]>([]);
  const mustRespectSelectedTags = ref(true);

  const allPastasUniqueTagsSortedByAlphabetCaseInsensitive = computed(() =>
    withLogSync(
      () =>
        [...new Set(allPastas.value.flatMap((pasta) => pasta.tags))].sort(
          (a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1),
        ),
      "allTagsSortedByAlphabet",
    ),
  );

  const pastasWithSelectedTags = computed(() => {
    return withLogSync(
      () =>
        allPastas.value.filter((pasta) =>
          selectedPastaTags.value.every((selectedTag) =>
            pasta.tags.includes(selectedTag),
          ),
        ),
      "pastasWithMinimalRequiredTagsCount",
    );
  });

  const showedPastasTagsSortedByAlphabetCaseInsensitive = computed(() => {
    return withLogSync(
      () =>
        [...new Set(showedPastas.value.flatMap((pasta) => pasta.tags))].sort(
          (a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1),
        ),
      "showedPastasTagsSortedByAlphabet",
    );
  });

  return {
    selectedPastaTags,
    mustRespectSelectedTags,
    tagsToSelect: computed(() => {
      if (!selectedPastaTags.value.length) {
        return allPastasUniqueTagsSortedByAlphabetCaseInsensitive.value;
      }
      return showedPastasTagsSortedByAlphabetCaseInsensitive.value;
    }),
    tagsAppropriatePastas: computed(() => {
      if (mustRespectSelectedTags.value && selectedPastaTags.value.length) {
        return pastasWithSelectedTags.value;
      }
      return allPastas.value;
    }),
  };
}

export function useFindPastasLength(pastas: Ref<IDBMegaPasta[]>) {
  const { range, minValue: min, maxValue: max } = useFindMyPastaRange();
  const mustRespectLengthRange = ref(true);

  const pastasWithLengthOccurrence = computed(() =>
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

  const lengthAppropriatePastas = computed(() => {
    if (mustRespectLengthRange.value) {
      return pastasWithLengthOccurrence.value;
    }
    return pastas.value;
  });

  return {
    range,
    min,
    max,
    mustRespectLengthRange,
    lengthAppropriatePastas,
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

  const textAppropriatePastas = computed(() => {
    if (text.value.length) {
      return pastasWithTextOccurrence.value;
    }
    return pastas.value;
  });

  return {
    text,
    textAppropriatePastas,
  };
}

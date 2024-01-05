export function useFindPastasTags(
  allPastas: Ref<IDBMegaPasta[]>,
  showedPastas: Ref<IDBMegaPasta[]>,
) {
  const selectedPastaTags = ref<string[]>([]);
  const mustRespectSelectedTags = ref(true);

  const allPastasTags = computed(() => {
    const allPastaUniqueTags = [
      ...new Set(allPastas.value.flatMap((pasta) => pasta.tags)),
    ];
    return withLogSync(
      allPastaUniqueTags.sort((a, b) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : -1,
      ),
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
    const showedPastaUniqueTags = [
      ...new Set(showedPastas.value.flatMap((pasta) => pasta.tags)),
    ];
    return withLogSync(
      showedPastaUniqueTags.sort((a, b) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : -1,
      ),
      "showedPastasTags",
    );
  });

  return {
    selectedPastaTags,
    mustRespectSelectedTags,
    tagsToSelect: computed(() => {
      if (!selectedPastaTags.value.length) {
        return allPastasTags.value;
      }
      return showedPastasTags.value;
    }),
    tagsAppropriatePastas: computed(() => {
      if (mustRespectSelectedTags.value && selectedPastaTags.value.length) {
        return pastasWithSelectedTags.value;
      }
      return allPastas.value;
    }),
  };
}

export function useFindPastaLengthRange() {
  const pastasStore = usePastasStore();

  const minValue = computed(() => pastasStore.minPastaTextLengthInPastas);
  const maxValue = computed(() => pastasStore.maxPastaTextLengthInPastas);

  const range = ref<[number, number]>([minValue.value, maxValue.value]);

  watchOnce(
    () => minValue.value,
    (newMinValue) => (range.value[0] = newMinValue),
  );

  watchOnce(
    () => maxValue.value,
    (newMaxValue) => (range.value[1] = newMaxValue),
  );

  return {
    range,
    minValue,
    maxValue,
  };
}

export function useFindPastasLength(pastas: Ref<IDBMegaPasta[]>) {
  const { range, minValue: min, maxValue: max } = useFindPastaLengthRange();
  const mustRespectLengthRange = ref(true);

  function isPastaInRange(this: Ref<[number, number]>, pasta: IDBMegaPasta) {
    return (
      pasta.text.length >= this.value[0] && pasta.text.length <= this.value[1]
    );
  }
  const pastasWithLengthOccurrence = computed(() =>
    withLogSync(
      pastas.value.filter(
        isPastaInRange,
        range satisfies ThisParameterType<typeof isPastaInRange>,
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
    length: { range, min, max },
    mustRespectLengthRange,
    lengthAppropriatePastas,
  };
}

export function useFindPastaText(pastas: Ref<IDBMegaPasta[]>) {
  const text = ref("");

  function isPastaHasTextOccurrence(pasta: IDBMegaPasta) {
    return pasta.text.toLowerCase().includes(text.value.toLowerCase());
  }
  const pastasWithTextOccurrence = computed(() =>
    pastas.value.filter(isPastaHasTextOccurrence),
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

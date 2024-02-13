export function refWithDebounced<T>(value: T, delay = 700) {
  const valueAsRef = ref(value);
  const debounced = refDebounced(valueAsRef, delay);
  return [valueAsRef, debounced];
}

export function useFindPastasTags(
  allPastas: Ref<IDBMegaPasta[]>,
  showedPastas: Ref<IDBMegaPasta[]>,
  textToFind: Ref<string>,
  pastasWithTextOccurrence: Ref<IDBMegaPasta[]>,
) {
  const selectedPastaTags = ref<string[]>([]);
  const [mustRespectSelectedTags, debouncedMustRespect] = refWithDebounced(
    true,
    700,
  );

  const allPastasTags = computed(() => {
    const unique = [...new Set(allPastas.value.flatMap((pasta) => pasta.tags))];
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

  const _mySorter = (a: string, b: string) =>
    a.toLowerCase() > b.toLowerCase() ? 1 : -1;

  const showedPastasTags = computed(() => {
    const unique = [
      ...new Set(showedPastas.value.flatMap((pasta) => pasta.tags)),
    ];
    return withLogSync(unique.sort(_mySorter), "showedPastasTags");
  });

  const tagsOfPastasWithTextOccurrence = computed(() => {
    const tags = pastasWithTextOccurrence.value.flatMap((pasta) => pasta.tags);
    return withLogSync(
      [...new Set(tags)].sort(_mySorter),
      "tagsOfPastasWithTextOccurrence",
    );
  });

  return {
    selectedPastaTags,
    mustRespectSelectedTags,
    tagsToSelect: computed(() => {
      if (textToFind.value.length) {
        return tagsOfPastasWithTextOccurrence.value;
      }
      if (!selectedPastaTags.value.length) {
        return allPastasTags.value;
      }
      return showedPastasTags.value;
    }),
    tagsAppropriatePastas: computed(() => {
      if (debouncedMustRespect.value && selectedPastaTags.value.length) {
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

function isPastaInRange(this: Ref<[number, number]>, pasta: IDBMegaPasta) {
  return (
    pasta.text.length >= this.value[0] && pasta.text.length <= this.value[1]
  );
}

export function useFindPastasLength(pastas: Ref<IDBMegaPasta[]>) {
  const { range, minValue: min, maxValue: max } = useFindPastaLengthRange();
  const debouncedRange = refDebounced(range, 700);

  const mustRespectLengthRange = ref(true);
  const throttledMustRespect = refDebounced(mustRespectLengthRange, 700);

  const pastasWithLengthOccurrence = computed(() =>
    withLogSync(
      pastas.value.filter(
        isPastaInRange,
        debouncedRange satisfies ThisParameterType<typeof isPastaInRange>,
      ),
      "lengthAppropriatePastas",
    ),
  );

  const lengthAppropriatePastas = computed(() => {
    if (throttledMustRespect.value) {
      return pastasWithLengthOccurrence.value;
    }
    return pastas.value;
  });

  return {
    length: { range, min, max, debouncedRange },
    mustRespectLengthRange,
    lengthAppropriatePastas,
  };
}

function isPastaHasTextOccurrence(this: Ref<string>, pasta: IDBMegaPasta) {
  return pasta.text.toLowerCase().includes(this.value.toLowerCase());
}

export function useFindPastaText(pastas: Ref<IDBMegaPasta[]>) {
  const text = ref("");
  const debouncedText = refDebounced(text, 700);

  const pastasWithTextOccurrence = computed(() =>
    pastas.value.filter(
      isPastaHasTextOccurrence,
      debouncedText satisfies ThisParameterType<
        typeof isPastaHasTextOccurrence
      >,
    ),
  );

  const textAppropriatePastas = computed(() => {
    if (debouncedText.value.length) {
      return pastasWithTextOccurrence.value;
    }
    return pastas.value;
  });

  return {
    text,
    debouncedText,
    textAppropriatePastas,
    pastasWithTextOccurrence,
  };
}

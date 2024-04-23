function useFindPastasLengthRange({
  minCb,
  maxCb,
}: {
  minCb: () => number;
  maxCb: () => number;
}) {
  const min = computed(minCb);
  const max = computed(maxCb);

  const range = ref<[number, number]>([min.value, max.value]);

  watchOnce(
    () => min.value,
    (newMinValue) => (range.value[0] = newMinValue),
  );

  watchOnce(
    () => max.value,
    (newMaxValue) => (range.value[1] = newMaxValue),
  );

  return {
    range,
    min,
    max,
  };
}

function isPastaInRange(this: Ref<[number, number]>, pasta: IDBMegaPasta) {
  return (
    pasta.text.length >= this.value[0] && pasta.text.length <= this.value[1]
  );
}

export function useFindPastasLength(
  pastas: Ref<IDBMegaPasta[]>,
  {
    minCb,
    maxCb,
  }: {
    minCb: () => number;
    maxCb: () => number;
  },
) {
  const { range, min, max } = useFindPastasLengthRange({ minCb, maxCb });
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

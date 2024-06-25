function useFindPastasLengthRange({
  getMin,
  getMax,
}: {
  getMin: () => number;
  getMax: () => number;
}) {
  const min = computed(getMin);
  const max = computed(getMax);

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

function isPastaInRange(this: Ref<[number, number]>, pasta: OmegaPasta) {
  return (
    pasta.text.length >= this.value[0] && pasta.text.length <= this.value[1]
  );
}

export function useFindPastasLength(
  pastas: Ref<OmegaPasta[]>,
  {
    getMax,
    getMin,
  }: {
    getMax: () => number;
    getMin: () => number;
  },
) {
  const { range, min, max } = useFindPastasLengthRange({
    getMin,
    getMax,
  });
  const debouncedRange = refDebounced(range, 700);

  const mustRespectLengthRange = ref(true);
  const throttledMustRespect = refDebounced(mustRespectLengthRange, 700);

  const isInRange = isPastaInRange.bind(debouncedRange);

  const pastasWithLengthOccurrence = computed(() =>
    withLogSync(pastas.value.filter(isInRange), "lengthAppropriatePastas"),
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

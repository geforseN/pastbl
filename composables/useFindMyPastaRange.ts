export function useFindMyPastaRange() {
  const pastasStore = usePastasStore();

  const minValue = computed(() => pastasStore.minPastaTextLengthInPastas);
  const maxValue = computed(() => pastasStore.maxPastaTextLengthInPastas);

  const range = ref([minValue.value, maxValue.value]);

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

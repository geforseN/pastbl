export function usePastasTextLength(pastas: Ref<OmegaPasta[]>) {
  const pastasTextLength = computed(() =>
    pastas.value.map((pasta) => pasta.text.length),
  );

  return {
    min: computed(() =>
      pastasTextLength.value.length ? Math.min(...pastasTextLength.value) : 0,
    ),
    max: computed(() =>
      pastasTextLength.value.length ? Math.max(...pastasTextLength.value) : 0,
    ),
  };
}

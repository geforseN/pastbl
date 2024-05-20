function isPastaHasTextOccurrence(this: Ref<string>, pasta: OmegaPasta) {
  return pasta.text.toLowerCase().includes(this.value.toLowerCase());
}

export function useFindPastaText(pastas: Ref<OmegaPasta[]>) {
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

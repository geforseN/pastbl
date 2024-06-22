function isPastaHasTextOccurrence(this: Ref<string>, pasta: OmegaPasta) {
  return pasta.text.toLowerCase().includes(this.value.toLowerCase());
}

export function useFindPastaText(pastas: Ref<OmegaPasta[]>) {
  const text = ref("");
  const debouncedText = refDebounced(text, 700);

  const pastasWithTextOccurrence = computed(() =>
    pastas.value.filter(isPastaHasTextOccurrence.bind(debouncedText)),
  );

  const textAppropriatePastas = computed(() => {
    if (debouncedText.value.length > 0) {
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

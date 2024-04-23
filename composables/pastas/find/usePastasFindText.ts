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

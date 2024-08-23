export const usePastasStore = defineStore("pastas", () => {
  const personsEmoteCollections = usePersonsEmoteCollectionsStore();

  const pastas = usePastas(async () => await pastasService.getAll());

  const createPasta = usePastaCreate(pastas);
  const removePasta = usePastaRemove(pastas);
  const copyPasta = usePastaCopy(pastas);
  const putPasta = usePastaPut(pastas);

  const { selectedSortStrategy, sortedPastas } = usePastasSort(pastas.state);
  const {
    selectedShowStrategy,
    pastasToShow,
    usersPastasMap,
    isNoPastasToShow,
    isPersonTagShowStrategySelected,
  } = usePastasShow(
    sortedPastas,
    computed(() => personsEmoteCollections.selectedLogin.state),
  );
  const pastasTextLength = usePastasTextLength(pastas.state);
  const pastasTags = usePastasTags(pastas.state);

  const canShowPastas = computedAsync(async () => {
    await Promise.all([
      until(() => useEmotesStore().canUseUserEmotes).toBe(true),
      until(pastas.isReady).toBe(true, { timeout: 3500 }),
    ]).catch(() => {});
    return true;
  }, false);

  return {
    canShowPastas,
    async cancelPastasShowForOneTick() {
      const pastValue = canShowPastas.value;
      canShowPastas.value = false;
      await nextTick();
      canShowPastas.value = pastValue;
    },
    pastasTextLength,
    pastasToShow,
    usersPastasMap,
    isNoPastasToShow,
    isPersonTagShowStrategySelected,
    selectedShowStrategy,
    selectedSortStrategy,
    pastas,
    sortedPastas,
    pastasTags,
    createPasta,
    removePasta,
    copyPasta,
    putPasta,
  };
});

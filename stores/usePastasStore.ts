import { pastasIdbService } from "~/client-only/services";

export const usePastasStore = defineStore("pastas", () => {
  const pastas = usePastas(async () =>
    process.server ? [] : await pastasIdbService.getAll(),
  );

  const { selectedSortStrategy, sortedPastas } = usePastasSort(pastas.state);
  const { selectedShowStrategy, pastasToShow, usersPastasMap } = usePastasShow(
    sortedPastas,
    computed(() => useUserCollectionsStore().selectedLogin.state),
  );
  const pastasTextLength = usePastasTextLength(pastas.state);
  const pastasTags = usePastasTags(pastas.state);

  const canShowPastas = computedAsync(async () => {
    await Promise.all([
      until(() => useEmotesStore().canUseUserEmotes).toBe(true),
      until(pastas.isReady).toBe(true, { timeout: 3_500 }),
    ]).catch(() => {});
    return true;
  }, false);

  const toast = useMyToast();

  return {
    canShowPastas,
    async triggerRerender() {
      canShowPastas.value = false;
      await nextTick();
      canShowPastas.value = true;
    },
    pastasTextLength,
    pastasToShow,
    usersPastasMap,
    selectedShowStrategy,
    selectedSortStrategy,
    pastas,
    sortedPastas,
    pastasTags,
    async createPasta(basePasta: BasePasta) {
      const megaPasta = await makeMegaPasta2(basePasta).catch(toast.throw);
      const megaPastaWithId = await pastasIdbService.add(megaPasta);
      pastas.push(megaPastaWithId);
      toast.notify("success", "pastaCreated");
    },
    async removePasta(pasta: IDBMegaPasta) {
      const index = await pastas.getIndexById(pasta.id).catch(toast.throw);
      await pastasIdbService.moveFromListToBin(pasta);
      pastas.removeAt(index);
      toast.notify("warning", "pastaRemoved", async () => {
        await pastasIdbService.moveFromBinToList(pasta);
        pastas.pushAt(index, pasta);
      });
    },
    async patchPastaLastCopied(pasta: IDBMegaPasta) {
      const index = await pastas.getIndexById(pasta.id).catch(toast.throw);
      const newPasta = await pastasIdbService.patchLastCopied(toRaw(pasta));
      pastas.mutateAt(index, newPasta);
    },
    async putPasta(pasta: IDBMegaPasta) {
      const [index, oldPasta] = await pastas
        .getEntryById(pasta.id)
        .catch(toast.throw);
      assert.ok(
        !isPastasSame(oldPasta, pasta),
        toast.fail("pastaPut__sameValues"),
      );
      // FIXME: ?unsafe?, add error handler (toast) for put
      await pastasIdbService.put(pasta);
      pastas.mutateAt(index, pasta);
      toast.notify("success", "pastaPut");
    },
  };
});

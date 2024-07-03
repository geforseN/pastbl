import { pastasService } from "~/client-only/services/pastas";

export const usePastasStore = defineStore("pastas", () => {
  const userCollectionsStore = useUserCollectionsStore();

  const pastas = usePastas(pastasService.getAll);

  const { selectedSortStrategy, sortedPastas } = usePastasSort(pastas.state);
  const {
    selectedShowStrategy,
    pastasToShow,
    usersPastasMap,
    isNoPastasToShow,
    isPersonTagShowStrategySelected,
  } = usePastasShow(
    sortedPastas,
    computed(() => userCollectionsStore.selectedLogin.state),
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
    isNoPastasToShow,
    isPersonTagShowStrategySelected,
    selectedShowStrategy,
    selectedSortStrategy,
    pastas,
    sortedPastas,
    pastasTags,
    async createPasta(basePasta: BasePasta) {
      const megaPasta = await makeMegaPasta2(basePasta).catch(toast.throw);
      const megaPastaWithId = await pastasService.add(megaPasta);
      pastas.push(megaPastaWithId);
      toast.notify("success", "pastaCreated");
    },
    async removePasta(pasta: OmegaPasta) {
      const index = await pastas.getIndexById(pasta.id).catch(toast.throw);
      await pastasService.moveFromListToBin(pasta);
      pastas.removeAt(index);
      toast.notify("warning", "pastaRemoved", async function onCancel() {
        await pastasService.moveFromBinToList(pasta);
        pastas.pushAt(index, pasta);
      });
    },
    async patchPastaLastCopied(pasta: OmegaPasta) {
      const index = await pastas.getIndexById(pasta.id).catch(toast.throw);
      const newPasta = await pastasService.patchLastCopied(toRaw(pasta));
      pastas.mutateAt(index, newPasta);
    },
    async putPasta(pasta: OmegaPasta) {
      const [index, oldPasta] = await pastas
        .getEntryById(pasta.id)
        .catch(toast.throw);
      assert.ok(
        !isPastasSame(oldPasta, pasta),
        toast.fail("pastaPut__sameValues"),
      );
      await pastasService.put(pasta);
      pastas.mutateAt(index, pasta);
      toast.notify("success", "pastaPut");
    },
  };
});

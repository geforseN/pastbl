import { defineStore } from "pinia";
import { pastasService } from "~/client-only/services";

export const usePastasStore = defineStore("pastas", () => {
  const pastas = useAsyncState(
    async () => {
      if (typeof window === "undefined") {
        return [];
      }
      const pastas = await pastasService.getAll();
      return pastas;
    },
    [],
    { shallow: true, throwError: true },
  );
  const toast = useNuxtToast();
  const emotesStore = useEmotesStore();

  until(() => emotesStore.isInitialUserEmotesReady)
    .toBeTruthy({ timeout: 5_000 })
    .then(makeHack);

  async function makeHack() {
    const samePastas = pastas.state.value;
    pastas.state.value = [];
    await nextTick();
    pastas.state.value = samePastas;
    triggerRef(pastas.state);
  }

  function getPastaIndexById(id: number) {
    return getValidIndex(
      pastas.state.value,
      (pasta_) => pasta_.id === id,
      new ExtendedError(`Could not find pasta with id=${id}`, {
        title: "Failed to find pasta",
      }),
    );
  }
  return {
    makeHack,
    getPastaById(id: number) {
      const index = getPastaIndexById(id);
      return pastas.state.value[index];
    },
    pastas,
    pastasSortedByNewest: computed(() =>
      [...pastas.state.value].sort((a, b) => b.createdAt - a.createdAt),
    ),
    mostPopularTagsEntries: computed(() => {
      const allTags = pastas.state.value.flatMap((pasta) => pasta.tags);
      return Array.from(countAppearances(allTags)).sort(
        ([, aCount], [, bCount]) => bCount - aCount,
      );
    }),
    minPastaTextLengthInPastas: computed(() =>
      pastas.state.value.reduce(
        (min, pasta) => Math.min(min, pasta.text.length),
        0,
      ),
    ),
    maxPastaTextLengthInPastas: computed(() =>
      pastas.state.value.reduce(
        (max, pasta) => Math.max(max, pasta.text.length),
        0,
      ),
    ),
    async createPasta(basePasta: BasePasta) {
      assert.ok(
        basePasta.text.trim().length,
        new ExtendedError("Can not create pasta with empty text", {
          title: "Failed to create pasta",
        }),
      );
      const trimmedText = basePasta.text.trim().replaceAll("\n", "");
      const tags = toRaw(basePasta.tags);
      const megaPasta = createMegaPasta(trimmedText, tags);
      const megaPastaWithId = await pastasService
        .add(megaPasta)
        .catch((reason) => {
          withLogSync(reason, "addPastaFailReason");
          const error = new ExtendedError(
            "Pasta with the same text already exist",
            {
              title: "Failed to create pasta",
            },
          );
          // TODO: add action in toast, on click should focus to pasta with such text
          toast.add(error);
          throw error;
        });
      pastas.state.value.push(megaPastaWithId);
      triggerRef(pastas.state);
    },
    async removePasta(pasta: IDBMegaPasta) {
      const index = getPastaIndexById(pasta.id);
      await pastasService.moveFromListToBin(pasta);
      pastas.state.value.splice(index, 1);
      triggerRef(pastas.state);
      toast.add(
        new RemovePastaNotification({
          handleUndo: async () => {
            await pastasService.moveFromBinToList(pasta);
            pastas.state.value.splice(index, 0, pasta);
            triggerRef(pastas.state);
          },
        }),
      );
    },
    async updatePasta(pasta: IDBMegaPasta) {
      let index = -1;
      try {
        index = getPastaIndexById(pasta.id);
        const oldPasta = pastas.state.value[index];
        assert.ok(
          oldPasta.text !== pasta.text ||
            oldPasta.tags.toString() !== pasta.tags.toString(),
          new ExtendedError("Can not update pasta with the same text or tags", {
            title: "Failed to update pasta",
          }),
        );
      } catch (error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
        return;
      }
      await pastasService.put(pasta);
      pastas.state.value.splice(index, 1, pasta);
      triggerRef(pastas.state);
      toast.add({
        description: "Pasta update",
        title: "Pasta updated successfully",
        timeout: 7_000,
        color: "green",
      });
    },
  };
});

class RemovePastaNotification {
  title: string;
  color: import("@nuxt/ui/dist/runtime/types").NotificationColor;
  timeout: number;
  actions: import("@nuxt/ui/dist/runtime/types").NotificationAction[];
  description: string;

  constructor({ handleUndo }: { handleUndo: () => void }) {
    this.timeout = 7_000;
    this.color = "yellow";
    this.title = "Pasta removed";
    this.description = "This pasta got saved in bin";
    this.actions = [
      {
        color: "green",
        label: "Undo pasta remove",
        block: true,
        size: "md",
        click: handleUndo,
      },
    ];
  }
}

import { defineStore } from "pinia";
import { pastasService } from "~/client-only/services";

export type PastaSortStrategy =
  | "newest-first"
  | "oldest-first"
  | "last-updated"
  | "last-copied";

function usePastasSort(allPastas: Ref<IDBMegaPasta[]>) {
  const selectedSortStrategy = useIndexedDBKeyValue(
    "pasta-list:sort-strategy",
    "newest-first",
  );
  const pastasSortStrategies = {
    "newest-first": computed(() =>
      allPastas.value.toSorted((a, b) => b.createdAt - a.createdAt),
    ),
    "oldest-first": computed(() =>
      allPastas.value.toSorted((a, b) => a.createdAt - b.createdAt),
    ),
    "last-updated": computed(() =>
      allPastas.value.toSorted(
        (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
      ),
    ),
    "last-copied": computed(() =>
      allPastas.value.toSorted(
        /* FIXME: sorting is done incorrectly */
        (a, b) => (b.lastCopiedAt || 0) - (a.lastCopiedAt || 0),
      ),
    ),
  };
  const sortedPastas = computed(
    () => pastasSortStrategies[selectedSortStrategy.state.value].value,
  );

  return {
    selectedSortStrategy: computed({
      get() {
        return selectedSortStrategy.state.value;
      },
      set(value) {
        selectedSortStrategy.state.value = value;
      },
    }),
    sortedPastas,
  };
}

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
  const { selectedSortStrategy, sortedPastas } = usePastasSort(pastas.state);

  until(() => emotesStore.isInitialUserEmotesReady)
    .toBeTruthy({ timeout: 5_000 })
    .then(triggerRerender);

  async function triggerRerender() {
    /* TODO */
    await nextTick();
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
    triggerRerender,
    getPastaById(id: number) {
      const index = getPastaIndexById(id);
      return pastas.state.value[index];
    },
    selectedSortStrategy,
    pastas,
    sortedPastas,
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
          const error = new ExtendedError("Failed to create pasta", {
            title: "Pasta creation failed",
          });
          toast.add(error);
          throw error;
        });
      pastas.state.value = [...pastas.state.value, megaPastaWithId];
    },
    async removePasta(pasta: IDBMegaPasta) {
      const index = getPastaIndexById(pasta.id);
      await pastasService.moveFromListToBin(pasta);
      pastas.state.value = pastas.state.value.toSpliced(index, 1);
      toast.add(
        new RemovePastaNotification({
          handleUndo: async () => {
            await pastasService.moveFromBinToList(pasta);
            pastas.state.value = pastas.state.value.toSpliced(index, 0, pasta);
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
        return toast.add(error);
      }
      await pastasService.put(pasta);
      pastas.state.value = pastas.state.value.with(index, pasta);
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

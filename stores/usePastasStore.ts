import { defineStore } from "pinia";

export const usePastasStore = defineStore("pastas", () => {
  const pastas = useAsyncState(
    async () => {
      const pastasIdb = await import("~/client-only/IndexedDB").then(
        ({ idb }) => idb.pastas,
      );
      return withLog(() => pastasIdb.list.getAllPastas(), "pastas");
    },
    [],
    { shallow: true },
  );

  const toast = useNuxtToast();

  function getPastaIndexById(id: IDBMegaPasta["id"]) {
    const index = pastas.state.value.findIndex((pasta) => pasta.id === id);
    if (index === -1) {
      throw new ExtendedError(`Could not find pasta with id=${id}`, {
        title: "Failed to find pasta",
      });
    }
    return index;
  }

  const newPastas = ref<IDBMegaPasta[]>([]);
  watchArray(pastas.state, (_, __, addedPastas) => {
    newPastas.value = addedPastas;
  });

  return {
    pastas,
    newPastas,
    pastasSortedByNewest: computed(() =>
      [...pastas.state.value].sort((a, b) => b.createdAt - a.createdAt),
    ),
    mostPopularTagsEntries: computed(() => {
      return [
        ...pastas.state.value
          .flatMap((pasta) => pasta.tags)
          .reduce((acc, tag) => {
            const tagCount = acc.get(tag) || 0;
            acc.set(tag, tagCount + 1);
            return acc;
          }, new Map<string, number>())
          .entries(),
      ].sort(([, aCount], [, bCount]) => bCount - aCount) satisfies [
        tagValue: string,
        tagCount: number,
      ][];
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
      if (basePasta.text.trim().length === 0) {
        throw new ExtendedError("Can not create pasta with empty text", {
          title: "Failed to create pasta",
        });
      }
      const trimmedText = basePasta.text.trim().replaceAll("\n", "");
      const noIdPasta = createMegaPasta(trimmedText, basePasta.tags);
      const pastasIdb = await import("~/client-only/IndexedDB").then(
        ({ pastasIdb }) => pastasIdb,
      );
      const pasta = await pastasIdb.list.addPasta(noIdPasta).catch(() => {
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
      pastas.state.value.push(pasta);
      triggerRef(pastas.state);
    },
    async removePasta(pasta: IDBMegaPasta) {
      const index = getPastaIndexById(pasta.id);
      const pastasIdb = await import("~/client-only/IndexedDB").then(
        ({ pastasIdb }) => pastasIdb,
      );
      await pastasIdb.shared.movePastaFromListToBin(pasta);
      pastas.state.value.splice(index, 1);
      triggerRef(pastas.state);
      toast.add(
        new RemovePastaNotification({
          handleUndo: async () => {
            await pastasIdb.shared.movePastaFromBinToList(pasta);
            pastas.state.value.splice(index, 0, pasta);
            triggerRef(pastas.state);
          },
        }),
      );
    },
    trigger() {
      triggerRef(pastas.state);
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

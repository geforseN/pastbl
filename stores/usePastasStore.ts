import { defineStore } from "pinia";
import { pastasService } from "~/client-only/services";

export const usePastasStore = defineStore("pastas", () => {
  const pastas = useAsyncState(
    async () => {
      // FIXME: sleep is used for emotes (global and user) load
      // without sleep pastas are loaded faster than emotes and emote population fails, pastas are without emotes
      await sleep(1_000);
      return pastasService.getAll();
    },
    [],
    { shallow: true, throwError: true },
  );

  const toast = useNuxtToast();

  function getPastaIndexById(id: IDBMegaPasta["id"]) {
    const index = pastas.state.value.findIndex((pasta) => pasta.id === id);
    assert.ok(
      index >= 0,
      new ExtendedError(`Could not find pasta with id=${id}`, {
        title: "Failed to find pasta",
      }),
    );
    return index;
  }

  return {
    pastas,
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
      ].sort(([, aCount], [, bCount]) => bCount - aCount) satisfies Array<
        [tagValue: string, tagCount: number]
      >;
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
      const megaPasta = createMegaPasta(trimmedText, basePasta.tags);
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

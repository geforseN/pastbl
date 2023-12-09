import { defineStore } from "pinia";
import {
  templateStrings,
  type IEmote,
  type AvailableEmoteSource,
} from "~/integrations";

async function handleEmotePopulateForPastas(addedPastas: MegaPasta[]) {
  const foundEmotes = await veryCoolAlgorithm(addedPastas);
  for (const pasta of addedPastas) {
    pasta.populatedText = pasta.populatedText || pasta.text;
    for (const token of pasta.validTokens) {
      const emote = foundEmotes.find((emote) => emote.token === token);
      if (!emote) {
        continue;
      }
      const emoteTemplate: (emote: IEmote) => string = templateStrings[
        emote.source as AvailableEmoteSource
      ] as (emote: IEmote) => string;
      const emoteAsString = emoteTemplate(emote);
      pasta.populatedText = pasta.populatedText.replaceAll(
        token,
        emoteAsString,
      );
    }
  }
}

export const usePastasStore = defineStore("pastas", () => {
  const pastas = useAsyncState(
    async () => {
      const pastasIdb = await import("~/client-only/IndexedDB/index").then(
        ({ idb }) => idb.pastas,
      );
      const idbPastas = await pastasIdb.list.getAllPastas();
      if (process.dev) {
        // eslint-disable-next-line no-console
        console.log({ idbPastas });
      }
      return idbPastas;
    },
    [],
    { shallow: true },
  );

  const toast = useNuxtToast();

  watchArray(pastas.state, (_, __, addedPastas) => {
    handleEmotePopulateForPastas(addedPastas);
  });

  function getPastaIndexById(id: IDBMegaPasta["id"]) {
    const index = pastas.state.value.findIndex((pasta) => pasta.id === id);
    if (index === -1) {
      throw new ExtendedError(`Could not find pasta with id=${id}`, {
        title: "Failed to find pasta",
      });
    }
    return index;
  }

  const allTags = computed(() => {
    return [...new Set(pastas.state.value.flatMap((pasta) => pasta.tags))];
  });

  return {
    pastas,
    pastasSortedByNewest: computed(() =>
      [...pastas.state.value].sort((a, b) => b.createdAt - a.createdAt),
    ),
    allTags,
    allTagsSorted: computed(() =>
      [...allTags.value].sort((a, b) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : -1,
      ),
    ),
    allTagsSortedByLength: computed(() =>
      [...allTags.value].sort((a, b) => a.length - b.length),
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
      const newPasta = createMegaPasta(trimmedText, basePasta.tags);
      const pastasIdb = await import("~/client-only/IndexedDB/index").then(
        ({ pastasIdb }) => pastasIdb,
      );
      const idbPasta = await pastasIdb.list.addPasta(newPasta).catch(() => {
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
      pastas.state.value = [...pastas.state.value, idbPasta];
    },
    async removePasta(pastaToRemove: IDBMegaPasta) {
      const index = getPastaIndexById(pastaToRemove.id);
      const removedPasta = pastas.state.value[index];
      pastas.state.value = pastas.state.value.toSpliced(index, 1);
      const pastasIdb = await import("~/client-only/IndexedDB/index").then(
        ({ pastasIdb }) => pastasIdb,
      );
      await pastasIdb.transactions.movePastaFromListToBin(pastaToRemove);
      toast.add(
        new RemovePastaNotification({
          handleUndo: async () => {
            pastas.state.value = pastas.state.value.toSpliced(
              index,
              0,
              removedPasta,
            );
            await pastasIdb.transactions.movePastaFromBinToList(removedPasta);
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
    this.title = "Pasta remove";
    this.description = "Pasta got removed and also saved is pastas bin";
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

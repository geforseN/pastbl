import { defineStore } from "pinia";
import {
  templateStrings,
  type IEmote,
  type AvailableEmoteSource,
} from "~/integrations";

export type BasePasta = { text: string; tags: string[] };
export type MegaPasta = BasePasta & {
  length: number;
  createdAt: number;
  populatedText?: string;
  lastCopiedAt?: number;
  validTokens: string[];
};

export type IDBMegaPasta = {
  id: number;
} & MegaPasta;

export function createMegaPasta(
  trimmedText: BasePasta["text"],
  tags: BasePasta["tags"],
): MegaPasta {
  return {
    tags: toRaw(tags),
    text: trimmedText,
    length: trimmedText.length,
    createdAt: Date.now(),
    validTokens: getPastaValidTokens({ text: trimmedText }),
    lastCopiedAt: undefined,
    populatedText: undefined,
  };
}

export const usePastasStore = defineStore("pastas", () => {
  const pastas = ref<IDBMegaPasta[]>([]);

  const toast = useNuxtToast();

  const allTags = computed(() => {
    return [...new Set(pastas.value.flatMap((pasta) => pasta.tags))];
  });

  const mostPopularTagsMap = computed(() => {
    return [
      ...pastas.value
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
  });

  watchArray(pastas, async (_, __, addedPastas) => {
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
  });

  const pastas2 = useAsyncState(async () => {
    if (typeof window === "undefined") {
      return [];
    }
    const pastasIdb = await import("~/client-only/IndexedDB/index").then(
      ({ idb }) => idb.pastas,
    );
    const idbPastas = await pastasIdb.getAllPastas();
    if (process.dev) {
      // eslint-disable-next-line no-console
      console.log({ idbPastas });
    }
    return idbPastas;
  }, []);

  if (typeof window !== "undefined") {
    import("~/client-only/IndexedDB/index")
      .then(({ idb }) => idb.pastas)
      .then((pastasIdb) => pastasIdb.getAllPastas())
      .then((addedPastas) => {
        if (process.dev) {
          // eslint-disable-next-line no-console
          console.log({ addedPastas });
        }
        pastas.value = addedPastas;
      });
  }

  function getPastaIndexById(id: IDBMegaPasta["id"]) {
    const index = pastas.value.findIndex((pasta) => pasta.id === id);
    if (index === -1) {
      throw new ExtendedError(`Could not find pasta with id=${id}`, {
        title: "Failed to find pasta",
      });
    }
    return index;
  }

  const shallowRawPastas = computed(() =>
    pastas.value.map((pasta) => ({
      ...pasta,
      validTokens: toRaw(pasta.validTokens),
      tags: toRaw(pasta.tags),
    })),
  );

  return {
    allTags,
    allTagsSortedByLength: computed(() =>
      [...allTags.value].sort((a, b) => a.length - b.length),
    ),
    allTagsSorted: computed(() =>
      [...allTags.value].sort((a, b) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : -1,
      ),
    ),
    shallowRawPastas,
    shallowRawNewestPastas: computed(() =>
      [...shallowRawPastas.value].sort((a, b) => b.createdAt - a.createdAt),
    ),
    minPastaTextLengthInPastas: computed(() =>
      pastas.value.reduce((min, pasta) => Math.min(min, pasta.text.length), 0),
    ),
    maxPastaTextLengthInPastas: computed(() =>
      pastas.value.reduce((max, pasta) => Math.max(max, pasta.text.length), 0),
    ),
    mostPopularTagsMap,
    pastas,
    pastas2,
    pastasSortedByNewest: computed(() =>
      [...pastas.value].sort((a, b) => b.createdAt - a.createdAt),
    ),
    latestPasta: computed(() => pastas.value.at(-1)),
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
      const pastaId = await pastasIdb.addPasta(newPasta).catch(() => {
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
      const idbPasta: IDBMegaPasta = { ...newPasta, id: pastaId };
      pastas.value.push(idbPasta);
    },
    async removePasta(pastaToRemove: IDBMegaPasta) {
      const index = getPastaIndexById(pastaToRemove.id);
      const [removedPasta] = pastas.value.splice(index, 1);
      const pastasIdb = await import("~/client-only/IndexedDB/index").then(
        ({ pastasIdb }) => pastasIdb,
      );
      // TODO: remake two lines below, make it into one transaction (refactor pastas idb module)
      await pastasIdb.addPastaToBin(toRaw(pastaToRemove));
      await pastasIdb.removePastaById(pastaToRemove.id);
      toast.add(
        new RemovePastaNotification({
          handleUndo: async () => {
            pastas.value.splice(index, 0, removedPasta);
            // TODO: remake two lines below, make it into one transaction (refactor pastas idb module)
            await pastasIdb.removePastaFromBinById(removedPasta.id);
            await pastasIdb.addPasta(toRaw(removedPasta));
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

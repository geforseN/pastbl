/* import type {
  NotificationAction,
  NotificationColor,
} from "@nuxt/ui/dist/runtime/types"; */
import { defineStore } from "pinia";
import { zipsonStoreSerializer } from "#imports";
import {
  templateStrings,
  type IEmote,
  type AvailableEmoteSource,
} from "~/integrations";

export type Pasta = { text: string; tags: string[] };
export type MegaPasta = Pasta & {
  length: number;
  createdAt: number;
  populatedText?: string;
  // TODO use me
  lastCopiedAt?: number;
  validTokens: string[];
};

export type IDBMegaPasta = {
  id: number;
} & MegaPasta;

export const usePastasStore = defineStore(
  "pastas",
  () => {
    const pastas = ref<IDBMegaPasta[]>([]);
    const pastasBin = ref<IDBMegaPasta[]>([]);
    // const toast = useToast();

    const pastasSortedByNewest = computed(() =>
      [...pastas.value].sort((a, b) => b.createdAt - a.createdAt),
    );

    const allTags = computed(() => {
      return [...new Set(pastas.value.flatMap((pasta) => pasta.tags))];
    });

    const tagsSortedByLength = computed(() =>
      [...allTags.value].sort((a, b) => a.length - b.length),
    );

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
      ].sort(([, aCount], [, bCount]) => bCount - aCount);
    });

    const pastaDataForPopulation = computed(() => {
      return pastas.value
        .map((pasta) => {
          return {
            pasta,
            pastaTokens: getPastaValidTokens(pasta),
          };
        })
        .filter((data) => data.pastaTokens.length !== 0);
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

    function populatePastas({
      emoteMap,
      templateString,
    }: {
      emoteMap: ReadonlyMap<string, IEmote>;
      templateString: (emote: IEmote) => string;
    }) {
      pastaDataForPopulation.value
        .map(({ pasta, pastaTokens }) => {
          return {
            pasta,
            pastaTokens: pastaTokens.filter((token) => emoteMap.has(token)),
          };
        })
        .forEach(({ pasta, pastaTokens }) => {
          pasta.populatedText = pasta.populatedText || pasta.text;
          pastaTokens.forEach((token) => {
            const emote = emoteMap.get(token)!;
            pasta.populatedText = pasta.populatedText!.replaceAll(
              token,
              templateString(emote),
            );
          });
        });
    }

    function clearPopulatedTexts() {
      pastas.value.forEach((pasta) => (pasta.populatedText = undefined));
    }

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

    return {
      populatePastas,
      clearPopulatedTexts,
      allTags,
      tagsSortedByLength,
      shallowRawPastas: computed(() =>
        pastas.value.map((pasta) => ({
          ...pasta,
          validTokens: toRaw(pasta.validTokens),
          tags: toRaw(pasta.tags),
        })),
      ),
      minPastaTextLengthInPastas: computed(() =>
        pastas.value.reduce(
          (min, pasta) => Math.min(min, pasta.text.length),
          Number.POSITIVE_INFINITY,
        ),
      ),
      maxPastaTextLengthInPastas: computed(() =>
        pastas.value.reduce(
          (max, pasta) => Math.max(max, pasta.text.length),
          Number.NEGATIVE_INFINITY,
        ),
      ),
      mostPopularTagsMap,
      pastas,
      pastasSortedByNewest,
      pastasBin,
      latestPasta: computed(() => pastas.value.at(-1)),
      createPasta: async (pasta: Pasta) => {
        if (pasta.text.trim().length === 0) {
          throw new ExtendedError("Can not create pasta with empty text", {
            title: "Failed to create pasta",
          });
        }
        const trimmedText = pasta.text.trim().replaceAll("\n", "");
        // TODO add save to idb
        const newPasta = {
          tags: toRaw(pasta.tags),
          text: trimmedText,
          length: trimmedText.length,
          createdAt: Date.now(),
          validTokens: getPastaValidTokens(pasta),
          lastCopiedAt: undefined,
          populatedText: undefined,
        } satisfies MegaPasta;
        const pastasIdb = await import("~/client-only/IndexedDB/index").then(
          ({ pastasIdb }) => pastasIdb,
        );
        // TODO: add toast if failed to add pasta
        const pastaId = await pastasIdb.addPasta(newPasta);
        const idbPasta: IDBMegaPasta = { ...newPasta, id: pastaId };
        pastas.value.push(idbPasta);
        return idbPasta;
      },
      removePasta: async (pastaToRemove: IDBMegaPasta) => {
        const index = pastas.value.findIndex(
          (pasta) => pasta.createdAt === pastaToRemove.createdAt,
        );
        if (index === -1) {
          throw new ExtendedError(
            "Can not remove the pasta which is not exist",
          );
        }
        const [removedPasta] = pastas.value.splice(index, 1);
        const pastasIdb = await import("~/client-only/IndexedDB/index").then(
          ({ pastasIdb }) => pastasIdb,
        );
        await pastasIdb.removePastaById(pastaToRemove.id);
        // TODO: replace pinia store pastasBin to idb 'bin' store
        // NOTE: now store is not persisted, so deleted pastas can not be restored (so now pastasBin is useless)
        pastasBin.value.push(removedPasta);
        // toast.add(
        //   new RemovePastaNotification({
        //     handleUndo: () => {
        //       // TODO: remove  pastasBin, use idb 'bin' store
        //       const pastaIndexInBin = pastasBin.value.indexOf(removedPasta);
        //       // TODO: remove  pastasBin, use idb 'bin' store
        //       pastasBin.value.splice(pastaIndexInBin, 1);
        //       pastas.value.splice(index, 0, removedPasta);
        //       pastasIdb.idb.put("list", toRaw(removedPasta));
        //     },
        //   }),
        // );
      },
    };
  },
  {
    persist: false && {
      serializer: zipsonStoreSerializer,
      storage: persistedState.localStorage,
      paths: ["pastas", "pasta", "pastasBin"],
      afterRestore(context) {
        // NOTE: this is done because after each page reload text would populated over and over again,
        // so html tag wraps another html tag and populated text of pasta become invalid
        context.store.clearPopulatedTexts();
      },
    },
  },
);

/* 
class RemovePastaNotification {
  title: string;
  color: NotificationColor;
  timeout: number;
  actions: NotificationAction[];
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
 */

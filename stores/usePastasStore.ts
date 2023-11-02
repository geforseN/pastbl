import type {
  NotificationAction,
  NotificationColor,
} from "@nuxt/ui/dist/runtime/types";
import { defineStore } from "pinia";
import { zipsonStoreSerializer } from "#imports";
import type { IEmote } from "~/integrations";

export type Pasta = { text: string; tags: string[] };
export type MegaPasta = Pasta & {
  length: number;
  createdAt: number;
  populatedText?: string;
  // TODO use me
  lastCopiedAt?: number;
};

export const usePastasStore = defineStore(
  "pastas",
  () => {
    const pastas = ref<MegaPasta[]>([]);
    const pastasBin = ref<MegaPasta[]>([]);
    const toast = useToast();

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

    return {
      populatePastas,
      clearPopulatedTexts,
      allTags,
      tagsSortedByLength,
      mostPopularTagsMap,
      pastas,
      pastasSortedByNewest,
      pastasBin,
      latestPasta: computed(() => pastas.value.at(-1)),
      createPasta: (pasta: Pasta) => {
        if (pasta.text.trim().length === 0) {
          throw new ExtendedError("Can not create pasta with empty text", {
            title: "Failed to create pasta",
          });
        }
        const trimmedText = pasta.text.trim().replaceAll("\n", "");
        pastas.value?.push({
          tags: pasta.tags,
          text: trimmedText,
          length: trimmedText.length,
          createdAt: Date.now(),
        });
      },
      removePasta: (pastaToRemove: MegaPasta) => {
        const index = pastas.value.findIndex(
          (pasta) => pasta.createdAt === pastaToRemove.createdAt,
        );
        if (index === -1) {
          throw new ExtendedError(
            "Can not remove the pasta which is not exist",
          );
        }
        const [removedPasta] = pastas.value.splice(index, 1);
        pastasBin.value.push(removedPasta);
        toast.add(
          new RemovePastaNotification({
            handleUndo: () => {
              const pastaIndexInBin = pastasBin.value.indexOf(removedPasta);
              pastasBin.value.splice(pastaIndexInBin, 1);
              pastas.value.splice(index, 0, removedPasta);
            },
          }),
        );
      },
    };
  },
  {
    persist: {
      serializer: zipsonStoreSerializer,
      storage: persistedState.localStorage,
      paths: ["pastas", "pasta", "pastasBin"],
      afterRestore(context) {
        // console.log({
        //   pastas: context.store.pastas.map((pasta) => ({
        //     ...pasta,
        //     text: pasta.text.trim().replaceAll("\n", ""),
        //     length: pasta.text.trim().replaceAll("\n", "").length,
        //   })),
        // });
        // context.store.pastas = context.store.pastas.map((pasta) => ({
        //   ...pasta,
        //   text: pasta.text.trim().replaceAll("\n", ""),
        //   length: pasta.text.trim().replaceAll("\n", "").length,
        // }));
        // NOTE: this is done because after each page reload text would populated over and over again,
        // so html tag wraps another html tag and populated text of pasta become invalid
        context.store.clearPopulatedTexts();
      },
    },
  },
);

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

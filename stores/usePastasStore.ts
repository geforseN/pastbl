import type { Notification } from "@nuxt/ui/dist/runtime/types/notification";
import { defineStore } from "pinia";
import { stringify, parse } from "zipson";

export type Pasta = { text: string; tags: string[] };
export type MegaPasta = Pasta & { createdAt: number };

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

    const allTagsSortedByLength = computed(() =>
      [...allTags.value].sort((a, b) => a.length - b.length),
    );

    const allTagsMapSortedByMostPopular = computed(() => {
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

    return {
      allTags,
      allTagsSortedByLength,
      allTagsMapSortedByMostPopular,
      pastas,
      pastasSortedByNewest,
      pastasBin,
      latestPasta: computed(() => pastas.value.at(-1)),
      createPasta: async (pasta: Pasta) => {
        if (pasta.text.trim().length === 0) {
          throw new ExtendedError(
            "Pasta should contain any non space symbol, received empty text",
            {
              title: "Failed to create pasta",
            },
          );
        }
        pastas.value?.push({
          tags: pasta.tags,
          text: pasta.text.trimEnd(),
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
      serializer: {
        deserialize: parse,
        serialize: stringify,
      },
      storage: persistedState.localStorage,
      afterRestore(ctx) {
        if (ctx.store.pastas.length) {
          return console.log("User has pastas");
        }
        console.log("User does not have pastas, should add funny pasta");
        const funnyPasta: MegaPasta = {
          createdAt: Date.UTC(84, 8, 3, 3, 22),
          tags: ["1984", "soySmug"],
          text: "⣿⣿⣿⣿⣿⣿⠛⢉⡠⠴⠒⠚⠛⢛⣛⡂⠒⠀⠈⠙⠻⣿⣿⣿⣿⣿⣷⣿⣿⣿ ⣿⣿⣿⣿⠟⢁⣴⣿⡄⠒⣀⣉⣭⣤⣤⣤⣤⣤⣀⡀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⠏⢠⣿⣿⣿⣿⡟⠉⣠⣤⣤⣤⣄⡈⢹⡿⠛⠷⣦⠈⢿⣿⣿⣿⣿⣿⣿ ⣿⡿⠋⠀⠛⠛⠛⠿⠟⠀⠚⠛⠛⠛⠛⠉⠉⠉⠁⢀⡀⠀⠀⠀⠹⣿⣿⣿⣿⣿ ⣿⠀⢀⣶⣶⣶⠄⢰⣶⣶⡖⢠⣶⣶⣦⣄⠀⣶⠀⢀⣤⣤⡁⠀⠀⣿⣿⣿⣿⣿ ⣿⡄⢸⣿⣿⣿⡇⠸⣿⣿⠀⠛⠛⠛⢛⠛⠀⢸⠀⠈⠁⠠⣄⠀⠀⢿⣿⣿⣿⣿ ⣿⡇⢸⣿⣿⣿⣷⠀⠻⠿⠦⠀⠀⠀⠈⠁⣀⣼⣤⣄⠀⢤⣤⣤⣴⣄⠙⣿⣿⣿ ⣿⠃⠘⣿⣿⣿⣿⣷⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣷⡄⠙⠻⣿⣿⡇⢹⣿⣿ ⣿⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠿⣿⣿⣄⠀⢸⠿⠁⣾⣿⣿ ⣿⠆⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⣀⠐⠷⠆⠸⠿⠟⠁⠉⠀⢸⣿⣿⣿ ⣿⣷⠀⠀⠹⢿⣿⣿⣿⣿⣿⣿⣿⡟⢀⣾⠿⠷⠶⠖⠒⠀⢰⡦⠀⢀⣤⣽⣿⣿ ⣿⣿⠂⡀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣇⠸⢧⣤⣄⣀⣀⣀⣴⣏⠁⠀⣹⣿⣿⣿⣿ ⠛⢁⣴⣿⣄⠀⠀⠛⠿⣿⣿⣿⣿⣿⣶⠾⣿⣿⣿⣿⣿⡿⠁⠀⣰⣿⣿⣿⣿⣿ ⣾⣿⣿⣿⣿⣶⣄⣀⡀⠈⠛⠿⣿⣿⣿⡄⠻⢿⣿⣿⡿⠁⠀⣠⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⢀⠀⠈⠉⠉⠄⠀⠉⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿",
        };
        ctx.store.pastas.push(funnyPasta);
      },
      paths: ["pastas", "pasta", "pastasBin"],
    },
  },
);

class RemovePastaNotification implements Partial<Notification> {
  constructor({ handleUndo }: { handleUndo: () => void }) {
    this.timeout = 7_000;
    this.title = "Pasta remove";
    this.color = "yellow";
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

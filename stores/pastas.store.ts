import { defineStore } from "pinia";
import { stringify, parse } from "zipson";

export type Pasta = { text: string; tags: string[] };
export type MegaPasta = Pasta & { createdAt: number };

export const usePastasStore = defineStore(
  "pastas",
  () => {
    const pastas = ref<MegaPasta[]>([]);
    const isLoaded = ref(false);
    const isLoaded_ = useState("isPastasStoreLoaded", () => false);
    const pastasBin = ref<MegaPasta[]>([]);
    const toast = useToast();

    const pastasSortedByNewest = computed(() =>
      pastas.value.toSorted((a, b) => b.createdAt - a.createdAt)
    );

    return {
      pastas,
      pastasSortedByNewest,
      isLoaded,
      isLoaded_,
      pastasBin,
      latestPasta: computed(() => pastas.value.at(-1)),
      createPasta: async (pasta: Pasta) => {
        if (pasta.text.trim().length === 0) {
          throw new ExtendedError(
            "Pasta should contain any non space symbol, received empty text",
            {
              title: "Failed to create pasta",
            }
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
          (pasta) => pasta.createdAt === pastaToRemove.createdAt
        );
        if (index === -1) {
          throw new ExtendedError(
            "Can not remove the pasta which is not exist"
          );
        }
        const [removedPasta] = pastas.value.splice(index, 1);
        pastasBin.value.push(removedPasta);
        toast.add({
          timeout: 7_000,
          title: "Pasta remove",
          color: "yellow",
          description: "Pasta got removed and also saved is pastas bin",
          actions: [
            {
              color: "green",
              label: "Undo pasta remove",
              block: true,
              size: "md",
              click: () => {
                const pastaIndexInBin = pastasBin.value.indexOf(removedPasta);
                if (index === -1) {
                  throw new Error("Internal logic error");
                }
                pastasBin.value.splice(pastaIndexInBin, 1);
                pastas.value.splice(index, 0, removedPasta);
              },
            },
          ],
        });
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
        ctx.store.isLoaded = true;
        ctx.store.isLoaded_ = true;
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
  }
);

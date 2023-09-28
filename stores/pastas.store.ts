import { useUserStore } from "./user.store";
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

    return {
      pastas,
      isLoaded,
      isLoaded_,
      latestPasta: computed(() => pastas.value.at(-1)),
      createPasta: async (pasta: Pasta) => {
        if (pasta.text.length === 0) {
          throw new ExtendedError(
            "Pasta should contain any text, received empty",
            {
              title: "Failed to create pasta",
            }
          );
        }
        pastas.value?.push({
          tags: pasta.tags,
          text: pasta.text,
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
        pastas.value.splice(index, 1);
      },
    };
  },
  {
    persist: {
      serializer: {
        deserialize: parse,
        serialize: (value) => {
          return stringify(value, {});
        },
      },
      storage: persistedState.localStorage,
      afterRestore(ctx) {
        ctx.store.isLoaded = true;
        ctx.store.isLoaded_ = true;
        if (ctx.store.pastas.length) {
          return console.log("has pastas");
        }
        console.log("no pastas, should add funny pasta");
        const funnyPasta: MegaPasta = {
          createdAt: Date.UTC(84, 8, 3, 3, 22),
          tags: ["1984", "soySmug"],
          text: "⣿⣿⣿⣿⣿⣿⠛⢉⡠⠴⠒⠚⠛⢛⣛⡂⠒⠀⠈⠙⠻⣿⣿⣿⣿⣿⣷⣿⣿⣿ ⣿⣿⣿⣿⠟⢁⣴⣿⡄⠒⣀⣉⣭⣤⣤⣤⣤⣤⣀⡀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⠏⢠⣿⣿⣿⣿⡟⠉⣠⣤⣤⣤⣄⡈⢹⡿⠛⠷⣦⠈⢿⣿⣿⣿⣿⣿⣿ ⣿⡿⠋⠀⠛⠛⠛⠿⠟⠀⠚⠛⠛⠛⠛⠉⠉⠉⠁⢀⡀⠀⠀⠀⠹⣿⣿⣿⣿⣿ ⣿⠀⢀⣶⣶⣶⠄⢰⣶⣶⡖⢠⣶⣶⣦⣄⠀⣶⠀⢀⣤⣤⡁⠀⠀⣿⣿⣿⣿⣿ ⣿⡄⢸⣿⣿⣿⡇⠸⣿⣿⠀⠛⠛⠛⢛⠛⠀⢸⠀⠈⠁⠠⣄⠀⠀⢿⣿⣿⣿⣿ ⣿⡇⢸⣿⣿⣿⣷⠀⠻⠿⠦⠀⠀⠀⠈⠁⣀⣼⣤⣄⠀⢤⣤⣤⣴⣄⠙⣿⣿⣿ ⣿⠃⠘⣿⣿⣿⣿⣷⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣷⡄⠙⠻⣿⣿⡇⢹⣿⣿ ⣿⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠿⣿⣿⣄⠀⢸⠿⠁⣾⣿⣿ ⣿⠆⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⣀⠐⠷⠆⠸⠿⠟⠁⠉⠀⢸⣿⣿⣿ ⣿⣷⠀⠀⠹⢿⣿⣿⣿⣿⣿⣿⣿⡟⢀⣾⠿⠷⠶⠖⠒⠀⢰⡦⠀⢀⣤⣽⣿⣿ ⣿⣿⠂⡀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣇⠸⢧⣤⣄⣀⣀⣀⣴⣏⠁⠀⣹⣿⣿⣿⣿ ⠛⢁⣴⣿⣄⠀⠀⠛⠿⣿⣿⣿⣿⣿⣶⠾⣿⣿⣿⣿⣿⡿⠁⠀⣰⣿⣿⣿⣿⣿ ⣾⣿⣿⣿⣿⣶⣄⣀⡀⠈⠛⠿⣿⣿⣿⡄⠻⢿⣿⣿⡿⠁⠀⣠⣿⣿⣿⣿⣿⣿ ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⢀⠀⠈⠉⠉⠄⠀⠉⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿",
        };
        ctx.store.pastas.push(funnyPasta);
      },
      paths: ["pastas", "pasta"],
    },
  }
);

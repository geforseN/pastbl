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

    async function createPasta(pasta: Pasta) {
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
    }

    return {
      pastas,
      createPasta,
      isLoaded,
      isLoaded_,
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
      afterRestore(ctx) {},
      paths: ["pastas", "pasta"],
    },
  }
);

// setTimeout(() => {
//   ctx.store.isLoaded_ = true;
// }, 2_000);

// console.log("loaded");
// console.log(ctx.store);
// console.log(ctx.store.pastas);
// ctx.store.pastas ||= [];
// isPastasStoreLoaded.value = true;

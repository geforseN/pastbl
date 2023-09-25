import { defineStore } from "pinia";

export type Pasta = { text: string; tags: string[] };

export const usePastasStore = defineStore(
  "pastas",
  () => {
    const pastas = ref<Pasta[]>([]);

    async function createPasta(pasta: Pasta) {
      if (pasta.text.length === 0) {
        throw new ExtendedError(
          "Pasta should contain any text, received empty",
          {
            title: "Failed to create pasta",
          }
        );
      }
      pastas.value.push(pasta);
      return;
    }

    return { pastas, createPasta };
  },
  { persist: true }
);

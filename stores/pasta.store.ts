import { defineStore } from "pinia";

export const usePastaStore = defineStore(
  "pasta",
  () => {
    const pasta = usePasta();
    return {
      ...pasta,
      pastaValue: computed(() => ({
        tag: pasta.tag,
        tags: pasta.tags,
        text: pasta.text,
      })),
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);

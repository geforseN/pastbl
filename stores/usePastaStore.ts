import { defineStore } from "pinia";

export const usePastaStore = defineStore(
  "pasta",
  () => {
    return {
      ...usePasta(),
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);

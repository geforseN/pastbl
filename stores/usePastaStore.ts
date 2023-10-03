import { defineStore } from "pinia";

export const usePastaStore = defineStore(
  "pasta",
  () => {
    const pasta = usePasta();
    const toast = useToast();

    async function handleTagAddToPasta() {
      try {
        await pasta.addTag(pasta.tag.value);
      } catch (error) {
        if (!(error instanceof ExtendedError)) {
          throw error;
        }
        toast.add({
          description: error.description,
          title: error.title,
          color: error.color,
        });
      }
    }

    return {
      ...pasta,
      handleTagAddToPasta,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);

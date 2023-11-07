import { defineStore } from "pinia";

export const usePastaStore = defineStore(
  "pasta",
  () => {
    const pasta = usePasta();
    const toast = useToast();

    function handleTagAddToPasta() {
      try {
        pasta.addTag(pasta.tag.value);
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
    persist: false && {
      storage: persistedState.localStorage,
    },
  },
);

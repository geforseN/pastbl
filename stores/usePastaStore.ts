import { defineStore } from "pinia";

export const usePastaStore = defineStore("pasta", () => {
  const pasta = usePasta();
  const toast = useNuxtToast();

  return {
    pasta,
    handleTagAddToPasta() {
      try {
        pasta.addTag(pasta.tag.value);
      } catch (error) {
        assert.ok(error instanceof ExtendedError);
        toast.add({
          description: error.description,
          title: error.title,
          color: error.color,
        });
      }
    },
  };
});

// watchThrottled on input and then put data to idb

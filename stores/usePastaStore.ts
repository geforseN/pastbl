import { defineStore } from "pinia";

export const usePastaStore = defineStore("pasta", () => {
  const text = useIdbKeyValue("pasta:text", "");
  // TODO: add useIdbKeyValue support for set value to array
  const tags = ref<string[]>([]);
  const tag = useIdbKeyValue("pasta:tag", "");

  const pasta = usePasta({
    text: text.state,
    tag: tag.state,
    tags,
  });
  const toast = useNuxtToast();

  return {
    pasta,
    handleTagAddToPasta() {
      try {
        pasta.addTag(pasta.tag.value);
      } catch (error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
      }
    },
  };
});

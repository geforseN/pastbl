export const usePastaStore = defineStore("pasta", () => {
  const text = useIndexedDBKeyValue("pasta:text", "");
  const tags = useIndexedDBKeyValue("pasta:tags", []);
  const tag = useIndexedDBKeyValue("pasta:tag", "");

  const pasta = usePasta({
    text: text.state,
    tag: tag.state,
    tags: tags.state,
  });
  const toast = useNuxtToast();

  return {
    pasta,
    pastaTrimmedText: computed(() => trimPastaText(text.state.value)),
    handleTagAddToPasta() {
      try {
        pasta.addTag(pasta.tag.value);
      } catch (error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
      }
    },
    text,
  };
});

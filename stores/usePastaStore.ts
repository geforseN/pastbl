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

  const debouncedPastaText = refDebounced(pasta.text, 200);

  return {
    pasta,
    pastaTrimmedText: computed(() => megaTrim(debouncedPastaText.value)),
    handleTagAddToPasta(newTag: string) {
      try {
        pasta.addTag(newTag);
        tag.state.value = "";
      } catch (error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
      }
    },
    text,
  };
});

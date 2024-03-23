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

  const postPasta = () => {
    return $fetch("/api/pastas", {
      method: "POST",
      body: {
        text: pasta.text.value,
        tags: pasta.tags.value,
      },
    });
  };

  return {
    postPasta,
    pasta,
    pastaTrimmedText: computed(() => megaTrim(debouncedPastaText.value)),
    addTag(newTag: string) {
      try {
        pasta.addTag(newTag);
        tag.state.value = "";
      } catch (error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
      }
    },
    text,
    addInputTag() {
      return this.addTag(pasta.tag.value);
    },
  };
});

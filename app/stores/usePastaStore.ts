export const usePastaStore = defineStore("pasta", () => {
  const text = useIndexedDBKeyValue("pasta-form-input:tag", "");
  const tags = useIndexedDBKeyValue("pasta-form-input:tags", []);
  const tag = useIndexedDBKeyValue("pasta-form-input:tag", "");

  const pasta = usePasta({
    text: text.state,
    tag: tag.state,
    tags: tags.state,
  });
  const toast = useMyToast();

  const debouncedPastaText = refDebounced(pasta.text, 200);
  const publishPasta = usePublishPasta(pasta);

  return {
    publishPasta,
    postPasta: publishPasta.postPasta,
    pasta,
    pastaTrimmedText: computed(() => megaTrim(debouncedPastaText.value)),
    addTag(newTag: string) {
      try {
        pasta.addTag(newTag);
        tag.state.value = "";
      } catch (error) {
        toast.throw(error);
      }
    },
    text,
    addInputTag() {
      return this.addTag(pasta.tag.value);
    },
  };
});

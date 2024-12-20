function usePastaAddTag(
  pasta: ReturnType<typeof usePasta>,
  tagInput: Ref<string>,
) {
  const __toast__ = usePastaTagAddToasts();
  return function (newTag: string) {
    try {
      pasta.addTag(newTag);
      tagInput.value = "";
    } catch (error) {
      __toast__.panic(error);
    }
  };
}

export const usePastaStore = defineStore("pasta", () => {
  const text = useIndexedDBKeyValue("pasta-form-input:tag", "");
  const tags = useIndexedDBKeyValue("pasta-form-input:tags", []);
  const tag = useIndexedDBKeyValue("pasta-form-input:tag", "");

  const pasta = usePasta({
    text: text.state,
    tag: tag.state,
    tags: tags.state,
  });

  const addTag = usePastaAddTag(pasta, tag.state);

  const debouncedPastaText = refDebounced(pasta.text, 200);
  const publishPasta = usePublishPasta(pasta);

  return {
    publishPasta,
    postPasta: publishPasta.postPasta,
    pasta,
    pastaTrimmedText: computed(() => megaTrim(debouncedPastaText.value)),
    addTag,
    text,
    addInputTag() {
      return this.addTag(pasta.tag.value);
    },
  };
});

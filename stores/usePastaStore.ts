export const PASTAS_API = {
  postPasta(text: string, tags: string[], isPublic: boolean) {
    return $fetch("/api/pastas", {
      method: "POST",
      body: {
        text,
        tags,
        publicity: isPublic ? "public" : "private",
      },
    });
  },
  deletePasta(pastaId: number) {
    return $fetch(`/api/pastas/${pastaId}`, { method: "DELETE" });
  },
  getPastas(cursor: string | null) {
    return $fetch("/api/pastas", {
      query: {
        cursor,
      },
    });
  },
};

function usePublishPasta(pasta: { tags: Ref<string[]>; text: Ref<string> }) {
  const isPublicPasta = useIndexedDBKeyValue("pasta:is-public", false);

  return {
    isPublicPasta,
    postPasta() {
      return PASTAS_API.postPasta(
        pasta.text.value,
        pasta.tags.value,
        isPublicPasta.state.value,
      );
    },
  };
}

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

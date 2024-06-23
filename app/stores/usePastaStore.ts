import { pastasAPI } from "~/resources/pastas";

function usePublishPasta(pasta: { tags: Ref<string[]>; text: Ref<string> }) {
  const isPublicPasta = useIndexedDBKeyValue("pasta:is-public", false);

  return {
    isPublicPasta,
    postPasta() {
      return pastasAPI.postPasta(
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

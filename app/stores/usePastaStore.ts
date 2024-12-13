import { computed } from "vue";
import { refDebounced } from "@vueuse/core";
import type { Ref } from "vue";
import { megaTrim } from "../utils/string";
import { usePublishPasta } from "../../layers/pastas/layers/remote-pastas/composables/usePublishPasta";
import { useIndexedDBKeyValue } from "../../layers/key-value/indexed-db/composables/useIndexedDBKeyValue";
import { defineStore } from "../../node_modules//@pinia+nuxt@0@0@4@5@3@5/node_modules/@pinia/nuxt/dist/runtime/composables";
import { usePastaTagAddToasts } from "../../layers/pastas/layers/chat-pasta/utils/pasta-tag-add-toasts";
import { usePasta } from "../../layers/pastas/layers/chat-pasta/composables/usePasta";

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

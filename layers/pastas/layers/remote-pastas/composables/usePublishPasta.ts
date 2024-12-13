import { pastasAPI } from "../utils/pastas.api";
import { useIndexedDBKeyValue } from "../../../../key-value/indexed-db/composables/useIndexedDBKeyValue";

export function usePublishPasta(pasta: {
  tags: Ref<string[]>;
  text: Ref<string>;
}) {
  const isPublicPasta = useIndexedDBKeyValue(
    "remote-pasta-form-input:is-public",
    false,
  );

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

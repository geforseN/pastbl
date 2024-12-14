import { transformPastaTag, ensurePastaTagLengthIsOk, definePastaTagsEnsure } from "../utils/pasta-tag";
import { megaTrim } from "../../../../../app/utils/string";
import { NonExistingPastaTagError } from "../utils/pasta-tag-errors";
import { withRemoved } from "../../../../../app/utils/array";

export function usePastaTags(tags: Ref<string[]>) {
  const ensurePastaTags = definePastaTagsEnsure(tags);
  return {
    removeTag(tag: string) {
      tags.value = withRemoved(tags, tag, () => new NonExistingPastaTagError());
    },
    removeAllTags() {
      tags.value = [];
    },
    addTag(tag: string) {
      ensurePastaTags.canHaveMore();
      const trimmed = megaTrim(tag);
      ensurePastaTagLengthIsOk(trimmed);
      ensurePastaTags.hasNoSameTag(trimmed);
      const final = transformPastaTag(tag);
      tags.value.push(final);
    },
  };
}

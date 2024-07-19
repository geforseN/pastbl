export function usePastaTags(tags: Ref<string[]>) {
  const ensurePastaTags = definePastaTagsEnsure(tags);
  return {
    removeTag(tag: string) {
      tags.value = withRemoved(
        tags,
        tag,
        createNoTranslationFailureNotification("removePastaTag__noExist"),
      );
    },
    removeAllTags() {
      tags.value = [];
    },
    addTag(tag: string) {
      ensurePastaTags.canHaveMore();
      const trimmed = megaTrim(tag);
      ensurePastaTag.lengthIsOk(trimmed);
      ensurePastaTags.hasNoSameTag(trimmed);
      const final = transformPastaTag(tag);
      tags.value.push(final);
    },
  };
}

export function usePastaTags(tags: Ref<string[]>) {
  const { t } = useI18n();

  return {
    removeTag(tag: string) {
      tags.value = withRemoved(
        tags,
        tag,
        new ExtendedError(t("toast.removeTag.fail.noExistMessage"), {
          title: t("toast.removeTag.fail.title"),
        }),
      );
    },
    removeAllTags() {
      tags.value = [];
    },
    addTag(tag: string) {
      ensurePastaTags.canHaveMore(tags, t);
      const trimmed = megaTrim(tag);
      ensurePastaTag.lengthIsOk(trimmed, t);
      ensurePastaTags.hasNoSameTag(tags, trimmed, t);
      const final = transformPastaTag(tag);
      tags.value.push(final);
    },
  };
}

import { pastaTagLength, pastaTagsCount } from "~~/config/const";
import { makeLengthStatusGetter } from "~/utils/length-status";

export function isPastaMentionTagLike(tag: string) {
  return tag.startsWith("@");
}

export function transformPastaTag(tag: string) {
  if (isPastaMentionTagLike(tag)) {
    return toLowerCase(tag);
  }
  return tag;
}

export function parseLoginFromPastaMentionTag(mentionTag: string) {
  return mentionTag.replace("@", "");
}

export function definePastaTagsEnsure(tags: Ref<string[]>) {
  return {
    canHaveMore() {
      assert.ok(
        toValue(tags).length < pastaTagsCount.max,
        createNoTranslationFailureNotification("addPastaTag__toManyTags"),
      );
    },
    hasNoSameTag(tag: MaybeRef<string>) {
      const tag_ = toValue(tag);
      assert.ok(
        !toValue(tags).includes(tag_),
        createNoTranslationFailureNotification("addPastaTag__sameTag", tag_),
      );
    },
  };
}

export const getTagLengthStatus = makeLengthStatusGetter(pastaTagLength);

export const ensurePastaTag = {
  lengthIsOk(tag: MaybeRef<string>) {
    const status = getTagLengthStatus(toValue(tag));
    assert.ok(
      status === "ok",
      createNoTranslationFailureNotification("addPastaTag__badLength", status),
    );
  },
};

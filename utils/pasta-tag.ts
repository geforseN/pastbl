import { pastaTagLength, pastaTagsCount } from "~~/config/const";
import { makeLengthStatus } from "~/utils/make-length-status";
import { toLowerCase } from "~/utils/string";
import { assert } from "~/utils/error";

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
        createNoLocaleFailureNotification("addPastaTag__toManyTags"),
      );
    },
    hasNoSameTag(tag: MaybeRef<string>) {
      const tag_ = toValue(tag);
      assert.ok(
        !toValue(tags).includes(tag_),
        createNoLocaleFailureNotification("addPastaTag__sameTag", tag_),
      );
    },
  };
}

export const getTagLengthStatus = makeLengthStatus(pastaTagLength);

export const ensurePastaTag = {
  lengthIsOk(tag: MaybeRef<string>) {
    const status = getTagLengthStatus(toValue(tag));
    assert.ok(
      status === "ok",
      createNoLocaleFailureNotification("addPastaTag__badLength", status),
    );
  },
};

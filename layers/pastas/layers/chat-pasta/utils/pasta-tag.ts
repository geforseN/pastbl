import { makeLengthStatusGetter } from "~/utils/length-status";
import { pastasConfig } from "$/pastas/app.config";

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
        toValue(tags).length < pastasConfig.pastaTags.count.max,
        () => new ToManyPastaTagsError(),
      );
    },
    hasNoSameTag(tag: MaybeRef<string>) {
      const tag_ = toValue(tag);
      assert.ok(
        !toValue(tags).includes(tag_),
        () => new SamePastaTagError(tag_),
      );
    },
  };
}

export const getTagLengthStatus = makeLengthStatusGetter(
  pastasConfig.pastaTag.length,
);

export function ensurePastaTagLengthIsOk(tag: MaybeRef<string>) {
  const lengthStatus = getTagLengthStatus(toValue(tag));
  if (lengthStatus !== "ok") {
    throw new BadPastaTagLengthError(lengthStatus);
  }
}

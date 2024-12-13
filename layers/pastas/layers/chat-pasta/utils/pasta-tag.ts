import type { MaybeRef, toValue, Ref } from "vue";
import { assert } from "../../../../../app/utils/assert";
import { toLowerCase } from "../../../../../app/utils/string";
import { makeLengthStatusGetter } from "../../../../../app/utils/length-status.ts";
import { pastasConfig } from "../../../config.ts";
import { BadPastaTagLengthError, SamePastaTagError, ToManyPastaTagsError } from "./pasta-tag-errors";

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

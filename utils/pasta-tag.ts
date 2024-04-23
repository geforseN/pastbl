import { pastaTagLength, pastaTagsCount } from "~/config/const";

export function isPastaMentionTagLike(tag: string) {
  return tag.startsWith("@");
}

export function transformPastaTag(tag: string) {
  if (isPastaMentionTagLike(tag)) {
    return tag.toLowerCase();
  }
  return tag;
}

export function parseLoginFromPastaMentionTag(mentionTag: string) {
  return mentionTag.replace("@", "");
}

export const getTagLengthStatus = makeLengthStatus(pastaTagLength);

type _T = (str: string, ...args: any[]) => string;

const _getTitle = (t: _T) => t("toast.addTag.fail.title");
const _getTitleObject = (t: _T) => ({ title: _getTitle(t) });

export const ensurePastaTags = {
  canHaveMore(tags: MaybeRef<string[]>, t: _T) {
    assert.ok(
      toValue(tags).length < pastaTagsCount.max,
      new ExtendedError(
        t("toast.addTag.fail.tooManyTags", pastaTagsCount),
        _getTitleObject(t),
      ),
    );
  },
  hasNoSameTag(tags: MaybeRef<string[]>, tag: MaybeRef<string>, t: _T) {
    assert.ok(
      !toValue(tags).includes(toValue(tag)),
      new ExtendedError(t("toast.addTag.fail.sameMessage"), _getTitleObject(t)),
    );
  },
};

export const ensurePastaTag = {
  lengthIsOk(tag: MaybeRef<string>, t: _T) {
    const status = getTagLengthStatus(toValue(tag));
    assert.ok(
      status === "ok",
      new ExtendedError(
        t(`toast.addTag.fail.${status}Message`, pastaTagLength),
        _getTitleObject(t),
      ),
    );
  },
};

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

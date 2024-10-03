export const addPastaTagToasts = createActionToasts("add-pasta-tag", {
  failures: {
    badLength(status: BadLengthStatus) {
      return new BadPastaTagLengthError(status).toToast(this);
    },
    sameTag(tag: string) {
      return new SamePastaTagError(tag).toToast(this);
    },
    toManyTags() {
      return new ToManyPastaTagsError().toToast(this);
    },
  },
});

export function usePastaTagAddToasts() {
  return useActionToasts(addPastaTagToasts);
}

export const addPastaTagToasts = createActionToasts("add-pasta-tag", {
  failures: {
    badLength(this: ActionToastsThis, status: BadLengthStatus) {
      return new BadPastaTagLengthError(status).toToast(this);
    },
    sameTag(this: ActionToastsThis, tag: string) {
      return new SamePastaTagError(tag).toToast(this);
    },
    toManyTags(this: ActionToastsThis) {
      return new ToManyPastaTagsError().toToast(this);
    },
  },
});

export function usePastaTagAddToasts() {
  return useActionToasts(addPastaTagToasts);
}

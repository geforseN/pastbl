export const removePastaTagToasts = createActionToasts("remove-pasta-tag", {
  failures: {
    nonExistentTag(this: ActionToastsThis) {
      return new NonExistingPastaTagError().toToast(this);
    },
  },
});

export function usePastaTagRemoveToasts() {
  return useActionToasts(removePastaTagToasts);
}

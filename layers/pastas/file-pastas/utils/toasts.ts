export const loadPastasFromFileToasts = createActionToasts(
  "load-pastas-from-file",
  {
    failures: {
      incorrectFileContent(this: ActionToastsThis) {
        return {
          title: this.i18n.t(
            "actions.pastas.load-from-file.incorrect-input.title",
          ),
          description: this.i18n.t(
            "actions.pastas.load-from-file.incorrect-input.description",
          ),
        };
      },
    },
    warnings: {
      foundRejected(this: ActionToastsThis, rejectedPastasCount: number) {
        return {
          title: this.i18n.t(
            "actions.pastas.load-from-file.found-rejected.title",
          ),
          description: this.i18n.t(
            "actions.pastas.load-from-file.found-rejected.description",
            { count: rejectedPastasCount },
          ),
        };
      },
    },
  },
);

export function useLoadPastasFromFileToast() {
  return useActionToasts(loadPastasFromFileToasts);
}

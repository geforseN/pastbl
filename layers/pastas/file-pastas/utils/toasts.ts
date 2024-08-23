export const loadPastasFromFileToasts = createActionToasts(
  "load-pastas-from-file",
  {
    failures: {
      incorrectFileContent(this: ActionToastsThis) {
        return {
          title: "TODO",
          description: "TODO from error",
        };
      },
    },
    warnings: {
      foundRejected(this: ActionToastsThis, rejectedPastasCount: number) {
        return {};
      },
    },
  },
);

export function useLoadPastasFromFileToast() {
  return useActionToasts(loadPastasFromFileToasts);
}

export const personEmotesCollectionLoadToasts = createActionToasts(
  "load-person-emotes-collection",
  {
    success(this: ActionToastsThis, nickname: string, statuses: string) {
      return {
        description: this.i18n.t("toast.loadCollection.success.message", {
          nickname,
          statuses,
        }),
        title: this.i18n.t("toast.loadCollection.success.title"),
        timeout: 7000,
      };
    },
    failures: {
      emptyInput(this: ActionToastsThis) {
        return {
          title: this.i18n.t("toast.loadCollection.fail.title"),
          description: this.i18n.t(
            "toast.loadCollection.fail.emptyInputMessage",
          ),
        };
      },
    },
  },
);

export function usePersonEmotesCollectionLoadToasts() {
  return useActionToasts(personEmotesCollectionLoadToasts);
}

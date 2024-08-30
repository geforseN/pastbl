const globalEmotesRefreshToasts = createActionToasts("refresh-global-emotes", {
  success(this: ActionToastsThis, integrationsCount: number) {
    return {
      title: this.i18n.t("actions-toasts.refresh-global-emotes.title"),
      description: this.i18n.t(
        "actions-toasts.refresh-global-emotes.description",
        { count: integrationsCount },
      ),
    };
  },
});

export function useGlobalEmotesRefreshToasts() {
  return useActionToasts(globalEmotesRefreshToasts);
}

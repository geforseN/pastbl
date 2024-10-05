const globalEmotesRefreshToasts = createActionToasts("refresh-global-emotes", {
  success(integrationsCount: number, integrationsAsEmojis: string) {
    const description = this.i18n.t(
      "actions-toasts.refresh-global-emotes.description",
      { count: integrationsCount },
    );
    return {
      title: this.i18n.t("actions-toasts.refresh-global-emotes.title"),
      description: `${description} (${integrationsAsEmojis})`,
    };
  },
});

export function useGlobalEmotesRefreshToasts() {
  return useActionToasts(globalEmotesRefreshToasts);
}

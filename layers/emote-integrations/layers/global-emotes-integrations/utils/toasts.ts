import { useActionToasts } from "../../../../toast/composables/useActionToasts";
import { createActionToasts } from "../../../../toast/utils/create-raw-action-toasts";

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

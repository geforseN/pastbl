import { useActionToasts } from "../../../toast/composables/useActionToasts";
import { createActionToasts } from "../../../toast/utils/create-raw-action-toasts";
import { twitchConfig } from "$/twitch/app.config";

export const personEmotesCollectionLoadToasts = createActionToasts(
  "load-person-emotes-collection",
  {
    success(nickname: string, statuses: string) {
      return {
        description: this.i18n.t(
          "persons-emotes-collection.loadCollection.success.description",
          {
            nickname,
            statuses,
          },
        ),
        title: this.i18n.t(
          "persons-emotes-collection.loadCollection.success.title",
        ),
        timeout: 7000,
      };
    },
    failures: {
      emptyInput() {
        return {
          title: this.i18n.t(
            "persons-emotes-collection.loadCollection.failureTitle",
          ),
          description: this.i18n.t(
            "persons-emotes-collection.loadCollection.failures.emptyInput.description",
          ),
        };
      },
      tooSmallInput() {
        return {
          title: this.i18n.t(
            "persons-emotes-collection.loadCollection.failureTitle",
          ),
          description: this.i18n.t(
            "persons-emotes-collection.loadCollection.failures.tooSmallInput.description",
            { min: twitchConfig.twitchUser.login.length.min },
          ),
        };
      },
      tooBigInput() {
        return {
          title: this.i18n.t(
            "persons-emotes-collection.loadCollection.failureTitle",
          ),
          description: this.i18n.t(
            "persons-emotes-collection.loadCollection.failures.tooBigInput.description",
            { max: twitchConfig.twitchUser.login.length.max },
          ),
        };
      },
    },
  },
);

export function usePersonEmotesCollectionLoadToasts() {
  return useActionToasts(personEmotesCollectionLoadToasts);
}

import { twitchConfig } from "$/twitch/app.config";

export const personEmotesCollectionLoadToasts = createActionToasts(
  "load-person-emotes-collection",
  {
    success(this: ActionToastsThis, nickname: string, statuses: string) {
      return {
        description: this.i18n.t("persons-emotes-collection.loadCollection.success.description", {
          nickname,
          statuses,
        }),
        title: this.i18n.t("persons-emotes-collection.loadCollection.success.title"),
        timeout: 7000,
      };
    },
    failures: {
      emptyInput(this: ActionToastsThis) {
        return {
          title: this.i18n.t("persons-emotes-collection.loadCollection.failureTitle"),
          description: this.i18n.t(
            "persons-emotes-collection.loadCollection.failures.emptyInput.description",
          ),
        };
      },
      tooSmallInput(this: ActionToastsThis,providedLength: number) {
        return {
          title: this.i18n.t("persons-emotes-collection.loadCollection.failureTitle"),
          description: this.i18n.t(
            "persons-emotes-collection.loadCollection.failures.tooSmallInput.description",
            { min: twitchConfig.twitchUser.login.length.max, provided:providedLength },
          ),
        };
      },
      tooBigInput(this: ActionToastsThis,providedLength: number) {
        return {  
          title: this.i18n.t("persons-emotes-collection.loadCollection.failureTitle"),
          description: this.i18n.t(
            "persons-emotes-collection.loadCollection.failures.tooBigInput.description",
            { max: twitchConfig.twitchUser.login.length.max, provided:providedLength },
          ),
      }
    },
  },
);

export function usePersonEmotesCollectionLoadToasts() {
  return useActionToasts(personEmotesCollectionLoadToasts);
}

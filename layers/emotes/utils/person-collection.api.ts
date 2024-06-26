import type { EmoteSource } from "~/integrations/emote-source";

export const personCollectionAPI = {
  async get(login: TwitchUserLogin) {
    const fetchedAt = Date.now();
    const collection = await $fetch(`/api/v1/collections/persons/${login}`);
    return {
      ...collection,
      fetchedAt,
      receivedAt: Date.now(),
    };
  },
  integrations: {
    get(source: EmoteSource, login: TwitchUserLogin) {
      return $fetch(
        `/api/v1/collections/persons/${login}/integrations/${source}`,
      );
    },
    getAll(login: TwitchUserLogin) {
      return $fetch(`/api/v1/collections/persons/${login}/integrations`);
    },
    getMany(sources: EmoteSource[], login: TwitchUserLogin) {
      return $fetch(`/api/v1/collections/persons/${login}/integrations`, {
        params: {
          sources: sources.join("+"),
        },
      });
    },
  },
};

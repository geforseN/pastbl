import type { EmoteSource } from "~/integrations/emote-source";

export const API = {
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
};

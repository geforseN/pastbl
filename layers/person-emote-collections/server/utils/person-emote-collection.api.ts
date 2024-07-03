import { API as integrationsAPI } from "~~/layers/person-emote-integrations/server/utils/person-emote-integrations.api";

export const API = {
  async get(login: TwitchUserLogin) {
    const fetchedAt = Date.now();
    const collection = await $fetch(`/api/v1/collections/persons/${login}`);
    return {
      ...collection,
      fetchedAt,
      receivedAt: Date.now(),
    };
  },
  integrations: integrationsAPI,
};

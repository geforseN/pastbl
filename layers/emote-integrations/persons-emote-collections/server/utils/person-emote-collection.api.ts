export const personsCollectionsAPI = {
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

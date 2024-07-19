export function toIndexedDB() {
  const readyIntegrations = this.integrations.ready;
  const integrations = readyIntegrations.map(
    (integration) => new personEmoteCollection.Integration(integration),
  );
  return {
    emotes: getAllEmotes(integrations),
    collection: {
      formedAt: this.collection.formedAt,
      person: this.collection.person,
      integrations: flatGroupBySource(
        integrations.map((integration) => integration.toIndexedDB()),
      ) as TPersonEmoteCollection.SettledIndexedDB,
    },
  };
}

function getAllEmotes(integrations) {
  return Object.values(integrations)
    .filter(isReadyIntegration)
    .flatMap((integration) =>
      integration.emotes.sets.flatMap((set) => set.emotes),
    );
}

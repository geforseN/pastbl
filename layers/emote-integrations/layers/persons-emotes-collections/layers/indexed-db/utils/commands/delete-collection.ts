type I = TPersonEmoteCollection.SettledIndexedDB["integrations"][EmoteSource];

export class PersonIndexedDBEmoteCollectionDeletePreparation {
  constructor(
    private readonly collection: TPersonEmoteCollection.SettledIndexedDB,
    private readonly otherCollections: TPersonEmoteCollection.SettledIndexedDB[],
  ) {}

  #filterIntegration(integration: I) {
    return (
      isEmotesIntegrationReady(integration)
      && (integration.sets || raise("__NEVER__"))
    );
  }

  #transformIntegration(source: EmoteSource, integration: I) {
    return {
      source,
      emotesIds: new Set(
        integration.sets.flatMap((set) => set.emotesIds as string[]),
      ),
    };
  }

  #findEmoteIdsToDelete({
    source,
    emotesIds,
  }: {
    source: EmoteSource;
    emotesIds: Set<string>;
  }) {
    const emotesIdsToDelete = new Set(emotesIds);
    for (const collection of this.otherCollections) {
      const integration = collection.integrations[source];
      if (!isEmotesIntegrationReady(integration)) {
        continue;
      }
      for (const set of integration.sets) {
        for (const emoteId of set.emotesIds) {
          if (emotesIdsToDelete.has(emoteId)) {
            emotesIdsToDelete.delete(emoteId);
          }
        }
      }
    }
    return { source, emotesIds: [...emotesIdsToDelete] };
  }

  execute() {
    return objectEntries(this.collection.integrations)
      .filter(([, integration]) => this.#filterIntegration(integration))
      .map(([source, integration]) =>
        this.#transformIntegration(source, integration),
      )
      .map((o) => this.#findEmoteIdsToDelete(o));
  }
}

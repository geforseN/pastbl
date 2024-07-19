function __updateIntegration__(
  collection: IPersonEmoteCollection,
  integration: IEmoteIntegration,
) {
  return {
    ...collection,
    integrations: {
      ...collection.integrations,
      [integration.source]: integration,
    },
  };
}

// TODO: add i18n
export function usePersonCollection(login: TwitchUserLogin) {
  const personsEmoteCollections = usePersonsEmoteCollectionsStore();

  const collection = useMyAsyncState(
    async (getCollection: () => MaybePromise<IPersonEmoteCollection>) => {
      return await getCollection();
    },
    null,
    { immediate: false },
  );

  // TODO
  const status = computed(() => {});

  if (import.meta.client) {
    collection.execute(0, async () => {
      const collection = await personsEmoteCollectionsService
        .get(login)
        .catch(() => personsEmoteCollectionsService.load(login));
      assert.ok(collection, `No collection found with login: ${login}`);
      return collection;
    });
  }

  const emotesEntries = computed(() => {
    const integrations = collection.state.value?.integrations || {};
    return new personEmoteCollection.Integrations(integrations).emotes.asMap;
  });

  function __getCollection__() {
    const collection_ = collection.state.value;
    assert.ok(collection_, "TODO add i18n message");
    return collection_;
  }

  const integrationsLoad = useEmoteIntegrationsLoad<
    IEmoteIntegration,
    IPersonEmoteCollection["integrations"]
  >({
    load(source) {
      return personIntegrationsAPI.get(source, login);
    },
    loadAll() {
      return personIntegrationsAPI.getAll(login);
    },
    loadMany(sources) {
      return personIntegrationsAPI.getMany(sources, login);
    },
  });

  function ensureCollectionLoaded() {
    assert.ok(collection.state.value, "TODO add i18n message");
  }

  return {
    ...collection,
    person: computed(() => collection.state.value?.person),
    integrations: computed(() => collection.state.value?.integrations || {}),
    formedAt: computed(() => collection.state.value?.formedAt),
    isSelected: computed(() =>
      personsEmoteCollections.isCollectionSelected(login),
    ),
    refreshIntegration(integration: TEmoteIntegrations.Person.Ready) {
      ensureCollectionLoaded();
      return collection.execute(0, async () => {
        const newIntegration = await integrationsLoad.execute(
          integration.source,
        );
        const collection = __getCollection__();
        const newCollection = __updateIntegration__(
          collection,
          newIntegration,
        ) as IPersonEmoteCollection;
        await personsEmoteCollectionsService.put(newCollection);
        return newCollection;
      });
    },
    refresh() {
      return collection.execute(0, () => {
        return personsEmoteCollections.loadCollection(login);
      });
    },
    select() {
      return personsEmoteCollections.selectCollection(login);
    },
    unselect() {
      return personsEmoteCollections.unselectCollection();
    },
    delete() {
      return personsEmoteCollections.deleteCollection(login);
    },
    findEmote(token: string) {
      return emotesEntries.value.get(token);
    },
    readyIntegrations: computed(() => {
      if (!collection.state.value) {
        return [];
      }
      const integrations = new personEmoteCollection.Integrations(
        collection.state.value.integrations,
      );
      return integrations.ready;
    }),
  };
}

export type UseUserCollectionReturn = ReturnType<typeof useUserCollection>;

import consola from "consola";


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

function usePersonCollectionFindEmote(
  collection: Ref<Nullish<IPersonEmoteCollection>>,
) {
  const emotes = computed(() => {
    let integrations = collection.value?.integrations;
    if (!integrations) {
      consola.warn("no integrations or collection", {
        collection: collection.value,
        integrations,
      });
      integrations = { BetterTTV: undefined };
    }
    return getEmotesMapInEmotesIntegrations(integrations);
  });

  return function (token: EmoteToken) {
    return emotes.value.get(token);
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
      return await personsEmotesCollectionsService.getOrLoad(login);
    });
  }

  function __getCollection__() {
    const collection_ = collection.state.value;
    assert.ok(collection_, "TODO add i18n message");
    return collection_;
  }

  const api = new PersonsEmoteIntegrationsApi(
    $fetch.create({
      baseURL: `/api/v1/persons-emotes-collections/${login}/integrations`,
    }),
  );

  const integrationsLoad = useEmoteIntegrationsLoad({
    load: api.get.bind(api),
    loadAll: api.getAll.bind(api),
    loadMany: api.getMany.bind(api),
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
        await personsEmotesCollectionsService.put(newCollection);
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
    findEmote: usePersonCollectionFindEmote(collection.state),
    readyIntegrations: computed(() => {
      const collection_ = collection.state.value;
      if (!collection_) {
        return [];
      }
      return objectValues(collection_.integrations).filter(
        isEmotesIntegrationReady,
      );
    }),
  };
}

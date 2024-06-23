import { userCollectionsService } from "~/client-only/services/userCollections";
import { personCollectionAPI } from "~/resources/person";
import { type IUserEmoteCollection } from "~/integrations";

function useCollectionState(initFn) {}

function __updateIntegration__(collection, integration) {
  return {
    ...collection,
    integrations: {
      ...collection.integrations,
      [integration.source]: integration,
    },
  };
}

// TODO: add i18n
export function useUserCollection(login: TwitchUserLogin) {
  const userCollectionsStore = useUserCollectionsStore();

  const collection = useMyAsyncState(
    async (getCollection: () => MaybePromise<IUserEmoteCollection>) => {
      return await getCollection();
    },
    null,
    { immediate: false },
  );

  if (import.meta.client) {
    collection.execute(0, async () => {
      const collection = await userCollectionsService
        .get(login)
        .catch(async () => {
          const collection = await personCollectionAPI.get(login);
          await userCollectionsService.put(collection);
          return collection;
        });
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
    IUserEmoteCollection["integrations"][keyof IUserEmoteCollection["integrations"]],
    IUserEmoteCollection["integrations"]
  >({
    load(source) {
      return personCollectionAPI.integrations.get(source, login);
    },
    loadAll() {
      return personCollectionAPI.integrations.getAll(login);
    },
    loadMany(sources) {
      return personCollectionAPI.integrations.getMany(sources, login);
    },
  });

  function ensureCollectionLoaded() {
    assert.ok(collection.state.value, "TODO add i18n message");
  }

  return {
    ...collection,
    user: computed(() => collection.state.value?.user),
    integrations: computed(() => collection.state.value?.integrations || {}),
    formedAt: computed(() => collection.state.value?.formedAt),
    isSelected: computed(() =>
      userCollectionsStore.isCollectionSelected(login),
    ),
    refreshIntegration(integration) {
      ensureCollectionLoaded();
      return collection.execute(0, async () => {
        const newIntegration = await integrationsLoad.execute(
          integration.source,
        );
        const collection = __getCollection__();
        const newCollection = __updateIntegration__(
          collection,
          newIntegration,
        ) as IUserEmoteCollection;
        await userCollectionsService.put(newCollection);
        return newCollection;
      });
    },
    refresh() {
      return collection.execute(0, () => {
        return userCollectionsStore.loadCollection(login);
      });
    },
    select() {
      return userCollectionsStore.selectCollection(login);
    },
    unselect() {
      return userCollectionsStore.unselectCollection();
    },
    delete() {
      return userCollectionsStore.deleteCollection(login);
    },
    findEmote(token: string) {
      return emotesEntries.value.get(token);
    },
    readyIntegrations: computed(() => {
      if (!collection.state.value) {
        return [];
      }
      return getReadyUserIntegrations(collection.state.value);
    }),
  };
}

export type UseUserCollectionReturn = ReturnType<typeof useUserCollection>;

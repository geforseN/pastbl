import { userCollectionsService } from "~/client-only/services";
import { USERS_COLLECTIONS_API } from "~/client-only/services/userCollections";
import {
  isReadyUserIntegration,
  type IUserEmoteCollection,
  type IUserEmoteIntegration,
  type IUserEmoteIntegrationRecord,
} from "~/integrations";

export function useUserCollection(login: TwitchUserLogin) {
  const userCollectionsStore = useUserCollectionsStore();

  const collection = useMyAsyncState(
    async (
      strategy: "get" | "refresh" | "refresh-integration" = "get",
      newIntegration?: IUserEmoteIntegration,
    ) => {
      if (process.server) {
        return null;
      }
      // TODO: add i18n
      // FIXME: refactor, move to service
      // FIXME: refactor, move to service
      // FIXME: refactor, move to service
      switch (strategy) {
        case "get": {
          const collection_ = await userCollectionsService
            .get(login)
            .catch(async () => {
              const collection = await USERS_COLLECTIONS_API.get(login);
              await userCollectionsService.put(collection);
              return collection;
            });
          assert.ok(collection_, `No collection found with login: ${login}`);
          return collection_;
        }
        case "refresh": {
          return userCollectionsStore.loadCollection(login);
        }
        case "refresh-integration": {
          const collection_ = collection.state.value;
          assert.ok(
            collection_ && typeof newIntegration !== "undefined",
            `Failed to refresh emote integration ${newIntegration ? `: ${newIntegration.source}` : ""}`,
          );
          const newCollection = {
            ...collection_,
            integrations: {
              ...collection_.integrations,
              [newIntegration.source]: newIntegration,
            },
          } as IUserEmoteCollection;
          await userCollectionsService.put(newCollection);
          return newCollection;
        }
        default: {
          assert.fail(`Unknown strategy for user collection: ${strategy}`);
        }
      }
    },
    null,
  );

  const emotesEntries = computed(() => {
    const integrations = collection.state.value?.integrations || {};
    return getEmotesMapFromIntegrations(integrations);
  });

  const user = computed(() => collection.state.value?.user);

  const integrationsLoad = useEmoteIntegrationsLoad<
    IUserEmoteIntegration,
    IUserEmoteIntegrationRecord
  >({
    async load(source) {
      const login = collection.state.value?.user.twitch.login;
      assert.ok(login);
      const newIntegration = await USERS_COLLECTIONS_API.integrations.get(
        source,
        login,
      );
      // NOTE: this assert is important
      // TEST: try call load on failed integration
      // assert.ok(newIntegration.status === "ready");
      return newIntegration;
    },
    loadAll() {
      const login = collection.state.value?.user.twitch.login;
      assert.ok(login);
      return USERS_COLLECTIONS_API.integrations.getAll(login);
    },
    loadMany(sources) {
      const login = collection.state.value?.user.twitch.login;
      assert.ok(login);
      return USERS_COLLECTIONS_API.integrations.getMany(sources, login);
    },
  });

  return {
    ...collection,
    user,
    integrations: computed(() => collection.state.value?.integrations || {}),
    formedAt: computed(() => collection.state.value?.formedAt),
    isSelected: computed(() =>
      userCollectionsStore.isCollectionSelected(login),
    ),
    async refreshIntegration(integration) {
      assert.ok(collection.state.value);
      const newIntegration = await integrationsLoad.execute(integration.source);
      return collection.execute(0, "refresh-integration", newIntegration);
    },
    refresh() {
      return collection.execute(0, "refresh");
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
      const values = Object.values(collection.state.value.integrations);
      return values.filter(isReadyUserIntegration);
    }),
  };
}

export type UseUserCollectionReturn = ReturnType<typeof useUserCollection>;

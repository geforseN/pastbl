import { defineStore } from "pinia";
import type { IndexedDBUserCollection } from "~/client-only/IndexedDB";
import type { IGlobalEmoteCollection } from "~/integrations";

export const useCollectionsStore = defineStore("collections", () => {
  // TODO: make activeUserCollectionNickname AND activeGlobalCollectionSources computed with get and set
  // SHOULD: block on set while IndexedDB value has not changed
  // ? add useAsyncWritableComputed composable for this ?
  // TODO (globalCollections|userCollections).activeCollections computed
  const globalCollections = useGlobalCollections();
  const userCollections = useUserCollections();

  return {
    global: {
      isActiveCollectionEvaluating:
        globalCollections.isActiveGlobalCollectionEvaluating,
      refreshCollection: globalCollections.refreshGlobalCollection,
      addCollection: globalCollections.addGlobalCollection,
      getCollectionWithSource: globalCollections.getCollectionWithSource,
    },
    users: {
      collections: userCollections,
      refreshCollection: userCollections.refreshUserCollection,
      removeCollection: userCollections.removeUserCollection,
    },
  };
});

// TODO:
// TODO:
// TODO:
// TODO: something like => globalCollections.execute('initial | refresh')
function useGlobalCollections() {
  const isActiveGlobalEvaluating = ref(false);

  const globalCollections = useAsyncState(
    async () => {
      const emoteCollections = await import("~/client-only/IndexedDB").then(
        ({ idb }) => idb.emoteCollections,
      );
      return emoteCollections.global.getAllCollections();
    },
    [],
    { shallow: true },
  );

  function getUserCollectionIndexByNickname(nickname: string) {
    const index = userCollections.state.value.findIndex(
      (collection) => collection.twitch.nickname === nickname,
    );
    assert.ok(index >= 0, "Failed to find user collection");
    return index;
  }

  computed;

  return {
    userCollections,
    async removeUserCollection(collection: IndexedDBUserCollection) {
      const emoteCollectionsIdb = await import(
        "~/client-only/IndexedDB/index"
      ).then(({ idb }) => idb.emoteCollections);
      await emoteCollectionsIdb.users.removeCollection(collection);
      const index = getUserCollectionIndexByNickname(
        collection.twitch.nickname,
      );
      userCollections.state.value.splice(index, 1);
      // NOTE:
      // NOTE:
      // NOTE:
      // NOTE: HERE activeUserCollectionNickname MUST BE undefined if removed collection was active
    },
    async refreshUserCollection(oldCollection: IndexedDBUserCollection) {
      const [emoteCollectionsIdb, emotesIdb] = await import(
        "~/client-only/IndexedDB/index"
      ).then(({ idb }) => Promise.all([idb.emoteCollections, idb.emotes]));
      const newCollection = await useUserIntegrations()
        .integrations.execute(0, oldCollection.twitch.username)
        .then((collection) => {
          assert.ok(collection, "Failed to load new collection");
          return { ...collection, isActive: oldCollection.isActive };
        });
      const [newIdbCollection] = await Promise.all([
        emoteCollectionsIdb.users.putCollection(newCollection),
        emotesIdb.putEmotesOfUserCollection(newCollection),
      ]);
      const index = getUserCollectionIndexByNickname(
        newIdbCollection.twitch.nickname,
      );
      userCollections.state.value.splice(index, 1, newIdbCollection);
    },
  };
}

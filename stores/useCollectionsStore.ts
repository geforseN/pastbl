import { defineStore } from "pinia";
import type { IndexedDBUserCollection } from "~/client-only/IndexedDB";
import type {
  AvailableEmoteSource,
  IGlobalEmoteCollection,
} from "~/integrations";

export type UserEmoteCollectionEntry = [
  IndexedDBUserCollection["twitch"]["nickname"],
  IndexedDBUserCollection,
];

export type GlobalEmoteCollectionEntry = [
  IGlobalEmoteCollection["source"],
  IGlobalEmoteCollection,
];

export const useCollectionsStore = defineStore("collections", () => {
  // TODO: refactor two below, make them computed
  const globalCollectionsEntries = ref<GlobalEmoteCollectionEntry[]>([]);
  const usersCollectionsEntries = ref<UserEmoteCollectionEntry[]>([]);

  const activeUserCollectionNickname = ref<string>();
  const activeGlobalCollectionSources = ref<AvailableEmoteSource[]>([]);

  if (typeof window !== "undefined") {
    import("~/client-only/IndexedDB/index").then(({ idb }) => {
      Promise.all([
        idb.emoteCollections.users
          .getAllCollectionsEntries()
          .then((entries) => {
            usersCollectionsEntries.value = entries;
            activeUserCollectionNickname.value = entries.find(
              ([, collection]) => collection.isActive,
            )?.[0];
          }),
        idb.emoteCollections.global
          .getAllCollectionsEntries()
          .then((entries) => {
            globalCollectionsEntries.value = entries;
            activeGlobalCollectionSources.value = entries
              .filter(([, collection]) => collection.isActive)
              .map(([, collection]) => collection.source);
          }),
      ]);

      watch(
        () => activeUserCollectionNickname.value,
        async (newNickname, oldNickname) => {
          assert.ok(newNickname !== oldNickname, "Impossible condition");
          // NOTE: if old nickname is not found, it means it collection was active and it was removed
          if (!newNickname) {
            return;
          }
          const collectionToUpdate = usersCollectionsEntries.value.find(
            ([nickname]) => nickname === newNickname,
          )?.[1];
          assert.ok(collectionToUpdate);
          if (oldNickname) {
            const oldCollection = usersCollectionsEntries.value.find(
              ([nickname]) => nickname === oldNickname,
            )?.[1];
            // NOTE: if old collection is not found, it means it was active and it was removed
            if (!oldCollection) {
              return;
            }
            await idb.emoteCollections.users.updateCollection({
              ...oldCollection,
              isActive: false,
            });
            oldCollection.isActive = false;
          }
          await idb.emoteCollections.users.updateCollection({
            ...collectionToUpdate,
            isActive: true,
          });
          collectionToUpdate.isActive = true;
        },
      );

      watchArray(
        () => activeGlobalCollectionSources.value,
        async (_, __, [activeSource], [inactiveSource]) => {
          const sourceToUpdate =
            activeSource || inactiveSource || raise("Impossible condition");
          const collectionToUpdate = globalCollectionsEntries.value.find(
            ([source]) => source === sourceToUpdate,
          )?.[1];
          assert.ok(collectionToUpdate);
          const isActive = sourceToUpdate === activeSource;
          await idb.emoteCollections.global.updateCollection({
            ...collectionToUpdate,
            isActive,
          });
          collectionToUpdate.isActive = isActive;
        },
      );
    });
  }

  const selectedUserCollection = computed(
    () =>
      usersCollectionsEntries.value.find(
        ([nickname]) => activeUserCollectionNickname.value === nickname,
      )?.[1],
  );

  return {
    usersCollectionsEntries,
    globalCollectionsEntries,
    activeUserCollectionNickname,
    activeGlobalCollectionSources,
    selectedUserCollection,
    async removeUserCollection(collection: IndexedDBUserCollection) {
      const { idb } = await import("~/client-only/IndexedDB/index");
      await idb.emoteCollections.users.removeCollection(collection);
      const index = usersCollectionsEntries.value.findIndex(
        ([nickname]) => nickname === collection.twitch.nickname,
      );
      assert.ok(index >= 0, "Can not remove the collection which is not exist");
      const [collectionEntry] = usersCollectionsEntries.value.splice(index, 1);
      const nickname = collectionEntry[0];
      if (activeUserCollectionNickname.value === nickname) {
        activeUserCollectionNickname.value = undefined;
      }
    },
    async updateUserCollection(oldCollection: IndexedDBUserCollection) {
      const { idb } = await import("~/client-only/IndexedDB/index");
      const collections = useUserIntegrations();
      const newCollection = await collections.integrations
        .execute(0, oldCollection.twitch.username)
        .then((collection) => {
          assert.ok(collection, "Failed to load new collection");
          return { ...collection, isActive: oldCollection.isActive };
        });
      const [newIdbCollection] = await Promise.all([
        idb.emoteCollections.users.putCollection(newCollection),
        idb.emotes.putEmotesOfUserCollection(newCollection),
      ]);
      const index = usersCollectionsEntries.value.findIndex(
        ([nickname]) => nickname === oldCollection.twitch.nickname,
      );
      assert.ok(index >= 0, "Can not update the collection which is not exist");
      usersCollectionsEntries.value.splice(index, 1, [
        newIdbCollection.twitch.nickname,
        newIdbCollection,
      ]);
    },
    async updateGlobalCollection(collection: IGlobalEmoteCollection) {
      const { idb } = await import("~/client-only/IndexedDB/index");
      const newCollection =
        await idb.emoteCollections.global.updateCollection(collection);
      const index = globalCollectionsEntries.value.findIndex(
        ([source]) => source === collection.source,
      );
      assert.ok(index >= 0, "Can not update the collection which is not exist");
      globalCollectionsEntries.value.splice(index, 1, [
        newCollection.source,
        newCollection,
      ]);
    },
  };
});

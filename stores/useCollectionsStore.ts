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
  const globalCollectionsEntries = ref<GlobalEmoteCollectionEntry[]>([]);
  const usersCollectionsEntries = ref<UserEmoteCollectionEntry[]>([]);

  const activeUserCollectionNickname = ref<string>();
  const activeGlobalCollectionSources = ref<AvailableEmoteSource[]>([]);

  if (typeof window !== "undefined") {
    import("~/client-only/IndexedDB").then(({ idb }) => {
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
          console.log({ newNickname, oldNickname });
          assert.ok(newNickname !== oldNickname, "Impossible condition");
          const nicknameToUpdate =
            newNickname || oldNickname || raise("Impossible condition");
          const collectionToUpdate = usersCollectionsEntries.value.find(
            ([nickname]) => nickname === nicknameToUpdate,
          )?.[1];
          assert.ok(collectionToUpdate);
          const isCollectionActive = nicknameToUpdate === newNickname;
          await idb.emoteCollections.users.updateCollectionActive(
            collectionToUpdate,
            isCollectionActive,
          );
          collectionToUpdate.isActive = isCollectionActive;
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
          const isCollectionActive = sourceToUpdate === activeSource;
          await idb.emoteCollections.global.updateCollectionActivity(
            collectionToUpdate,
            isCollectionActive,
          );
          collectionToUpdate.isActive = isCollectionActive;
        },
      );
    });
  }

  return {
    usersCollectionsEntries,
    globalCollectionsEntries,
    activeUserCollectionNickname,
    activeGlobalCollectionSources,
    selectedUserCollection: computed(
      () =>
        usersCollectionsEntries.value.find(
          ([nickname]) => activeUserCollectionNickname.value === nickname,
        )?.[1],
    ),
    async removeUserCollection(collection: IndexedDBUserCollection) {
      const { idb } = await import("~/client-only/IndexedDB");
      await idb.emoteCollections.users.removeCollection(collection);
      const index = usersCollectionsEntries.value.findIndex(
        ([nickname]) => nickname === collection.twitch.nickname,
      );
      assert.ok(index >= 0, "Can not remove the collection which is not exist");
      usersCollectionsEntries.value.splice(index, 1);
    },
  };
});

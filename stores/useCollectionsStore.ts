import { defineStore } from "pinia";
import type { IndexedDBUserCollection } from "~/client-only/IndexedDB";
import type { IGlobalEmoteCollection } from "~/integrations";

export type UserEmoteCollectionEntry = [
  IndexedDBUserCollection["twitch"]["nickname"],
  IndexedDBUserCollection,
];

export type GlobalEmoteCollectionEntry = [
  IGlobalEmoteCollection["source"],
  IGlobalEmoteCollection,
];

export const useCollectionStore = defineStore("collections", () => {
  const globalCollectionsEntries = ref<UserEmoteCollectionEntry[]>([]);
  const usersCollectionsEntries = ref<GlobalEmoteCollectionEntry[]>([]);

  const activeUserCollectionNickname = ref<string>();

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
          }),
      ]);

      watch(
        () => activeUserCollectionNickname.value,
        async (newNickname, oldNickname) => {
          console.log({ newNickname, oldNickname });
          if (newNickname === oldNickname) {
            return;
          }
          if (oldNickname) {
            const oldActive = usersCollectionsEntries.value.find(
              ([nickname]) => nickname === oldNickname,
            )?.[1];
            if (oldActive) {
              await idb.emoteCollections.users.updateCollectionActive(
                oldActive,
                false,
              );
              oldActive.isActive = false;
            }
          }
          const newActive = usersCollectionsEntries.value.find(
            ([nickname]) => nickname === newNickname,
          )?.[1];
          if (newActive) {
            await idb.emoteCollections.users.updateCollectionActive(
              newActive,
              true,
            );
            newActive.isActive = true;
          }
        },
      );
    });
  }

  return {
    usersCollectionsEntries,
    globalCollectionsEntries,
    activeUserCollectionNickname,
    selectedUserCollection: computed(
      () =>
        usersCollectionsEntries.value.find(
          ([, collection]) => collection.isActive,
        )?.[1],
    ),
  };
});

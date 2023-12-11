import { defineStore } from "pinia";
import {
  populateUserEmoteCollection,
  type IUserEmoteCollection,
  type IEmote,
  type AvailableEmoteSource,
} from "~/integrations";

export const useUserCollectionsStore = defineStore("user-collections", () => {
  const emotesStore = useEmotesStore();

  const selectedCollectionUsername = useAsyncState(
    async (nickname?: string) => {
      const { idb } = await import("~/client-only/IndexedDB");
      const emoteCollectionsIdb = await idb.emoteCollections;
      if (typeof nickname === "undefined") {
        const value =
          (await emoteCollectionsIdb.kv.getActiveUserCollection()) ?? "";
        if (value === "") {
          // NOTE: so there is no active user collection,
          // in template should ask user to select one (or even load one if usernamesToSelect are empty)
        }
        return value;
      }
      const username = toLowerCase(nickname);
      await emoteCollectionsIdb.kv.setActiveUserCollection(username);
      return username;
    },
    "",
    { shallow: true, resetOnExecute: false },
  );
  const usernamesToSelect = useAsyncState(
    async () => {
      const { idb } = await import("~/client-only/IndexedDB");
      const emoteCollectionsIdb = await idb.emoteCollections;
      return emoteCollectionsIdb.users.getAllCollectionsUsernames();
    },
    [""],
    { shallow: true },
  );

  const selectedCollection = useAsyncState(
    async (username: Lowercase<string>) => {
      const { idb } = await import("~/client-only/IndexedDB");
      const [emoteCollectionsIdb, emotesIdb] = await Promise.all([
        idb.emoteCollections,
        idb.emotes,
      ]);
      const idbCollection =
        await emoteCollectionsIdb.users.getUserCollectionByUsername(username);
      assert.ok(idbCollection, "Failed to find loaded user collection");
      const emotesIdbStore = emotesIdb.emotesTransaction.store;
      const emoteCollectionsArray = await Promise.all(
        Object.values(idbCollection.collections).map((idbEmoteCollection) =>
          populateUserEmoteCollection(idbEmoteCollection, async (emoteId) => {
            const cachedEmote =
              emotesStore.users[
                idbEmoteCollection.source as AvailableEmoteSource
              ].get(emoteId);
            if (cachedEmote) {
              return cachedEmote;
            }
            const emote: IEmote & { updatedAt: number } =
              await emotesIdbStore.get([emoteId, idbEmoteCollection.source]);
            emotesStore.users[
              idbEmoteCollection.source as AvailableEmoteSource
            ].set(emoteId, emote);
            return emote;
          }),
        ),
      );
      const emoteCollectionsRecord = groupBy(
        emoteCollectionsArray,
        (collection) => collection.source,
      );
      const collection = {
        ...idbCollection,
        collections: emoteCollectionsRecord,
      } as IUserEmoteCollection;
      return collection;
    },
    null,
    { shallow: true, immediate: false, resetOnExecute: false },
  );

  watch(selectedCollectionUsername.state, async (username) => {
    await selectedCollection.execute(0, username);
  });

  // NOTE: by default state of selectedCollectionUsername === ''
  // if from idb loaded '' then watch below will not execute it is callback
  // but i wish it would work even when initial execute of selectedCollectionUsername is called and result is ''

  return {
    selectedCollectionUsername,
    usernamesToSelect,
    selectedCollection,
  };
});

export type SelectedUserCollectionsAsyncState = ReturnType<
  typeof useUserCollectionsStore
>["selectedCollection"];

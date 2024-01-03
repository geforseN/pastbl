import { defineStore } from "pinia";
import {
  collectionsKeyValuesService,
  userCollectionsService,
} from "~/client-only/services";

export const useUserCollectionsStore = defineStore("user-collections", () => {
  const usernamesToSelect = useAsyncState(
    () => userCollectionsService.getAllUsernames(),
    [""],
    { shallow: true, throwError: true },
  );

  const selectedCollectionUsername = useAsyncState(
    (nickname?: string | "") => {
      return collectionsKeyValuesService.activeUserCollection.username.update(
        nickname && toLowerCase(nickname),
      );
    },
    "",
    { shallow: true, resetOnExecute: false, throwError: true },
  );

  const selectedCollection = useAsyncState(
    (username: Lowercase<string> | "") => {
      if (!username) {
        return Promise.resolve(null);
      }
      return userCollectionsService.get(username);
    },
    null,
    {
      shallow: true,
      immediate: false,
      resetOnExecute: false,
      throwError: true,
    },
  );

  watch(selectedCollectionUsername.state, async (username) => {
    await selectedCollection.execute(0, username);
  });

  const userIntegrations = useUserIntegrations();

  return {
    selectedCollectionUsername,
    usernamesToSelect,
    selectedCollection,
    userIntegrations,
    async refreshCollection(username: Lowercase<string>) {
      const collection = await userIntegrations.collection.execute(0, username);
      assert.ok(collection);
      await userCollectionsService.refresh(collection);
      if (selectedCollectionUsername.state.value === username) {
        selectedCollection.state.value = collection;
      }
    },
  };
});

export type SelectedUserCollectionsAsyncState = ReturnType<
  typeof useUserCollectionsStore
>["selectedCollection"];

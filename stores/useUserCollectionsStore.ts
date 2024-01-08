import { defineStore } from "pinia";
import {
  collectionsKeyValuesService,
  userCollectionsService,
} from "~/client-only/services";

export const useUserCollectionsStore = defineStore("user-collections", () => {
  const usernamesToSelect = useAsyncState(
    () => userCollectionsService.getAllUsernames(),
    [""],
    { shallow: true, throwError: true, resetOnExecute: false },
  );

  const collectionsToSelect = useAsyncState(
    () => userCollectionsService.getAll(),
    [],
    {
      shallow: true,
      throwError: true,
      resetOnExecute: false,
    },
  );

  // TODO: use useIdbKeyValue("active-user-collection-username", "");
  // NOTE: ? should add execute function in return of useIdbKeyValue ?
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

  const loadingCollections = ref<
    {
      username: Lowercase<string>;
      integrations: ReturnType<typeof useUserIntegrations>;
    }[]
  >([]);

  async function __makeCollection__(username: Lowercase<string>) {
    const integrations = useUserIntegrations();
    const collectionPromise = integrations.collection.execute(0, username);
    const loadingCollection = { username, integrations };
    loadingCollections.value.push(loadingCollection);
    const collection = await collectionPromise.finally(() => {
      const index = loadingCollections.value.indexOf(loadingCollection);
      loadingCollections.value.splice(index, 1);
    });
    assert.ok(collection);
    return collection;
  }

  async function __updateStuff__(username?: Lowercase<string>) {
    await Promise.all([
      usernamesToSelect.execute(),
      collectionsToSelect.execute(),
    ]);
    if (typeof username === "undefined") {
      return;
    }
    if (selectedCollectionUsername.state.value === username) {
      await selectedCollection.execute(0, username);
    }
  }

  return {
    selectedCollectionUsername,
    usernamesToSelect,
    collectionsToSelect,
    selectedCollection,
    loadingCollections,
    async loadCollection(nickname: string) {
      assert.ok(
        nickname,
        new ExtendedError("Nickname is required", {
          color: "red",
          title: "Emotes load error",
        }),
      );
      const username = toLowerCase(nickname);
      await this.refreshCollection(username);
    },
    async refreshCollection(username: Lowercase<string>) {
      const collection = await __makeCollection__(username);
      await userCollectionsService.put(collection);
      await __updateStuff__(username);
    },
    async deleteCollection(username: Lowercase<string>) {
      await userCollectionsService.delete(username);
      await __updateStuff__(username);
    },
  };
});

export type SelectedUserCollectionsAsyncState = ReturnType<
  typeof useUserCollectionsStore
>["selectedCollection"];

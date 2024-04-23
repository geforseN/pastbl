import { userCollectionsService } from "~/client-only/services";

export const useUserCollectionsStore = defineStore("user-collections", () => {
  const loginsToSelect = useAsyncArray(userCollectionsService.getAllLogins);

  const collectionsToSelect = useAsyncArray(userCollectionsService.getAll);

  const selectedLogin = useSelectedUserCollectionLogin();

  const selectedCollection = useSelectedUserCollection(
    userCollectionsService.get,
    selectedLogin.state,
  );

  function refreshStates() {
    return Promise.all([
      loginsToSelect.execute(),
      collectionsToSelect.execute(),
    ]);
  }

  const collectionsLoad = useUsersCollectionsLoad(userCollectionsService.load, {
    async beforeQueueRemove(login) {
      await refreshStates();
      await selectedCollection.executeIfSameLogin(login);
    },
  });

  return {
    selectedLogin,
    selectCollection(loginSource: LoginSource) {
      return selectedLogin.changeTo(getUserLogin(loginSource));
    },
    unselectCollection() {
      return selectedLogin.clear();
    },
    isCollectionSelected(loginSource: LoginSource) {
      return selectedLogin.isEqualTo(getUserLogin(loginSource));
    },
    loginsToSelect,
    collectionsToSelect,
    selectedCollection,
    async refreshCollection(loginSource: LoginSource) {
      const login = getUserLogin(loginSource);
      const collection = await collectionsLoad.execute(login);
      await refreshStates();
      return collection;
    },
    isCollectionRefreshing(loginSource: LoginSource) {
      const login = getUserLogin(loginSource);
      return collectionsLoad.isCurrentlyLoading(login);
    },
    async deleteCollection(loginSource: LoginSource) {
      const login = getUserLogin(loginSource);
      await userCollectionsService.delete(login);
      await refreshStates();
      selectedLogin.clearIfSameLogin(login);
    },
  };
});

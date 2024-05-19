import { userCollectionsService } from "~/client-only/services";

export const useUserCollectionsStore = defineStore("user-collections", () => {
  const loginsToSelect = useAsyncArray(userCollectionsService.getAllLogins);

  const collectionsToSelect = useAsyncArray(userCollectionsService.getAll);

  const selectedLogin = useSelectedPersonCollectionLogin();

  const selected = useSelectedPersonCollection(
    userCollectionsService.get,
    selectedLogin.state,
  );

  function refreshStates() {
    return Promise.all([
      loginsToSelect.execute(),
      collectionsToSelect.execute(),
    ]);
  }

  const collectionsLoad = usePersonsCollectionsLoad(
    userCollectionsService.load.bind(userCollectionsService),
  );

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
    selectedCollection: selected,
    async loadCollection(loginSource: LoginSource) {
      const login = getUserLogin(loginSource);
      const collection = await collectionsLoad.execute(login);
      await refreshStates().then(() => selected.executeIfSameLogin(login));
      return collection;
    },
    isCollectionLoading(loginSource: LoginSource) {
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

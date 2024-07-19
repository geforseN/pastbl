export const usePersonsEmoteCollectionsStore = defineStore(
  "persons-emote-collections",
  () => {
    const loginsToSelect = useAsyncArray(() =>
      personsEmoteCollectionsService.getAllLogins(),
    );

    const collectionsToSelect = useAsyncArray(() =>
      personsEmoteCollectionsService.getAll(),
    );

    const selectedLogin = useSelectedPersonCollectionLogin();

    const selectedCollection = useSelectedPersonCollection(
      (login) => personsEmoteCollectionsService.get(login),
      selectedLogin.state,
    );

    function refreshStates() {
      return Promise.all([
        loginsToSelect.execute(),
        collectionsToSelect.execute(),
      ]);
    }

    const collectionsLoad = usePersonsCollectionsLoad((login) =>
      personsEmoteCollectionsService.load(login),
    );

    return {
      selectedLogin,
      selectCollection(loginSource: LoginSource) {
        return selectedLogin.changeTo(getPersonLogin(loginSource));
      },
      unselectCollection() {
        return selectedLogin.clear();
      },
      isCollectionSelected(loginSource: LoginSource) {
        return selectedLogin.isEqualTo(getPersonLogin(loginSource));
      },
      loginsToSelect,
      collectionsToSelect,
      selectedCollection,
      async loadCollection(loginSource: LoginSource) {
        const login = getPersonLogin(loginSource);
        const collection = await collectionsLoad.execute(login);
        await refreshStates();
        selectedCollection.executeIfSameLogin(login);
        return collection;
      },
      isCollectionLoading(loginSource: LoginSource) {
        const login = getPersonLogin(loginSource);
        return collectionsLoad.isCurrentlyLoading(login);
      },
      async deleteCollection(loginSource: LoginSource) {
        const login = getPersonLogin(loginSource);
        await personsEmoteCollectionsService.delete(login);
        await refreshStates();
        selectedLogin.clearIfSameLogin(login);
      },
    };
  },
);

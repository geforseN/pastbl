export const usePersonsEmoteCollectionsStore = defineStore(
  "persons-emotes-collections",
  () => {
    const loginsToSelect = useAsyncArray(() =>
      personsEmotesCollectionsService.getAllLogins(),
    );

    const collectionsToSelect = useAsyncArray(() =>
      personsEmotesCollectionsService.getAllRaw(),
    );

    const selectedLogin = useSelectedPersonCollectionLogin();

    const selectedCollection = useSelectedPersonCollection(
      (login) => personsEmotesCollectionsService.get(login),
      selectedLogin.state,
    );

    function refreshStates() {
      return Promise.all([
        loginsToSelect.execute(),
        collectionsToSelect.execute(),
      ]);
    }

    const collectionsLoad = usePersonsCollectionsLoad((login) =>
      personsEmotesCollectionsService.load(login),
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
        await personsEmotesCollectionsService.delete(login);
        await refreshStates();
        selectedLogin.clearIfSameLogin(login);
      },
    };
  },
);

export function useSelectedUserCollectionLogin() {
  const selectedCollectionLogin = useIndexedDBKeyValue(
    "active-user-collection:login",
    "",
  );

  return {
    selectedCollectionLogin,
    ...selectedCollectionLogin,
    clear() {
      selectedCollectionLogin.state.value = "";
    },
    changeTo(login: SelectableLogin) {
      selectedCollectionLogin.state.value = login;
    },
    isEqualTo(login: SelectableLogin) {
      return selectedCollectionLogin.state.value === login;
    },
    clearIfSameLogin(login: SelectableLogin) {
      if (this.isEqualTo(login)) {
        this.clear();
      }
    },
    isEmpty: computed(() => selectedCollectionLogin.state.value === ""),
  };
}

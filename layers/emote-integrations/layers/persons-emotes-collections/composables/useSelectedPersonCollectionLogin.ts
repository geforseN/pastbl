import { computed } from "vue";
import type { SelectableLogin } from "../utils/get-person-login";
import { useIndexedDBKeyValue } from "../../../../key-value/indexed-db/composables/useIndexedDBKeyValue";

export function useSelectedPersonCollectionLogin() {
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

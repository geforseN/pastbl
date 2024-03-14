import { defineStore } from "pinia";
import { userCollectionsService } from "~/client-only/services";
import {
  isReadyUserIntegration,
  type IBasicUserEmoteCollection,
  type IUserEmoteIntegrationRecord,
} from "~/integrations";

type Login = Lowercase<string> | "";
type LoginSource = Login | IBasicUserEmoteCollection;

function getLogin(loginSource: LoginSource) {
  const login =
    typeof loginSource === "string"
      ? loginSource
      : loginSource.user.twitch.login;
  assert.ok(typeof login === "string");
  return login;
}

const stateOptions = {
  shallow: true,
  throwError: true,
  resetOnExecute: false,
};

function useSelectedLogin() {
  const selectedCollectionLogin = useIndexedDBKeyValue(
    "active-user-collection:login",
    "",
  );

  return {
    selectedCollectionLogin,
    ...selectedCollectionLogin,
    changeTo(login: Login) {
      selectedCollectionLogin.state.value = login;
    },
    isEqualTo(login: Login) {
      return selectedCollectionLogin.state.value === login;
    },
    tryRemove(login: Login) {
      if (this.isEqualTo(login)) {
        selectedCollectionLogin.state.value = "";
      }
    },
    isEmpty: computed(() => selectedCollectionLogin.state.value === ""),
  };
}

function useSelectedCollection(selectedLogin: Ref<Login>) {
  const asyncState = useAsyncState(userCollectionsService.get, null, {
    ...stateOptions,
    immediate: false,
    onError() {
      asyncState.state.value = null;
    },
  });

  const _login = computed(() => {
    const state = asyncState.state.value;
    if (!state) {
      return "";
    }
    return state.user.twitch.login;
  });

  watch(selectedLogin, async (login) => {
    assert.ok(login === toLowerCase(login));
    await asyncState.execute(0, login);
  });

  return {
    ...asyncState,
    tryRefresh(login: Login) {
      const isSameLogin = _login.value === login;
      if (isSameLogin) {
        return asyncState.execute(0, login);
      }
    },
    readyIntegrations: computed(() => {
      if (!asyncState.state.value) {
        return {};
      }
      const values = Object.values(asyncState.state.value.integrations);
      const ready = values.filter(isReadyUserIntegration);
      return ready as Partial<IUserEmoteIntegrationRecord>;
    }),
  };
}

function useCollectionsRefresh(options: {
  beforeLoadingCompleted: (login: Login) => MaybePromise<void>;
}) {
  const currentlyUpdated = ref(new Set<Login>());

  return {
    async execute(loginSource: LoginSource) {
      const login = getLogin(loginSource);
      currentlyUpdated.value.add(login);
      const collection = await userCollectionsService.refresh(login);
      await options.beforeLoadingCompleted(login);
      currentlyUpdated.value.delete(login);
      return collection;
    },
    isCurrentlyRefreshing(loginSource: LoginSource) {
      const login = getLogin(loginSource);
      return currentlyUpdated.value.has(login);
    },
  };
}

export const useUserCollectionsStore = defineStore("user-collections", () => {
  const loginsToSelect = useAsyncState(
    userCollectionsService.getAllLogins,
    [],
    stateOptions,
  );

  const collectionsToSelect = useAsyncState(
    userCollectionsService.getAll,
    [],
    stateOptions,
  );

  const selectedLogin = useSelectedLogin();

  const selectedCollection = useSelectedCollection(selectedLogin.state);

  function refreshStates() {
    return Promise.all([
      loginsToSelect.execute(),
      collectionsToSelect.execute(),
    ]);
  }

  const collectionsRefresh = useCollectionsRefresh({
    async beforeLoadingCompleted(login) {
      await refreshStates();
      await selectedCollection.tryRefresh(login);
    },
  });

  return {
    selectedLogin,
    selectCollection(loginSource: LoginSource) {
      return selectedLogin.changeTo(getLogin(loginSource));
    },
    isCollectionSelected(loginSource: LoginSource) {
      return selectedLogin.isEqualTo(getLogin(loginSource));
    },
    loginsToSelect,
    collectionsToSelect,
    selectedCollection,
    refreshCollection: collectionsRefresh.execute,
    isCollectionRefreshing: collectionsRefresh.isCurrentlyRefreshing,
    async deleteCollection(loginSource: LoginSource) {
      const login = getLogin(loginSource);
      await userCollectionsService.delete(login);
      await refreshStates();
      selectedLogin.tryRemove(login);
    },
  };
});

import { defineStore } from "pinia";
import { userCollectionsService } from "~/client-only/services";
import type {
  IBasicUserEmoteCollection,
  IUserEmoteIntegrationRecord,
} from "~/integrations";

type Login = Lowercase<string> | "";
type LoginSource = Login | IBasicUserEmoteCollection;

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
    selectLogin(login: Login) {
      selectedCollectionLogin.state.value = login;
    },
    isSelectedLogin(login: Login) {
      return selectedCollectionLogin.state.value === login;
    },
    tryRemoveLogin(login: string) {
      const isSameLoginReceived = selectedCollectionLogin.state.value === login;
      if (isSameLoginReceived) {
        selectedCollectionLogin.state.value = "";
      }
    },
  };
}

function useSelectedCollection(selectedLogin: Ref<Login>) {
  const self = useAsyncState(
    (login: Login) => {
      return userCollectionsService.get(login);
    },
    null,
    {
      ...stateOptions,
      immediate: false,
      onError() {
        self.state.value = null;
      },
    },
  );

  const _login = computed(() => {
    const state = self.state.value;
    if (!state) {
      return "";
    }
    return state.user.twitch.login;
  });

  watch(selectedLogin, async (login) => {
    assert.ok(login === toLowerCase(login));
    await self.execute(0, login);
  });

  const { execute: _, ...returnValue } = self;
  return {
    ...returnValue,
    tryRefreshCollection(login: Login) {
      const isSameLoginReceived = _login.value === login;
      if (isSameLoginReceived) {
        return self.execute(0, login);
      }
    },
  };
}

const userCollectionApi = {
  async get(login: Login) {
    assert.ok(login, "No login of user collection provided");
    const fetchedAt = Date.now();
    const collectionsRecord = await $fetch("/api/collections/users", {
      query: { nicknames: login },
    });
    return {
      ...collectionsRecord[login],
      fetchedAt,
      receivedAt: Date.now(),
    };
  },
};

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
  const {
    selectedCollectionLogin,
    isSelectedLogin,
    selectLogin,
    tryRemoveLogin,
  } = useSelectedLogin();

  const selectedCollection = useSelectedCollection(
    selectedCollectionLogin.state,
  );

  function refreshStates() {
    return Promise.all([
      loginsToSelect.execute(),
      collectionsToSelect.execute(),
    ]);
  }

  return {
    selectedCollectionLogin,
    loginsToSelect,
    collectionsToSelect,
    selectedCollection,
    readyIntegrations: computed(() => {
      if (!selectedCollection.state.value) {
        return {};
      }
      const values = Object.values(selectedCollection.state.value.integrations);
      const { ready } = groupBy(values, (integration) => integration.status);
      return ready as Partial<IUserEmoteIntegrationRecord>;
    }),
    async loadCollection(login: Login) {
      const collection = await userCollectionApi.get(login);
      await userCollectionsService.put(collection);
      await refreshStates();
      await selectedCollection.tryRefreshCollection(login);
      return collection;
    },
    async deleteCollection(login: Login) {
      await userCollectionsService.delete(login);
      await refreshStates();
      tryRemoveLogin(login);
    },
    isSelectedLogin,
    selectLogin,
  };
});

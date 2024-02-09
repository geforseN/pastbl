import { defineStore } from "pinia";
import { userCollectionsService } from "~/client-only/services";
import type { IUserEmoteIntegrationRecord } from "~/integrations";

type Login = Lowercase<string> | "";

const stateOptions = {
  shallow: true,
  throwError: true,
  resetOnExecute: false,
};

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
    tryRefresh(login: Login) {
      if (_login.value === login) {
        return self.execute(0, _login.value);
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

  const selectedCollectionLogin = useIndexedDBKeyValue(
    "active-user-collection:login",
    "",
  );

  const selectedCollection = useSelectedCollection(
    selectedCollectionLogin.state,
  );

  function updateInternalStates() {
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
      await updateInternalStates();
      await selectedCollection.tryRefresh(login);
      return collection;
    },
    async deleteCollection(login: Login) {
      await userCollectionsService.delete(login);
      await updateInternalStates();
      if (selectedCollectionLogin.state.value === login) {
        selectedCollectionLogin.state.value = "";
      }
    },
    selectCollection(login: Login) {
      selectedCollectionLogin.state.value = login;
    },
    isSelectedLogin(login: Login) {
      return selectedCollectionLogin.state.value === login;
    },
  };
});

export type SelectedUserCollectionsAsyncState = ReturnType<
  typeof useUserCollectionsStore
>["selectedCollection"];

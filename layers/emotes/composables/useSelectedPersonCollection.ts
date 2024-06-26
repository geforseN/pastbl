import type { IPersonEmoteCollection } from "~/integrations/abstract";

export function useSelectedPersonCollection(
  getCollection: (
    login: TwitchUserLogin,
  ) => Promise<IPersonEmoteCollection | null>,
  selectedLogin: Ref<SelectedLogin>,
) {
  const asyncState = useMyAsyncState(getCollection, null, {
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
    assert.ok(isLowercase(login));
    await asyncState.execute(0, login);
  });

  return {
    ...asyncState,
    executeIfSameLogin(login: SelectableLogin) {
      const isSameLogin = _login.value === login;
      if (isSameLogin) {
        return asyncState.execute(0, login);
      }
    },
    readyIntegrations: computed(() => {
      if (!asyncState.state.value) {
        return {};
      }
      const integrations = new personEmoteCollection.Integrations(
        asyncState.state.value.integrations,
      );
      const readyIntegrations = integrations.ready;
      return flatGroupBySource(readyIntegrations);
    }),
  };
}

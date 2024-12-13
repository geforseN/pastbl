import type { SelectableLogin, SelectedLogin } from "../utils/get-person-login";
import { isLowercase } from "../../../../../app/utils/string";
import { assert } from "../../../../../app/utils/assert";
import { useMyAsyncState } from "../../../../../app/composables/useAsync";
import { Default } from "../shared/types/namespace";
import type * as TPersonEmoteCollection from "../shared/types/namespace";

export function useSelectedPersonCollection(
  getCollection: (
    login: TwitchUserLogin,
  ) => Promise<TPersonEmoteCollection.Default | undefined>,
  selectedLogin: Readonly<Ref<SelectedLogin>>,
) {
  const asyncState = useMyAsyncState(getCollection, undefined, {
    immediate: false,
    onError() {
      asyncState.state.value = undefined;
    },
  });

  const _login = computed(() => {
    const state = asyncState.state.value;
    if (!state) {
      return "";
    }
    return state.person.twitch.login;
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
      const integrationsValues = Object.values(
        asyncState.state.value.integrations,
      );
      const readyIntegrations = integrationsValues.filter(
        isEmotesIntegrationReady,
      );
      const grouped = flatGroupBySource(readyIntegrations);
      return grouped;
    }),
  };
}

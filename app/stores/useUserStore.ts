import { refDebounced } from "@vueuse/core";
import { handlePreferences } from "../../layers/settings/utils/handle-preferences";
import { useCopyPastaToasts } from "../../layers/pastas/layers/chat-pasta/utils/actions/copy-pasta";
import type * as TEmoteIntegrations from "../../layers/emote-integrations/shared/types";
import { useIndexedDBKeyValue } from "../../layers/key-value/indexed-db/composables/useIndexedDBKeyValue";
import { formatMyTimeStringToMilliseconds } from "~/utils/my-time-string";
import { useCopyTextToasts } from "~/composables/useCopyText";

function useEmotesIntegrationsRefreshInterval() {
  const emotesIntegrationsRefreshInterval = useIndexedDBKeyValue(
    "emotes-integrations:refresh-interval",
    "30m",
  );

  const emotesIntegrationsRefreshMyTimeStringInterval = computed(
    /* TODO: ensure value is MyTimeString, add guard fn  */
    {
      get() {
        return emotesIntegrationsRefreshInterval.state.value;
      },
      set(value) {
        emotesIntegrationsRefreshInterval.state.value = value;
      },
    },
  );

  const emotesIntegrationsRefreshMillisecondsInterval = computed(() =>
    formatMyTimeStringToMilliseconds(
      emotesIntegrationsRefreshMyTimeStringInterval.value,
    ),
  );

  const emotesIntegrations = {
    refreshInterval: {
      myTimeString: emotesIntegrationsRefreshMyTimeStringInterval,
      milliseconds: emotesIntegrationsRefreshMillisecondsInterval,
    },
    expirationTime: {
      milliseconds: computed(
        () => Date.now() - emotesIntegrationsRefreshMillisecondsInterval.value,
      ),
    },
    isEmotesIntegrationExpired(integration: TEmoteIntegrations.Ready) {
      return (
        integration.formedAt
        < emotesIntegrations.expirationTime.milliseconds.value
      );
    },
  };

  return emotesIntegrations;
}

async function playClickSound() {
  await new Audio("/sounds/click.wav").play();
}

function useUserPreferences() {
  const copyPastaToasts = useCopyPastaToasts();
  const copyTextToasts = useCopyTextToasts();

  const userStore = useUserStore();

  const onPastaCopy = computed(() => userStore.user.pasta.oncopy.state);

  return {
    onPastaTextCopy: () =>
      handlePreferences(onPastaCopy, {
        alert() {
          copyPastaToasts.success();
        },
        sound: playClickSound,
      }),
    onTextCopy: () =>
      handlePreferences(onPastaCopy, {
        alert() {
          copyTextToasts.success();
        },
        sound: playClickSound,
      }),
  };
}

/* useUserSettingsStore */
export const useUserStore = defineStore("user", () => {
  const nicknameColor = useIndexedDBKeyValue("nickname:color", "#000000");
  const nicknameText = useIndexedDBKeyValue("nickname:value", "Kappa", {
    debounce: 1000,
  });
  const badgesCount = useIndexedDBKeyValue("badges:count", 1);
  const onPastaCopy = useIndexedDBKeyValue("pasta:oncopy", "alert");

  const debouncedNicknameColor = refDebounced(nicknameColor.state, 200);

  const userSession = useUserSession();

  const user = {
    nickname: {
      color: nicknameColor,
      text: nicknameText,
    },
    nickname_: computed(() => {
      if (!userSession.loggedIn.value) {
        return nicknameText.state.value;
      }
      return (
        userSession.user.value?.twitch.nickname || nicknameText.state.value
      );
    }),
    badges: {
      count: badgesCount,
    },
    pasta: {
      oncopy: onPastaCopy,
    },
    debounced: {
      nickname: {
        color: debouncedNicknameColor,
      },
    },
  };

  const pastasWorkMode = usePastasWorkMode("local", {
    isLoggedIn: userSession.loggedIn,
    isOnline: readonly(useOnline()),
  });

  const copyTextToasts = useCopyTextToasts();
  const userPreferences = useUserPreferences();

  const copyText = useTextCopy({
    onFail() {
      copyTextToasts.failure("default");
    },
  });

  const emotesIntegrationsRefreshInterval
    = useEmotesIntegrationsRefreshInterval();

  const selectedTabNameAsCookie = useCookie<PastasWorkMode>("selected-tab-key", {
    default: () => "local",
  });
  const {
    state: selectedTabName,
  } = useIndexedDBKeyValue(
    "app:selected-tab-key",
    selectedTabNameAsCookie.value,
    {
      onUpdated: (value) => {
        selectedTabNameAsCookie.value = value;
      },
    },
  );

  return {
    selectedTabName,
    emotesIntegrationsRefreshInterval,
    user,
    userPreferences,
    userSession,
    pastasWorkMode,
    async copyText(text: string, options?: UseTextCopyOptions) {
      return await copyText(text, {
        ...options,
        onSuccess: options?.onSuccess ?? userPreferences.onTextCopy,
      });
    },
  };
});

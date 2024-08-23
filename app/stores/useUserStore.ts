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

export const useUserStore = /* useSettingsStore */ defineStore("user", () => {
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

  return {
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

async function playClickSound() {
  await new Audio("/sounds/click.wav").play();
}

export const useUserStore = defineStore("user", () => {
  const nicknameColor = useIndexedDBKeyValue("nickname:color", "#000000");
  const nicknameText = useIndexedDBKeyValue("nickname:value", "Kappa", {
    debounce: 1000,
  });
  const badgesCount = useIndexedDBKeyValue("badges:count", 1);
  const pastaOncopy = useIndexedDBKeyValue("pasta:oncopy", "alert");

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
      oncopy: pastaOncopy,
    },
    debounced: {
      nickname: {
        color: debouncedNicknameColor,
      },
    },
  };

  const toast = useMyToast();

  const pastasWorkMode = usePastasWorkMode("client", {
    isLoggedIn: userSession.loggedIn,
    isOnline: readonly(useOnline()),
  });

  const preferences = {
    onPastaTextCopy() {
      return handlePreferences(pastaOncopy.state, {
        alert() {
          toast.notify("success", "pastaCopied");
        },
        sound: playClickSound,
      });
    },
    onTextCopy() {
      return handlePreferences(pastaOncopy.state, {
        alert() {
          toast.notify("success", "textCopied");
        },
        sound: playClickSound,
      });
    },
  };

  const pastasStore = usePastasStore();

  const copyText = useCopyText({
    onFail() {
      toast.notify("failure", "copyText__genericFail");
    },
  });

  return {
    pastasWorkMode,
    preferences,
    user,
    async copyPasta(pasta: OmegaPasta) {
      await copyText(pasta.text, {
        async onSuccess() {
          preferences.onPastaTextCopy();
          await pastasStore.patchPastaLastCopied(pasta);
        },
      });
    },
    async copyText(text: string) {
      await copyText(text, { onSuccess: preferences.onTextCopy });
    },
  };
});

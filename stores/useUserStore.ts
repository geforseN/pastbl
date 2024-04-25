async function playClickSound() {
  await new Audio("/sounds/click.wav").play();
}

export const useUserStore = defineStore("user", () => {
  const nicknameColor = useIndexedDBKeyValue("nickname:color", "#000000");
  const nicknameText = useIndexedDBKeyValue("nickname:value", "Kappa", {
    debounce: 1_000,
  });
  const badgesCount = useIndexedDBKeyValue("badges:count", 1);
  const pastaOncopy = useIndexedDBKeyValue("pasta:oncopy", "alert");

  const debouncedNicknameColor = refDebounced(nicknameColor.state, 200);

  const user = {
    nickname: {
      color: nicknameColor,
      text: nicknameText,
    },
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

  const formCollapse = useFormCollapse();

  const pastasWorkMode = usePastasWorkMode(
    "server",
    useUserSession(),
    useOnline(),
  );

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
    formCollapse,
    preferences,
    user,
    async copyPasta(pasta: IDBMegaPasta) {
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
